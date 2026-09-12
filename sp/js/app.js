/* ============================================================
   SAVAGE PUMP — motor de la tienda
   Carrito, pedidos y envío del pedido por WhatsApp.
   ============================================================ */

var SP = (function () {

  var LLAVE_CARRITO = 'sp_carrito';
  var LLAVE_PEDIDOS = 'sp_pedidos';

  /* ---------- almacenamiento seguro ---------- */
  function leer(llave, porDefecto) {
    try {
      var v = localStorage.getItem(llave);
      return v ? JSON.parse(v) : porDefecto;
    } catch (e) { return porDefecto; }
  }
  function guardar(llave, valor) {
    try { localStorage.setItem(llave, JSON.stringify(valor)); return true; }
    catch (e) { return false; }
  }

  /* ---------- productos ---------- */
  function producto(id) {
    return PRODUCTOS.filter(function (p) { return p.id === id; })[0];
  }

  /* ---------- carrito ---------- */
  function carrito() { return leer(LLAVE_CARRITO, []); }
  function guardarCarrito(c) { guardar(LLAVE_CARRITO, c); pintarContador(); }

  function agregar(id, talla, cantidad) {
    cantidad = cantidad || 1;
    var c = carrito();
    var linea = c.filter(function (x) { return x.id === id && x.talla === talla; })[0];
    if (linea) linea.cantidad += cantidad;
    else c.push({ id: id, talla: talla, cantidad: cantidad });
    guardarCarrito(c);
    return { ok: true, mensaje: 'Agregado al carrito.' };
  }

  function cambiarCantidad(id, talla, delta) {
    var c = carrito();
    var linea = c.filter(function (x) { return x.id === id && x.talla === talla; })[0];
    if (!linea) return;
    var nueva = linea.cantidad + delta;
    if (nueva < 1) return;
    if (nueva > 20) return;
    linea.cantidad = nueva;
    guardarCarrito(c);
  }

  function quitar(id, talla) {
    guardarCarrito(carrito().filter(function (x) {
      return !(x.id === id && x.talla === talla);
    }));
  }

  function vaciar() { guardarCarrito([]); }

  function unidades() {
    return carrito().reduce(function (a, x) { return a + x.cantidad; }, 0);
  }

  function total() {
    return carrito().reduce(function (a, x) {
      var p = producto(x.id);
      return a + (p ? p.precio * x.cantidad : 0);
    }, 0);
  }

  function pintarContador() {
    var n = unidades();
    document.querySelectorAll('[data-contador]').forEach(function (el) {
      el.textContent = 'Carrito (' + n + ')';
    });
  }

  /* ---------- pedidos ---------- */
  function pedidos() { return leer(LLAVE_PEDIDOS, []); }

  function numeroPedido() {
    var n = pedidos().length + 1;
    return 'SP-' + String(n).padStart(4, '0');
  }

  function registrarPedido(cliente) {
    var items = carrito().map(function (x) {
      var p = producto(x.id);
      return {
        id: x.id, nombre: p.nombre, talla: x.talla,
        cantidad: x.cantidad, precio: p.precio,
        subtotal: p.precio * x.cantidad
      };
    });
    if (!items.length) return null;

    var pedido = {
      numero: numeroPedido(),
      fecha: new Date().toISOString(),
      cliente: cliente,
      items: items,
      total: items.reduce(function (a, i) { return a + i.subtotal; }, 0),
      estado: 'Nuevo'
    };

    var lista = pedidos();
    lista.push(pedido);
    guardar(LLAVE_PEDIDOS, lista);
    vaciar();
    try { sessionStorage.setItem('sp_ultimo', JSON.stringify(pedido)); } catch (e) {}
    return pedido;
  }

  /* ---------- mensaje de WhatsApp ---------- */
  function textoPedido(pedido) {
    var l = [];
    l.push('*PEDIDO ' + pedido.numero + ' — SAVAGE PUMP*');
    l.push('');
    pedido.items.forEach(function (i) {
      l.push('• ' + i.nombre + ' — Talla ' + i.talla + ' × ' + i.cantidad +
             '  =  ' + CONFIG.moneda + i.subtotal.toFixed(2));
    });
    l.push('');
    l.push('*Total: ' + CONFIG.moneda + pedido.total.toFixed(2) + '*');
    l.push('Pago: ' + pedido.cliente.pago);
    l.push('');
    l.push('*Mis datos*');
    l.push('Nombre: ' + pedido.cliente.nombre);
    l.push('Teléfono: ' + pedido.cliente.telefono);
    if (pedido.cliente.entrega) l.push('Entrega: ' + pedido.cliente.entrega);
    if (pedido.cliente.nota) l.push('Nota: ' + pedido.cliente.nota);
    return l.join('\n');
  }

  function enlaceWhatsApp(pedido) {
    return 'https://wa.me/' + CONFIG.whatsapp + '?text=' +
           encodeURIComponent(textoPedido(pedido));
  }

  /* ---------- utilidades ---------- */
  function precio(n) { return CONFIG.moneda + Number(n).toFixed(2); }

  function aviso(mensaje, tipo) {
    var caja = document.querySelector('[data-aviso]');
    if (!caja) { return; }
    caja.textContent = mensaje;
    caja.className = 'aviso ' + (tipo === 'error' ? 'aviso--error' : 'aviso--ok');
    caja.hidden = false;
    clearTimeout(caja._t);
    caja._t = setTimeout(function () { caja.hidden = true; }, 3500);
  }

  document.addEventListener('DOMContentLoaded', pintarContador);

  return {
    producto: producto, precio: precio, aviso: aviso,
    carrito: carrito, agregar: agregar, cambiarCantidad: cambiarCantidad,
    quitar: quitar, vaciar: vaciar, unidades: unidades, total: total,
    pintarContador: pintarContador,
    registrarPedido: registrarPedido,
    textoPedido: textoPedido, enlaceWhatsApp: enlaceWhatsApp
  };
})();


