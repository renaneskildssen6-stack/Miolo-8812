// Sistema de CARDS de combate — cada card altera regras da batalha.
// Arte pixel art em /public/cards/<id>.png (192x192).
// O jogador equipa ate 3 cards respeitando o orcamento de energia do deck.
// Cards combinam entre si por TAGS (sinergias) e por COMBOS nomeados.

/** Modificadores agregados que um deck entrega ao lutador. */
export type CardStat =
  | "str" // % de forca
  | "def" // % de defesa
  | "agl" // % de agilidade
  | "hp" // % de HP maximo
  | "mp" // % de MP maximo
  | "crit" // + pontos percentuais de critico
  | "evade" // + pontos percentuais de esquiva
  | "amp" // % de poder das habilidades
  | "aegis" // % de reducao de dano recebido
  | "lifesteal" // % do dano causado convertido em cura
  | "thorns" // % do dano recebido devolvido
  | "regen" // % do HP maximo regenerado por turno
  | "mpregen" // + MP por turno
  | "opening" // % de dano extra nos 2 primeiros turnos
  | "rage" // % de dano extra abaixo de 35% de HP
  | "resist" // % de chance de ignorar efeito negativo recebido
  | "venom" // % de poder dos efeitos aplicados
  | "gold" // % de ouro extra na vitoria
  | "xp"; // % de XP extra na vitoria

export type CardMods = Partial<Record<CardStat, number>>;

export type CardTag =
  | "chama"
  | "gelo"
  | "trovao"
  | "sombra"
  | "ferro"
  | "nano"
  | "arcano"
  | "fera"
  | "protocolo"
  | "caos";

export type CardRarity = "bronze" | "prata" | "ouro" | "prisma";

export interface CardDef {
  id: string;
  name: string;
  rarity: CardRarity;
  element: string;
  /** custo de energia no deck */
  cost: number;
  tags: CardTag[];
  price: number;
  requiredLevel: number;
  desc: string;
  flavor: string;
  mods: CardMods;
}

export interface SynergyDef {
  id: string;
  name: string;
  desc: string;
  /** ativa quando o deck tem >= count cards com a tag */
  tag?: { tag: CardTag; count: number };
  /** ativa quando todos esses cards estao equipados */
  cards?: string[];
  mods: CardMods;
}

export const MAX_CARDS = 3;

export const CARD_STAT_LABEL: Record<CardStat, string> = {
  str: "FORCA",
  def: "DEFESA",
  agl: "AGILIDADE",
  hp: "HP MAX",
  mp: "MP MAX",
  crit: "CRITICO",
  evade: "ESQUIVA",
  amp: "PODER",
  aegis: "COURACA",
  lifesteal: "DRENO",
  thorns: "ESPINHOS",
  regen: "REPARO",
  mpregen: "MP/TURNO",
  opening: "ABERTURA",
  rage: "FURIA",
  resist: "RESISTENCIA",
  venom: "TOXINA",
  gold: "OURO",
  xp: "XP",
};

export const CARD_TAG_LABEL: Record<CardTag, string> = {
  chama: "CHAMA",
  gelo: "GELO",
  trovao: "TROVAO",
  sombra: "SOMBRA",
  ferro: "FERRO",
  nano: "NANO",
  arcano: "ARCANO",
  fera: "FERA",
  protocolo: "PROTOCOLO",
  caos: "CAOS",
};

export const CARD_RARITY_COLOR: Record<CardRarity, string> = {
  bronze: "#c98a4b",
  prata: "#cfd8e3",
  ouro: "#ffd24a",
  prisma: "#b06bff",
};

/** Orcamento de energia do deck, cresce com o nivel do piloto. */
export function deckBudget(playerLevel: number): number {
  return 6 + Math.min(6, Math.floor(playerLevel / 8));
}

