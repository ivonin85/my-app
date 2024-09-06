# Используем Maven для сборки
FROM maven:3.8.8-eclipse-temurin-17 AS backend-build
WORKDIR /app

# Копируем pom.xml и скачиваем зависимости
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Копируем исходники и собираем проект
COPY src ./src
RUN mvn clean package -DskipTests

# Запуск приложения
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Копируем JAR файл из этапа сборки
COPY --from=backend-build /app/target/*.jar app.jar

# Устанавливаем переменную окружения для Java (если нужно)
ENV JAVA_OPTS=""

# Запускаем приложение
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