/* ============================================================
   RENDERIZADO DE LAS PÁGINAS
   ============================================================ */

/* --- Rejilla de productos (inicio y tienda) --- */
function pintarRejilla(selector) {
  var cont = document.querySelector(selector);
  if (!cont) return;
  var lista = PRODUCTOS.filter(function (p) { return p.activo !== false; });
  cont.innerHTML = lista.map(function (p, i) {
    return '' +
    '<a class="card" href="producto.html?id=' + p.id + '">' +
      '<div class="card__frame">' +
        '<img src="' + p.foto + '" alt="' + p.alt + '" loading="lazy">' +
        '<span class="card__no">N&ordm; ' + String(i + 1).padStart(2, '0') + '</span>' +
      '</div>' +
      '<div class="card__body">' +
        '<div><p class="cat">' + p.categoria + '</p><h3>' + p.nombre + '</h3></div>' +
        '<span class="price">' + SP.precio(p.precio) + '</span>' +
      '</div>' +
    '</a>';
  }).join('');
}

/* --- Ficha de producto --- */
function pintarProducto() {
  var cont = document.querySelector('[data-producto]');
  if (!cont) return;

  var id = new URLSearchParams(location.search).get('id') || PRODUCTOS[0].id;
  var p = SP.producto(id) || PRODUCTOS[0];
  document.title = p.nombre + ' \u2014 ' + p.categoria + ' | Savage Pump';

  var mig = document.querySelector('[data-migas-producto]');
  if (mig) mig.textContent = p.nombre;

  var tallasHtml = TALLAS.map(function (t) {
    return '<button data-talla="' + t + '" aria-pressed="false">' + t + '</button>';
  }).join('');

  cont.innerHTML = '' +
  '<div class="pdp">' +
    '<div class="pdp__gallery">' +
      '<div class="pdp__main"><img src="' + p.foto + '" alt="' + p.alt + '"></div>' +
      '<p class="pdp__pie">Frente y espalda de la prenda</p>' +
    '</div>' +
    '<div class="pdp__info">' +
      '<p class="eyebrow">' + p.categoria + '</p>' +
      '<h1>' + p.nombre + '</h1>' +
      '<div class="pdp__price">' + SP.precio(p.precio) + ' USD</div>' +
      '<p class="lede">' + p.descripcion + '</p>' +
      '<div class="rule" style="margin:26px 0 6px"><span>Talla</span><span class="diamond"></span></div>' +
      '<div class="sizes">' + tallasHtml + '</div>' +
      '<p class="stockline" data-stockline>Elige tu talla. Si dudas, revisa la guia de medidas.</p>' +
      '<div class="hero__cta" style="margin:0 0 10px">' +
        '<button class="btn btn--fill" data-agregar>Agregar al carrito</button>' +
        '<a class="btn btn--line" href="tallas.html">Guia de tallas</a>' +
      '</div>' +
      '<div class="aviso" data-aviso hidden></div>' +
      '<div class="acc" style="margin-top:34px">' +
        '<details open><summary>Materiales y confeccion</summary><p>100% algodon peinado, 7.5 oz (260 GSM). Cuello reforzado con cinta al hombro. Costura doble en mangas y bajo. Serigrafia a base de agua: no se cuartea ni endurece la tela.</p></details>' +
        '<details><summary>Como queda</summary><p>Corte oversize real: el hombro cae por debajo del hueso y el cuerpo es recto. Si prefieres un calce mas ajustado, pide una talla menos. Consulta las medidas exactas en la guia de tallas.</p></details>' +
        '<details><summary>Cuidados</summary><p>Lavar del reves en agua fria, ciclo corto. No usar secadora caliente ni cloro. No planchar directamente sobre el estampado.</p></details>' +
        '<details><summary>Como se compra</summary><p>Agregas al carrito, dejas tu nombre y telefono, y el pedido se abre en WhatsApp ya escrito. Ahi confirmamos disponibilidad, el pago y el punto de encuentro para entregarte la prenda.</p></details>' +
      '</div>' +
    '</div>' +
  '</div>';

  var elegida = null;
  var linea = cont.querySelector('[data-stockline]');
  cont.querySelectorAll('.sizes button').forEach(function (b) {
    b.addEventListener('click', function () {
      cont.querySelectorAll('.sizes button').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
      b.setAttribute('aria-pressed', 'true');
      elegida = b.dataset.talla;
      linea.textContent = 'Talla ' + elegida + ' seleccionada.';
    });
  });

  var btn = cont.querySelector('[data-agregar]');
  if (btn) {
    btn.addEventListener('click', function () {
      if (!elegida) { SP.aviso('Elige una talla primero.', 'error'); return; }
      var r = SP.agregar(p.id, elegida, 1);
      SP.aviso(r.ok ? 'Agregado al carrito.' : r.mensaje, r.ok ? 'ok' : 'error');
    });
  }
}

