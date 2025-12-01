// ProyectoTiendaTech/js/carrito.js

(function() {
    'use strict';
    
    // --- Utilidades de Almacenamiento ---
    function obtenerCarrito() {
        try {
            const raw = localStorage.getItem('productosCarrito');
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error("Error al obtener carrito de localStorage:", e);
            return [];
        }
    }

    function guardarCarrito(carrito) {
        localStorage.setItem('productosCarrito', JSON.stringify(carrito));
    }

    // --- Lógica de Renderizado ---
    function renderizarCarrito() {
        const container = document.getElementById('cart-items-container');
        const carrito = obtenerCarrito();
        let totalGlobal = 0;

        container.innerHTML = ''; 

        if (carrito.length === 0) {
            container.innerHTML = '<p id="empty-message">Tu carrito está vacío.</p>';
        } else {
            carrito.forEach(item => {
                const itemTotal = item.precio * item.cantidad;
                totalGlobal += itemTotal;

                const itemHTML = `
                    <div class="cart-item" data-id="${item.id}">
                        <img src="${item.imagen}" alt="${item.nombre}" />
                        <div class="item-details">
                            <div class="item-name">${item.nombre}</div>
                            <div class="item-specs">${item.specs}</div>
                        </div>
                        <div class="item-quantity">
                            <button onclick="actualizarCantidad(${item.id}, -1)">-</button>
                            <span>${item.cantidad}</span>
                            <button onclick="actualizarCantidad(${item.id}, 1)">+</button>
                        </div>
                        <span class="item-total-price">S/ ${(itemTotal).toFixed(2)}</span>
                        <span class="item-remove" onclick="eliminarProducto(${item.id})"><i class="fa-solid fa-trash-can"></i></span>
                    </div>
                `;
                container.innerHTML += itemHTML;
            });
        }
        
        document.getElementById('cart-total-amount').textContent = `S/ ${totalGlobal.toFixed(2)}`;
    }


   // --- Funciones de Acción (Globales para ser llamadas desde onclick) ---
    
    // FUNCIÓN MODIFICADA: Implementa la validación de eliminación
// 1. Lógica de "Finalizar Compra" con Verificación de Login
    window.iniciarCheckout = function() {
        const carrito = obtenerCarrito();
        const logged = localStorage.getItem('usuario_logged') === 'true';

        if (carrito.length === 0) {
            alert('No puedes finalizar la compra, tu carrito está vacío.');
            return;
        }

        if (logged) {
            // Usuario logueado: Continúa con la compra
            alert('✅ Redirigiendo al entorno pago...');
            // Aquí se ejecutaría el código real para la pasarela de pago
        } else {
            alert('Tienes que iniciar sesión primero.');
            
            window.parent.postMessage('open_login_modal', '*');
        }
    }


    // 2. Lógica de Actualización de Cantidad con Validación de Eliminación
    window.actualizarCantidad = function(id, cambio) {
        let carrito = obtenerCarrito();
        const itemIndex = carrito.findIndex(p => p.id === id);

        if (itemIndex !== -1) {
            const item = carrito[itemIndex];
            
            if (cambio < 0) { // Presionó el botón de menos (-)
                if (item.cantidad === 1) {
                    const confirmar = window.confirm(`¿Deseas eliminar "${item.nombre}" de tu carrito?`);
                    if (confirmar) {
                        carrito.splice(itemIndex, 1);
                    } else {
                        return;
                    }
                } else {

                    item.cantidad += cambio;
                }
            } else {
                // Si presiona el botón de más (+), incrementa
                item.cantidad += cambio;
            }
        }
        
        guardarCarrito(carrito);
        renderizarCarrito(); 
    }

    // ✨ FUNCIÓN MODIFICADA: Eliminar Producto con Confirmación Dinámica
    window.eliminarProducto = function(id) {
        let carrito = obtenerCarrito();
        const itemIndex = carrito.findIndex(p => p.id === id);

        if (itemIndex !== -1) {
            const item = carrito[itemIndex];
            const nombre = item.nombre;
            const cantidad = item.cantidad;

            let mensaje;
            
            // Determinar el mensaje basado en la cantidad
            if (cantidad > 1) {
                mensaje = `Los ${cantidad} productos "${nombre}" se eliminarán del carrito, ¿estás seguro?`;
            } else {
                mensaje = `El producto "${nombre}" se eliminará del carrito, ¿estás seguro?`;
            }

            // Mostrar el cuadro de diálogo de confirmación
            const confirmar = window.confirm(mensaje);

            if (confirmar) {
                carrito = carrito.filter(p => p.id !== id); 
                guardarCarrito(carrito);
                renderizarCarrito(); 
            }
        }
    }

    // Nuevo: manejador para el botón "Seguir comprando"
    function attachSeguirComprando() {
        const btn = document.getElementById('btn-seguir');
        if (!btn) return;

        btn.addEventListener('click', function () {
            // Intentar navegar la ventana padre y cerrar el modal-cart 
            try {
                window.parent.postMessage({ type: 'close_cart' }, '*');
                window.parent.location.href = '/index.html';
            } catch (e) {
                window.location.href = '/index.html';
            }
        });
    }

    // Inicializar el carrito al cargar la página del iframe
    document.addEventListener('DOMContentLoaded', function () {
        renderizarCarrito();
        attachSeguirComprando();
    });
})();