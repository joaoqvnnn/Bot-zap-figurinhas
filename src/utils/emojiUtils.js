// ==============================================
// LARI MYSTIC BOT - UTILITÁRIOS DE EMOJIS
// ==============================================

/**
 * Lista de emojis decorativos para uso nas cartas.
 */
const emojisCartas = {
  diversao: "🎭",
  desafios: "⚔️",
  protecoes: "🛡️",
  dono: "👑",
  chave: "🔑",
  voltar: "⏮️",
  avancar: "⏭️",
  fechado: "🔒",
  aberto: "🔓",
  sucesso: "✅",
  erro: "❌",
  alerta: "⚠️",
  carga: "📦",
  moeda: "💰",
  trofeu: "🏆",
  fogo: "🔥",
  estrela: "⭐",
};

/**
 * Retorna emoji correspondente à chave informada.
 * @param {string} chave
 * @returns {string}
 */
function getEmoji(chave) {
  return emojisCartas[chave] || "🔹";
}

/**
 * Envolve um texto com emojis decorativos.
 * @param {string} texto
 * @param {string} emoji
 * @returns {string}
 */
function decorarTexto(texto, emoji) {
  return `${emoji} ${texto} ${emoji}`;
}

/**
 * Cria uma barra de progresso com emojis.
 * @param {number} atual
 * @param {number} maximo
 * @param {number} tamanho
 * @returns {string}
 */
function barraProgresso(atual, maximo, tamanho = 10) {
  const porcentagem = Math.min(1, atual / maximo);
  const preenchido = Math.round(porcentagem * tamanho);
  const vazio = tamanho - preenchido;
  return "█".repeat(preenchido) + "░".repeat(vazio);
}

module.exports = {
  emojisCartas,
  getEmoji,
  decorarTexto,
  barraProgresso,
};
