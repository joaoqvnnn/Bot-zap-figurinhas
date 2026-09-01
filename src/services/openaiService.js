// ==============================================
// LARI MYSTIC BOT - SERVIÇO DE INTELIGÊNCIA ARTIFICIAL
// ==============================================

const axios = require("axios");
const config = require("../config");
const logger = require("../utils/logger");

/**
 * Conversa com a IA (OpenAI ou compatível).
 * @param {string} prompt
 * @returns {Promise<string>}
 */
async function conversarComIA(prompt) {
  if (!config.IA_API_KEY || !config.IA_API_URL) {
    return "⚠️ IA não configurada.";
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
 * Gera imagem via IA.
 */
async function gerarImagemIA(descricao) {
  if (!config.IA_API_KEY) return "⚠️ IA não configurada.";

  try {
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
 * Traduz texto (simplificação).
 */
async function traduzirTexto(texto, idiomaDestino = "pt") {
  if (!config.IA_API_KEY) return "⚠️ IA não configurada para tradução.";
  return `Tradução para ${idiomaDestino}: ${texto}`;
}

/**
 * Resume texto.
 */
async function resumirTexto(texto) {
  if (!config.IA_API_KEY) return "⚠️ IA não configurada para resumo.";
  return `Resumo: ${texto.slice(0, 100)}...`;
}

module.exports = {
  conversarComIA,
  gerarImagemIA,
  traduzirTexto,
  resumirTexto,
};
