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

## Sessão pets + modos + mapa (220 robôs)
- [x] Fase 4 PETS: 12 pets com arte processada (public/pets, 192x192), prédio b_pets.png no hub, PetsScreen ligado no game-shell, bônus scavenger(+ouro)/mentor(+XP) aplicados em torneios e modos
- [x] Fase 5 MODOS: 9 modos (novos: GAUNTLET ELEMENTAL, PROVAS DOS ANCIOES, ASSALTO AO NUCLEO, PESADELO) + arte, stages e progresso salvo
- [x] Fase 6 MAPA: 8 regiões/biomas com planos de fundo próprios (nebulosa, metrópole neon, selva, dunas, vulcânica, tundra, abismo, ilhas celestes) + rótulo de setor
- [x] typecheck verde, build verde, E2E sem erros de console e sem imagens quebradas
- [x] mobile Expo WebView rodando (porta 4300), web na 4200

## Fase A — Sistema de Cards (concluída)
- [x] game/cards.ts: 30 cards (4 raridades, 10 tags), custo de energia, orçamento por nível (6→12), 22 sinergias/combos, decks de IA determinísticos por robô/nível
- [x] screens/cards.tsx: SALAO DE CARDS com deck de 3 slots, medidor de energia, sinergias ativas, "A 1 CARD DE:", abas DECK/MEUS/LOJA/TODOS, modal de detalhe
- [x] 30 artes de card por IA processadas (128x128, 48 cores) em public/cards + prédio public/city/b_cards.png (hub estendido para 4300px)
- [x] save.ts: cards/deck persistidos + buyCard/toggleCard/clearDeck/deckBonus
- [x] battle.ts: 19 stats de card aplicados em combate (aegis, evade, crit, amp, opening, rage, lifesteal, thorns, venom, resist, regen, mpregen...) para jogador E inimigos
- [x] typecheck verde, build verde (EXIT=0)
- [x] E2E (assets/e2e_cards2.py): deck 3 cards CHAMA → sinergias COMBUSTAO EM CADEIA + INFERNO TOTAL ativas, PODER +72% / FORCA +39% / FURIA +28%, remover/persistir OK, 0 erros de console, 0 imagens quebradas
- Próxima: Fase B (parallax do hub em camadas geradas por IA)
