# Setup da API RB3
# Execute este script uma vez para instalar as dependências

# Verificar e instalar pacotes necessários
required_packages <- c("plumber", "rb3", "tidyverse", "jsonlite")

for (pkg in required_packages) {
  if (!require(pkg, character.only = TRUE)) {
    cat(sprintf("Instalando %s...\n", pkg))
    if (pkg == "rb3") {
      # rb3 pode estar no GitHub
      remotes::install_github("lfpdrocha/rb3")
    } else {
      install.packages(pkg)
    }
  }
}

cat("✅ Todas as dependências foram instaladas!\n")
cat("\nPara rodar a API, execute:\n")
cat("  plumber::plumb_api('app.R') %>% pr_run(port = 3002)\n")
