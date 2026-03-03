# Giai đoạn 1: Build - Sử dụng Gradle image chuyên dụng để tránh lỗi định dạng file gradlew
FROM gradle:8-jdk17-alpine AS build
# Đặt thư mục làm việc trong container
WORKDIR /app
# Sao chép toàn bộ mã nguồn vào (bỏ qua tệp build/ theo .dockerignore)
COPY . .
# Chạy lệnh build Gradle trực tiếp (không dùng daemon để tiết kiệm RAM trong container build)
RUN gradle build -x test --no-daemon

# Giai đoạn 2: Runtime - Chạy ứng dụng với cấu hình Metaspace đã tối ưu
FROM amazoncorretto:17-alpine
WORKDIR /app
# Sao chép tệp JAR từ giai đoạn build trước đó
COPY --from=build /app/build/libs/backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080

# Cấu hình JVM tối ưu cho Railway (Container 512MB RAM)
# -Xmx288m: Giới hạn Heap để nhường chỗ cho Metaspace và Stack
# -XX:MaxMetaspaceSize=128m: Tăng không gian Metaspace để tránh lỗi OutOfMemory Metaspace khi gửi email
ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-Xmx288m", \
  "-Xms64m", \
  "-XX:MaxMetaspaceSize=128m", \
  "-Xss512k", \
  "-XX:ReservedCodeCacheSize=32m", \
  "-XX:+UseSerialGC", \
  "-XX:+ExitOnOutOfMemoryError", \
  "-jar", "app.jar"]
