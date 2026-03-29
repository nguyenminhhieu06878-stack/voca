const express = require('express');
const prisma = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Create a new quiz session
router.post('/sessions', authenticateToken, async (req, res) => {
  try {
    const { title, category, difficulty, timeLimit, practiceMode } = req.body;

    const quizSession = await prisma.quizSession.create({
      data: {
        userId: req.user.id,
        title,
        category,
        difficulty,
        timeLimit,
        practiceMode: practiceMode || 'words'
      }
    });

    res.json({ quizSession });
  } catch (error) {
    console.error('Create quiz session error:', error);
    res.status(500).json({ error: 'Failed to create quiz session' });
  }
});

// Update quiz session with final scores
router.put('/sessions/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { totalScore, maxScore } = req.body;

    const quizSession = await prisma.quizSession.update({
      where: { 
        id,
        userId: req.user.id // Ensure user can only update their own sessions
      },
      data: {
        totalScore,
        maxScore,
        completedAt: new Date()
      }
    });

    res.json({ quizSession });
  } catch (error) {
    console.error('Update quiz session error:', error);
    res.status(500).json({ error: 'Failed to update quiz session' });
  }
});

// Get user's quiz sessions (for history)
router.get('/sessions', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [sessions, total] = await Promise.all([
      prisma.quizSession.findMany({
        where: { userId: req.user.id },
        orderBy: { completedAt: 'desc' },
        skip,
        take: parseInt(limit),
        include: {
          _count: {
            select: { practices: true }
          }
        }
      }),
      prisma.quizSession.count({ 
        where: { userId: req.user.id } 
      })
    ]);

    res.json({
      sessions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get quiz sessions error:', error);
    res.status(500).json({ error: 'Failed to fetch quiz sessions' });
  }
});

// Get quiz session details with all practices
router.get('/sessions/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const session = await prisma.quizSession.findFirst({
      where: { 
        id,
        userId: req.user.id // Ensure user can only access their own sessions
      },
      include: {
        practices: {
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
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!session) {
      return res.status(404).json({ error: 'Quiz session not found' });
    }

    res.json({ session });
  } catch (error) {
    console.error('Get quiz session details error:', error);
    res.status(500).json({ error: 'Failed to fetch quiz session details' });
  }
});

// Get quiz results by category
router.get('/results-by-category', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { practiceMode } = req.query; // Get practice mode from query params

    // Get all completed quiz sessions with their scores grouped by category
    const whereClause = { 
      userId,
      totalScore: { gt: 0 },
      maxScore: { gt: 0 }
    };

    // Filter by practice mode if provided
    if (practiceMode) {
      whereClause.practiceMode = practiceMode;
    }

    const quizResults = await prisma.quizSession.findMany({
      where: whereClause,
      select: {
        category: true,
        practiceMode: true,
        totalScore: true,
        maxScore: true,
        completedAt: true
      },
      orderBy: { completedAt: 'desc' }
    });

    // Group results by category and practice mode, calculate best percentage for each
    const categoryResults = {};
    
    quizResults.forEach(result => {
      const key = `${result.category}_${result.practiceMode}`;
      const percentage = Math.round((result.totalScore / result.maxScore) * 100);
      
      if (!categoryResults[key] || categoryResults[key].percentage < percentage) {
        categoryResults[key] = {
          category: result.category,
          practiceMode: result.practiceMode,
          percentage,
          totalScore: result.totalScore,
          maxScore: result.maxScore,
          lastAttempt: result.completedAt
        };
      }
    });

    res.json({ categoryResults: Object.values(categoryResults) });
  } catch (error) {
    console.error('Get quiz results by category error:', error);
    res.status(500).json({ error: 'Failed to fetch quiz results by category' });
  }
});

// Get quiz statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const [
      totalQuizzes,
      averageScore,
      bestScore,
      recentQuizzes
    ] = await Promise.all([
      // Total quizzes
      prisma.quizSession.count({ where: { userId } }),
      
      // Average score
      prisma.quizSession.aggregate({
        where: { userId },
        _avg: { totalScore: true }
      }),
      
      // Best score
      prisma.quizSession.aggregate({
        where: { userId },
        _max: { totalScore: true }
      }),
      
      // Recent 7 days quizzes
      prisma.quizSession.count({
        where: {
          userId,
          completedAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ]);

    res.json({
      totalQuizzes,
      averageScore: Math.round((averageScore._avg.totalScore || 0) * 100) / 100,
      bestScore: bestScore._max.totalScore || 0,
      recentQuizzes
    });
  } catch (error) {
    console.error('Get quiz stats error:', error);
    res.status(500).json({ error: 'Failed to fetch quiz statistics' });
  }
});

module.exports = router;