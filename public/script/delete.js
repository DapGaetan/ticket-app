// Fonction pour afficher les événements avec des boutons de suppression
function fetchEvents() {
    fetch('/tickets/event/count/tickets')
        .then(response => response.json())
        .then(data => {
            const eventList = document.getElementById('event-list');
            // Effacer le contenu existant de la liste
            eventList.innerHTML = '';
            // Parcourir les événements et créer les éléments de liste avec le bouton de suppression
            for (const event in data) {
                const listItem = document.createElement('li');
                listItem.textContent = `${event} (${data[event]} tickets)`;

                // Créer le bouton de suppression
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Supprimer Tickets';
                deleteButton.classList.add('delete-button');
                deleteButton.addEventListener('click', () => confirmDeletion(event));

                listItem.appendChild(deleteButton);
                eventList.appendChild(listItem);

                // Ajouter un écouteur d'événement pour afficher les tickets au clic sur l'événement
                listItem.addEventListener('click', () => fetchTickets(event));
            }
        })
        .catch(error => console.error('Erreur lors de la récupération des événements:', error));
}

// Fonction pour récupérer les tickets d'un événement spécifique
function fetchTickets(eventName) {
    fetch(`/tickets/event/${eventName}`)
        .then(response => response.json())
        .then(data => {
            const ticketList = document.getElementById('ticket-list');
            ticketList.innerHTML = ''; // Effacer les tickets précédents
            // Ajouter les tickets à la liste
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
                Licence : ${ticket.licence}
                `;
                ticketList.appendChild(listItem);
            });
        })
        .catch(error => console.error(`Erreur lors de la récupération des tickets pour l'événement ${eventName}:`, error));
  }

// Fonction pour confirmer la suppression des tickets
function confirmDeletion(eventName) {
    const confirmation = confirm(`Êtes-vous sûr de vouloir supprimer l'événement ${eventName} et ses tickets ?`);
    if (confirmation) {
        deleteTickets(eventName);
    }
}

// Fonction pour supprimer les tickets d'un événement spécifique
function deleteTickets(eventName) {
    fetch(`/tickets/event/${eventName}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        // Rafraîchir la liste des événements après la suppression
        fetchEvents();
    })
    .catch(error => console.error(`Erreur lors de la suppression des tickets pour l'événement ${eventName}:`, error));
}

// Charger les événements au chargement de la page
document.addEventListener('DOMContentLoaded', fetchEvents);