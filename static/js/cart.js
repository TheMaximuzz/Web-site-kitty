function getLocalCart() {
    try {
      return JSON.parse(localStorage.getItem('koto_cart') || '[]');
    } catch (e) {
      return [];
    }
  }
  
  function setLocalCart(cart) {
    localStorage.setItem('koto_cart', JSON.stringify(cart));
  }
  
  function addToLocalCart(item) {
    const cart = getLocalCart();
    cart.push(item);
    setLocalCart(cart);
  }
  
  function removeFromLocalCart(index) {
    const cart = getLocalCart();
    cart.splice(index, 1);
    setLocalCart(cart);
  }
  
  function clearLocalCart() {
    setLocalCart([]);
  }
  
  function formatPrice(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
  
  function renderCart(selector) {
    const container = document.querySelector(selector);
    if (!container) return;
  
    const cart = getLocalCart();
    const cartId = selector.slice(1);
  
    // очистка старых обработчиков
    const oldRemoveBtns = container.querySelectorAll('.remove-btn');
    oldRemoveBtns.forEach(btn => btn.replaceWith(btn.cloneNode(true)));
  
    const oldClearBtn = container.querySelector(`#clear-cart-btn-${cartId}`);
    if (oldClearBtn) oldClearBtn.replaceWith(oldClearBtn.cloneNode(true));
  
    // пустая корзина
    if (!cart.length) {
      container.innerHTML = '';
      container.classList.add('hidden');
      const parent = container.closest('.cart-box');
      if (parent) parent.querySelector('.cart-empty').classList.remove('hidden');
      return;
    }
  
    // коризна если в ней товары
    container.classList.remove('hidden');
    const parent = container.closest('.cart-box');
    if (parent) parent.querySelector('.cart-empty').classList.add('hidden');
  
    let html = '<ul style="list-style:none;padding:0;margin:0">';
    let total = 0;
  
    cart.forEach((item, idx) => {
      const price = parseInt(item.price, 10) || 0;
      total += price;
  
      html += `
        <li style="padding:8px 0;border-bottom:1px solid #f0f4f8">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div style="max-width:130px">${item.name}</div>
            <div style="margin-right:8px">${formatPrice(price)} ₽</div>
            <button class="remove-btn" data-index="${idx}" style="background:#ff4d4f;color:#fff;border:none;padding:4px 8px;border-radius:4px;cursor:pointer;font-size:12px">X</button>
          </div>
        </li>`;
    });
  
    html += `
      </ul>
      <div style="padding-top:10px;display:flex;justify-content:space-between;align-items:center;font-weight:700">
        <span>Итого: ${formatPrice(total)} ₽</span>
        <button id="clear-cart-btn-${cartId}" style="background:#ff4d4f;color:#fff;border:none;padding:6px 10px;border-radius:6px;cursor:pointer;font-size:14px">Очистить корзину</button>
      </div>`;
  
    container.innerHTML = html;
  
    // новые обработчики
    container.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const idx = parseInt(this.dataset.index, 10);
        if (confirm('Вы точно хотите убрать из корзины котика?')) {
          removeFromLocalCart(idx);
          renderCart(selector);
          const other = selector === '#cart-contents' ? '#cart-contents-create' : '#cart-contents';
          renderCart(other);
        }
      });
    });
  
    const clearBtn = container.querySelector(`#clear-cart-btn-${cartId}`);
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        if (confirm('Вы точно хотите очистить корзину полностью?')) {
          clearLocalCart();
          renderCart(selector);
          const other = selector === '#cart-contents' ? '#cart-contents-create' : '#cart-contents';
          renderCart(other);
        }
      });
    }
  }
  

  window.Cart = {
    add: addToLocalCart,
    render: renderCart,
    formatPrice: formatPrice
  };