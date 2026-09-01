// ==============================================
// LARI MYSTIC BOT - LOGGER SIMPLES
// ==============================================

const config = require("../config");

const niveis = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const nivelAtual = niveis[config.LOG_LEVEL] ?? niveis.info;

function log(nivel, mensagem, ...args) {
  if (niveis[nivel] <= nivelAtual) {
    const prefixo = `[${new Date().toLocaleString("pt-BR")}] [${nivel.toUpperCase()}]`;
    if (nivel === "error") {
      console.error(prefixo, mensagem, ...args);
    } else if (nivel === "warn") {
      console.warn(prefixo, mensagem, ...args);
    } else {
      console.log(prefixo, mensagem, ...args);
    }
  }
}

module.exports = {
  error: (msg, ...args) => log("error", msg, ...args),
  warn: (msg, ...args) => log("warn", msg, ...args),
  info: (msg, ...args) => log("info", msg, ...args),
  debug: (msg, ...args) => log("debug", msg, ...args),
};
