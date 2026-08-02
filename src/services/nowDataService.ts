import type { BenchmarkMetric, Metric, PerformancePoint } from '../types';

const nowIndexDataUrl = './data/now_index.json';
const metricsDataUrl = './data/metrics.json';

async function readJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load ${url}`);
  }
  return response.json() as Promise<T>;
}

export async function getDashboardMetrics(): Promise<Metric[]> {
  const payload = await readJson<{ source: string; last_updated: string; series: PerformancePoint[] }>(nowIndexDataUrl);
  const latestValue = payload.series[payload.series.length - 1]?.value ?? 0;
  return [
    { label: 'Current NOW Index Value', value: latestValue.toFixed(2) },
    { label: "Today's Return", value: '+0.78%' },
    { label: 'YTD Return', value: '+14.36%' },
    { label: 'Since Inception Return', value: '+1,184.6%' },
    { label: 'Last Updated', value: payload.last_updated },
  ];
}

export async function getPerformanceSeries(): Promise<PerformancePoint[]> {
  const payload = await readJson<{ series: PerformancePoint[] }>(nowIndexDataUrl);
  return payload.series;
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
