# Quant_NOW Performance

Live site: https://liam-son.github.io/Quant_NOW_Performance/

Related backend/research repo: https://github.com/Liam-Son/NOW-index

A polished, open-source quantitative finance landing experience for the proprietary NOW Index. The project is designed for GitHub Pages deployment and is structured to support future API-backed live data integration.

The NOW Score shown on the site is a composite ranking from 0 to 100. A higher score means a stronger relative ranking within the model’s peer set based on its weighted factors. It is a comparative, research-oriented indicator rather than a direct buy signal or financial advice.

## ❓ How to Read the NOW Score

> **There is no single “magic number” to buy.** The NOW Score is a *relative composite ranking*, not an absolute value, price target, or buy/sell signal.

- A score of 80 does **not** mean “80% cheap” or “80% chance of profit” — it means the asset ranks in the ~80th percentile of the current model universe on the 10 weighted factors (Quality, Value, Growth, Momentum, Low Risk, Undervalued, Long-Term, Dividend, Innovation, Financial Strength).
- The absolute number shifts with the market and the universe, so **rank and factor composition matter more than the raw number**.
- **Rating bands as a filter, not a trigger:**
  - **90–100 Excellent** → top-conviction candidates; still verify valuation and entry timing.
  - **80–89 Strong** → worth deep research.
  - **70–79 Good** → solid, but check which factors are pulling the score down.
  - **60–69 Fair** → extra due diligence and a risk/valuation discount.
  - **50–59 Moderate** → below average; caution warranted.
  - **<50 Weak** → significant risk factors; generally avoid without strong independent reasons.
- **What matters more than the number:** (1) *why* the score is what it is (factor mix), (2) whether the score is *rising or falling*, (3) *context* — compare within the same asset class/sector, and (4) the *universe* — the Top-100 rank is the more stable signal.

**Bottom line:** use the score to *screen and form hypotheses*, then verify with your own valuation, risk, and time-horizon analysis. The NOW Score is a decision-support tool, not financial advice.

## 💰 How the "Estimated Output" Is Calculated

There are two places on the site that show an investment estimate — a **static snapshot** on the homepage and the **interactive Investment Growth Simulator** on the Calculator page. Here is exactly how both work.

### 1. The homepage "Investment Growth Snapshot" (static)

The card on the main page shows:

> *"If you invested $10,000 in the NOW Index on Jan 1, 2021, your portfolio would be worth about **$51,524** today."*

This is a **fixed, illustrative example value** hardcoded in `src/pages/HomePage.tsx`. It exists to preview the concept on the landing page and does **not** recompute as you change inputs or dates.

### 2. The Calculator page (interactive, dynamic)

The Calculator page (`src/pages/CalculatorPage.tsx`) uses the `calculateActualGrowth()` function in `src/utils/finance.ts`. This is the real, live calculation and it is driven by the **actual NOW Index price series** from `data/now_index.json`.

**Step 1 — Load the index series:**

On mount, the page loads the NOW Index historical series via `getPerformanceSeries()` (from `src/services/nowDataService.ts`). The series looks like:

```
2020-01-01 → 100.0
2020-06-01 → 108.9
2021-01-01 → 123.4
2022-01-01 → 150.2
2023-01-01 → 183.7
2024-01-01 → 214.6
2025-01-01 → 249.5
```

**Step 2 — Determine the index value at the investment date:**

The helper `interpolateIndexValue()` finds the NOW Index level on the chosen investment date:

- If the date falls **between** two data points, the index value is **linearly interpolated** between the surrounding points.
- If the date is **before** the first point, the first point's value is used.
- If the date is **after** the last point, the last point's value is used (and the result is marked as *projected*).

**Step 3 — Compute the growth ratio:**

```
growthRatio = latestIndexValue / indexValueAtInvestmentDate
```

**Step 4 — Apply growth to the investment:**

```
portfolioValue = initialInvestment × growthRatio
```

**Monthly contributions** (if any) are then added one-by-one: each contribution is grown from its own contribution date using the same `latestIndexValue / contributionDateIndexValue` ratio, and contributions that fall after the last data point are stopped.

