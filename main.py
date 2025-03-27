#!/usr/bin/env python3
from http.server import HTTPServer, BaseHTTPRequestHandler
import os


class SimpleHandler(BaseHTTPRequestHandler):
    # Обрабатываем GET запросы
    def do_GET(self):
        # Корневой URL - отдаем HTML страницу
        if self.path == '/':
            self.path = '/main.html'

        try:
            # Проверяем, запрашивается ли файл из static директории
            if self.path.startswith('/static/'):
                file_path = self.path[1:]  # Убираем начальный '/'
            else:
                file_path = 'static' + self.path

            # Открываем файл
            with open(file_path, 'rb') as file:
                content = file.read()

            # Отправляем успешный статус
            self.send_response(200)

            # Определяем MIME тип по расширению файла
            if self.path.endswith('.html'):
                self.send_header('Content-type', 'text/html')
            elif self.path.endswith('.css'):
                self.send_header('Content-type', 'text/css')
            elif self.path.endswith('.js'):
                self.send_header('Content-type', 'application/javascript')
            elif self.path.endswith('.jpg') or self.path.endswith('.jpeg'):
                self.send_header('Content-type', 'image/jpeg')
            elif self.path.endswith('.png'):
                self.send_header('Content-type', 'image/png')
            else:
                self.send_header('Content-type', 'text/plain')

            # Отключаем кэширование для удобства разработки
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.end_headers()

            # Отправляем содержимое файла
            self.wfile.write(content)

        except FileNotFoundError:
            # Если файл не найден, возвращаем 404
            self.send_response(404)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(b'404 - File Not Found')


# Порт для сервера
PORT = 8000

# Создаем сервер с нашим обработчиком
httpd = HTTPServer(('', PORT), SimpleHandler)

print(f"Сервер запущен на http://localhost:{PORT}")
print("Для остановки нажмите Ctrl+C")

# Запускаем сервер
httpd.serve_forever()