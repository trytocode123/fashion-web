# Giai đoạn 1: Build - Tự động build JAR từ mã nguồn
FROM amazoncorretto:17-alpine AS build
WORKDIR /app
COPY . .
# Cấp quyền thực thi cho gradlew và chạy build (không dùng daemon để tiết kiệm RAM)
RUN chmod +x ./gradlew && ./gradlew build -x test --no-daemon

# Giai đoạn 2: Runtime - Chạy ứng dụng với cấu hình tối ưu
FROM amazoncorretto:17-alpine
WORKDIR /app
# Sao chép tệp JAR từ giai đoạn build
COPY --from=build /app/build/libs/backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080

# Cấu hình JVM tối ưu cho Railway (Container 512MB)
# -Xmx288m: Giới hạn Heap để nhường chỗ cho Metaspace và Stack
# -XX:MaxMetaspaceSize=128m: Tăng không gian cho class metadata (tránh OOM Metaspace)
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
