document.addEventListener('DOMContentLoaded', function() {

  // Инициализация корзины при загрузке (используем глобальный объект Cart из cart.js)
  if (window.Cart) {
    window.Cart.render('#cart-contents');
    window.Cart.render('#cart-contents-create');
  }

  /* =========================
     Логика добавления готовых котов (index.html)
     ========================= */
  const readyBtns = document.querySelectorAll('.add-to-cart');
  readyBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const id = btn.dataset.id;
      const name = btn.dataset.name;
      const price = parseInt(btn.dataset.price, 10) || 0;
      
      // Добавляем и обновляем
      window.Cart.add({id, name, price});
      window.Cart.render('#cart-contents');
      alert(name + ' добавлен в корзину');
    });
  });

  /* =========================
     Логика КОНСТРУКТОРА (create.html)
     ========================= */
  
  const headSelect = document.getElementById('headSelect');
  const bodySelect = document.getElementById('bodySelect');
  const previewHead = document.getElementById('previewHead');
  const previewBody = document.getElementById('previewBody');
  const finalPriceEl = document.getElementById('finalPrice');
  const addToCartBtn = document.getElementById('addToCartBtn');
  const accCheckboxes = document.querySelectorAll('.acc-checkbox');

  // Функция пересчета цены
  function updateState() {
    if (!headSelect || !bodySelect) return;

    // 1. Обновляем картинки
    const headFile = headSelect.value;
    const bodyFile = bodySelect.value;

    // Путь к картинкам (Flask static)
    previewHead.src = `/static/images/${headFile}`;
    previewBody.src = `/static/images/${bodyFile}`;

    // 2. Считаем цену
    let total = 0;
    
    // Цена тела (берем из option)
    const bodyOption = bodySelect.options[bodySelect.selectedIndex];
    total += parseInt(bodyOption.dataset.price, 10) || 0;

    // Аксессуары
    accCheckboxes.forEach(cb => {
      if (cb.checked) {
        total += parseInt(cb.dataset.price, 10) || 0;
      }
    });

    // Обновляем текст цены
    if (finalPriceEl) {
      finalPriceEl.textContent = window.Cart.formatPrice(total) + ' ₽';
    }

    return total;
  }

  if (headSelect && bodySelect) {
    // Слушатели событий
    headSelect.addEventListener('change', updateState);
    bodySelect.addEventListener('change', updateState);
    accCheckboxes.forEach(cb => cb.addEventListener('change', updateState));

    // Первичный расчет
    updateState();

    // Кнопка "В корзину" из конструктора
    addToCartBtn.addEventListener('click', function() {
      const total = updateState(); // Получаем актуальную цену
      
      const headName = headSelect.options[headSelect.selectedIndex].dataset.name;
      const bodyName = bodySelect.options[bodySelect.selectedIndex].dataset.name;
      
      // Собираем список аксессуаров
      const selectedAcc = [];
      accCheckboxes.forEach(cb => {
        if (cb.checked) selectedAcc.push(cb.dataset.name);
      });
      const accString = selectedAcc.length ? ` (+ ${selectedAcc.join(', ')})` : '';

      // Формируем товар
      const item = {
        id: 'custom-' + Date.now(),
        name: `Кот: ${headName} в костюме "${bodyName}"${accString}`,
        price: total,
        // В корзине будем показывать только мордочку, так как собрать коллаж сложно для иконки
        image: headSelect.value 
      };

      window.Cart.add(item);
      window.Cart.render('#cart-contents-create');
      alert('Ваш уникальный котик готов и добавлен в корзину!');
    });
  }
});