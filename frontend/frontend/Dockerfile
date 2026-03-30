FROM node:20-alpine

WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем их
RUN npm install

# Копируем всё остальное
COPY . .

EXPOSE 5173

# Запускаем в режиме разработки (для Vite)
CMD ["npm", "run", "dev", "--", "--host"]