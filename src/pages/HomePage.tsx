import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PerformanceChart } from '../components/PerformanceChart';
import { getDashboardMetrics } from '../services/nowDataService';
import type { Metric } from '../types';

export function HomePage() {
  const [metrics, setMetrics] = useState<Metric[]>([]);

  useEffect(() => {
    getDashboardMetrics()
      .then((result) => setMetrics(result))
      .catch(() => setMetrics([]));
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
            Track the historical performance of the proprietary NOW Index.
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
          <div className="mt-4 text-4xl font-bold text-sky-400">$51,524</div>
          <p className="mt-2 text-slate-300">If you invested $10,000 in the NOW Index on Jan 1, 2021, your portfolio would be worth about $51,524 today.</p>
          <Link to="/calculator" className="mt-4 inline-flex rounded-full bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950">View Calculator</Link>
        </div>
      </section>

      <PerformanceChart />
    </div>
  );
}
