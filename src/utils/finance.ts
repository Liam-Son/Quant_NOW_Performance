export function yearsBetween(startDate: string, endDate = new Date().toISOString().slice(0, 10)) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end.getTime() - start.getTime();
  return Math.max(diffMs / (1000 * 60 * 60 * 24 * 365.25), 0.01);
}

export function calculateGrowthScenario(initialInvestment: number, monthlyContribution: number, startDate: string, annualRate = 0.138) {
  const years = yearsBetween(startDate);
  const months = Math.max(Math.round(years * 12), 1);
  const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1;

  let portfolioValue = initialInvestment;
  for (let month = 0; month < months; month += 1) {
    portfolioValue *= 1 + monthlyRate;
    if (month < months - 1) {
      portfolioValue += monthlyContribution;
    }
  }

  const totalContributions = initialInvestment + monthlyContribution * months;
  const profit = portfolioValue - totalContributions;
  const totalReturn = totalContributions === 0 ? 0 : (profit / totalContributions) * 100;
  const cagr = Math.pow(portfolioValue / Math.max(initialInvestment, 1), 1 / Math.max(years, 0.01)) - 1;

  return {
    portfolioValue,
    totalContributions,
    profit,
    totalReturn,
    cagr: cagr * 100,
  };
}
