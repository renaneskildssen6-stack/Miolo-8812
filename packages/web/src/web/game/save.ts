import { useSyncExternalStore } from "react";
import { GENERAL } from "./config";
import { playerMaxXP, type RobotSave } from "./engine";
import { ROBOT_MAP, ROBOTS, STARTER_ROBOTS } from "./robots";
import {
  applyMatch,
  claimMission,
  claimReward,
  initialRanked,
  newSeason,
  normalizeRanked,
  type MatchPerf,
  type RankedOpponent,
  type RankedOutcome,
  type RankedState,
} from "./ranked";
import { defaultLoadout, MAX_LOADOUT } from "./skills";
import {
  PET_MAP,
  PET_MAX_LEVEL,
  petUpgradeCost,
  petValue,
  type PetKind,
} from "./pets";
import {
  GADGET_MAP,
  GADGET_MAX_LEVEL,
  GADGET_ROBOT_LEVEL,
  upgradeCost,
} from "./gadgets";
import {
  CARD_MAP,
  MAX_CARDS,
  deckBudget,
  resolveDeck,
  type CardStat,
  type DeckResult,
} from "./cards";

export interface GameState {
  version: number;
  gold: number;
  playerLevel: number;
  playerXP: number;
  robots: RobotSave[];
  team: string[];
  items: Record<string, number>;
  wonTournaments: string[];
  battlesWon: number;
  /** 4 habilidades escolhidas por robô. */
  loadouts: Record<string, string[]>;
  /** nivel do gadget de cada robo (0/ausente = nao comprado). */
  gadgets: Record<string, number>;
  /** nivel de cada pet possuido (0/ausente = nao comprado). */
  pets: Record<string, number>;
  /** pet equipado pela equipe (null = nenhum). */
  activePet: string | null;
  /** ids dos cards possuidos. */
  cards: string[];
  /** ate 3 cards equipados no deck de combate. */
  deck: string[];
  /** robo usado na exploracao do hub (Fase C). null = lider da equipe. */
  explorer: string | null;
  /** progresso do modo ranqueado. */
  ranked: RankedState;
  /** progresso dos modos de jogo. */
  modes: {
    babelFloor: number;
    babelBest: number;
    survivalBest: number;
    quickWins: number;
    bossRushBest: number;
    chaosWins: number;
    gauntletBest: number;
    trialsBest: number;
    raidWins: number;
    nightmareBest: number;
  };
}

const KEY = "campeoes-mecha-save-v1";
const VERSION = 2;

function initialState(): GameState {
  return {
    version: VERSION,
    gold: 500,
    playerLevel: 1,
    playerXP: 0,
    robots: STARTER_ROBOTS.map((id) => ({
      id,
      level: 1,
      xp: 0,
      trained: { str: 0, def: 0, agl: 0 },
    })),
    team: [...STARTER_ROBOTS],
    items: { repair_kit: 2, energy_cell: 1 },
    wonTournaments: [],
    battlesWon: 0,
    loadouts: {},
    gadgets: {},
    pets: {},
    activePet: null,
    cards: [],
    deck: [],
    explorer: null,
    ranked: initialRanked(),
    modes: {
      babelFloor: 1,
      babelBest: 0,
      survivalBest: 0,
      quickWins: 0,
      bossRushBest: 0,
      chaosWins: 0,
      gauntletBest: 0,
      trialsBest: 0,
      raidWins: 0,
      nightmareBest: 0,
    },
  };
}

function read(): GameState {
  if (typeof localStorage === "undefined") return initialState();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initialState();
    const parsed = JSON.parse(raw) as GameState;
    if (!parsed.robots?.length) return initialState();
    const base = initialState();
    return {
      ...base,
      ...parsed,
      version: VERSION,
      loadouts: parsed.loadouts ?? {},
      gadgets: parsed.gadgets ?? {},
      pets: parsed.pets ?? {},
      activePet: parsed.activePet ?? null,
      cards: (parsed.cards ?? []).filter((id) => Boolean(CARD_MAP[id])),
      deck: (parsed.deck ?? []).filter((id) => Boolean(CARD_MAP[id])).slice(0, MAX_CARDS),
      explorer:
        parsed.explorer && (parsed.robots ?? []).some((r) => r.id === parsed.explorer)
          ? parsed.explorer
          : null,
      // migração v1 -> v2: saves antigos não tinham modo ranqueado
      ranked: normalizeRanked(parsed.ranked),
      modes: { ...base.modes, ...(parsed.modes ?? {}) },
    };
  } catch {
    return initialState();
  }
}

