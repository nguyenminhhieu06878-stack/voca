const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const prisma = require('../config/database');
const groqService = require('../services/groqService');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Configure multer for audio uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/audio');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `audio-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /wav|mp3|m4a|webm|ogg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'));
    }
  }
});

// Practice pronunciation
router.post('/analyze', authenticateToken, upload.single('audio'), async (req, res) => {
  try {
    const { vocabularyId, mode = 'practice', quizSessionId } = req.body;
    const audioFile = req.file;

    console.log('🎯 Practice analyze request:', { 
      vocabularyId, 
      mode, 
      quizSessionId,
      audioFile: audioFile?.filename,
      audioSize: audioFile?.size,
      audioPath: audioFile?.path
    });

    if (!vocabularyId || !audioFile) {
      return res.status(400).json({ error: 'Vocabulary ID and audio file are required' });
    }

    // Get vocabulary word
    const vocabulary = await prisma.vocabulary.findUnique({
      where: { id: vocabularyId }
    });

    if (!vocabulary) {
      return res.status(404).json({ error: 'Vocabulary not found' });
    }

    console.log('Processing word:', vocabulary.word);

    try {
      // Step 1: Speech to Text
      console.log('🎤 Starting speech-to-text...');
      const transcription = await groqService.speechToText(audioFile.path);
      console.log('📝 Transcription result:', transcription);
      
      // Step 2: Analyze pronunciation
      console.log('🤖 Starting pronunciation analysis...');
      const analysis = await groqService.analyzePronunciation(vocabulary.word, transcription);
      console.log('📊 Analysis result:', analysis);

      // Step 3: Save practice record
      const practiceData = {
        userId: req.user.id,
        vocabularyId: vocabularyId,
        transcription: transcription,
        score: analysis.score,
        feedback: analysis.feedback,
        isCorrect: analysis.isCorrect,
        audioPath: audioFile.filename,
        mode: mode
      };

      // Add quizSessionId if provided
      if (quizSessionId) {
        practiceData.quizSessionId = quizSessionId;
      }

      const practice = await prisma.practice.create({
        data: practiceData,
        include: {
          vocabulary: {
            select: {
              word: true,
              translation: true,
              phonetic: true
            }
          }
        }
      });

      // Step 4: Update review items if this is a practice session
      if (mode === 'practice') {
        try {
          const existingReviewItem = await prisma.reviewItem.findUnique({
            where: {
              userId_vocabularyId: {
                userId: req.user.id,
                vocabularyId: vocabularyId
              }
            }
          });

          if (analysis.score < 80) {
            // Score < 80: Add/update review item
            if (existingReviewItem) {
              await prisma.reviewItem.update({
                where: { id: existingReviewItem.id },
                data: {
                  lastScore: analysis.score,
                  needsReview: true,
                  updatedAt: new Date()
                }
              });
            } else {
              await prisma.reviewItem.create({
                data: {
                  userId: req.user.id,
                  vocabularyId: vocabularyId,
                  lastScore: analysis.score,
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
                  lastScore: analysis.score,
                  needsReview: false,
                  updatedAt: new Date()
                }
              });
            }
          }
        } catch (reviewError) {
          console.error('Review update error:', reviewError);
          // Don't fail the main request if review update fails
        }
      }

      // Step 5: Handle review mode practice
      if (mode === 'review') {
        try {
          const reviewItem = await prisma.reviewItem.findUnique({
            where: {
              userId_vocabularyId: {
                userId: req.user.id,
                vocabularyId: vocabularyId
              }
            }
          });

          if (reviewItem) {
            await prisma.reviewItem.update({
              where: { id: reviewItem.id },
              data: {
                lastScore: analysis.score,
                attempts: reviewItem.attempts + 1,
                needsReview: analysis.score < 80,
                updatedAt: new Date()
              }
            });

            // If review score >= 80, create a new practice record with mode "practice"
            // This will update the displayed score in practice mode
            if (analysis.score >= 80) {
              await prisma.practice.create({
                data: {
                  userId: req.user.id,
                  vocabularyId: vocabularyId,
                  transcription: transcription,
                  score: analysis.score,
                  feedback: analysis.feedback,
                  isCorrect: analysis.isCorrect,
                  audioPath: audioFile.filename,
                  mode: 'practice' // Create as practice mode to update practice score
                },
              });
              console.log('✅ Created new practice record from successful review');
            }
          }
        } catch (reviewError) {
          console.error('Review practice update error:', reviewError);
        }
      }

      console.log('💾 Practice saved successfully');

      res.json({
        message: 'Pronunciation analyzed successfully',
        transcription,
        score: analysis.score,
        feedback: analysis.feedback,
        isCorrect: analysis.isCorrect,
        specificErrors: analysis.specificErrors || '',
        suggestions: analysis.suggestions || '',
        practice: {
          id: practice.id,
          vocabulary: practice.vocabulary,
          createdAt: practice.createdAt
        }
      });

    } catch (aiError) {
      console.error('AI processing error:', aiError);
      
      // Clean up uploaded file on error
      if (fs.existsSync(audioFile.path)) {
        fs.unlinkSync(audioFile.path);
      }
      
      res.status(500).json({ 
        error: 'Failed to analyze pronunciation',
        details: aiError.message 
      });
    }

  } catch (error) {
    console.error('Practice analyze error:', error);
    
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      error: 'Failed to process practice session',
      details: error.message 
    });
  }
});

