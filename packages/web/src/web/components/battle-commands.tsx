import { useRef, useState } from "react";
import type { KitSkill } from "@/game/kits";
import type { CombatAction, Fighter, Forecast } from "@/game/battle";
import { skillUnavailable } from "@/game/combat";
import { faceUrl } from "@/game/robots";
import { useDialogFocus } from "./dialog-focus";
import "./battle-commands.css";

const assets=["attack","defense","items","ultimate","fist","blades","missiles","vortex","shield","repair"];
export function preloadCommandArt():void {for(const name of assets){const im=new Image();im.src=`/overhaul/${name}.webp`;}}
function skillSymbol(s:KitSkill,index:number):string {
 if(s.kind==="defense")return s.defense?.kind==="repair"||s.defense?.kind==="overcharge"?"repair":"shield";
 const tags=s.tags??[];
 if(tags.includes("corte"))return "blades";
 if(tags.includes("projetil")||tags.includes("explosao"))return "missiles";
 if(tags.includes("area"))return "vortex";
 return ["fist","blades","missiles","vortex"][index%4];
}
export function BattleCommands({fighter,skills,ultimate,onAction,onMenu,onSelect,forecast,competitive=false}:{
 fighter:Fighter;skills:KitSkill[];ultimate:KitSkill;
 competitive?:boolean;
 onAction:(action:CombatAction)=>void;onMenu:(menu:"items"|"swap"|"extra")=>void;
 onSelect:(id:string)=>void;forecast:(id:string)=>Forecast|null;
}) {
 const [info,setInfo]=useState<KitSkill|null>(null);
 const infoRef=useRef<HTMLDivElement>(null);
 useDialogFocus(infoRef,!!info,()=>setInfo(null));
 const resourceCost=(s:KitSkill)=>fighter.resId?s.cost?.[fighter.resId]??0:0;
 const ready=fighter.ultimateCharge>=100;
 const group=(kind:"attack"|"defense")=><section className={`mc-command-group mc-command-${kind}`} aria-label={kind==="attack"?"Ataques":"Defesas"}>
  <header><span>{kind==="attack"?"01 / SISTEMA OFENSIVO":"02 / SISTEMA DEFENSIVO"}</span><small>{kind==="attack"?"ESCOLHA O GOLPE":"PROTEÇÃO & REPARO"}</small></header>
  <div className="mc-skill-strip">{skills.filter(s=>s.kind===kind).map((s,i)=>{
   const blocked=skillUnavailable(fighter,s);const cost=resourceCost(s);
   return <div key={s.id} className="mc-skill">
    <button className="mc-skill-action" disabled={!!blocked} onFocus={()=>onSelect(s.id)} onPointerEnter={()=>onSelect(s.id)} onClick={()=>onAction({kind:"skill",skillId:s.id})} aria-label={`${s.name}, ${s.mp} MP, ${cost} recurso${blocked?`, ${blocked}`:""}`} title={blocked||s.desc}>
     <span className="mc-skill-index">{String(i+1).padStart(2,"0")}</span>
     <img src={`/overhaul/${skillSymbol(s,i)}.webp`} alt=""/>
     <span className="mc-skill-copy"><strong>{s.name}</strong><small>{blocked||`${s.mp===0?"SEM MP":`${s.mp} MP`}${cost?` · ${cost} ${fighter.resId?.toUpperCase()}`:""}${s.charge?` · CARGA ${s.charge}T`:""}`}</small></span>
    </button>
    <button className="mc-info" onClick={()=>setInfo(s)} aria-label={`Informações de ${s.name}`}>i</button>
   </div>;
  })}</div>
 </section>;
 const fc=info&&info.id!==ultimate.id?forecast(info.id):null;
 return <div className="mc-commands" key={fighter.uid}>
  <div className="mc-command-heading"><span>COMANDO DE COMBATE</span><small>SUA VEZ · {fighter.name}</small></div>
  {fighter.charged&&<button className="mk-btn mc-release" onClick={()=>onAction({kind:"pass"})}>{fighter.chargeTurns>0?`MANTER PREPARAÇÃO · ${fighter.chargeTurns} TURNO(S)` : "LIBERAR GOLPE CARREGADO"}</button>}
  <div className="mc-command-layout"><div className="mc-normal-commands">{group("attack")}{group("defense")}</div>
   <section className={`mc-finisher ${ready?"mc-ultimate-ready":""}`} aria-label="Ultimate individual">
    <div className="mc-finisher-portrait"><img src={faceUrl(fighter.robotId)} alt=""/><span>EXCLUSIVO</span></div>
    <button className="mc-finisher-action" disabled={!ready||!!fighter.charged} onClick={()=>onAction({kind:"ultimate"})} aria-label={`Ultimate ${ultimate.name}, ${fighter.ultimateCharge}%`}>
     <small>ULTIMATE / LIMIT RELEASE</small><strong>{ultimate.name}</strong><span>{ready?"LIBERAR PODER":"CARREGANDO"} <b>{fighter.ultimateCharge}%</b></span>
    </button>
    <div className="mc-charge-track"><span style={{width:`${fighter.ultimateCharge}%`}}/></div>
    <div className="mc-finisher-note"><small>{ready?"100% · SEM MP":"Ataque +18 · Defesa +14 · Dano +4–16"}</small><button className="mc-info" onClick={()=>setInfo(ultimate)} aria-label="Informações do ultimate">i</button></div>
   </section>
  </div>
  <nav className="mc-utility" aria-label="Suporte e táticas">{!competitive&&<button onClick={()=>onMenu("items")}><img src="/ui/icon_battery.png" alt=""/>SUPRIMENTOS</button>}<button onClick={()=>onMenu("swap")}><img src="/ui/icon_gear.png" alt=""/>TROCAR ROBÔ</button><button onClick={()=>onMenu("extra")}>TÁTICAS</button></nav>
  {info&&<div className="mc-skill-dossier" role="dialog" aria-modal="true" aria-label={info.name} ref={infoRef} tabIndex={-1}>
   <button className="mc-close" onClick={()=>setInfo(null)}>FECHAR ×</button><h3>{info.name}</h3><p>{info.desc}</p>
   <p>{info.id===ultimate.id?"100% de carga · SEM MP · exclusivo deste robô":`${info.mp} MP · Poder ${info.power} · ${resourceCost(info)} recurso do chassi`}</p>
   {info.charge&&<p>Preparação: {info.charge} turno(s) antes de liberar o golpe.</p>}
   {(info.hits??1)>1&&<p>{info.hits} impactos · a carga de ação é concedida uma vez.</p>}
   {fc&&<p>Previsão: {fc.min}–{fc.max} · {fc.tier}</p>}
   <small>A informação não consome turno. Recursos e efeitos do chassi ainda se aplicam aos golpes normais.</small>
  </div>}
 </div>;
}