export const CARDS: CardDef[] = [
  // ---------------------------------------------------------------- bronze
  {
    id: "chama_viva",
    name: "CHAMA VIVA",
    rarity: "bronze",
    element: "FOGO",
    cost: 2,
    tags: ["chama"],
    price: 1200,
    requiredLevel: 1,
    desc: "+10% de poder das habilidades.",
    flavor: "A fornalha nunca dorme dentro do peito do mecha.",
    mods: { amp: 10 },
  },
  {
    id: "placa_bruta",
    name: "PLACA BRUTA",
    rarity: "bronze",
    element: "FERRO",
    cost: 2,
    tags: ["ferro"],
    price: 1200,
    requiredLevel: 1,
    desc: "+12% de DEFESA e +6% de HP maximo.",
    flavor: "Sucata soldada as pressas, mas aguenta o tranco.",
    mods: { def: 12, hp: 6 },
  },
  {
    id: "capacitor_leve",
    name: "CAPACITOR LEVE",
    rarity: "bronze",
    element: "TROVAO",
    cost: 2,
    tags: ["trovao"],
    price: 1400,
    requiredLevel: 2,
    desc: "+3 de MP por turno.",
    flavor: "Zumbe baixinho enquanto recarrega.",
    mods: { mpregen: 3 },
  },
  {
    id: "passo_curto",
    name: "PASSO CURTO",
    rarity: "bronze",
    element: "VENTO",
    cost: 2,
    tags: ["fera"],
    price: 1400,
    requiredLevel: 2,
    desc: "+10% de AGILIDADE e +3% de esquiva.",
    flavor: "Tres passos falsos para cada passo verdadeiro.",
    mods: { agl: 10, evade: 3 },
  },
  {
    id: "cofre_ferrugem",
    name: "COFRE DE FERRUGEM",
    rarity: "bronze",
    element: "SUCATA",
    cost: 1,
    tags: ["ferro"],
    price: 1600,
    requiredLevel: 3,
    desc: "+25% de ouro nas vitorias.",
    flavor: "Cada vitoria enche mais um pouco o cofre.",
    mods: { gold: 25 },
  },
  {
    id: "manual_piloto",
    name: "MANUAL DO PILOTO",
    rarity: "bronze",
    element: "DADOS",
    cost: 1,
    tags: ["protocolo"],
    price: 1600,
    requiredLevel: 3,
    desc: "+25% de XP nas vitorias.",
    flavor: "Anotacoes rabiscadas por cem pilotos antes de voce.",
    mods: { xp: 25 },
  },
  {
    id: "nanoreparo",
    name: "NANORREPARO",
    rarity: "bronze",
    element: "NANO",
    cost: 2,
    tags: ["nano"],
    price: 1800,
    requiredLevel: 4,
    desc: "Regenera 4% do HP maximo por turno.",
    flavor: "Um enxame invisivel costurando o casco.",
    mods: { regen: 4 },
  },
  {
    id: "presa_gelada",
    name: "PRESA GELADA",
    rarity: "bronze",
    element: "GELO",
    cost: 2,
    tags: ["gelo"],
    price: 1800,
    requiredLevel: 4,
    desc: "+20% de poder dos efeitos aplicados.",
    flavor: "O frio entra pelas juntas e fica.",
    mods: { venom: 20 },
  },

  // ---------------------------------------------------------------- prata
  {
    id: "forja_furiosa",
    name: "FORJA FURIOSA",
    rarity: "prata",
    element: "FOGO",
    cost: 3,
    tags: ["chama", "caos"],
    price: 4200,
    requiredLevel: 6,
    desc: "+14% de FORCA e +18% de dano abaixo de 35% de HP.",
    flavor: "Quanto mais amassado, mais quente ele fica.",
    mods: { str: 14, rage: 18 },
  },
  {
    id: "muralha_polar",
    name: "MURALHA POLAR",
    rarity: "prata",
    element: "GELO",
    cost: 3,
    tags: ["gelo", "ferro"],
    price: 4200,
    requiredLevel: 6,
    desc: "+12% de couraca e +10% de HP maximo.",
    flavor: "Uma parede de gelo que responde com estilhaco.",
    mods: { aegis: 12, hp: 10 },
  },
  {
    id: "descarga_tripla",
    name: "DESCARGA TRIPLA",
    rarity: "prata",
    element: "TROVAO",
    cost: 3,
    tags: ["trovao"],
    price: 4600,
    requiredLevel: 8,
    desc: "+8% de critico e +8% de AGILIDADE.",
    flavor: "Tres arcos saem antes do inimigo piscar.",
    mods: { crit: 8, agl: 8 },
  },
  {
    id: "manto_sombrio",
    name: "MANTO SOMBRIO",
    rarity: "prata",
    element: "SOMBRA",
    cost: 3,
    tags: ["sombra"],
    price: 4600,
    requiredLevel: 8,
    desc: "+8% de esquiva e +10% de dreno de vida.",
    flavor: "Some no escuro e volta com a vida do outro.",
    mods: { evade: 8, lifesteal: 10 },
  },
  {
    id: "protocolo_ferro",
    name: "PROTOCOLO FERRO",
    rarity: "prata",
    element: "DADOS",
    cost: 3,
    tags: ["protocolo", "ferro"],
    price: 5000,
    requiredLevel: 10,
    desc: "+15% de DEFESA e 25% de resistencia a efeitos.",
    flavor: "Rotina de emergencia gravada em memoria fria.",
    mods: { def: 15, resist: 25 },
  },
  {
    id: "enxame_nano",
    name: "ENXAME NANO",
    rarity: "prata",
    element: "NANO",
    cost: 3,
    tags: ["nano", "arcano"],
    price: 5000,
    requiredLevel: 10,
    desc: "Regenera 6% do HP por turno e +2 de MP por turno.",
    flavor: "Milhoes de operarios microscopicos em turno dobrado.",
    mods: { regen: 6, mpregen: 2 },
  },
  {
    id: "instinto_fera",
    name: "INSTINTO DE FERA",
    rarity: "prata",
    element: "BESTA",
    cost: 3,
    tags: ["fera", "caos"],
    price: 5400,
    requiredLevel: 12,
    desc: "+22% de dano nos 2 primeiros turnos e +6% de critico.",
    flavor: "Ataca antes de pensar. Costuma dar certo.",
    mods: { opening: 22, crit: 6 },
  },
  {
    id: "espinho_reativo",
    name: "ESPINHO REATIVO",
    rarity: "prata",
    element: "FERRO",
    cost: 3,
    tags: ["ferro", "caos"],
    price: 5400,
    requiredLevel: 12,
    desc: "Devolve 18% do dano recebido e +8% de DEFESA.",
    flavor: "Bater nele custa caro.",
    mods: { thorns: 18, def: 8 },
  },

  // ---------------------------------------------------------------- ouro
  {
    id: "coroa_incandescente",
    name: "COROA INCANDESCENTE",
    rarity: "ouro",
    element: "FOGO",
    cost: 4,
    tags: ["chama", "arcano"],
    price: 12000,
    requiredLevel: 16,
    desc: "+22% de poder das habilidades e +10% de FORCA.",
    flavor: "Coroa fundida com o nucleo de uma estrela morta.",
    mods: { amp: 22, str: 10 },
  },
  {
    id: "juizo_congelante",
    name: "JUIZO CONGELANTE",
    rarity: "ouro",
    element: "GELO",
    cost: 4,
    tags: ["gelo", "protocolo"],
    price: 12000,
    requiredLevel: 16,
    desc: "+35% de poder dos efeitos e +14% de couraca.",
    flavor: "O veredito chega em forma de geada.",
    mods: { venom: 35, aegis: 14 },
  },
  {
    id: "tempestade_permanente",
    name: "TEMPESTADE PERMANENTE",
    rarity: "ouro",
    element: "TROVAO",
    cost: 4,
    tags: ["trovao", "caos"],
    price: 13000,
    requiredLevel: 18,
    desc: "+12% de critico, +12% de AGILIDADE e +4 de MP por turno.",
    flavor: "Uma nuvem particular que segue o mecha.",
    mods: { crit: 12, agl: 12, mpregen: 4 },
  },
  {
    id: "devorador_de_luz",
    name: "DEVORADOR DE LUZ",
    rarity: "ouro",
    element: "SOMBRA",
    cost: 4,
    tags: ["sombra", "fera"],
    price: 13000,
    requiredLevel: 18,
    desc: "+20% de dreno de vida e +12% de FORCA.",
    flavor: "Come o brilho do adversario e engorda com ele.",
    mods: { lifesteal: 20, str: 12 },
  },
  {
    id: "nucleo_arcano",
    name: "NUCLEO ARCANO",
    rarity: "ouro",
    element: "ARCANO",
    cost: 4,
    tags: ["arcano", "nano"],
    price: 14000,
    requiredLevel: 20,
    desc: "+25% de MP maximo, +5 de MP por turno e +12% de poder.",
    flavor: "Gira sozinho, alimentado por uma equacao inacabada.",
    mods: { mp: 25, mpregen: 5, amp: 12 },
  },
  {
    id: "titan_de_aco",
    name: "TITA DE ACO",
    rarity: "ouro",
    element: "FERRO",
    cost: 5,
    tags: ["ferro", "protocolo"],
    price: 15000,
    requiredLevel: 22,
    desc: "+20% de HP maximo, +18% de DEFESA e 20% de couraca.",
    flavor: "Nao corre. Nao precisa.",
    mods: { hp: 20, def: 18, aegis: 20 },
  },
  {
    id: "cacador_selvagem",
    name: "CACADOR SELVAGEM",
    rarity: "ouro",
    element: "BESTA",
    cost: 4,
    tags: ["fera", "sombra"],
    price: 14000,
    requiredLevel: 20,
    desc: "+30% de dano de abertura, +10% de esquiva.",
    flavor: "Caca em silencio e termina no primeiro bote.",
    mods: { opening: 30, evade: 10 },
  },
  {
    id: "diretriz_zero",
    name: "DIRETRIZ ZERO",
    rarity: "ouro",
    element: "DADOS",
    cost: 4,
    tags: ["protocolo", "arcano"],
    price: 15000,
    requiredLevel: 22,
    desc: "45% de resistencia a efeitos e +15% de DEFESA e AGILIDADE.",
    flavor: "Quando tudo falha, a diretriz zero assume o controle.",
    mods: { resist: 45, def: 15, agl: 15 },
  },

  // ---------------------------------------------------------------- prisma
  {
    id: "supernova_privada",
    name: "SUPERNOVA PRIVADA",
    rarity: "prisma",
    element: "FOGO",
    cost: 5,
    tags: ["chama", "caos", "arcano"],
    price: 34000,
    requiredLevel: 28,
    desc: "+30% de poder, +25% de furia, mas -10% de HP maximo.",
    flavor: "Guarda uma estrela colapsando dentro do reator.",
    mods: { amp: 30, rage: 25, hp: -10 },
  },
  {
    id: "eco_do_vazio",
    name: "ECO DO VAZIO",
    rarity: "prisma",
    element: "SOMBRA",
    cost: 5,
    tags: ["sombra", "arcano", "nano"],
    price: 34000,
    requiredLevel: 28,
    desc: "+25% de dreno, 8% de regeneracao e +12% de esquiva.",
    flavor: "O que ele absorve nunca volta.",
    mods: { lifesteal: 25, regen: 8, evade: 12 },
  },
  {
    id: "coracao_da_tempestade",
    name: "CORACAO DA TEMPESTADE",
    rarity: "prisma",
    element: "TROVAO",
    cost: 5,
    tags: ["trovao", "fera", "caos"],
    price: 38000,
    requiredLevel: 32,
    desc: "+18% de critico, +20% de AGILIDADE e +15% de FORCA.",
    flavor: "Bate como trovao e sai antes do relampago.",
    mods: { crit: 18, agl: 20, str: 15 },
  },
  {
    id: "fortaleza_prisma",
    name: "FORTALEZA PRISMA",
    rarity: "prisma",
    element: "PRISMA",
    cost: 6,
    tags: ["ferro", "gelo", "protocolo"],
    price: 38000,
    requiredLevel: 32,
    desc: "+28% de couraca, +25% de HP e devolve 25% do dano.",
    flavor: "Cada face do prisma reflete um golpe diferente.",
    mods: { aegis: 28, hp: 25, thorns: 25 },
  },
  {
    id: "singularidade",
    name: "SINGULARIDADE",
    rarity: "prisma",
    element: "ARCANO",
    cost: 6,
    tags: ["arcano", "caos", "nano"],
    price: 45000,
    requiredLevel: 36,
    desc: "+20% em todos os atributos e +6 de MP por turno.",
    flavor: "Um ponto onde as regras do combate se dobram.",
    mods: { str: 20, def: 20, agl: 20, hp: 20, mp: 20, mpregen: 6 },
  },
  {
    id: "protocolo_omega",
    name: "PROTOCOLO OMEGA",
    rarity: "prisma",
    element: "DADOS",
    cost: 6,
    tags: ["protocolo", "nano", "ferro"],
    price: 45000,
    requiredLevel: 36,
    desc: "60% de resistencia, 10% de regeneracao e +20% de couraca.",
    flavor: "A ultima rotina antes do desligamento definitivo.",
    mods: { resist: 60, regen: 10, aegis: 20 },
  },
];

