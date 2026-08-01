import type { BenchmarkMetric } from '../types';

export const benchmarkMetrics: BenchmarkMetric[] = [
  { asset: 'NOW Index', cagr: '13.8%', return: '1,184.6%', volatility: '14.2%', sharpe: '1.12', drawdown: '-21.0%' },
  { asset: 'S&P 500', cagr: '10.1%', return: '768.4%', volatility: '16.8%', sharpe: '0.99', drawdown: '-25.5%' },
  { asset: 'NASDAQ-100', cagr: '15.7%', return: '1,403.2%', volatility: '21.4%', sharpe: '1.03', drawdown: '-29.6%' },
  { asset: 'MSCI World', cagr: '8.9%', return: '622.0%', volatility: '13.5%', sharpe: '0.92', drawdown: '-19.1%' },
  { asset: 'Bitcoin', cagr: '21.4%', return: '2,617.7%', volatility: '57.8%', sharpe: '0.76', drawdown: '-63.7%' },
  { asset: 'Gold', cagr: '6.4%', return: '287.0%', volatility: '11.7%', sharpe: '0.64', drawdown: '-16.8%' },
];
