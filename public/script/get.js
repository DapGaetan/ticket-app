// Fonction pour effectuer une requête AJAX
function fetchEventCounts() {
  // Effectuer une requête GET vers votre API
  fetch('/tickets/event/count/tickets')
      .then(response => response.json()) // Convertir la réponse en JSON
      .then(data => {
          // Appeler la fonction pour afficher les données dans le tableau
          displayEventCounts(data);
      })
      .catch(error => console.error('Erreur lors de la récupération des données:', error));
}

// Fonction pour afficher les données dans le tableau
function displayEventCounts(eventCounts) {
  const tableBody = document.getElementById('event-table-body');

  // Effacer le contenu existant du tableau
  tableBody.innerHTML = '';

  // Parcourir les données et créer les lignes du tableau
  for (const eventName in eventCounts) {
      const count = eventCounts[eventName];

      // Créer une nouvelle ligne
      const row = tableBody.insertRow();

      // Insérer le nom de l'événement dans la première cellule
      const eventNameCell = row.insertCell();
      eventNameCell.textContent = eventName;

      // Insérer le nombre de tickets dans la deuxième cellule
      const countCell = row.insertCell();
      countCell.textContent = count;
  }
}

// Appeler la fonction pour récupérer les données et les afficher lorsque la page est chargée
document.addEventListener('DOMContentLoaded', fetchEventCounts);

// Fonction pour récupérer les événements et afficher la liste
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
              listItem.addEventListener('click', () => fetchTickets(event));
              eventList.appendChild(listItem);
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

// Appeler la fonction pour récupérer les événements au chargement de la page
document.addEventListener('DOMContentLoaded', fetchEvents);