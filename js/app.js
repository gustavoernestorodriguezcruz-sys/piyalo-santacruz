// js/app.js
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('resultsContainer');
    
    // Fail-safe: Si no estamos en la página de inicio, detener ejecución
    if (!searchInput || !resultsContainer) return;

    let servicesData = [];

    async function init() {
        try {
            const response = await fetch('./data/services.json');
            if (!response.ok) throw new Error('Error de red');
            
            const data = await response.json();
            // Fail-safe: Asegurar que sea un array aunque el JSON esté mal estructurado internamente
            servicesData = Array.isArray(data.services) ? data.services : [];
            renderResults(servicesData);
        } catch (error) {
            console.error('Aviso: No se pudo cargar services.json.', error);
            resultsContainer.innerHTML = '<p style="text-align:center; color:#888;">No hay servicios disponibles en este momento.</p>';
        }
    }

    function renderResults(data) {
        resultsContainer.innerHTML = '';
        
        if (!data || data.length === 0) {
            resultsContainer.innerHTML = '<p style="text-align:center; color:#888;">No se encontraron resultados.</p>';
            return;
        }

        data.forEach(service => {
            // Fail-safes: Valores por defecto si el usuario olvida llenar un campo en el JSON
            const title = service.title || 'Servicio sin nombre';
            const category = service.category || 'General';
            const description = service.description || '';
            const phone = service.whatsapp_number || '';

            const card = document.createElement('div');
            card.className = 'card';
            
            let btnHtml = '';
            if (phone) {
                const waMessage = encodeURIComponent(`Hola, vi su servicio de ${title} en PIYALO.`);
                btnHtml = `<a href="https://wa.me/${phone}?text=${waMessage}" class="btn-whatsapp" target="_blank">Contactar por WhatsApp</a>`;
            }

            card.innerHTML = `
                <span class="tag">${category}</span>
                <h3>${title}</h3>
                <p>${description}</p>
                ${btnHtml}
            `;
            resultsContainer.appendChild(card);
        });
    }

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

