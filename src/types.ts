export type Metric = {
  label: string;
  value: string;
};

export type PerformancePoint = {
  date: string;
  value: number;
};

export type ReturnPoint = {
  from: string;
  to: string;
  return: number;
};

export type BenchmarkMetric = {
  asset: string;
  cagr: string;
  return: string;
  volatility: string;
  sharpe: string;
  drawdown: string;
};

export type PerformanceSnapshot = {
  stats: Array<[string, string]>;
  riskMetrics: Array<[string, string]>;
  narrative: string[];
};