// Get user's practice history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, vocabularyId, mode, category } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    console.log('🔍 Practice history request:', {
      userId: req.user.id,
      page,
      limit,
      vocabularyId,
      mode,
      category
    });

    const where = { userId: req.user.id };
    if (vocabularyId) {
      where.vocabularyId = vocabularyId;
    }
    if (mode) {
      where.mode = mode;
    }
    if (category) {
      where.vocabulary = {
        category: category
      };
    }

    const [practices, total] = await Promise.all([
      prisma.practice.findMany({
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
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.practice.count({ where })
    ]);

    console.log('📊 Practice history found:', {
      totalPractices: practices.length,
      incorrectCount: practices.filter(p => !p.isCorrect).length,
      practices: practices.slice(0, 3).map(p => ({
        id: p.id,
        score: p.score,
        isCorrect: p.isCorrect,
        word: p.vocabulary.word,
        type: p.vocabulary.type
      }))
    });

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
    console.error('Get practice history error:', error);
    res.status(500).json({ error: 'Failed to fetch practice history' });
  }
});

// Get practice statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { mode } = req.query;

    const baseWhere = { userId };
    if (mode) {
      baseWhere.mode = mode;
    }

    const [
      totalPractices,
      correctPractices,
      averageScore,
      recentPractices,
      categoryStats
    ] = await Promise.all([
      // Total practices
      prisma.practice.count({ where: baseWhere }),
      
      // Correct practices
      prisma.practice.count({ where: { ...baseWhere, isCorrect: true } }),
      
      // Average score
      prisma.practice.aggregate({
        where: baseWhere,
        _avg: { score: true }
      }),
      
      // Recent 7 days practices
      prisma.practice.count({
        where: {
          ...baseWhere,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      
      // Category statistics
      prisma.practice.findMany({
        where: baseWhere,
        select: {
          vocabularyId: true,
          score: true,
          vocabulary: {
            select: { category: true }
          }
        }
      })
    ]);

    const accuracy = totalPractices > 0 ? (correctPractices / totalPractices) * 100 : 0;

    // Process category statistics
    const categoryMap = {};
    categoryStats.forEach(practice => {
      const category = practice.vocabulary.category;
      if (!categoryMap[category]) {
        categoryMap[category] = { scores: [], count: 0 };
      }
      categoryMap[category].scores.push(practice.score);
      categoryMap[category].count++;
    });

    const processedCategoryStats = Object.entries(categoryMap).map(([category, data]) => ({
      category,
      count: data.count,
      averageScore: Math.round((data.scores.reduce((a, b) => a + b, 0) / data.scores.length) * 100) / 100
    }));

    res.json({
      totalPractices,
      correctPractices,
      accuracy: Math.round(accuracy * 100) / 100,
      averageScore: Math.round((averageScore._avg.score || 0) * 100) / 100,
      recentPractices,
      categoryStats: processedCategoryStats,
      improvement: {
        message: accuracy > 80 ? 'Excellent progress!' : accuracy > 60 ? 'Good progress!' : 'Keep practicing!'
      }
    });
  } catch (error) {
    console.error('Get practice stats error:', error);
    res.status(500).json({ error: 'Failed to fetch practice statistics' });
  }
});

// Get practice by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const practice = await prisma.practice.findFirst({
      where: { 
        id,
        userId: req.user.id // Ensure user can only access their own practices
      },
      include: {
        vocabulary: {
          select: {
            word: true,
            translation: true,
            category: true,
            phonetic: true,
            example: true
          }
        }
      }
    });

    if (!practice) {
      return res.status(404).json({ error: 'Practice not found' });
    }

    res.json({ practice });
  } catch (error) {
    console.error('Get practice by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch practice' });
  }
});

// Get latest scores for vocabulary words (for practice page display)
router.post('/latest-scores', authenticateToken, async (req, res) => {
  try {
    const { vocabularyIds } = req.body;
    
    if (!vocabularyIds || !Array.isArray(vocabularyIds)) {
      return res.status(400).json({ error: 'vocabularyIds array is required' });
    }

    // Get the highest score for each vocabulary word for this user
    const latestScores = {};
    
    for (const vocabularyId of vocabularyIds) {
      const latestPractice = await prisma.practice.findFirst({
        where: {
          userId: req.user.id,
          vocabularyId: vocabularyId,
          mode: 'practice' // Only consider practice mode scores for display
        },
        orderBy: {
          score: 'desc' // Get highest score
        },
        select: {
          score: true,
          isCorrect: true,
          createdAt: true
        }
      });

      if (latestPractice) {
        latestScores[vocabularyId] = {
          score: latestPractice.score,
          isCorrect: latestPractice.isCorrect,
          timestamp: latestPractice.createdAt.getTime()
        };
      }
    }

    res.json({ latestScores });
  } catch (error) {
    console.error('Get latest scores error:', error);
    res.status(500).json({ error: 'Failed to fetch latest scores' });
  }
});

module.exports = router;