import { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { PerformancePoint } from '../types';
import { getPerformanceSeries } from '../services/nowDataService';

export function PerformanceChart() {
  const [data, setData] = useState<PerformancePoint[]>([]);

  useEffect(() => {
    getPerformanceSeries()
      .then((series) => setData(series))
      .catch(() => setData([]));
  }, []);

  return (
    <div className="card h-[420px] p-4 sm:p-6">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="metric-label">Historical Performance</p>
          <p className="text-lg font-semibold">NOW Index Growth</p>
        </div>
        <div className="rounded-full bg-sky-500/10 px-3 py-1 text-xs text-sky-300">Interactive</div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="growthFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.45} />
              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#334155" strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: 12 }}
            labelStyle={{ color: '#e2e8f0' }}
          />
          <Area type="monotone" dataKey="value" stroke="#38bdf8" fill="url(#growthFill)" strokeWidth={3} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
