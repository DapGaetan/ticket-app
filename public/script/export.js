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
    const encodedEventName = encodeURIComponent(eventName.replace(/\s+/g, '_')); // Encoder le nom de l'événement

    fetch(`/tickets/event/${encodedEventName}`)
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
                <title>${ticket.event.replaceAll('_', ' ')}</title>
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                    }
                
                    .ticket {
                        width: 210mm; /* Largeur pour le format A4 */
                        padding: 20px;
                        border: 2px solid blue;
                        margin: auto;
                    }
                    .content {
                        display: flex;
                        flex-direction: row;
                        justify-content: space-around;
                        text-align: center;
                    }
                    h1,h2,h3 {
                        font-size: 1rem;
                    }
                    img {
                        width: 100%;
                        height: 80%;
                    }
                </style>
                </head>
                <body>
                    <div class="ticket">
                        <div class="content">
                            <div class="left">
                                <h2>${ticket.structure}</h2>
                                <p>${ticket.adresse}</p>
                                <p>${ticket.code_postal_ville}</p>
                                <p>${ticket.sgc}</p>
                                <p>${ticket.serie}</p>
                                <p>${ticket.placement}</p>
                                <p>Billet N°${ticket.numero_billet}</p>
                                <p>${ticket.numero_siret}</p>
                            </div>
                            <div class="center">
                                <h1>${ticket.event.replaceAll('_', ' ')}</h1>
                                <p>Billet N°${ticket.numero_billet}</p>
                                <img src="/image/${ticket.img}" alt="">
                            </div>
                            <div class="right">
                                <h3>${ticket.structure}</h3>
                                <p>${ticket.adresse}</p>
                                <p>${ticket.code_postal_ville}</p>
                                <p>${ticket.licence}</p>
                                <p>${ticket.serie}</p>
                                <p>${ticket.placement}</p>
                                <p>Billet N°${ticket.numero_billet}</p>
                                <p>${ticket.numero_siret}</p>
                            </div>
                        </div>
                    </div>
        </body>
        </html>
                `;
                ticketsHTML += ticketHTML; // Ajouter le contenu du ticket au contenu global
            });

            // Utiliser html2pdf pour générer le PDF
            html2pdf()
                .from(ticketsHTML)
                .toPdf()
                .save('export-' + eventName + '.pdf');
        })
        .catch(error => console.error(`Erreur lors de la récupération des tickets pour l'événement ${eventName}:`, error));
}
