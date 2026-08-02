export type PhotoOverride = {
  caption?: string;
  alt?: string;
  film?: string;
  camera?: string;
  settings?: string;
  location?: string;
  year?: string;
  category?: string;
};

/**
 * Chave = nome do arquivo em public/photos, sem extensão (ex: "roda-gigante"
 * para "roda-gigante.jpg"). Fotos sem entrada aqui usam o nome do arquivo
 * como legenda. Os demais campos (filme, câmera, local, ano, categoria) são
 * opcionais e só aparecem no site quando preenchidos.
 */
export const photoOverrides: Record<string, PhotoOverride> = {
  "roda-gigante": {
    caption: "Roda-gigante",
    alt: "Roda-gigante contra o céu em dia de feira",
  },
  "estrada-litoral": {
    caption: "Estrada litorânea",
    alt: "Vista da estrada litorânea pelo para-brisa",
  },
  "poente-baia": {
    caption: "Poente na baía",
    alt: "Pôr do sol sobre a baía com veleiros ao longe",
  },
  "remada-poente": {
    caption: "Remada ao poente",
    alt: "Equipe de remo silhuetada contra o sol poente",
  },
  vigilia: {
    caption: "Vigília",
    alt: "Gato deitado numa varanda ao entardecer",
  },
  galope: {
    caption: "Galope",
    alt: "Cavaleiro em galope na areia da praia",
  },
  "vela-rio": {
    caption: "Vela sobre o rio",
    alt: "Pessoas a bordo de um veleiro com ponte ao fundo",
  },
  arcos: {
    caption: "Arcos",
    alt: "Vista de baixo para os arcos de uma estrutura antiga",
  },
  campanile: {
    caption: "Campanile",
    alt: "Canal com torre sineira ao fundo",
  },
  "sob-a-ponte": {
    caption: "Sob a ponte",
    alt: "Gôndola passando sob uma ponte de pedra",
  },
  praca: {
    caption: "Praça",
    alt: "Mulher em pé numa grande praça histórica",
  },
  "canal-estreito": {
    caption: "Canal estreito",
    alt: "Canal estreito entre fachadas coloridas",
  },
  travessia: {
    caption: "Travessia",
    alt: "Pessoas atravessando uma ponte sobre o canal",
  },
  reflexos: {
    caption: "Reflexos",
    alt: "Canal ladeado por fachadas antigas e barcos",
  },
  bandeiras: {
    caption: "Bandeiras",
    alt: "Retrato junto ao canal com bandeiras ao fundo",
  },
  classico: {
    caption: "Clássico",
    alt: "Carro esportivo clássico estacionado junto a dunas",
  },
  "tarde-tropical": {
    caption: "Tarde tropical",
    alt: "Pessoa sentada atrás de uma cerca, cercada de palmeiras",
  },
  farol: {
    caption: "Farol",
    alt: "Topo de um farol vermelho contra céu azul",
  },
  litoral: {
    caption: "Litoral",
    alt: "Vista aérea de uma longa faixa de litoral",
  },
  falesia: {
    caption: "Falésia",
    alt: "Falésia rochosa sobre uma praia",
  },
  fortaleza: {
    caption: "Fortaleza",
    alt: "Fortaleza no alto de um penhasco à beira-mar",
  },
  contemplacao: {
    caption: "Contemplação",
    alt: "Homem sentado numa pedra observando o mar",
  },
  serra: {
    caption: "Serra",
    alt: "Gado em pastagem diante de montanhas, em preto e branco",
  },
  rebanho: {
    caption: "Rebanho",
    alt: "Rebanho de gado com chifres diante da serra",
  },
  "espelho-dagua": {
    caption: "Espelho d'água",
    alt: "Reflexo das montanhas num lago, em preto e branco",
  },
  acampamento: {
    caption: "Acampamento",
    alt: "Acampamento com barracas e carros aos pés da serra",
  },
};
