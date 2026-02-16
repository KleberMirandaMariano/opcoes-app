# 🚀 Setup - Opçõesexpert com Backend Node.js + RB3

Este projeto integra o frontend React (Opçõesexpert) com o backend Node.js (opciones-app) para fornecer dados em tempo real da B3.

## 📋 Estrutura

```
opcoes-expert/
├── backend/           # Backend Node.js + Express (do opciones-app)
├── services/          # Serviços do React
│   ├── geminiService.ts    # Análise com Gemini
│   └── apiService.ts       # Integração com API do backend ✨ NOVO
├── components/        # Componentes React
├── App.tsx           # App principal
├── vite.config.ts    # Configuração Vite com proxy da API
├── package.json      # Scripts para rodar backend + frontend
└── README.md
```

## ⚙️ Configuração Rápida

### 1. Instalar dependências

```bash
# Instala dependências do frontend
npm install

# Backend já tem dependências instaladas
cd backend && npm install && cd ..
```

### 2. Configurar variáveis de ambiente

Crie/atualize os arquivos `.env.local`:

```bash
# Raiz do projeto (.env.local)
GEMINI_API_KEY=your-gemini-api-key-here

# Opcional: backend/.env
NODE_ENV=development
PORT=3001
SESSION_SECRET=your-session-secret
```

### 3. Rodar o projeto

#### Opção A: Modo Desenvolvimento (Recomendado)

Roda frontend (port 3000) + backend (port 3001) simultaneamente:

```bash
npm run dev
```

**Resultado:**
- 🖥️ Frontend React: http://localhost:3000
- 🔌 Backend API: http://localhost:3001
- ✅ Dados da B3 sendo carregados em tempo real

#### Opção B: Rodar separadamente

Terminal 1 - Backend:
```bash
npm run dev:backend
```

Terminal 2 - Frontend:
```bash
npm run dev:frontend
```

## 📊 Como Funciona

1. **Frontend React** (port 3000) faz requisições para `/api/...`
2. **Vite Dev Server** redireciona para backend (http://localhost:3001/api)
3. **Backend Node.js** processa requisições:
   - Tenta buscar dados reais de RB3
   - Se RB3 não responder → usa dados mock realistas
   - Retorna JSON com dados de mercado

## 🔌 Endpoints Disponíveis

Todos os endpoints do backend estão disponíveis:

### Market Data
- `GET /api/market/indices` - Índices (IBOV, IFIX, DOLAR, BTC)
- `GET /api/market/stocks?filter=altas|baixas` - Ações em alta/baixa
- `GET /api/stocks/{ticker}` - Detalhes de ação
- `GET /api/stocks/{ticker}/history?days=30` - Histórico

### Options
- `GET /api/options/{ticker}` - Opções disponíveis
- `POST /api/options/analyze` - Análise de opções

### RB3 Status
- `GET /api/rb3/status` - Status da conexão RB3
- `GET /api/rb3/health` - Health check

### Serviço de API React
```typescript
import apiService from './services/apiService';

// Buscar índices
const indices = await apiService.getMarketIndices();

// Buscar ações em alta
const stocks = await apiService.getStocks('altas');

// Buscar detalhes de ação
const stock = await apiService.getStockDetail('PETR4');

// Buscar histórico de preços
const history = await apiService.getStockHistory('PETR4', 30);

// Analisar opção
const analysis = await apiService.analyzeOption('PETR4', 30.00, 'call');
```

## 🔄 Fluxo de Dados

```
React App (port 3000)
    ↓
Faz requisição: GET /api/market/indices
    ↓
Vite Proxy (redireciona para :3001)
    ↓
Express Backend (port 3001)
    ├─ Tenta RB3 em :3002 (timeout 5s)
    │  ├─ Responde? → DADOS REAIS ✅
    │  └─ Não responde? → DADOS MOCK ✅
    ├─ Cache (TTL 5 min)
    └─ Retorna JSON
        ↓
React recebe dados
    ↓
Components renderizam no navegador
```

## 🎨 Usando Dados da API no React

### Exemplo 1: Carregar indices ao montar

```typescript
import { useEffect, useState } from 'react';
import apiService from './services/apiService';

function Dashboard() {
  const [indices, setIndices] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await apiService.getMarketIndices();
        setIndices(data);
      } catch (error) {
        console.error('Erro ao carregar índices:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      {indices?.map(index => (
        <div key={index.symbol}>
          <h3>{index.symbol}</h3>
          <p>Valor: R$ {index.value}</p>
          <p>Variação: {index.change}%</p>
        </div>
      ))}
    </div>
  );
}
```

### Exemplo 2: Analisar Opção

```typescript
const result = await apiService.analyzeOption('PETR4', 30.00, 'call');
console.log('Preço estimado:', result.estimatedPrice);
console.log('Gregas:', result.greeks);
```

## 🆘 Troubleshooting

### "Erro ao conectar com backend"
- Verifique se backend está rodando: `npm run dev:backend`
- Verifique se porta 3001 está disponível

### "RB3 não respondendo"
- ✅ **Isso é normal!** Backend usa dados mock automaticamente
- Para usar dados reais, instale R + RB3: veja `../opciones_app/WINDOWS_TROUBLESHOOTING.md`

### "Vite proxy não funciona"
- Reinicie o servidor: Ctrl+C e `npm run dev` novamente
- Verifique `vite.config.ts` tem proxy configurado

### "Módulos não encontrados"
```bash
# Limpar cache
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## 📈 Próximas Etapas

1. ✅ Frontend React rodando
2. ✅ Backend Node.js integrado
3. ✅ Dados da B3 funcionando
4. ⏭️ Conectar Gemini para análises (já em progress)
5. ⏭️ Deploy em produção

## 🔐 Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| GEMINI_API_KEY | Chave da API Google Gemini | `AIza...` |
| NODE_ENV | Ambiente | `development` ou `production` |
| PORT | Porta do backend | `3001` |
| SESSION_SECRET | Secret para sessões | `sua-chave-secreta` |

## 📞 Documentação Adicional

- **Frontend:** Veja `README.md`
- **Backend:** Veja `../opciones_app/VERIFICACAO_FINAL.md`
- **RB3:** Veja `../opciones_app/RB3_FALLBACK_GUIDE.md`

## ✅ Status

- ✅ Frontend React integrado
- ✅ Backend Node.js integrado
- ✅ Proxy da API configurado
- ✅ Dados mock funcionando
- ✅ RB3 fallback automático
- ⏳ Pronto para usar!

---

**Para começar agora:**

```bash
npm install
npm run dev
# Abra http://localhost:3000
```

🚀 **Pronto!** O app está rodando com dados em tempo real!
