# 🔧 WINDOWS - Guia Completo de Troubleshooting RB3

**Data:** 16 de Fevereiro, 2025
**Problema:** Scripts automáticos não funcionam, Rscript não é reconhecido

---

## 🎯 ESTRATÉGIA DE TROUBLESHOOTING

Se os scripts automáticos (`run-rb3.ps1` e `run-rb3.bat`) **NÃO funcionaram**, siga este guia passo a passo para identificar e resolver o problema.

---

## PASSO 1: Verificar se R está instalado

### Opção A: Verificação Manual via Explorer

1. Abra **File Explorer** (Windows Explorer)
2. Cole na barra de endereço:
   ```
   C:\Program Files\R
   ```
3. Pressione **Enter**

**Você deve ver uma ou mais pastas como:**
- `R-4.3.2`
- `R-4.4.0`
- Ou similar (com número de versão)

**Se aparecer erro "Pasta não encontrada":**
- Tente também em `C:\Program Files (x86)\R`
- Se ambas não existirem, **R NÃO está instalado** → Vá para PASSO 2

**Se encontrou a pasta:**
- Vá para PASSO 3

---

### Opção B: Verificação via CMD

1. Abra **CMD** (Windows + R → `cmd` → Enter)
2. Cole este comando:
   ```cmd
   dir "C:\Program Files\R"
   ```
3. Pressione **Enter**

**Se aparecer lista de pastas R-x.x.x:**
- Anote a versão (ex: `R-4.3.2`)
- Vá para PASSO 3

**Se aparecer erro "O caminho não foi encontrado":**
- Tente: `dir "C:\Program Files (x86)\R"`
- Se ambos falharem → **R não está instalado** → Vá para PASSO 2

---

## PASSO 2: Instalar R (SE NÃO ESTIVER INSTALADO)

### Passo 2.1: Download

1. Abra seu navegador
2. Vá para: https://cran.r-project.org/bin/windows/base/
3. Clique em **"Download R-4.4.x for Windows"** (a versão mais recente)

### Passo 2.2: Instalação

1. Execute o arquivo baixado (`.exe`)
2. Clique **"Next"** até a tela de opções
3. **IMPORTANTE - Marque TODAS estas opções:**
   - ✅ "Add R to PATH"
   - ✅ "Associate .RData files"
   - ✅ "Associate .Rhistory files"
4. Continue clicando **"Next"** até **"Finish"**

### Passo 2.3: Reiniciar e Testar

1. **Feche todos os terminais abertos**
2. **Reinicie o computador** (importante!)
3. Abra um novo CMD
4. Digite: `Rscript --version`

**Se aparecer algo como "R scripting front-end version 4.3.2":**
- R foi instalado com sucesso!
- Vá para PASSO 4

**Se aparecer "Rscript não é reconhecido":**
- A instalação não adicionou ao PATH corretamente
- Vá para PASSO 3

---

## PASSO 3: Encontrar o Caminho Completo de Rscript.exe

Se R está instalado mas `Rscript` não é reconhecido globalmente, vamos encontrar o caminho completo.

### Opção A: Via CMD (Mais rápido)

1. Abra **CMD**
2. Cole este comando:
   ```cmd
   dir /s "C:\Program Files\R\*/Rscript.exe" 2>nul
   ```

**Esperado ver algo como:**
```
C:\Program Files\R\R-4.3.2\bin\Rscript.exe
```

**Se não encontrou lá, tente:**
```cmd
dir /s "C:\Program Files (x86)\R\*/Rscript.exe" 2>nul
```

### Opção B: Via PowerShell (Mais seguro)

1. Abra **PowerShell**
2. Cole:
   ```powershell
   Get-ChildItem -Path "C:\Program Files\R" -Filter "Rscript.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object FullName
   ```

**Esperado ver:**
```
C:\Program Files\R\R-4.3.2\bin\Rscript.exe
```

### Opção C: Via File Explorer (Visual)

1. Abra **File Explorer**
2. Vá para: `C:\Program Files\R`
3. Abra a pasta `R-4.x.x` (a versão que encontrou)
4. Abra `bin`
5. Procure `Rscript.exe`

**Copie o caminho completo que aparece na barra de endereço.**

---

## PASSO 4: Rodar RB3 com o Caminho Completo

Agora que você tem o caminho de `Rscript.exe`, vamos rodar RB3 manualmente.

### Método 1: CMD (Mais simples)

1. Abra **CMD**
2. Navegue até a pasta do projeto:
   ```cmd
   cd C:\Users\klebe\OneDrive\Projetos\opcoes_app
   ```
