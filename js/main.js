// js/main.js

const productos = [
  {
    nombre: 'sorrentinos1',
    titulo: 'Sorrentinos de ricota y cebolla',
    descripcion: 'Cebolla caramelizada y parmesano (opcional)',
    imagen: 'img/sorrentinos-mp - copia.webp',
    opciones: [
      { desc: '1kg (32u)', precio: 5000 },
      { desc: '1/2kg (16u)', precio: 2700 },
      { desc: '250g (8u)', precio: 1500 }
    ]
  },
  {
    nombre: 'sorrentinos2',
    titulo: 'Sorrentinos ricota, jamon y queso',
    descripcion: 'Con manteca de salvia y nuez moscada',
    imagen: 'img/sorrentinos-mp.webp',
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
    opciones: [
      { desc: '1kg', precio: 4200 },
      { desc: '1/2kg', precio: 2300 },
      { desc: '250g', precio: 1200 }
    ]
  }
];

function cargarSeleccionGuardada() {
  const seleccionGuardada = JSON.parse(localStorage.getItem('carrito')) || [];
  seleccionGuardada.forEach(item => {
    const radios = document.getElementsByName(item.nombre);
    radios.forEach(radio => {
      if (radio.value === item.descripcion) {
        radio.checked = true;
        const cantidadInput = radio.parentElement.querySelector('.cantidad');
        cantidadInput.value = item.cantidad;
      }
    });
  });
}

function renderProductos() {
  const form = document.getElementById('formProductos');
  form.innerHTML = '';
  productos.forEach(producto => {
    const div = document.createElement('div');
    div.className = 'producto';
    div.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <div style="flex: 1;">
        <strong>${producto.titulo}</strong><br>
        <small>${producto.descripcion}</small><br><br>
        ${producto.opciones.map((op) => `
          <label>
            <input type="radio" name="${producto.nombre}" value="${op.desc}" data-precio="${op.precio}" data-descripcion="${op.desc}">
            ${op.desc} – $${op.precio}
            <input class="cantidad" type="number" min="0" value="0">
          </label>
        `).join('')}
      </div>
    `;
    form.appendChild(div);
  });

  document.querySelectorAll('.cantidad').forEach(input => {
    input.addEventListener('input', calcularTotal);
  });

  document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const cantidadInput = radio.parentElement.querySelector('.cantidad');
      if (!cantidadInput.value || parseInt(cantidadInput.value) <= 0) {
        cantidadInput.value = 1;
      }
      calcularTotal();
    });

    radio.addEventListener('click', function () {
      if (this.previousChecked) {
        this.checked = false;
        this.previousChecked = false;
        const cantidadInput = this.parentElement.querySelector('.cantidad');
        cantidadInput.value = 0;
        calcularTotal();
      } else {
        document.querySelectorAll(`input[name="${this.name}"]`).forEach(r => r.previousChecked = false);
        this.previousChecked = true;
      }
    });
  });

  cargarSeleccionGuardada();
  calcularTotal();

  // ✅ Mostrar cartel si venís de WhatsApp
  if (localStorage.getItem('pedidoEnviado') === 'true') {
    const mensajeDiv = document.createElement('div');
    mensajeDiv.textContent = '✅ ¡Tu pedido fue enviado con éxito!';
    mensajeDiv.style.color = 'green';
    mensajeDiv.style.fontWeight = 'bold';
    mensajeDiv.style.textAlign = 'center';
    mensajeDiv.style.margin = '10px auto';
    form.parentElement.insertBefore(mensajeDiv, form);

    // limpiar carrito y resetear marca
    localStorage.removeItem('carrito');
    setTimeout(() => {
      mensajeDiv.remove();
      localStorage.removeItem('pedidoEnviado');
      window.location.reload();
    }, 3000);
  }
}


function calcularTotal() {
  let total = 0;
  const radios = document.querySelectorAll('input[type="radio"]');
  radios.forEach((radio) => {
    if (radio.checked) {
      const precio = parseInt(radio.dataset.precio);
      const cantidadInput = radio.parentElement.querySelector('.cantidad');
      const cantidad = parseInt(cantidadInput.value) || 1;
      total += precio * cantidad;
    }
  });
  const totalElement = document.getElementById('total');
  if (totalElement) {
    totalElement.textContent = `Total: $${total}`;
  }
}

function irAlCarrito() {
  const seleccionados = [];
  const radios = document.querySelectorAll('input[type="radio"]:checked');
  if (radios.length === 0) {
    alert('Por favor, seleccioná al menos un producto.');
    return;
  }

  radios.forEach((radio) => {
    const nombre = radio.name;
    const descripcion = radio.dataset.descripcion;
    const precio = parseInt(radio.dataset.precio);
    const cantidad = parseInt(radio.parentElement.querySelector('.cantidad').value);
    seleccionados.push({ nombre, descripcion, precio, cantidad });
  });

  localStorage.setItem('carrito', JSON.stringify(seleccionados));
  window.location.href = 'carrito.html';
}

function renderCarrito() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const contenedor = document.getElementById('carrito');

  let resumen = '';
  let total = 0;

  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    resumen += `- ${item.nombre} – ${item.descripcion} x ${item.cantidad} = $${subtotal}\n`;
  });
  resumen += `\nTOTAL: $${total}`;

  contenedor.innerHTML = `
    <form id="formCarrito">
      <div class="form-group">
        <label>Nombre y Apellido:</label>
        <input type="text" id="nombre" required style="width: 100%; padding: 8px;">
      </div>
      <div class="form-group">
        <label>Número de contacto:</label>
        <input type="text" id="telefono" required style="width: 100%; padding: 8px;">
      </div>
      <div class="form-group">
        <label>Método de pago:</label><br>
        <input type="radio" name="pago" value="Efectivo" checked> Efectivo
        <input type="radio" name="pago" value="Transferencia"> Transferencia
        <div id="aliasBox" style="margin-top: 10px; display: none;">
          <strong>Alias para transferir:</strong><br>
          alias.negocio.mp
        </div>
      </div>
      <div class="form-group">
        <h3>Resumen del pedido:</h3>
        <pre id="resumenPedido">${resumen}</pre>
      </div>
      <button type="submit">Enviar Pedido por WhatsApp</button>
      <button type="button" onclick="window.location.href='index.html'" style="margin-top: 10px; background: #ccc; color: #333;">Volver al Menú</button>
    </form>
  `;

  document.querySelectorAll('input[name="pago"]').forEach(el => {
    el.addEventListener('change', () => {
      document.getElementById('aliasBox').style.display = (el.value === 'Transferencia' && el.checked) ? 'block' : 'none';
    });
  });

  document.getElementById('formCarrito').addEventListener('submit', function(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const pago = document.querySelector('input[name="pago"]:checked').value;

    let mensaje = `Hola! Soy ${nombre} (${telefono}) y quiero hacer un pedido:\n\n${resumen}\n\nMétodo de pago: ${pago}`;
    if (pago === 'Transferencia') {
      mensaje += '\nAlias: alias.negocio.mp';
    }
    mensaje += '\n\nGracias!';

    const numero = "5493472552985";
    const link = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

    localStorage.setItem('pedidoEnviado', 'true');
    
    window.location.href = link;
  });
}

window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('pedidoEnviado') === 'true') {
    // Si estamos en carrito, redirigir directamente al menú
    if (window.location.pathname.includes('carrito.html')) {
      window.location.href = 'index.html';
      return;
    }
  }

  if (document.getElementById('formProductos')) {
    renderProductos();
  } else if (document.getElementById('carrito')) {
    renderCarrito();
  }
});
