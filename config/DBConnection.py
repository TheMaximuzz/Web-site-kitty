from flask_sqlalchemy import SQLAlchemy
import os

# Создаём экземпляр SQLAlchemy (без привязки к app — для гибкости)
db = SQLAlchemy()

def init_app(app):
    """
    Инициализирует подключение к PostgreSQL
    """
    # Получаем параметры из окружения
    DB_USER = os.getenv('DB_USER', 'postgres')
    DB_PASSWORD = os.getenv('DB_PASSWORD')
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_PORT = os.getenv('DB_PORT', '5432')
    DB_NAME = os.getenv('DB_NAME', 'web_site_kitty')

    if not DB_PASSWORD:
        raise RuntimeError(
            "Ошибка: переменная окружения DB_PASSWORD не задана. "
        )

    # Формируем URI подключения
    DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    
    # Настраиваем приложение
    app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # отключаем deprecated-предупреждение

    # Подключаем расширение к приложению
    db.init_app(app)

def test_connection(app):
    """
    Проверяет подключение к БД
    """
    with app.app_context():
        try:
            # Выполняем простой запрос
            db.session.execute(db.text("SELECT version()"))
            version = db.session.execute(db.text("SHOW server_version")).fetchone()[0]
            print(f"Успешное подключение к PostgreSQL (версия {version})")
            print(f"База данных: {os.getenv('DB_NAME', 'web_site_kitty')}")
        except Exception as e:
            print("Ошибка подключения к PostgreSQL")
            print(f"Причина: {e}")
