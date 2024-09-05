const si = require('systeminformation');

// Fonction pour récupérer et afficher la RAM et la température
function updateSystemInfo() {
  si.mem().then(data => {
    const ramGB = (data.used / 1073741824).toFixed(2);
    document.getElementById('ram').innerText = ramGB;
  });

  si.cpuTemperature().then(data => {
    document.getElementById('temperature').innerText = data.main;
  });
}

// Fonction pour changer le mode de performance
function setPerformance(mode) {
  let cmd = '';

  if (mode === 'high') {
    cmd = 'powercfg -setactive SCHEME_MIN';
  } else if (mode === 'balanced') {
    cmd = 'powercfg -setactive SCHEME_BALANCED';
  } else if (mode === 'power_saver') {
    cmd = 'powercfg -setactive SCHEME_MAX';
  }

  const { exec } = require('child_process');
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erreur de changement de mode : ${error.message}`);
      return;
    }
    console.log(`Mode changé en ${mode}`);
  });
}

// Mettre à jour les informations toutes les 5 secondes
setInterval(updateSystemInfo, 5000);
