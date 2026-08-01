import { useMemo, useState } from 'react';
import { calculateGrowthScenario } from '../utils/finance';

const examples = [100, 500, 1000, 5000, 10000, 50000, 100000];

export function CalculatorPage() {
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(0);
  const [investmentDate, setInvestmentDate] = useState('2021-01-01');

  const result = useMemo(() => {
    return calculateGrowthScenario(initialInvestment, monthlyContribution, investmentDate, 0.138);
  }, [initialInvestment, monthlyContribution, investmentDate]);

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
            <p className="text-slate-300">If you invested ${initialInvestment.toLocaleString()} into the NOW Index on {investmentDate}...</p>
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
