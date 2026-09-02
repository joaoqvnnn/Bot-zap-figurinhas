// ==============================================
// LARI MYSTIC BOT - ARQUIVO PRINCIPAL COM PAREAMENTO
// ==============================================

require("dotenv").config();

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const mongoose = require("mongoose");

const config = require("./config");
const logger = require("./utils/logger");
const { handleMessage } = require("./handlers/messageHandler");

// Importa funções globais
require("./utils/global");

global.sock = null;

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
    browser: ["Ubuntu", "Chrome", "20.0.04"],
  });

  global.sock = sock;

  // Se ainda não tiver sessão, pede código de pareamento
  if (!sock.authState.creds.registered) {
    const numero = config.DONO;
    if (!numero) {
      logger.error("OWNER_NUMBER não configurado. O pareamento exige o número do dono.");
      process.exit(1);
    }

    setTimeout(async () => {
      try {
        const codigo = await sock.requestPairingCode(numero);
        logger.info(`🔑 Seu código de pareamento: ${codigo}`);
        logger.info("Digite esse código no WhatsApp em: Aparelhos conectados → Conectar aparelho");
      } catch (err) {
        logger.error("Erro ao gerar código de pareamento:", err.message);
      }
    }, 3000);
  }

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const deveReconectar =
        statusCode !== DisconnectReason.loggedOut &&
        statusCode !== DisconnectReason.badSession;

      logger.warn("Conexão fechada. Reconectando...");
      if (deveReconectar) {
        setTimeout(() => iniciarBot(), 5000);
      } else {
        logger.error("Sessão desconectada. Reinicie o bot.");
      }
    } else if (connection === "open") {
      logger.info("✅ Bot conectado ao WhatsApp!");
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

iniciarBot().catch((err) => {
  logger.error("Erro fatal:", err.message);
  process.exit(1);
});
