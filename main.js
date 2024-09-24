const { app, BrowserWindow, ipcMain, autoUpdater } = require('electron');
const express = require('express');
const path = require('path');
const os = require('os');
const fs = require('fs');
const api = require('./api/api.js');

// const server = 'https://update.electronjs.org'; décommenter 102 et 103 aussi 
// const feed = `${server}/DapGaetan/ticket-app/${process.platform}-${process.arch}/${app.getVersion()}`;

const expressApp = express();
const port = 3000;

const isWindows = os.platform() === 'win32';
const isMac = os.platform() === 'darwin';

expressApp.set('view engine', 'ejs');
expressApp.set('views', path.join(__dirname, 'views'));
expressApp.use(express.static(path.join(__dirname, 'public')));
expressApp.use('/tickets', api);

expressApp.get('/', (req, res) => {
    res.render('home', { title: "Accueil", isWindows });
});
expressApp.get('/ticket', (req, res) => {
    res.render('tickets', { title: "Mes tickets", isWindows });
});
expressApp.get('/build', (req, res) => {
    res.render('builder', { title: "Création de tickets", isWindows });
});
expressApp.get('/modify', (req, res) => {
    res.render('modify', { title: "Modifier les tickets d'un événement", isWindows });
});
expressApp.get('/delete', (req, res) => {
    res.render('delete', { title: "Supprimer des tickets", isWindows });
});
expressApp.get('/addImage', (req, res) => {
    res.render('image', { title: "Mes designs", isWindows });
});
expressApp.get('/export', (req, res) => {
    res.render('export', { title: "Exporter des tickets", isWindows });
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
        frame: !isWindows,
        icon: path.join(__dirname, './ico/icon.ico'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    mainWindow.loadURL('http://localhost:3000');
    // mainWindow.webContents.openDevTools();

    mainWindow.on('close', (event) => {
        if (isMac) {
            app.quit();
        } else {
            mainWindow = null;
        }
    });

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

expressApp.listen(port, () => {
    console.log(`Le serveur d'api écoute sur le port http://localhost:${port}`);
});

app.on('ready', () => {
    createWindow();
    // autoUpdater.setFeedURL(feed);
    // autoUpdater.checkForUpdatesAndNotify();
});

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

ipcMain.on('close-app', () => {
    if (isMac) {
        app.quit();
    } else {
        mainWindow.close();
    }
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
