// ==============================================
// LARI MYSTIC BOT - ARQUIVO PRINCIPAL DE INICIALIZAÇÃO
// ==============================================

require("dotenv").config();

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");
const qrcode = require("qrcode-terminal");
const pino = require("pino");
const mongoose = require("mongoose");

const config = require("./config");
const logger = require("./utils/logger");

// Instância global do socket (será usada pelos handlers)
global.sock = null;

async function conectarMongoDB() {
  if (!config.MONGODB_URI) {
    logger.warn("MONGODB_URI não configurado. O banco de dados não será usado.");
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

  // Exibe QR Code no terminal
  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
      qrcode.generate(qr, { small: true });
      logger.info("QR Code gerado. Escaneie com o WhatsApp.");
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
    }
  });

  // Salva credenciais automaticamente
  sock.ev.on("creds.update", saveCreds);

  // Delega mensagens para o handler (ainda será implementado)
  sock.ev.on("messages.upsert", async (m) => {
    const message = m.messages[0];
    if (!message.message || m.type !== "notify") return;

    try {
      const handlers = require("./handlers/messageHandler");
      await handlers.handleMessage(sock, message);
    } catch (err) {
      logger.error("Erro ao processar mensagem:", err.message);
    }
  });
}

iniciarBot().catch((err) => {
  logger.error("Erro fatal:", err.message);
  process.exit(1);
});
