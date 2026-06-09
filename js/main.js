// ============================================================
// DATOS DE PRODUCTOS
// ============================================================

const productos = [
  {
    nombre: 'sorrentinos1',
    titulo: 'Sorrentinos de ricota y cebolla',
    descripcion: 'Cebolla caramelizada y parmesano (opcional)',
    imagen: 'img/sorrentinos-mp - copia.webp',
    categoria: 'verdura',
    opciones: [
      { desc: '1kg (32u)', precio: 5000 },
      { desc: '1/2kg (16u)', precio: 2700 },
      { desc: '250g (8u)', precio: 1500 }
    ]
  },
  {
    nombre: 'sorrentinos2',
    titulo: 'Sorrentinos ricota, jamón y queso',
    descripcion: 'Con manteca de salvia y nuez moscada',
    imagen: 'img/sorrentinos-mp.webp',
    categoria: 'queso',
    opciones: [
      { desc: '1kg (32u)', precio: 4800 },
      { desc: '1/2kg (16u)', precio: 2600 },
      { desc: '250g (8u)', precio: 1400 }
    ]
  },
  {
    nombre: 'sorrentinos3',
    titulo: 'Sorrentinos de carne y espinaca',
    descripcion: 'Masa casera con relleno suave y sabroso',
    imagen: 'img/sorrentinos-mp.webp',
    categoria: 'carne',
    opciones: [
      { desc: '1kg (48u)', precio: 4700 },
      { desc: '1/2kg (24u)', precio: 2500 },
      { desc: '250g (12u)', precio: 1350 }
    ]
  },
  {
    nombre: 'sorrentinos4',
    titulo: 'Sorrentinos de pollo y espinaca',
    descripcion: 'Ideal para servir con salsas suaves',
    imagen: 'img/sorrentinos-mp.webp',
    categoria: 'carne',
    opciones: [
      { desc: '1kg (40u)', precio: 5100 },
      { desc: '1/2kg (20u)', precio: 2800 },
      { desc: '250g (10u)', precio: 1550 }
    ]
  },
  {
    nombre: 'sorrentinos5',
    titulo: 'Sorrentinos de bondiola desmechada',
    descripcion: 'Hechos a mano, súper suaves',
    imagen: 'img/sorrentinos-mp.webp',
    categoria: 'carne',
    opciones: [
      { desc: '1kg', precio: 4200 },
      { desc: '1/2kg', precio: 2300 },
      { desc: '250g', precio: 1200 }
    ]
  }
];

// ============================================================
// CATEGORÍAS
// ============================================================

// Categorías para la pantalla de inicio
const categoriasHome = [
  {
    id: 'sorrentinos',
    label: 'Sorrentinos',
    emoji: '🍝',
    imagen: 'img/sorrentinos-mp.webp'
  },
  {
    id: 'fideos',
    label: 'Fideos Caseros',
    emoji: '🍜',
    imagen: 'img/Fideos-caseros.png'
  },
  {
    id: 'pizzas',
    label: 'Pizzas',
    emoji: '🍕',
    imagen: 'img/Pizza-espepecial.png'
  },
  {
    id: 'focaccias',
    label: 'Malfattis',
    emoji: '🫓',
    imagen: 'img/Malfatis-verdura.png'
  }
];

// Categorías para los filtros dentro de la página de productos
const categoriasFiltro = [
  { id: 'todas', label: 'Todas' },
  { id: 'carne', label: '🥩 Carne' },
  { id: 'verdura', label: '🥬 Verdura' },
  { id: 'queso', label: '🧀 Queso' }
];

// ============================================================
// UTILIDADES
// ============================================================

const formatPrecio = (precio) => `$${precio.toLocaleString('es-AR')}`;

const getCarrito = () => JSON.parse(localStorage.getItem('carrito')) || [];

const guardarCarrito = (data) => localStorage.setItem('carrito', JSON.stringify(data));

