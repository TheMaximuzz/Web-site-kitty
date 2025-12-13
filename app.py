from flask import Flask, render_template, jsonify, request, url_for
from config.DBConnection import init_app, db, test_connection

app = Flask(__name__)

# Подключение базы данных
init_app(app)
test_connection(app)

# Готовые котики для главной страницы
CATS = [
    {"id": 1, "name": "Киберкот",  "price": 62300, "accessories_count": 2, "image": "cat1.png"},
    {"id": 2, "name": "Казикот", "price": 52000, "accessories_count": 2, "image": "cat2.png"},
    {"id": 3, "name": "Мурослав", "price": 57800, "accessories_count": 3, "image": "cat3.png"},
    {"id": 4, "name": "Цезамур",  "price": 45500, "accessories_count": 1, "image": "cat4.png"},
    {"id": 5, "name": "Качкот",  "price": 50800, "accessories_count": 2, "image": "cat5.png"},
    {"id": 6, "name": "Мурчёный", "price": 53800, "accessories_count": 3, "image": "cat6.png"}
]


HEADS = [
    {"id": "head1", "name": "Рыжий и суровый", "file": "head1.png"},
    {"id": "head2", "name": "Грустный",        "file": "head2.png"}, # Тут была опечатка с лишней кавычкой
    {"id": "head3", "name": "Хитрый",          "file": "head3.png"},
]

BODIES = [
    {"id": "body1", "name": "Космодесант", "file": "body1.png", "price": 15000},
    {"id": "body2", "name": "Полиция",     "file": "body2.png", "price": 12000},
    {"id": "body3", "name": "Уборщик",   "file": "body3.png", "price": 10000},
]

ACCESSORIES = [
    {"id": "collar",  "name": "Ошейник с бантиком", "price": 500},
    {"id": "bell",    "name": "Колокольчик",        "price": 300},
    {"id": "toy",     "name": "Игрушка",            "price": 800},
    {"id": "bed",     "name": "Лежанка",            "price": 1500},
    {"id": "carrier", "name": "Переноска",          "price": 2000},
]

# --- РОУТЫ ---

@app.route('/')
def index():
    return render_template('index.html', cats=CATS)

@app.route('/create')
def create():
    # Передаем списки голов, тел и аксессуаров в шаблон
    return render_template('create.html', 
                           heads=HEADS, 
                           bodies=BODIES, 
                           accessories=ACCESSORIES)

@app.route('/api/add-to-cart', methods=['POST'])
def add_to_cart():
    data = request.json or {}
    # В реальном приложении здесь было бы сохранение в БД/Сессию
    return jsonify({"ok": True, "added": data})

if __name__ == '__main__':
    app.run(debug=True)