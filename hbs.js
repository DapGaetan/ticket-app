// hbs.js

const fs = require('fs');
const Handlebars = require('handlebars');
const { resolve } = require('path');

// Fonction pour filtrer les tickets par événement
function filterTicketsByEvent(tickets, eventName) {
    return tickets.filter(ticket => ticket.event === eventName);
}

// Fonction pour générer le HTML pour un ticket individuel
function generateTicketHTML(ticket) {
    const ticketTemplate = Handlebars.compile(fs.readFileSync(resolve(__dirname, 'ticket-template.hbs'), 'utf8'));
    return ticketTemplate(ticket);
}

// Fonction pour générer les visuels de ticket pour un événement
function generateEventTicketsHTML(eventTickets) {
    let eventTicketsHTML = '';

    eventTickets.forEach(ticket => {
        eventTicketsHTML += generateTicketHTML(ticket);
    });

    return eventTicketsHTML;
}

// Fonction pour générer le HTML complet pour tous les événements
function generateAllEventTicketsHTML(tickets) {
    // Collecter tous les événements uniques
    const uniqueEvents = [...new Set(tickets.map(ticket => ticket.event))];

    let allEventTicketsHTML = '';

    uniqueEvents.forEach(eventName => {
        const eventTickets = filterTicketsByEvent(tickets, eventName);
        const eventHTML = generateEventTicketsHTML(eventTickets);

        // Ajouter le HTML de chaque événement
        allEventTicketsHTML += `<div class="event-tickets">${eventHTML}</div>`;
    });

    return allEventTicketsHTML;
}

// Charger les données des tickets à partir du fichier CSV
function loadTicketsFromCSV() {
    const ticketData = fs.readFileSync(resolve(__dirname, 'database', 'database.csv'), 'utf8').split('\n').map(row => row.split(','));
    const headers = ticketData.shift(); // Retirer les en-têtes

    const tickets = ticketData.map(row => {
        const ticket = {};
        headers.forEach((header, index) => {
            ticket[header] = row[index];
        });
        return ticket;
    });

    return tickets;
}

module.exports = {
    generateAllEventTicketsHTML,
    loadTicketsFromCSV
};