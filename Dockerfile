# --------- Build Stage ---------
FROM maven:3.8.5-openjdk-17 AS build

# Set working directory inside the container
WORKDIR /app

# Copy Maven configuration and source code
COPY pom.xml .
COPY src ./src

# Download dependencies first to leverage Docker cache
RUN mvn dependency:go-offline -B

# Build and package the application, skipping tests for faster build
RUN mvn clean package -DskipTests

# --------- Runtime Stage ---------
FROM openjdk:17-jdk-slim

# Create a non-root user for better security
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Install common tools if needed (remove if unnecessary)
RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create application directory and set ownership to the non-root user
RUN mkdir /app && chown appuser:appuser /app

# Switch to the non-root user
USER appuser

# Set working directory
WORKDIR /app

# Copy the packaged jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Run the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
