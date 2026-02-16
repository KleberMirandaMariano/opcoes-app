// Cliente API - base URL (mesmo servidor)
const API_BASE = '';

async function api(path, options = {}) {
  try {
    const res = await fetch(API_BASE + path, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options
    });

    if (!res.ok) {
      let errorMessage = `HTTP ${res.status}`;
      try {
        const error = await res.json();
        errorMessage = error.error || errorMessage;
      } catch (e) {
        // Resposta não é JSON válido
      }
      throw new Error(errorMessage);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error('API Error:', err.message);
    throw new Error(err.message || 'Erro na requisição');
  }
}

function nav() {
  return `
  <nav class="fixed bottom-0 left-0 right-0 z-50 bg-background-dark/80 backdrop-blur-2xl border-t border-white/5 px-3 pt-3 pb-8 flex justify-center gap-6">
    <a href="index.html" class="flex flex-col items-center gap-1.5 text-primary">
      <span class="material-symbols-outlined font-variation-fill-1 text-[26px]">home</span>
      <span class="text-[10px] font-extrabold">Início</span>
    </a>
    <a href="ativos.html" class="flex flex-col items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors">
      <span class="material-symbols-outlined text-[26px]">analytics</span>
      <span class="text-[10px] font-extrabold">Ativos</span>
    </a>
    <a href="carteira.html" class="flex flex-col items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors">
      <span class="material-symbols-outlined text-[26px]">pie_chart</span>
      <span class="text-[10px] font-extrabold">Carteira</span>
    </a>
    <a href="config.html" class="flex flex-col items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors">
      <span class="material-symbols-outlined text-[26px]">person</span>
      <span class="text-[10px] font-extrabold">Perfil</span>
    </a>
  </nav>
  <style>
    .font-variation-fill-1 { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
  </style>`;
}

function getQueryParams() {
  const params = {};
  location.search.slice(1).split('&').forEach(param => {
    const [key, value] = param.split('=');
    if (key && value) params[decodeURIComponent(key)] = decodeURIComponent(value);
  });
  return params;
}
