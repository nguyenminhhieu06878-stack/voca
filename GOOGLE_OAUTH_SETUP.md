# Hướng dẫn Setup Google OAuth cho Node.js/Express

## Tổng quan
Hướng dẫn này giúp bạn setup Google OAuth authentication cho ứng dụng Node.js/Express với Passport.js và Prisma.

## Bước 1: Cài đặt Dependencies

```bash
npm install passport passport-google-oauth20 express-session
```

## Bước 2: Tạo Google OAuth Credentials

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Vào **APIs & Services > Credentials**
4. Click **Create Credentials > OAuth 2.0 Client IDs**
5. Chọn **Web application**
6. Cấu hình:
   - **Authorized JavaScript origins**: 
     ```
     http://localhost:3000
     http://localhost:5001
     ```
   - **Authorized redirect URIs**:
     ```
     http://localhost:5001/api/auth/google/callback
     ```
7. Lưu **Client ID** và **Client Secret**

## Bước 3: Cấu hình Environment Variables

Tạo file `.env`:

```env
# Google OAuth (get from console.cloud.google.com)
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_CALLBACK_URL=http://localhost:5001/api/auth/google/callback

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# Server
PORT=5001
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## Bước 4: Tạo Passport Configuration

Tạo file `src/config/passport.js`:

```javascript
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

console.log('🔧 Configuring Google OAuth strategy...');

passport.use('google', new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  async (accessToken, refreshToken, profile, done) => {
    console.log('🔐 Google OAuth callback for:', profile.displayName);
    try {
      let user = await prisma.user.findUnique({
        where: { email: profile.emails[0].value },
      });

      if (user) {
        if (!user.googleId) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { googleId: profile.id },
          });
        }
      } else {
        user = await prisma.user.create({
          data: {
            email: profile.emails[0].value,
            name: profile.displayName,
            googleId: profile.id,
            password: '',
            role: 'student',
          },
        });
      }

      return done(null, user);
    } catch (error) {
      console.error('❌ Google OAuth error:', error);
      return done(error, null);
    }
  }
));

console.log('✅ Google OAuth strategy registered successfully');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
```

## Troubleshooting

### Lỗi "Unknown authentication strategy 'google'"
- Đảm bảo `dotenv.config()` được gọi TRƯỚC khi require passport
- Kiểm tra environment variables đã được set
- Đảm bảo passport strategy được register với tên đúng

### Lỗi "invalid_client"
- Kiểm tra Client ID và Client Secret trong Google Cloud Console
- Đảm bảo Authorized redirect URIs chính xác
- Kiểm tra Authorized JavaScript origins

## AI Model Update (April 2026)

### GROQ API Model Fix
Model `llama-3.1-70b-versatile` đã bị deprecated. Cập nhật sang model mới:

```javascript
// Trong groqService.js
model: 'llama-3.3-70b-versatile' // Updated model
```

### Các model hiện tại được hỗ trợ:
- `llama-3.3-70b-versatile` - Production ready
- `llama-3.1-8b-instant` - Faster, smaller model
- `openai/gpt-oss-120b` - Alternative option

---

**Tác giả**: Kiro AI Assistant  
**Ngày cập nhật**: April 8, 2026  
**Version**: 1.1