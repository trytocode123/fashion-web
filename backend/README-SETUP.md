# 🚀 Hướng Dẫn Setup Backend - Fashion Web

## 📋 Yêu Cầu Hệ Thống

- **Java**: JDK 17 hoặc cao hơn
- **MySQL**: 8.0 hoặc cao hơn
- **Gradle**: 7.x (hoặc sử dụng Gradle Wrapper đi kèm)

---

## ⚙️ Cấu Hình Google OAuth 2.0

### Bước 1: Tạo Google Cloud Project

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project có sẵn
3. Vào **APIs & Services** → **Credentials**

### Bước 2: Tạo OAuth 2.0 Client ID

1. Click **Create Credentials** → **OAuth client ID**
2. Chọn **Application type**: `Web application`
3. Điền thông tin:
   - **Name**: `Fashion Web Backend`
   - **Authorized redirect URIs**: 
     ```
     http://localhost:8080/login/oauth2/code/google
     ```
4. Click **Create** và lưu lại:
   - ✅ **Client ID**
   - ✅ **Client Secret**

### Bước 3: Cấu Hình Biến Môi Trường

#### Option 1: Sử dụng File `.env` (Khuyến nghị - Tự động load)

1. Copy file mẫu:
   ```bash
   cp .env.example .env
   ```

2. Mở file `.env` và điền **CHỈ CẦN** Google OAuth credentials:
   ```properties
   GOOGLE_CLIENT_ID=your-actual-client-id-here.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-actual-client-secret-here
   GOOGLE_REDIRECT_URI=http://localhost:8080/login/oauth2/code/google
   ```

3. **Xong!** Chạy app ngay:
   ```bash
   ./gradlew bootRun
   ```

4. **Lưu ý**: 
   - ✅ File `.env` sẽ **tự động được load** khi chạy ứng dụng (nhờ thư viện `spring-dotenv`)
   - ✅ File `.env` đã được thêm vào `.gitignore`, không bao giờ push lên Git!
   - ✅ Database config đã có giá trị mặc định (`root/codegym`), chỉ cần uncomment nếu bạn dùng config khác

#### Option 2: Set Environment Variables Thủ Công (Windows)

```powershell
$env:GOOGLE_CLIENT_ID="your-client-id"
$env:GOOGLE_CLIENT_SECRET="your-client-secret"
$env:GOOGLE_REDIRECT_URI="http://localhost:8080/login/oauth2/code/google"
```

#### Option 3: Set Environment Variables (Linux/Mac)

```bash
export GOOGLE_CLIENT_ID="your-client-id"
export GOOGLE_CLIENT_SECRET="your-client-secret"
export GOOGLE_REDIRECT_URI="http://localhost:8080/login/oauth2/code/google"
```

---

## 🗄️ Cấu Hình Database

### Bước 1: Tạo Database

```sql
CREATE DATABASE fashion CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

> **💡 Tip**: Database sẽ tự động được tạo khi chạy ứng dụng lần đầu nhờ `createDatabaseIfNotExist=true`

### Bước 2: Kiểm Tra MySQL Credentials

Ứng dụng **mặc định** sử dụng:
- **Host**: `localhost:3306`
- **Database**: `fashion`
- **Username**: `root`
- **Password**: `codegym`

✅ **Nếu MySQL của bạn dùng đúng config trên** → Không cần làm gì thêm!

❌ **Nếu MySQL của bạn khác** (ví dụ: password là `root` hoặc `123456`):

Uncomment và sửa trong file `.env`:
```properties
DB_USERNAME=root
DB_PASSWORD=root
```

Hoặc thay đổi toàn bộ connection string:
```properties
DB_URL=jdbc:mysql://localhost:3306/fashion?createDatabaseIfNotExist=true
DB_USERNAME=your-username
DB_PASSWORD=your-password
```

---

## ▶️ Chạy Ứng Dụng

### Sử dụng Gradle Wrapper (Khuyến nghị)

```bash
# Windows
.\gradlew bootRun

# Linux/Mac
./gradlew bootRun
```

### Sử dụng Gradle

```bash
gradle bootRun
```

### Build JAR File

```bash
# Build
.\gradlew build

# Run JAR
java -jar build/libs/backend-0.0.1-SNAPSHOT.jar
```

---

## ✅ Kiểm Tra Ứng Dụng

1. Backend sẽ chạy tại: `http://localhost:8080`
2. Test Google OAuth endpoint (nếu có):
   - `http://localhost:8080/oauth2/authorization/google`

---

## 🐛 Troubleshooting

### Lỗi: "Could not resolve placeholder 'GOOGLE_CLIENT_ID'"

**Nguyên nhân**: Chưa set biến môi trường

**Giải pháp**: 
- Kiểm tra file `.env` đã tạo chưa
- Hoặc set environment variables theo hướng dẫn ở trên

### Lỗi: "Access denied for user 'root'@'localhost'"

**Nguyên nhân**: Sai thông tin MySQL

**Giải pháp**:
- Kiểm tra username/password trong `application.properties`
- Hoặc override trong file `.env`

### Lỗi: "Unknown database 'fashion'"

**Nguyên nhân**: Chưa tạo database

**Giải pháp**:
```sql
CREATE DATABASE fashion;
```

---

## 📞 Liên Hệ

Nếu gặp vấn đề, vui lòng tạo issue trên GitHub repository.

---

**Happy Coding! 🎉**
