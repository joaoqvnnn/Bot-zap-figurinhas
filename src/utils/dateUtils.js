// ==============================================
// LARI MYSTIC BOT - UTILITÁRIOS DE DATA
// ==============================================

/**
 * Formata uma data para o padrão brasileiro DD/MM/AAAA HH:MM:SS.
 * @param {Date|string} data
 * @returns {string}
 */
function formatarDataHora(data = new Date()) {
  const d = new Date(data);
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const ano = d.getFullYear();
  const hora = String(d.getHours()).padStart(2, "0");
  const minuto = String(d.getMinutes()).padStart(2, "0");
  const segundo = String(d.getSeconds()).padStart(2, "0");
  return `${dia}/${mes}/${ano} ${hora}:${minuto}:${segundo}`;
}

/**
 * Retorna a data atual no formato DD/MM/AAAA.
 * @returns {string}
 */
function dataAtual() {
  return formatarDataHora().split(" ")[0];
}

/**
 * Retorna a hora atual no formato HH:MM.
 * @returns {string}
 */
function horaAtual() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/**
 * Adiciona minutos a uma data e retorna a nova data.
 * @param {Date} data
 * @param {number} minutos
 * @returns {Date}
 */
function adicionarMinutos(data, minutos) {
  return new Date(new Date(data).getTime() + minutos * 60000);
}

/**
 * Verifica se uma data já passou.
 * @param {Date|string} data
 * @returns {boolean}
 */
function dataExpirada(data) {
  return new Date(data).getTime() < Date.now();
}

module.exports = {
  formatarDataHora,
  dataAtual,
  horaAtual,
  adicionarMinutos,
  dataExpirada,
};
