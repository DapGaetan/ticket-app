document.addEventListener('DOMContentLoaded', fetchEvents);

function fetchEvents() {
    fetch('/tickets/event/count/tickets')
        .then(response => response.json())
        .then(data => {
            const eventList = document.getElementById('event-list');
            for (const event in data) {
                const listItem = document.createElement('li');
                listItem.textContent = `${event} (${data[event]} tickets)`;
                listItem.addEventListener('click', () => {
                    const selectedItems = document.querySelectorAll('#event-list li.selected');
                    selectedItems.forEach(item => item.classList.remove('selected'));
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
    document.getElementById('export-loading-overlay').style.display = 'flex';

    const encodedEventName = encodeURIComponent(eventName.replace(/\s+/g, '_')); // Encoder le nom de l'événement

    fetch(`/tickets/event/${encodedEventName}`)
        .then(response => response.json())
        .then(data => {
            let ticketCount = data.length;
            const ticketsPerPage = 4; // Nombre maximal de tickets par page
            const ticketsPerFile = 45 * ticketsPerPage; // Environ 50 pages par fichier
            const fileCount = Math.ceil(ticketCount / ticketsPerFile); // Nombre total de fichiers nécessaires
            let fileIndex = 1; // Index du fichier PDF

            for (let i = 0; i < fileCount; i++) {
                let start = i * ticketsPerFile;
                let end = Math.min(start + ticketsPerFile, ticketCount);

                let ticketsHTML = ''; // HTML des tickets à exporter

                for (let j = start; j < end; j++) {
                    const ticket = data[j];
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
                            font-size: 0.9rem;
                        }
                        p{
                            font-size: 0.7rem;
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
                    ticketsHTML += ticketHTML;

                    // Ajouter un saut de page après chaque groupe de 4 tickets
                    if ((j + 1 - start) % ticketsPerPage === 0 && j !== end - 1) {
                        ticketsHTML += '<div style="height: 132px; width: 100%;"></div>';
                    }
                }

                html2pdf()
                    .from(ticketsHTML)
                    .toPdf()
                    .save(`export-${eventName}-${fileIndex}.pdf`);

                fileIndex++; // Passer au prochain fichier
            }

            document.getElementById('export-loading-overlay').style.display = 'none';
        })
        .catch(error => {
            console.error(`Erreur lors de la récupération des tickets pour l'événement ${eventName}:`, error);
            document.getElementById('export-loading-overlay').style.display = 'none';
        });
}
