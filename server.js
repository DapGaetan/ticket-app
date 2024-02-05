const express = require('express');
const api = require('./api/api.js');

const app = express();
const port = 3000;

// Définir le moteur de template EJS
app.set('view engine', 'ejs');

// Définir le répertoire des vues
app.set('views', 'views');

app.use(express.static('public'));
app.use('/tickets', api);


// --Route pages
// Définir le titre de la page
const titleHome = "Accueil";
const titleTickets = "Mes tickets";
const titleBuilder = "Création de tickets";
const titleModify = "Modifier les tickets d'un événement";
const titleDelete = "Supprimer des tickets";

// Passer le titre à votre modèle EJS
app.get('/', (req, res) => {
    res.render('home', { title: titleHome }); // Rend la vue home.ejs
});
app.get('/ticket', (req, res) => {
  res.render('tickets', { title: titleTickets }); // Rend la vue tickets.ejs
});
app.get('/build', (req, res) => {
  res.render('builder', { title: titleBuilder }); // Rend la vue builder.ejs
});
app.get('/modify', (req, res) => {
  res.render('modify', { title: titleModify }); // Rend la vue modify.ejs
});
app.get('/delete', (req, res) => {
  res.render('delete', { title: titleDelete }); // Rend la vue delete.ejs
});

app.listen(port, () => {
  console.log(`Le serveur d'api écoute sur le port http://localhost:${port}`);
});
