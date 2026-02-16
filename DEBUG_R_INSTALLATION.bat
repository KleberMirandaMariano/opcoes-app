@echo off
REM Script de Debug Completo para R no Windows
REM Diagnóstico detalhado de instalação de R

echo.
echo ====================================================
echo   DEBUG: Procurando Instalação de R no Windows
echo   Data: %date% %time%
echo ====================================================
echo.

REM Verificar se tem acesso ao CMD
echo [1] Verificando ambiente...
ver > nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ CMD funcionando
) else (
    echo ✗ Erro ao inicializar CMD
    exit /b 1
)

echo.
echo [2] Procurando R em localizações comuns...
echo.

REM Verificar C:\Program Files\R
echo --- Verificando: C:\Program Files\R ---
if exist "C:\Program Files\R" (
    echo ✓ Pasta encontrada!
    echo.
    echo Versões disponíveis:
    dir "C:\Program Files\R" /B /AD
    echo.

    REM Procurar Rscript.exe
    if exist "C:\Program Files\R\R-*\bin\Rscript.exe" (
        for /d %%d in ("C:\Program Files\R\R-*") do (
            set "RDIR=%%d"
            if exist "!RDIR!\bin\Rscript.exe" (
                echo ✓ Encontrado: !RDIR!\bin\Rscript.exe
            )
        )
    )
) else (
    echo ✗ Pasta não encontrada
)

echo.
echo --- Verificando: C:\Program Files (x86)\R ---
if exist "C:\Program Files (x86)\R" (
    echo ✓ Pasta encontrada!
    echo.
    echo Versões disponíveis:
    dir "C:\Program Files (x86)\R" /B /AD
    echo.

    REM Procurar Rscript.exe
    if exist "C:\Program Files (x86)\R\R-*\bin\Rscript.exe" (
        for /d %%d in ("C:\Program Files (x86)\R\R-*") do (
            set "RDIR=%%d"
            if exist "!RDIR!\bin\Rscript.exe" (
                echo ✓ Encontrado: !RDIR!\bin\Rscript.exe
            )
        )
    )
) else (
    echo ✗ Pasta não encontrada
)

echo.
echo --- Verificando: C:\R ---
if exist "C:\R" (
    echo ✓ Pasta encontrada!
    dir "C:\R" /B /AD
) else (
    echo ✗ Pasta não encontrada
)

echo.
echo [3] Testando comando Rscript global...
where Rscript.exe > nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✓ Rscript encontrado no PATH
    for /f "tokens=*" %%A in ('where Rscript.exe') do (
        echo   Caminho: %%A
        %%A --version
    )
) else (
    echo ✗ Rscript NÃO está no PATH
    echo   (R pode estar instalado mas não adicionado ao PATH)
)

echo.
echo [4] Verificando pasta do projeto...
cd /d "C:\Users\klebe\OneDrive\Projetos\opcoes_app" 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ Projeto acessível em:
    echo   %CD%

    if exist "rb3-api\run.R" (
        echo ✓ rb3-api\run.R encontrado
    ) else (
        echo ✗ rb3-api\run.R NÃO encontrado
    )
) else (
    echo ✗ Erro ao acessar pasta do projeto
)

echo.
echo [5] Testando R com versão...
setlocal enabledelayedexpansion
for /d %%d in ("C:\Program Files\R\R-*") do (
    set "RPATH=%%d"
)

if defined RPATH (
    echo ✓ Tentando executar R...
    "!RPATH!\bin\Rscript.exe" --version
    if %ERRORLEVEL% EQU 0 (
        echo ✓ R funcionando!
    ) else (
        echo ✗ Erro ao executar R
    )
) else (
    echo ✗ R não encontrado em C:\Program Files\R
)

echo.
echo ====================================================
echo   RESUMO
echo ====================================================
echo.
echo Se todos os testes passaram (✓):
echo   - R está instalado e funcionando
echo   - Use este comando para rodar RB3:
echo     "!RPATH!\bin\Rscript.exe" rb3-api/run.R
echo.
echo Se alguns testes falharam (✗):
echo   - Veja qual passo falhou acima
echo   - Consulte WINDOWS_TROUBLESHOOTING.md para solução
echo.
echo ====================================================
echo.
pause
