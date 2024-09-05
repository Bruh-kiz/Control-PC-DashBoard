const systeminformation = require('systeminformation');

// Mettre à jour les informations sur la RAM
function updateRAM() {
  systeminformation.mem()
    .then(data => {
      document.getElementById('ram').innerText = `${(data.active / (1024 ** 3)).toFixed(2)} GB`;
    });
}

// Mettre à jour les informations sur le CPU
function updateCPU() {
  systeminformation.currentLoad()
    .then(data => {
      document.getElementById('cpu').innerText = `${data.currentLoad.toFixed(2)}%`;
    });
}

// Mettre à jour les informations sur le GPU (si disponible)
function updateGPU() {
  systeminformation.graphics()
    .then(data => {
      if (data.controllers && data.controllers.length > 0) {
        document.getElementById('gpu').innerText = `${data.controllers[0].load.toFixed(2)}%`;
      } else {
        document.getElementById('gpu').innerText = 'N/A';
      }
    });
}

// Appel des fonctions pour mettre à jour les informations
updateRAM();
updateCPU();
updateGPU();

// Mettre à jour les informations toutes les 5 secondes
setInterval(() => {
  updateRAM();
  updateCPU();
  updateGPU();
}, 5000);
