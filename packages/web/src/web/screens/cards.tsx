import { useMemo, useState } from "react";
import { Panel, PixelButton } from "@/components/pixel";
import {
  CARDS,
  CARD_RARITY_COLOR,
  CARD_STAT_LABEL,
  CARD_TAG_LABEL,
  MAX_CARDS,
  cardArt,
  deckBudget,
  nearSynergies,
  resolveDeck,
  type CardDef,
  type CardStat,
} from "@/game/cards";
import { buyCard, clearDeck, toggleCard, useGame } from "@/game/save";
import { TopBar } from "@/screens/roster";

type Tab = "todos" | "deck" | "meus" | "loja";

const TABS: { id: Tab; label: string }[] = [
  { id: "deck", label: "DECK" },
  { id: "meus", label: "MEUS" },
  { id: "loja", label: "LOJA" },
  { id: "todos", label: "TODOS" },
];

function modLine(stat: CardStat, value: number): string {
  const sign = value >= 0 ? "+" : "";
  const suffix = stat === "mpregen" ? "" : "%";
  return `${CARD_STAT_LABEL[stat]} ${sign}${value}${suffix}`;
}

/** Salao de Cards: colecao, compra, deck de 3 slots e sinergias ativas. */
export function CardsScreen({ onBack }: { onBack: () => void }) {
  const g = useGame();
  const [tab, setTab] = useState<Tab>("deck");
  const [msg, setMsg] = useState("");
  const [detail, setDetail] = useState<CardDef | null>(null);

  const deck = useMemo(() => resolveDeck(g.deck), [g.deck]);
  const near = useMemo(() => nearSynergies(g.deck), [g.deck]);
  const budget = deckBudget(g.playerLevel);
  const owned = new Set(g.cards);

  const list = CARDS.filter((c) => {
    if (tab === "deck") return g.deck.includes(c.id);
    if (tab === "meus") return owned.has(c.id);
    if (tab === "loja") return !owned.has(c.id);
    return true;
  }).sort((a, b) => a.requiredLevel - b.requiredLevel || a.cost - b.cost);

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
      <TopBar title="SALAO DE CARDS" gold={g.gold} onBack={onBack} />

      {/* faixa do deck */}
      <div
        style={{
          padding: "6px 8px",
          background: "rgba(6,12,22,0.95)",
          borderBottom: "2px solid rgba(53,226,240,0.3)",
        }}
      >
        <div
          className="mk-title"
          style={{ fontSize: 7, display: "flex", justifyContent: "space-between" }}
        >
          <span>DECK {g.deck.length}/{MAX_CARDS}</span>
          <span style={{ color: deck.cost > budget ? "#ff6b6b" : "var(--mk-accent2)" }}>
            ENERGIA {deck.cost}/{budget}
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 5, marginTop: 5 }}>
          {Array.from({ length: MAX_CARDS }).map((_, i) => {
            const id = g.deck[i];
            const def = id ? CARDS.find((c) => c.id === id) : undefined;
            return (
              <button
                key={`slot${i}`}
                type="button"
                onClick={() => def && toggleCard(def.id)}
                style={{
                  aspectRatio: "3 / 4",
                  background: "rgba(4,10,20,0.9)",
                  border: `2px solid ${def ? CARD_RARITY_COLOR[def.rarity] : "rgba(90,110,140,0.5)"}`,
                  padding: 2,
                  display: "grid",
                  placeItems: "center",
                  cursor: def ? "pointer" : "default",
                  overflow: "hidden",
                }}
              >
                {def ? (
                  <img
                    src={cardArt(def.id)}
                    alt={def.name}
                    style={{
                      width: "100%",
                      maxWidth: "none",
                      imageRendering: "pixelated",
                    }}
                  />
                ) : (
                  <span className="mk-title" style={{ fontSize: 6, color: "var(--mk-muted)" }}>
                    VAZIO
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {deck.synergies.length > 0 && (
          <div style={{ marginTop: 5, display: "grid", gap: 3 }}>
            {deck.synergies.map((s) => (
              <div
                key={s.id}
                className="mk-title"
                style={{
                  fontSize: 6,
                  color: "#7cffb2",
                  background: "rgba(20,60,40,0.55)",
                  border: "1px solid rgba(124,255,178,0.4)",
                  padding: "3px 4px",
                }}
              >
                ★ {s.name} — {s.desc}
              </div>
            ))}
          </div>
        )}
        {near.length > 0 && (
          <div
            className="mk-title"
            style={{ fontSize: 6, color: "var(--mk-muted)", marginTop: 4 }}
          >
            A 1 CARD DE: {near.slice(0, 2).map((s) => s.name).join(" · ")}
          </div>
        )}
        {Object.keys(deck.mods).length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              marginTop: 4,
            }}
          >
            {(Object.entries(deck.mods) as [CardStat, number][]).map(([k, v]) => (
              <span
                key={k}
                className="mk-title"
                style={{
                  fontSize: 6,
                  padding: "2px 4px",
                  border: "1px solid rgba(53,226,240,0.4)",
                  color: v >= 0 ? "var(--mk-accent)" : "#ff8a8a",
                }}
              >
                {modLine(k, v)}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* abas */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${TABS.length}, 1fr)`,
          gap: 4,
          padding: "5px 8px",
          background: "rgba(4,10,20,0.9)",
        }}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className="mk-title"
            onClick={() => setTab(t.id)}
            style={{
              fontSize: 6,
              padding: "5px 2px",
              background: tab === t.id ? "rgba(53,226,240,0.22)" : "rgba(10,18,32,0.9)",
              border: `2px solid ${tab === t.id ? "var(--mk-accent)" : "rgba(80,100,130,0.45)"}`,
              color: tab === t.id ? "var(--mk-accent)" : "var(--mk-muted)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {msg && (
        <div
          className="mk-title"
          style={{ fontSize: 7, color: "var(--mk-accent)", padding: "4px 8px" }}
        >
          {msg}
        </div>
      )}

      <div
        className="mk-scroll"
        style={{
          flex: 1,
          padding: 8,
          backgroundImage:
            "linear-gradient(rgba(4,9,18,0.86), rgba(4,9,18,0.96)), url(/ui/bg_heroes.png)",
          backgroundSize: "cover",
          imageRendering: "pixelated",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {list.map((def) => {
            const has = owned.has(def.id);
            const equipped = g.deck.includes(def.id);
            const locked = g.playerLevel < def.requiredLevel;
            return (
              <button
                key={def.id}
                type="button"
                onClick={() => setDetail(def)}
                style={{
                  background: "rgba(6,13,24,0.92)",
                  border: `2px solid ${equipped ? "var(--mk-accent)" : CARD_RARITY_COLOR[def.rarity]}`,
                  padding: 4,
                  textAlign: "left",
                  display: "grid",
                  gap: 3,
                }}
              >
                <div style={{ position: "relative" }}>
                  <img
                    src={cardArt(def.id)}
                    alt={def.name}
                    style={{
                      width: "100%",
                      maxWidth: "none",
                      imageRendering: "pixelated",
                      filter: has ? undefined : "grayscale(1) brightness(0.5)",
                    }}
                  />
                  <span
                    className="mk-title"
                    style={{
                      position: "absolute",
                      top: 2,
                      right: 2,
                      fontSize: 6,
                      padding: "2px 3px",
                      background: "rgba(2,6,12,0.85)",
                      color: "var(--mk-accent2)",
                      border: "1px solid rgba(53,226,240,0.5)",
                    }}
                  >
                    {def.cost}
                  </span>
                  {equipped && (
                    <span
                      className="mk-title"
                      style={{
                        position: "absolute",
                        bottom: 2,
                        left: 2,
                        fontSize: 6,
                        padding: "2px 3px",
                        background: "rgba(53,226,240,0.85)",
                        color: "#04121c",
                      }}
                    >
                      NO DECK
                    </span>
                  )}
                </div>
                <div
                  className="mk-title"
                  style={{ fontSize: 6, color: CARD_RARITY_COLOR[def.rarity] }}
                >
                  {def.name}
                </div>
                <div style={{ fontSize: 8, color: "var(--mk-muted)", lineHeight: 1.35 }}>
                  {def.desc}
                </div>
                <div className="mk-title" style={{ fontSize: 5, color: "rgba(150,170,195,0.75)" }}>
                  {def.tags.map((t) => CARD_TAG_LABEL[t]).join(" · ")}
                </div>
                <div className="mk-title" style={{ fontSize: 6, color: "var(--mk-accent2)" }}>
                  {has ? (equipped ? "EQUIPADO" : "NA COLECAO") : locked ? `Lv ${def.requiredLevel}` : `${def.price} G`}
                </div>
              </button>
            );
          })}
        </div>
        {list.length === 0 && (
          <div
            className="mk-title"
            style={{ fontSize: 7, color: "var(--mk-muted)", textAlign: "center", marginTop: 24 }}
          >
            NENHUM CARD AQUI AINDA
          </div>
        )}
        <div style={{ marginTop: 8 }}>
          <PixelButton disabled={g.deck.length === 0} onClick={() => { clearDeck(); setMsg("Deck esvaziado."); }}>
            LIMPAR DECK
          </PixelButton>
        </div>
        <div style={{ height: 40 }} />
      </div>

      {detail && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(2,6,12,0.85)",
            display: "grid",
            placeItems: "center",
            padding: 12,
            zIndex: 5,
          }}
          onClick={() => setDetail(null)}
        >
          <Panel
            style={{
              padding: 8,
              width: "100%",
              maxWidth: 320,
              border: `2px solid ${CARD_RARITY_COLOR[detail.rarity]}`,
            }}
          >
            <div style={{ display: "flex", gap: 8 }}>
              <img
                src={cardArt(detail.id)}
                alt=""
                width={96}
                style={{ imageRendering: "pixelated", maxWidth: "none" }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="mk-title" style={{ fontSize: 7, color: CARD_RARITY_COLOR[detail.rarity] }}>
                  {detail.name}
                </div>
                <div className="mk-title" style={{ fontSize: 6, color: "var(--mk-accent2)", marginTop: 3 }}>
                  {detail.rarity.toUpperCase()} · {detail.element} · ENERGIA {detail.cost}
                </div>
                <div style={{ fontSize: 9, color: "var(--mk-muted)", marginTop: 4 }}>{detail.desc}</div>
                <div style={{ fontSize: 9, color: "rgba(150,170,195,0.7)", marginTop: 3 }}>
                  {detail.flavor}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: 6 }}>
              {(Object.entries(detail.mods) as [CardStat, number][]).map(([k, v]) => (
                <span
                  key={k}
                  className="mk-title"
                  style={{
                    fontSize: 6,
                    padding: "2px 4px",
                    border: "1px solid rgba(53,226,240,0.4)",
                    color: v >= 0 ? "var(--mk-accent)" : "#ff8a8a",
                  }}
                >
                  {modLine(k, v)}
                </span>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 8 }}>
              <PixelButton
                disabled={owned.has(detail.id) || g.playerLevel < detail.requiredLevel || g.gold < detail.price}
                onClick={() => {
                  const ok = buyCard(detail.id);
                  setMsg(ok ? `${detail.name} adquirido!` : "Ouro insuficiente ou nivel baixo.");
                }}
              >
                {owned.has(detail.id)
                  ? "JA POSSUI"
                  : g.playerLevel < detail.requiredLevel
                    ? `NIVEL ${detail.requiredLevel}`
                    : `COMPRAR · ${detail.price}`}
              </PixelButton>
              <PixelButton
                disabled={!owned.has(detail.id)}
                onClick={() => {
                  const ok = toggleCard(detail.id);
                  setMsg(
                    ok
                      ? g.deck.includes(detail.id)
                        ? `${detail.name} removido do deck.`
                        : `${detail.name} equipado.`
                      : "Sem slot ou energia suficiente.",
                  );
                }}
              >
                {g.deck.includes(detail.id) ? "REMOVER" : "EQUIPAR"}
              </PixelButton>
            </div>
            <div style={{ marginTop: 6 }}>
              <PixelButton onClick={() => setDetail(null)}>FECHAR</PixelButton>
            </div>
          </Panel>
        </div>
      )}
    </div>
  );
}
