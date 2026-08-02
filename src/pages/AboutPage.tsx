const factorHighlights = [
  'Quality',
  'Value',
  'Growth',
  'Momentum',
  'Low Risk',
  'Undervalued',
  'Long-Term',
  'Dividend',
  'Innovation',
  'Financial Strength',
];

export function AboutPage() {
  return (
    <div className="card space-y-6 p-6">
      <section>
        <h2 className="text-2xl font-semibold">About NOW Index</h2>
        <p className="mt-4 text-slate-300">
          NOW Index is a benchmark-oriented research framework designed to highlight how disciplined, rules-based portfolio factors can persist over long periods. Instead of acting like a single-stock recommendation engine, it gives a structured way to compare assets on a common scoring basis.
        </p>
        <p className="mt-3 text-slate-300">
          In practice, the index is meant to be a decision-support lens: it helps reveal whether an asset is ranking well on quality, trend strength, resilience, and risk-adjusted behavior rather than simply valuing it on price alone.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
        <h3 className="text-lg font-semibold text-white">What the NOW score is trying to answer</h3>
        <p className="mt-2 text-slate-300">
          The score does not measure certainty or future return. It measures how an asset compares within the model universe across a set of weighted factors, which is why the ranking and factor mix matter more than the raw number itself.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
        <h3 className="text-lg font-semibold text-white">Factor lens</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {factorHighlights.map((factor) => (
            <span key={factor} className="rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-sm text-sky-200">
              {factor}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