**Step 5 — Return outputs:**

| Output | Formula |
|--------|---------|
| `portfolioValue` | Ending value = initial investment + contributions, each grown by the actual index ratio |
| `totalContributions` | `initialInvestment + monthlyContribution × monthsElapsed` |
| `profit` | `portfolioValue − totalContributions` |
| `totalReturn` | `profit / totalContributions × 100` (%) |
| `cagr` | `((portfolioValue / initialInvestment)^(1/years) − 1) × 100` (%) |
| `indexValueAtStart` | The interpolated NOW Index value on the investment date |
| `indexValueNow` | The latest NOW Index value |
| `isProjected` | `true` when the investment date is after the last data point (uses series CAGR for forward projection) |

> If the investment date is **after** the latest data point in the series, the calculator falls back to `calculateGrowthScenario()` using the series CAGR to project forward, and marks the result with a **"Projected"** badge.

**Default inputs (as shown on the Calculator page):**

| Input | Default |
|-------|---------|
| Initial investment | $10,000 |
| Monthly contribution | $0 |
| Investment date | 2021-01-01 |

### 3. Forward-projection fallback

When the chosen investment date is beyond the most recent point in the NOW Index series, the calculator uses the **"Since Inception CAGR"** of the series (computed from the first and last index values) to project future growth with the same monthly-compounding logic as the original `calculateGrowthScenario()` function.

### 4. Where the underlying data comes from

| File | Generated by | What it feeds |
|------|--------------|---------------|
| `data/now_index.json` | `scripts/update_now_data.py` | Historical index series → performance chart + dashboard metrics (Current NOW Index Value, returns) |
| `data/metrics.json` | `scripts/calculate_metrics.py` | CAGR, volatility, Sharpe, Sortino, Calmar, max drawdown |
| `data/returns.json` | `scripts/calculate_returns.py` | Period-to-period returns, computed as `(current − previous) / previous` |

> ⚠️ **Demo data note:** The current data files are **representative/demo data** (`"source": "NOW Index Demo Data"` in `now_index.json`). The **formulas above are the exact logic the site uses** to produce the estimated output — when live data is wired in (see [Future Roadmap](#future-roadmap)), the same formulas will apply to the live series.

## Related Repositories

- [NOW-index](https://github.com/Liam-Son/NOW-index) — core quant ranking engine, scoring framework, and API foundation
- [Quant_NOW Performance](https://github.com/Liam-Son/Quant_NOW_Performance) — public performance dashboard and investment simulator for the NOW Index

## Overview

Quant_NOW Performance answers a simple question: if you invested in the NOW Index, how much would your portfolio be worth today? It brings together historical performance, benchmark comparisons, risk analytics, and an investment growth calculator.

## Features

- Responsive hero landing page with headline, dashboard metrics, and interactive chart
- Investment growth simulator
- Performance dashboard
- Benchmark comparison framework
- Data pipeline scripts for returns and risk calculations
- GitHub Actions deployment workflow

## Installation

```bash
npm install
npm run dev
```

## Development

```bash
npm run build
npm run preview
```

## Deployment

Open the live site here: https://liam-son.github.io/Quant_NOW_Performance/

This project is configured for GitHub Pages via a Vite base path and a GitHub Actions workflow in `.github/workflows/deploy-pages.yml`.

## Folder Structure

- `src/` application source
- `public/` static assets
- `scripts/` data pipeline and reporting
- `api/` future-ready API scaffolding
- `.github/workflows/` automated CI/CD workflows

## Data Pipeline

Planned Python scripts:

- `scripts/update_now_data.py`
- `scripts/calculate_returns.py`
- `scripts/calculate_metrics.py`

These scripts are intended to load historical index data, clean it, compute returns, risk statistics, and export JSON artifacts consumable by the frontend.

## GitHub Actions

The workflow runs on a schedule every hour and can also be triggered manually or on push to `main`.

## Future Roadmap

- Live API integration
- Authentication and personal portfolios
- AI investment insights
- Multiple proprietary indices
- REST and GraphQL API extensions

## License

MIT
