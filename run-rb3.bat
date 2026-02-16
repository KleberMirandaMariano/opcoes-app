@echo off
REM Script para rodar RB3 com R encontrado automaticamente
REM Use: run-rb3.bat

echo.
echo 🔍 Procurando instalação de R...
echo.

REM Verificar localizações comuns
if exist "C:\Program Files\R" (
    echo ✅ Encontrado R em: C:\Program Files\R

    REM Procurar pasta R-x.x.x mais recente
    for /d %%d in ("C:\Program Files\R\R-*") do (
        set RPATH=%%d
    )

    if exist "!RPATH!\bin\Rscript.exe" (
        echo ✅ Encontrado Rscript em: !RPATH!\bin\Rscript.exe
        echo.
        echo 🚀 Iniciando API RB3...
        echo.
        cd rb3-api
        "!RPATH!\bin\Rscript.exe" run.R
        exit /b 0
    )
)

if exist "C:\Program Files (x86)\R" (
    echo ✅ Encontrado R em: C:\Program Files (x86)\R

    for /d %%d in ("C:\Program Files (x86)\R\R-*") do (
        set RPATH=%%d
    )

    if exist "!RPATH!\bin\Rscript.exe" (
        echo ✅ Encontrado Rscript em: !RPATH!\bin\Rscript.exe
        echo.
        echo 🚀 Iniciando API RB3...
        echo.
        cd rb3-api
        "!RPATH!\bin\Rscript.exe" run.R
        exit /b 0
    )
)

echo.
echo ❌ ERRO: R não encontrado!
echo.
echo 💡 Solução: Instale R de https://cran.r-project.org/bin/windows/base/
echo.
echo Depois abra um novo CMD/PowerShell e tente novamente.
echo.
pause
