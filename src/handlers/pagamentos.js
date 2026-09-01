// ==============================================
// LARI MYSTIC BOT - HANDLER DE PAGAMENTOS
// ==============================================

const logger = require("../utils/logger");
const { NIVEIS, obterNivelUsuario } = require("../menus/permissoes");
const { criarCobranca, marcarComoPaga, listarPendentes, getCobranca } = require("../services/paymentService");

/**
 * Processa comandos de pagamentos.
 */
async function handlePagamentos(sock, message) {
  const texto = message.message.conversation || message.message.extendedTextMessage?.text || "";
  const chatId = message.key.remoteJid;
  const remetente = message.key.participant || message.key.remoteJid;

  if (!texto || !texto.startsWith("/") && !texto.startsWith("!")) return;

  const partes = texto.slice(1).split(" ");
  const comando = partes[0].toLowerCase();
  const argumento = partes.slice(1).join(" ");

  switch (comando) {
    case "cobrar":
      if (!argumento) return sock.sendMessage(chatId, { text: "Uso: /cobrar @usuario valor descrição" });
      const [alvo, valor, ...desc] = argumento.split(" ");
      const alvoNum = alvo.replace("@", "").trim();
      const valorNum = parseFloat(valor);
      if (!alvoNum || !valorNum) return sock.sendMessage(chatId, { text: "Dados inválidos." });
      const id = criarCobranca(alvoNum, valorNum, desc.join(" ") || "Cobrança");
      await sock.sendMessage(chatId, { text: `✅ Cobrança criada!\nID: ${id}\nValor: R$ ${valorNum.toFixed(2)}` });
      break;

    case "pagar":
      if (!argumento) return sock.sendMessage(chatId, { text: "Uso: /pagar ID" });
      if (marcarComoPaga(argumento.trim())) {
        await sock.sendMessage(chatId, { text: "✅ Cobrança marcada como paga." });
      } else {
        await sock.sendMessage(chatId, { text: "❌ Cobrança não encontrada." });
      }
      break;

    case "pendentes":
      const pendentes = listarPendentes();
      if (pendentes.length === 0) return sock.sendMessage(chatId, { text: "Nenhuma cobrança pendente." });
      let msg = "💳 Cobranças pendentes:\n\n";
      pendentes.forEach(c => {
        msg += `ID: ${c.id}\nUsuário: ${c.usuario}\nValor: R$ ${c.valor.toFixed(2)}\nDescrição: ${c.descricao}\n\n`;
      });
      await sock.sendMessage(chatId, { text: msg });
      break;

    default:
      break;
  }
}

module.exports = { handlePagamentos };
