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
            const response = await fetch('../data/services.json');
            if (!response.ok) throw new Error('Error al conectar con la base de datos');
            
            const data = await response.json();
            servicesData = Array.isArray(data.services) ? data.services : [];
            filterAndRender();
        } catch (error) {
            console.error('Aviso:', error);
            resultsContainer.innerHTML = `
                <div style="text-align:center; padding:40px 20px; color:var(--text-muted);">
                    <p style="font-size:1.5rem; margin-bottom:10px;">⚠️</p>
                    <p>No pudimos conectar con los servicios locales hoy.</p>
                </div>
            `;
        }
    }

    // 2. Función unificada para filtrar y renderizar tarjetas modernas
    function filterAndRender() {
        resultsContainer.innerHTML = '';
        const searchTerm = (searchInput.value || '').toLowerCase();

        // Aplicamos el filtro cruzado: Categoría + Buscador de texto
        const filtered = servicesData.filter(service => {
            const matchesCategory = (currentCategory === 'todos' || service.category === currentCategory);
            
            const t = (service.title || '').toLowerCase();
            const c = (service.category || '').toLowerCase();
            const k = Array.isArray(service.keywords) ? service.keywords.join(' ').toLowerCase() : '';
            const matchesSearch = t.includes(searchTerm) || c.includes(searchTerm) || k.includes(searchTerm);

            return matchesCategory && matchesSearch;
        });

        if (filtered.length === 0) {
            resultsContainer.innerHTML = `
                <div style="text-align:center; padding:40px 20px; color:var(--text-muted);">
                    <p style="font-size:1.5rem; margin-bottom:10px;">🔍</p>
                    <p>No encontramos lo que estás buscando hoy.</p>
                </div>
            `;
            return;
        }

        // Renderizado del componente tarjeta con UI/UX de App
        filtered.forEach(service => {
            const title = service.title || 'Servicio';
            const category = service.category || 'General';
            const description = service.description || '';
            const phone = service.whatsapp_number || '';

            // Conversión limpia a URL amigable para las landings SEO en /pages/
            const fileName = title.toLowerCase().replace(/\s+/g, '-') + '.html';
            const pageLink = `/piyalo-santacruz/pages/${fileName}`;

            const card = document.createElement('div');
            card.className = 'card';
            
            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <span style="font-size: 0.8rem; color: var(--brand-pink); background: rgba(255, 59, 92, 0.08); padding: 4px 12px; border-radius: 100px; font-weight: 700;">
                        ${category}
                    </span>
                    <span style="font-size: 0.85rem; font-weight: 700; color: #FFB000; display: inline-flex; align-items: center; gap: 4px;">
                        ⭐ 4.9
                    </span>
                </div>
                
                <a href="${pageLink}" style="text-decoration: none; color: var(--text-main); display: block; margin-bottom: 12px;">
                    <h3 style="font-size: 1.2rem; font-weight: 700; line-height: 1.3;">${title}</h3>
                    <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 4px; line-height: 1.4;">
                        ${description}
                    </p>
                </a>
                
                <a href="https://wa.me/${phone}?text=Hola,%20vi%20tu%20perfil%20en%20PIYALO%20y%20necesito%20el%20servicio%20de%20${encodeURIComponent(title)}" 
                   class="btn-whatsapp" target="_blank" style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <span>💬</span> Encontrá al instante
                </a>
            `;
            resultsContainer.appendChild(card);
        });
    }

    // 3. Manejo táctil del slider de categorías
    if (categoriesContainer) {
        categoriesContainer.addEventListener('click', (e) => {
            const pill = e.target.closest('.category-pill');
            if (!pill) return;

            // Desactivamos la píldora anterior y activamos la nueva
            document.querySelectorAll('.category-pill').forEach(b => b.classList.remove('active'));
            pill.classList.add('active');

            currentCategory = pill.getAttribute('data-category');
            filterAndRender();
        });
    }

    // 4. Escucha del buscador en tiempo real
    searchInput.addEventListener('input', filterAndRender);

    init();
});