/* --- Carrito --- */
function pintarCarrito() {
  var cont = document.querySelector('[data-carrito]');
  if (!cont) return;
  var c = SP.carrito();

  if (!c.length) {
    cont.innerHTML =
      '<div style="text-align:center;padding:60px 0">' +
        '<p class="lede" style="margin:0 auto 24px">Tu carrito está vacío.</p>' +
        '<a class="btn btn--fill" href="tienda.html">Ver la tienda</a>' +
      '</div>';
    return;
  }

  var lineas = c.map(function (x) {
    var p = SP.producto(x.id);
    return '' +
    '<div class="cart-line">' +
      '<div class="cart-line__img"><img src="' + p.foto + '" alt="' + p.alt + '"></div>' +
      '<div>' +
        '<h4>' + p.nombre + '</h4>' +
        '<p class="meta">' + p.categoria + ' · Talla ' + x.talla + '</p>' +
        '<div class="qty">' +
          '<button data-menos data-id="' + x.id + '" data-talla="' + x.talla + '" aria-label="Quitar una unidad">−</button>' +
          '<span>' + x.cantidad + '</span>' +
          '<button data-mas data-id="' + x.id + '" data-talla="' + x.talla + '" aria-label="Agregar una unidad">+</button>' +
        '</div>' +
      '</div>' +
      '<div class="cart-line__price" style="text-align:right">' +
        '<div class="mono" style="font-size:15px">' + SP.precio(p.precio * x.cantidad) + '</div>' +
        '<button class="mono" style="color:var(--ash);margin-top:10px" data-quitar data-id="' + x.id + '" data-talla="' + x.talla + '">Quitar</button>' +
      '</div>' +
    '</div>';
  }).join('');

  cont.innerHTML =
  '<div class="pdp">' +
    '<div>' + lineas +
      '<p style="margin-top:24px"><a class="mono" href="tienda.html" style="color:var(--ash)">← Seguir comprando</a></p>' +
    '</div>' +
    '<div><div class="summary">' +
      '<p class="eyebrow" style="margin-bottom:16px">Resumen</p>' +
      '<div class="row"><span>' + SP.unidades() + ' prenda(s)</span><span>' + SP.precio(SP.total()) + '</span></div>' +
      '<div class="row total"><span>Total</span><span>' + SP.precio(SP.total()) + '</span></div>' +
      '<a class="btn btn--fill" href="pedido.html" style="width:100%;margin-top:20px">Completar pedido</a>' +
      '<p class="mono" style="color:var(--ash);margin-top:16px;font-size:11px">Confirmas el pedido por WhatsApp en el siguiente paso.</p>' +
    '</div></div>' +
  '</div>';

  cont.querySelectorAll('[data-mas]').forEach(function (b) {
    b.addEventListener('click', function () { SP.cambiarCantidad(b.dataset.id, b.dataset.talla, 1); pintarCarrito(); });
  });
  cont.querySelectorAll('[data-menos]').forEach(function (b) {
    b.addEventListener('click', function () { SP.cambiarCantidad(b.dataset.id, b.dataset.talla, -1); pintarCarrito(); });
  });
  cont.querySelectorAll('[data-quitar]').forEach(function (b) {
    b.addEventListener('click', function () { SP.quitar(b.dataset.id, b.dataset.talla); pintarCarrito(); });
  });
}

