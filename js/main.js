/**
 * Funcionalidad principal para las páginas de propiedades matemáticas
 * Incluye manejo del sidebar y tarjetas colapsables
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar componentes
    initSidebar();
    initCollapsibleCards();
    
    // Añadir clase de carga al body para transiciones suaves
    document.body.classList.add('loaded');
});

/**
 * Inicializa la funcionalidad del sidebar
 */
function initSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.querySelector('.toggle-sidebar');
    const contentWrapper = document.querySelector('.content-wrapper, .content-area').parentElement;
    
    // Función para alternar el sidebar
    window.toggleSidebar = function() {
        sidebar.classList.toggle('show');
        document.body.classList.toggle('sidebar-visible');
        
        // Añadir o quitar clase al wrapper del contenido
        if (contentWrapper) {
            contentWrapper.classList.toggle('shifted');
        }
        
        // Cerrar el sidebar al hacer clic en un enlace en dispositivos móviles
        if (window.innerWidth <= 768) {
            const navLinks = document.querySelectorAll('.sidebar-nav a');
            navLinks.forEach(link => {
                link.addEventListener('click', closeSidebar);
            });
        }
    };
    
    // Cerrar el sidebar al hacer clic fuera de él
    document.addEventListener('click', function(event) {
        const isClickInsideSidebar = sidebar.contains(event.target);
        const isClickOnToggleBtn = toggleBtn && toggleBtn.contains(event.target);
        
        if (!isClickInsideSidebar && !isClickOnToggleBtn && sidebar.classList.contains('show')) {
            closeSidebar();
        }
    });
    
    // Manejar el teclado para accesibilidad
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && sidebar.classList.contains('show')) {
            closeSidebar();
        }
    });
    
    // Función para cerrar el sidebar
    function closeSidebar() {
        sidebar.classList.remove('show');
        document.body.classList.remove('sidebar-visible');
        
        if (contentWrapper) {
            contentWrapper.classList.remove('shifted');
        }
    }
}

/**
 * Inicializa las tarjetas colapsables
 */
function initCollapsibleCards() {
    // Función para alternar tarjetas
    window.toggleCard = function(headerElement) {
        const card = headerElement.closest('.property-card');
        const content = card.querySelector('.card-content, .property-content');
        const isExpanding = !content.classList.contains('visible');
        
        // Cerrar otras tarjetas si se está expandiendo una nueva (opcional)
        if (isExpanding) {
            const allCards = document.querySelectorAll('.property-card');
            allCards.forEach(otherCard => {
                if (otherCard !== card) {
                    const otherContent = otherCard.querySelector('.card-content.visible, .property-content.visible');
                    const otherHeader = otherCard.querySelector('.card-header.active, .property-header.active');
                    
                    if (otherContent && otherHeader) {
                        otherContent.classList.remove('visible');
                        otherHeader.classList.remove('active');
                        
                        // Asegurar que la flecha se actualice
                        const indicator = otherHeader.querySelector('.indicator');
                        if (indicator) {
                            indicator.textContent = '+';
                        }
                    }
                }
            });
        }
        
        // Alternar la clase 'active' en el encabezado
        headerElement.classList.toggle('active');
        
        // Alternar la visibilidad del contenido
        content.classList.toggle('visible');
        
        // Actualizar el indicador (+/-)
        const indicator = headerElement.querySelector('.indicator');
        if (indicator) {
            indicator.textContent = content.classList.contains('visible') ? '−' : '+';
        }
        
        // Si se está expandiendo, hacer scroll suave a la tarjeta
        if (isExpanding) {
            setTimeout(() => {
                card.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    };
    
    // Hacer que la primera tarjeta esté expandida por defecto
    const firstCard = document.querySelector('.property-card');
    if (firstCard) {
        const firstHeader = firstCard.querySelector('.card-header, .property-header');
        const firstContent = firstCard.querySelector('.card-content, .property-content');
        
        if (firstHeader && firstContent) {
            firstHeader.classList.add('active');
            firstContent.classList.add('visible');
            
            const indicator = firstHeader.querySelector('.indicator');
            if (indicator) {
                indicator.textContent = '−';
            }
        }
    }
}

/**
 * Función para copiar código al portapapeles
 * @param {HTMLElement} button - El botón que activa la copia
 * @param {string} code - El código a copiar
 */
window.copyToClipboard = function(button, code) {
    navigator.clipboard.writeText(code).then(() => {
        // Cambiar temporalmente el texto del botón
        const originalText = button.textContent;
        button.textContent = '¡Copiado!';
        button.style.backgroundColor = '#28a745';
        
        // Restaurar después de 2 segundos
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '';
        }, 2000);
    }).catch(err => {
        console.error('Error al copiar al portapapeles:', err);
        button.textContent = 'Error al copiar';
        button.style.backgroundColor = '#dc3545';
    });
};

/**
 * Función para inicializar los tooltips
 */
function initTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', showTooltip);
        tooltip.addEventListener('mouseleave', hideTooltip);
    });
    
    function showTooltip(event) {
        const tooltipText = this.getAttribute('data-tooltip');
        const tooltipEl = document.createElement('div');
        tooltipEl.className = 'tooltip';
        tooltipEl.textContent = tooltipText;
        
        document.body.appendChild(tooltipEl);
        
        const rect = this.getBoundingClientRect();
        tooltipEl.style.top = `${rect.top - tooltipEl.offsetHeight - 10}px`;
        tooltipEl.style.left = `${rect.left + (this.offsetWidth / 2) - (tooltipEl.offsetWidth / 2)}px`;
        
        this._tooltip = tooltipEl;
    }
    
    function hideTooltip() {
        if (this._tooltip) {
            document.body.removeChild(this._tooltip);
            this._tooltip = null;
        }
    }
}

// Inicializar tooltips cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', initTooltips);

/**
 * Función para resaltar sintaxis de código (puede ser extendida con una librería como Prism.js)
 */
function highlightCode() {
    // Esta función puede ser extendida para usar una librería de resaltado de sintaxis
    document.querySelectorAll('pre code').forEach((block) => {
        // Aquí podrías agregar la lógica para resaltar la sintaxis
        // Por ejemplo, usando Prism.highlightElement(block);
    });
}

// Inicializar resaltado de código cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', highlightCode);
