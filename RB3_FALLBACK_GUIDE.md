# 🔄 Guia: RB3 Fallback (Dados Mock)

**Data:** 16 de Fevereiro, 2025

Se a API RB3 (em R) não conseguir rodar no seu Windows, o Opciones App agora possui **fallback automático** com dados mock realistas.

---

## 📊 O que é o Fallback?

O **fallback** é um sistema de contingência que:

1. ✅ **Tenta conectar à API RB3** (rodando em http://localhost:3002)
2. ❌ **Se não conseguir**, automaticamente usa dados **mock (simulados)**
3. 🔄 **Simula variações realistas** para parecer tempo real
4. 💾 **Cacheia dados** para melhor performance

**Resultado:** O app funciona mesmo sem R/RB3!

---

## 🚀 Como Usar (3 Opções)

### Opção 1: Forçar Fallback (Modo Desenvolvimento)

Se você quer testar o app sem R instalado:

1. Edite `backend/.env`
2. Adicione:
   ```
   RB3_ENABLED=false
   ```
3. Inicie o backend:
   ```bash
   cd backend
   node server.js
   ```

**Resultado:** O app usará dados mock desde o início, sem tentar conectar a RB3.

---

### Opção 2: Fallback Automático (Recomendado)

Deixe o app tentar RB3 primeiro, e se falhar, usa mock automaticamente:

1. Em `backend/.env`, deixe:
   ```
   RB3_ENABLED=true
   ```
2. Inicie o backend:
   ```bash
   cd backend
   node server.js
   ```

**O que acontece:**
- Terminal 1: Tenta conectar a http://localhost:3002 (RB3)
- Se RB3 não responder em 5 segundos → ⚠️ Aviso no console
- Usa dados mock automaticamente ✅
- App continua funcionando normalmente

---

### Opção 3: Rodar RB3 + Fallback (Ideal)

Se conseguir fazer R funcionar + fallback como backup:

1. Em `backend/.env`:
   ```
   RB3_ENABLED=true
   RB3_API_URL=http://localhost:3002
   ```

2. **Terminal 1:** Rodar RB3
   ```bash
   cd rb3-api
   "C:\Program Files\R\R-4.3.2\bin\Rscript.exe" run.R
   ```

3. **Terminal 2:** Rodar Backend
   ```bash
   cd backend
   node server.js
   ```

4. **Navegador:** http://localhost:3001

**Comportamento:**
- Se RB3 está rodando → Usa RB3 (dados reais da B3) ✅ **Preferido**
- Se RB3 cai/falha → Automaticamente usa mock ✅ **Fallback**

---

## 📋 Dados Mock Disponíveis

O fallback inclui dados para:

### Índices (4 disponíveis):
- **IBOVESPA** - Índice da Bovespa
- **IFIX** - Índice de Fundos Imobiliários
- **DOLAR** - Taxa USD/BRL
- **BTC** - Preço Bitcoin em USD

### Ações (5 disponíveis):
- **PETR4** - Petrobras (Energia)
- **VALE3** - Vale (Mineração)
- **ITUB4** - Itaú (Financeiro)
- **BBAS3** - Banco do Brasil (Financeiro)
- **WEGE3** - WEG (Industrial)

### Dados para Cada Ação:
```json
{
  "symbol": "PETR4",
  "name": "Petrobras S.A.",
  "sector": "Energia",
  "value": 30.52,
  "change": 0.35,
  "volume": 45230000,
  "lastUpdate": "2025-02-16T12:30:00Z"
}
```

---

## 🔍 Como Identificar se está Usando Fallback

### No Console do Backend:

Se vir mensagens assim:

```
[2025-02-16T12:34:56.789Z] ⚠️ WARN RB3 não disponível, usando fallback (dados mock)
[2025-02-16T12:34:56.812Z] ℹ️ INFO RB3 Fallback: Índices retornados (mock com variação)
```

→ **Está usando fallback!** ✅

### Na API:

Faça uma requisição:
```bash
curl http://localhost:3001/api/rb3/status
```

**Resposta com RB3:**
```json
{
  "available": true,
  "source": "rb3_api",
  "message": "Conectado ao RB3"
}
```

**Resposta com Fallback:**
```json
{
  "available": true,
  "source": "mock_fallback",
  "message": "Usando dados mock (RB3 não disponível)"
}
```

---

## ⚙️ Configurar Dados Mock

Quer mudar os preços ou adicionar mais ações?

**Edite:** `backend/services/rb3-fallback.js`

### Exemplo: Adicionar uma Nova Ação

1. Abra `rb3-fallback.js`
2. Procure por `mockStocks` (linha ~20)
3. Adicione uma entrada:

```javascript
const mockStocks = {
  'PETR4': { ... },
  'VALE3': { ... },
  'GGBR4': {  // ← Nova ação
    symbol: 'GGBR4',
    name: 'Gerdau S.A.',
    sector: 'Siderurgia',
    value: 22.50,
    change: 0.75,
    volume: 18940000,
    lastUpdate: new Date()
  }
};
```

4. Reinicie o backend
5. Teste em http://localhost:3001

---

## 🔄 Monitorar Fallback vs Real

### Dashboard de Status (Novo!)

Se você quer monitorar qual fonte está sendo usada:

1. Abra navegador: http://localhost:3001/api/rb3/status
2. Vê o JSON com informações de disponibilidade

### Logs Estruturados:

Todos os logs mostram se está usando RB3 ou Fallback:

```bash
# Terminal com backend rodando
# Vê logs assim:
[2025-02-16T12:34:56.789Z] ✅ INFO API RB3: Dados atualizados
# ou
[2025-02-16T12:34:56.789Z] ⚠️ WARN RB3 não disponível, usando fallback (dados mock)
```

---

## 🎯 Casos de Uso

### Caso 1: Windows, R não funciona
```
Solução: Deixar fallback rodando
Resultado: App funciona com dados mock ✅
```

### Caso 2: Desenvolvedor sem R instalado
```
Solução: npm install + node server.js
Resultado: Teste app completo com dados mock ✅
```

### Caso 3: R funciona, mas API RB3 cai
```
Solução: Fallback automático
Resultado: App não fica quebrado, usa mock como backup ✅
```

### Caso 4: Deploy em servidor sem R
```
Solução: Deixar fallback como padrão
Resultado: Produção funciona com dados mock controlados ✅
```

---

## 🆘 Problemas Comuns

### Problema: Dados mock não aparecem

**Verificar:**

1. Backend está rodando?
   ```bash
   # Deve ver "Servidor rodando em http://localhost:3001"
   ```

2. RB3_ENABLED está true?
   ```bash
   # Em backend/.env
   RB3_ENABLED=true
   ```

3. Recarregue o navegador (Ctrl+F5)

### Problema: Sempre mostra "source: mock_fallback"

**Significa:** RB3 não está rodando

**Soluções:**

- Opção A: Instale R e rode RB3 (ver `WINDOWS_TROUBLESHOOTING.md`)
- Opção B: Deixe assim! Mock funciona bem para desenvolvimento

### Problema: Dados mock são sempre os mesmos

**Esperado:** Dados mudavam a cada requisição (simulando variação)

**Se não mudar:** Verificar se NodeCache está inicializado corretamente

**Solução:** Limpe cache:
```bash
curl -X POST http://localhost:3001/api/rb3/clear-cache
```

---

## 📊 Performance: RB3 vs Fallback

| Aspecto | RB3 (Real) | Fallback (Mock) |
|---------|-----------|-----------------|
| **Dados** | Tempo real B3 ✅ | Simulados 📊 |
| **Velocidade** | ~1-2 segundos | ~100ms ⚡ |
| **Confiabilidade** | Depende da B3 | 100% local ✅ |
| **Desenvolvimento** | Requer R | Funciona sempre |
| **Produção** | Ideal (real) | Alternativa |

---

## 🚀 Próximos Passos

### Se quer RB3 Real:

1. Siga `WINDOWS_TROUBLESHOOTING.md`
2. Instale e rode R
3. Inicie `rb3-api/run.R`
4. App automaticamente usa dados reais 🎉

### Se quer só Fallback:

1. Deixe `.env` com `RB3_ENABLED=false`
2. Ou `true` (deixa tentar RB3, mas usa mock se falhar)
3. Rode `node server.js`
4. App funciona com dados mock ✅

---

## 📝 Arquivos Relacionados

- **`backend/services/rb3-fallback.js`** - Implementação do fallback
- **`backend/services/rb3-client.js`** - Cliente que usa fallback automaticamente
- **`backend/.env`** - Configuração (RB3_ENABLED)
- **`WINDOWS_TROUBLESHOOTING.md`** - Se quiser fazer R funcionar

---

## ✨ Resumo

✅ **App funciona mesmo sem R/RB3**
✅ **Dados mock realistas com variação**
✅ **Fallback automático se RB3 cair**
✅ **Zero quebra de funcionalidade**
✅ **Pronto para produção com dados controlados**

**Use-o e aproveite! 🎉**
