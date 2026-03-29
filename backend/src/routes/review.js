const express = require('express');
const prisma = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get review items for user (words that need review - score < 80)
router.get('/items', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = { 
      userId: req.user.id,
      needsReview: true
    };

    if (category) {
      where.vocabulary = {
        category: category
      };
    }

    const [reviewItems, total] = await Promise.all([
      prisma.reviewItem.findMany({
        where,
        include: {
          vocabulary: {
            select: {
              word: true,
              translation: true,
              category: true,
              phonetic: true,
              type: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.reviewItem.count({ where })
    ]);

    res.json({
      reviewItems,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get review items error:', error);
    res.status(500).json({ error: 'Failed to fetch review items' });
  }
});

// Get review statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const [
      totalReviewItems,
      completedReviews,
      averageAttempts,
      recentReviews
    ] = await Promise.all([
      // Total items needing review
      prisma.reviewItem.count({ 
        where: { userId, needsReview: true } 
      }),
      
      // Completed reviews (no longer need review)
      prisma.reviewItem.count({ 
        where: { userId, needsReview: false } 
      }),
      
      // Average attempts
      prisma.reviewItem.aggregate({
        where: { userId },
        _avg: { attempts: true }
      }),
      
      // Recent 7 days reviews
      prisma.practice.count({
        where: {
          userId,
          mode: 'review',
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ]);

    res.json({
      totalReviewItems,
      completedReviews,
      averageAttempts: Math.round((averageAttempts._avg.attempts || 0) * 100) / 100,
      recentReviews
    });
  } catch (error) {
    console.error('Get review stats error:', error);
    res.status(500).json({ error: 'Failed to fetch review statistics' });
  }
});

// Update or create review item based on practice result
router.post('/update-from-practice', authenticateToken, async (req, res) => {
  try {
    const { vocabularyId, score, mode } = req.body;

    if (!vocabularyId || score === undefined) {
      return res.status(400).json({ error: 'Vocabulary ID and score are required' });
    }

    // Only process practice mode (not quiz)
    if (mode !== 'practice') {
      return res.json({ message: 'Not a practice session, no review update needed' });
    }

    const existingReviewItem = await prisma.reviewItem.findUnique({
      where: {
        userId_vocabularyId: {
          userId: req.user.id,
          vocabularyId: vocabularyId
        }
      }
    });

    if (score < 80) {
      // Score < 80: Add/update review item
      if (existingReviewItem) {
        // Update existing review item
        await prisma.reviewItem.update({
          where: { id: existingReviewItem.id },
          data: {
            lastScore: score,
            needsReview: true,
            updatedAt: new Date()
          }
        });
      } else {
        // Create new review item
        await prisma.reviewItem.create({
          data: {
            userId: req.user.id,
            vocabularyId: vocabularyId,
            lastScore: score,
            attempts: 1,
            needsReview: true
          }
        });
      }
    } else {
      // Score >= 80: Remove from review if exists
      if (existingReviewItem) {
        await prisma.reviewItem.update({
          where: { id: existingReviewItem.id },
          data: {
            lastScore: score,
            needsReview: false,
            updatedAt: new Date()
          }
        });
      }
    }

    res.json({ message: 'Review item updated successfully' });
  } catch (error) {
    console.error('Update review item error:', error);
    res.status(500).json({ error: 'Failed to update review item' });
  }
});

// Handle review practice (when user practices a review item)
router.post('/practice-review', authenticateToken, async (req, res) => {
  try {
    const { vocabularyId, score } = req.body;

    if (!vocabularyId || score === undefined) {
      return res.status(400).json({ error: 'Vocabulary ID and score are required' });
    }

    const reviewItem = await prisma.reviewItem.findUnique({
      where: {
        userId_vocabularyId: {
          userId: req.user.id,
          vocabularyId: vocabularyId
        }
      }
    });

    if (!reviewItem) {
      return res.status(404).json({ error: 'Review item not found' });
    }

    // Update review item
    const updatedReviewItem = await prisma.reviewItem.update({
      where: { id: reviewItem.id },
      data: {
        lastScore: score,
        attempts: reviewItem.attempts + 1,
        needsReview: score < 80, // Remove from review if score >= 80
        updatedAt: new Date()
      }
    });

    res.json({ 
      message: 'Review practice completed',
      reviewItem: updatedReviewItem,
      needsReview: score < 80
    });
  } catch (error) {
    console.error('Practice review error:', error);
    res.status(500).json({ error: 'Failed to process review practice' });
  }
});

module.exports = router;