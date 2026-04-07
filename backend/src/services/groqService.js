const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

class GroqService {
  constructor() {
    this.apiKey = process.env.GROQ_API_KEY;
    this.baseURL = process.env.GROQ_API_URL;
    
    if (!this.apiKey) {
      console.warn('⚠️  GROQ_API_KEY not found. AI features will not work.');
    }
  }

  // Speech to Text using Whisper
  async speechToText(audioFilePath) {
    try {
      console.log('🎵 Processing audio file:', audioFilePath);
      
      if (!this.apiKey) {
        console.error('❌ Groq API key not configured');
        throw new Error('Groq API key not configured');
      }

      // Check if file exists
      if (!fs.existsSync(audioFilePath)) {
        console.error('❌ Audio file not found:', audioFilePath);
        throw new Error('Audio file not found');
      }

      const fileStats = fs.statSync(audioFilePath);
      console.log('📁 File size:', fileStats.size, 'bytes');

      const formData = new FormData();
      formData.append('file', fs.createReadStream(audioFilePath));
      formData.append('model', 'whisper-large-v3');
      formData.append('language', 'en');
      formData.append('response_format', 'json');

      console.log('🚀 Sending request to Groq Whisper API...');
      const response = await axios.post(
        `${this.baseURL}/audio/transcriptions`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            ...formData.getHeaders(),
          },
          timeout: 30000, // 30 second timeout
        }
      );

      console.log('✅ Whisper API response received');
      const transcription = response.data.text.trim().toLowerCase();
      console.log('📝 Final transcription:', transcription);
      
      return transcription;
    } catch (error) {
      console.error('❌ Groq Speech-to-Text error:', error.response?.data || error.message);
      
      // Return fallback transcription for testing
      if (error.message.includes('API key') || error.response?.status === 401) {
        return 'fallback transcription';
      }
      
      console.log('🔄 Using fallback transcription due to error');
      return 'audio transcription failed';
    }
  }

  // Analyze pronunciation using Llama
  async analyzePronunciation(targetWord, transcribedText) {
    try {
      console.log('🎯 Analyzing pronunciation:', { targetWord, transcribedText });
      
      if (!this.apiKey) {
        console.error('❌ Groq API key not configured for analysis');
        throw new Error('Groq API key not configured');
      }

      const prompt = `
You are a professional English pronunciation teacher. Analyze the student's pronunciation and provide detailed feedback:

Target word/phrase: "${targetWord}"
Student pronunciation: "${transcribedText}"

Analyze:
1. Compare each sound/syllable
2. Identify specific pronunciation errors
3. Check stress patterns (for multi-syllable words)
4. Evaluate overall clarity

Return ONLY a valid JSON object with this exact format:
{
  "score": [number from 0-100],
  "isCorrect": [true/false],
  "feedback": "[detailed feedback in Vietnamese with specific errors and corrections]",
  "specificErrors": "[list specific sound errors if any]",
  "suggestions": "[pronunciation tips in Vietnamese]"
}

Scoring rules:
- 95-100: Perfect pronunciation
- 85-94: Excellent, very minor issues
- 70-84: Good, some sound errors
- 55-69: Fair, multiple errors need attention
- 40-54: Poor, significant pronunciation issues
- 0-39: Needs major improvement

Feedback guidelines:
- Write in Vietnamese
- Be encouraging but specific about errors
- Point out which sounds are incorrect
- Explain how to correct the pronunciation
- Use appropriate emoji (🎉 for excellent, 👍 for good, 💪 for needs work)
- For phrases/sentences, also check rhythm and intonation

Example errors to identify:
- Vowel sounds (a, e, i, o, u)
- Consonant sounds (th, r, l, v, w, etc.)
- Silent letters
- Word stress
- Linking sounds in phrases
`;

      console.log('🚀 Sending request to Groq Llama API...');
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: 'llama-3.3-70b-versatile', // Updated to current supported model
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 500,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30 second timeout
        }
      );

      console.log('✅ Llama API response received');
      const content = response.data.choices[0].message.content;
      console.log('📄 Raw AI response:', content);
      
      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('❌ No JSON found in AI response');
        throw new Error('Invalid AI response format');
      }

      console.log('🔍 Extracted JSON:', jsonMatch[0]);
      const result = JSON.parse(jsonMatch[0]);
      console.log('✅ Parsed result:', result);
      
      // Validate response structure
      if (typeof result.score !== 'number' || typeof result.isCorrect !== 'boolean' || !result.feedback) {
        console.error('❌ Invalid AI response structure:', result);
        throw new Error('Invalid AI response structure');
      }

      // Ensure we have the new fields, fallback if not provided
      if (!result.specificErrors) result.specificErrors = '';
      if (!result.suggestions) result.suggestions = '';

      console.log('🎉 Analysis complete:', { score: result.score, isCorrect: result.isCorrect });
      return result;
    } catch (error) {
      console.error('❌ Groq Analysis error:', error.response?.data || error.message);
      console.error('Stack trace:', error.stack);
      
      // Fallback analysis
      console.log('🔄 Using fallback analysis');
      const similarity = this.calculateSimilarity(targetWord.toLowerCase(), transcribedText.toLowerCase());
      const fallbackResult = {
        score: Math.round(similarity * 100),
        isCorrect: similarity > 0.8,
        feedback: similarity > 0.8 
          ? `Tuyệt vời! Bạn đã phát âm từ "${targetWord}" rất chính xác! 🎉`
          : `Bạn đã cố gắng rất tốt! Hãy thử phát âm từ "${targetWord}" rõ ràng hơn nhé! 💪`,
        specificErrors: '',
        suggestions: 'Hãy nghe kỹ phát âm chuẩn và luyện tập thêm.'
      };
      console.log('📊 Fallback result:', fallbackResult);
      return fallbackResult;
    }
  }

  // Simple similarity calculation as fallback
  calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }
}

module.exports = new GroqService();