# CAMPEÕES MECHA — Design

Jogo de batalha por turnos (RPG tático 1v1 com equipe de 4 robôs), web mobile-first, 100% pixel art
gerada por IA. Mecânicas replicadas de "Ben 10 Campeões Galácticos" (fórmulas de dano, evasão,
crítico, XP, treino e torneios extraídas do SWF original), com 20 robôs originais estilo anime.

## Direção de arte

- **Tudo é pixel art gerada por IA**: robôs (16 frames cada), botões, painéis, ícones, barras,
  molduras, VFX, logo, fundo do menu, arenas (4 frames a 4fps).
- Nenhum ícone vetorial/lucide, nenhuma borda CSS "moderna": bordas vêm de `border-image` sobre os
  PNGs de painel/botão.
- `image-rendering: pixelated` global; escalas em múltiplos inteiros quando possível.
- Animação em **4 fps** (arenas e sprites idle), 8 fps em ações rápidas (ataque/dano).

## Paleta (derivada dos assets)

| Token | Hex | Uso |
|---|---|---|
| bg | #070b14 | fundo geral |
| bg-2 | #0e1524 | superfícies |
| panel | #1b3a5c | interior de painel |
| accent | #35e2f0 | ciano tech (destaque, MP) |
| accent-2 | #ffb43a | âmbar (XP, ouro) |
| hp | #e2453a | vida |
| ok | #57d76a | confirmar |
| text | #e8f4ff | texto |
| muted | #7d94ad | texto secundário |

## Tipografia

- Títulos/HUD: `Press Start 2P` (`/fonts/press-start-2p.woff2`).
- Corpo/números: `Silkscreen` (`/fonts/silkscreen.woff2`).
- Sem antialias suave: `letter-spacing` mínimo 0.02em, tamanhos 8/10/12/16px.

## Telas

1. **Splash/Menu** — logo pixel, fundo `bg_menu`, botões: Jogar, Equipe, Treino, Torneios, Loja.
2. **Coleção/Equipe** — grid de robôs desbloqueados, moldura bronze/prata/ouro por raridade,
   escolha de 4 para a equipe.
3. **Robô (detalhe)** — retrato + strip animado, atributos (HP/MP/STR/DEF/AGL), skills, XP.
4. **Treino** — gastar ouro para subir STR/DEF/AGL até `maxTrained` do nível.
5. **Loja** — itens de batalha (reparo, energia, revive, buffs) e cápsulas de robô.
6. **Torneios** — 5 torneios (dojo, vulcão, orbital, congelada, céu), chave de lutas sequenciais.
7. **Batalha** — arena animada 4fps, HUD com barras HP/MP, menu Atacar/Defender/Item/Trocar,
   VFX por skill, entrada/saída de robô, log de turno.
8. **Resultado** — vitória/derrota, ouro/XP, level up, recompensas (robô/item/medalha).

## Fluxo

Menu → Torneio → seleção de equipe (4) → batalha em série (n lutas) → recompensa → volta ao mapa.
Progresso salvo em `localStorage` (offline total, nenhuma chamada de rede necessária).
