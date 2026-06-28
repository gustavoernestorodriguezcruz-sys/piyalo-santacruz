document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('resultsContainer');
    const categoriesContainer = document.getElementById('categoriesContainer');
    
    if (!searchInput || !resultsContainer) return;

    let servicesData = [];
    let currentCategory = 'todos';

    // 1. Carga inicial de la base de datos local (JSON)
    async function init() {
        try {
            const pathPrefix = window.location.pathname.includes('/pages/') ? '../' : './';
            const response = await fetch(`${pathPrefix}data/services.json`);
            if (!response.ok) throw new Error('Error al conectar con el almacén de datos');
            
            const data = await response.json();
            servicesData = Array.isArray(data.services) ? data.services : [];
            filterAndRender();
        } catch (error) {
            console.error('Aviso de PIYALO:', error);
            resultsContainer.innerHTML = `
                <div style="text-align:center; padding:40px 20px; color:var(--text-muted);">
                    <p style="font-size:1.5rem; margin-bottom:10px;">⚠️</p>
                    <p>No pudimos conectar con los servicios locales hoy de forma estática.</p>
                </div>
            `;
        }
    }

    // 2. Motor de filtrado y renderizado con soporte para Imágenes Reales y Eventos
    function filterAndRender() {
        resultsContainer.innerHTML = '';
        const query = searchInput.value.toLowerCase().trim();

        const filtered = servicesData.filter(service => {
            const matchesCategory = currentCategory === 'todos' || service.category === currentCategory;
            const matchesSearch = !query || 
                service.title.toLowerCase().includes(query) || 
                service.description.toLowerCase().includes(query) || 
                (Array.isArray(service.keywords) && service.keywords.some(k => k.toLowerCase().includes(query)));
            return matchesCategory && matchesSearch;
        });

        if (filtered.length === 0) {
            resultsContainer.innerHTML = `
                <div style="text-align:center; padding:40px 20px; color:var(--text-muted);">
                    <p>No encontramos profesionales activos para esa búsqueda exacta.</p>
                </div>
            `;
            return;
        }

        const pathPrefix = window.location.pathname.includes('/pages/') ? '../' : './';

        filtered.forEach(service => {
            const card = document.createElement('div');
            card.className = 'card';
            
            const slug = service.title.toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');

            const serviceUrl = `${pathPrefix}pages/${slug}.html`;
            const waUrl = `https://wa.me/${service.whatsapp_number}?text=Hola,%20vi%20tu%20perfil%20en%20PIYALO%20y%20necesito%20asistencia%20en%20${encodeURIComponent(service.title)}`;
            
            // Si el JSON incluye una ruta de imagen real, la usa; si no, deja un avatar neutro por defecto
            const imageSrc = service.image ? (pathPrefix + service.image) : 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="%23FF3B5C" style="opacity:0.15"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>';

            card.innerHTML = `
                <a href="${serviceUrl}" style="text-decoration: none; color: inherit; display: flex; align-items: center; gap: 16px; margin-bottom: 12px;">
                    <img src="${imageSrc}" alt="${service.title}" style="width: 54px; height: 54px; border-radius: 50%; object-fit: cover; background: #eef0f2; border: 2px solid rgba(255, 59, 92, 0.1);">
                    <div style="flex: 1;">
                        <h3 style="font-size: 1.15rem; font-weight: 700; line-height: 1.3; color: var(--text-main); margin: 0;">${service.title}</h3>
                        <p style="font-size:0.85rem; color:var(--text-muted); margin-top:4px; line-height:1.4;">${service.description}</p>
                    </div>
                </a>
                
                <a href="${waUrl}" class="btn-whatsapp track-wa-click" data-service="${service.title}" target="_blank" style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                    💬 Contactar al instante
                </a>
            `;

            resultsContainer.appendChild(card);
        });

        // Activar escuchadores para recolectar datos/estadísticas al instante
        setupTrackingEvents();
    }

    // 3. INFRAESTRUCTURA DE DATOS: Captura invisible de métricas de conversión
    function setupTrackingEvents() {
        document.querySelectorAll('.track-wa-click').forEach(button => {
            button.addEventListener('click', (e) => {
                const serviceName = e.currentTarget.getAttribute('data-service');
                
                // Registro local en consola para validar en pruebas
                console.log(`[PIYALO ANALYTICS] Lead Calificado generado para: ${serviceName}`);

                // Embolsar demanda para Google Analytics 4 (Listo para cuando pegues tu tag global)
                if (typeof gtag === 'function') {
                    gtag('event', 'generacion_lead_whatsapp', {
                        'nombre_servicio': serviceName,
                        'ciudad': 'Santa Cruz',
                        'event_category': 'Conversión Lead'
                    });
                }

                // Embolsar demanda para Meta Pixel (Para campañas hiper-segmentadas en Santa Cruz)
                if (typeof fbq === 'function') {
                    fbq('track', 'Contact', { content_name: serviceName });
                }
            });
        });
    }

    // 4. Slider de categorías táctil
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

    searchInput.addEventListener('input', filterAndRender);
    init();
});
