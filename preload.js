const { ipcMain } = require('electron');
const si = require('systeminformation'); // Utilise cette librairie pour récupérer les infos système

ipcMain.on('request-cpu-temperature', (event) => {
    si.cpuTemperature().then(data => {
        event.sender.send('cpu-temperature', data.main); // Envoie la température au front-end
    });
});
