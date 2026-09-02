// ==============================================
// LARI MYSTIC BOT - SERVIÇO DE MODERAÇÃO
// ==============================================

const logger = require("../utils/logger");
const { limparNumero } = require("../utils/helpers");

const silenciados = new Map();

function silenciarUsuario(numero, minutos = 5) {
  const numeroLimpo = limparNumero(numero);
  const liberarEm = Date.now() + minutos * 60000;
  silenciados.set(numeroLimpo, liberarEm);
  logger.info(`Usuário ${numeroLimpo} silenciado por ${minutos} min.`);
}

function dessilenciarUsuario(numero) {
  const numeroLimpo = limparNumero(numero);
  silenciados.delete(numeroLimpo);
}

function isSilenciado(numero) {
  const numeroLimpo = limparNumero(numero);
  if (!silenciados.has(numeroLimpo)) return false;
  const liberarEm = silenciados.get(numeroLimpo);
  if (Date.now() > liberarEm) {
    silenciados.delete(numeroLimpo);
    return false;
  }
  return true;
}

module.exports = {
  silenciarUsuario,
  dessilenciarUsuario,
  isSilenciado,
};