let state: GameState = read();
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* modo privado — segue só em memória */
  }
}

export function getState(): GameState {
  return state;
}

export function setState(updater: (s: GameState) => GameState) {
  state = updater(state);
  persist();
  emit();
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useGame(): GameState {
  return useSyncExternalStore(subscribe, getState, getState);
}

// ------------------------------------------------------------------ ações
export function resetGame() {
  state = initialState();
  persist();
  emit();
}

export function addGold(amount: number) {
  setState((s) => ({ ...s, gold: Math.max(0, s.gold + amount) }));
}

export function addPlayerXP(amount: number) {
  setState((s) => {
    let level = s.playerLevel;
    let xp = s.playerXP + amount;
    while (level < GENERAL.max_level && xp >= playerMaxXP(level)) {
      xp -= playerMaxXP(level);
      level += 1;
    }
    return { ...s, playerLevel: level, playerXP: xp };
  });
}

export function unlockRobot(id: string): boolean {
  if (state.robots.some((r) => r.id === id)) return false;
  const avgLevel = Math.max(
    1,
    Math.round(state.robots.reduce((a, r) => a + r.level, 0) / state.robots.length) - 1,
  );
  setState((s) => ({
    ...s,
    robots: [...s.robots, { id, level: avgLevel, xp: 0, trained: { str: 0, def: 0, agl: 0 } }],
  }));
  return true;
}

export function lockedRobotIds(): string[] {
  const owned = new Set(state.robots.map((r) => r.id));
  return ROBOTS.filter((r) => !owned.has(r.id)).map((r) => r.id);
}

export function addItem(id: string, qty: number) {
  setState((s) => ({ ...s, items: { ...s.items, [id]: (s.items[id] ?? 0) + qty } }));
}

export function spendItem(id: string, qty = 1) {
  setState((s) => ({
    ...s,
    items: { ...s.items, [id]: Math.max(0, (s.items[id] ?? 0) - qty) },
  }));
}

/** robo que o jogador controla no hub (Fase C). */
export function explorerId(s: GameState = state): string {
  if (s.explorer && s.robots.some((r) => r.id === s.explorer)) return s.explorer;
  return s.team[0] ?? s.robots[0]?.id ?? "";
}

export function setExplorer(id: string) {
  setState((s) => (s.robots.some((r) => r.id === id) ? { ...s, explorer: id } : s));
}

export function setTeam(team: string[]) {
  setState((s) => ({ ...s, team: team.slice(0, 4) }));
}

export function updateRobots(robots: RobotSave[]) {
  setState((s) => ({ ...s, robots }));
}

export function markTournamentWon(id: string) {
  setState((s) => ({
    ...s,
    wonTournaments: s.wonTournaments.includes(id) ? s.wonTournaments : [...s.wonTournaments, id],
  }));
}

export function incBattlesWon() {
  setState((s) => ({ ...s, battlesWon: s.battlesWon + 1 }));
}

export function teamSaves(s: GameState): RobotSave[] {
  return s.team
    .map((id) => s.robots.find((r) => r.id === id))
    .filter((r): r is RobotSave => Boolean(r))
    .map((r) => ({ ...r, loadout: loadoutOf(s, r.id), gadgetLevel: s.gadgets[r.id] ?? 0 }));
}

// ------------------------------------------------------------- loadouts
export function loadoutOf(s: GameState, robotId: string): string[] {
  const def = ROBOT_MAP[robotId];
  if (!def) return [];
  const valid = new Set(def.skills.map((k) => k.id));
  const saved = [...new Set((s.loadouts[robotId] ?? []).filter((id) => valid.has(id)))].slice(
    0,
    MAX_LOADOUT,
  );
  if (saved.length === MAX_LOADOUT) return saved;
  // kit incompleto: completa com o padrão mantendo a ordem escolhida
  const fill = defaultLoadout(def.skills).filter((id) => !saved.includes(id));
  return [...saved, ...fill].slice(0, MAX_LOADOUT);
}

export function setLoadout(robotId: string, skillIds: string[]) {
  const def = ROBOT_MAP[robotId];
  const valid = new Set((def?.skills ?? []).map((k) => k.id));
  const clean = [...new Set(skillIds.filter((id) => valid.has(id)))].slice(0, MAX_LOADOUT);
  setState((st) => ({ ...st, loadouts: { ...st.loadouts, [robotId]: clean } }));
}

/** Reseta o kit de um robô para o padrão do chassi. */
export function resetLoadout(robotId: string) {
  const def = ROBOT_MAP[robotId];
  if (!def) return;
  setLoadout(robotId, defaultLoadout(def.skills));
}

// ------------------------------------------------------------- ranqueado
/** Registra o resultado de uma partida ranqueada, paga o ouro e devolve o resumo. */
export function applyRankedMatch(
  win: boolean,
  opp: RankedOpponent,
  perf?: MatchPerf,
): RankedOutcome {
  const outcome = applyMatch(state.ranked, win, opp, perf);
  setState((s) => ({
    ...s,
    ranked: outcome.state,
    gold: Math.max(0, s.gold + outcome.gold),
  }));
  return outcome;
}

/** Coleta a recompensa de ouro de um rank já alcançado. */
export function claimRankReward(rankIndex: number): number {
  const res = claimReward(state.ranked, rankIndex);
  if (res.gold <= 0) return 0;
  setState((s) => ({ ...s, ranked: res.state, gold: s.gold + res.gold }));
  return res.gold;
}

/** Coleta a recompensa de uma missão de temporada concluída. */
export function claimRankedMission(id: string): number {
  const res = claimMission(state.ranked, id);
  if (res.gold <= 0) return 0;
  setState((s) => ({ ...s, ranked: res.state, gold: s.gold + res.gold }));
  return res.gold;
}

/** Encerra a temporada atual e inicia a próxima com reset suave. */
export function startNewSeason() {
  setState((s) => ({ ...s, ranked: newSeason(s.ranked) }));
}

// ------------------------------------------------------------- gadgets
export function gadgetLevelOf(s: GameState, robotId: string): number {
  return s.gadgets[robotId] ?? 0;
}

/** Compra o gadget do robo (nivel 1). Retorna false se nao for possivel. */
export function buyGadget(robotId: string): boolean {
  const def = GADGET_MAP[robotId];
  if (!def) return false;
  const robot = state.robots.find((r) => r.id === robotId);
  if (!robot || robot.level < GADGET_ROBOT_LEVEL) return false;
  if ((state.gadgets[robotId] ?? 0) > 0) return false;
  if (state.gold < def.price) return false;
  setState((s) => ({
    ...s,
    gold: s.gold - def.price,
    gadgets: { ...s.gadgets, [robotId]: 1 },
  }));
  return true;
}

/** Sobe um nivel do gadget. Retorna false se nao for possivel. */
export function upgradeGadget(robotId: string): boolean {
  const def = GADGET_MAP[robotId];
  if (!def) return false;
  const cur = state.gadgets[robotId] ?? 0;
  if (cur <= 0 || cur >= GADGET_MAX_LEVEL) return false;
  const cost = upgradeCost(def, cur);
  if (state.gold < cost) return false;
  setState((s) => ({
    ...s,
    gold: s.gold - cost,
    gadgets: { ...s.gadgets, [robotId]: cur + 1 },
  }));
  return true;
}

export function setModeProgress(patch: Partial<GameState["modes"]>) {
  setState((st) => ({ ...st, modes: { ...st.modes, ...patch } }));
}

// ------------------------------------------------------------- pets
export function petLevelOf(s: GameState, petId: string): number {
  return s.pets[petId] ?? 0;
}

/** Compra o pet (nivel 1). Retorna false se nao for possivel. */
export function buyPet(petId: string): boolean {
  const def = PET_MAP[petId];
  if (!def) return false;
  if ((state.pets[petId] ?? 0) > 0) return false;
  if (state.playerLevel < def.requiredLevel) return false;
  if (state.gold < def.price) return false;
  setState((s) => ({
    ...s,
    gold: s.gold - def.price,
    pets: { ...s.pets, [petId]: 1 },
    activePet: s.activePet ?? petId,
  }));
  return true;
}

/** Sobe um nivel do pet. Retorna false se nao for possivel. */
export function upgradePet(petId: string): boolean {
  const def = PET_MAP[petId];
  if (!def) return false;
  const cur = state.pets[petId] ?? 0;
  if (cur <= 0 || cur >= PET_MAX_LEVEL) return false;
  const cost = petUpgradeCost(def, cur);
  if (state.gold < cost) return false;
  setState((s) => ({
    ...s,
    gold: s.gold - cost,
    pets: { ...s.pets, [petId]: cur + 1 },
  }));
  return true;
}

/** Bonus percentual do pet ativo para o tipo informado (0 quando nao aplicavel). */
export function activePetBonus(kind: PetKind): number {
  const id = state.activePet;
  if (!id) return 0;
  const def = PET_MAP[id];
  if (!def || def.kind !== kind) return 0;
  const lvl = state.pets[id] ?? 0;
  if (lvl <= 0) return 0;
  return petValue(def, lvl);
}

/** Aplica os bonus de ouro (scavenger) e XP (mentor) do pet ativo. */
export function applyPetRewards(r: { gold: number; xp: number }): {
  gold: number;
  xp: number;
} {
  const g = activePetBonus("scavenger");
  const x = activePetBonus("mentor");
  return {
    gold: Math.round(r.gold * (1 + g / 100)),
    xp: Math.round(r.xp * (1 + x / 100)),
  };
}

/** Equipa (ou desequipa, com null) o pet ativo da equipe. */
export function setActivePet(petId: string | null) {
  if (petId && (state.pets[petId] ?? 0) <= 0) return;
  setState((s) => ({ ...s, activePet: petId }));
}

// ------------------------------------------------------------- cards
export function ownsCard(s: GameState, cardId: string): boolean {
  return s.cards.includes(cardId);
}

/** Compra um card. Retorna false quando nao for possivel. */
export function buyCard(cardId: string): boolean {
  const def = CARD_MAP[cardId];
  if (!def) return false;
  if (state.cards.includes(cardId)) return false;
  if (state.playerLevel < def.requiredLevel) return false;
  if (state.gold < def.price) return false;
  setState((s) => ({
    ...s,
    gold: s.gold - def.price,
    cards: [...s.cards, cardId],
  }));
  return true;
}

/** Equipa ou desequipa um card, respeitando slots e orcamento de energia. */
export function toggleCard(cardId: string): boolean {
  const def = CARD_MAP[cardId];
  if (!def) return false;
  if (state.deck.includes(cardId)) {
    setState((s) => ({ ...s, deck: s.deck.filter((id) => id !== cardId) }));
    return true;
  }
  if (!state.cards.includes(cardId)) return false;
  if (state.deck.length >= MAX_CARDS) return false;
  const cost = resolveDeck(state.deck).cost + def.cost;
  if (cost > deckBudget(state.playerLevel)) return false;
  setState((s) => ({ ...s, deck: [...s.deck, cardId] }));
  return true;
}

export function clearDeck() {
  setState((s) => ({ ...s, deck: [] }));
}

/** Deck resolvido do jogador (cards + sinergias ativas). */
export function playerDeck(s: GameState = state): DeckResult {
  return resolveDeck(s.deck);
}

/** Modificador do deck do jogador para um atributo. */
export function deckBonus(stat: CardStat): number {
  return playerDeck().mods[stat] ?? 0;
}