3. Cole este comando (substitua o caminho se for diferente):
   ```cmd
   "C:\Program Files\R\R-4.3.2\bin\Rscript.exe" rb3-api/run.R
   ```

**⚠️ Lembre-se de ajustar:**
- `4.3.2` → use sua versão (ex: 4.4.0, 4.3.3)
- O caminho deve estar entre aspas duplas `"..."`

### Método 2: PowerShell (Alternativa)

1. Abra **PowerShell** (Windows + X → PowerShell)
2. Navegue até a pasta:
   ```powershell
   cd C:\Users\klebe\OneDrive\Projetos\opcoes_app
   ```
3. Cole:
   ```powershell
   & "C:\Program Files\R\R-4.3.2\bin\Rscript.exe" rb3-api/run.R
   ```

### Esperado Ver

```
🚀 Iniciando API RB3...
📍 API rodando em http://localhost:3002
📚 Documentação: http://localhost:3002/__docs__/

Pressione CTRL+C para parar
```

**Se viu isso:** ✅ RB3 está funcionando!

---

## PASSO 5: Se Ainda NÃO Funcionou

### Erro 1: "rb3 package not found"

**Solução:**
1. Abra um novo CMD
2. Na pasta do projeto:
   ```cmd
   "C:\Program Files\R\R-4.3.2\bin\Rscript.exe" rb3-api/setup.R
   ```
3. Espere instalar tudo (pode levar 5-10 minutos)
4. Depois tente novamente rodar `run.R`

### Erro 2: "plumber not found"

**Mesma solução do Erro 1**

### Erro 3: Caminho muito longo / Erro de sintaxe

**Solução alternativa - Use R GUI:**

1. Abra **R** (procure no menu Iniciar)
2. Na console do R, digite:
   ```r
   setwd("C:/Users/klebe/OneDrive/Projetos/opcoes_app/rb3-api")
   source("run.R")
   ```

### Erro 4: Porta 3002 já está em uso

**Solução:**
1. Feche qualquer outro CMD/PowerShell que esteja rodando RB3
2. Ou mude a porta em `rb3-api/run.R` (linha 3)

---

## PASSO 6: Criar um Atalho Permanente (Opcional)

Se conseguiu rodar com sucesso, vamos criar um atalho para não ter que digitar o comando toda vez:

### Criar arquivo `.bat` personalizado:

1. Abra **Notepad**
2. Cole isto (substituindo sua versão de R):
   ```batch
   @echo off
   cd /d C:\Users\klebe\OneDrive\Projetos\opcoes_app
   "C:\Program Files\R\R-4.3.2\bin\Rscript.exe" rb3-api/run.R
   pause
   ```
3. Salve como **`RUN_RB3.bat`** na pasta do projeto
4. Daqui em diante, basta **duplo-clique** em `RUN_RB3.bat` para rodar!

---

## 🆘 Ainda Não Funcionou?

Se mesmo após todos estes passos não funcionar, vamos para o **Plano B: Modo Híbrido**.

O Opciones App pode rodar **apenas com dados simulados** até que R/RB3 seja resolvido:

### Ativar Modo Híbrido:

1. Abra `backend/.env`
2. Mude para:
   ```
   RB3_ENABLED=false
   ```
3. Assim o app usará Brapi, HG Brasil e dados mock
4. Não será tempo real, mas funcionará!

### Depois, para reativar RB3:

Quando R estiver funcionando:
1. Mude de volta para: `RB3_ENABLED=true`
2. Reinicie o backend

---

## 📋 Checklist Resumido

- [ ] R está instalado? (verificou em C:\Program Files\R ou C:\Program Files (x86)\R)
- [ ] Encontrou o caminho completo de Rscript.exe?
- [ ] Conseguiu rodar: `"C:\...\Rscript.exe" rb3-api/run.R`?
- [ ] Viu a mensagem "API rodando em http://localhost:3002"?
- [ ] Backend está rodando? (Terminal 2: `node server.js`)
- [ ] Frontend carrega? (http://localhost:3001)

---

## 💡 Comandos Úteis para Debug

### Ver se porta 3002 está em uso:
```cmd
netstat -ano | findstr :3002
```

### Ver detalhes do R instalado:
```cmd
"C:\Program Files\R\R-4.3.2\bin\Rscript.exe" --version
```

### Listar pacotes R instalados:
```cmd
"C:\Program Files\R\R-4.3.2\bin\Rscript.exe" -e "installed.packages()"
```

---

## 📞 Próximos Passos

1. Siga este guia do **PASSO 1** até encontrar o problema
2. Execute o comando apropriado para sua situação
3. Reporte qual **PASSO** ficou travado e qual erro exato apareceu
4. Então poderemos resolver com precisão!

**Boa sorte! 🚀**
