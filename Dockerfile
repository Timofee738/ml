FROM python:3.12-slim

WORKDIR /app

# Установим необходимые системные зависимости для компиляции
RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-client \
    postgresql-common \
    gcc \
    g++ \
    make \
    libpq-dev \
    python3-dev \
    libssl-dev \
    libffi-dev \
    && rm -rf /var/lib/apt/lists/*

# Обновляем pip, setuptools и wheel
RUN pip install --upgrade pip setuptools wheel

# Копируем requirements и устанавливаем зависимости
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем код приложения
COPY . .

# Создаем entrypoint script
RUN chmod +x ./scripts/entrypoint.sh

EXPOSE 8000

CMD ["./scripts/entrypoint.sh"]
