// ==============================================
// LARI MYSTIC BOT - CONFIGURAÇÕES CENTRALIZADAS
// ==============================================

require("dotenv").config();

const config = {
  // Número do dono (formato internacional sem +)
  DONO: process.env.OWNER_NUMBER || "",

  // Token secreto do grupo
  TOKEN_GRUPO: process.env.TOKEN_GRUPO || "",

  // URI de conexão com MongoDB
  MONGODB_URI: process.env.MONGODB_URI || "",

  // Chaves de APIs externas (IA, etc.)
  IA_API_KEY: process.env.IA_API_KEY || "",
  IA_API_URL: process.env.IA_API_URL || "",

  // Nível de log
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
};

// Validações básicas
if (!config.DONO) {
  console.warn("⚠️ OWNER_NUMBER não configurado. Algumas funções de dono podem não funcionar.");
}

if (!config.TOKEN_GRUPO) {
  console.warn("⚠️ TOKEN_GRUPO não configurado. Áreas restritas ficarão inseguras.");
}

module.exports = config;
