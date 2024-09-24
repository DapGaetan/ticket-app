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

    const encodedEventName = encodeURIComponent(eventName.replace(/\s+/g, '_'));

    fetch(`/tickets/event/${encodedEventName}`)
        .then(response => response.json())
        .then(data => {
            let ticketCount = data.length;
            const ticketsPerPage = 4;
            const ticketHeight = 65 + 20 + 2;
            const pageHeight = 297;
            const totalTicketsHeight = ticketsPerPage * ticketHeight;
            const marginHeight = (pageHeight - totalTicketsHeight) / (ticketsPerPage - 1);

            const ticketsPerFile = 28 * ticketsPerPage;
            const fileCount = Math.ceil(ticketCount / ticketsPerFile);
            let fileIndex = 1;

            // Commencer à 0 (1er ticket)
            const startIndex = 0; 

            // S'assurer que nous ne dépassons pas le nombre total de tickets
            for (let i = 0; i < fileCount; i++) {
                let start = i * ticketsPerFile + startIndex; // Ajout de startIndex
                let end = Math.min(start + ticketsPerFile, ticketCount);

                // S'assurer que nous ne commençons pas à un index invalide
                if (start >= ticketCount) break;

                let ticketsHTML = '<div class="ticket-grid">';

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
                            margin: 10%;
                            padding: 0;
                        }

                        .ticket {
                        width: 200mm; /* Largeur A4 */
                        height: 70mm;
                        box-sizing: border-box;
                        background-image: url("/image/${ticket.img}");
                        background-size: cover;
                        background-position: center;
                        background-repeat: no-repeat;
                    }

                    .content {
                        display: grid;
                        grid-template-columns: 175px 102px 477px;
                        grid-template-rows: 264px;
                        padding: 0;
                        align-items: center;
                        color: white;
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

                    }

                    .left, .center, .right {
                        text-align: center;
                    }

                    /* Left */
                    .left{
                        margin-top: 70px;
                    }

                    .left h1 {
                        font-size: 0.5rem;
                        font-weight: bold;
                        margin: 5px 0;
                    }

                    .left h2 {
                        font-size: 1.1rem;
                        margin: 5px 0;
                    }

                    .left .serial{
                        font-size: 0.9rem;
                        font-weight: bold;
                        margin: 0;
                    }

                    .left .placement, .ticket-number {
                        font-size: 0.9rem;
                        margin: 0;
                    }

                    .left .ticket-number {
                        font-size: 0.9rem;
                        margin: 0;
                    }

                    .left .ticket-number span{
                        font-size: 1.4rem;
                        font-weight: bold;
                        margin: 0;
                    }

                    .left p{
                        font-size: 0.5rem;
                        margin-top: 15px;
                    }
                    /* **Left */

                    /* center */
                    .center{
                        transform: rotate(-90deg);
                        width: 100%;
                        margin: 15px 60px 0px 0px;
                    }

                    .center h1 {
                        font-size: 0.3rem;
                        font-weight: bold;
                    }

                    .center h2 {
                        font-size: 0.9rem;
                        margin: 5px 0;
                    }

                    .center .serial{
                        font-size: 0.7rem;
                        font-weight: bold;
                        margin: 0;
                        white-space: nowrap;
                    }

                    .center .placement, .ticket-number {
                        font-size: 0.7rem;
                        margin: 0;
                    }

                    .center .ticket-number {
                        font-size: 0.7rem;
                        margin: 0;
                    }

                    .center .ticket-number span{
                        font-size: 1.2rem;
                        font-weight: bold;
                        margin: 0;
                    }

                    .center p{
                        font-size: 0.4rem;
                        margin: 0;
                        white-space: nowrap;
                    }

                    .center p:last-child{
                        margin-top: 4px;
                        font-size: 0.6rem;
                        margin: 0px 0px 6px -60px;
                        text-align: center;
                        
                    }

                    .center p:last-child span{
                        font-size: 0.6rem;
                        margin: 0px 0px 0px 25px;
                        text-align: center;
                        
                    }
                    /* **center */

                    /* right */
                    .right{
                        margin-top: 120px;
                        padding-right: 245px;
                    }

                    .right h1 {
                        font-size: 0.6rem;
                        font-weight: bold;
                        margin: 5px 0;
                    }

                    .right h2 {
                        font-size: 1.2rem;
                        margin: 5px 0;
                    }

                    .right .serial{
                        font-size: 1rem;
                        font-weight: bold;
                        margin: 0;
                    }

                    .right .placement, .ticket-number {
                        font-size: 1rem;
                        margin: 0;
                    }

                    .right .ticket-number {
                        font-size: 1rem;
                        margin: 0;
                    }

                    .right .ticket-number span{
                        font-size: 1.5rem;
                        font-weight: bold;
                        margin: 0;
                    }

                    .right p{
                        font-size: 0.6rem;
                        margin-top: 15px;
                    }
                    /* **right */

                    @media print {
                        .ticket {
                            page-break-inside: avoid;
                        }
                    }
                                        
                    </style>
                    </head>
                    <body>
                    <div class="ticket">
                        <div class="content">
                            <!-- Section Gauche -->
                            <div class="left">
                                <h1 class="serial">${ticket.serie}</h1>
                                <p class="placement">${ticket.placement}</p>
                                <p class="ticket-number">N° billet : <br>
                                    <span>${ticket.numero_billet}</span></p>
                                <p>${ticket.adresse} <br>
                                    ${ticket.code_postal_ville}</p>
                                <p>${ticket.numero_siret}</p>
                                <p>${ticket.licence}<br>
                                    ${ticket.sgc}</p>
                            </div>

                            <!-- Section Centre -->
                            <div class="center">
                                <h1 class="serial">${ticket.serie}</h1>
                                <p class="placement">${ticket.placement}</p>
                                <p class="ticket-number">N° billet : <br>
                                    <span>${ticket.numero_billet}</span></p>
                                <p><span>${ticket.adresse}, ${ticket.code_postal_ville}</span><br>
                                ${ticket.licence} - ${ticket.sgc}</p>
                            </div>

                            <!-- Section Droite -->
                            <div class="right">
                                <h1 class="serial">${ticket.serie}</h1>
                                <p class="placement">${ticket.placement}</p>
                                <p class="ticket-number">N° billet : <br>
                                    <span>${ticket.numero_billet}</span></p>
                                <p>${ticket.adresse}, ${ticket.code_postal_ville}<br>
                                ${ticket.licence} - ${ticket.sgc}</p>
                            </div>
                        </div>
                    </div>
                    </body>
                    </html>
                    `;

                    ticketsHTML += ticketHTML;

                    if ((j + 1 - start) % ticketsPerPage !== 0 && j !== end - 1) {
                        ticketsHTML += `<div style="height: ${marginHeight}mm; width: 100%;"></div>`;
                    }

                    if ((j + 1 - start) % ticketsPerPage === 0 && j !== end - 1) {
                        ticketsHTML += '<div style="page-break-before: always;"></div>';
                    }
                }

                ticketsHTML += '</div>';

                const opt = {
                    margin:       [0, 0],
                    filename:     `export-${eventName}-${fileIndex}.pdf`,
                    image:        { type: 'jpeg', quality: 1 },
                    html2canvas:  { scale: 2 },
                    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
                };

                html2pdf()
                    .from(ticketsHTML)
                    .set(opt)
                    .toPdf()
                    .save();

                fileIndex++;
            }

            document.getElementById('export-loading-overlay').style.display = 'none';
        })
        .catch(error => {
            console.error(`Erreur lors de la récupération des tickets pour l'événement ${eventName}:`, error);
            document.getElementById('export-loading-overlay').style.display = 'none';
        });
}

