# 🚀 RB3 Quick Start - Início Rápido

## Sumário Executivo

Você agora tem **dados em tempo real da B3** no seu app sem alterar o layout!

- ✅ Layout: **100% igual**
- ✅ Dados: **Tempo real B3**
- ✅ Instalação: **< 5 minutos**
- ✅ Uso: **3 terminais**

---

## 1️⃣ Pré-requisitos

- [x] Node.js (já tem)
- [ ] R 4.0+ → https://cran.r-project.org/

---

## 2️⃣ Instalação R

### Windows
```bash
# Baixe e instale de:
https://cran.r-project.org/bin/windows/base/

# Ou use Chocolatey:
choco install r
```

### macOS
```bash
brew install r
```

### Linux
```bash
sudo apt-get install r-base
```

---

## 3️⃣ Setup (< 2 minutos)

```bash
# Opção A: Automático
cd rb3-api
Rscript setup.R

# Opção B: Manual
R -e "install.packages(c('plumber','tidyverse','jsonlite'))"
R -e "remotes::install_github('lfpdrocha/rb3')"
```

---

## 4️⃣ Rodar (3 Terminais)

### Terminal 1: API RB3

```bash
cd rb3-api
Rscript run.R
```

Esperado:
```
🚀 Iniciando API RB3...
📍 API rodando em http://localhost:3002 ✅
📚 Documentação: http://localhost:3002/__docs__/
```

### Terminal 2: Backend

```bash
cd backend
node server.js
```

Esperado:
```
ℹ️ [2024-02-16T...] [INFO] Servidor rodando em http://localhost:3001 ✅
```

### Terminal 3: Navegador

```
http://localhost:3001
```

Veja o app com **dados em tempo real da B3**! 🎉

---

## 5️⃣ Verificar Funcionamento

```bash
# Terminal 4 (novo):

# Status RB3
curl http://localhost:3001/api/rb3/status

# Dados em tempo real
curl http://localhost:3001/api/market/indices

# Ações
curl http://localhost:3001/api/stocks/PETR4
```

---

## 📊 Arquitetura

```
Usuário
  ↓ (http://localhost:3001)
Frontend HTML+JS
  ↓ GET /api/market/indices
Backend Node.js (Express + Cache)
  ↓ Tenta RB3 primeiro
RB3 API em R (porta 3002) ← TEMPO REAL B3 ✨
  ↓ Se falhar
Brapi / HG Brasil / Mock
```

---

## 🎯 Dados Carregados

- ✅ **Índices**: IBOVESPA, IFIX, SMLL, DOLAR, BTC (tempo real)
- ✅ **Ações**: PETR4, VALE3, ITUB4, etc (tempo real)
- ✅ **Histórico**: Últimos 30 dias (preços diários)
- ✅ **Altas/Baixas**: Top 20 do dia

---

## ⚙️ Configuração

Arquivo: `backend/.env`

```env
# RB3 (NOVO)
RB3_ENABLED=true
RB3_API_URL=http://localhost:3002

# Brapi (opcional)
BRAPI_TOKEN=seu_token

# Cache
CACHE_TTL=300  # 5 minutos
```

---

## 🔄 Priorização de Dados

1. **RB3** (tempo real B3) 🟢 PREFERIDO
2. Brapi (fallback)
3. HG Brasil (fallback)
4. Mock Local (sempre tem)

Se RB3 cair? Automático fallback! 👌

---

## 🧹 Limpar / Atualizar

```bash
# Forçar refresh de todos os dados
curl -X POST http://localhost:3001/api/rb3/force-refresh

# Ou apenas índices
curl -X POST http://localhost:3001/api/rb3/force-refresh \
  -H "Content-Type: application/json" \
  -d '{"type":"indices"}'

# Limpar cache
curl -X POST http://localhost:3001/api/rb3/clear-cache
```

---

## ❌ Problemas Comuns

| Problema | Solução |
|----------|---------|
| "API RB3 não conecta" | `curl http://localhost:3002/health` |
| "rb3 not found" | `Rscript rb3-api/setup.R` |
| "plumber not found" | `Rscript rb3-api/setup.R` |
| Dados desatualizados | `POST /api/rb3/force-refresh` |

---

## 📚 Documentação Completa

- **RB3_INTEGRATION.md** ← Guia completo
- **rb3-api/README.md** ← Docs API RB3
- **MELHORIAS_IMPLEMENTADAS.md** ← Docs anteriores

---

## 🎯 Status

✅ **Implementado**
✅ **Testado**
✅ **Pronto para usar**
✅ **Layout intacto**
✅ **Dados tempo real**

---

## 🚀 Próximo

Abra 3 terminais e comece! 🎉

Terminal 1: `cd rb3-api && Rscript run.R`
Terminal 2: `cd backend && node server.js`
Terminal 3: Navegador `http://localhost:3001`

---

**Tempo total: ~5 minutos** ⏱️

Pronto para dados em tempo real? ✨
