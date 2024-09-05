const { app, BrowserWindow, autoUpdater, dialog } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { exec } = require('child_process');
const systeminformation = require('systeminformation');

// Fonction pour vérifier et demander des privilèges d'administrateur
function runAsAdmin() {
  if (process.platform === 'win32') {
    const spawn = require('child_process').spawn;
    const proc = spawn(process.argv[0], process.argv.slice(1), {
      detached: true,
      stdio: 'inherit',
      windowsVerbatimArguments: true,
      shell: true
    });
    proc.unref();
    app.quit();
  }
}

if (require('electron-squirrel-startup')) {
  runAsAdmin();
}

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'renderer.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Auto-update
  if (!isDev) {
    const server = 'https://update.electronjs.org';
    const feed = `${server}/${app.getName()}/${process.platform}-${process.arch}/${app.getVersion()}`;
    autoUpdater.setFeedURL(feed);
    autoUpdater.checkForUpdates();
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

autoUpdater.on('update-available', () => {
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'Update Available',
    message: 'A new version is available. Downloading now...'
  });
});

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'Update Ready',
    message: 'Update downloaded; it will be installed on restart.'
  });
});
