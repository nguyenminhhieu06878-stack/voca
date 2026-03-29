# 🎤 AI-Powered Pronunciation Learning Application

Ứng dụng học phát âm tiếng Anh hỗ trợ bởi trí tuệ nhân tạo dành cho học sinh tiểu học (6-11 tuổi).

## ✨ Tính năng chính

- 🎙️ **Ghi âm & Nhận dạng**: Sử dụng Groq Whisper API để chuyển đổi giọng nói thành văn bản
- 🤖 **Phân tích AI**: Groq Llama phân tích phát âm và đưa ra feedback chi tiết
- 📚 **Thư viện từ vựng**: Hơn 100 từ vựng phân theo chủ đề với audio mẫu
- 📊 **Theo dõi tiến độ**: Lịch sử luyện tập và thống kê chi tiết
- 🎯 **Feedback thông minh**: Phản hồi bằng tiếng Việt, thân thiện với trẻ em
- 🏆 **Hệ thống điểm số**: Chấm điểm từ 0-100 với lời khuyên cải thiện

## 🛠️ Công nghệ sử dụng

### Frontend
- **React 18 + Vite**: Framework hiện đại, build nhanh
- **TailwindCSS**: Styling responsive, thân thiện trẻ em
- **React Query + Zustand**: Quản lý data và state
- **Web Speech API**: Ghi âm giọng nói trên browser

### Backend
- **Node.js 20+ + Express**: Server API RESTful
- **Prisma ORM + SQLite**: Database local, dễ setup
- **JWT + Bcrypt**: Authentication bảo mật
- **Multer**: Xử lý upload file audio

### AI Services
- **Groq Whisper**: Speech-to-text (độ chính xác ~95%)
- **Groq Llama 3.1/3.3**: Phân tích phát âm và tạo feedback
- **Ưu điểm**: Miễn phí, tốc độ xử lý cực nhanh (1-2 giây)

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js 20+ 
- npm hoặc yarn
- Groq API Key (miễn phí tại [console.groq.com](https://console.groq.com))

### 1. Clone repository
```bash
git clone <repository-url>
cd pronunciation-learning-app
```

### 2. Cài đặt Backend
```bash
cd backend
npm install

# Tạo file .env và cập nhật GROQ_API_KEY
cp .env.example .env
# Chỉnh sửa .env với API key của bạn

# Setup database
npm run db:generate
npm run db:push
npm run db:seed

# Chạy server
npm run dev
```

### 3. Cài đặt Frontend
```bash
# Mở terminal mới
cd .. # về thư mục gốc
npm install

# Chạy frontend
npm run dev
```

### 4. Truy cập ứng dụng
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🎯 Tài khoản demo

Sau khi seed database, bạn có thể sử dụng:
- **Email**: demo@example.com
- **Mật khẩu**: 123456

## 📁 Cấu trúc dự án

```
pronunciation-learning-app/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Auth middleware
│   │   └── config/         # Database config
│   ├── prisma/             # Database schema
│   └── uploads/            # Audio files
├── src/                    # React frontend
│   ├── components/         # Reusable components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   ├── stores/            # Zustand stores
│   └── hooks/             # Custom hooks
└── public/                # Static assets
```

## 🔧 Cấu hình Groq API

1. Đăng ký tài khoản miễn phí tại [console.groq.com](https://console.groq.com)
2. Tạo API key mới
3. Cập nhật file `backend/.env`:
```env
GROQ_API_KEY=your-groq-api-key-here
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Thông tin user

### Vocabulary
- `GET /api/vocabulary` - Danh sách từ vựng
- `GET /api/vocabulary/meta/categories` - Danh sách chủ đề

### Practice
- `POST /api/practice/analyze` - Phân tích phát âm
- `GET /api/practice/history` - Lịch sử luyện tập
- `GET /api/practice/stats` - Thống kê

### User
- `GET /api/user/profile` - Hồ sơ người dùng
- `GET /api/user/dashboard` - Dashboard data

## 🎨 Giao diện

Ứng dụng được thiết kế với:
- Màu sắc tươi sáng, phù hợp trẻ em
- Font chữ Comic Neue dễ đọc
- Animation nhẹ nhàng, không gây mỏi mắt
- Responsive design (mobile, tablet, desktop)
- Icon trực quan với emoji

## 🤖 Cách AI hoạt động

1. **Ghi âm**: Web Speech API ghi âm giọng nói người dùng
2. **Speech-to-Text**: Groq Whisper chuyển audio thành text
3. **Phân tích**: Groq Llama so sánh với từ chuẩn
4. **Chấm điểm**: AI tính điểm từ 0-100
5. **Feedback**: Tạo phản hồi chi tiết bằng tiếng Việt

## 📈 Tính năng nâng cao

- Lọc từ vựng theo chủ đề và độ khó
- Tìm kiếm từ vựng
- Thống kê tiến độ theo thời gian
- Luyện lại từ đã sai
- Theo dõi chuỗi ngày học liên tiếp

## 🔒 Bảo mật

- JWT authentication
- Bcrypt hash password
- Input validation
- File upload security
- CORS protection

## 🚀 Deploy

### Backend (Railway/Heroku)
1. Tạo PostgreSQL database
2. Cập nhật DATABASE_URL
3. Deploy backend code
4. Chạy migrations

### Frontend (Vercel/Netlify)
1. Build frontend: `npm run build`
2. Deploy dist folder
3. Cấu hình proxy API

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push và tạo Pull Request

## 📄 License

MIT License - xem file LICENSE để biết thêm chi tiết.

## 📞 Liên hệ

- Email: your-email@example.com
- GitHub: your-github-username

---

**Lưu ý**: Đây là dự án giáo dục. Để sử dụng trong production, cần thêm các tính năng bảo mật và tối ưu hóa hiệu suất.