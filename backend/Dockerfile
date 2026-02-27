# Backend Dockerfile (Gradle)
FROM gradle:8-jdk17-alpine AS build
WORKDIR /app
COPY . .

# Set Gradle memory limit - keep as low as possible for Railway build container
ENV GRADLE_OPTS="-Dorg.gradle.jvmargs=-Xmx512m -XX:MaxMetaspaceSize=128m -XX:+UseSerialGC -Dorg.gradle.daemon=false"
RUN chmod +x ./gradlew && ./gradlew clean build -x test --no-daemon --no-build-cache

FROM amazoncorretto:17-alpine
WORKDIR /app
# Use a specific JAR pattern to avoid conflicts
COPY --from=build /app/build/libs/backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080

# Auto-configure RAM usage based on container limits
# Aggressive limits: 50% RAM for heap, strict Metaspace and Stack limits, disable Class Data Sharing
ENTRYPOINT ["sh", "-c", "java -XX:+UseContainerSupport -XX:MaxRAMPercentage=50.0 -XX:MaxMetaspaceSize=128m -Xss512k -XX:ReservedCodeCacheSize=64m -Xshare:off -XX:+UseSerialGC -jar app.jar"]

