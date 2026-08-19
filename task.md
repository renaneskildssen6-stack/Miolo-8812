# CAMPEOES MECHA — progresso

## Feito
- Assets pixel art IA processados em packages/web/public: robots (20 strips 16f + faces), ui (47), vfx (8), arenas (20 frames), mp4 4fps em assets/
- design.md preenchido
- game/config.ts, game/robots.ts (20 robos + skills), game/engine.ts (formulas originais), game/battle.ts (state machine + IA), game/tournaments.ts (5 copas), game/save.ts (store localStorage)
- styles.css: fontes pixel, paleta, border-image de paineis/botoes, animacoes

## Fazendo
- components/pixel.tsx (Sprite animado, Panel, Button, Bar, Icon)
- screens: menu, roster/detail, train, shop, tournaments, battle, result
- pages/index.tsx (router de telas)

## Depois
- bun run lint / typecheck / build; dev server; deliver website
- oferecer build mobile (Expo)

## Sessão final (balanceamento + polish)
- Fix sprite: maxWidth none (RobotSprite/VfxSprite) — OK
- Menu: padding inferior 34px pro badge
- Batalha: HUD de torneio movido pra top 96 (não cobre mais os HUDs)
- Report do torneio: fundo pixel art bg_menu com gradiente
- XP creditado luta por luta (não só no fim do torneio)
- fightReward xp: /7+1 -> /3+2 ; replay bonus xp /3 -> /1.6
- requiredLevel dos 5 torneios: 1/6/12/20/30; níveis dos inimigos reescalados por luta (base=req+índice, boss +1)
- Simulação /tmp/sim2.ts: progressão completa 1->5 torneios sem travar (grind razoável)
- E2E Playwright: 0 erros de console em menu/roster/treino/loja/batalha/report
- Limitação: bun run lint bloqueado (template packages/mobile/app/_layout.tsx + panic do oxlint no sandbox)

## Sessão 120 robôs / 105 torneios
- [x] 100 sprite sheets gerados (ids 21-120) + processados (240 arquivos em public/robots, manifest 120)
- [x] 100 blueprints injetados em game/robots.ts (assets/gen_blueprints.py)
- [x] 100 torneios em game/tournaments_extra.ts (assets/gen_tournaments.py) + campos element/station/x/y e MAP_WIDTH/HEIGHT em tournaments.ts
- [ ] assets do mapa espacial (fundo + estações)
- [ ] redesign screens/tournaments.tsx (mapa com pan/zoom, filtros por elemento)
- [ ] mobile Expo WebView
- [ ] typecheck/build/E2E/deliver
