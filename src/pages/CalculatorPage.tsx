import { useEffect, useMemo, useState } from 'react';
import { calculateActualGrowth } from '../utils/finance';
import { getPerformanceSeries } from '../services/nowDataService';
import type { PerformancePoint } from '../types';
import type { ActualGrowthResult } from '../utils/finance';

const examples = [100, 500, 1000, 5000, 10000, 50000, 100000];

export function CalculatorPage() {
  const [series, setSeries] = useState<PerformancePoint[]>([]);
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(0);
  const [investmentDate, setInvestmentDate] = useState('2021-01-01');

  useEffect(() => {
    getPerformanceSeries()
      .then((data) => setSeries(data))
      .catch(() => setSeries([]));
  }, []);

  const result = useMemo<ActualGrowthResult>(() => {
    if (series.length < 2) {
      return {
        portfolioValue: 0,
        totalContributions: 0,
        profit: 0,
        totalReturn: 0,
        cagr: 0,
        indexValueAtStart: 0,
        indexValueNow: 0,
        isProjected: false,
      };
    }
    return calculateActualGrowth(series, initialInvestment, monthlyContribution, investmentDate);
  }, [series, initialInvestment, monthlyContribution, investmentDate]);

  return (
    <div className="space-y-6">
      <section className="card p-6">
        <h2 className="text-2xl font-semibold">Investment Growth Simulator</h2>
        <div className="mt-4 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <label className="block">
              <span className="metric-label">Initial Investment</span>
              <input className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3" type="number" value={initialInvestment} onChange={(e) => setInitialInvestment(Number(e.target.value))} />
            </label>
            <label className="block">
              <span className="metric-label">Investment Date</span>
              <input className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3" type="date" value={investmentDate} onChange={(e) => setInvestmentDate(e.target.value)} />
            </label>
            <label className="block">
              <span className="metric-label">Optional Monthly Contribution</span>
              <input className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3" type="number" value={monthlyContribution} onChange={(e) => setMonthlyContribution(Number(e.target.value))} />
            </label>
            <div className="flex flex-wrap gap-2">
              {examples.map((amount) => (
                <button key={amount} className="rounded-full border border-slate-700 px-3 py-2 text-sm" onClick={() => setInitialInvestment(amount)}>
                  ${amount.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
            <p className="text-slate-300">
              If you invested <span className="font-semibold text-white">${initialInvestment.toLocaleString()}</span> into the NOW Index on{' '}
              <span className="font-semibold text-white">{investmentDate}</span>
              {result.isProjected ? (
                <span className="ml-2 rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-400">Projected</span>
              ) : (
                <span className="ml-2 rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-400">Actual</span>
              )}
              ...
            </p>
            {result.indexValueAtStart > 0 && (
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg bg-slate-900/60 px-3 py-2">
                  <p className="metric-label">NOW Index @ Investment Date</p>
                  <p className="text-lg font-semibold text-white">{result.indexValueAtStart.toFixed(2)}</p>
                </div>
                <div className="rounded-lg bg-slate-900/60 px-3 py-2">
                  <p className="metric-label">NOW Index @ Latest</p>
                  <p className="text-lg font-semibold text-white">{result.indexValueNow.toFixed(2)}</p>
                </div>
              </div>
            )}
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="metric-label">Current Value</p>
                <p className="text-2xl font-semibold text-white">${result.portfolioValue.toFixed(0).toLocaleString()}</p>
              </div>
              <div>
                <p className="metric-label">Profit</p>
                <p className="text-2xl font-semibold text-emerald-400">${result.profit.toFixed(0).toLocaleString()}</p>
              </div>
              <div>
                <p className="metric-label">CAGR</p>
                <p className="text-2xl font-semibold text-white">{result.cagr.toFixed(1)}%</p>
              </div>
              <div>
                <p className="metric-label">Return %</p>
                <p className="text-2xl font-semibold text-white">{result.totalReturn.toFixed(1)}%</p>
              </div>
              <div>
                <p className="metric-label">Total Contributions</p>
                <p className="text-2xl font-semibold text-white">${result.totalContributions.toFixed(0).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
