const express = require('express');
const path = require('path');
const fs = require('fs');
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
const titleAddImage = "Mes designs"
const titleExport = "Exporter des tickets"

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
app.get('/addImage', (req, res) => {
  res.render('image', { title: titleAddImage }); // Rend la vue image.ejs
});
// app.get('/ticket-template', (req, res) => {
//   // Lire le contenu du fichier ticket-template.hbs
//   fs.readFile('ticket-template.hbs', 'utf8', (err, data) => {
//     if (err) {
//       console.error('Erreur lors de la lecture du fichier ticket-template.hbs :', err);
//       res.status(500).send('Erreur lors de la lecture du modèle Handlebars');
//       return;
//     }
//     res.send(data);
//   });
// });
app.get('/export', (req, res) => {
  res.render('export', { title: titleExport }); // Rend la vue image.ejs
});
app.get('/images', (req, res) => {
  const imageDir = path.join(__dirname, 'public', 'image');

  // Lire le répertoire des images
  fs.readdir(imageDir, (err, files) => {
      if (err) {
          console.error('Erreur lors de la lecture du répertoire des images:', err);
          res.status(500).send('Erreur lors de la lecture du répertoire des images');
          return;
      }

      // Filtrer les fichiers pour ne récupérer que les images
      const imageFiles = files.filter(file => {
          const extension = path.extname(file).toLowerCase();
          return extension === '.jpg' || extension === '.jpeg' || extension === '.png' || extension === '.gif';
      });

      // Renvoyer la liste des noms de fichiers d'images
      res.json(imageFiles);
  });
});


app.listen(port, () => {
  console.log(`Le serveur d'api écoute sur le port http://localhost:${port}`);
});
