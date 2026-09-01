// ==============================================
// LARI MYSTIC BOT - ARQUIVO PRINCIPAL ATUALIZADO
// ==============================================

require("dotenv").config();

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");
const qrcodeTerminal = require("qrcode-terminal");
const QRCode = require("qrcode");
const http = require("http");
const pino = require("pino");
const mongoose = require("mongoose");

const config = require("./config");
const logger = require("./utils/logger");
const { handleMessage } = require("./handlers/messageHandler");

global.sock = null;
global.qrImageUrl = null;

async function conectarMongoDB() {
  if (!config.MONGODB_URI) {
    logger.warn("MONGODB_URI não configurado. Usando armazenamento em memória.");
    return;
  }
  try {
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info("MongoDB conectado com sucesso.");
  } catch (err) {
    logger.error("Erro ao conectar no MongoDB:", err.message);
    process.exit(1);
  }
}

async function iniciarBot() {
  await conectarMongoDB();

  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    printQRInTerminal: false,
    auth: state,
    logger: pino({ level: "silent" }),
  });

  global.sock = sock;

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      // QR Code no terminal (pode ser útil)
      qrcodeTerminal.generate(qr, { small: true });

      // Gera imagem do QR Code para exibir em página web
      QRCode.toDataURL(qr, { width: 300, margin: 2 }, (err, url) => {
        if (err) {
          logger.error("Erro ao gerar QR em imagem:", err.message);
          return;
        }
        global.qrImageUrl = url;
        logger.info("QR Code disponível em /qr");
      });
    }

    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const deveReconectar =
        statusCode !== DisconnectReason.loggedOut &&
        statusCode !== DisconnectReason.badSession;

      logger.warn("Conexão fechada. Reconectando...");
      if (deveReconectar) {
        setTimeout(() => iniciarBot(), 5000);
      } else {
        logger.error("Sessão desconectada. Reinicie o bot e escaneie o QR Code novamente.");
      }
    } else if (connection === "open") {
      logger.info("Bot conectado ao WhatsApp!");
      global.qrImageUrl = null;
    }
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async (m) => {
    const message = m.messages[0];
    if (!message.message || m.type !== "notify") return;

    try {
      await handleMessage(sock, message);
    } catch (err) {
      logger.error("Erro ao processar mensagem:", err.message);
    }
  });
}

// ==============================================
// SERVIDOR WEB PARA EXIBIR QR CODE
// ==============================================
const server = http.createServer((req, res) => {
  if (req.url === "/qr" && global.qrImageUrl) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>QR Code - Lari Mystic Bot</title>
        <style>
          body {
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: #f5f5f5;
            font-family: Arial, sans-serif;
          }
          .container {
            text-align: center;
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }
          img {
            width: 300px;
            height: 300px;
            image-rendering: crisp-edges;
          }
          h2 {
            margin-bottom: 20px;
            color: #333;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>📱 Escaneie o QR Code</h2>
          <img src="${global.qrImageUrl}" alt="QR Code" />
          <p>Abra o WhatsApp → Aparelhos conectados → Conectar aparelho</p>
        </div>
      </body>
      </html>
    `);
  } else {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Acesse /qr para ver o QR Code");
  }
});

server.listen(3000, () => {
  logger.info("Servidor web rodando na porta 3000");
});

// ==============================================
// INICIAR BOT
// ==============================================
iniciarBot().catch((err) => {
  logger.error("Erro fatal:", err.message);
  process.exit(1);
});
