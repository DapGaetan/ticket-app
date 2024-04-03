document.addEventListener('DOMContentLoaded', () => {
    fetchEvents();

    let selectedEvent = '';

    function fetchEvents() {
        fetch('/tickets/event/count/tickets')
            .then(response => response.json())
            .then(data => {
                const eventList = document.getElementById('event-liste');
                eventList.innerHTML = '';

                for (const event in data) {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${event} (${data[event]} tickets)`;

                    listItem.addEventListener('click', () => {
                        selectedEvent = event;
                        fetchTickets(event);
                    });

                    eventList.appendChild(listItem);
                }
                loadAvailableImages();
            })
            .catch(error => console.error('Erreur lors de la récupération des événements:', error));
    }

    function fetchTickets(eventName) {
        fetch(`/tickets/event/${eventName}`)
            .then(response => response.json())
            .then(data => {
                const ticketList = document.getElementById('ticket-liste');
                ticketList.innerHTML = '';
                const ticket = data[0];
                const listItem = document.createElement('li');
                listItem.textContent = `Ticket ID: ${ticket.id}, Structure: ${ticket.structure}, Adresse: ${ticket.adresse}, Code Postal Ville: ${ticket.code_postal_ville}, SGC: ${ticket.sgc}, Numéro de Série: ${ticket.serie}`;
                ticketList.appendChild(listItem);

                fillTicketForm(ticket);
            })
            .catch(error => console.error(`Erreur lors de la récupération des tickets pour l'événement ${eventName}:`, error));
    }
    function fillTicketForm(ticket) {
        const form = document.getElementById('ticket-form');
        form.querySelector('input[name="id"]').value = ticket.id;
        let event = ticket.event.replace(/\s/g, '_');
        form.querySelector('input[name="event"]').value = event;
        form.querySelector('input[name="structure"]').value = ticket.structure;
        form.querySelector('input[name="adresse"]').value = ticket.adresse;
        form.querySelector('input[name="code_postal_ville"]').value = ticket.code_postal_ville;
        form.querySelector('input[name="sgc"]').value = ticket.sgc;
        form.querySelector('input[name="serie"]').value = ticket.serie;
    }

    function loadAvailableImages() {
        fetch('/images')
            .then(response => response.json())
            .then(data => {
                const selectImage = document.getElementById('select-image');
                data.forEach(image => {
                    const option = document.createElement('option');
                    option.value = image;
                    option.textContent = image;
                    selectImage.appendChild(option);
                });
            })
            .catch(error => console.error('Erreur lors du chargement des images:', error));
    }

    document.getElementById('ticket-form').addEventListener('submit', (event) => {
        event.preventDefault();

        const selectedImage = document.getElementById('select-image').value;

        updateTickets(selectedEvent, selectedImage);
    });
    
    function updateTickets(eventName, selectedImage) {
        const form = document.getElementById('ticket-form');
        const formData = new FormData(form);

        formData.set('event', formData.get('event').replace(/\s/g, '_'));

        formData.append('img', selectedImage);

        fetch(`/tickets/event/${eventName}`, {
            method: 'PUT',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log('Tickets mis à jour avec succès:', data);
            displayMessage('Modification réussie !', 'success');
            fetchEvents();
        })
        .catch(error => {
            console.error('Erreur lors de la mise à jour des tickets:', error);
            displayMessage('Erreur lors de la modification des tickets. Veuillez réessayer.', 'error');
        });
    }

    function displayMessage(message, type) {
        const messageDiv = document.getElementById('modification-message');
        messageDiv.textContent = message;
        messageDiv.className = type;
    }
});