export const CARD_MAP: Record<string, CardDef> = Object.fromEntries(
  CARDS.map((c) => [c.id, c]),
);

export const SYNERGIES: SynergyDef[] = [
  // --- por tag
  {
    id: "s_chama",
    name: "COMBUSTAO EM CADEIA",
    desc: "2 cards CHAMA: +15% de poder e +10% de furia.",
    tag: { tag: "chama", count: 2 },
    mods: { amp: 15, rage: 10 },
  },
  {
    id: "s_gelo",
    name: "ZERO ABSOLUTO",
    desc: "2 cards GELO: +20% de poder dos efeitos e +8% de couraca.",
    tag: { tag: "gelo", count: 2 },
    mods: { venom: 20, aegis: 8 },
  },
  {
    id: "s_trovao",
    name: "SOBRECARGA",
    desc: "2 cards TROVAO: +8% de critico e +3 de MP por turno.",
    tag: { tag: "trovao", count: 2 },
    mods: { crit: 8, mpregen: 3 },
  },
  {
    id: "s_sombra",
    name: "PREDADOR NOTURNO",
    desc: "2 cards SOMBRA: +10% de dreno e +6% de esquiva.",
    tag: { tag: "sombra", count: 2 },
    mods: { lifesteal: 10, evade: 6 },
  },
  {
    id: "s_ferro",
    name: "LINHA DE BLINDAGEM",
    desc: "2 cards FERRO: +12% de DEFESA e +10% de espinhos.",
    tag: { tag: "ferro", count: 2 },
    mods: { def: 12, thorns: 10 },
  },
  {
    id: "s_nano",
    name: "COLONIA ATIVA",
    desc: "2 cards NANO: +5% de regeneracao por turno.",
    tag: { tag: "nano", count: 2 },
    mods: { regen: 5 },
  },
  {
    id: "s_arcano",
    name: "CIRCUITO RUNICO",
    desc: "2 cards ARCANO: +15% de MP maximo e +10% de poder.",
    tag: { tag: "arcano", count: 2 },
    mods: { mp: 15, amp: 10 },
  },
  {
    id: "s_fera",
    name: "MATILHA",
    desc: "2 cards FERA: +12% de AGILIDADE e +15% de abertura.",
    tag: { tag: "fera", count: 2 },
    mods: { agl: 12, opening: 15 },
  },
  {
    id: "s_protocolo",
    name: "REDE DE COMANDO",
    desc: "2 cards PROTOCOLO: +20% de resistencia e +8% de DEFESA.",
    tag: { tag: "protocolo", count: 2 },
    mods: { resist: 20, def: 8 },
  },
  {
    id: "s_caos",
    name: "ENTROPIA",
    desc: "2 cards CAOS: +12% de FORCA e +12% de furia.",
    tag: { tag: "caos", count: 2 },
    mods: { str: 12, rage: 12 },
  },
  // --- triplas por tag
  {
    id: "s_chama3",
    name: "INFERNO TOTAL",
    desc: "3 cards CHAMA: +25% de poder e +15% de FORCA.",
    tag: { tag: "chama", count: 3 },
    mods: { amp: 25, str: 15 },
  },
  {
    id: "s_ferro3",
    name: "BASTIAO ABSOLUTO",
    desc: "3 cards FERRO: +20% de couraca e +15% de HP maximo.",
    tag: { tag: "ferro", count: 3 },
    mods: { aegis: 20, hp: 15 },
  },
  {
    id: "s_arcano3",
    name: "CONVERGENCIA ARCANA",
    desc: "3 cards ARCANO: +20% de poder e +5 de MP por turno.",
    tag: { tag: "arcano", count: 3 },
    mods: { amp: 20, mpregen: 5 },
  },
  {
    id: "s_caos3",
    name: "COLAPSO",
    desc: "3 cards CAOS: +20% de critico e +20% de furia.",
    tag: { tag: "caos", count: 3 },
    mods: { crit: 20, rage: 20 },
  },
  // --- combos nomeados
  {
    id: "c_vulcao",
    name: "COMBO: VULCAO DE ACO",
    desc: "FORJA FURIOSA + PLACA BRUTA: +15% de FORCA e +12% de couraca.",
    cards: ["forja_furiosa", "placa_bruta"],
    mods: { str: 15, aegis: 12 },
  },
  {
    id: "c_vampiro",
    name: "COMBO: SEDE ETERNA",
    desc: "MANTO SOMBRIO + DEVORADOR DE LUZ: +20% de dreno e +10% de poder.",
    cards: ["manto_sombrio", "devorador_de_luz"],
    mods: { lifesteal: 20, amp: 10 },
  },
  {
    id: "c_raio",
    name: "COMBO: RELAMPAGO DUPLO",
    desc: "DESCARGA TRIPLA + TEMPESTADE PERMANENTE: +15% de critico e +10% de AGILIDADE.",
    cards: ["descarga_tripla", "tempestade_permanente"],
    mods: { crit: 15, agl: 10 },
  },
  {
    id: "c_maquina",
    name: "COMBO: MAQUINA PERFEITA",
    desc: "PROTOCOLO FERRO + DIRETRIZ ZERO + TITA DE ACO: +25% de couraca e 25% de resistencia.",
    cards: ["protocolo_ferro", "diretriz_zero", "titan_de_aco"],
    mods: { aegis: 25, resist: 25 },
  },
  {
    id: "c_bicho",
    name: "COMBO: CACADA ABERTA",
    desc: "INSTINTO DE FERA + CACADOR SELVAGEM: +25% de abertura e +10% de critico.",
    cards: ["instinto_fera", "cacador_selvagem"],
    mods: { opening: 25, crit: 10 },
  },
  {
    id: "c_singular",
    name: "COMBO: HORIZONTE DE EVENTOS",
    desc: "SINGULARIDADE + ECO DO VAZIO: +20% de dreno e +15% de poder.",
    cards: ["singularidade", "eco_do_vazio"],
    mods: { lifesteal: 20, amp: 15 },
  },
  {
    id: "c_riqueza",
    name: "COMBO: EXPEDICAO LUCRATIVA",
    desc: "COFRE DE FERRUGEM + MANUAL DO PILOTO: +25% de ouro e +25% de XP.",
    cards: ["cofre_ferrugem", "manual_piloto"],
    mods: { gold: 25, xp: 25 },
  },
  {
    id: "c_nucleo",
    name: "COMBO: REATOR SATURADO",
    desc: "NUCLEO ARCANO + COROA INCANDESCENTE: +20% de poder e +20% de MP maximo.",
    cards: ["nucleo_arcano", "coroa_incandescente"],
    mods: { amp: 20, mp: 20 },
  },
];

