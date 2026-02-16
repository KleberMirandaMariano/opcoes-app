#!/bin/bash

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║        🚀 Iniciando Opçõesexpert + Backend Node.js            ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"

echo ""
echo "📋 Verificando instalação de dependências..."

if [ ! -d "node_modules" ]; then
  echo "⬇️  Instalando dependências do frontend..."
  npm install
fi

if [ ! -d "backend/node_modules" ]; then
  echo "⬇️  Instalando dependências do backend..."
  cd backend
  npm install
  cd ..
fi

echo ""
echo "✅ Tudo pronto!"
echo ""
echo "📊 Iniciando..."
echo "   🖥️  Frontend React: http://localhost:3000"
echo "   🔌 Backend API: http://localhost:3001"
echo ""

npm run dev
