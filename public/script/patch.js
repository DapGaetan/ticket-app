document.addEventListener('DOMContentLoaded', () => {
    fetchEvents();

    let selectedEvent = ''; // Variable pour stocker l'événement sélectionné

    // Fonction pour récupérer les événements et afficher la liste
    function fetchEvents() {
        fetch('/tickets/event/count/tickets')
            .then(response => response.json())
            .then(data => {
                const eventList = document.getElementById('event-liste');
                eventList.innerHTML = ''; // Effacer le contenu précédent

                // Parcourir les événements et créer les éléments de liste avec le bouton de modification
                for (const event in data) {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${event} (${data[event]} tickets)`;

                    // Ajouter un gestionnaire d'événement pour afficher les tickets associés
                    listItem.addEventListener('click', () => {
                        selectedEvent = event; // Mettre à jour l'événement sélectionné
                        fetchTickets(event);
                    });

                    eventList.appendChild(listItem);
                }
            })
            .catch(error => console.error('Erreur lors de la récupération des événements:', error));
    }

    // Fonction pour récupérer les tickets du premier événement spécifique
    function fetchTickets(eventName) {
        fetch(`/tickets/event/${eventName}`)
            .then(response => response.json())
            .then(data => {
                const ticketList = document.getElementById('ticket-liste');
                ticketList.innerHTML = ''; // Effacer les tickets précédents

                // Afficher uniquement le premier ticket dans une liste
                const ticket = data[0];
                const listItem = document.createElement('li');
                listItem.textContent = `Ticket ID: ${ticket.id}, Structure: ${ticket.structure}, Adresse: ${ticket.adresse}, Code Postal Ville: ${ticket.code_postal_ville}, SGC: ${ticket.sgc}, Numéro de Série: ${ticket.serie}`;
                ticketList.appendChild(listItem);

                // Remplir le formulaire avec les données du ticket sélectionné
                fillTicketForm(ticket);
            })
            .catch(error => console.error(`Erreur lors de la récupération des tickets pour l'événement ${eventName}:`, error));
    }

    // Fonction pour remplir le formulaire avec les données du ticket sélectionné
    function fillTicketForm(ticket) {
        const form = document.getElementById('ticket-form');
        form.querySelector('input[name="id"]').value = ticket.id;
        form.querySelector('input[name="event"]').value = ticket.event;
        form.querySelector('input[name="structure"]').value = ticket.structure;
        form.querySelector('input[name="adresse"]').value = ticket.adresse;
        form.querySelector('input[name="code_postal_ville"]').value = ticket.code_postal_ville;
        form.querySelector('input[name="sgc"]').value = ticket.sgc;
        form.querySelector('input[name="serie"]').value = ticket.serie;
    }

    // Gestionnaire d'événement pour la soumission du formulaire de modification
    document.getElementById('ticket-form').addEventListener('submit', (Event) => {
        Event.preventDefault(); // Empêcher le comportement par défaut du formulaire
        updateTickets(selectedEvent); // Mettre à jour les tickets correspondants
    });

// Fonction pour mettre à jour les tickets correspondants à l'événement sélectionné
function updateTickets(eventName) {
    const form = document.getElementById('ticket-form');
    const formData = new FormData(form);

    // Convertir les données du formulaire en objet JSON
    const updatedData = {};
    formData.forEach((value, key) => {
        // Ignorer le champ ID lors de la sérialisation des données
        if (key !== 'id') {
            updatedData[key] = value;
        }
    });
    
    // Envoyer les données mises à jour à l'API pour tous les tickets de l'événement
    fetch(`/tickets/event/${eventName}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Tickets mis à jour avec succès:', data);
        // Afficher le message de succès
        displayMessage('Modification réussie !', 'success');
        // Rafraîchir la liste des événements après la mise à jour
        fetchEvents();
    })
    .catch(error => {
        console.error('Erreur lors de la mise à jour des tickets:', error);
        // Afficher le message d'erreur
        displayMessage('Erreur lors de la modification des tickets. Veuillez réessayer.', 'error');
    });
}

// Fonction pour afficher les messages
function displayMessage(message, type) {
    const messageDiv = document.getElementById('modification-message');
    messageDiv.textContent = message;
    messageDiv.className = type; // Ajoute une classe pour le style CSS en fonction du type de message
}
});
