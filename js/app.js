document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('resultsContainer');
    const categoriesContainer = document.getElementById('categoriesContainer');
    
    if (!searchInput || !resultsContainer) return;

    let servicesData = [];
    let currentCategory = 'todos';

    // 1. Carga inicial del JSON de servicios
    async function init() {
        try {
            // Detectamos si estamos en /pages/ o en raíz
            const pathPrefix = window.location.pathname.includes('/pages/') ? '../' : './';
            const response = await fetch(`${pathPrefix}data/services.json`);
            if (!response.ok) throw new Error('Error al conectar con la base de datos');
            
            const data = await response.json();
            servicesData = Array.isArray(data.services) ? data.services : [];
            filterAndRender();
        } catch (error) {
            console.error('Aviso:', error);
            resultsContainer.innerHTML = `
                <div style=\"text-align:center; padding:40px 20px; color:var(--text-muted);\">\n                    <p style=\"font-size:1.5rem; margin-bottom:10px;\">⚠️</p>\n                    <p>No pudimos conectar con los servicios locales hoy.</p>\n                </div>\n            `;
        }
    }

    // 2. Función unificada para filtrar y renderizar tarjetas modernas
    function filterAndRender() {
        resultsContainer.innerHTML = '';
        
        const query = searchInput.value.toLowerCase().trim();

        const filtered = servicesData.filter(service => {
            const matchesCategory = currentCategory === 'todos' || service.category === currentCategory;
            
            const matchesSearch = !query || 
                service.title.toLowerCase().includes(query) || 
                service.description.toLowerCase().includes(query) || 
                (service.keywords && service.keywords.some(kw => kw.toLowerCase().includes(query)));
                
            return matchesCategory && matchesSearch;
        });

        if (filtered.length === 0) {
            resultsContainer.innerHTML = `
                <div style="text-align:center; padding:40px; color:var(--text-muted);">
                    <p style="font-size:1.2rem;">🔍</p>
                    <p style="margin-top:8px; font-size:0.9rem;">No encontramos un técnico para esa búsqueda exacta.</p>
                </div>
            `;
            return;
        }

        filtered.forEach(service => {
            const card = document.createElement('div');
            card.className = 'card';
            
            // Convertimos el título a un slug válido para el nombre del archivo HTML
            const slug = service.title
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "") // Remueve acentos
                .replace(/\s+/g, '-')            // Espacios a guiones
                .replace(/[^a-z0-9-]/g, '');     // Limpia caracteres especiales
            
            const title = service.title;
            const description = service.description;
            const phone = service.whatsapp_number;

            card.innerHTML = `
                <a href="pages/${slug}.html" style="text-decoration: none; color: inherit; display: block;">
                    <h3 style="font-size: 1.2rem; font-weight: 700; line-height: 1.3;">${title}</h3>
                </a>
                
                <a href="https://wa.me/${phone}?text=Hola,%20vi%20tu%20perfil%20en%20PIYALO%20y%20necesito%20el%20servicio%20de%20${encodeURIComponent(title)}" 
                   class="btn-whatsapp" target="_blank" style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <span>💬</span> Encontrá al instante
                </a>
            `;

            // Creamos el párrafo de descripción de forma segura para evitar problemas de inyección
            const descP = document.createElement('p');
            descP.style.cssText = "font-size:0.9rem; color:var(--text-muted); margin-top:4px; line-height:1.4;";
            descP.textContent = description;

            // Insertamos el párrafo dentro del enlace antes del botón
            const link = card.querySelector('a[href^="pages/"]');
            link.appendChild(descP);

            resultsContainer.appendChild(card);
        });
    }

    // 3. Manejo táctil del slider de categorías
    if (categoriesContainer) {
        categoriesContainer.addEventListener('click', (e) => {
            const pill = e.target.closest('.category-pill');
            if (!pill) return;

            document.querySelectorAll('.category-pill').forEach(b => b.classList.remove('active'));
            pill.classList.add('active');

            currentCategory = pill.getAttribute('data-category');
            filterAndRender();
        });
    }

    // 4. Input dinámico del buscador
    searchInput.addEventListener('input', filterAndRender);

    // Arrancar la app
    init();
});
