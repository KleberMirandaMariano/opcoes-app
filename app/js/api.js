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
  <nav class="fixed bottom-0 left-0 right-0 z-50 bg-background-dark/80 backdrop-blur-2xl border-t border-white/5 px-3 pt-3 pb-8 flex justify-center gap-6
              md:fixed md:left-0 md:top-0 md:bottom-auto md:right-auto md:w-64 md:border-r md:border-t-0 md:border-b-0
              md:flex-col md:h-screen md:pb-0 md:gap-2 md:px-6 md:overflow-y-auto">
    <a href="index.html" class="flex flex-col items-center gap-1.5 text-primary md:text-left md:flex-row md:gap-3 md:px-3 md:py-2 md:rounded hover:bg-white/5">
      <span class="material-symbols-outlined font-variation-fill-1 text-[26px]">home</span>
      <span class="text-[10px] font-extrabold md:text-sm">Início</span>
    </a>
    <a href="ativos.html" class="flex flex-col items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors md:text-left md:flex-row md:gap-3 md:px-3 md:py-2 md:rounded">
      <span class="material-symbols-outlined text-[26px]">analytics</span>
      <span class="text-[10px] font-extrabold md:text-sm">Ativos</span>
    </a>
    <a href="carteira.html" class="flex flex-col items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors md:text-left md:flex-row md:gap-3 md:px-3 md:py-2 md:rounded">
      <span class="material-symbols-outlined text-[26px]">pie_chart</span>
      <span class="text-[10px] font-extrabold md:text-sm">Carteira</span>
    </a>
    <a href="config.html" class="flex flex-col items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors md:text-left md:flex-row md:gap-3 md:px-3 md:py-2 md:rounded">
      <span class="material-symbols-outlined text-[26px]">person</span>
      <span class="text-[10px] font-extrabold md:text-sm">Perfil</span>
    </a>
  </nav>
  <style>
    .font-variation-fill-1 { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
    @media (min-width: 768px) {
      body { margin-left: 256px; }
    }
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
