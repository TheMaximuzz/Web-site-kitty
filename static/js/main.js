// Универсальные утилиты для добавления в корзину и отображения её содержимого
document.addEventListener('DOMContentLoaded', function() {
  // Добавление с карточек
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = btn.dataset.id;
      const name = btn.dataset.name;
      const price = parseInt(btn.dataset.price, 10) || 0;
      addToLocalCart({id, name, price, qty:1});
      renderCart('#cart-contents');
      alert(name + ' добавлен в корзину');
    });
  });

  // Страница create: подсчёт итоговой цены
  const accCheckboxes = document.querySelectorAll('.acc-checkbox');
  const basePriceEl = document.getElementById('finalPrice');
  let basePrice = 0;
  // Попробуем извлечь цену из элемента (если есть)
  if (basePriceEl) {
    basePrice = parseInt(basePriceEl.textContent.replace(/\s|₽/g, ''), 10) || 0;
    // обновим форматирование
    basePriceEl.textContent = formatPrice(basePrice) + ' ₽';
  }

  function recalcCreatePrice() {
    let sum = basePrice;
    accCheckboxes.forEach(cb => {
      if (cb.checked) sum += parseInt(cb.dataset.price, 10) || 0;
    });
    if (basePriceEl) basePriceEl.textContent = formatPrice(sum) + ' ₽';
  }

  accCheckboxes.forEach(cb => cb.addEventListener('change', recalcCreatePrice));

  // кнопка "Добавить в корзину" на create
  const addToCartBtn = document.getElementById('addToCartBtn');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function() {
      // собираем конфигурацию
      const breed = document.getElementById('breed').value;
      const color = document.getElementById('color').value;
      const pattern = document.getElementById('pattern').value;

      let total = basePrice;
      const selectedAcc = [];
      accCheckboxes.forEach(cb => {
        if (cb.checked) {
          total += parseInt(cb.dataset.price, 10) || 0;
          selectedAcc.push(cb.parentNode.textContent.trim());
        }
      });

      const item = {
        id: 'custom-' + Date.now(),
        name: 'Свoй котик (' + breed + ', ' + color + ')',
        price: total,
        config: {breed, color, pattern, accessories: selectedAcc}
      };

      addToLocalCart(item);
      renderCart('#cart-contents-create');
      alert('Ваш котик добавлен в корзину');
    });
  }

  // initial render
  renderCart('#cart-contents');
  renderCart('#cart-contents-create');
});

// localStorage cart helpers
function getLocalCart(){
  try {
    return JSON.parse(localStorage.getItem('koto_cart') || '[]');
  } catch(e){
    return [];
  }
}
function setLocalCart(cart){
  localStorage.setItem('koto_cart', JSON.stringify(cart));
}
function addToLocalCart(item){
  const cart = getLocalCart();
  cart.push(item);
  setLocalCart(cart);
}
function formatPrice(n){
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function renderCart(selector){
  const container = document.querySelector(selector);
  if (!container) return;
  const cart = getLocalCart();
  if (!cart.length){
    container.innerHTML = '';
    container.classList.add('hidden');
    // show empty box nearby
    const parent = container.closest('.cart-box');
    if (parent){
      parent.querySelector('.cart-empty').classList.remove('hidden');
    }
    return;
  }
  container.classList.remove('hidden');
  const parent = container.closest('.cart-box');
  if (parent){
    parent.querySelector('.cart-empty').classList.add('hidden');
  }

  let html = '<ul style="list-style:none;padding:0;margin:0">';
  let total = 0;
  cart.forEach((it, idx) => {
    html += `<li style="padding:8px 0;border-bottom:1px solid #f0f4f8">
      <div style="display:flex;justify-content:space-between">
        <div style="max-width:160px">${it.name}</div>
        <div>${formatPrice(it.price)} ₽</div>
      </div>
    </li>`;
    total += parseInt(it.price,10) || 0;
  });
  html += `</ul><div style="padding-top:10px;font-weight:700">Итого: ${formatPrice(total)} ₽</div>`;
  container.innerHTML = html;
}
