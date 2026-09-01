// ==============================================
// LARI MYSTIC BOT - VALIDAÇÕES DE ENTRADA
// ==============================================

/**
 * Verifica se uma string é um número válido.
 * @param {string} texto
 * @returns {boolean}
 */
function isNumero(texto) {
  return /^\d+$/.test(String(texto).trim());
}

/**
 * Verifica se o texto está vazio ou contém apenas espaços.
 * @param {string} texto
 * @returns {boolean}
 */
function isEmpty(texto) {
  return !texto || String(texto).trim().length === 0;
}

/**
 * Verifica se é um e-mail válido.
 * @param {string} email
 * @returns {boolean}
 */
function isEmailValido(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(String(email).trim());
}

/**
 * Verifica se é um link (http ou https).
 * @param {string} texto
 * @returns {boolean}
 */
function isLink(texto) {
  return /https?:\/\/\S+/i.test(String(texto));
}

/**
 * Limita o tamanho de uma string.
 * @param {string} texto
 * @param {number} max
 * @returns {string}
 */
function limitarTexto(texto, max) {
  return String(texto).slice(0, max);
}

/**
 * Verifica se o token é alfanumérico válido.
 * @param {string} token
 * @returns {boolean}
 */
function isTokenValido(token) {
  return /^[a-zA-Z0-9]{6,20}$/.test(String(token).trim());
}

module.exports = {
  isNumero,
  isEmpty,
  isEmailValido,
  isLink,
  limitarTexto,
  isTokenValido,
};
