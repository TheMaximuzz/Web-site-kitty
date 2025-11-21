document.addEventListener('DOMContentLoaded', function() {

  /* =========================
     CART (работа с локальной корзиной)
     ========================= */
  function getLocalCart(){
    try { return JSON.parse(localStorage.getItem('koto_cart') || '[]'); }
    catch(e){ return []; }
  }
  function setLocalCart(cart){ localStorage.setItem('koto_cart', JSON.stringify(cart)); }
  function addToLocalCart(item){
    const cart = getLocalCart();
    cart.push(item);
    setLocalCart(cart);
  }
  function formatPrice(n){ return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }

  function renderCart(selector){
    const container = document.querySelector(selector);
    if (!container) return;
    const cart = getLocalCart();
    if (!cart.length){
      container.innerHTML = '';
      container.classList.add('hidden');
      const parent = container.closest('.cart-box');
      if (parent){ parent.querySelector('.cart-empty').classList.remove('hidden'); }
      return;
    }
    container.classList.remove('hidden');
    const parent = container.closest('.cart-box');
    if (parent){ parent.querySelector('.cart-empty').classList.add('hidden'); }

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

  renderCart('#cart-contents');
  renderCart('#cart-contents-create');



  /* =========================
     Кастомизация кота (основная логика)
     ========================= */

  const previewImg = document.getElementById('previewImage');
  const breedSelect = document.getElementById('breed');
  const colorSelect = document.getElementById('color');
  const patternSelect = document.getElementById('pattern');
  const finalPriceEl = document.getElementById('finalPrice');

  if (previewImg && breedSelect && colorSelect && patternSelect) {

    /*  
       👉 Главная функция,
       формирует имя файла автоматически:
       breed_color_pattern.jpg
    */
    function getCatImage(breed, color, pattern) {
      return `/static/images/${breed}_${color}_${pattern}.jpg`;
    }

    function updatePreview(){
      const breed = breedSelect.value;
      const color = colorSelect.value;
      const pattern = patternSelect.value;

      const imgPath = getCatImage(breed, color, pattern);
      previewImg.src = imgPath;
    }

    breedSelect.addEventListener('change', updatePreview);
    colorSelect.addEventListener('change', updatePreview);
    patternSelect.addEventListener('change', updatePreview);

    updatePreview();


    /* =========================
       Кнопка "Добавить в корзину"
       ========================= */
    const addToCartBtn = document.getElementById('addToCartBtn');
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', function(){
        const breed = breedSelect.value;
        const color = colorSelect.value;
        const pattern = patternSelect.value;

        let total = 0;
        if (finalPriceEl) {
          total = parseInt(finalPriceEl.textContent.replace(/\s|₽/g, ''), 10) || 0;
        }

        const accCheckboxes = document.querySelectorAll('.acc-checkbox');
        const selectedAcc = [];
        accCheckboxes.forEach(cb => {
          if (cb.checked){
            total += parseInt(cb.dataset.price, 10) || 0;
            selectedAcc.push(cb.value);
          }
        });

        const imageFile = `${breed}_${color}_${pattern}.jpg`;

        const item = {
          id: 'custom-' + Date.now(),
          name: `Свoй котик (${breed}, ${color}, ${pattern})`,
          price: total,
          image: imageFile,
          config: {breed, color, pattern, accessories: selectedAcc}
        };

        addToLocalCart(item);
        renderCart('#cart-contents-create');
        alert('Ваш котик добавлен в корзину');
      });
    }

  }

});
