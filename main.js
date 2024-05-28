const { app, BrowserWindow, ipcMain } = require('electron');
const express = require('express');
const path = require('path');
const fs = require('fs');
const api = require('./api/api.js');

const expressApp = express();
const port = 3000;

expressApp.set('view engine', 'ejs');
expressApp.set('views', 'views');
expressApp.use(express.static('public'));
expressApp.use('/tickets', api);

// -- Route pages
// Définir les titres
const titleHome = "Accueil";
const titleTickets = "Mes tickets";
const titleBuilder = "Création de tickets";
const titleModify = "Modifier les tickets d'un événement";
const titleDelete = "Supprimer des tickets";
const titleAddImage = "Mes designs"
const titleExport = "Exporter des tickets"

// Passer le titre au modèle EJS
expressApp.get('/', (req, res) => {
    res.render('home', { title: titleHome }); // Rend la vue home.ejs
});
expressApp.get('/ticket', (req, res) => {
  res.render('tickets', { title: titleTickets }); // Rend la vue tickets.ejs
});
expressApp.get('/build', (req, res) => {
  res.render('builder', { title: titleBuilder }); // Rend la vue builder.ejs
});
expressApp.get('/modify', (req, res) => {
  res.render('modify', { title: titleModify }); // Rend la vue modify.ejs
});
expressApp.get('/delete', (req, res) => {
  res.render('delete', { title: titleDelete }); // Rend la vue delete.ejs
});
expressApp.get('/addImage', (req, res) => {
  res.render('image', { title: titleAddImage }); // Rend la vue image.ejs
});
expressApp.get('/export', (req, res) => {
  res.render('export', { title: titleExport }); // Rend la vue image.ejs
});
expressApp.get('/images', (req, res) => {
  const imageDir = path.join(__dirname, 'public', 'image');

  fs.readdir(imageDir, (err, files) => {
      if (err) {
          console.error('Erreur lors de la lecture du répertoire des images:', err);
          res.status(500).send('Erreur lors de la lecture du répertoire des images');
          return;
      }

      const imageFiles = files.filter(file => {
          const extension = path.extname(file).toLowerCase();
          return extension === '.jpg' || extension === '.jpeg' || extension === '.png' || extension === '.gif';
      });

      res.json(imageFiles);
  });
});

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    minWidth: 600,
    minHeight: 900,
    closable: true,
    darkTheme: false,
    frame: false,
    icon: path.join(__dirname, './ico/icon.ico'),
    webPreferences: {
      nodeIntegration: true, // Activer l'intégration de Node.js pour accéder aux modules du côté client
      contextIsolation: false,
    }
  });

  mainWindow.loadURL('http://localhost:3000'); // Charger l'application Express dans la fenêtre Electron
  mainWindow.webContents.openDevTools();


  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

expressApp.listen(port, () => {
  console.log(`Le serveur d'api écoute sur le port http://localhost:${port}`);
});

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

// Écouter les événements IPC pour les boutons personnalisés
ipcMain.on('close-app', () => {
  app.quit();
});

ipcMain.on('minimize-app', () => {
  mainWindow.minimize();
});

ipcMain.on('maximize-app', () => {
  if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
  } else {
      mainWindow.maximize();
  }
});