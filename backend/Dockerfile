# Backend Dockerfile (Gradle)
FROM gradle:8-jdk17-alpine AS build
WORKDIR /app
COPY . .

# Set Gradle memory limit and build
ENV GRADLE_OPTS="-Dorg.gradle.jvmargs=-Xmx512m -Dorg.gradle.daemon=false"
RUN chmod +x ./gradlew && ./gradlew clean build -x test --no-daemon --stacktrace

FROM amazoncorretto:17-alpine
WORKDIR /app
# Copy specific JAR to avoid copying the *-plain.jar
COPY --from=build /app/build/libs/backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080

# Auto-configure RAM usage based on container limits
ENTRYPOINT ["sh", "-c", "java -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Dserver.port=${PORT:-8080} -jar app.jar"]

