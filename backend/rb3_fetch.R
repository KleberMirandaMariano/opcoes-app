library(rb3)
library(jsonlite)
library(dplyr)

args <- commandArgs(trailingOnly = TRUE)
command <- args[1]
ticker <- if(length(args) > 1) args[2] else NULL

# Função para formatar números para JSON seguro
clean_data <- function(df) {
  if (is.null(df) || nrow(df) == 0) return(data.frame())
  
  # Converter fatores para strings e lidar com valores infinitos/NA
  df %>% 
    mutate(across(where(is.factor), as.character)) %>%
    mutate(across(where(is.numeric), ~ifelse(is.finite(.), ., 0)))
}

tryCatch({
  if (command == "indices") {
    # Ibovespa e outros índices
    data <- rb3::display_indices()
    cat(toJSON(list(success = TRUE, data = clean_data(data)), auto_unbox = TRUE))
    
  } else if (command == "stock" && !is.null(ticker)) {
    # Cotação de uma ação
    data <- rb3::yc_get(ticker)
    cat(toJSON(list(success = TRUE, data = clean_data(data)), auto_unbox = TRUE))
    
  } else if (command == "options" && !is.null(ticker)) {
    # Cadeia de opções
    # rb3 fornece opções através de diferentes funções dependendo da versão
    # Tentando obter dados de derivativos
    data <- rb3::options_get(ticker)
    cat(toJSON(list(success = TRUE, data = clean_data(data)), auto_unbox = TRUE))
    
  } else if (command == "market_list") {
    # Lista de ações do dia
    data <- rb3::stock_quotes_get()
    cat(toJSON(list(success = TRUE, data = clean_data(data)), auto_unbox = TRUE))
    
  } else {
    cat(toJSON(list(success = FALSE, error = "Comando inválido ou ticker ausente"), auto_unbox = TRUE))
  }
}, error = function(e) {
  cat(toJSON(list(success = FALSE, error = as.character(e)), auto_unbox = TRUE))
})
