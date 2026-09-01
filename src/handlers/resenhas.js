// ==============================================
// LARI MYSTIC BOT - HANDLER DE RESENHAS / VENDAS
// ==============================================

const logger = require("../utils/logger");
const { NIVEIS, obterNivelUsuario } = require("../menus/permissoes");
const { gerarIdUnico } = require("../utils/helpers");

// Armazenamento temporário de resenhas (será migrado para MongoDB)
global.resenhas = new Map();

/**
 * Processa comandos de resenhas/vendas.
 * @param {object} sock - Socket do Baileys
 * @param {object} message - Mensagem do WhatsApp
 */
async function handleResenhas(sock, message) {
  const texto = message.message.conversation || message.message.extendedTextMessage?.text || "";
  const chatId = message.key.remoteJid;
  const remetente = message.key.participant || message.key.remoteJid;

  if (!texto || !texto.startsWith("/") && !texto.startsWith("!")) return;

  const partes = texto.slice(1).split(" ");
  const comando = partes[0].toLowerCase();
  const argumento = partes.slice(1).join(" ");

  const nivel = await obterNivelUsuario(sock, chatId, remetente);
  if (nivel < NIVEIS.ADMIN) {
    await sock.sendMessage(chatId, { text: "⛔ Apenas admins podem gerenciar resenhas." });
    return;
  }

  switch (comando) {
    case "resenha.nova":
      const idNova = gerarIdUnico();
      global.resenhas.set(idNova, {
        id: idNova,
        titulo: argumento || "Nova resenha",
        itens: [],
        pagamentos: [],
        criadaPor: remetente,
        criadaEm: new Date().toISOString(),
      });
      await sock.sendMessage(chatId, { text: `✅ Resenha criada com ID ${idNova}` });
      break;

    case "resenha.adicionar":
      // Formato: /resenha.adicionar ID item1;item2;item3
      const [idAdd, itens] = argumento.split(" ");
      const resenhaAdd = global.resenhas.get(idAdd);
      if (!resenhaAdd) {
        await sock.sendMessage(chatId, { text: "❌ Resenha não encontrada." });
        return;
      }
      const listaItens = itens.split(";").filter(i => i.trim());
      resenhaAdd.itens.push(...listaItens);
      await sock.sendMessage(chatId, { text: `📦 Itens adicionados à resenha ${idAdd}.` });
      break;

    case "resenha.todos":
      if (global.resenhas.size === 0) {
        await sock.sendMessage(chatId, { text: "Nenhuma resenha cadastrada." });
        return;
      }
      let msgResenhas = "📋 Resenhas:\n\n";
      for (const [id, resenha] of global.resenhas) {
        msgResenhas += `ID: ${id}\nTítulo: ${resenha.titulo}\nItens: ${resenha.itens.length}\n\n`;
      }
      await sock.sendMessage(chatId, { text: msgResenhas });
      break;

    case "resenha.pagar":
      const idPagar = argumento.trim();
      const resenhaPagar = global.resenhas.get(idPagar);
      if (!resenhaPagar) {
        await sock.sendMessage(chatId, { text: "❌ Resenha não encontrada." });
        return;
      }
      resenhaPagar.pagamentos.push({
        data: new Date().toISOString(),
        pagoPor: remetente,
      });
      await sock.sendMessage(chatId, { text: `💰 Resenha ${idPagar} marcada como paga.` });
      break;

    case "resenha.link":
      const idLink = argumento.trim();
      const resenhaLink = global.resenhas.get(idLink);
      if (!resenhaLink) {
        await sock.sendMessage(chatId, { text: "❌ Resenha não encontrada." });
        return;
      }
      // Em produção, gerar link de pagamento real
      const linkFake = `https://pay.example.com/${idLink}`;
      await sock.sendMessage(chatId, { text: `🔗 Link de pagamento: ${linkFake}` });
      break;

    case "resenha.excluir":
      const idDel = argumento.trim();
      if (global.resenhas.delete(idDel)) {
        await sock.sendMessage(chatId, { text: `🗑️ Resenha ${idDel} excluída.` });
      } else {
        await sock.sendMessage(chatId, { text: "❌ Resenha não encontrada." });
      }
      break;

    default:
      break;
  }
}

module.exports = { handleResenhas };
