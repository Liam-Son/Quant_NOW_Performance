const faqs = [
  {
    question: 'What is the NOW Index?',
    answer:
      'The NOW Index is a proprietary performance benchmark designed to highlight how wealth compounds over time with disciplined, rules-based portfolio exposure.',
  },
  {
    question: 'How is CAGR calculated?',
    answer:
      'CAGR is calculated using the total return over the full investment period and annualized by the number of years between the start and end dates.',
  },
  {
    question: 'Can this be extended to live data?',
    answer:
      'Yes. The architecture is intentionally future-ready with a dedicated API and data-pipeline structure for later integration with live providers.',
  },
];

export function FAQPage() {
  return (
    <div className="card p-6">
      <h2 className="text-2xl font-semibold">FAQ</h2>
      <div className="mt-5 space-y-3">
        {faqs.map((item) => (
          <details key={item.question} className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
            <summary className="cursor-pointer font-medium text-white">{item.question}</summary>
            <p className="mt-2 text-slate-300">{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
