export type Metric = {
  label: string;
  value: string;
};

export type PerformancePoint = {
  date: string;
  value: number;
};

export type BenchmarkMetric = {
  asset: string;
  cagr: string;
  return: string;
  volatility: string;
  sharpe: string;
  drawdown: string;
};
