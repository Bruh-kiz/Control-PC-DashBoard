const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const sudo = require('sudo-prompt');
const { execSync } = require('child_process');

let mainWindow;

// Fonction pour vérifier si l'application est lancée avec des droits administrateur
function isAdmin() {
  try {
    execSync('net session', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

// Fonction pour relancer l'application avec les droits administrateur
function relaunchAsAdmin() {
  const options = {
    name: 'Control PC Dashboard',
  };

  // Relance l'application avec des droits administrateur
  sudo.exec(`"${process.execPath}"`, options, (error) => {
    if (error) {
      console.error('Échec de l\'élévation des privilèges administrateur :', error);
      app.quit();
    } else {
      app.quit();
    }
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'favicon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'renderer.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('src/index.html');
}

app.whenReady().then(() => {
  // Vérifie si l'application est lancée avec des droits admin, sinon relance avec sudo
  if (!isAdmin()) {
    console.log('Lancement en tant qu\'administrateur requis. Relance...');
    relaunchAsAdmin();
  } else {
    createWindow();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
