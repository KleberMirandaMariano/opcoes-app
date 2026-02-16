@echo off
REM Script simples para encontrar R no Windows

echo.
echo 🔍 Procurando R no computador...
echo.

REM Verificar localizações comuns
if exist "C:\Program Files\R" (
    echo ✅ Encontrado em: C:\Program Files\R
    dir "C:\Program Files\R" /B /AD
    echo.
)

if exist "C:\Program Files (x86)\R" (
    echo ✅ Encontrado em: C:\Program Files (x86)\R
    dir "C:\Program Files (x86)\R" /B /AD
    echo.
)

if exist "C:\R" (
    echo ✅ Encontrado em: C:\R
    dir "C:\R" /B /AD
    echo.
)

echo.
echo Se não viu nenhum resultado acima, R não está instalado.
echo Instale de: https://cran.r-project.org/bin/windows/base/
echo.
pause
