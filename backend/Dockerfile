# FINAL: No build stage - JAR is pre-built locally and committed to Git
# This eliminates all build-stage OOM issues on Railway

FROM amazoncorretto:17-alpine
WORKDIR /app
COPY build/libs/backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080

# Runtime JVM settings optimized for Railway (512MB container)
# -Xmx320m: explicit hard cap so JVM never exceeds container limit
ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-Xmx320m", \
  "-Xms64m", \
  "-XX:MaxMetaspaceSize=96m", \
  "-Xss512k", \
  "-XX:ReservedCodeCacheSize=32m", \
  "-XX:+UseSerialGC", \
  "-XX:+ExitOnOutOfMemoryError", \
  "-jar", "app.jar"]
