import socket

# Подставь сюда то, что у тебя написано в DB_HOST в .env
host = "localhost" 
port = 5432

try:
    print(f"Пробую найти адрес: {host}...")
    addr = socket.getaddrinfo(host, port)
    print(f"Успех! Адрес найден: {addr}")
except Exception as e:
    print(f"Ошибка: {e}")