const buildDireccion = ({ calle, numero, esEdificio, piso, portero }) => {
  let dir = `${calle} ${numero}`;
  if (esEdificio) {
    if (piso) dir += `, Piso ${piso}`;
    if (portero) dir += `, Portero ${portero}`;
  }
  return dir;
};

const buildMensajeWhatsApp = ({ nombre, telefono, direccion, pago, resumen, total }) => {
  let mensaje = `Hola! Soy ${nombre} (${telefono}) y quiero hacer un pedido:\n\n${resumen}\nTOTAL: ${formatPrecio(total)}\n\n📍 Dirección de entrega: ${direccion}\n💳 Método de pago: ${pago}`;
  if (pago === 'Transferencia') mensaje += '\nAlias: alias.negocio.mp';
  mensaje += '\n\n¡Gracias!';
  return mensaje;
};

// ============================================================
// LÓGICA DEL FORMULARIO DE PRODUCTOS
// ============================================================

function calcularTotal() {
  const checked = document.querySelectorAll('input[type="checkbox"][name]:checked');
  let total = 0;

  checked.forEach((cb) => {
    const precio = parseInt(cb.dataset.precio);
    const cantidad = parseInt(cb.parentElement.querySelector('.cantidad').value) || 1;
    total += precio * cantidad;
  });

  const totalEl = document.getElementById('total');
  if (totalEl) totalEl.textContent = `Total: ${formatPrecio(total)}`;
}

function crearCheckboxLabel(producto, opcion) {
  const label = document.createElement('label');
  label.innerHTML = `
    <input type="checkbox" name="${producto.nombre}" value="${opcion.desc}"
      data-precio="${opcion.precio}" data-descripcion="${opcion.desc}">
    ${opcion.desc} – ${formatPrecio(opcion.precio)}
    <input class="cantidad" type="number" min="0" value="0">
  `;
  return label;
}

function crearTarjetaProducto(producto) {
  const div = document.createElement('div');
  div.className = 'producto';
  div.dataset.categoria = producto.categoria;

  const img = document.createElement('img');
  img.src = producto.imagen;
  img.alt = producto.titulo;

  const info = document.createElement('div');
  info.style.flex = '1';
  info.innerHTML = `<strong>${producto.titulo}</strong><br><small>${producto.descripcion}</small><br><br>`;

  producto.opciones.forEach((op) => {
    info.appendChild(crearCheckboxLabel(producto, op));
  });

  div.appendChild(img);
  div.appendChild(info);
  return div;
}

function agregarEventosCheckbox(checkbox) {
  checkbox.addEventListener('change', () => {
    const cantidadInput = checkbox.parentElement.querySelector('.cantidad');
    if (checkbox.checked && (!cantidadInput.value || parseInt(cantidadInput.value) <= 0)) {
      cantidadInput.value = 1;
    }
    if (!checkbox.checked) {
      cantidadInput.value = 0;
    }
    calcularTotal();
  });
}

function cargarSeleccionGuardada() {
  getCarrito().forEach(item => {
    document.querySelectorAll(`input[type="checkbox"][name="${item.nombre}"]`).forEach(cb => {
      if (cb.value === item.descripcion) {
        cb.checked = true;
        cb.parentElement.querySelector('.cantidad').value = item.cantidad;
      }
    });
  });
}

function mostrarMensajePedidoEnviado(contenedor) {
  const msg = document.createElement('div');
  msg.className = 'mensaje-exito';
  msg.textContent = '✅ ¡Tu pedido fue enviado con éxito!';
  contenedor.parentElement.insertBefore(msg, contenedor);

  localStorage.removeItem('carrito');
  setTimeout(() => {
    msg.remove();
    localStorage.removeItem('pedidoEnviado');
    window.location.reload();
  }, 3000);
}

// ============================================================
// FILTROS POR CATEGORÍA
// ============================================================

