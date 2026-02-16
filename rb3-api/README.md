# RB3 API - Dados em Tempo Real da B3

API REST em R para obter dados **em tempo real da Bolsa de Valores B3** usando o pacote `rb3`.

## 🚀 Quick Start

### 1. Instalar Dependências

```r
# No R ou RStudio:
install.packages(c("plumber", "tidyverse", "jsonlite"))
remotes::install_github("lfpdrocha/rb3")
```

Ou:

```bash
cd rb3-api
Rscript setup.R
```

### 2. Rodar a API

```bash
Rscript run.R
```

Esperado:
```
🚀 Iniciando API RB3...
📍 API rodando em http://localhost:3002
📚 Documentação: http://localhost:3002/__docs__/
```

### 3. Testar

```bash
# Índices
curl http://localhost:3002/indices

# Ação específica
curl http://localhost:3002/stocks/PETR4

# Lista de altas/baixas
curl http://localhost:3002/stocks/list/altas
curl http://localhost:3002/stocks/list/baixas

# Health check
curl http://localhost:3002/health
```

---

## 📚 Endpoints

### GET `/indices`
Retorna índices principais (IBOVESPA, IFIX, etc)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "symbol": "IBOVESPA",
      "name": "Ibovespa",
      "price": 130000,
      "change": 0.5,
      "cached": false
    }
  ]
}
```

### GET `/stocks/<ticker>`
Retorna dados de uma ação específica

**Example:** `GET /stocks/PETR4`

**Response:**
```json
{
  "success": true,
  "data": {
    "ticker": "PETR4",
    "name": "Petrobras",
    "price": 30.50,
    "change": 1.5,
    "sector": "Energia",
    "fundamentals": {
      "pl": 8.5,
      "dy": 10.2,
      "roe": 15.3,
      "pvp": 1.2
    }
  },
  "cached": false
}
```

### GET `/stocks/list/<filter>`
Retorna lista de ações em alta ou baixa

**Params:**
- `filter`: `altas` ou `baixas`

**Example:** `GET /stocks/list/altas`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "ticker": "PETR4",
      "name": "Petrobras",
      "price": 30.50,
      "change": 2.5,
      "sector": "Energia"
    }
  ],
  "cached": false
}
```

### GET `/stocks/<ticker>/history`
Retorna histórico de preços

**Query Params:**
- `days`: Número de dias (padrão: 30)

**Example:** `GET /stocks/PETR4/history?days=90`

**Response:**
```json
{
  "success": true,
  "data": [
    {"date": "2024-02-01", "price": 28.50},
    {"date": "2024-02-02", "price": 29.00}
  ]
}
```

### GET `/health`
Health check da API

**Response:**
```json
{
  "status": "ok",
  "service": "RB3-API",
  "timestamp": "2024-02-16T12:34:56Z",
  "version": "1.0.0"
}
```

### GET `/info`
Informações sobre a API

**Response:**
```json
{
  "name": "RB3 API",
  "version": "1.0.0",
  "description": "API para dados da B3 em tempo real",
  "endpoints": {
    "indices": "/indices",
    "stock": "/stocks/<ticker>",
    "stock_list": "/stocks/list/<filter>",
    "history": "/stocks/<ticker>/history",
    "health": "/health"
  }
}
```

---

## 🔧 Configuração

### Portas

- **RB3 API:** `3002` (R/Plumber)
- **Backend Node.js:** `3001` (Express)
- **Frontend:** `3001` (navegador)

### Env Vars

No arquivo `.env` do backend:

```bash
# Habilitar RB3
RB3_ENABLED=true
RB3_API_URL=http://localhost:3002
```

---

## 💾 Cache

A API RB3 usa cache local para evitar sobrecarga:

- **Índices:** 5 minutos
- **Ações:** 5 minutos
- **Histórico:** 1 hora

Para limpar cache manualmente:

```bash
# Via Node.js backend:
curl -X POST http://localhost:3001/api/rb3/clear-cache
```

---

## ⚠️ Troubleshooting

### "Error: package 'rb3' not available"

```bash
# Instalar do GitHub:
R -e "remotes::install_github('lfpdrocha/rb3')"
```

### "Error: package 'plumber' not available"

```bash
# Instalar plumber:
R -e "install.packages('plumber')"
```

### "Connection refused"

Verifique se a API está rodando:

```bash
# Terminal 1:
Rscript run.R

# Terminal 2:
curl http://localhost:3002/health
```

### Dados desatualizados?

Limpe o cache:

```bash
curl -X POST http://localhost:3001/api/rb3/force-refresh \
  -H "Content-Type: application/json" \
  -d '{"type":"all"}'
```

---

## 📊 Performance

| Métrica | Valor |
|---------|-------|
| 1ª requisição | ~200-500ms |
| 2ª requisição (cache) | ~5ms |
| Cache TTL | 5 minutos |
| Max requests/min | Sem limite |

---

## 🐳 Docker (Opcional)

```dockerfile
FROM r-base:4.2
WORKDIR /app
RUN R -e "install.packages(c('plumber','tidyverse','jsonlite'))"
RUN R -e "remotes::install_github('lfpdrocha/rb3')"
COPY . /app
EXPOSE 3002
CMD ["Rscript", "run.R"]
```

Build:

```bash
docker build -t rb3-api .
docker run -p 3002:3002 rb3-api
```

---

## 📚 Estrutura

```
rb3-api/
├── app.R          # Endpoints da API
├── run.R          # Script para rodar
├── setup.R        # Setup de dependências
└── README.md      # Este arquivo
```

---

## 🔗 Links

- **RB3 Package:** https://github.com/lfpdrocha/rb3
- **Plumber Docs:** https://www.rplumber.io/
- **B3 Website:** https://www.b3.com.br/

---

**Status:** ✅ Pronto para usar
**Última atualização:** 2024-02-16
