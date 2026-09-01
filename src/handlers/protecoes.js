// ==============================================
// LARI MYSTIC BOT - HANDLER DE PROTEÇÕES
// ==============================================

const logger = require("../utils/logger");
const { NIVEIS, obterNivelUsuario } = require("../menus/permissoes");
const { ativarProtecao, desativarProtecao, getProtecoesAtivas, isProtecaoAtiva } = require("../services/segurancaService");
const { adicionarPalavraProibida, removerPalavraProibida, listarPalavrasProibidas } = require("../services/donoService");
const { adicionarListaNegra, removerListaNegra, getListaNegra } = require("../services/listaNegraService");

/**
 * Processa comandos de proteção e segurança.
 */
async function handleProtecoes(sock, message) {
  const texto = message.message.conversation || message.message.extendedTextMessage?.text || "";
  const chatId = message.key.remoteJid;
  const remetente = message.key.participant || message.key.remoteJid;

  if (!texto || !texto.startsWith("/") && !texto.startsWith("!")) return;

  const partes = texto.slice(1).split(" ");
  const comando = partes[0].toLowerCase();
  const argumento = partes.slice(1).join(" ");

  const nivel = await obterNivelUsuario(sock, chatId, remetente);
  if (nivel < NIVEIS.ADMIN) {
    await sock.sendMessage(chatId, { text: "⛔ Apenas administradores podem gerenciar proteções." });
    return;
  }

  switch (comando) {
    case "ativar":
      if (!argumento) return sock.sendMessage(chatId, { text: "Uso: /ativar anti-link, anti-flood, etc." });
      await ativarProtecao(chatId, argumento.toLowerCase(), true);
      await sock.sendMessage(chatId, { text: `✅ Proteção '${argumento}' ativada.` });
      break;

    case "desativar":
      if (!argumento) return sock.sendMessage(chatId, { text: "Uso: /desativar anti-link, anti-flood, etc." });
      await desativarProtecao(chatId, argumento.toLowerCase());
      await sock.sendMessage(chatId, { text: `❌ Proteção '${argumento}' desativada.` });
      break;

    case "protecoes":
      const ativas = await getProtecoesAtivas(chatId);
      await sock.sendMessage(chatId, {
        text: ativas.length ? `🛡️ Proteções ativas:\n\n${ativas.join("\n")}` : "Nenhuma proteção ativa."
      });
      break;

    case "addpalavra":
      if (!argumento) return sock.sendMessage(chatId, { text: "Uso: /addpalavra palavra" });
      adicionarPalavraProibida(argumento);
      await sock.sendMessage(chatId, { text: `🔒 Palavra '${argumento}' adicionada à lista proibida.` });
      break;

    case "rmpalavra":
      if (!argumento) return sock.sendMessage(chatId, { text: "Uso: /rmpalavra palavra" });
      removerPalavraProibida(argumento);
      await sock.sendMessage(chatId, { text: `🔓 Palavra '${argumento}' removida.` });
      break;

    case "palavrasproibidas":
      const palavras = listarPalavrasProibidas();
      await sock.sendMessage(chatId, {
        text: palavras.length ? `📋 Palavras proibidas:\n\n${palavras.join("\n")}` : "Nenhuma palavra proibida."
      });
      break;

    case "listanegra":
      const lista = getListaNegra();
      await sock.sendMessage(chatId, {
        text: lista.length ? `📋 Lista negra global:\n\n${lista.join("\n")}` : "Lista negra vazia."
      });
      break;

    case "ban":
      if (!argumento) return sock.sendMessage(chatId, { text: "Uso: /ban @usuario" });
      const alvoBan = argumento.replace("@", "").trim();
      adicionarListaNegra(alvoBan);
      await sock.sendMessage(chatId, { text: `🔨 Usuário ${alvoBan} banido globalmente.` });
      break;

    case "unban":
      if (!argumento) return sock.sendMessage(chatId, { text: "Uso: /unban @usuario" });
      const alvoUnban = argumento.replace("@", "").trim();
      removerListaNegra(alvoUnban);
      await sock.sendMessage(chatId, { text: `🔓 Usuário ${alvoUnban} removido da lista negra.` });
      break;

    default:
      break;
  }
}

module.exports = { handleProtecoes };
