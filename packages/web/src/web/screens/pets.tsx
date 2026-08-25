import { useState } from "react";
import { Frame, Panel, PixelButton } from "@/components/pixel";
import {
  PETS,
  PET_KIND_LABEL,
  PET_MAX_LEVEL,
  petArt,
  petUpgradeCost,
  petValue,
} from "@/game/pets";
import { buyPet, setActivePet, upgradePet, useGame } from "@/game/save";
import { TopBar } from "@/screens/roster";

/** Rancho dos Pets: compra, evolucao e escolha do companheiro da equipe. */
export function PetsScreen({ onBack }: { onBack: () => void }) {
  const g = useGame();
  const [msg, setMsg] = useState("");

  const list = [...PETS].sort((a, b) => {
    const oa = (g.pets[a.id] ?? 0) > 0 ? 0 : 1;
    const ob = (g.pets[b.id] ?? 0) > 0 ? 0 : 1;
    if (oa !== ob) return oa - ob;
    return a.requiredLevel - b.requiredLevel;
  });

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
      <TopBar title="RANCHO DOS PETS" gold={g.gold} onBack={onBack} />
      <div
        className="mk-scroll"
        style={{
          flex: 1,
          padding: 8,
          backgroundImage:
            "linear-gradient(rgba(4,9,18,0.84), rgba(4,9,18,0.95)), url(/ui/bg_heroes.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          imageRendering: "pixelated",
        }}
      >
        <div
          className="mk-title"
          style={{ fontSize: 7, color: "var(--mk-muted)", marginBottom: 6, lineHeight: 1.6 }}
        >
          UM PET ACOMPANHA A EQUIPE INTEIRA · MAX Lv{PET_MAX_LEVEL} · O BONUS VALE EM TODA BATALHA
        </div>
        {msg && (
          <div
            className="mk-title"
            style={{ fontSize: 7, color: "var(--mk-accent)", marginBottom: 6 }}
          >
            {msg}
          </div>
        )}

        <div style={{ display: "grid", gap: 6 }}>
          {list.map((def) => {
            const level = g.pets[def.id] ?? 0;
            const owned = level > 0;
            const active = g.activePet === def.id;
            const locked = g.playerLevel < def.requiredLevel;
            const maxed = level >= PET_MAX_LEVEL;
            const cost = owned ? petUpgradeCost(def, level) : def.price;

            return (
              <Panel
                key={def.id}
                style={{
                  padding: 6,
                  border: active ? "2px solid var(--mk-accent)" : undefined,
                }}
              >
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Frame rarity={def.rarity} size={52}>
                    <img
                      src={petArt(def.id)}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        maxWidth: "none",
                        imageRendering: "pixelated",
                        filter: owned ? undefined : "grayscale(1) brightness(0.45)",
                      }}
                    />
                  </Frame>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="mk-title" style={{ fontSize: 7 }}>
                      {def.name} {active && <span style={{ color: "var(--mk-accent)" }}>· ATIVO</span>}
                    </div>
                    <div
                      className="mk-title"
                      style={{ fontSize: 6, color: "var(--mk-accent2)", marginTop: 2 }}
                    >
                      {PET_KIND_LABEL[def.kind]} · {def.element} · {def.rarity.toUpperCase()}
                      {owned ? ` · Lv${level}` : ` · Lv MIN ${def.requiredLevel}`}
                    </div>
                    <div style={{ fontSize: 9, color: "var(--mk-muted)", marginTop: 3 }}>
                      {owned
                        ? def.desc.replace(String(def.base), String(petValue(def, level)))
                        : def.desc}
                    </div>
                    <div style={{ fontSize: 9, color: "rgba(150,170,195,0.7)", marginTop: 2 }}>
                      {def.flavor}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 6,
                    marginTop: 6,
                  }}
                >
                  <PixelButton
                    disabled={locked || (owned && maxed) || g.gold < cost}
                    onClick={() => {
                      const ok = owned ? upgradePet(def.id) : buyPet(def.id);
                      setMsg(
                        ok
                          ? owned
                            ? `${def.name} evoluiu para Lv${level + 1}.`
                            : `${def.name} entrou no rancho!`
                          : "Ouro insuficiente ou requisito nao atendido.",
                      );
                    }}
                  >
                    {locked
                      ? `NIVEL ${def.requiredLevel}`
                      : owned
                        ? maxed
                          ? "NIVEL MAXIMO"
                          : `EVOLUIR · ${cost}`
                        : `ADOTAR · ${cost}`}
                  </PixelButton>
                  <PixelButton
                    disabled={!owned}
                    onClick={() => {
                      setActivePet(active ? null : def.id);
                      setMsg(active ? "Pet dispensado." : `${def.name} agora acompanha a equipe.`);
                    }}
                  >
                    {active ? "DISPENSAR" : "LEVAR"}
                  </PixelButton>
                </div>
              </Panel>
            );
          })}
        </div>
        <div style={{ height: 48 }} />
      </div>
    </div>
  );
}
