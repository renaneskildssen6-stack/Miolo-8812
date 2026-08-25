// Sistema de PETS — companheiros de combate que dao bonus para a equipe inteira.
// Arte pixel art em /public/pets/<id>.png (192x192).

export type PetKind =
  | "striker" // + dano das habilidades
  | "bulwark" // - dano recebido
  | "medic" // regenera HP por turno
  | "sprinter" // + agilidade
  | "reactor" // + MP maximo
  | "vampire" // rouba vida
  | "hunter" // + chance de critico
  | "scavenger" // + ouro nas vitorias
  | "mentor"; // + XP nas vitorias

export interface PetDef {
  id: string;
  name: string;
  kind: PetKind;
  element: string;
  rarity: "bronze" | "silver" | "gold";
  /** valor no nivel 1 */
  base: number;
  /** incremento por nivel */
  step: number;
  price: number;
  desc: string;
  flavor: string;
  /** nivel do jogador necessario para comprar */
  requiredLevel: number;
}

export const PET_MAX_LEVEL = 5;

export const PET_KIND_LABEL: Record<PetKind, string> = {
  striker: "ATAQUE",
  bulwark: "COURACA",
  medic: "REPARO",
  sprinter: "VELOCIDADE",
  reactor: "ENERGIA",
  vampire: "DRENO",
  hunter: "PRECISAO",
  scavenger: "OURO",
  mentor: "EXPERIENCIA",
};

export const PETS: PetDef[] = [
  {
    id: "scrapmouse",
    name: "RATO SUCATA",
    kind: "scavenger",
    element: "FERRUGEM",
    rarity: "bronze",
    base: 12,
    step: 4,
    price: 1500,
    desc: "+12% de ouro nas vitorias.",
    flavor: "Cata parafusos no campo de batalha e volta com os bolsos cheios.",
    requiredLevel: 1,
  },
  {
    id: "sparkbat",
    name: "MORCEGO FAISCA",
    kind: "reactor",
    element: "TROVAO",
    rarity: "bronze",
    base: 10,
    step: 3.5,
    price: 2200,
    desc: "+10% de MP maximo da equipe.",
    flavor: "Dorme de cabeca para baixo dentro do reator e acorda carregado.",
    requiredLevel: 3,
  },
  {
    id: "boltpup",
    name: "FILHOTE VOLT",
    kind: "sprinter",
    element: "RAIO",
    rarity: "bronze",
    base: 7,
    step: 2.4,
    price: 2600,
    desc: "+7% de AGILIDADE da equipe.",
    flavor: "Corre em circulos ao redor da arena antes de cada luta.",
    requiredLevel: 5,
  },
  {
    id: "cogturtle",
    name: "TARTARUGA ENGRENAGEM",
    kind: "bulwark",
    element: "BRONZE",
    rarity: "silver",
    base: 6,
    step: 1.8,
    price: 5200,
    desc: "-6% de dano recebido pela equipe.",
    flavor: "O casco dela ja parou meteoros. Duas vezes.",
    requiredLevel: 8,
  },
  {
    id: "medivine",
    name: "TREPADEIRA MEDICA",
    kind: "medic",
    element: "BIO",
    rarity: "silver",
    base: 3.5,
    step: 1.1,
    price: 6400,
    desc: "Repara 3.5% do HP maximo por turno.",
    flavor: "Enrola nas juntas danificadas e costura o metal com seiva.",
    requiredLevel: 12,
  },
  {
    id: "emberfeline",
    name: "FELINO DE BRASA",
    kind: "striker",
    element: "BRASA",
    rarity: "silver",
    base: 8,
    step: 2.6,
    price: 7800,
    desc: "+8% de dano nas habilidades.",
    flavor: "Ronrona a 900 graus. Nao faca carinho sem luva termica.",
    requiredLevel: 16,
  },
  {
    id: "frostowl",
    name: "CORUJA GELIDA",
    kind: "hunter",
    element: "GELO",
    rarity: "silver",
    base: 6,
    step: 1.8,
    price: 8600,
    desc: "+6% de chance de golpe critico.",
    flavor: "Enxerga a fresta na blindagem antes de voce mirar.",
    requiredLevel: 20,
  },
  {
    id: "leechdrone",
    name: "DRONE SANGUESSUGA",
    kind: "vampire",
    element: "VAZIO",
    rarity: "gold",
    base: 8,
    step: 2.2,
    price: 14000,
    desc: "Recupera 8% do dano causado como HP.",
    flavor: "Suga energia do inimigo e devolve pelo cabo de manutencao.",
    requiredLevel: 26,
  },
  {
    id: "runefox",
    name: "RAPOSA RUNICA",
    kind: "mentor",
    element: "RUNA",
    rarity: "gold",
    base: 15,
    step: 5,
    price: 16000,
    desc: "+15% de XP nas vitorias.",
    flavor: "Anota cada combate em tabuas de pedra flutuantes.",
    requiredLevel: 32,
  },
  {
    id: "magmawyrm",
    name: "VERME DE MAGMA",
    kind: "striker",
    element: "MAGMA",
    rarity: "gold",
    base: 12,
    step: 3.4,
    price: 22000,
    desc: "+12% de dano nas habilidades.",
    flavor: "Nasceu dentro de uma forja estelar e nunca esfriou.",
    requiredLevel: 45,
  },
  {
    id: "aegisjelly",
    name: "AGUA-VIVA EGIDE",
    kind: "bulwark",
    element: "CRISTAL",
    rarity: "gold",
    base: 10,
    step: 2.6,
    price: 24000,
    desc: "-10% de dano recebido pela equipe.",
    flavor: "Dissolve impacto em luz antes que chegue no chassi.",
    requiredLevel: 58,
  },
  {
    id: "zenithdrake",
    name: "DRAGAO ZENITE",
    kind: "medic",
    element: "ZENITE",
    rarity: "gold",
    base: 6,
    step: 1.6,
    price: 40000,
    desc: "Repara 6% do HP maximo por turno.",
    flavor: "O ultimo companheiro. So responde a quem venceu o Coliseu.",
    requiredLevel: 75,
  },
];

export const PET_MAP: Record<string, PetDef> = Object.fromEntries(
  PETS.map((p) => [p.id, p]),
);

export function petArt(id: string): string {
  return `/pets/${id}.png`;
}

/** valor do efeito no nivel informado */
export function petValue(def: PetDef, level: number): number {
  if (level <= 0) return 0;
  return Math.round((def.base + def.step * (level - 1)) * 10) / 10;
}

/** custo para subir do nivel atual para o proximo */
export function petUpgradeCost(def: PetDef, current: number): number {
  return Math.round((def.price * 0.5 * Math.pow(current + 1, 1.3)) / 50) * 50;
}
