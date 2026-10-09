/**
 * Panteão Mítico — 27 robôs de raridade MÍTICA (acima de ouro).
 *
 * Ficam FORA de `ROBOTS`/`CATALOG_IDS` (recrutáveis, torneios, cápsulas,
 * loja e PvP): só entram no `ROBOT_MAP` e só são liberados pelo Panteão.
 * Sprites: /robots/<id>.png com os mesmos 16 frames dos demais, gerados por IA
 * 9 robôs por imagem (scripts/build-mythic-art.py).
 */
import { buildKit, VFX, type SkillEffect } from "./skills";
import type { RobotDef, Ratios } from "./robots";

export type PantheonId = "norse" | "egypt" | "greek";

export interface PantheonDef {
  id: PantheonId;
  name: string;
  realm: string;
  color: string;
  glow: string;
  arena: string;
  lore: string;
}

export const PANTHEONS: PantheonDef[] = [
  {
    id: "norse",
    name: "ASGARD",
    realm: "PORTAL DAS RUNAS",
    color: "#7fd4ff",
    glow: "rgba(120,200,255,0.55)",
    arena: "frozen",
    lore: "Forjados no gelo de Niflheim, os chassis de Asgard só respondem a pilotos que já sangraram em batalha.",
  },
  {
    id: "greek",
    name: "OLIMPO",
    realm: "PORTAL DO TROVÃO",
    color: "#ffd86a",
    glow: "rgba(255,216,106,0.55)",
    arena: "sky",
    lore: "No topo do Olimpo, doze reatores-deuses esperam um desafiante digno do raio.",
  },
  {
    id: "egypt",
    name: "DUAT",
    realm: "PORTAL DO SOL",
    color: "#ffa04a",
    glow: "rgba(255,160,74,0.55)",
    arena: "volcano",
    lore: "Sob as areias do Duat, os faraós de metal pesam o núcleo de cada piloto contra uma pluma.",
  },
];

interface MythicBlueprint {
  id: string;
  name: string;
  pantheon: PantheonId;
  element: string;
  ratios: Ratios;
  bio: string;
  vfxStrong: string;
  vfxSpecial: string;
  names: [string, string, string, string];
  effect: SkillEffect;
}

const r = (hp: number, mp: number, str: number, def: number, ag: number): Ratios => ({ hp, mp, str, def, ag, mv: 16, xv: 17 });

