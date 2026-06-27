document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('resultsContainer');
    
    // Si no estamos en la página donde existe el buscador, salimos
    if (!searchInput || !resultsContainer) return;

    let servicesData = [];

    // Carga inicial del JSON
    async function init() {
        try {
            // Asegúrate de que el archivo exista en /data/services.json
            const response = await fetch('./data/services.json');
            if (!response.ok) throw new Error('No se pudo cargar el archivo de datos');
            
            const data = await response.json();
            servicesData = Array.isArray(data.services) ? data.services : [];
            renderResults(servicesData);
        } catch (error) {
            console.error('Error cargando servicios:', error);
            resultsContainer.innerHTML = '<p style="text-align:center; color:#888;">Error al cargar los servicios.</p>';
        }
    }

    // Función para renderizar las tarjetas
    function renderResults(data) {
        resultsContainer.innerHTML = '';
        
        if (!data || data.length === 0) {
            resultsContainer.innerHTML = '<p style="text-align:center; color:#888;">No se encontraron resultados.</p>';
            return;
        }

        data.forEach(service => {
            const title = service.title || 'Servicio';
            const category = service.category || 'General';
            const description = service.description || '';
            const phone = service.whatsapp_number || '';

            // Genera el nombre del archivo: "Electricista 24h" -> "electricista-24h.html"
            // Esto debe coincidir con el nombre de tus archivos en la carpeta /pages
            const fileName = title.toLowerCase().replace(/\s+/g, '-') + '.html';
            const pageLink = `./pages/${fileName}`;

            const card = document.createElement('div');
            card.className = 'card';
            
            card.innerHTML = `
                <span class="tag">${category}</span>
                <a href="${pageLink}" style="text-decoration:none; color:inherit; display:block;">
                    <h3>${title}</h3>
                </a>
                <p>${description}</p>
                <a href="https://wa.me/${phone}?text=Hola,%20vengo%20desde%20PIYALO%20por%20el%20servicio:%20${title}" class="btn-whatsapp" target="_blank">
                    Contactar por WhatsApp
                </a>
            `;
            resultsContainer.appendChild(card);
        });
    }

    // Lógica del buscador en tiempo real
    searchInput.addEventListener('input', (e) => {
        const searchTerm = (e.target.value || '').toLowerCase();
        
        const filtered = servicesData.filter(service => {
            const t = (service.title || '').toLowerCase();
            const c = (service.category || '').toLowerCase();
            const k = Array.isArray(service.keywords) ? service.keywords.join(' ').toLowerCase() : '';
            
            return t.includes(searchTerm) || c.includes(searchTerm) || k.includes(searchTerm);
        });
        
        renderResults(filtered);
    });

    init();
});
