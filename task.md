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

## Fase B — Parallax do hub (concluída)
- [x] 6 artes de camada por IA processadas em public/city: pl_sky (960x540), pl_mountains, pl_skyline, pl_mid, pl_fg + 6 props (lamp, sign, crates, vending, antenna, trash)
- [x] hub-city.tsx: 7 camadas independentes com speed/scale/anchor/alpha próprios (0.04 → 1.25), tiling infinito com módulo corrigido para offsets negativos
- [x] camada de primeiro plano (pl_fg) desenhada na frente do robô, ajustada para faixa baixa (scale 0.15, anchor -4) para não cobrir o jogador
- [x] ~30 decorações espalhadas pelo mundo com RNG determinístico (seed 20260831), 45% no plano de fundo (speed 0.88, brilho 0.7) e o resto no plano do jogador
- [x] typecheck verde, build verde (EXIT=0), E2E do hub sem erros de console e sem requisições falhas; screenshots conferidos em 3 pontos do mundo
- Próxima: Fase C (exploração com sprites animados por ação e todos os robôs jogáveis)

## Fase C — Exploração com sprites por ação (concluída)
- [x] game/hero.ts: leitura da tira 2048x128 (16 quadros de 128px) de QUALQUER robô — quadros 0-3 ocioso, 4-7 ataque, 8-11 dano, 12-15 teleporte
- [x] 9 clipes de exploração (idle, walk, run, jump, fall, land, attack, interact, hurt) com fps, loop, bob, tilt e escala próprios
- [x] hub-city.tsx: máquina de estados de animação ligada à física (subida x queda separadas, pousada com squash, rastro de partículas ao correr, sombra que encolhe no ar)
- [x] TODOS os 220 robôs jogáveis no hub — seletor "TROCAR" com retrato 64x64, nome e nível de cada robô do hangar
- [x] save.ts: campo `explorer` persistido + explorerId()/setExplorer(), com fallback para o líder da equipe
- [x] camada de sucata do primeiro plano rebaixada (scale 0.075) para não cobrir o robô
- [x] typecheck verde, build verde (EXIT=0), E2E do hub com troca de robô + ataque: 0 erros de console, 0 imagens quebradas
- Próxima: Fase D (1000+ robôs via biblioteca modular de peças pixel art compostas programaticamente)

## Fase D — 1000+ robôs, lote 1 (250/1000)
- [x] Correção de rota: os robôs do roster voltam a ser feitos como os 220 originais (1 sprite sheet 4x4 por IA + pipeline). As 56 peças modulares (public/parts, game/parts.ts, game/compose.ts) ficam reservadas para o laboratório da Fase F
- [x] game/robots.ts revertido ao formato original (spriteUrl/faceUrl → /robots/<id>.png); robots_modular.ts removido
- [x] 30 robôs novos em 5 temas: insetoides/aracnídeos (vespirion, scarabyss, aranthrax, mantivore, formicore, cicadron), ninjas/ágeis (kagemaru, shurikage, fumikaze, kunailock, hayatezero, nokusaki), colossos/tanques (bastionox, mortarhulk, granithor, juggerspine, tectomaul, ferroatlas), alienígenas orgânico-tecnológicos (xenovyre, myconaut, nebulith, bioquell, hollowseer, gastropodo), cavaleiros e samurais (ronin_akatsu, bushidorne, lanceviel, templarion, kuroyari, gwenshield)
- [x] assets/roster_b1.py → roster_b1.json; assets/process_batch1.py gerou 30 tiras 2048x128 + 30 faces 64x64 em public/robots (500 PNGs no total) e atualizou o manifest (250 robôs)
- [x] assets/gen_blueprints_b1.py injetou os 30 Blueprints em game/robots.ts com 25 elementos novos mapeados no VFX_BY_ELEM (FERRAO, TEIA, XENO, JURAMENTO, GRANITO...)
- [x] game/assets.ts: ROBOT_ASSETS regenerado a partir de public/robots (500 entradas) para o pré-carregamento
- [x] roster.tsx paginado (PAGE=120 + botão MOSTRAR MAIS) para aguentar o roster crescendo até 1000
- [x] typecheck verde, build verde (EXIT=0), E2E assets/e2e_lote1.py: ROBOTS=250, COLECAO x/250, 503 imagens sem nenhuma quebrada, 0 erros de console
- Próxima: Fase D lote 2 — mais robôs no mesmo pipeline (faltam 750 para 1000)