const BP: MythicBlueprint[] = [
  // ------------------------------------------------------------ ASGARD
  { id: "odinax", name: "ODINAX", pantheon: "norse", element: "RUNA", ratios: r(122, 136, 128, 116, 112), bio: "Pai de todos os chassis. Um olho vê a arena, o outro vê o fim dela.", vfxStrong: VFX.laser, vfxSpecial: VFX.ward, names: ["LANÇA GUNGNIR", "VOO DOS CORVOS", "OLHAR DE HLIDSKJALF", "MANTO DO ANDARILHO"], effect: { type: "blind", power: 30, turns: 3, chance: 0.8 } },
  { id: "thorvald", name: "THORVALD", pantheon: "norse", element: "TROVAO", ratios: r(130, 112, 138, 118, 104), bio: "O martelo cai uma vez. O trovão chega depois, para avisar.", vfxStrong: VFX.thunder, vfxSpecial: VFX.thunder, names: ["MJOLNIR DESCENDENTE", "ESTALO DE BILSKIRNIR", "RAGNAROK ELÉTRICO", "CINTURÃO MEGINGJORD"], effect: { type: "paralyze", power: 0, turns: 2, chance: 0.65 } },
  { id: "lokirax", name: "LOKIRAX", pantheon: "norse", element: "ILUSAO", ratios: r(108, 132, 120, 104, 138), bio: "Nunca está onde o radar aponta. Às vezes está do seu lado do campo.", vfxStrong: VFX.curse, vfxSpecial: VFX.void, names: ["ADAGA DE DUAS FACES", "CHAMA ESMERALDA", "TROCA DE PELE", "MÁSCARA DO TRAPACEIRO"], effect: { type: "weakening", power: 30, turns: 3, chance: 0.8 } },
  { id: "freyjax", name: "FREYJAX", pantheon: "norse", element: "VALQUIRIA", ratios: r(118, 128, 126, 114, 128), bio: "Escolhe quem cai e quem volta. Suas asas de aço reerguem o esquadrão.", vfxStrong: VFX.slash, vfxSpecial: VFX.heal, names: ["CORTE DE FOLKVANG", "MERGULHO VALQUÍRIA", "COLAR BRISINGAMEN", "ASAS DE SESSRÚMNIR"], effect: { type: "hp_regen", power: 9, turns: 3, chance: 1 } },
  { id: "fenrigar", name: "FENRIGAR", pantheon: "norse", element: "LOBO", ratios: r(126, 104, 140, 110, 126), bio: "As correntes Gleipnir ainda pendem dos pulsos. Ninguém conseguiu prendê-lo de novo.", vfxStrong: VFX.slash, vfxSpecial: VFX.frost, names: ["PRESA DE GLEIPNIR", "UIVO DO FIM", "DEVORAR O SOL", "PELAGEM DE FERRO NEGRO"], effect: { type: "drain", power: 18, turns: 3, chance: 0.8 } },
  { id: "heimdros", name: "HEIMDROS", pantheon: "norse", element: "BIFROST", ratios: r(134, 120, 118, 136, 106), bio: "Guarda a ponte de arco-íris. Ouve o reator inimigo antes de ele ligar.", vfxStrong: VFX.prism, vfxSpecial: VFX.prism, names: ["LÂMINA BIFROST", "SOPRO DE GJALLARHORN", "VIGÍLIA ETERNA", "GUARDA DA PONTE"], effect: { type: "damage_reduction", power: 34, turns: 3, chance: 1 } },
  { id: "helgrim", name: "HELGRIM", pantheon: "norse", element: "NIFLHEL", ratios: r(120, 138, 124, 112, 114), bio: "Metade osso, metade névoa. Governa os chassis que o ferro-velho esqueceu.", vfxStrong: VFX.curse, vfxSpecial: VFX.siphon, names: ["TOQUE DE HELHEIM", "NÉVOA DOS MORTOS", "CORTEJO DE NAGLFAR", "VÉU DE OSSO"], effect: { type: "poison", power: 18, turns: 3, chance: 0.85 } },
  { id: "tyrbrand", name: "TYRBRAND", pantheon: "norse", element: "JUSTICA", ratios: r(132, 108, 130, 132, 104), bio: "Deu o braço como garantia de um juramento. Nunca perdeu um duelo justo.", vfxStrong: VFX.clang, vfxSpecial: VFX.shockwave, names: ["SENTENÇA DE TYR", "ESCUDO-JURAMENTO", "MÃO SACRIFICADA", "BROQUEL DA LEI"], effect: { type: "weakening", power: 32, turns: 3, chance: 0.8 } },
  { id: "jormundr", name: "JORMUNDR", pantheon: "norse", element: "SERPENTE", ratios: r(138, 118, 126, 124, 100), bio: "Uma volta da cauda envolve a arena inteira. A segunda volta aperta.", vfxStrong: VFX.toxic, vfxSpecial: VFX.torrent, names: ["TRIDENTE DE VENENO", "ANEL DO MUNDO", "ABRAÇO DE MIDGARD", "ESCAMAS ABISSAIS"], effect: { type: "trapped", power: 0, turns: 2, chance: 0.7 } },
  // ------------------------------------------------------------ OLIMPO
  { id: "zeustron", name: "ZEUSTRON", pantheon: "greek", element: "RAIO", ratios: r(126, 132, 140, 114, 116), bio: "Senhor do céu de cobre. Cada raio carrega uma assinatura que nenhum para-raios aceita.", vfxStrong: VFX.thunder, vfxSpecial: VFX.plasma, names: ["DARDO OLÍMPICO", "TEMPESTADE DE EGIS", "FÚRIA DO TITANOMAQUIA", "NUVEM SOBERANA"], effect: { type: "paralyze", power: 0, turns: 2, chance: 0.7 } },
  { id: "poseidrax", name: "POSEIDRAX", pantheon: "greek", element: "MARE", ratios: r(134, 124, 130, 122, 104), bio: "Bate o tridente e o chão da arena vira maré alta.", vfxStrong: VFX.torrent, vfxSpecial: VFX.torrent, names: ["TRIDENTE ABISSAL", "ONDA DE EGEU", "TERREMOTO MARINHO", "COROA DE CORAL"], effect: { type: "trapped", power: 0, turns: 2, chance: 0.65 } },
  { id: "hadexor", name: "HADEXOR", pantheon: "greek", element: "SUBMUNDO", ratios: r(128, 136, 128, 120, 106), bio: "Cérbero-drone a seus pés, chama azul na coroa. Ninguém sai do placar dele.", vfxStrong: VFX.curse, vfxSpecial: VFX.void, names: ["BIDENTE DO ESTIGE", "CÉRBERO DE AÇO", "JULGAMENTO DO HADES", "ELMO DA INVISIBILIDADE"], effect: { type: "drain", power: 20, turns: 3, chance: 0.8 } },
  { id: "arestrix", name: "ARESTRIX", pantheon: "greek", element: "GUERRA", ratios: r(128, 104, 142, 118, 116), bio: "Espartano de reator vermelho. Quanto mais longa a luta, mais forte ele fica.", vfxStrong: VFX.impact, vfxSpecial: VFX.explosion, names: ["LANÇA DE ESPARTA", "FALANGE CARMESIM", "SEDE DE BATALHA", "HOPLON DE BRONZE"], effect: { type: "adrenalin", power: 30, turns: 3, chance: 1 } },
  { id: "athenyx", name: "ATHENYX", pantheon: "greek", element: "SABEDORIA", ratios: r(130, 134, 120, 134, 112), bio: "Estrategista de olhos de coruja. Calculou esta batalha antes de você entrar.", vfxStrong: VFX.laser, vfxSpecial: VFX.shield, names: ["LANÇA DA ESTRATEGA", "VOO DA CORUJA", "OLHAR DA GÓRGONA", "ÉGIDE DE ATENA"], effect: { type: "damage_reduction", power: 34, turns: 3, chance: 1 } },
  { id: "apollarc", name: "APOLLARC", pantheon: "greek", element: "SOL", ratios: r(116, 130, 134, 110, 128), bio: "Arqueiro do carro solar. Suas flechas chegam antes da luz delas.", vfxStrong: VFX.laser, vfxSpecial: VFX.inferno, names: ["FLECHA DE HÉLIO", "LIRA RADIANTE", "CARRUAGEM DO SOL", "AURA DE DELFOS"], effect: { type: "burn", power: 16, turns: 4, chance: 0.85 } },
  { id: "artemyst", name: "ARTEMYST", pantheon: "greek", element: "LUA", ratios: r(112, 128, 132, 108, 140), bio: "Caçadora da lua crescente. Não erra um alvo que já marcou.", vfxStrong: VFX.frost, vfxSpecial: VFX.cosmos, names: ["FLECHA CRESCENTE", "CAÇADA NOTURNA", "ECLIPSE DE PRATA", "VÉU DO CERVO"], effect: { type: "blind", power: 32, turns: 3, chance: 0.8 } },
  { id: "hermexis", name: "HERMEXIS", pantheon: "greek", element: "MENSAGEIRO", ratios: r(110, 126, 124, 106, 146), bio: "Botas aladas e caduceu. Já entregou a derrota antes do primeiro turno.", vfxStrong: VFX.cyclone, vfxSpecial: VFX.chrono, names: ["CADUCEU VELOZ", "PASSO ALADO", "ENTREGA EXPRESSA", "SANDÁLIAS DE TALARIA"], effect: { type: "adrenalin", power: 32, turns: 3, chance: 1 } },
  { id: "hefestor", name: "HEFESTOR", pantheon: "greek", element: "FORJA", ratios: r(140, 110, 134, 136, 92), bio: "O ferreiro dos deuses. Forjou metade das armas desta lista.", vfxStrong: VFX.clang, vfxSpecial: VFX.meteor, names: ["MARTELO DA BIGORNA", "FORNALHA VIVA", "ERUPÇÃO DO ETNA", "COURAÇA FORJADA"], effect: { type: "burn", power: 18, turns: 3, chance: 0.85 } },
  // ------------------------------------------------------------ DUAT
  { id: "rakhet", name: "RAKHET", pantheon: "egypt", element: "SOL", ratios: r(124, 136, 136, 116, 114), bio: "Rei-falcão do disco solar. Atravessa o céu e o submundo em um só ciclo.", vfxStrong: VFX.inferno, vfxSpecial: VFX.levelup, names: ["CAJADO DE RÁ", "DISCO DO MEIO-DIA", "BARCA SOLAR", "HALO DE HELIÓPOLIS"], effect: { type: "burn", power: 18, turns: 4, chance: 0.85 } },
  { id: "anubrex", name: "ANUBREX", pantheon: "egypt", element: "JULGAMENTO", ratios: r(126, 130, 132, 122, 110), bio: "Pesa o núcleo do inimigo contra uma pluma. A balança sempre pende.", vfxStrong: VFX.slash, vfxSpecial: VFX.siphon, names: ["KHOPESH DO CHACAL", "BALANÇA DE MAAT", "PESAGEM DO CORAÇÃO", "COLAR DE OBSIDIANA"], effect: { type: "drain", power: 20, turns: 3, chance: 0.8 } },
  { id: "horaxis", name: "HORAXIS", pantheon: "egypt", element: "CEU", ratios: r(118, 126, 132, 112, 136), bio: "O olho que tudo vê está no visor. O outro olho está mirando você.", vfxStrong: VFX.cyclone, vfxSpecial: VFX.laser, names: ["GARRA DO FALCÃO", "OLHO DE HÓRUS", "VOO SOBRE O NILO", "ASAS REAIS"], effect: { type: "blind", power: 32, turns: 3, chance: 0.8 } },
  { id: "sethrax", name: "SETHRAX", pantheon: "egypt", element: "TEMPESTADE", ratios: r(128, 118, 138, 114, 118), bio: "Senhor do deserto vermelho. Leva a areia para dentro de cada engrenagem.", vfxStrong: VFX.quake, vfxSpecial: VFX.cyclone, names: ["CETRO UAS", "TORNADO VERMELHO", "CAOS DO DESERTO", "MURALHA DE AREIA"], effect: { type: "weakening", power: 32, turns: 3, chance: 0.8 } },
  { id: "isyra", name: "ISYRA", pantheon: "egypt", element: "VIDA", ratios: r(124, 140, 116, 120, 116), bio: "Asas turquesa e um ankh no peito. Já trouxe de volta um chassi aos pedaços.", vfxStrong: VFX.bloom, vfxSpecial: VFX.heal, names: ["SOPRO DO ANKH", "ASAS DE TURQUESA", "RESSURREIÇÃO DE ÍSIS", "TRONO PROTETOR"], effect: { type: "hp_regen", power: 10, turns: 3, chance: 1 } },
  { id: "thothex", name: "THOTHEX", pantheon: "egypt", element: "ESCRITA", ratios: r(114, 146, 124, 112, 120), bio: "Escriba íbis. O que ele escreve na tábua acontece no turno seguinte.", vfxStrong: VFX.chrono, vfxSpecial: VFX.ward, names: ["ESTILETE DE JUNCO", "TÁBUA DOS DESTINOS", "LIVRO DE TOTH", "GLIFO DE PROTEÇÃO"], effect: { type: "paralyze", power: 0, turns: 2, chance: 0.65 } },
  { id: "sekhmara", name: "SEKHMARA", pantheon: "egypt", element: "PRAGA", ratios: r(126, 112, 142, 112, 124), bio: "Leoa da guerra com juba de fogo. Só para quando a arena inteira arde.", vfxStrong: VFX.inferno, vfxSpecial: VFX.explosion, names: ["GARRA DA LEOA", "JUBA FLAMEJANTE", "FÚRIA DE SEKHMET", "PELE DE BRASA"], effect: { type: "burn", power: 20, turns: 3, chance: 0.85 } },
  { id: "osirun", name: "OSIRUN", pantheon: "egypt", element: "RENASCER", ratios: r(142, 128, 120, 132, 94), bio: "Faraó de bronze verde enfaixado em cabos. Morreu uma vez e não gostou.", vfxStrong: VFX.bloom, vfxSpecial: VFX.void, names: ["CAJADO E MANGUAL", "FAIXAS ETERNAS", "TRONO DO OCIDENTE", "SARCÓFAGO VIVO"], effect: { type: "poison", power: 18, turns: 3, chance: 0.85 } },
  { id: "basteon", name: "BASTEON", pantheon: "egypt", element: "FELINO", ratios: r(112, 124, 128, 108, 146), bio: "Gata de lápis-lazúli. Cai sempre de pé e sempre atrás de você.", vfxStrong: VFX.slash, vfxSpecial: VFX.sonic, names: ["LÂMINAS SISTRO", "SALTO DE BUBASTIS", "NOVE VIDAS", "OLHAR FELINO"], effect: { type: "adrenalin", power: 30, turns: 3, chance: 1 } },
];

export const MYTHIC_ROBOTS: RobotDef[] = BP.map((b) => ({
  id: b.id,
  name: b.name,
  element: b.element,
  rarity: "mythic" as const,
  ratios: b.ratios,
  bio: b.bio,
  names: b.names,
  skills: buildKit({ id: b.id, element: b.element, names: b.names, effect: b.effect, vfxStrong: b.vfxStrong, vfxSpecial: b.vfxSpecial }),
}));

export const MYTHIC_IDS: readonly string[] = Object.freeze(BP.map((b) => b.id));
const MYTHIC_SET = new Set(MYTHIC_IDS);
export const MYTHIC_PANTHEON: Record<string, PantheonId> = Object.fromEntries(BP.map((b) => [b.id, b.pantheon]));

export function isMythic(id: string): boolean {
  return MYTHIC_SET.has(id);
}

export function mythicsOf(p: PantheonId): string[] {
  return BP.filter((b) => b.pantheon === p).map((b) => b.id);
}
