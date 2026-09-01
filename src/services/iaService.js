// ==============================================
// LARI MYSTIC BOT - SERVIÇO DE INTELIGÊNCIA ARTIFICIAL
// ==============================================

const axios = require("axios");
const config = require("../config");
const logger = require("../utils/logger");

/**
 * Função para conversar com a IA (se API configurada).
 * @param {string} prompt - Mensagem do usuário
 * @returns {Promise<string>} Resposta da IA
 */
async function conversarComIA(prompt) {
  if (!config.IA_API_KEY || !config.IA_API_URL) {
    return "⚠️ IA não configurada. Peça ao dono para configurar.";
  }

  try {
    const response = await axios.post(
      config.IA_API_URL,
      {
        prompt,
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${config.IA_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data?.choices?.[0]?.text?.trim() || "Não consegui responder.";
  } catch (err) {
    logger.error("Erro ao chamar IA:", err.message);
    return "⚠️ Falha ao processar a resposta da IA.";
  }
}

/**
 * Gera uma imagem via IA (se API suportar).
 * @param {string} descricao
 * @returns {Promise<string>} URL da imagem ou mensagem de erro
 */
async function gerarImagemIA(descricao) {
  if (!config.IA_API_KEY) {
    return "⚠️ IA não configurada.";
  }

  try {
    // Exemplo usando OpenAI DALL·E (pode ser adaptado)
    const response = await axios.post(
      "https://api.openai.com/v1/images/generations",
      {
        prompt: descricao,
        n: 1,
        size: "1024x1024",
      },
      {
        headers: {
          Authorization: `Bearer ${config.IA_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data?.data?.[0]?.url || "Não consegui gerar a imagem.";
  } catch (err) {
    logger.error("Erro ao gerar imagem IA:", err.message);
    return "⚠️ Falha ao gerar imagem.";
  }
}

/**
 * Traduz um texto usando IA (simplificação).
 */
async function traduzirTexto(texto, idiomaDestino = "pt") {
  if (!config.IA_API_KEY) {
    return "⚠️ IA não configurada para tradução.";
  }
  // Placeholder – em produção, use API de tradução adequada
  return `Tradução para ${idiomaDestino}: ${texto}`;
}

/**
 * Resume um texto longo.
 */
async function resumirTexto(texto) {
  if (!config.IA_API_KEY) {
    return "⚠️ IA não configurada para resumo.";
  }
  // Placeholder
  return `Resumo: ${texto.slice(0, 100)}...`;
}

module.exports = {
  conversarComIA,
  gerarImagemIA,
  traduzirTexto,
  resumirTexto,
};
