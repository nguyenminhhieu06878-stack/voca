const express = require('express');
const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          practices: true
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // Check if email is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id: req.user.id }
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email is already taken' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Change password
router.put('/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedNewPassword }
    });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Get user dashboard data
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [
      totalPractices,
      recentPractices,
      averageScore,
      streakData,
      categoryProgress
    ] = await Promise.all([
      // Total practices count
      prisma.practice.count({ where: { userId } }),
      
      // Recent practices (last 5)
      prisma.practice.findMany({
        where: { userId },
        include: {
          vocabulary: {
            select: { word: true, translation: true, category: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      
      // Average score
      prisma.practice.aggregate({
        where: { userId },
        _avg: { score: true }
      }),
      
      // Practice streak (last 7 days)
      prisma.practice.findMany({
        where: {
          userId,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        },
        select: { createdAt: true },
        orderBy: { createdAt: 'desc' }
      }),
      
      // Category progress
      prisma.$queryRaw`
        SELECT 
          v.category,
          COUNT(*) as total_practices,
          AVG(p.score) as avg_score,
          SUM(CASE WHEN p.isCorrect = 1 THEN 1 ELSE 0 END) as correct_count
        FROM practices p
        JOIN vocabulary v ON p.vocabularyId = v.id
        WHERE p.userId = ${userId}
        GROUP BY v.category
        ORDER BY total_practices DESC
      `
    ]);

    // Calculate streak
    const today = new Date();
    const streakDays = new Set();
    streakData.forEach(practice => {
      const practiceDate = new Date(practice.createdAt).toDateString();
      streakDays.add(practiceDate);
    });

    res.json({
      totalPractices,
      averageScore: Math.round((averageScore._avg.score || 0) * 100) / 100,
      currentStreak: streakDays.size,
      recentPractices,
      categoryProgress: categoryProgress.map(cat => ({
        category: cat.category,
        totalPractices: Number(cat.total_practices),
        averageScore: Math.round(Number(cat.avg_score) * 100) / 100,
        accuracy: Math.round((Number(cat.correct_count) / Number(cat.total_practices)) * 100)
      }))
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

module.exports = router;