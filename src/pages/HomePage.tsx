import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PerformanceChart } from '../components/PerformanceChart';
import { getDashboardMetrics } from '../services/nowDataService';
import { calculateGrowthScenario } from '../utils/finance';
import type { Metric } from '../types';

export function HomePage() {
  const [metrics, setMetrics] = useState<Metric[]>([]);

  useEffect(() => {
    getDashboardMetrics()
      .then((result) => setMetrics(result))
      .catch(() => setMetrics([]));
  }, []);

  const growthSnapshot = useMemo(() => {
    return calculateGrowthScenario(10000, 0, '2021-01-01', 0.138);
  }, []);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 sm:p-8"
        >
          <p className="metric-label">Professional equality of long-term wealth creation</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Quant_NOW Performance
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">
            Track the historical performance of the proprietary NOW Index through a benchmark-style view of compounding, risk control, and long-horizon ranking behavior.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="metric-label">{metric.label}</div>
                <div className="mt-2 text-lg font-semibold text-white">{metric.value}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="card p-6">
          <div className="metric-label">Investment Growth Snapshot</div>
          <div className="mt-4 text-4xl font-bold text-sky-400">${growthSnapshot.portfolioValue.toFixed(0).toLocaleString()}</div>
          <p className="mt-2 text-slate-300">
            Based on the NOW-index demo series and a representative annualized rate of 13.8%, a $10,000 investment from Jan 1, 2021 would compound to about ${growthSnapshot.portfolioValue.toFixed(0).toLocaleString()} today.
          </p>
          <div className="mt-4 text-sm text-slate-300">
            <span className="font-medium text-white">Total return:</span> {growthSnapshot.totalReturn.toFixed(1)}% · <span className="font-medium text-white">CAGR:</span> {growthSnapshot.cagr.toFixed(1)}%
          </div>
          <Link to="/calculator" className="mt-4 inline-flex rounded-full bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950">View Calculator</Link>
        </div>
      </section>

      <PerformanceChart />
    </div>
  );
}
