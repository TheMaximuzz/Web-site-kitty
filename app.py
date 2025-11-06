from flask import Flask, render_template, jsonify, request, url_for, redirect

app = Flask(__name__)

# Статический список котиков — в реальном проекте это БД
CATS = [
    {
        "id": 1,
        "name": "Рыжик",
        "price": 62300,
        "accessories_count": 2,
        "image": "cat1.jpg"
    },
    {
        "id": 2,
        "name": "Багира",
        "price": 52000,
        "accessories_count": 2,
        "image": "cat2.jpg"
    },
    {
        "id": 3,
        "name": "Снежок",
        "price": 57800,
        "accessories_count": 3,
        "image": "cat3.jpg"
    },
    {
        "id": 4,
        "name": "Симка",
        "price": 45500,
        "accessories_count": 1,
        "image": "cat4.jpg"
    },
    {
        "id": 5,
        "name": "Дымок",
        "price": 50800,
        "accessories_count": 2,
        "image": "cat5.jpg"
    },
    {
        "id": 6,
        "name": "Персик",
        "price": 53800,
        "accessories_count": 3,
        "image": "cat6.jpg"
    }
]

ACCESSORIES = [
    {"id": "collar", "name": "Ошейник с бантиком", "price": 500},
    {"id": "bell", "name": "Колокольчик", "price": 300},
    {"id": "toy", "name": "Игрушка", "price": 800},
    {"id": "bed", "name": "Лежанка", "price": 1500},
    {"id": "carrier", "name": "Переноска", "price": 2000},
]

@app.route('/')
def index():
    return render_template('index.html', cats=CATS)

@app.route('/create')
def create():
    # Для превью используем первый котик как начальный образец
    sample = CATS[0]
    return render_template('create.html', sample=sample, accessories=ACCESSORIES)

# Простой API для добавления в корзину (демонстрация)
@app.route('/api/add-to-cart', methods=['POST'])
def add_to_cart():
    data = request.json or {}
    # просто возвращаем подтверждение — в реале нужно писать в сессии/БД
    return jsonify({"ok": True, "added": data})

if __name__ == '__main__':
    app.run(debug=True)
