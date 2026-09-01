// ==============================================
// LARI MYSTIC BOT - CONEXÃO COM BANCO DE DADOS
// ==============================================

const mongoose = require("mongoose");
const config = require("../config");
const logger = require("../utils/logger");

/**
 * Conecta ao MongoDB usando a URI configurada.
 * Se a conexão falhar, encerra o processo.
 */
async function conectarBanco() {
  if (!config.MONGODB_URI) {
    logger.warn("MONGODB_URI não configurado. Usando armazenamento em memória.");
    return null;
  }

  try {
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info("✅ Conectado ao MongoDB com sucesso.");
    return mongoose.connection;
  } catch (err) {
    logger.error("❌ Erro ao conectar ao MongoDB:", err.message);
    process.exit(1);
  }
}

/**
 * Desconecta do banco de dados (útil para encerramento gracioso).
 */
async function desconectarBanco() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    logger.info("🔌 Desconectado do MongoDB.");
  }
}

module.exports = { conectarBanco, desconectarBanco };
