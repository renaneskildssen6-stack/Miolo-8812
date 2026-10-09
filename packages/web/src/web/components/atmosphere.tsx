import { useEffect, useState } from "react";
import { worldEffectFor } from "@/game/anim";

/** Partículas do clima e vinheta de perigo, sobre a arena e abaixo do HUD. */
export function Atmosphere({ arena, weather, danger }: { arena: string; weather: string; danger: number }) {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setFrame((f) => (f + 1) % 4), 250);
    return () => window.clearInterval(id);
  }, []);
  const effect = worldEffectFor(arena, weather);
  return <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}>
    <div style={{ position: "absolute", inset: 0, opacity: 0.2, mixBlendMode: "screen", backgroundImage: `url(/vfx/wld_${effect}.png)`, backgroundSize: "400% 100%", backgroundPosition: `${frame / 3 * 100}% 0`, imageRendering: "pixelated" }} />
    <div className={danger < 0.25 ? "mk-danger" : undefined} style={{ position: "absolute", inset: 0, boxShadow: `inset 0 0 ${danger < 0.25 ? 100 : 55}px ${danger < 0.25 ? "rgba(226,69,58,0.65)" : "rgba(0,0,0,0.35)"}` }} />
  </div>;
}
