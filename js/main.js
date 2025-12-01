// ProyectoTiendaTech/js/main.js

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ====================================================
    // 1. VALIDACIÓN DE FORMULARIO DE COTIZACIÓN (Avance 03)
    // ====================================================
    const formCotizacion = document.querySelector('.form-cotizacion');

    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
        return regex.test(email);
    }

    if (formCotizacion) {
        formCotizacion.addEventListener('submit', function(event) {
            event.preventDefault(); // Evita el envío por defecto

            const nombre = document.getElementById('nombre').value.trim();
            const email = document.getElementById('email').value.trim();
            const producto = document.getElementById('producto').value;
            const acepto = document.getElementById('acepto').checked;
            
            let errores = [];

            if (nombre === '') { errores.push('El nombre completo es obligatorio.'); }
            if (!validarEmail(email)) { errores.push('Por favor, ingresa un correo electrónico válido.'); }
            if (producto === '') { errores.push('Debes seleccionar un producto de interés.'); }
            if (!acepto) { errores.push('Debes aceptar la Política de Privacidad.'); }

            if (errores.length > 0) {
                alert('🚨 Error en la cotización:\n' + errores.join('\n'));
            } else {
                alert('✅ Cotización enviada con éxito. Pronto nos comunicaremos.');
                this.submit(); // Envía el formulario si todo es válido
            }
        });
    }


// ====================================================
// 2. SECCIÓN DE PREGUNTAS FRECUENTES (FAQ)
// ====================================================

// 1. SELECTORES GLOBALES
const faqQuestions = document.querySelectorAll('.faq-question');
const faqTitle = document.getElementById('faq-title'); 
const faqItems = document.querySelectorAll('.faq-item'); 
let allItemsVisible = true; // Estado inicial: las preguntas están visibles por defecto en el HTML

// --- FUNCIÓN 1: MASTER TOGGLE (OCULTA/MUESTRA TODAS LAS PREGUNTAS) ---
if (faqTitle) {
    faqTitle.addEventListener('click', function() {
        const newState = !allItemsVisible; // Determina si ocultar (false) o mostrar (true)
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            if (newState) {
                // ESTADO: MOSTRAR la sección completa
                item.style.display = 'block'; 
                
                // Asegurar que las respuestas estén OCULTAS al mostrar la sección
                answer.style.display = 'none'; 
                question.setAttribute('aria-expanded', 'false');
                question.classList.remove('active');
            } else {
                // ESTADO: OCULTAR la sección completa
                item.style.display = 'none'; 
            }
        });
        
        // Actualiza el estado y el signo (+/-) en el título
        allItemsVisible = newState;
        this.textContent = allItemsVisible ? 'Preguntas Frecuentes (FAQ) -' : 'Preguntas Frecuentes (FAQ) +';
    });
}

// --- FUNCIÓN 2: ACORDEÓN INDIVIDUAL (cÓDIGO ORIGINAL) ---
faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
        const answer = this.nextElementSibling;
        
        // Alterna la visibilidad y el atributo ARIA para accesibilidad
        const isExpanded = this.getAttribute('aria-expanded') === 'true' || false;
        this.setAttribute('aria-expanded', !isExpanded);

        if (answer.style.display === 'block') {
            answer.style.display = 'none';
        } else {
            answer.style.display = 'block';
        }
        this.classList.toggle('active');
    });
});



    
// ====================================================
// 3. Logica del carrito y interacción con el iframe
// ====================================================

const btnCart = document.getElementById('btn-cart');
const iframeCartSection = document.getElementById('iframe-cart');
const btnCartClose = document.getElementById('cart-iframe-close');
const cartIframe = document.getElementById('cart-iframe');

function abrirCarrito() {
    iframeCartSection.style.display = 'flex'; 
    document.body.style.overflow = 'hidden'; 
    
    // Forzamos la recarga del iframe para que carrito.js se actualice
    if (cartIframe && cartIframe.src) {
        cartIframe.src = cartIframe.src; 
    }
}

function cerrarCarrito() {
    iframeCartSection.style.display = 'none'; 
    document.body.style.overflow = 'auto'; // Restaura scroll principal
}

btnCart && btnCart.addEventListener('click', abrirCarrito);
btnCartClose && btnCartClose.addEventListener('click', cerrarCarrito);


// Función global para añadir productos
window.agregarAlCarrito = function(nombre, imagen, precio, specs) {
    let carrito = JSON.parse(localStorage.getItem('productosCarrito')) || [];
    precio = parseFloat(precio);

    let productoExistente = carrito.find(p => p.nombre === nombre);

    if (productoExistente) {
        productoExistente.cantidad += 1; 
    } else {
        const id = Date.now() + Math.floor(Math.random() * 1000); 
        carrito.push({
            id: id,
            nombre: nombre,
            imagen: imagen,
            precio: precio,
            specs: specs,
            cantidad: 1
        });
    }

    localStorage.setItem('productosCarrito', JSON.stringify(carrito));
    
    console.log('✅ Producto agregado: ' + nombre); 
    
    // Abrir el carrito inmediatamente
    abrirCarrito(); 
};

});

// ====================================================
// 4. Función específica para la interactividad del menú 
// ====================================================

document.addEventListener('DOMContentLoaded', function() {
    
    function setupMenuToggle() {
        const menuToggle = document.getElementById('menu-toggle');
        const mainNav = document.getElementById('main-nav');

        if (menuToggle && mainNav) {
            
            // inicializar estado abierto
            let isMenuOpen = true; 
            const icon = menuToggle.querySelector('i');

            menuToggle.addEventListener('click', function() {
                isMenuOpen = !isMenuOpen; 

                if (isMenuOpen) {
                    // (Menú visible)
                    mainNav.classList.remove('is-closed');
                    menuToggle.classList.remove('is-closed');
                    icon.className = 'fas fa-chevron-up'; // Flecha hacia arriba (para cerrar)
                    menuToggle.setAttribute('aria-expanded', 'true');
                } else {
                    // Estado: CERRADO (Menú oculto)
                    mainNav.classList.add('is-closed'); 
                    menuToggle.classList.add('is-closed');
                    icon.className = 'fas fa-chevron-down'; // Flecha hacia abajo (para abrir)
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }

        // Inicializa la funcionalidad del menú
    setupMenuToggle();
    
});
