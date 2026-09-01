// ==============================================
// LARI MYSTIC BOT - SERVIÇO DE RPG AVANÇADO
// ==============================================

const logger = require("../utils/logger");

// Loja de itens
const itensLoja = [
  { id: "pocao", nome: "Poção de Vida", preco: 50, efeito: "cura" },
  { id: "espada", nome: "Espada de Ferro", preco: 100, efeito: "ataque" },
  { id: "escudo", nome: "Escudo de Madeira", preco: 80, efeito: "defesa" },
];

/**
 * Exibe itens da loja.
 */
function listarLoja() {
  return itensLoja.map(item => `${item.nome} - R$ ${item.preco}`).join("\n");
}

/**
 * Comprar item da loja.
 */
function comprarItem(remetente, itemId) {
  const personagem = global.personagensRPG?.get(remetente);
  if (!personagem) return "❌ Você não tem personagem.";

  const item = itensLoja.find(i => i.id === itemId);
  if (!item) return "❌ Item não encontrado.";

  if (personagem.ouro < item.preco) return "❌ Ouro insuficiente.";

  personagem.ouro -= item.preco;

  switch (item.efeito) {
    case "cura":
      personagem.hp = personagem.hpMax;
      break;
    case "ataque":
      personagem.ataque += 10;
      break;
    case "defesa":
      personagem.defesa += 5;
      break;
  }

  return `✅ ${item.nome} comprado!`;
}

/**
 * Missões diárias.
 */
function gerarMissao() {
  const missoes = [
    "Derrote 5 inimigos",
    "Explore uma caverna",
    "Colete 10 ervas",
    "Treine seu ataque",
  ];
  return missoes[Math.floor(Math.random() * missoes.length)];
}

module.exports = {
  listarLoja,
  comprarItem,
  gerarMissao,
};
