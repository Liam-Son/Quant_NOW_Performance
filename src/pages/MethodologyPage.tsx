export function MethodologyPage() {
  return (
    <div className="card space-y-5 p-6">
      <h2 className="text-2xl font-semibold">Methodology</h2>
      <p className="text-slate-300">
        The NOW Index combines a disciplined, rules-based framework for measuring long-term financial performance across trend, quality, and risk-adjusted return signals. The methodology is designed to stay transparent, auditable, and suitable for future API-backed live publication.
      </p>

      <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-slate-300">
        <h3 className="text-lg font-semibold text-white">How to read the NOW Score</h3>
        <p className="mt-2">
          The NOW Score is a 0–100 composite ranking score. A higher score means the asset ranks more favorably within the peer set on the weighted factors used by the model. It is a relative ranking tool, not a direct buy signal.
        </p>
        <p className="mt-2">
          In practice: a stock in the top 10–20 of the published rankings is generally stronger on the combined factors than one near the bottom, but you should review the underlying factor breakdown, valuation, risk, and your time horizon before making any investment decision.
        </p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-slate-300">
        <h3 className="text-lg font-semibold text-white">What the site is and is not</h3>
        <p className="mt-2">
          This site provides educational and analytical context for the NOW Index. It does not provide individualized investment advice, nor does a high score alone justify buying a stock.
        </p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-slate-300">
        <h3 className="text-lg font-semibold text-white">A practical interpretation framework</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li><span className="font-medium text-white">Rank matters more than the raw score.</span> The same absolute number can mean very different things depending on the peer universe and market regime.</li>
          <li><span className="font-medium text-white">Factor composition matters.</span> A strong score driven by momentum can be more fragile than a score driven by quality and financial strength.</li>
          <li><span className="font-medium text-white">Trend context is important.</span> Rising scores often reflect improving factor persistence, while falling scores can suggest deterioration even if the level still appears acceptable.</li>
          <li><span className="font-medium text-white">Use the output as a screen, not a conclusion.</span> Pair it with valuation, macro outlook, and portfolio alignment before acting on it.</li>
        </ul>
      </div>
    </div>
  );
}
