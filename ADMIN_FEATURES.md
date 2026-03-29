# 🔐 Admin Features Documentation

## Tổng quan

Hệ thống admin đã được nâng cấp với các tính năng quản lý toàn diện và analytics chi tiết.

## 🎯 Các tính năng Admin

### 1. Dashboard (Overview)
**Route:** `/admin`

**Chức năng:**
- Tổng quan hệ thống (users, vocabulary, practices)
- Top performers (học viên xuất sắc)
- Category performance (hiệu suất theo chủ đề)
- Daily activity (hoạt động 30 ngày gần nhất)

### 2. Users Management
**Route:** `/admin/users`

**Chức năng:**
- Danh sách tất cả users với pagination
- Tìm kiếm users theo tên/email
- Xem chi tiết user (practices, stats)
- Thay đổi role (student ↔ admin)
- Thống kê từng user (accuracy, average score)

### 3. Vocabulary Management
**Route:** `/admin/vocabulary`

**Chức năng:**
- Danh sách vocabulary với pagination
- Tìm kiếm và filter theo category
- Thêm vocabulary mới
- Sửa vocabulary
- Xóa vocabulary
- Xem số lượng practices cho mỗi từ

### 4. Practices Management
**Route:** `/admin/practices`

**Chức năng:**
- Xem tất cả practice sessions
- Filter theo user và category
- Xem chi tiết (score, transcription, feedback)
- Thống kê correct/incorrect

### 5. Quiz Sessions Management ⭐ NEW
**Route:** `/admin/quiz-sessions`

**Chức năng:**
- Xem tất cả quiz sessions
- Filter theo user và practice mode
- Xem chi tiết session (score, correct count, time spent)
- Thống kê theo mode (single word / phrase & sentence)

### 6. Analytics & Reports ⭐ NEW
**Route:** `/admin/analytics`

**Chức năng với Chart.js:**
- **Line Chart:** Practice activity (30 ngày)
- **Bar Chart:** Average score by category
- **Doughnut Chart:** Score distribution (Excellent/Good/Fair/Poor)
- **Pie Chart:** Most practiced categories
- **Line Chart:** User growth (30 ngày)

**Thư viện:** Chart.js + react-chartjs-2

### 7. Bulk Operations ⭐ NEW
**Route:** `/admin/bulk-operations`

**Import Vocabulary:**
- Download CSV template
- Upload CSV file
- Validation trước khi import
- Preview data
- Bulk import với error handling

**Export Data:**
- Export Vocabulary (CSV)
- Export Users (CSV)
- Export Practices (CSV)

**Thư viện:** PapaParse

## 📊 Backend API Endpoints

### Dashboard
```
GET /api/admin/dashboard
```

### Users
```
GET /api/admin/users?page=1&limit=20&search=keyword
GET /api/admin/users/:id
PUT /api/admin/users/:id/role
```

### Vocabulary
```
GET /api/admin/vocabulary?page=1&limit=20&category=animals&search=keyword
POST /api/admin/vocabulary
PUT /api/admin/vocabulary/:id
DELETE /api/admin/vocabulary/:id
```

### Practices
```
GET /api/admin/practices?page=1&limit=20&userId=xxx&category=animals
```

### Quiz Sessions ⭐ NEW
```
GET /api/admin/quiz-sessions?page=1&limit=20&userId=xxx&practiceMode=single_word
```

### Analytics ⭐ NEW
```
GET /api/admin/analytics
```

### Bulk Operations ⭐ NEW
```
POST /api/admin/vocabulary/bulk-import
GET /api/admin/export/vocabulary
GET /api/admin/export/users
GET /api/admin/export/practices
```

## 🔒 Authentication & Authorization

Tất cả admin routes đều yêu cầu:
1. JWT token hợp lệ (authenticateToken middleware)
2. Role = 'admin' (requireAdmin middleware)

## 📦 Dependencies mới

```json
{
  "chart.js": "^4.x",
  "react-chartjs-2": "^5.x",
  "papaparse": "^5.x"
}
```

## 🎨 UI Components

### Charts (Chart.js)
- Line Chart - Xu hướng theo thời gian
- Bar Chart - So sánh giữa các categories
- Pie Chart - Phân bố tỷ lệ
- Doughnut Chart - Score distribution

### Data Tables
- Pagination
- Search & Filter
- Sort
- Actions (View, Edit, Delete)

### Forms
- Validation
- Error handling
- Loading states
- Success feedback

## 🚀 Cách sử dụng

### 1. Đăng nhập với tài khoản admin
```
Email: admin@example.com (nếu có trong seed data)
Password: [your-password]
```

### 2. Truy cập Admin Panel
```
http://localhost:3000/admin
```

### 3. Import Vocabulary
1. Vào `/admin/bulk-operations`
2. Download CSV template
3. Điền data vào template
4. Upload file
5. Review preview
6. Click Import

### 4. Export Data
1. Vào `/admin/bulk-operations`
2. Chọn loại data cần export
3. Click Export button
4. File CSV sẽ được download

### 5. Xem Analytics
1. Vào `/admin/analytics`
2. Xem các biểu đồ:
   - Practice trends
   - Category performance
   - Score distribution
   - User growth

## 📝 CSV Format cho Import

### Vocabulary Template
```csv
word,translation,category,difficulty,phonetic,example,audioUrl
cat,con mèo,animals,easy,/kæt/,The cat is sleeping.,
dog,con chó,animals,easy,/dɔːɡ/,I have a dog.,
```

**Required fields:**
- word
- translation
- category

**Optional fields:**
- difficulty (easy/medium/hard)
- phonetic (IPA)
- example
- audioUrl

## 🎯 Best Practices

### Import Data
1. Luôn download template trước
2. Validate data trước khi upload
3. Import theo batch nhỏ (< 100 items)
4. Backup data trước khi import

### Export Data
1. Export định kỳ để backup
2. Sử dụng exported data để phân tích
3. Lưu trữ exports với timestamp

### Analytics
1. Kiểm tra analytics hàng ngày
2. Theo dõi user engagement
3. Phân tích category performance
4. Điều chỉnh content dựa trên data

## 🔧 Troubleshooting

### Import không thành công
- Kiểm tra format CSV
- Đảm bảo required fields có đủ
- Kiểm tra duplicate words
- Xem validation errors

### Charts không hiển thị
- Kiểm tra data có đủ không
- Refresh page
- Check console errors
- Verify API response

### Export không download
- Kiểm tra browser settings
- Allow downloads
- Check network tab
- Verify API response

## 📈 Future Enhancements

Các tính năng có thể thêm:
- [ ] Real-time notifications
- [ ] Advanced filtering
- [ ] Custom reports
- [ ] Scheduled exports
- [ ] Audit logs
- [ ] Role-based permissions (super admin, moderator)
- [ ] Bulk edit vocabulary
- [ ] Audio file management
- [ ] System settings UI
- [ ] Email notifications

## 🎓 Training Materials

### Video Tutorials (Có thể tạo)
1. Admin Dashboard Overview
2. Managing Users
3. Bulk Import Vocabulary
4. Reading Analytics
5. Exporting Reports

### Documentation
- API Documentation
- User Guide
- Admin Guide
- Developer Guide

---

**Version:** 2.0.0  
**Last Updated:** March 29, 2026  
**Maintained by:** Development Team
