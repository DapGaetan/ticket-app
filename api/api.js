const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const csv = require('csv-parser');

const api = express();

// Middleware pour parser le corps des requêtes JSON
api.use(express.json());
api.use(fileUpload());
let ticketData = [];

// Lire le fichier student
fs.createReadStream('./database/database.csv')
  .pipe(csv())
  .on('data', (row) => {
    ticketData.push(row);
  })
  .on('end', () => {
    console.log('Le fichier database.csv est chargé');
  });
  
    function saveDataToCSV() {
        if (ticketData.length > 0) {
            const ticketCsv = ticketData.map(ticket => Object.values(ticket).join(',')).join('\n');
            fs.writeFileSync('./database/database.csv', Object.keys(ticketData[0]).join(',') + '\n' + ticketCsv);
        } else {
            console.error('Aucune donnée à sauvegarder');
        }
        console.log(ticketData)
    }

  function getNextId(data) {
    const ids = data.map(item => parseInt(item.id));
    const nextId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
    return nextId.toString();
  }

    //  Route GET
    api.get('/', (req, res) => {
    res.json(ticketData);
    });

    api.get('/:id', (req, res) => {
    const ticket = ticketData.find((t) => t.id === req.params.id);
    if (ticket) {
    res.json(ticket);
    } else {
    res.status(404).send('ticket not found');
    }
    });

    api.get('/event/:eventName', (req, res) => {
        const eventName = req.params.eventName;

        const matchingTickets = ticketData.filter(ticket => ticket.event === eventName);

        if (matchingTickets.length > 0) {
            res.json(matchingTickets);
        } else {
            res.status(404).json({ message: `Aucun ticket trouvé avec l'événement ${eventName}` });
        }
    });

    api.get('/event/:eventName/count', (req, res) => {
        const eventName = req.params.eventName;
        const matchingTickets = ticketData.filter(ticket => ticket.event === eventName);
        res.json({ count: matchingTickets.length });
    });

    api.get('/event/count/tickets', (req, res) => {
        const eventCount = {};

        ticketData.forEach(ticket => {
            if (!eventCount[ticket.event]) {
                eventCount[ticket.event] = 1;
            } else {
                eventCount[ticket.event]++;
            }
        });
        res.json(eventCount);
    });
    
    //  Route POST
    api.post('/', (req, res) => {
        const newTicket = {
        id: getNextId(ticketData),
        ...req.body,
        img: req.body.img

        };
        ticketData.push(newTicket);
        res.status(201).json(newTicket);
        saveDataToCSV();
    });

    api.post('/bulk/:count', (req, res) => {
        const count = parseInt(req.params.count);

        if (isNaN(count) || count <= 0) {
            return res.status(400).json({ message: 'Le nombre de tickets doit être un entier positif supérieur à zéro' });
        }

        for (let i = 0; i < count; i++) {
            const newTicket = {
                numéro_billet: i,
                ...req.body  // Vous pouvez également utiliser des données du corps de la requête
            };
            ticketData.push(newTicket);
        }
        saveDataToCSV();

        res.status(201).json({ message: `${count} tickets ont été ajoutés avec succès` });
    });

    api.post('/upload-image', (req, res) => {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('Aucune image n\'a été téléchargée.');
        }
        const imageFile = req.files.image;
        imageFile.mv('./public/image/' + imageFile.name, (err) => {
            if (err) {
                return res.status(500).send(err);
            }

            res.send('L\'image a été téléchargée avec succès.');
        });
    });

    //  Route PATCH
    api.patch('/:id', (req, res) => {
    const ticketIndex = ticketData.findIndex((t) => t.id === req.params.id);
    if (ticketIndex !== -1) {
        ticketData[ticketIndex] = { ...ticketData[ticketIndex], ...req.body };
        res.json(ticketData[ticketIndex]);
    } else {
        res.status(404).send('ticket not found');
    }
    saveDataToCSV();
    });

    api.patch('/event/:eventName', (req, res) => {
        const eventName = req.params.eventName;
        const { fieldToUpdate, newValue } = req.body;
        const matchingTickets = ticketData.filter(ticket => ticket.event === eventName);

        if (matchingTickets.length === 0) {
            return res.status(404).json({ message: `Aucun ticket trouvé avec l'événement ${eventName}` });
        }
        matchingTickets.forEach(ticket => {
            ticket[fieldToUpdate] = newValue;
        });
        saveDataToCSV();

        res.json({ message: `Le champ ${fieldToUpdate} de tous les tickets avec l'événement ${eventName} a été mis à jour` });
    });

    //  Route PUT 
    api.put('/:id', (req, res) => {
    const ticketIndex = ticketData.findIndex((t) => t.id === req.params.id);
    if (ticketIndex !== -1) {
        ticketData[ticketIndex] = req.body;
        res.json(ticketData[ticketIndex]);
    } else {
        res.status(404).send('ticket not found');
    }
    saveDataToCSV();
    });

    api.put('/event/:eventName', (req, res) => {
        const eventName = req.params.eventName;
        const updatedData = req.body;
        const matchingTickets = ticketData.filter(ticket => ticket.event === eventName);

        if (matchingTickets.length === 0) {
            return res.status(404).json({ message: `Aucun ticket trouvé avec l'événement ${eventName}` });
        }
        matchingTickets.forEach(ticket => {
            Object.keys(updatedData).forEach(key => {
                ticket[key] = updatedData[key];
            });
        });
        saveDataToCSV();

        res.json({ message: `Tous les tickets avec l'événement ${eventName} ont été mis à jour` });
    });

    //  Route DELETE
    api.delete('/:id', (req, res) => {
        const ticketIndex = ticketData.findIndex((t) => t.id === req.params.id);
        if (ticketIndex !== -1) {
        const deletedTicket = ticketData.splice(ticketIndex, 1)[0];
        res.json(deletedTicket);
        saveDataToCSV();
        } else {
        res.status(404).send('ticket not found');
        }
    });

    api.delete('/event/:eventName', (req, res) => {
        const eventName = req.params.eventName;
        const filteredTickets = ticketData.filter(ticket => ticket.event === eventName);

        if (filteredTickets.length > 0) {
            ticketData = ticketData.filter(ticket => ticket.event !== eventName);
            saveDataToCSV();

            res.json({ message: `Tous les tickets avec l'événement ${eventName} ont été supprimés` });
        } else {
            res.status(404).json({ message: `Aucun ticket trouvé avec l'événement ${eventName}` });
        }
    });

    module.exports = api;