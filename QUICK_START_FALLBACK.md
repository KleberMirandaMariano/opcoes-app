# ⚡ Quick Start - Usar Opciones App SEM R/RB3

**Duração:** 2 minutos

Se R não funciona, use dados mock locais! 👇

---

## 🎯 Opção Mais Rápida (Recomendado)

### Terminal 1:
```bash
cd backend
npm install
node server.js
```

**Esperado ver:**
```
ℹ️ [INFO] Servidor rodando em http://localhost:3001
```

✅ **Pronto!** O app funciona automaticamente com dados mock.

---

## 🌐 Abra no Navegador:

```
http://localhost:3001
```

**Você verá:**
- ✅ Dashboard com índices (IBOVESPA, DOLAR, BTC, IFIX)
- ✅ Ações em tempo real: PETR4, VALE3, ITUB4, BBAS3, WEGE3
- ✅ Gráficos e dados completos
- ✅ Tudo funcionando com dados simulados 📊

---

## ⚙️ Configuração

Se quiser garantir que NÃO tenta usar RB3:

1. Abra `backend/.env`
2. Adicione:
   ```
   RB3_ENABLED=false
   ```
3. Reinicie o backend

---

## 🔍 Verificar Status

```bash
curl http://localhost:3001/api/rb3/status
```

**Resposta esperada:**
```json
{
  "available": true,
  "source": "mock_fallback",
  "message": "Usando dados mock (RB3 não disponível)"
}
```

---

## 🎉 Pronto!

App funcionando 100% sem R/RB3! 🚀

Para dados reais da B3 depois, veja: `WINDOWS_TROUBLESHOOTING.md`
