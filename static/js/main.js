// static/js/main.js

document.addEventListener('DOMContentLoaded', function () {

  // === Добавление готовых котиков ===
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', function () {
      const id = this.dataset.id;
      const name = this.dataset.name;
      const price = parseInt(this.dataset.price, 10) || 0;

      window.Cart.add({ id, name, price, qty: 1 });
      window.Cart.render('#cart-contents');
      alert(`${name} добавлен в корзину`);
    });
  });

  // === Создание своего котика ===
  const accCheckboxes = document.querySelectorAll('.acc-checkbox');
  const basePriceEl = document.getElementById('finalPrice');
  let basePrice = 0;

  if (basePriceEl) {
    basePrice = parseInt(basePriceEl.textContent.replace(/\s|₽/g, ''), 10) || 0;
    basePriceEl.textContent = window.Cart.formatPrice(basePrice) + ' ₽';
  }

  function recalcCreatePrice() {
    let sum = basePrice;
    accCheckboxes.forEach(cb => {
      if (cb.checked) sum += parseInt(cb.dataset.price, 10) || 0;
    });
    if (basePriceEl) {
      basePriceEl.textContent = window.Cart.formatPrice(sum) + ' ₽';
    }
  }

  accCheckboxes.forEach(cb => cb.addEventListener('change', recalcCreatePrice));

  const addToCartBtn = document.getElementById('addToCartBtn');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function () {
      const breed = document.getElementById('breed').value;
      const color = document.getElementById('color').value;

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
        name: `Свой котик (${breed}, ${color})`,
        price: total,
        config: { breed, color, accessories: selectedAcc }
      };

      window.Cart.add(item);
      window.Cart.render('#cart-contents-create');
      alert('Ваш котик добавлен в корзину');
    });
  }

  // === Инициализация корзин при загрузке ===
  window.Cart.render('#cart-contents');
  window.Cart.render('#cart-contents-create');
});