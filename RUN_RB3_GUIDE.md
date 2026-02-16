# 🚀 Guia: Como Rodar RB3 no Windows

## Problema: "Rscript não é reconhecido"

R está instalado, mas não está no PATH do Windows. Criei **2 scripts automáticos** que encontram e usam R automaticamente.

---

## ✅ Opção 1: PowerShell (Recomendado)

### Passo 1: Abra PowerShell

No Windows, pressione:
- **Windows + X** → Selecione "Windows PowerShell" ou "Terminal"
- Ou procure por "PowerShell" no menu Iniciar

### Passo 2: Navegue até a pasta do projeto

```powershell
cd C:\Users\klebe\OneDrive\Projetos\opcoes_app
```

(Ajuste o caminho se sua pasta for diferente)

### Passo 3: Rode o script

```powershell
powershell -ExecutionPolicy Bypass -File run-rb3.ps1
```

✅ Esperado ver:
```
🔍 Procurando instalação de R...
✅ Encontrado R em: C:\Program Files\R
✅ Encontrado Rscript em: C:\Program Files\R\R-4.3.x\bin\Rscript.exe

🚀 Iniciando API RB3...
📍 API rodando em http://localhost:3002
```

---

## ✅ Opção 2: CMD (Mais simples)

### Passo 1: Abra CMD

No Windows, pressione:
- **Windows + R** → Digite `cmd` → Enter
- Ou procure por "CMD" no menu Iniciar

### Passo 2: Navegue até a pasta

```cmd
cd C:\Users\klebe\OneDrive\Projetos\opcoes_app
```

### Passo 3: Rode o script

```cmd
run-rb3.bat
```

✅ Esperado ver:
```
🔍 Procurando instalação de R...
✅ Encontrado R em: C:\Program Files\R
✅ Encontrado Rscript em: C:\Program Files\R\R-4.3.x\bin\Rscript.exe

🚀 Iniciando API RB3...
```

---

## 📝 Resumo Rápido

### Terminal 1 (API RB3):
```powershell
cd C:\Users\klebe\OneDrive\Projetos\opcoes_app
powershell -ExecutionPolicy Bypass -File run-rb3.ps1
```

### Terminal 2 (Backend):
```powershell
cd C:\Users\klebe\OneDrive\Projetos\opcoes_app\backend
node server.js
```

### Navegador:
```
http://localhost:3001
```

---

## ❌ Se ainda não funcionar

### Problema: "R não encontrado"

Significa que R **não está instalado ou está em local diferente**.

**Solução:**

1. Baixe R: https://cran.r-project.org/bin/windows/base/
2. Instale normalmente (clique Next até o fim)
3. **IMPORTANTE**: Marque "Add R to PATH" durante instalação
4. Reinicie o terminal e tente novamente

### Problema: "ExecutionPolicy"

Se receber erro sobre ExecutionPolicy, use:

```powershell
powershell -ExecutionPolicy Bypass -File run-rb3.ps1
```

### Problema: ".bat file not found"

Se `.bat` não funcionar, use o `.ps1`:

```powershell
powershell -ExecutionPolicy Bypass -File run-rb3.ps1
```

---

## 🎯 Pronto!

Agora você tem **3 formas de rodar**:

1. ✅ Script PowerShell automático (`run-rb3.ps1`)
2. ✅ Script CMD automático (`run-rb3.bat`)
3. ✅ Caminho completo manual

Use qualquer uma que funcionar! 🚀

---

## 💾 Arquivos criados

- `run-rb3.ps1` - Script PowerShell automático
- `run-rb3.bat` - Script CMD automático
- `RUN_RB3_GUIDE.md` - Este guia

Basta usar um dos scripts e R será encontrado automaticamente!