## Fase D — congelada a pedido do usuário (256 robôs)
- [x] 6 robôs do lote 2 já gerados foram aproveitados (lupvexor, tigravox, ursagrind, cornubrute, simiaslam, draknoir — tema bestas selvagens): 12 PNGs novos, manifest com 256 robôs, 6 Blueprints em game/robots.ts, ROBOT_ASSETS com 512 entradas
- [x] Geração de novos sprites de personagem interrompida conforme pedido; retomar só com pedido explícito

## Fase E — Mineração em tempo real (concluída)
- [x] Arte por IA processada em assets/process_mine.py: /city/b_mine.png (fachada da mina no hub), /ui/bg_mine.png (interior da caverna) e /ui/ore_0..7.png (8 minérios)
- [x] game/mining.ts: 8 minérios (ferro 3g → prisma 440g), 8 camadas de profundidade (custo 0 → 800.000g, dureza crescente), sorteio de minério por camada, picareta (Lv30), silo (Lv30), perfuratriz por camada (Lv20) com produção offline de até 8h, refinaria (Lv20, 10 brutos = 1 lingote valendo 3,5x)
- [x] game/save.ts: estado mining persistido + ações mineOre, miningTick, upgradePick/Silo/Refinery/Drill, descendMine, startRefine, collectRefine, sellMining
- [x] screens/mine.tsx: parede de rocha com 6 veios clicáveis (HP, respawn de 9s, floaters de dano/ganho), robô explorador tocando "attack" a cada golpe, barra do silo, abas MINA / PERFURATRIZ / REFINO / ESTOQUE
- [x] Fiação: prédio MINA PROFUNDA no hub (x=4320, WORLD_W 4300 → 4900), Screen "mine", modal no game-shell, assets no CORE_ASSETS
- [x] typecheck verde, build verde, E2E assets/e2e_mine.py: 6 veios, silo 0 → 17 minérios (ferro 12 + cobre 5), perfuratriz N1 instalada, 4 abas abrindo, 0 imagens quebradas, 0 erros de console
- Próxima: Fase F — laboratório de construção de robô com as 56 peças modulares

## Fase F — Laboratório (concluída)
- [x] game/lab.ts (núcleos, stats de peça, draft, custo, CustomRobot, activate/deactivate)
- [x] compose.ts: setCustomSet/clearCustomSet + setFor(id)
- [x] robots.ts: setSpriteResolver/setFaceResolver + registerCustom/unregisterCustom
- [x] save.ts: campo customs, normalize+activate no read(), buildCustom/renameCustom/scrapCustom, totalBars, lockedRobotIds ignora lab_
- [x] screens/lab.tsx (bancada com carrosséis + hangar de protótipos)
- [x] menu.tsx: Screen "lab"
- [x] game-shell.tsx wiring
- [x] hub-city.tsx prédio b_lab (x 4840) + WORLD_W 5400
- [x] arte: /city/b_lab.png (320x384) e /ui/bg_lab.png (480x816) via assets/process_lab.py
- [x] assets.ts CORE_ASSETS
- [x] roster.tsx: robôs do laboratório no topo da grade
- [x] typecheck --force OK, build OK, assets/e2e_lab.py OK (0 erros, 0 imagens quebradas)
- [x] roadmap.md: F concluída + linhas G1..G5 do pedido novo

## Fase G1 — Pets em carrossel + sistema 100x (concluída)
- [x] game/pets.ts reescrito: 12 espécies × 12 linhagens = **144 pets** (12 → 144), cada um com afinidade principal + secundária (metade da força), 2 traços sorteados de 20, preço/raridade/requisito derivados da linhagem
- [x] Linhagens recolorem a arte da espécie por filtro CSS (petFilter: sepia+saturate+hue-rotate) — nenhuma arte de personagem nova gerada, respeitando a ordem de não gerar personagem
- [x] Progressão: PET_MAX_LEVEL 5 → **20**, em 3 estágios de evolução (FILHOTE / ADULTO / ANCIÃO, caps 6/13/20) com multiplicador de bônus 1 / 1.35 / 1.8; o pet cresce visualmente a cada estágio
- [x] Evoluir de estágio consome lingotes da mina (petUpgradeBars), ligando pets à Fase E
- [x] Slots de equipe: 1 → **3 pets simultâneos**, liberados nos níveis 1 / 22 / 48 (PET_SLOT_LEVELS)
- [x] save.ts: activePet (string|null) → **activePets (string[])** com migração automática do save antigo (normalizeActivePets), togglePetSlot/clearPetSlots/petSlotCount, petBonusTable, upgradePet cobrando ouro + lingotes
- [x] battle.ts: Fighter.pet → Fighter.pets (tabela somada dos 3 pets), petBonus lê a tabela — bônus de todos os pets levados valem juntos em combate
- [x] screens/pets.tsx refeito como **carrossel**: pet grande no centro, seta `<` à esquerda e `>` à direita, `<<`/`>>` pulam de espécie, contador N/144, filtro TODOS/MEUS/A ADOTAR, fileira dos 3 slots no topo, ficha com efeito principal/secundário/traços, barra de nível e etiqueta de estágio I/II/III
- [x] styles.css: animações mk-petbob (flutuação do pet), mk-petin (entrada lateral na direção da seta) e mk-aura (aura pulsante na cor da raridade)
- [x] typecheck --force OK, build OK, assets/e2e_pets_g1.py OK (setas de pet, setas de espécie, filtro, adoção, treino, evolução Lv6→7 cobrando lingotes, slots; 0 erros de console, 0 imagens quebradas)



