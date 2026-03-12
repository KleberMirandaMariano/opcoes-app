export interface MarketStatus {
  isOpen: boolean;
  label: string;
  time: string;
}

/**
 * Calcula as próximas datas de vencimento (3ª sexta-feira de cada mês, padrão B3)
 */
export const getFutureExpiryDates = (count: number = 4): string[] => {
  const dates: string[] = [];
  const current = new Date();

  while (dates.length < count) {
    const year = current.getFullYear();
    const month = current.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const dayOfWeek = firstDayOfMonth.getDay();
    const firstFriday = dayOfWeek <= 5 ? 5 - dayOfWeek + 1 : 5 - dayOfWeek + 8;
    const thirdFriday = new Date(year, month, firstFriday + 14);

    if (thirdFriday > new Date()) {
      dates.push(thirdFriday.toLocaleDateString('pt-BR'));
    }

    current.setMonth(current.getMonth() + 1);
  }

  return dates;
};

/**
 * Retorna o status atual do mercado B3 (horário de Brasília via Intl API)
 */
export const getMarketStatusInfo = (): MarketStatus => {
  // Usa Intl API para obter hora de Brasília corretamente (inclui horário de verão)
  const brt = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));

  const day = brt.getDay();
  const hours = brt.getHours();
  const isOpen = day >= 1 && day <= 5 && hours >= 10 && hours < 18;

  return {
    isOpen,
    label: isOpen ? 'ABERTO' : 'FECHADO',
    time: brt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
  };
};