/* --- Formulario de pedido --- */
function pintarPedido() {
  var cont = document.querySelector('[data-pedido]');
  if (!cont) return;
  var c = SP.carrito();

  if (!c.length) {
    cont.innerHTML =
      '<div style="text-align:center;padding:60px 0">' +
        '<p class="lede" style="margin:0 auto 24px">No hay nada en tu carrito todavía.</p>' +
        '<a class="btn btn--fill" href="tienda.html">Ver la tienda</a>' +
      '</div>';
    return;
  }

  var resumen = c.map(function (x) {
    var p = SP.producto(x.id);
    return '<div class="row"><span>' + p.nombre + ' · ' + x.talla + ' × ' + x.cantidad + '</span><span>' + SP.precio(p.precio * x.cantidad) + '</span></div>';
  }).join('');

  cont.innerHTML =
  '<div class="pdp">' +
    '<div>' +
      '<div class="field--row">' +
        '<div class="field"><label for="f-nom">Nombre completo</label><input id="f-nom" type="text" autocomplete="name" required></div>' +
        '<div class="field"><label for="f-tel">Teléfono / WhatsApp</label><input id="f-tel" type="tel" autocomplete="tel" required></div>' +
      '</div>' +
      '<div class="field"><label for="f-pago">Método de pago</label>' +
        '<select id="f-pago">' +
          '<option>Yappy</option>' +
          '<option>Transferencia bancaria</option>' +
          '<option>Efectivo al encontrarnos</option>' +
        '</select></div>' +
      '<div class="field"><label for="f-nota">Nota (opcional)</label><textarea id="f-nota" placeholder="Algo que debamos saber"></textarea></div>' +
      '<button class="btn btn--fill" data-confirmar>Confirmar pedido por WhatsApp</button>' +
      '<div class="aviso" data-aviso hidden></div>' +
      '<p class="mono" style="color:var(--ash);margin-top:18px;font-size:11px">Se abrira WhatsApp con tu pedido ya escrito. Solo tienes que enviarlo. No hacemos delivery: coordinamos el punto de encuentro por ahi mismo.</p>' +
    '</div>' +
    '<div><div class="summary">' +
      '<p class="eyebrow" style="margin-bottom:16px">Tu pedido</p>' + resumen +
      '<div class="row total"><span>Total</span><span>' + SP.precio(SP.total()) + '</span></div>' +
    '</div></div>' +
  '</div>';

  cont.querySelector('[data-confirmar]').addEventListener('click', function () {
    var nombre = document.getElementById('f-nom').value.trim();
    var tel    = document.getElementById('f-tel').value.trim();
    if (!nombre) { SP.aviso('Escribe tu nombre.', 'error'); return; }
    if (tel.replace(/\D/g, '').length < 7) { SP.aviso('Escribe un teléfono válido.', 'error'); return; }

    var pedido = SP.registrarPedido({
      nombre: nombre,
      telefono: tel,
      pago: document.getElementById('f-pago').value,
      nota: document.getElementById('f-nota').value.trim()
    });
    if (!pedido) { SP.aviso('El carrito está vacío.', 'error'); return; }
    window.open(SP.enlaceWhatsApp(pedido), '_blank');
    location.href = 'gracias.html';
  });
}

/* --- Página de gracias --- */
function pintarGracias() {
  var cont = document.querySelector('[data-gracias]');
  if (!cont) return;
  var p = null;
  try { p = JSON.parse(sessionStorage.getItem('sp_ultimo')); } catch (e) {}
  if (!p) return;
  cont.innerHTML =
    '<div class="plate" style="padding:28px;text-align:left;max-width:520px;margin:0 auto">' +
      '<p class="eyebrow" style="margin-bottom:12px">Pedido ' + p.numero + '</p>' +
      p.items.map(function (i) {
        return '<div class="row mono" style="display:flex;justify-content:space-between;padding:6px 0">' +
               '<span>' + i.nombre + ' · ' + i.talla + ' × ' + i.cantidad + '</span><span>' + SP.precio(i.subtotal) + '</span></div>';
      }).join('') +
      '<div class="row mono" style="display:flex;justify-content:space-between;padding:14px 0 0;margin-top:10px;border-top:1px solid var(--hair);font-size:15px">' +
      '<span>Total</span><span>' + SP.precio(p.total) + '</span></div>' +
      '<p class="mono" style="color:var(--ash);margin-top:16px;font-size:11px">Pago: ' + p.cliente.pago + '</p>' +
      '<a class="btn btn--line" style="margin-top:18px" href="' + SP.enlaceWhatsApp(p) + '" target="_blank">Reenviar por WhatsApp</a>' +
    '</div>';
}

/* --- Arranque --- */
document.addEventListener('DOMContentLoaded', function () {
  pintarRejilla('[data-rejilla]');
  pintarProducto();
  pintarCarrito();
  pintarPedido();
  pintarGracias();
  SP.pintarContador();
});
