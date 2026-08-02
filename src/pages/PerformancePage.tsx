import { useEffect, useState } from 'react';
import { BenchmarkTable } from '../components/BenchmarkTable';
import { PerformanceChart } from '../components/PerformanceChart';
import { getPerformanceSnapshot } from '../services/nowDataService';
import type { PerformanceSnapshot } from '../types';

const heatmap = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function PerformancePage() {
  const [snapshot, setSnapshot] = useState<PerformanceSnapshot>({
    stats: [],
    riskMetrics: [],
    narrative: [],
  });

  useEffect(() => {
    getPerformanceSnapshot()
      .then((result) => setSnapshot(result))
      .catch(() => setSnapshot({ stats: [], riskMetrics: [], narrative: [] }));
  }, []);

  return (
    <div className="space-y-6">
      <section className="card p-6">
        <h2 className="text-2xl font-semibold">Performance Dashboard</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {snapshot.stats.map(([label, value]) => (
            <div key={label} className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
              <p className="metric-label">{label}</p>
              <p className="mt-2 text-xl font-semibold text-white">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <PerformanceChart />

      <section className="card p-6">
        <h3 className="text-xl font-semibold">Risk Metrics</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {snapshot.riskMetrics.map(([label, value]) => (
            <div key={label} className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
              <p className="metric-label">{label}</p>
              <p className="mt-2 text-lg font-semibold text-white">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="text-xl font-semibold">Calendar Returns Heatmap</h3>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {heatmap.map((month) => (
              <div key={month} className="rounded-lg bg-slate-800 px-3 py-3 text-center text-sm text-slate-100">{month}</div>
            ))}
          </div>
        </div>
        <div className="card p-6">
          <h3 className="text-xl font-semibold">Interpretation</h3>
          <div className="mt-4 space-y-3 text-slate-300">
            {snapshot.narrative.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="text-xl font-semibold">Rolling Return Heatmap</h3>
          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-slate-300">Rolling return pattern shows resilient positive trend persistence over multiple sovereign and market cycles.</div>
        </div>
        <div className="card p-6">
          <h3 className="text-xl font-semibold">Drawdown Chart</h3>
          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-slate-300">Maximum drawdown remains controlled relative to riskier benchmark assets in the same historical window.</div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="text-xl font-semibold">Monthly Return Distribution</h3>
          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-slate-300">Positive months dominate the return distribution with stable average volatility and low downside skew.</div>
        </div>
        <div className="card p-6">
          <h3 className="text-xl font-semibold">Correlation Matrix</h3>
          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-slate-300">Cross-asset correlation structure provides a convenient overview of diversification and benchmark linkages.</div>
        </div>
      </section>

      <section className="card p-6">
        <h3 className="text-xl font-semibold">Export Features</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          <button className="rounded-full border border-sky-400 px-4 py-2 text-sm text-sky-300">Export PDF Report</button>
          <button className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-100">Export CSV Data</button>
        </div>
      </section>

      <BenchmarkTable />
    </div>
  );
}
