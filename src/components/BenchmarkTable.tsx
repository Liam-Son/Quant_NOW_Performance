import { benchmarkMetrics } from '../data/benchmarkData';

export function BenchmarkTable() {
  return (
    <div className="card overflow-hidden p-4 sm:p-6">
      <h3 className="text-xl font-semibold">Benchmark Comparison Table</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm text-slate-300">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="px-3 py-2">Asset</th>
              <th className="px-3 py-2">CAGR</th>
              <th className="px-3 py-2">Return</th>
              <th className="px-3 py-2">Volatility</th>
              <th className="px-3 py-2">Sharpe</th>
              <th className="px-3 py-2">Max Drawdown</th>
            </tr>
          </thead>
          <tbody>
            {benchmarkMetrics.map((item) => (
              <tr key={item.asset} className="border-b border-slate-900">
                <td className="px-3 py-3 text-white">{item.asset}</td>
                <td className="px-3 py-3">{item.cagr}</td>
                <td className="px-3 py-3">{item.return}</td>
                <td className="px-3 py-3">{item.volatility}</td>
                <td className="px-3 py-3">{item.sharpe}</td>
                <td className="px-3 py-3">{item.drawdown}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
