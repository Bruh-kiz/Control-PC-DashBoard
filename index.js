const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const sudo = require('sudo-prompt');  // Bibliothèque pour demander les privilèges administratifs
const si = require('systeminformation');  // Bibliothèque pour obtenir des infos système

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,  // Permet de communiquer entre les processus
            contextIsolation: false // Assurez-vous de pouvoir utiliser ipcRenderer
        }
    });

    mainWindow.loadFile('index.html');  // Charger la page HTML de l'interface utilisateur
}

app.whenReady().then(() => {
    // Vérification pour s'assurer que l'application est lancée en administrateur
    const options = {
        name: 'Electron App',
        icns: '/path/to/icns'  // Pour Mac, sinon tu peux ignorer ça
    };

    sudo.exec('echo hello', options, (error, stdout, stderr) => {
        if (error) throw error;
        console.log('Lancement avec privilèges administratifs');
        createWindow();  // Crée la fenêtre principale une fois les privilèges obtenus
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// Récupérer les détails de la RAM et les envoyer au front-end
ipcMain.on('request-ram-info', (event) => {
    si.mem().then(data => {
        event.sender.send('ram-info', data);  // Envoie les informations de RAM à l'interface utilisateur
    });
});
