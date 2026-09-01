// ==============================================
// LARI MYSTIC BOT - SERVIÇO DE GESTÃO DE GRUPO
// ==============================================

const logger = require("../utils/logger");

/**
 * Funções para manipular grupos do WhatsApp via Baileys.
 */
const groupService = {
  /**
   * Muda o nome do grupo.
   */
  async mudarNomeGrupo(sock, chatId, novoNome) {
    try {
      await sock.groupUpdateSubject(chatId, novoNome);
      logger.info(`Nome do grupo ${chatId} alterado para "${novoNome}".`);
      return true;
    } catch (err) {
      logger.error(`Erro ao mudar nome do grupo: ${err.message}`);
      return false;
    }
  },

  /**
   * Muda a descrição do grupo.
   */
  async mudarDescricaoGrupo(sock, chatId, novaDescricao) {
    try {
      await sock.groupUpdateDescription(chatId, novaDescricao);
      logger.info(`Descrição do grupo ${chatId} alterada.`);
      return true;
    } catch (err) {
      logger.error(`Erro ao mudar descrição do grupo: ${err.message}`);
      return false;
    }
  },

  /**
   * Obtém o link de convite do grupo.
   */
  async obterLinkGrupo(sock, chatId) {
    try {
      const code = await sock.groupInviteCode(chatId);
      if (code) {
        return `https://chat.whatsapp.com/${code}`;
      }
      return null;
    } catch (err) {
      logger.error(`Erro ao obter link do grupo: ${err.message}`);
      return null;
    }
  },

  /**
   * Abre o grupo para novos membros.
   */
  async abrirGrupo(sock, chatId) {
    try {
      await sock.groupSettingUpdate(chatId, "not_announcement");
      logger.info(`Grupo ${chatId} aberto.`);
      return true;
    } catch (err) {
      logger.error(`Erro ao abrir grupo: ${err.message}`);
      return false;
    }
  },

  /**
   * Fecha o grupo para novos membros.
   */
  async fecharGrupo(sock, chatId) {
    try {
      await sock.groupSettingUpdate(chatId, "announcement");
      logger.info(`Grupo ${chatId} fechado.`);
      return true;
    } catch (err) {
      logger.error(`Erro ao fechar grupo: ${err.message}`);
      return false;
    }
  },
};

module.exports = { groupService };