## Fase G2 — Cards e gadgets 100x (concluída)

### Cards (game/cards.ts, screens/cards.tsx)
- [x] 30 cards base × **7 selos** (BRUTO, RUBRO, POLAR, VOLTAICO, UMBRAL, AUREO, PRISMA) = **210 cards**; cada selo multiplica os mods, adiciona bônus/tag próprios e sobe raridade, preço e nível exigido
- [x] Selos recolorem a arte base por filtro CSS (cardFilter: sepia+saturate+hue-rotate+brightness) — **nenhuma arte nova gerada**, respeitando a ordem de não gerar personagem
- [x] **Refino +0..+9** por card (CARD_MAX_REFINE 10): custo em ouro escalando e **lingotes da mina** nos marcos, multiplicando os mods (cardModsAt/refineMult)
- [x] Slots de deck 3 → **5** (CARD_SLOT_LEVELS 1/1/1/20/45) e orçamento de energia crescendo com o nível (deckBudget)
- [x] Sinergias em **3 camadas**: por tag, por selo e **17 combos nomeados**; nearSynergies sugere o que falta
- [x] IA usa decks selados e refinados (aiDeck + aiRefineMap), escalando com o nível do adversário
- [x] Tela refeita: lista agrupada por base com contador de selos possuídos (N/7), modal com grade dos 7 selos, mods somados, comprar/equipar/remover e **refinar**
- [x] Correção de UI: clique dentro do modal não fecha mais o modal (o backdrop só fecha no toque fora)

### Gadgets (game/gadgets.ts, screens/engineer.tsx)
- [x] Nível máximo 10 → **30**, em 3 marcos **MK-I / MK-II / MK-III** (caps 10/20/30); cruzar marco cobra **lingotes**
- [x] **3 sockets** por gadget, liberados em Lv5/15/25 (gadgetSockets)
- [x] **48 chips** forjáveis (12 tipos × 4 tiers BRUTO/REFINADO/OTIMIZADO/SINGULAR), custando ouro + lingotes; gadgetTotals soma gadget + chips
- [x] IA também equipa chips (aiChips) conforme o nível
- [x] Tela com duas abas (GADGETS / FORJA DE CHIPS), etiqueta MK, fileira de sockets clicáveis, picker de chip e efeitos somados na ficha

### Save e batalha
- [x] save.ts: novos campos cardRefine / chips / gadgetChips com migração do save antigo; refineCard, buyChip, equipChip, gadgetChipsOf, cardSlotCount, gadgetBonusTable
- [x] battle.ts: Fighter.gadget → **gadgetLevel + gadgetMk + gadgetMods** (gadget + chips somados); deck do jogador e da IA resolvidos já com refino

### Verificação
- [x] typecheck --force OK, build OK
- [x] assets/e2e_cards_g2.py OK — 210 cards, 30 tiles, 7 miniaturas de selo com 7 filtros distintos, compra do bruto + do selado, equipar, refinar até +3 cobrando lingotes no marco, forja de chip, upgrade de gadget Lv10→11 virando MK-II com lingotes, chip encaixado no socket; 0 erros de console, 0 imagens quebradas, 0 HTTP>=400
- [x] assets/e2e_battle_g2.py OK — gadget MK-II sozinho +49.8% de força, com 2 chips T4 vai a **+67.3%** e ganha +10% de crítico; card selado rubro sai de +12.5% para **+20.4%** de poder com refino +7; força do lutador 131 → 219
- [x] assets/e2e_battle.py OK (partida real sem erros de console nem sprites quebrados)

### Próxima fase: G3 — batalha 100x com 100 animações novas
