function fetchEventCounts() {
    fetch('/tickets/event/count/tickets')
        .then(response => response.json())
        .then(data => {
            displayEventCounts(data);
        })
        .catch(error => console.error('Erreur lors de la récupération des données:', error));
  }
  
  function displayEventCounts(eventCounts) {
    const tableBody = document.getElementById('event-table-body');
  
    tableBody.innerHTML = '';

    for (const eventName in eventCounts) {
        const count = eventCounts[eventName];
        const row = tableBody.insertRow();
        const eventNameCell = row.insertCell();
        eventNameCell.textContent = eventName;
        const countCell = row.insertCell();
        countCell.textContent = count;
    }
  }

  document.addEventListener('DOMContentLoaded', fetchEventCounts);
  
  function fetchEvents() {
    fetch('/tickets/event/count/tickets')
        .then(response => response.json())
        .then(data => {
            const eventList = document.getElementById('event-list');
            for (const event in data) {
                const listItem = document.createElement('li');
                listItem.textContent = `${event} (${data[event]} tickets)`;
                listItem.addEventListener('click', () => fetchTickets(event));
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
                Licence : ${ticket.licence}
                `;
                ticketList.appendChild(listItem);
            });
        })
        .catch(error => console.error(`Erreur lors de la récupération des tickets pour l'événement ${eventName}:`, error));
  }
  
  document.addEventListener('DOMContentLoaded', fetchEvents);