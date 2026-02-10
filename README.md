# App de Análise de Opções B3

Aplicativo funcional para análise de opções e mercado B3, com interface unificada e backend integrado.

## Estrutura

- **`backend/`** – API Node.js (Express) que serve dados de mercado, ações, opções, ordens simuladas, estratégias e backtest.
- **`app/`** – Frontend unificado (HTML + JS) que consome a API e replica as telas do stitch.
- **`stitch_op_es_app/`** – Telas originais de referência (mantidas).

## Como rodar

1. Instalar dependências e subir o servidor:
   ```bash
   cd backend
   npm install
   node server.js
   ```
2. Abrir no navegador: **http://localhost:3001**

## Funcionalidades

| Tela | Descrição |
|------|-----------|
| **Início** (`index.html`) | Dashboard: IBOVESPA, índices (IFIX, SMLL, Dólar, BTC), lista de altas/baixas, notícias. Clique em um ativo para ir aos detalhes. |
| **Ativos** (`ativos.html`) | Lista de ativos com links para Detalhes, Grade de Opções e Boleta. Acesso ao Simulador e ao Backtest. |
| **Detalhes da ação** (`ativo.html?ticker=PETR4`) | Cotação, gráfico, indicadores (P/L, DY, ROE, P/VP), sobre a empresa. Botão para Grade de Opções. |
| **Grade de opções** (`opcoes.html?ticker=PETR4`) | Cadeia de calls/puts por strike, vencimentos, destaque ATM. |
| **Boleta** (`boleta.html?ticker=PETR4`) | Ordem simulada: compra/venda, tipo, quantidade, preço, saldo e total. Envio simulado para a API. |
| **Simulador** (`simulador.html`) | Payoff da estratégia (ex.: Bull Call Spread), lucro/prejuízo máx., breakeven, pernas e custo. |
| **Backtest** (`backtest.html`) | Resultados simulados: patrimônio, taxa de acerto, profit factor, drawdown, Sharpe e operações. |
| **Carteira** (`carteira.html`) | Saldo disponível e histórico de ordens simuladas. |
| **Configurações** (`config.html`) | Provedores de dados (Yahoo, Brapi, HG Brasil), failover e opções avançadas. |

## API (backend)

- `GET /api/market/indices` – Índices (IBOV, IFIX, etc.)
- `GET /api/market/stocks?filter=altas|baixas` – Ações em alta ou em baixa
- `GET /api/market/news` – Notícias
- `GET /api/stocks/:ticker` – Dados e fundamentos da ação
- `GET /api/stocks/:ticker/chart` – Pontos do gráfico
- `GET /api/options/:ticker/chain?expiration=...` – Grade de opções
- `GET /api/orders/balance` – Saldo simulado
- `POST /api/orders` – Enviar ordem simulada
- `GET /api/orders` – Listar ordens
- `GET /api/strategies/payoff?strategy=...` – Payoff da estratégia
- `POST /api/backtest/run` – Executar backtest
- `GET/POST /api/settings` – Configurações de provedores

## Fontes de dados (APIs)

Com base na planilha de APIs para o mercado de opções brasileiro, o projeto usa:

| Fonte        | Uso no projeto | Motivo |
|-------------|-----------------|--------|
| **Brapi**   | Principal       | API REST, tier free, ações + índices + fundamentos + histórico. 4 ações de teste (PETR4, VALE3, ITUB4, MGLU3) funcionam sem token. |
| **HG Brasil** | Failover     | API REST, foco em ações/índices/moedas; usado quando Brapi falha ou não está configurado. |
| **Opções**  | Mock            | Nenhuma API REST gratuita expõe grade completa de opções. B3 COTAHIST (arquivo) ou opcoes.net.br (scraping) podem ser integrados depois. |

### Variáveis de ambiente (opcional)

Crie um arquivo `.env` na pasta `backend/` (copie de `.env.example`):

- **`BRAPI_TOKEN`** – Token em [brapi.dev/dashboard](https://brapi.dev/dashboard). Sem token, só PETR4, VALE3, ITUB4 e MGLU3 têm dados reais.
- **`HGBRASIL_KEY`** – Chave em [console.hgbrasil.com](https://console.hgbrasil.com/keys). Usada como failover para índices e cotações.

Sem nenhuma chave, o app usa **dados mock** e segue funcionando.

## Navegação

A barra inferior (Início, Ativos, Carteira, Perfil) aparece nas principais telas. Use os links “Detalhes”, “Opções” e “Boleta” em cada ativo na lista de ativos para ir direto à tela correspondente.
