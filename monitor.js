const https = require('https');
const cron = require('node-cron');

const PROJECT_URL = 'https://nama-project-anda.glitch.me';

function pingServer() {
  https.get(PROJECT_URL, (res) => {
    if (res.statusCode === 200) {
      console.log('Ping berhasil:', new Date().toLocaleString());
    } else {
      console.log('Ping gagal dengan status:', res.statusCode);
    }
  }).on('error', (err) => {
    console.error('Error saat ping:', err.message);
  });
}
cron.schedule('*/5 * * * *', pingServer);
console.log('Monitor started');