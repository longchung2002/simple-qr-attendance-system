📁 Cấu trúc dự án hiện tại
qr-attendance/
│
├── index.html
├── style.css
├── app.js
├── manifest.json
├── firebase.json
│
└── GAS/
    └── Code.gs
🚀 Luồng hoạt động
Frontend (Firebase Hosting)

Người dùng:

Mở web
↓
Chọn lớp
↓
Mở camera sau
↓
Quét QR
↓
Gửi dữ liệu lên GAS
↓
Nhận kết quả
↓
Hiển thị:
✓ Điểm danh thành công
hoặc
⚠ Đã điểm danh hôm nay
QR Format

Ví dụ:

KTMH2_Nguyễn Minh Trí_2015

Tách thành:

MemberCode = KTMH2
Name       = Nguyễn Minh Trí
Year       = 2015

##Hướng dẫn sử dụng
Cài đặt nodejs, firebase và tạo dự án firebase của riêng bạn 
Thay đổi WEB_APP_URL, SPREADSHEET_ID, SHEET_NAME thành giá trị của bạn
