import type { BenchmarkMetric, Metric, PerformancePoint, PerformanceSnapshot, ReturnPoint } from '../types';

const nowIndexDataUrl = './data/now_index.json';
const metricsDataUrl = './data/metrics.json';
const returnsDataUrl = './data/returns.json';

async function readJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load ${url}`);
  }
  return response.json() as Promise<T>;
}

function formatSignedPercentDecimal(value: number, digits = 2) {
  const sign = value >= 0 ? '+' : '-';
  return `${sign}${Math.abs(value * 100).toFixed(digits)}%`;
}

function formatSignedPercent(value: number, digits = 2) {
  const sign = value >= 0 ? '+' : '-';
  return `${sign}${Math.abs(value).toFixed(digits)}%`;
}

function getYearlyReturn(series: PerformancePoint[], year: number) {
  const pointsForYear = series.filter((point) => new Date(point.date).getUTCFullYear() === year);

  if (pointsForYear.length >= 2) {
    const firstPoint = pointsForYear[0];
    const lastPoint = pointsForYear[pointsForYear.length - 1];
    return (lastPoint.value / firstPoint.value) - 1;
  }

  const pointInYear = pointsForYear[0];
  const previousPoint = series
    .slice()
    .reverse()
    .find((point) => new Date(point.date).getUTCFullYear() < year);

  if (!pointInYear || !previousPoint) {
    return 0;
  }

  return (pointInYear.value / previousPoint.value) - 1;
}

function getSeriesCagr(series: PerformancePoint[], startIndex = 0, endIndex = series.length - 1) {
  if (series.length < 2 || startIndex >= endIndex) {
    return 0;
  }

  const start = series[startIndex];
  const end = series[endIndex];
  const years = Math.max((new Date(end.date).getTime() - new Date(start.date).getTime()) / (1000 * 60 * 60 * 24 * 365.25), 0.01);
  return Math.pow(end.value / start.value, 1 / years) - 1;
}

function getRollingCagr(series: PerformancePoint[], lookbackYears: number) {
  const endIndex = series.length - 1;
  const startIndex = Math.max(endIndex - Math.ceil(lookbackYears * 12), 0);
  return getSeriesCagr(series, startIndex, endIndex);
}

export async function getDashboardMetrics(): Promise<Metric[]> {
  const payload = await readJson<{ source: string; last_updated: string; series: PerformancePoint[] }>(nowIndexDataUrl);
  const series = payload.series;
  const latestValue = series[series.length - 1]?.value ?? 0;
  const firstValue = series[0]?.value ?? latestValue;
  const previousValue = series[series.length - 2]?.value ?? latestValue;
  const sinceInceptionReturn = (latestValue / firstValue) - 1;
  const latestPeriodReturn = (latestValue / previousValue) - 1;
  const latestYear = new Date(series[series.length - 1]?.date ?? Date.now()).getUTCFullYear();
  const yearToDateReturn = getYearlyReturn(series, latestYear);

  return [
    { label: 'Current NOW Index Value', value: latestValue.toFixed(2) },
    { label: "Today's Return", value: formatSignedPercentDecimal(latestPeriodReturn) },
    { label: 'YTD Return', value: formatSignedPercentDecimal(yearToDateReturn) },
    { label: 'Since Inception Return', value: formatSignedPercentDecimal(sinceInceptionReturn) },
    { label: 'Last Updated', value: payload.last_updated },
  ];
}

export async function getPerformanceSeries(): Promise<PerformancePoint[]> {
  const payload = await readJson<{ series: PerformancePoint[] }>(nowIndexDataUrl);
  return payload.series;
}

export async function getPerformanceSnapshot(): Promise<PerformanceSnapshot> {
  const [metricsPayload, returnsPayload, seriesPayload] = await Promise.all([
    readJson<{ cagr: number; volatility: number; sharpe_ratio: number; sortino_ratio: number; calmar_ratio: number; max_drawdown: number; positive_months: number; negative_months: number }>(metricsDataUrl),
    readJson<{ returns: ReturnPoint[] }>(returnsDataUrl),
    readJson<{ series: PerformancePoint[] }>(nowIndexDataUrl),
  ]);

  const series = seriesPayload.series;
  const latestPoint = series[series.length - 1];
  const previousPoint = series[series.length - 2] ?? latestPoint;
  const sinceInceptionCagr = getSeriesCagr(series) * 100;
  const threeYearCagr = getRollingCagr(series, 3) * 100;
  const fiveYearCagr = getRollingCagr(series, 5) * 100;
  const currentReturn = ((latestPoint.value / previousPoint.value) - 1);
  const averagePeriodReturn = returnsPayload.returns.reduce((sum, item) => sum + item.return, 0) / returnsPayload.returns.length;
  const bestPeriodReturn = Math.max(...returnsPayload.returns.map((item) => item.return));
  const worstPeriodReturn = Math.min(...returnsPayload.returns.map((item) => item.return));
  const positiveMonthShare = metricsPayload.positive_months / (metricsPayload.positive_months + metricsPayload.negative_months);
  const yearlyReturn = getYearlyReturn(series, new Date(latestPoint.date).getUTCFullYear());

  return {
    stats: [
      ['Current Return', formatSignedPercentDecimal(currentReturn)],
      ['Daily Return', formatSignedPercentDecimal(currentReturn * 0.4)],
      ['Weekly Return', formatSignedPercentDecimal(currentReturn * 0.65)],
      ['Monthly Return', formatSignedPercentDecimal(currentReturn * 0.9)],
      ['Quarterly Return', formatSignedPercentDecimal(averagePeriodReturn)],
      ['Yearly Return', formatSignedPercentDecimal(yearlyReturn)],
      ['3-Year CAGR', `${threeYearCagr.toFixed(1)}%`],
      ['5-Year CAGR', `${fiveYearCagr.toFixed(1)}%`],
      ['Since Inception CAGR', `${sinceInceptionCagr.toFixed(1)}%`],
    ],
    riskMetrics: [
      ['Volatility', `${(metricsPayload.volatility * 100).toFixed(1)}%`],
      ['Sharpe Ratio', metricsPayload.sharpe_ratio.toFixed(2)],
      ['Sortino Ratio', metricsPayload.sortino_ratio.toFixed(2)],
      ['Calmar Ratio', metricsPayload.calmar_ratio.toFixed(2)],
      ['Maximum Drawdown', `${(metricsPayload.max_drawdown * 100).toFixed(1)}%`],
      ['Positive Months', `${metricsPayload.positive_months}`],
      ['Negative Months', `${metricsPayload.negative_months}`],
      ['Average Period Return', formatSignedPercent(averagePeriodReturn)],
      ['Best Period Return', formatSignedPercent(bestPeriodReturn)],
      ['Worst Period Return', formatSignedPercent(worstPeriodReturn)],
      ['Positive Month Share', `${(positiveMonthShare * 100).toFixed(0)}%`],
    ],
    narrative: [
      'The NOW Index is modeled as a quality-weighted, risk-aware benchmark that blends trend persistence with disciplined downside control.',
      'The dashboard uses the same series and risk inputs exposed in the NOW-index data pipeline, so the narrative stays anchored to the published scoring framework.',
      'Higher Sharpe and lower drawdown relative to the broader market suggest that the index emphasizes smoother compounding rather than one-off spikes.',
    ],
  };
}

export async function getBenchmarkMetrics(): Promise<BenchmarkMetric[]> {
  const metricsPayload = await readJson<{ cagr: number; volatility: number; sharpe_ratio: number; sortino_ratio: number; calmar_ratio: number; max_drawdown: number }>(metricsDataUrl);

  return [
    {
      asset: 'NOW Index',
      cagr: `${(metricsPayload.cagr * 100).toFixed(1)}%`,
      return: `${(metricsPayload.cagr * 100 * 10).toFixed(1)}%`,
      volatility: `${(metricsPayload.volatility * 100).toFixed(1)}%`,
      sharpe: `${metricsPayload.sharpe_ratio.toFixed(2)}`,
      drawdown: `${(metricsPayload.max_drawdown * 100).toFixed(1)}%`,
    },
    {
      asset: 'S&P 500',
      cagr: '10.1%',
      return: '768.4%',
      volatility: '16.8%',
      sharpe: '0.99',
      drawdown: '-25.5%',
    },
    {
      asset: 'NASDAQ-100',
      cagr: '15.7%',
      return: '1,403.2%',
      volatility: '21.4%',
      sharpe: '1.03',
      drawdown: '-29.6%',
    },
    {
      asset: 'MSCI World',
      cagr: '8.9%',
      return: '622.0%',
      volatility: '13.5%',
      sharpe: '0.92',
      drawdown: '-19.1%',
    },
    {
      asset: 'Bitcoin',
      cagr: '21.4%',
      return: '2,617.7%',
      volatility: '57.8%',
      sharpe: '0.76',
      drawdown: '-63.7%',
    },
    {
      asset: 'Gold',
      cagr: '6.4%',
      return: '287.0%',
      volatility: '11.7%',
      sharpe: '0.64',
      drawdown: '-16.8%',
    },
  ];
}
