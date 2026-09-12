/* SAVAGE PUMP — interacciones */

/* Menú móvil */
(function () {
  var nav = document.querySelector('.nav');
  var burger = document.querySelector('.nav__burger');
  if (!nav || !burger) return;
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.textContent = open ? 'Cerrar' : 'Menú';
  });
})();

/* Revelado al hacer scroll */
(function () {
  var items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  items.forEach(function (el) { io.observe(el); });
})();

/* Galería de producto */
(function () {
  var thumbs = document.querySelectorAll('.pdp__thumbs button');
  var main = document.querySelector('.pdp__main img');
  if (!thumbs.length || !main) return;
  thumbs.forEach(function (b) {
    b.addEventListener('click', function () {
      thumbs.forEach(function (t) { t.setAttribute('aria-selected', 'false'); });
      b.setAttribute('aria-selected', 'true');
      var img = b.querySelector('img');
      main.src = img.src;
      main.alt = img.alt;
    });
  });
})();

/* Selector de talla */
(function () {
  var btns = document.querySelectorAll('.sizes button:not(:disabled)');
  var out = document.querySelector('[data-size-out]');
  if (!btns.length) return;
  btns.forEach(function (b) {
    b.addEventListener('click', function () {
      btns.forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
      b.setAttribute('aria-pressed', 'true');
      if (out) out.textContent = b.dataset.stock;
    });
  });
})();

/* Cantidad en carrito */
(function () {
  document.querySelectorAll('.qty').forEach(function (q) {
    var val = q.querySelector('span');
    q.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () {
        var n = parseInt(val.textContent, 10) + (b.dataset.step === '+' ? 1 : -1);
        val.textContent = Math.max(1, n);
      });
    });
  });
})();
