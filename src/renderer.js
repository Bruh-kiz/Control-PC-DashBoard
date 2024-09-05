const systeminformation = require('systeminformation');

document.addEventListener('DOMContentLoaded', () => {
  updateSystemInfo();
});

async function updateSystemInfo() {
  try {
    const ram = await systeminformation.mem();
    const cpuTemp = await systeminformation.sensors();
    
    document.getElementById('ram').innerText = `RAM: ${(ram.total / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    document.getElementById('cpu-temp').innerText = `CPU Temperature: ${cpuTemp.main[0].temperature.toFixed(1)} °C`;

  } catch (error) {
    console.error('Failed to retrieve system information:', error);
  }
}
