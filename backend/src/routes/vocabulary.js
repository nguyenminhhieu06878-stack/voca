const express = require('express');
const prisma = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all vocabulary with optional filtering
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { category, difficulty, search, type } = req.query;
    
    const where = {};
    
    if (category) {
      where.category = category;
    }
    
    if (difficulty) {
      where.difficulty = difficulty;
    }
    
    if (type) {
      where.type = type;
    }
    
    if (search) {
      where.OR = [
        { word: { contains: search, mode: 'insensitive' } },
        { translation: { contains: search, mode: 'insensitive' } }
      ];
    }

    const vocabulary = await prisma.vocabulary.findMany({
      where,
      orderBy: { word: 'asc' }
    });

    res.json({ vocabulary });
  } catch (error) {
    console.error('Get vocabulary error:', error);
    res.status(500).json({ error: 'Failed to fetch vocabulary' });
  }
});

// Get vocabulary by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const vocabulary = await prisma.vocabulary.findUnique({
      where: { id }
    });

    if (!vocabulary) {
      return res.status(404).json({ error: 'Vocabulary not found' });
    }

    res.json({ vocabulary });
  } catch (error) {
    console.error('Get vocabulary by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch vocabulary' });
  }
});

// Get vocabulary categories
router.get('/meta/categories', authenticateToken, async (req, res) => {
  try {
    const categories = await prisma.vocabulary.findMany({
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' }
    });

    const categoryList = categories.map(item => item.category);
    
    res.json({ categories: categoryList });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get vocabulary statistics
router.get('/meta/stats', authenticateToken, async (req, res) => {
  try {
    const totalWords = await prisma.vocabulary.count();
    
    const categoryCounts = await prisma.vocabulary.groupBy({
      by: ['category'],
      _count: { category: true },
      orderBy: { category: 'asc' }
    });

    const difficultyLevels = await prisma.vocabulary.groupBy({
      by: ['difficulty'],
      _count: { difficulty: true },
      orderBy: { difficulty: 'asc' }
    });

    res.json({
      totalWords,
      categories: categoryCounts.map(item => ({
        name: item.category,
        count: item._count.category
      })),
      difficulties: difficultyLevels.map(item => ({
        level: item.difficulty,
        count: item._count.difficulty
      }))
    });
  } catch (error) {
    console.error('Get vocabulary stats error:', error);
    res.status(500).json({ error: 'Failed to fetch vocabulary statistics' });
  }
});

module.exports = router;