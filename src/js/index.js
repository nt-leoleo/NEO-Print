// ===== Datos de ejemplo (mock) =====
const products = [
  {
    id: 1,
    title: "MODEL A1",
    price: 12990,
    tag: "Importado",
    img: "",
    gender: "",
    desc: "Descripción por defecto",
  },
  {
    id: 2,
    title: "MODEL B1",
    price: 9990,
    tag: "Importado",
    img: "",
    gender: "",
    desc: "Descripción por defecto",
  },
  {
    id: 3,
    title: "MODEL A2",
    price: 15990,
    tag: "Importado",
    img: "",
    gender: "",
    desc: "Descripción por defecto",
  },
  {
    id: 4,
    title: "MODEL B2",
    price: 17990,
    tag: "Modelo propio",
    img: "",
    gender: "",
    desc: "Descripción por defecto",
  },
  {
    id: 5,
    title: "MODEL C1",
    price: 7990,
    tag: "nuevos",
    img: "",
    gender: "",
    desc: "Descripción por defecto",
  },
  {
    id: 6,
    title: "MODEL C2",
    price: 13990,
    tag: "Modelo propio",
    img: "",
    gender: "",
    desc: "Descripción por defecto",
  },
];

// Estado simple
const state = { cart: {} };

// util
const $ = (q) => document.querySelector(q);
const $$ = (q) => Array.from(document.querySelectorAll(q));

