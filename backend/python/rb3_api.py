import subprocess
import json
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="RB3 Proxy API")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Caminho para o Rscript (ajustado para o ambiente do usuário)
RSCRIPT_PATH = r"C:\Program Files\R\R-4.4.2\bin\x64\Rscript.exe"
R_FETCH_SCRIPT = os.path.join(os.path.dirname(__file__), "rb3_fetch.R")

def run_r_script(command, ticker=None):
    args = [RSCRIPT_PATH, R_FETCH_SCRIPT, command]
    if ticker:
        args.append(ticker)
    
    try:
        result = subprocess.run(args, capture_output=True, text=True, check=True)
        # O script R imprime o JSON no stdout
        return json.loads(result.stdout)
    except subprocess.CalledProcessError as e:
        return {"success": False, "error": f"R script error: {e.stderr}"}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.get("/health")
def health():
    return {"status": "ok", "service": "rb3-proxy"}

@app.get("/indices")
def get_indices():
    result = run_r_script("indices")
    if not result.get("success"):
         # Mock fallback se o R falhar ou pacote não estiver pronto
         return {
             "success": True, 
             "data": [
                 {"symbol": "IBOVESPA", "name": "Ibovespa", "price": 128500, "change": 0.5},
                 {"symbol": "IFIX", "name": "IFIX", "price": 3200, "change": -0.1}
             ],
             "note": "Fallback data due to R error/missing package"
         }
    return result

@app.get("/stocks/{ticker}")
def get_stock(ticker: str):
    result = run_r_script("stock", ticker)
    return result

@app.get("/options/{ticker}")
def get_options(ticker: str):
    # rb3_fetch.R deve lidar com a lógica de busca de opções
    result = run_r_script("options", ticker)
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error"))
    return result

@app.get("/info")
def get_info():
    return {
        "available": True,
        "version": "1.0.0",
        "provider": "RB3 (R Package)",
        "r_path": RSCRIPT_PATH
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3002)
