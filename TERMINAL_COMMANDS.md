# 🖥️ Comandos Exatos para Cada Terminal

## Sumário Rápido

Você precisa abrir **3 terminais** e rodar estes comandos **na ordem**:

---

## ✅ TERMINAL 1: API RB3 (R/Plumber)

### ✨ OPÇÃO 1: Script Automático (RECOMENDADO - Windows)

Se receber erro "Rscript não é reconhecido", use os scripts automáticos:

**PowerShell:**
```powershell
cd C:\Users\klebe\OneDrive\Projetos\opcoes_app
powershell -ExecutionPolicy Bypass -File run-rb3.ps1
```

**CMD:**
```cmd
cd C:\Users\klebe\OneDrive\Projetos\opcoes_app
run-rb3.bat
```

✅ O script encontra R automaticamente!

---

### OPÇÃO 2: Caminho Completo (Se preferir)

**PowerShell:**
```powershell
cd rb3-api
"C:\Program Files\R\R-4.3.x\bin\Rscript.exe" run.R
```

(Substitua `4.3.x` pela sua versão de R)

---

### OPÇÃO 3: Método Original (Se R está no PATH)

```bash
cd rb3-api
Rscript run.R
```

**Esperado ver:**

```
🚀 Iniciando API RB3...
📍 API rodando em http://localhost:3002
📚 Documentação: http://localhost:3002/__docs__/

Pressione CTRL+C para parar
```

✅ **DEIXE ESTE TERMINAL RODANDO** (não feche!)

---

## ✅ TERMINAL 2: BACKEND NODE.JS

**O que digitar:**

```bash
cd backend
node server.js
```

**Passo a passo:**

1. Abra um **novo terminal** (não use o mesmo de Terminal 1)
2. Navegue até a pasta do projeto
3. Digite: `cd backend` → Enter
4. Digite: `node server.js` → Enter

**Esperado ver:**

```
ℹ️ [2024-02-16T12:34:56.789Z] [INFO] Servidor rodando em http://localhost:3001
ℹ️ [2024-02-16T12:34:57.123Z] [INFO] Ambiente: development
```

✅ **DEIXE ESTE TERMINAL RODANDO** (não feche!)

---

## ✅ TERMINAL 3: NAVEGADOR (Frontend)

**O que digitar:**

Abra seu navegador (Chrome, Firefox, Safari, Edge) e digite na barra de endereço:

```
http://localhost:3001
```

Depois pressione **Enter**

**Esperado ver:**

- Dashboard do Opciones App
- IBOVESPA: 130.000 pts
- PETR4: 30,50 reais
- VALE3: 95,20 reais
- Dados **em tempo real da B3** ✨

---

## 🆗 TERMINAL 4 (OPCIONAL): Testar Dados

Abra um **quarto terminal** (após os 3 anteriores estarem rodando) e teste:

### Teste 1: Status RB3

```bash
curl http://localhost:3001/api/rb3/status
```

Deve retornar JSON com `"available": true`

### Teste 2: Índices em Tempo Real

```bash
curl http://localhost:3001/api/market/indices
```

Deve retornar dados como:
```json
{
  "success": true,
  "data": [
    {
      "symbol": "IBOVESPA",
      "name": "Ibovespa",
      "value": 130000,
      "change": 0.5
    }
  ]
}
```

### Teste 3: Ação Específica

```bash
curl http://localhost:3001/api/stocks/PETR4
```

Deve retornar dados de PETR4 em tempo real

### Teste 4: Forçar Atualizar

```bash
curl -X POST http://localhost:3001/api/rb3/force-refresh
```

Força o refresh dos dados

---

## 📋 SE ALGO DER ERRADO

### ❌ Terminal 1: "rb3 package not found"

**Solução:**

```bash
Rscript rb3-api/setup.R
```

Espere instalar tudo, depois rode novamente:

```bash
Rscript run.R
```

### ❌ Terminal 1: "plumber not found"

**Solução:**

```bash
Rscript rb3-api/setup.R
```

### ❌ Terminal 2: "npm install needed"

**Solução:**

```bash
npm install
node server.js
```

### ❌ Terminal 2: "node: command not found"

**Solução:**

Node.js não está instalado. Baixe de: https://nodejs.org/

Instale e abra um novo terminal.

### ❌ Terminal 3: "Connection refused"

**Solução:**

Verifique se Terminal 2 está rodando e mostrando:
```
Servidor rodando em http://localhost:3001
```

### ❌ Dados não aparecem no navegador

**Solução:**

1. Verifique Terminal 1 (RB3) está rodando
2. No Terminal 4, teste: `curl http://localhost:3002/health`
3. Recarregue o navegador (F5 ou Ctrl+R)

---

## 🎯 FLUXO CORRETO

```
1. Abra Terminal 1
   ├─ cd rb3-api
   └─ Rscript run.R
   └─ Espere: "API rodando em http://localhost:3002"

2. Abra Terminal 2
   ├─ cd backend
   └─ node server.js
   └─ Espere: "Servidor rodando em http://localhost:3001"

3. Abra Navegador
   ├─ http://localhost:3001
   └─ Veja o Dashboard com dados em tempo real!

4. (Opcional) Abra Terminal 4
   ├─ curl http://localhost:3001/api/rb3/status
   └─ Teste os dados
```

---

## 📝 Dicas

- **Não feche** Terminal 1 e Terminal 2 enquanto estiver usando
- Se quiser **parar tudo**, pressione `Ctrl+C` em cada terminal
- Se quiser **rodar novamente**, repita os passos acima
- O navegador pode ficar aberto sempre - atualiza sozinho

---

## ✨ Pronto!

Agora você tem dados **em tempo real da B3** rodando localmente! 🚀

Aproveite! 🎉
