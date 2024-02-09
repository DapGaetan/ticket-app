document.addEventListener('DOMContentLoaded', fetchEvents);

function fetchEvents() {
    fetch('/tickets/event/count/tickets')
        .then(response => response.json())
        .then(data => {
            const eventList = document.getElementById('event-list');
            // Ajouter les événements à la liste
            for (const event in data) {
                const listItem = document.createElement('li');
                listItem.textContent = `${event} (${data[event]} tickets)`;
                // Ajouter un écouteur d'événement pour afficher les tickets au clic
                listItem.addEventListener('click', () => {
                    // Retirer la classe "selected" de tous les éléments de liste
                    const selectedItems = document.querySelectorAll('#event-list li.selected');
                    selectedItems.forEach(item => item.classList.remove('selected'));
                    // Ajouter la classe "selected" à l'élément de liste sélectionné
                    listItem.classList.add('selected');
                    fetchTickets(event);
                });
                eventList.appendChild(listItem);
            }
        })
        .catch(error => console.error('Erreur lors de la récupération des événements:', error));
}

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
                    Licence : ${ticket.licence} |
                    Image : ${ticket.img}
                `;
                ticketList.appendChild(listItem);
            });
        })
        .catch(error => console.error(`Erreur lors de la récupération des tickets pour l'événement ${eventName}:`, error));
}

document.getElementById('export-button').addEventListener('click', () => {
    const selectedEvent = document.querySelector('#event-list li.selected');
    if (selectedEvent) {
        const eventName = selectedEvent.textContent.split(' ')[0];
        exportTickets(eventName);
    } else {
        console.error('Aucun événement sélectionné pour l\'exportation.');
    }
});

function exportTickets(eventName) {
    fetch(`/tickets/event/${eventName}`)
        .then(response => response.json())
        .then(data => {
            // Créer une variable pour stocker le contenu HTML de tous les tickets
            let ticketsHTML = '';

            // Parcourir les données de chaque ticket et les formater selon le modèle
            data.forEach(ticket => {
                const ticketHTML = `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>${ticket.event}</title>
                        <style>
                            /* Vos styles CSS pour le ticket */
                        </style>
                    </head>
                    <body>
                        <div class="ticket">
                            <h1>${ticket.event}</h1>
                            <p><strong>Structure:</strong> ${ticket.structure}</p>
                            <p><strong>Adresse:</strong> ${ticket.adresse}</p>
                            <p><strong>Code Postal et Ville:</strong> ${ticket.code_postal_ville}</p>
                            <p><strong>SGC:</strong> ${ticket.sgc}</p>
                            <p><strong>Série:</strong> ${ticket.serie}</p>
                            <p><strong>Placement:</strong> ${ticket.placement}</p>
                            <p><strong>Numéro de billet:</strong> ${ticket.numero_billet}</p>
                            <p><strong>Numéro SIRET:</strong> ${ticket.numero_siret}</p>
                            <p><strong>Licence:</strong> ${ticket.licence}</p>
                            <img src="${ticket.img}" alt="Ticket Image">
                        </div>
                    </body>
                    </html>
                `;
                ticketsHTML += ticketHTML; // Ajouter le contenu du ticket au contenu global
            });

            // Créer un objet Blob à partir du contenu HTML
            const blob = new Blob([ticketsHTML], { type: 'text/html' });

            // Créer une URL objet à partir du Blob
            const url = URL.createObjectURL(blob);

            // Créer un lien de téléchargement
            const a = document.createElement('a');
            a.href = url;
            a.download = 'export-'+ `${eventName}` +'.html';

            // Ajouter le lien au document et simuler un clic
            document.body.appendChild(a);
            a.click();

            // Nettoyer l'URL objet
            URL.revokeObjectURL(url);
        })
        .catch(error => console.error(`Erreur lors de la récupération des tickets pour l'événement ${eventName}:`, error));
}

