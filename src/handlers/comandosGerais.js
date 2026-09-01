// ==============================================
// LARI MYSTIC BOT - COMANDOS GERAIS
// ==============================================

const logger = require("../utils/logger");
const { extrairDadosMensagem } = require("../utils/helpers");
const { NIVEIS, obterNivelUsuario } = require("../menus/permissoes");

/**
 * Processa comandos gerais como /ajuda, /sobre, /perfil.
 * @param {object} sock
 * @param {object} message
 */
async function handleComandosGerais(sock, message) {
  const dados = extrairDadosMensagem(message);
  if (!dados) return;

  const { chatId, remetente, texto } = dados;

  if (!texto || !texto.startsWith("/") && !texto.startsWith("!")) return;

  const partes = texto.slice(1).split(" ");
  const comando = partes[0].toLowerCase();

  switch (comando) {
    case "ajuda":
    case "help":
      await sock.sendMessage(chatId, {
        text: "📖 Envie *menu* para abrir as Cartas Místicas.\n\n" +
              "Comandos rápidos:\n" +
              "!dados – rolar dado\n" +
              "!ppt – pedra-papel-tesoura\n" +
              "!anagrama – jogo de anagrama\n" +
              "!ia – conversar com IA (se configurada)\n" +
              "!criarpersonagem – iniciar RPG",
      });
      break;

    case "sobre":
      await sock.sendMessage(chatId, {
        text: "🤖 *Lari Mystic Bot*\n\n" +
              "Um bot com sistema de Cartas Místicas, moderação, jogos e RPG.\n" +
              "Desenvolvido para tornar grupos interativos e seguros.",
      });
      break;

    case "perfil":
      const nivel = await obterNivelUsuario(sock, chatId, remetente);
      await sock.sendMessage(chatId, {
        text: `👤 *Seu Perfil*\n\n` +
              `ID: ${remetente.split("@")[0]}\n` +
              `Nível: ${nivel}`,
      });
      break;

    default:
      // Comando não reconhecido; não faz nada
      break;
  }
}

module.exports = { handleComandosGerais };