export interface DeckResult {
  ids: string[];
  cost: number;
  mods: CardMods;
  synergies: SynergyDef[];
}

function addMods(target: CardMods, src: CardMods) {
  for (const [k, v] of Object.entries(src) as [CardStat, number][]) {
    target[k] = (target[k] ?? 0) + v;
  }
}

/** Agrega os modificadores de um deck (cards + sinergias ativas). */
export function resolveDeck(ids: string[]): DeckResult {
  const defs = ids
    .map((id) => CARD_MAP[id])
    .filter((c): c is CardDef => Boolean(c))
    .slice(0, MAX_CARDS);
  const mods: CardMods = {};
  let cost = 0;
  for (const c of defs) {
    addMods(mods, c.mods);
    cost += c.cost;
  }
  const owned = new Set(defs.map((c) => c.id));
  const tagCount = new Map<CardTag, number>();
  for (const c of defs) {
    for (const t of c.tags) tagCount.set(t, (tagCount.get(t) ?? 0) + 1);
  }
  const synergies: SynergyDef[] = [];
  for (const s of SYNERGIES) {
    const byTag = s.tag ? (tagCount.get(s.tag.tag) ?? 0) >= s.tag.count : false;
    const byCards = s.cards ? s.cards.every((id) => owned.has(id)) : false;
    if (byTag || byCards) {
      synergies.push(s);
      addMods(mods, s.mods);
    }
  }
  return { ids: defs.map((c) => c.id), cost, mods, synergies };
}

