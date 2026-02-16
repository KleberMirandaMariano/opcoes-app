# 🚀 COMECE AQUI!

**Opciones App está pronto para usar. Escolha uma opção abaixo:**

---

## ⚡ OPÇÃO 1: Usar AGORA (2 minutos) - SEM R

Você quer usar o app imediatamente, com dados simulados (mock).

**Abra um terminal e execute:**

```bash
cd backend
npm install
node server.js
```

**Depois abra no navegador:**
```
http://localhost:3001
```

✅ **Pronto!** App funcionando com dados mock realistas!

---

## 🔌 OPÇÃO 2: Com dados REAIS da B3 (30 minutos) - COM R

Você quer dados em tempo real da Bolsa de Valores B3.

**Pré-requisitos:**
- R instalado (https://www.r-project.org/)
- Pacote RB3 instalado em R

**Passo 1:** Terminal 1 - API RB3
```bash
cd rb3-api
Rscript run.R
```

**Passo 2:** Terminal 2 - Backend Node.js
```bash
cd backend
npm install
node server.js
```

**Passo 3:** Navegador
```
http://localhost:3001
```

✅ **Pronto!** App com dados reais da B3!

---

## 📚 OPÇÃO 3: Entender tudo antes (10 minutos)

Leia os documentos nesta ordem:

1. **VERIFICACAO_FINAL.md** ← Resumo técnico completo
2. **ARQUITETURA_VISUAL.txt** ← Fluxo de dados
3. **RB3_FALLBACK_GUIDE.md** ← Como funciona o fallback
4. **WINDOWS_TROUBLESHOOTING.md** ← Se tiver problemas com R

---

## ❓ PERGUNTAS FREQUENTES

### P: Como faço para parar o servidor?
R: Pressione `Ctrl + C` no terminal

### P: Qual a diferença entre Opção 1 e Opção 2?
R:
- **Opção 1:** Dados mock (simulados) - funciona sem R
- **Opção 2:** Dados reais - requer R + pacote RB3

### P: O app funciona se RB3 não responder?
R: ✅ Sim! Usa dados mock automaticamente

### P: Posso mudar os dados mock?
R: ✅ Sim! Edite `backend/services/rb3-fallback.js`

### P: Como mudo a porta (3001)?
R: Edite `backend/server.js` linha 26:
```javascript
const PORT = process.env.PORT || 3001; // mude 3001 para outra porta
```

### P: O app é seguro?
R: ✅ Sim! Implementamos:
- Helmet.js (headers de segurança)
- CORS (controle de origem)
- Session management
- Validação de entrada

---

## 📊 O QUE VOCÊ PODE FAZER

- 📈 Ver dashboard com gráficos de mercado
- 🔍 Analisar ações individuais
- 📋 Analisar opções
- 💰 Simular operações
- 📊 Fazer backtesting
- 💼 Gerenciar carteira
- ➕ Criar e gerenciar ordens
- 🎯 Usar estratégias
- ⚙️ Configurar preferências

---

## 🆘 PROBLEMAS?

### Erro: "npm: comando não encontido"
→ Instale Node.js: https://nodejs.org/

### Erro: "Port 3001 em uso"
→ Feche outro app usando a porta ou mude em `server.js`

### Erro: "Rscript não reconhecido"
→ Execute: `DEBUG_R_INSTALLATION.bat`
→ Depois leia: `WINDOWS_TROUBLESHOOTING.md`

### RB3 não responde (aviso)
→ **Isso é normal!** App usa dados mock automaticamente ✅

---

## 📁 ESTRUTURA DO PROJETO

```
opcoes_app/
├── backend/               # Node.js + Express
│   ├── services/          # Serviços (rb3-client, rb3-fallback, etc)
│   ├── routes/            # Endpoints da API
│   ├── middleware/        # Middlewares
│   ├── utils/             # Utilitários
│   └── server.js          # Servidor principal
│
├── app/                   # Frontend (HTML/JS)
│   ├── index.html         # Dashboard
│   ├── ativos.html        # Ativos
│   ├── opcoes.html        # Opções
│   ├── simulador.html     # Simulador
│   ├── backtest.html      # Backtesting
│   ├── carteira.html      # Carteira
│   ├── boleta.html        # Boleta
│   ├── config.html        # Configurações
│   └── js/
│       └── api.js         # Cliente API
│
├── rb3-api/               # R + Plumber (opcional)
│   ├── app.R              # API em R
│   ├── run.R              # Inicialização
│   └── setup.R            # Setup
│
└── docs/                  # Documentação
    ├── COMECE_AQUI.md     # Este arquivo
    ├── VERIFICACAO_FINAL.md
    ├── ARQUITETURA_VISUAL.txt
    └── ... (mais docs)
```

---

## 🎯 PRÓXIMAS ETAPAS

**Imediatamente:**
1. Escolha a Opção 1 ou 2 acima
2. Execute os comandos
3. Abra http://localhost:3001

**Depois:**
1. Explore o dashboard
2. Teste os diferentes módulos
3. Familiarize-se com os dados

**Mais tarde:**
1. Leia a documentação completa
2. Customize conforme necessário
3. Integre com suas ferramentas

---

## 💡 DICAS

- 🌙 Dark mode já está ativado por padrão
- 📱 App é responsivo (funciona em mobile)
- ⚡ Dados são cacheados por 5 minutos
- 🔄 RB3 faz fallback automático se indisponível
- 📊 Gráficos são em tempo real

---

## ✅ VERIFICAÇÃO RÁPIDA

Depois que o app iniciar, teste:

1. **Dashboard (index.html)**
   - Você vê IBOVESPA, IFIX, DOLAR, BTC? ✅
   - Você vê lista de ações em alta? ✅

2. **Ativos (ativos.html)**
   - Você consegue mudar entre "Altas" e "Baixas"? ✅

3. **Detalhes (clique em uma ação)**
   - Você vê gráfico e dados? ✅

4. **Navegação**
   - Você consegue navegar entre as páginas? ✅

Se tudo está verde (✅), o app está funcionando perfeitamente!

---

## 🚀 READY TO GO!

**Escolha sua opção acima e comece agora!**

Qualquer dúvida, consulte a documentação dentro do projeto.

**Boa sorte! 🎉**