function currency(n) {
  return "$" + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Render productos
function renderProducts(list) {
  const grid = $("#productGrid");
  grid.innerHTML = "";
  list.forEach((p) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
        <div class="thumb" data-id="${p.id}">
          <div style="text-align:center">
            <div style="font-weight:800">MODEL</div>
            <div style="font-size:.75rem; margin-top:.5rem">${p.tag.toUpperCase()}</div>
          </div>
        </div>
        <div style="margin-top:.5rem">
          <div style="display:flex; justify-content:space-between; align-items:center">
            <div style="font-weight:700">${p.title}</div>
            <div class="muted">${p.gender}</div>
          </div>
          <div class="price">${currency(p.price)}</div>
          <div class="muted" style="margin-top:.35rem">${p.desc}</div>
        </div>
      `;
    grid.appendChild(card);
    card
      .querySelector(".thumb")
      .addEventListener("click", () => openProduct(p));
  });
}

// abrir modal
function openModal(html) {
  $("#sheetContent").innerHTML = html;
  $("#modal").classList.add("show");
}
function closeModal() {
  $("#modal").classList.remove("show");
}

function openProduct(p) {
  const html = `
      <div style="display:flex; justify-content:space-between; align-items:center">
        <div style="font-weight:800">${p.title}</div>
        <button onclick="closeModal()">✖</button>
      </div>
      <div style="margin-top:1rem; display:flex; gap:1rem">
        <div style="flex:1">
          <div style="background:linear-gradient(135deg, rgba(124,58,237,0.14), rgba(0,191,166,0.08)); border-radius:12px; padding:1.2rem; text-align:center">👟</div>
        </div>
        <div style="flex:1">
          <div style="font-weight:700; font-size:1.1rem">${currency(
            p.price
          )}</div>
          <div class="muted" style="margin-top:.5rem">${p.desc}</div>
          <div style="margin-top:1rem">
            <label class="muted">Talle</label>
            <select id="sizeSelect" style="width:100%; padding:.6rem; border-radius:10px; margin-top:.35rem; background:transparent; border:1px solid rgba(255,255,255,0.04)">
              <option>38</option><option>39</option><option>40</option><option>41</option>
            </select>
          </div>
          <div style="margin-top:1rem; display:flex; gap:.6rem">
            <button class="btn" id="addCart">Agregar al carrito</button>
            <button style="padding:.6rem .8rem; border-radius:12px; background:transparent; border:1px solid rgba(255,255,255,0.06)">Comprar ahora</button>
          </div>
        </div>
      </div>
    `;
  openModal(html);
  setTimeout(() => {
    document
      .getElementById("addCart")
      .addEventListener("click", () => addToCart(p));
  }, 100);
}

function addToCart(p) {
  const key = p.id;
  state.cart[key] = state.cart[key] || { product: p, qty: 0 };
  state.cart[key].qty += 1;
  updateCartUI();
  closeModal();
  notify("Agregado al carrito");
}

function updateCartUI() {
  const count = Object.values(state.cart).reduce((s, i) => s + i.qty, 0);
  const badge = $("#cartCount");
  if (count > 0) {
    badge.style.display = "inline-block";
    badge.textContent = count;
  } else badge.style.display = "none";
}

function showCartSheet() {
  const items = Object.values(state.cart);
  if (items.length === 0) {
    openModal(
      '<div style="text-align:center; padding:2rem"><div style="font-size:1.2rem; font-weight:700">Tu carrito está vacío</div><div class="muted" style="margin-top:.6rem">Agrega productos y los vas a ver aquí</div></div>'
    );
    return;
  }
  let total = 0;
  const html = `
      <div style="display:flex; justify-content:space-between; align-items:center"><div style="font-weight:800">Carrito</div><button onclick="closeModal()">✖</button></div>
      <div style="margin-top:1rem; display:grid; gap:.6rem">
        ${items
          .map((it) => {
            total += it.qty * it.product.price;
            return `
          <div style="display:flex; justify-content:space-between; align-items:center; gap:.6rem; padding:.5rem; border-radius:10px; background:rgba(255,255,255,0.01)">
            <div style="flex:1">
              <div style="font-weight:700">${it.product.title}</div>
              <div class="muted">${currency(it.product.price)} x ${it.qty}</div>
            </div>
            <div>
              <button onclick="changeQty(${it.product.id}, -1)">−</button>
              <span style="padding:0 .6rem">${it.qty}</span>
              <button onclick="changeQty(${it.product.id}, 1)">+</button>
            </div>
          </div>
        `;
          })
          .join("")}
      </div>
      <div style="margin-top:1rem; display:flex; justify-content:space-between; align-items:center">
        <div class="muted">Total</div>
        <div style="font-weight:800">${currency(total)}</div>
      </div>
      <div style="margin-top:1rem"><button class="btn" onclick="checkout()">Ir al pago</button></div>
    `;
  openModal(html);
}

function changeQty(id, delta) {
  if (!state.cart[id]) return;
  state.cart[id].qty += delta;
  if (state.cart[id].qty <= 0) delete state.cart[id];
  updateCartUI();
  showCartSheet();
}

function checkout() {
  openModal(
    '<div style="text-align:center; padding:2rem"><div style="font-weight:800">Gracias — proceso de pago simulado</div><div class="muted" style="margin-top:.6rem">Esta demo no procesa pagos reales</div><div style="margin-top:1rem"><button class="btn" onclick="confirmOrder()">Confirmar</button></div></div>'
  );
}
function confirmOrder() {
  state.cart = {};
  updateCartUI();
  openModal(
    '<div style="text-align:center; padding:2rem"><div style="font-weight:800">Pedido confirmado</div><div class="muted" style="margin-top:.6rem">Te llegará un mail (simulado)</div></div>'
  );
}

function notify(msg) {
  const n = document.createElement("div");
  n.textContent = msg;
  n.style.cssText =
    "position:fixed; left:50%; transform:translateX(-50%); bottom:90px; background:rgba(0,0,0,0.6); padding:.6rem 1rem; border-radius:10px; z-index:200;";
  document.body.appendChild(n);
  setTimeout(() => n.remove(), 1500);
}

// búsqueda simple
$("#search").addEventListener("input", (e) => {
  const q = e.target.value.trim().toLowerCase();
  if (!q) renderProducts(products);
  else
    renderProducts(
      products.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.tag.toLowerCase().includes(q) ||
          p.desc.toLowerCase().includes(q)
      )
    );
});

// filtros
$$("#filters .chip").forEach((c) =>
  c.addEventListener("click", () => {
    const f = c.dataset.filter;
    if (f === "all") renderProducts(products);
    else renderProducts(products.filter((p) => p.tag === f || p.gender === f));
  })
);

// botones
$("#filterBtn").addEventListener("click", () => {
  openModal(
    '<div style="display:flex; justify-content:space-between; align-items:center"><div style="font-weight:800">Filtrar</div><button onclick="closeModal()">✖</button></div><div style="margin-top:1rem">\n      <label class="muted">Categoría</label>\n      <div style="display:flex; gap:.6rem; margin-top:.4rem">\n        <button class="chip" onclick="applyFilter(\'deportivas\')">Deportivas</button>\n        <button class="chip" onclick="applyFilter(\'casuales\')">Casuales</button>\n      </div>\n    </div>'
  );
});

function applyFilter(f) {
  closeModal();
  renderProducts(products.filter((p) => p.tag === f));
}

$("#openCart").addEventListener("click", showCartSheet);
$("#cartBtn").addEventListener("click", showCartSheet);

// cerrar modal clic fuera
$("#modal").addEventListener("click", (e) => {
  if (e.target.id === "modal") closeModal();
});

// inicial
renderProducts(products);