/** Sinergias que ainda nao estao ativas mas ficariam a 1 card de distancia. */
export function nearSynergies(ids: string[]): SynergyDef[] {
  const active = new Set(resolveDeck(ids).synergies.map((s) => s.id));
  const owned = new Set(ids);
  const tagCount = new Map<CardTag, number>();
  for (const id of ids) {
    const c = CARD_MAP[id];
    if (!c) continue;
    for (const t of c.tags) tagCount.set(t, (tagCount.get(t) ?? 0) + 1);
  }
  return SYNERGIES.filter((s) => {
    if (active.has(s.id)) return false;
    if (s.tag) return (tagCount.get(s.tag.tag) ?? 0) === s.tag.count - 1;
    if (s.cards) {
      const missing = s.cards.filter((id) => !owned.has(id)).length;
      return missing === 1 && ids.length < MAX_CARDS;
    }
    return false;
  });
}

export function cardMod(mods: CardMods, stat: CardStat): number {
  return mods[stat] ?? 0;
}

/** Deck deterministico para robos controlados pela IA. */
export function aiDeck(robotId: string, level: number): string[] {
  let seed = level * 7919 + robotId.length * 131;
  for (let i = 0; i < robotId.length; i++) seed = (seed * 31 + robotId.charCodeAt(i)) % 2147483647;
  const rng = () => {
    seed = (seed * 48271) % 2147483647;
    return seed / 2147483647;
  };
  // inimigos ganham cards conforme o nivel: 1 card a partir do 5, 2 do 15, 3 do 25.
  const slots = level >= 25 ? 3 : level >= 15 ? 2 : level >= 5 ? 1 : 0;
  if (slots === 0) return [];
  const pool = CARDS.filter((c) => c.requiredLevel <= Math.max(1, level));
  if (pool.length === 0) return [];
  const out: string[] = [];
  // primeiro card puxa uma tag; os seguintes tentam fechar sinergia com ela.
  const first = pool[Math.floor(rng() * pool.length)];
  out.push(first.id);
  const tag = first.tags[Math.floor(rng() * first.tags.length)];
  while (out.length < slots) {
    const same = pool.filter((c) => !out.includes(c.id) && c.tags.includes(tag));
    const rest = pool.filter((c) => !out.includes(c.id));
    const list = same.length > 0 && rng() < 0.75 ? same : rest;
    if (list.length === 0) break;
    out.push(list[Math.floor(rng() * list.length)].id);
  }
  return out;
}

/** Caminho da arte pixel art do card. */
export function cardArt(id: string): string {
  return `/cards/${id}.png`;
}
