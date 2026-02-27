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

# Runtime: Give Spring Boot enough heap (75% of container RAM)
# Build stage above uses only 512MB (GRADLE_OPTS). Runtime is a separate JVM process.
ENTRYPOINT ["sh", "-c", "java -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:MaxMetaspaceSize=128m -Xss512k -XX:ReservedCodeCacheSize=64m -XX:+UseSerialGC -jar app.jar"]

