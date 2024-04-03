// Fonction pour afficher les événements avec des boutons de suppression
function fetchEvents() {
    fetch('/tickets/event/count/tickets')
        .then(response => response.json())
        .then(data => {
            const eventList = document.getElementById('event-list');
            eventList.innerHTML = '';

            for (const event in data) {
                const listItem = document.createElement('li');
                listItem.textContent = `${event} (${data[event]} tickets)`;

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Supprimer Tickets';
                deleteButton.classList.add('delete-button');
                deleteButton.addEventListener('click', () => confirmDeletion(event));

                listItem.appendChild(deleteButton);
                eventList.appendChild(listItem);

                listItem.addEventListener('click', () => fetchTickets(event));
            }
        })
        .catch(error => console.error('Erreur lors de la récupération des événements:', error));
}

function fetchTickets(eventName) {
    fetch(`/tickets/event/${eventName}`)
        .then(response => response.json())
        .then(data => {
            const ticketList = document.getElementById('ticket-list');
            ticketList.innerHTML = '';
            data.forEach(ticket => {
                const listItem = document.createElement('li');
                listItem.textContent = `
                Structure : ${ticket.structure} | 
                Adresse : ${ticket.adresse} | 
                code postal ville : ${ticket.code_postal_ville} | 
                SGC : ${ticket.sgc} | 
                Numéro de série : ${ticket.serie} |
                Placement : ${ticket.placement} |
                Numero de billet : ${ticket.numero_billet} |
                Numero_siret : ${ticket.numero_siret} |
                Licence : ${ticket.licence} |
                Image : ${ticket.img}
                `;
                ticketList.appendChild(listItem);
            });
        })
        .catch(error => console.error(`Erreur lors de la récupération des tickets pour l'événement ${eventName}:`, error));
  }

function confirmDeletion(eventName) {
    const confirmation = confirm(`Êtes-vous sûr de vouloir supprimer l'événement ${eventName} et ses tickets ?`);
    if (confirmation) {
        deleteTickets(eventName);
    }
}

function deleteTickets(eventName) {
    fetch(`/tickets/event/${eventName}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);

        fetchEvents();
    })
    .catch(error => console.error(`Erreur lors de la suppression des tickets pour l'événement ${eventName}:`, error));
}

document.addEventListener('DOMContentLoaded', fetchEvents);