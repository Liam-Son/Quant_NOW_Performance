# Quant_NOW Performance

Live site: https://liam-son.github.io/Quant_NOW_Performance/

Related backend/research repo: https://github.com/Liam-Son/NOW-index

A polished, open-source quantitative finance landing experience for the proprietary NOW Index. The project is designed for GitHub Pages deployment and is structured to support future API-backed live data integration.

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
