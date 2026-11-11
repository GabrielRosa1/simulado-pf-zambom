# Etapa 1: compilar o projeto
FROM maven:3.9-eclipse-temurin-25 AS builder
WORKDIR /build
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# Etapa 2: rodar só o .jar (imagem final menor)
FROM eclipse-temurin:25-jre
WORKDIR /app
COPY --from=builder /build/target/avaliacoes-*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]