function renderFiltros() {
  const filtrosDiv = document.getElementById('filtros');
  if (!filtrosDiv) return;

  categoriasFiltro.forEach(cat => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = cat.label;
    btn.dataset.categoria = cat.id;
    btn.className = cat.id === 'todas' ? 'filtro-btn activo' : 'filtro-btn';

    btn.addEventListener('click', () => {
      document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('activo'));
      btn.classList.add('activo');
      filtrarProductos(cat.id);
    });

    filtrosDiv.appendChild(btn);
  });
}

function filtrarProductos(categoriaId) {
  document.querySelectorAll('.producto').forEach(card => {
    const visible = categoriaId === 'todas' || card.dataset.categoria === categoriaId;
    card.style.display = visible ? 'flex' : 'none';
  });
}

// ============================================================
// RENDER PANTALLA DE INICIO
// ============================================================

function renderCategoriasHome() {
  const grid = document.getElementById('categoriasGrid');
  if (!grid) return;

  categoriasHome.forEach(cat => {
    const card = document.createElement('div');
    card.className = 'categoria-card';
    card.style.backgroundImage = `url('${cat.imagen}')`;
    card.innerHTML = `<div class="categoria-overlay"></div>
      <span class="categoria-label">${cat.emoji} ${cat.label}</span>`;
    card.addEventListener('click', () => {
      window.location.href = `/productos?cat=${cat.id}`;
    });
    grid.appendChild(card);
  });
}

// ============================================================
// RENDER PRINCIPAL - PÁGINA INDEX
// ============================================================

function renderProductos(categoriaInicial = null) {
  const form = document.getElementById('formProductos');
  form.innerHTML = '';

  // Botón volver al inicio
  const btnVolver = document.createElement('button');
  btnVolver.type = 'button';
  btnVolver.className = 'btn-secundario btn-volver';
  btnVolver.innerHTML = '← Volver';
  btnVolver.addEventListener('click', () => window.location.href = '/');
  form.parentElement.insertBefore(btnVolver, form.previousElementSibling);

  renderFiltros();

  productos.forEach(producto => {
    const card = crearTarjetaProducto(producto);
    form.appendChild(card);
  });

  document.querySelectorAll('.cantidad').forEach(input => {
    input.addEventListener('input', calcularTotal);
  });

  document.querySelectorAll('input[type="checkbox"][name]').forEach(agregarEventosCheckbox);

  // Aplicar filtro inicial si viene de la home
  if (categoriaInicial) {
    const btnActivo = document.querySelector(`.filtro-btn[data-categoria="${categoriaInicial}"]`);
    if (btnActivo) {
      document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('activo'));
      btnActivo.classList.add('activo');
      filtrarProductos(categoriaInicial);
    }
  }

  cargarSeleccionGuardada();
  calcularTotal();

  if (localStorage.getItem('pedidoEnviado') === 'true') {
    mostrarMensajePedidoEnviado(form);
  }
}

function irAlCarrito() {
  const checked = document.querySelectorAll('input[type="checkbox"][name]:checked');

  if (checked.length === 0) {
    alert('Por favor, seleccioná al menos un producto.');
    return;
  }

  const seleccionados = Array.from(checked).map(cb => ({
    nombre: cb.name,
    descripcion: cb.dataset.descripcion,
    precio: parseInt(cb.dataset.precio),
    cantidad: parseInt(cb.parentElement.querySelector('.cantidad').value) || 1
  }));

  guardarCarrito(seleccionados);
  window.location.href = '/carrito';
}

// ============================================================
// RENDER CARRITO
// ============================================================

function buildResumen(carrito) {
  let total = 0;
  let resumen = '';

  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    resumen += `- ${item.nombre} – ${item.descripcion} x${item.cantidad} = ${formatPrecio(subtotal)}\n`;
  });

  return { resumen, total };
}

