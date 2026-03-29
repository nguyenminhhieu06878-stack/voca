const express = require('express');
const prisma = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Get dashboard statistics
router.get('/dashboard', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [
      totalUsers,
      totalVocabulary,
      totalPractices,
      recentUsers,
      topPerformers,
      practicesByCategory,
      dailyStats
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      
      // Total vocabulary
      prisma.vocabulary.count(),
      
      // Total practices
      prisma.practice.count(),
      
      // Recent users (last 7 days)
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      
      // Top performers
      prisma.practice.groupBy({
        by: ['userId'],
        _avg: { score: true },
        _count: { userId: true },
        having: {
          userId: {
            _count: {
              gte: 5
            }
          }
        },
        orderBy: {
          _avg: {
            score: 'desc'
          }
        },
        take: 10
      }),
      
      // Practices by category
      prisma.$queryRaw`
        SELECT 
          v.category,
          COUNT(*) as total_practices,
          AVG(p.score) as avg_score,
          SUM(CASE WHEN p.isCorrect = 1 THEN 1 ELSE 0 END) as correct_count
        FROM practices p
        JOIN vocabulary v ON p.vocabularyId = v.id
        GROUP BY v.category
        ORDER BY total_practices DESC
      `,
      
      // Daily stats (last 30 days)
      prisma.$queryRaw`
        SELECT 
          DATE(createdAt) as date,
          COUNT(*) as practices_count
        FROM practices
        WHERE createdAt >= datetime('now', '-30 days')
        GROUP BY DATE(createdAt)
        ORDER BY date DESC
      `
    ]);

    // Get user details for top performers
    const topPerformerIds = topPerformers.map(p => p.userId);
    const topUsers = await prisma.user.findMany({
      where: { id: { in: topPerformerIds } },
      select: { id: true, name: true, email: true }
    });

    const topPerformersWithDetails = topPerformers.map(performer => {
      const user = topUsers.find(u => u.id === performer.userId);
      return {
        ...user,
        averageScore: Math.round(performer._avg.score),
        practiceCount: performer._count.userId
      };
    });

    res.json({
      overview: {
        totalUsers,
        totalVocabulary,
        totalPractices,
        recentUsers
      },
      topPerformers: topPerformersWithDetails,
      practicesByCategory: practicesByCategory.map(cat => ({
        category: cat.category,
        totalPractices: Number(cat.total_practices),
        averageScore: Math.round(Number(cat.avg_score)),
        accuracy: Math.round((Number(cat.correct_count) / Number(cat.total_practices)) * 100)
      })),
      dailyStats: dailyStats.map(stat => ({
        date: stat.date,
        practices: Number(stat.practices_count)
      }))
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Get all users with pagination
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    } : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          _count: {
            select: {
              practices: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user details
router.get('/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        practices: {
          include: {
            vocabulary: {
              select: {
                word: true,
                translation: true,
                category: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 20
        },
        _count: {
          select: {
            practices: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate user stats
    const totalPractices = user._count.practices;
    const correctPractices = user.practices.filter(p => p.isCorrect).length;
    const averageScore = totalPractices > 0 
      ? user.practices.reduce((sum, p) => sum + p.score, 0) / totalPractices 
      : 0;

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      stats: {
        totalPractices,
        correctPractices,
        accuracy: totalPractices > 0 ? Math.round((correctPractices / totalPractices) * 100) : 0,
        averageScore: Math.round(averageScore)
      },
      recentPractices: user.practices
    });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});

// Update user role
router.put('/users/:id/role', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['student', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    res.json({
      message: 'User role updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// Delete user
router.delete('/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting yourself
    if (id === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    await prisma.user.delete({
      where: { id }
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Get all vocabulary with management info
router.get('/vocabulary', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, category = '', search = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { word: { contains: search, mode: 'insensitive' } },
        { translation: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [vocabulary, total] = await Promise.all([
      prisma.vocabulary.findMany({
        where,
        include: {
          _count: {
            select: {
              practices: true
            }
          }
        },
        orderBy: { word: 'asc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.vocabulary.count({ where })
    ]);

    res.json({
      vocabulary,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get vocabulary error:', error);
    res.status(500).json({ error: 'Failed to fetch vocabulary' });
  }
});

// Add new vocabulary
router.post('/vocabulary', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { word, translation, category, difficulty, phonetic, example, audioUrl } = req.body;

    if (!word || !translation || !category) {
      return res.status(400).json({ error: 'Word, translation, and category are required' });
    }

    const vocabulary = await prisma.vocabulary.create({
      data: {
        word: word.toLowerCase(),
        translation,
        category,
        difficulty: difficulty || 'easy',
        phonetic,
        example,
        audioUrl
      }
    });

    res.status(201).json({
      message: 'Vocabulary added successfully',
      vocabulary
    });
  } catch (error) {
    console.error('Add vocabulary error:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Word already exists' });
    }
    res.status(500).json({ error: 'Failed to add vocabulary' });
  }
});

// Update vocabulary
router.put('/vocabulary/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { word, translation, category, difficulty, phonetic, example, audioUrl } = req.body;

    const vocabulary = await prisma.vocabulary.update({
      where: { id },
      data: {
        word: word?.toLowerCase(),
        translation,
        category,
        difficulty,
        phonetic,
        example,
        audioUrl
      }
    });

    res.json({
      message: 'Vocabulary updated successfully',
      vocabulary
    });
  } catch (error) {
    console.error('Update vocabulary error:', error);
    res.status(500).json({ error: 'Failed to update vocabulary' });
  }
});

// Delete vocabulary
router.delete('/vocabulary/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.vocabulary.delete({
      where: { id }
    });

    res.json({ message: 'Vocabulary deleted successfully' });
  } catch (error) {
    console.error('Delete vocabulary error:', error);
    res.status(500).json({ error: 'Failed to delete vocabulary' });
  }
});

// Get all practices with filters
router.get('/practices', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, userId = '', category = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (userId) where.userId = userId;
    if (category) {
      where.vocabulary = { category };
    }

    const [practices, total] = await Promise.all([
      prisma.practice.findMany({
        where,
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          },
          vocabulary: {
            select: {
              word: true,
              translation: true,
              category: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.practice.count({ where })
    ]);

    res.json({
      practices,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get practices error:', error);
    res.status(500).json({ error: 'Failed to fetch practices' });
  }
});

module.exports = router;

// Get quiz sessions
router.get('/quiz-sessions', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, userId = '', practiceMode = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (userId) where.userId = userId;
    if (practiceMode) where.practiceMode = practiceMode;

    const [sessions, total] = await Promise.all([
      prisma.quizSession.findMany({
        where,
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.quizSession.count({ where })
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

// Get analytics data
router.get('/analytics', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [
      practicesByDay,
      practicesByCategory,
      scoreDistribution,
      userGrowth,
      topCategories,
      averageScoreByCategory
    ] = await Promise.all([
      // Practices by day (last 30 days)
      prisma.$queryRaw`
        SELECT 
          DATE(createdAt) as date,
          COUNT(*) as count
        FROM practices
        WHERE createdAt >= datetime('now', '-30 days')
        GROUP BY DATE(createdAt)
        ORDER BY date ASC
      `,
      
      // Practices by category
      prisma.$queryRaw`
        SELECT 
          v.category,
          COUNT(*) as count
        FROM practices p
        JOIN vocabulary v ON p.vocabularyId = v.id
        GROUP BY v.category
      `,
      
      // Score distribution
      prisma.$queryRaw`
        SELECT 
          SUM(CASE WHEN score >= 90 THEN 1 ELSE 0 END) as excellent,
          SUM(CASE WHEN score >= 70 AND score < 90 THEN 1 ELSE 0 END) as good,
          SUM(CASE WHEN score >= 50 AND score < 70 THEN 1 ELSE 0 END) as fair,
          SUM(CASE WHEN score < 50 THEN 1 ELSE 0 END) as poor
        FROM practices
      `,
      
      // User growth (last 30 days)
      prisma.$queryRaw`
        SELECT 
          DATE(createdAt) as date,
          COUNT(*) as count
        FROM users
        WHERE createdAt >= datetime('now', '-30 days')
        GROUP BY DATE(createdAt)
        ORDER BY date ASC
      `,
      
      // Top categories
      prisma.$queryRaw`
        SELECT 
          v.category,
          COUNT(*) as count
        FROM practices p
        JOIN vocabulary v ON p.vocabularyId = v.id
        GROUP BY v.category
        ORDER BY count DESC
        LIMIT 7
      `,
      
      // Average score by category
      prisma.$queryRaw`
        SELECT 
          v.category,
          AVG(p.score) as avg_score
        FROM practices p
        JOIN vocabulary v ON p.vocabularyId = v.id
        GROUP BY v.category
        ORDER BY avg_score DESC
      `
    ]);

    res.json({
      practicesByDay: practicesByDay.map(d => ({
        date: d.date,
        count: Number(d.count)
      })),
      practicesByCategory: practicesByCategory.map(c => ({
        category: c.category,
        count: Number(c.count)
      })),
      scoreDistribution: {
        excellent: Number(scoreDistribution[0].excellent),
        good: Number(scoreDistribution[0].good),
        fair: Number(scoreDistribution[0].fair),
        poor: Number(scoreDistribution[0].poor)
      },
      userGrowth: userGrowth.map(d => ({
        date: d.date,
        count: Number(d.count)
      })),
      topCategories: topCategories.map(c => ({
        category: c.category,
        count: Number(c.count)
      })),
      averageScoreByCategory: averageScoreByCategory.map(c => ({
        category: c.category,
        avgScore: Math.round(Number(c.avg_score))
      }))
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Bulk import vocabulary
router.post('/vocabulary/bulk-import', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { vocabulary } = req.body;

    if (!Array.isArray(vocabulary) || vocabulary.length === 0) {
      return res.status(400).json({ error: 'Invalid vocabulary data' });
    }

    const results = await Promise.allSettled(
      vocabulary.map(item => 
        prisma.vocabulary.create({
          data: {
            word: item.word.toLowerCase(),
            translation: item.translation,
            category: item.category,
            difficulty: item.difficulty || 'easy',
            phonetic: item.phonetic || null,
            example: item.example || null,
            audioUrl: item.audioUrl || null
          }
        })
      )
    );

    const imported = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    res.json({
      message: 'Bulk import completed',
      imported,
      failed,
      total: vocabulary.length
    });
  } catch (error) {
    console.error('Bulk import error:', error);
    res.status(500).json({ error: 'Failed to import vocabulary' });
  }
});

// Export vocabulary
router.get('/export/vocabulary', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const vocabulary = await prisma.vocabulary.findMany({
      select: {
        word: true,
        translation: true,
        category: true,
        difficulty: true,
        phonetic: true,
        example: true,
        audioUrl: true,
        createdAt: true
      },
      orderBy: { word: 'asc' }
    });

    res.json(vocabulary);
  } catch (error) {
    console.error('Export vocabulary error:', error);
    res.status(500).json({ error: 'Failed to export vocabulary' });
  }
});

// Export users
router.get('/export/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            practices: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedUsers = users.map(user => ({
      name: user.name,
      email: user.email,
      role: user.role,
      totalPractices: user._count.practices,
      joinedAt: user.createdAt
    }));

    res.json(formattedUsers);
  } catch (error) {
    console.error('Export users error:', error);
    res.status(500).json({ error: 'Failed to export users' });
  }
});

// Export practices
router.get('/export/practices', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const practices = await prisma.practice.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        vocabulary: {
          select: {
            word: true,
            translation: true,
            category: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedPractices = practices.map(practice => ({
      userName: practice.user.name,
      userEmail: practice.user.email,
      word: practice.vocabulary.word,
      translation: practice.vocabulary.translation,
      category: practice.vocabulary.category,
      transcription: practice.transcription,
      score: practice.score,
      isCorrect: practice.isCorrect,
      feedback: practice.feedback,
      createdAt: practice.createdAt
    }));

    res.json(formattedPractices);
  } catch (error) {
    console.error('Export practices error:', error);
    res.status(500).json({ error: 'Failed to export practices' });
  }
});

// Delete practice
router.delete('/practices/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.practice.delete({
      where: { id }
    });

    res.json({ message: 'Practice deleted successfully' });
  } catch (error) {
    console.error('Delete practice error:', error);
    res.status(500).json({ error: 'Failed to delete practice' });
  }
});

// Delete quiz session
router.delete('/quiz-sessions/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.quizSession.delete({
      where: { id }
    });

    res.json({ message: 'Quiz session deleted successfully' });
  } catch (error) {
    console.error('Delete quiz session error:', error);
    res.status(500).json({ error: 'Failed to delete quiz session' });
  }
});
