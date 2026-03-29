# 🚀 Quick Start Guide

## Khởi động nhanh trong 5 phút

### 1. Kiểm tra server đang chạy

Backend và Frontend đã được khởi động:
- ✅ Backend: http://localhost:3001
- ✅ Frontend: http://localhost:3000

### 2. Đăng nhập Admin

Truy cập: http://localhost:3000

**Tài khoản demo:**
```
Email: demo@example.com
Password: 123456
```

Nếu tài khoản này không phải admin, tạo admin mới:

```bash
cd backend
node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

(async () => {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin'
    }
  });
  console.log('✅ Admin created:', admin.email);
  process.exit(0);
})();
"
```

Sau đó đăng nhập với:
```
Email: admin@example.com
Password: admin123
```

### 3. Khám phá Admin Panel

Sau khi đăng nhập với tài khoản admin, bạn sẽ thấy:

#### 📊 Overview (Dashboard)
- Tổng quan hệ thống
- Top performers
- Category performance
- Daily activity

#### 👥 Users
- Quản lý users
- Thay đổi role
- Xem chi tiết user

#### 📚 Vocabulary
- Thêm/sửa/xóa từ vựng
- Tìm kiếm và filter
- Xem số lượng practices

#### 🎯 Practices
- Xem tất cả practice sessions
- Filter theo user/category
- Xem chi tiết scores

#### 🏆 Quiz Sessions ⭐ NEW
- Xem quiz sessions
- Filter theo mode
- Thống kê kết quả

#### 📈 Analytics ⭐ NEW
- Biểu đồ practice activity
- Category performance
- Score distribution
- User growth

#### 💾 Bulk Operations ⭐ NEW
- Import vocabulary từ CSV
- Export data

### 4. Test các tính năng mới

#### A. Import Vocabulary
1. Vào `/admin/bulk-operations`
2. Click "Download CSV Template"
3. Mở file CSV và thêm data:
```csv
word,translation,category,difficulty,phonetic,example,audioUrl
elephant,con voi,animals,medium,/ˈɛlɪfənt/,The elephant is big.,
tiger,con hổ,animals,medium,/ˈtaɪɡər/,The tiger is strong.,
```
4. Upload file
5. Review preview
6. Click "Import Vocabulary"

#### B. Xem Analytics
1. Vào `/admin/analytics`
2. Xem các biểu đồ:
   - Practice trends (30 ngày)
   - Category performance
   - Score distribution
   - User growth

#### C. Export Data
1. Vào `/admin/bulk-operations`
2. Click "Export Vocabulary" hoặc "Export Users"
3. File CSV sẽ được download

#### D. Quản lý Quiz Sessions
1. Vào `/admin/quiz-sessions`
2. Filter theo user hoặc mode
3. Click "Details" để xem chi tiết

### 5. Test User Features

Đăng xuất và đăng nhập với tài khoản student:
```
Email: demo@example.com
Password: 123456
```

Hoặc tạo tài khoản mới tại `/register`

#### Test Practice
1. Vào "Practice"
2. Chọn mode (Single Word hoặc Phrase & Sentence)
3. Chọn category
4. Chọn vocabulary
5. Click microphone và nói
6. Xem kết quả và feedback

#### Test Quiz
1. Vào "Quiz"
2. Chọn mode và category
3. Làm 10 câu hỏi
4. Xem kết quả tổng

#### Test Review
1. Vào "Review"
2. Xem từ cần ôn tập
3. Luyện lại các từ sai

### 6. Kiểm tra Database

```bash
cd backend
npx prisma studio
```

Mở http://localhost:5555 để xem database

### 7. Troubleshooting

#### Backend không chạy?
```bash
cd backend
npm install
npm run dev
```

#### Frontend không chạy?
```bash
npm install
npm run dev
```

#### Lỗi Groq API?
Kiểm tra file `backend/.env`:
```
GROQ_API_KEY=your-groq-api-key
```

Lấy API key miễn phí tại: https://console.groq.com

#### Database lỗi?
```bash
cd backend
npx prisma generate
npx prisma db push
npm run db:seed
```

### 8. Các URL quan trọng

**Frontend:**
- Home: http://localhost:3000
- Admin: http://localhost:3000/admin
- Login: http://localhost:3000/login

**Backend:**
- Health: http://localhost:3001/api/health
- API Docs: (có thể thêm Swagger)

**Database:**
- Prisma Studio: http://localhost:5555

### 9. Keyboard Shortcuts

**Admin Panel:**
- `Ctrl/Cmd + K` - Quick search (có thể thêm)
- `Esc` - Close modals

**Practice Page:**
- `Space` - Start/Stop recording
- `Enter` - Submit

### 10. Tips & Tricks

#### Import nhiều vocabulary nhanh
1. Sử dụng Excel/Google Sheets
2. Export as CSV
3. Upload vào Bulk Operations

#### Xem analytics theo thời gian
- Analytics tự động cập nhật mỗi ngày
- Data được cache 5 phút

#### Export để backup
- Export định kỳ hàng tuần
- Lưu file với timestamp

#### Monitor user activity
- Check Dashboard mỗi ngày
- Theo dõi Top Performers
- Phân tích Category Performance

---

## 🎯 Next Steps

1. ✅ Khám phá tất cả admin features
2. ✅ Test import/export
3. ✅ Xem analytics
4. ✅ Thử các user features
5. 📝 Customize theo nhu cầu
6. 🚀 Deploy lên production

## 📚 Tài liệu thêm

- [README.md](./README.md) - Hướng dẫn chi tiết
- [ADMIN_FEATURES.md](./ADMIN_FEATURES.md) - Admin features
- [CHECKLIST.md](./CHECKLIST.md) - Feature checklist

## 🆘 Cần giúp đỡ?

- Check console logs
- Xem Network tab
- Đọc error messages
- Check Prisma Studio

---

**Happy coding! 🎉**
