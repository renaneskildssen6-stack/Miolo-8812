# Campeões Mecha — Roadmap do mega-escopo

Entrega **incremental**: uma fase (ou parte de fase) por sessão, sempre com
`bun run typecheck` + `bun run build` verdes, E2E sem erros de console e `deliver`
(mobile na 4300 no índice 0, website na 4200 no índice 1).

| Fase | Sistema | Estado |
|---|---|---|
| A | **Cards de combate** — 30 cards pixel art por IA, 3 slots, custo de deck, sinergias por tag + combos nomeados, decks também para os inimigos/IA | ✅ concluída |
| B | **Parallax do hub** — céu, montanhas, skyline distante, construções separadas e decorações, todas geradas por IA em camadas independentes | ✅ concluída |
| C | **Exploração** — modo side/top-down com sprites animados por ação (andar, correr, atacar, dano), todos os robôs jogáveis, chão/plataformas/props por IA (mesma técnica 4x4 + magenta) | ✅ concluída |
| D | **1000+ robôs** — cada robô com sprite sheet 4x4 próprio gerado por IA, entregue em lotes sessão após sessão (insetoides, ninjas, colossos, alienígenas, cavaleiros/samurais) | 🔄 em lotes (250/1000) |
| E | **Mineração em tempo real** — sala de mineração, personagem jogável, veios, refino, produção offline | pendente |
| F | **Laboratório** — construir o próprio robô com 1000+ opções por parte do corpo (peças da Fase D), stats derivados das peças | pendente |
| G | **Polimento de UI** — todos os modais redesenhados, animações de entrada/saída, organização, feedback tátil | pendente |
| H | **+50 sistemas** — em lotes de ~6 por sessão, cada um com construção própria no hub e objetivo real de gameplay | pendente |

## Decisão de engenharia (Fase D/F)

1000 sprite sheets gerados por IA é inviável em custo e tempo. Em vez disso:
peças pixel art geradas por IA → composição programática. Isso produz ao mesmo
tempo os 1000+ robôs jogáveis e as 1000+ opções por parte do corpo do laboratório,
mantendo o padrão de animação (grade 4x4, chroma key magenta).
