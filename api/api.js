const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');

const api = express();

// Middleware pour parser le corps des requêtes JSON
api.use(express.json());

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

    // -Fonction sauvegarder les action dans les fichiers CSV
    function saveDataToCSV() {
        if (ticketData.length > 0) {
            const ticketCsv = ticketData.map(ticket => Object.values(ticket).join(',')).join('\n');
            fs.writeFileSync('./database/database.csv', Object.keys(ticketData[0]).join(',') + '\n' + ticketCsv);
        } else {
            console.error('Aucune donnée à sauvegarder');
        }
        console.log(ticketData)
    }

  
  // -Fonction incrémenter les ids automatiquement
  function getNextId(data) {
    const ids = data.map(item => parseInt(item.id));
    const nextId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
    return nextId.toString();
  }

    //  Route GET
    api.get('/', (req, res) => {
    res.json(ticketData);
    });

    //  Route GET pour un ticket
    api.get('/:id', (req, res) => {
    const ticket = ticketData.find((t) => t.id === req.params.id);
    if (ticket) {
    res.json(ticket);
    } else {
    res.status(404).send('ticket not found');
    }
    });

    // Route GET pour obtenir tous les tickets avec le même nom d'événement
    api.get('/event/:eventName', (req, res) => {
        const eventName = req.params.eventName;

        // Filtrer les tickets ayant le même nom d'événement
        const matchingTickets = ticketData.filter(ticket => ticket.event === eventName);

        if (matchingTickets.length > 0) {
            // Renvoyer les tickets correspondants s'ils existent
            res.json(matchingTickets);
        } else {
            // Renvoyer un message si aucun ticket n'est trouvé
            res.status(404).json({ message: `Aucun ticket trouvé avec l'événement ${eventName}` });
        }
    });

    // Route GET pour obtenir le nombre de tickets avec le même nom d'événement
    api.get('/event/:eventName/count', (req, res) => {
        const eventName = req.params.eventName;

        // Filtrer les tickets ayant le même nom d'événement
        const matchingTickets = ticketData.filter(ticket => ticket.event === eventName);

        // Renvoyer le nombre de tickets correspondants
        res.json({ count: matchingTickets.length });
    });

    // Route GET pour obtenir le nombre de tickets pour chaque événement
    api.get('/event/count/tickets', (req, res) => {
        // Créer un objet pour stocker le nombre de tickets pour chaque événement
        const eventCount = {};

        // Compter le nombre de tickets pour chaque événement
        ticketData.forEach(ticket => {
            if (!eventCount[ticket.event]) {
                eventCount[ticket.event] = 1;
            } else {
                eventCount[ticket.event]++;
            }
        });
        
        // Renvoyer l'objet contenant le nombre de tickets pour chaque événement
        res.json(eventCount);
    });
    
    //  Route POST
    api.post('/', (req, res) => {
        const newTicket = {
        id: getNextId(ticketData),
        ...req.body,
        };
        ticketData.push(newTicket);
        res.status(201).json(newTicket);
        saveDataToCSV();
    });

    // Route POST pour créer un nombre spécifique de tickets
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

        // Enregistrer les modifications dans le fichier CSV
        saveDataToCSV();

        res.status(201).json({ message: `${count} tickets ont été ajoutés avec succès` });
    });

    // Endpoint pour recevoir les images
    api.post('/upload-image', (req, res) => {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('Aucune image n\'a été téléchargée.');
        }

        // Récupérer le fichier envoyé par le client
        const imageFile = req.files.image;

        // Déplacer le fichier vers le dossier public/images
        imageFile.mv('./public/images/' + imageFile.name, (err) => {
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

    // Route PATCH pour modifier un champ spécifique dans tous les tickets avec le même nom d'événement
    api.patch('/event/:eventName', (req, res) => {
        const eventName = req.params.eventName;
        const { fieldToUpdate, newValue } = req.body;

        // Filtrer les tickets ayant le même nom d'événement
        const matchingTickets = ticketData.filter(ticket => ticket.event === eventName);

        if (matchingTickets.length === 0) {
            return res.status(404).json({ message: `Aucun ticket trouvé avec l'événement ${eventName}` });
        }

        // Mettre à jour le champ spécifié pour tous les tickets correspondants
        matchingTickets.forEach(ticket => {
            ticket[fieldToUpdate] = newValue;
        });

        // Enregistrer les modifications dans le fichier CSV
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

    // Route PUT pour modifier tous les tickets avec le même nom d'événement
    api.put('/event/:eventName', (req, res) => {
        const eventName = req.params.eventName;
        const updatedData = req.body;

        // Filtrer les tickets ayant le même nom d'événement
        const matchingTickets = ticketData.filter(ticket => ticket.event === eventName);

        if (matchingTickets.length === 0) {
            return res.status(404).json({ message: `Aucun ticket trouvé avec l'événement ${eventName}` });
        }

        // Mettre à jour les champs pour tous les tickets correspondants
        matchingTickets.forEach(ticket => {
            Object.keys(updatedData).forEach(key => {
                ticket[key] = updatedData[key];
            });
        });

        // Enregistrer les modifications dans le fichier CSV
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

    // Route DELETE pour supprimer tous les tickets ayant le même nom d'événement
    api.delete('/event/:eventName', (req, res) => {
        const eventName = req.params.eventName;

        // Filtrer les tickets ayant le même nom d'événement
        const filteredTickets = ticketData.filter(ticket => ticket.event === eventName);

        if (filteredTickets.length > 0) {
            // Supprimer les tickets filtrés du tableau de données
            ticketData = ticketData.filter(ticket => ticket.event !== eventName);

            // Enregistrer les modifications dans le fichier CSV
            saveDataToCSV();

            res.json({ message: `Tous les tickets avec l'événement ${eventName} ont été supprimés` });
        } else {
            res.status(404).json({ message: `Aucun ticket trouvé avec l'événement ${eventName}` });
        }
    });

    module.exports = api;