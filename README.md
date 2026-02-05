# 👗 Fashion Web - E-commerce Platform

Ứng dụng web thương mại điện tử thời trang với tích hợp Google OAuth 2.0.

---

## 📁 Cấu Trúc Project

```
fashion-web/
├── backend/          # Spring Boot Backend (Java)
│   ├── src/
│   ├── .env.example  # Template cho biến môi trường
│   └── README-SETUP.md  # Hướng dẫn setup chi tiết
├── frontend/         # Frontend (React/Vue/Angular)
└── README.md         # File này
```

---

## 🚀 Quick Start

### 1️⃣ Clone Repository

```bash
git clone <repository-url>
cd fashion-web
```

### 2️⃣ Setup Backend

**Xem hướng dẫn chi tiết**: [backend/README-SETUP.md](backend/README-SETUP.md)

**Tóm tắt nhanh**:

1. Tạo file `.env` từ template:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Cấu hình Google OAuth trong file `.env`:
   - Lấy credentials từ [Google Cloud Console](https://console.cloud.google.com/)
   - Điền `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`
   - File `.env` sẽ **tự động được load** khi chạy ứng dụng

3. Tạo database MySQL:
   ```sql
   CREATE DATABASE fashion;
   ```

4. Chạy backend:
   ```bash
   ./gradlew bootRun
   ```

Backend sẽ chạy tại: `http://localhost:8080`

### 3️⃣ Setup Frontend

```bash
cd frontend
npm install
npm start
```

---

## 🔐 Google OAuth Configuration

### Lấy Google OAuth Credentials

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới
3. Vào **APIs & Services** → **Credentials**
4. Tạo **OAuth 2.0 Client ID**
5. Thêm **Authorized redirect URI**: `http://localhost:8080/login/oauth2/code/google`
6. Copy **Client ID** và **Client Secret** vào file `backend/.env`

**Chi tiết**: Xem [backend/README-SETUP.md](backend/README-SETUP.md)

---

## 🛠️ Tech Stack

### Backend
- ☕ **Java** 17+
- 🍃 **Spring Boot** 3.x
- 🗄️ **MySQL** 8.0+
- 🔐 **Spring Security** + OAuth 2.0
- 🏗️ **Gradle**

### Frontend
- ⚛️ **React/Vue/Angular** (tùy implementation)
- 📦 **npm/yarn**

---

## 📝 Environment Variables

File `backend/.env` cần có:

```properties
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8080/login/oauth2/code/google
```

**⚠️ Lưu ý**: File `.env` đã được thêm vào `.gitignore` - KHÔNG BAO GIỜ push lên Git!

---

## 🐛 Troubleshooting

Xem phần **Troubleshooting** trong [backend/README-SETUP.md](backend/README-SETUP.md)

---

## 📄 License

[Thêm license của bạn ở đây]

---

## 👥 Contributors

[Thêm thông tin contributors]

---

**Happy Coding! 🎉**