function renderCarrito() {
  const carrito = getCarrito();
  const contenedor = document.getElementById('carrito');
  const { resumen, total } = buildResumen(carrito);

  contenedor.innerHTML = `
    <div id="formCarrito">
      <div class="form-group">
        <label>Nombre y Apellido:</label>
        <input type="text" id="nombre" required placeholder="Ej: María García">
      </div>
      <div class="form-group">
        <label>Número de contacto:</label>
        <input type="text" id="telefono" required placeholder="Ej: 3472 123456">
      </div>
      <div class="form-group">
        <label>Dirección de entrega:</label>
        <div class="direccion-fila">
          <input type="text" id="calle" required placeholder="Calle" style="flex:2">
          <input type="text" id="numeroCalle" required placeholder="Número" style="flex:1">
        </div>
        <div class="edificio-toggle">
          <label class="toggle-label">
            <input type="checkbox" id="esEdificio"> ¿Es edificio?
          </label>
        </div>
        <div id="edificioFields" style="display:none;">
          <div class="direccion-fila" style="margin-top:10px;">
            <input type="text" id="piso" placeholder="Piso (ej: 3°)" style="flex:1">
            <input type="text" id="portero" placeholder="Portero / Depto (ej: B)" style="flex:1">
          </div>
        </div>
      </div>
      <div class="form-group">
        <label>Método de pago:</label>
        <div class="opciones-pago">
          <label><input type="radio" name="pago" value="Efectivo" checked> Efectivo</label>
          <label><input type="radio" name="pago" value="Transferencia"> Transferencia</label>
        </div>
        <div id="aliasBox" style="display:none;">
          <strong>Alias para transferir:</strong> alias.negocio.mp
        </div>
      </div>
      <div class="form-group">
        <h3>Resumen del pedido:</h3>
        <pre id="resumenPedido">${resumen}
TOTAL: ${formatPrecio(total)}</pre>
      </div>
      <button type="button" id="btnEnviar">Enviar Pedido por WhatsApp</button>
      <button type="button" onclick="window.location.href='/'" class="btn-secundario">← Volver al Menú</button>
    </div>
  `;

  document.querySelectorAll('input[name="pago"]').forEach(el => {
    el.addEventListener('change', () => {
      document.getElementById('aliasBox').style.display =
        el.value === 'Transferencia' && el.checked ? 'block' : 'none';
    });
  });

  document.getElementById('esEdificio').addEventListener('change', function () {
    document.getElementById('edificioFields').style.display = this.checked ? 'block' : 'none';
  });

  document.getElementById('btnEnviar').addEventListener('click', () => {
    const nombre = document.getElementById('nombre').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const calle = document.getElementById('calle').value.trim();
    const numeroCalle = document.getElementById('numeroCalle').value.trim();
    const esEdificio = document.getElementById('esEdificio').checked;
    const piso = esEdificio ? document.getElementById('piso').value.trim() : '';
    const portero = esEdificio ? document.getElementById('portero').value.trim() : '';
    const pago = document.querySelector('input[name="pago"]:checked').value;

    if (!nombre || !telefono || !calle || !numeroCalle) {
      alert('Por favor completá tu nombre, teléfono y dirección.');
      return;
    }

    const direccion = buildDireccion({ calle, numero: numeroCalle, esEdificio, piso, portero });
    const mensaje = buildMensajeWhatsApp({ nombre, telefono, direccion, pago, resumen, total });
    const link = `https://wa.me/5493472552985?text=${encodeURIComponent(mensaje)}`;

    localStorage.setItem('pedidoEnviado', 'true');
    window.location.href = link;
  });
}

// ============================================================
// INICIALIZACIÓN
// ============================================================

window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('pedidoEnviado') === 'true' &&
      window.location.pathname !== '/' &&
      !window.location.pathname.endsWith('index.html')) {
    window.location.href = '/';
    return;
  }

  if (document.getElementById('categoriasGrid')) {
    renderCategoriasHome();
  } else if (document.getElementById('formProductos')) {
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get('cat');
    renderProductos(catParam);
  } else if (document.getElementById('carrito')) {
    renderCarrito();
  }
});

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && localStorage.getItem('pedidoEnviado') === 'true') {
    window.location.reload();
  }
});