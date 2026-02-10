// Dados mock de mercado para o app de opções B3

const indices = [
  { symbol: 'IBOVESPA', name: 'IBOVESPA', value: 128530, change: 1.24, changePoints: 1580, chart: [90, 85, 100, 70, 75, 45, 55, 25, 35, 15, 10] },
  { symbol: 'IFIX', name: 'IFIX', value: 3342.10, change: 0.15 },
  { symbol: 'SMLL', name: 'SMALL', value: 2180.45, change: -0.82 },
  { symbol: 'DOLAR', name: 'DÓLAR', value: 4.92, change: -0.12 },
  { symbol: 'BTC', name: 'BTC/BRL', value: 254000, change: 2.41 }
];

const stocksAltas = [
  { ticker: 'PETR4', name: 'Petrobras PN', sector: 'Petróleo, Gás e Biocombustíveis', price: 42.15, change: 3.45 },
  { ticker: 'VALE3', name: 'Vale ON', sector: 'Mineração', price: 67.80, change: 2.10 },
  { ticker: 'ITUB4', name: 'Itaú Unibanco', sector: 'Intermediários Financeiros', price: 34.22, change: 1.85 },
  { ticker: 'BBDC4', name: 'Bradesco PN', sector: 'Bancos', price: 15.88, change: 1.52 },
  { ticker: 'WEGE3', name: 'WEG', sector: 'Equipamentos', price: 38.90, change: 1.20 }
];

const stocksBaixas = [
  { ticker: 'RENT3', name: 'Localiza', sector: 'Aluguel de carros', price: 52.10, change: -2.30 },
  { ticker: 'RAIL3', name: 'Rumo', sector: 'Logística', price: 18.45, change: -1.85 },
  { ticker: 'SUZB3', name: 'Suzano', sector: 'Papel e Celulose', price: 42.00, change: -1.20 }
];

const news = [
  { id: 1, category: 'Política Monetária', title: 'Copom mantém taxa Selic e sinaliza cautela com cenário fiscal.', source: 'InfoMoney', time: '15m atrás', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANla2DB9EFL_55_MZgU6AMWrXo97KOWfUiTnrnvnlXHIoXVFBBV6iOY0J3WkNV2YHzrA9Ja-fXm0e35vJ0-R4MfI6usqUpV7JIPSR4Tza2bIKIgZR_63ZLHXej4041ABSk6YTz_KlFH9elSK_A4ceCib7qC2FdoavpeBX00Oi488Eu5R1oJc1pbOBSyaJR8k8Q4iIgn1KCW0iZWoly-iclqXBxAvqDSVWlDP78cqHCJK-Fx2wwpTP-jpdFBUmdePijFl6WAuGPqZY6' },
  { id: 2, category: 'Corporativo', title: 'Petrobras anuncia dividendos recordes após balanço do 4T.', source: 'Valor Econômico', time: '1h atrás', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBC8peXJc1ESBXwUv1-92xHmHMPNjKR0lb3LNYwBKOCy0yO7Xx6ixdbgR9zeFp72cl1bnOTQwxRaHzcLH82e5r8Rje0qvimazII-cZJ1ru3Vfqy2tTcEfzvmXKIPYyl04XMYG-9j7s7r2hEnx2a3D4a3xjb_1EFazYkrA_lo4OOkQwMZaxbzAKJGepArEy-8ZDCxUyvJUSqaXQ1AHnUxZftIIfCQuChXvpYXVAI_NfRUfG9a6gu5P2u2Dx7mvL962U0PtoK2-0DAynw' }
];

module.exports = { indices, stocksAltas, stocksBaixas, news };
