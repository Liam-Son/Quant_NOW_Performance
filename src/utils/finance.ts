import type { PerformancePoint } from '../types';

export type GrowthResult = {
  portfolioValue: number;
  totalContributions: number;
  profit: number;
  totalReturn: number;
  cagr: number;
};

export type ActualGrowthResult = GrowthResult & {
  indexValueAtStart: number;
  indexValueNow: number;
  isProjected: boolean;
};

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

/** Find the interpolated index value for a given date from the series. */
function interpolateIndexValue(series: PerformancePoint[], date: string): number | null {
  if (series.length === 0) return null;

  const target = new Date(date).getTime();

  // Before or at the first data point
  if (target <= new Date(series[0].date).getTime()) return series[0].value;

  // After or at the last data point
  if (target >= new Date(series[series.length - 1].date).getTime()) return series[series.length - 1].value;

  // Interpolate between two surrounding points
  for (let i = 0; i < series.length - 1; i++) {
    const current = new Date(series[i].date).getTime();
    const next = new Date(series[i + 1].date).getTime();

    if (target >= current && target <= next) {
      const ratio = (next - current) === 0 ? 0 : (target - current) / (next - current);
      return series[i].value + ratio * (series[i + 1].value - series[i].value);
    }
  }

  return null;
}

/** Compute the CAGR of the full index series. */
function getSeriesCagr(series: PerformancePoint[]): number {
  if (series.length < 2) return 0;
  const start = series[0];
  const end = series[series.length - 1];
  const years = Math.max(
    (new Date(end.date).getTime() - new Date(start.date).getTime()) / (1000 * 60 * 60 * 24 * 365.25),
    0.01,
  );
  return Math.pow(end.value / start.value, 1 / years) - 1;
}

/**
 * Calculate investment growth using the actual NOW Index price series.
 *
 * - If the investment date falls within the historical data range, growth is
 *   computed from the real index values (with interpolation).
 * - If the date is beyond the latest data point, the series CAGR is used for
 *   forward projection.
 * - Monthly contributions are weighted by the index growth from each
 *   contribution date onward.
 */
export function calculateActualGrowth(
  series: PerformancePoint[],
  initialInvestment: number,
  monthlyContribution: number,
  startDate: string,
): ActualGrowthResult {
  // Fallback if we don't have enough data
  if (series.length < 2) {
    const fallback = calculateGrowthScenario(initialInvestment, monthlyContribution, startDate, 0.138);
    return {
      ...fallback,
      indexValueAtStart: 0,
      indexValueNow: 0,
      isProjected: true,
    };
  }

  const latestPoint = series[series.length - 1];
  const latestIndexValue = latestPoint.value;
  const latestDate = latestPoint.date;
  const seriesCagr = getSeriesCagr(series);

  // Find the index value at the investment date
  const startIndexValue = interpolateIndexValue(series, startDate);

  if (startIndexValue === null) {
    // Can't find a value – project using CAGR
    const projected = calculateGrowthScenario(initialInvestment, monthlyContribution, startDate, seriesCagr * 100);
    return {
      ...projected,
      indexValueAtStart: 0,
      indexValueNow: latestIndexValue,
      isProjected: true,
    };
  }

  const startDateMs = new Date(startDate).getTime();
  const latestDateMs = new Date(latestDate).getTime();

  // If the investment date is at or after the latest data point, forward-project
  if (startDateMs >= latestDateMs) {
    const projected = calculateGrowthScenario(initialInvestment, monthlyContribution, startDate, seriesCagr * 100);
    return {
      ...projected,
      indexValueAtStart: startIndexValue,
      indexValueNow: latestIndexValue,
      isProjected: true,
    };
  }

  // ── Actual (historical) growth ──────────────────────────────────────
  const growthRatio = latestIndexValue / startIndexValue;

  // Initial investment grows by the full index ratio
  let portfolioValue = initialInvestment * growthRatio;

  // Monthly contributions: each one grows from its own date
  if (monthlyContribution > 0) {
    const years = yearsBetween(startDate, latestDate);
    const months = Math.max(Math.round(years * 12), 1);

    for (let month = 0; month < months; month++) {
      const contributionDate = new Date(startDate);
      contributionDate.setMonth(contributionDate.getMonth() + month + 1);
      const contribDateStr = contributionDate.toISOString().slice(0, 10);

      // Stop if contribution date is beyond the latest data point
      if (new Date(contribDateStr).getTime() >= latestDateMs) break;

      const contribIndexValue = interpolateIndexValue(series, contribDateStr);
      if (contribIndexValue !== null) {
        portfolioValue += monthlyContribution * (latestIndexValue / contribIndexValue);
      } else {
        // If we can't find the index value, just add the contribution
        portfolioValue += monthlyContribution;
      }
    }
  }

  const totalContributions =
    initialInvestment +
    monthlyContribution * Math.max(Math.round(yearsBetween(startDate, latestDate) * 12), 0);

  const profit = portfolioValue - totalContributions;
  const totalReturn = totalContributions === 0 ? 0 : (profit / totalContributions) * 100;
  const years = Math.max(yearsBetween(startDate, latestDate), 0.01);
  const cagr = Math.pow(portfolioValue / Math.max(initialInvestment, 1), 1 / years) - 1;

  return {
    portfolioValue,
    totalContributions,
    profit,
    totalReturn,
    cagr: cagr * 100,
    indexValueAtStart: startIndexValue,
    indexValueNow: latestIndexValue,
    isProjected: false,
  };
}
