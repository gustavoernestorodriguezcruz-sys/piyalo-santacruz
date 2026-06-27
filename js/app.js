    function renderResults(data) {
        resultsContainer.innerHTML = '';
        
        data.forEach(service => {
            const title = service.title || '';
            const phone = service.whatsapp_number || '';
            
            // LÓGICA DE ENLACE:
            // Para "Electricista 24h" generará "electricista-24h.html"
            const fileName = title.toLowerCase().replace(/\s+/g, '-') + '.html';
            const pageLink = `./pages/${fileName}`;

            const card = document.createElement('div');
            card.className = 'card';
            
            card.innerHTML = `
                <span class="tag">${service.category}</span>
                <a href="${pageLink}" style="text-decoration:none; color:inherit;">
                    <h3>${title}</h3>
                </a>
                <p>${service.description}</p>
                <a href="https://wa.me/${phone}?text=Hola,%20vengo%20desde%20PIYALO" class="btn-whatsapp" target="_blank">
                    Contactar por WhatsApp
                </a>
            `;
            resultsContainer.appendChild(card);
        });
    }
