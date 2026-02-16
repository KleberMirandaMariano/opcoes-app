// Dados mock de ações e fundamentos

const stocks = {
  PETR4: {
    ticker: 'PETR4',
    name: 'Petróleo Brasileiro S.A.',
    shortName: 'Petrobras PN',
    sector: 'Petróleo, Gás e Biocombustíveis',
    price: 38.50,
    change: 1.24,
    changeValue: 0.47,
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDiwDkfPYfR5wLPC5llPWQDeJmTdz5YdKSZnmTbaEbJ6Tw0Rq4SX0_vrYCNyvChvtYfpsF3JuCYZXi18Ez2yNjGjYtGpRxngN534NN41SsZkw9N01Dl5bJp4kQOefS9mka7_TLCgUkuNlooH67sKQBZCY88khXC_e8HIpRpFaqYl5muoSBKssdUcef1QLLUCgYcw7VMaT8I1SPgkTraui5jMq2nRV8b1o1MBtxfjajxCp4spJAdPVG-nLn3Fqou4vgt_v6AT2w6Kwx1',
    about: 'A Petrobras é uma empresa de capital aberto, cujo acionista majoritário é o Governo do Brasil, atuando como uma empresa integrada de energia em setores de exploração e produção.',
    fundamentals: { pl: 4.12, dy: 14.5, roe: 32.1, pvp: 1.05 }
  },
  VALE3: {
    ticker: 'VALE3',
    name: 'Vale S.A.',
    shortName: 'Vale ON',
    sector: 'Mineração',
    price: 67.80,
    change: 2.10,
    changeValue: 1.39,
    fundamentals: { pl: 5.2, dy: 8.1, roe: 28.5, pvp: 1.12 }
  },
  ITUB4: {
    ticker: 'ITUB4',
    name: 'Itaú Unibanco S.A.',
    shortName: 'Itaú Unibanco',
    sector: 'Intermediários Financeiros',
    price: 34.22,
    change: 1.85,
    changeValue: 0.62,
    fundamentals: { pl: 8.5, dy: 5.2, roe: 18.2, pvp: 1.08 }
  }
};

// Gráfico intraday (pontos para SVG)
function getChartPoints(ticker, range = '1d') {
  const base = stocks[ticker]?.price || 36;
  const pts = [];
  for (let i = 0; i <= 20; i++) {
    const v = base * (0.98 + (Math.random() * 0.06));
    pts.push(Number(v.toFixed(2)));
  }
  return pts;
}

module.exports = { stocks, getChartPoints };
