# Script PowerShell para rodar RB3 com R encontrado automaticamente
# Use: powershell -ExecutionPolicy Bypass -File run-rb3.ps1

Write-Host "🔍 Procurando instalação de R..." -ForegroundColor Cyan

# Localizações comuns de R no Windows
$possiblePaths = @(
    "C:\Program Files\R",
    "C:\Program Files (x86)\R",
    "${env:ProgramFiles}\R",
    "${env:ProgramFiles(x86)}\R",
    "C:\R",
    "$env:LOCALAPPDATA\R"
)

$rPath = $null
$rscriptPath = $null

# Procurar R em localizações comuns
foreach ($path in $possiblePaths) {
    if (Test-Path $path) {
        Write-Host "✅ Encontrado R em: $path" -ForegroundColor Green

        # Procurar pasta R-x.x.x
        $versions = Get-ChildItem -Path $path -Directory -Filter "R-*" -ErrorAction SilentlyContinue | Sort-Object -Property Name -Descending

        if ($versions) {
            $rscriptPath = Join-Path $versions[0].FullName "bin\Rscript.exe"
            if (Test-Path $rscriptPath) {
                Write-Host "✅ Encontrado Rscript em: $rscriptPath" -ForegroundColor Green
                $rPath = $rscriptPath
                break
            }
        }
    }
}

if (-not $rPath) {
    Write-Host "❌ ERRO: R não encontrado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Solução: Instale R de https://cran.r-project.org/bin/windows/base/" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Depois abra um novo PowerShell e tente novamente."
    exit 1
}

Write-Host ""
Write-Host "🚀 Iniciando API RB3..." -ForegroundColor Cyan
Write-Host "📍 Rscript: $rPath" -ForegroundColor Gray

# Ir para pasta rb3-api e rodar
cd rb3-api
& $rPath run.R
