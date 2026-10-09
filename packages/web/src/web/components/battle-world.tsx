import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { Side } from "@/game/battle";
import "./battle-world.css";

export interface BattleShot { side: Side; kind: "action" | "impact" | "entry" | "power" }

/** Only the world moves. Controls, reports and event text stay anchored. */
export function BattleWorld({ shot, enabled, children }: {
  shot: BattleShot | null;
  enabled: boolean;
  children: (size: number, reduced: boolean) => ReactNode;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState({ width: 480, height: 800 });
  const [reduced, setReduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    const update = () => setBounds({ width: el.clientWidth, height: el.clientHeight });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(query.matches);
    query.addEventListener("change", change);
    return () => { observer.disconnect(); query.removeEventListener("change", change); };
  }, []);
  const size = Math.round(Math.min(192, bounds.height * .23, Math.max(112, bounds.width * .16)));
  const focus = enabled && !reduced ? shot : null;
  const zoom = !focus ? 1 : focus.kind === "impact" ? 1.18 : focus.kind === "power" ? 1.48 : focus.kind === "entry" ? 1.25 : 1.38;
  const anchor = bounds.width < 700 ? .2 : .24;
  const subjectX = bounds.width * (focus?.side === "enemy" ? 1 - anchor : anchor);
  const desiredX = bounds.width * (focus?.side === "enemy" ? .59 : .41);
  const subjectY = bounds.height * .58 - size / 2;
  const dx = focus ? desiredX - (bounds.width / 2 + (subjectX - bounds.width / 2) * zoom) : 0;
  const dy = focus ? bounds.height * .43 - (bounds.height / 2 + (subjectY - bounds.height / 2) * zoom) : 0;
  return <div ref={viewport} className="mk-battle-viewport" data-camera={focus?.kind ?? "wide"}>
    <div className="mk-battle-world" style={{ transform: `translate3d(${dx}px,${dy}px,0) scale(${zoom})`,
      "--mk-player-x": `${anchor * 100}%`, "--mk-enemy-x": `${(1 - anchor) * 100}%`,
      "--mk-travel": `${bounds.width * (1 - anchor * 2)}px`,
      "--mk-step": `${Math.min(90, bounds.width * (1 - anchor * 2) * .18)}px` } as CSSProperties}>
      {children(size, reduced || !enabled)}
    </div>
    <div className="mk-battle-depth" aria-hidden />
  </div>;
}