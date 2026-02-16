# Script para rodar a API RB3

library(plumber)

# Configurar logs
options(plumber.port = 3002)
options(plumber.maxRequestSize = 500 * 1024 ^ 2)  # 500MB max

# Rodar a API
cat("🚀 Iniciando API RB3...\n")
cat("📍 API rodando em http://localhost:3002\n")
cat("📚 Documentação: http://localhost:3002/__docs__/\n")
cat("\nPressione CTRL+C para parar\n\n")

pr <- plumber::plumb("app.R")
pr %>% plumber::pr_run(host = "127.0.0.1", port = 3002)
