// ==============================================
// LARI MYSTIC BOT - SCRIPT DE SEED (DADOS INICIAIS)
// ==============================================

const mongoose = require("mongoose");
const config = require("../config");
const logger = require("../utils/logger");
const { Grupo, Usuario, Resenha, Log } = require("./models");

/**
 * Popula o banco com dados iniciais de teste.
 */
async function seed() {
  if (!config.MONGODB_URI) {
    logger.warn("MONGODB_URI não configurado. Seed ignorado.");
    return;
  }

  await mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  logger.info("Executando seed...");

  // Cria um grupo de exemplo
  const grupoExemplo = new Grupo({
    jid: "123456789@g.us",
    nome: "Grupo Teste",
    token: "abc123",
    protecoes: {
      "anti-link": true,
      "anti-flood": false,
    },
  });
  await grupoExemplo.save();

  // Cria um usuário de exemplo
  const usuarioExemplo = new Usuario({
    jid: "5511999999999@s.whatsapp.net",
    nome: "Usuário Teste",
    nivel: 100,
  });
  await usuarioExemplo.save();

  logger.info("Seed concluído.");
  await mongoose.disconnect();
}

seed().catch(err => {
  logger.error("Erro no seed:", err.message);
  process.exit(1);
});
