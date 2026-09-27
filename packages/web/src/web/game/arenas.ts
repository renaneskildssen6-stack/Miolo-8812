/**
 * Registro central de arenas de batalha.
 *
 * Cada arena tem um spritesheet animado unico em
 * `/arenas/{id}_sheet.png` (480 x 1088 = 4 frames de 480x272 empilhados).
 * O componente ArenaBackdrop rola o sheet no eixo Y para animar.
 */

export type ArenaId =
  | "dojo"
  | "neodojo"
  | "volcano"
  | "foundry"
  | "orbital"
  | "frozen"
  | "crystal"
  | "sky"
  | "storm"
  | "sunken"
  | "canyon";

/** Todas as arenas jogaveis, na ordem de rotacao padrao. */
export const ARENA_IDS: ArenaId[] = [
  "dojo",
  "volcano",
  "orbital",
  "sky",
  "frozen",
  "neodojo",
  "sunken",
  "canyon",
  "foundry",
  "crystal",
  "storm",
];

/** Nome exibido de cada arena. */
export const ARENA_NAMES: Record<ArenaId, string> = {
  dojo: "DOJO ANCESTRAL",
  neodojo: "NEO-DOJO NEON",
  volcano: "CRATERA VULCANICA",
  foundry: "FUNDICAO DE SUCATA",
  orbital: "PLATAFORMA ORBITAL",
  frozen: "PLANICIE CONGELADA",
  crystal: "CAVERNA DE CRISTAL",
  sky: "ARENA CELESTE",
  storm: "COLISEU DA TEMPESTADE",
  sunken: "TEMPLO SUBMERSO",
  canyon: "CANION DAS ESTATUAS",
};

export function arenaSheetUrl(arena: string): string {
  return `/arenas/${arena}_sheet.png`;
}

/**
 * Casa palavra-chave com um nome de elemento sem os falsos positivos de
 * `includes` cru: palavras curtas (<= 4 letras) so batem com a palavra
 * inteira, para "SOM" nao capturar "SOMBRA" nem "AR" capturar "AREIA".
 */
export function matchKeyword(text: string, word: string): boolean {
  const up = (text || "").toUpperCase();
  const w = word.toUpperCase().trim();
  if (!w) return false;
  if (w.length > 4) return up.includes(w);
  return up.split(/[^0-9A-ZÀ-Ü]+/).some((tok) => tok === w);
}

/** Palavras-chave de elemento -> arena tematica. */
const ELEMENT_ARENA: [string[], ArenaId][] = [
  [
    ["FOGO", "CHAMA", "MAGMA", "VULCAO", "BRASA", "INFERNO", "PIRA", "CINZAS", "FAISCA", "SOL", "FATUO"],
    "volcano",
  ],
  [
    ["FERRO", "FERRUG", "FORJA", "SUCATA", "METAL", "TITANIO", "TITA", "LATAO", "ENGRENAGEM", "CIRCUITO", "SOLDA", "ACO", "AÇO", "GRAFENO", "MAGNET", "RELOJ", "MAQUIN"],
    "foundry",
  ],
  [["GELO", "NEVE", "TUNDRA", "POLAR", "GLACIAL", "GEADA", "CRIO"], "frozen"],
  [
    ["CRISTAL", "VIDRO", "JADE", "ESPELHO", "AMBAR", "MARMORE", "OBSIDIANA", "PRISMA", "ARCO-IRIS", "OURO", "GRANITO", "DIAMANTE"],
    "crystal",
  ],
  [
    ["COSMIC", "NEBULOSA", "ESTRELA", "LUA", "ORBITA", "ANEL", "PULSAR", "QUANTUM", "VAZIO", "NEGRO", "ECLIPSE", "ZENITE", "ETER", "GRAVIDADE", "METEORO", "FOTON", "LUZ", "AURORA"],
    "orbital",
  ],
  [["CEU", "NUVEM", "VENT", "BRISA", "PENA", "CALMARIA", "ESTACAO", "AR "], "sky"],
  [["TEMPESTADE", "TROVAO", "RELAMPAGO", "PLASMA", "RAIO", "ELETR", "NEON", "PULSO"], "storm"],
  [
    ["AGUA", "MARE", "TSUNAMI", "RECIFE", "CORAL", "ALGA", "ABISS", "ABISMO", "VAPOR", "PANTANO", "LODO", "PICHE", "TOXINA", "ACIDO", "VENENO", "OCEANO"],
    "sunken",
  ],
  [
    ["AREIA", "DESERTO", "TERRA", "PEDRA", "ROCHA", "POEIRA", "BASALTO", "TERREMOTO", "RUINA", "TUMULO", "OSSO", "COLHEITA", "DUNA"],
    "canyon",
  ],
  [
    ["SAMURAI", "DISCIPLINA", "SEDA", "TECEL", "SILENCIO", "CANTO", "RUNA", "ESPIRITO", "ALMA", "SANTO", "CATEDRAL", "PEREGRINO", "VALQUIRIA", "GUERRA", "FORTALEZA", "LAMENTO", "NOITE", "BREU", "SOMBRA", "TEMPO"],
    "neodojo",
  ],
  [["BIO", "SELVA", "FLOR", "FUNGO", "ESPORO", "ESPINHO", "BESOURO", "LOBO", "SANGUE", "PRAGA", "VIDA"], "dojo"],
];

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** Arena estavel a partir de uma chave qualquer (id de torneio, semente etc). */
export function arenaForKey(key: string): ArenaId {
  const list = ARENA_IDS;
  return list[hash(key) % list.length] as ArenaId;
}

/**
 * Escolhe a arena tematica para um elemento; se nenhuma palavra-chave
 * bater, cai num sorteio estavel por hash (nunca repete sempre a mesma).
 */
export function arenaForElement(element: string, key = ""): ArenaId {
  const up = (element || "").toUpperCase();
  for (const [words, arena] of ELEMENT_ARENA) {
    for (const w of words) {
      if (matchKeyword(up, w)) return arena;
    }
  }
  return arenaForKey(`${up}|${key}`);
}
