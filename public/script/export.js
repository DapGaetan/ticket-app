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
                        *{
                            margin: 0;
                            padding: 0;
                        }
                        .ticket{
                            background-color: red;
                            height: fit-content;
                            overflow: hidden;
                            border-bottom: dashed blue;
                            border-left: solid blue;
                            border-right: solid blue;
                        }
                        .top{
                            display : flex;
                            justify-content : space-between;
                            align-content   : center;
                            border-top: solid blue;
                            border-bottom: solid blue;
                        }
                        h1,h2,h3{
                            font-size: 1.5rem;
                            color: rgb(48, 48, 48);
                            padding: 20px;
                        }
                        h1{
                            border-left: solid blue;
                            border-right: solid blue;
                        }
                        .content{
                            display : flex;
                            justify-content : space-between;
                            align-content   : center;
                            text-align: center;
                            height: fit-content;
                        }
                        .center p{
                            border-left:  solid blue;
                            border-right:  solid blue;
                            border-bottom:  solid blue;
                            padding: 0;
                        }
                        img{
                            height: 100%;
                            width: 650px;
                            border-left: solid blue;
                            border-right: solid blue;
                            /* background-image: url(./public/image/${ticket.img});
                            background-size: cover;
                            background-repeat: no-repeat; */
                        }
                        .left{
                            padding: 20px;
                        }
                        .right{
                            padding: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="ticket">
                        <div class="top">
                            <h2>${ticket.structure}</h2>
                            <h1>${ticket.event.replaceAll('_', ' ')}</h1>
                            <h3>${ticket.structure}</h3>
                        </div>
                        <div class="content">
                            <div class="left">
                                <p>${ticket.adresse}</p>
                                <p>${ticket.code_postal_ville}</p>
                                <p>${ticket.sgc}</p>
                                <p>${ticket.serie}</p>
                                <p>${ticket.placement}</p>
                                <p>Billet N°${ticket.numero_billet}</p>
                                <p>${ticket.numero_siret}</p>
                            </div>
                            <div class="center">
                                <p>Billet N°${ticket.numero_billet}</p>
                                <img src="./public/image/${ticket.img}" alt="">
                            </div>
                            <div class="right">
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