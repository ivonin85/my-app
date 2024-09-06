# Используем Node.js как базовый образ
FROM node:18-alpine AS frontend-build
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем остальные файлы и собираем проект
COPY . .
RUN npm run build

# Используем Nginx для сервировки статики
FROM nginx:alpine
COPY --from=frontend-build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
