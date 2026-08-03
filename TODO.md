# Calculator Logic Implementation - TODO

## Goal
Add real calculator logic to the Calculator page using actual NOW Index historical data from `now_index.json`, instead of the hardcoded 13.8% CAGR projection.

## Steps
- [x] 1. Update `src/utils/finance.ts`
  - Add `ActualGrowthResult` type
  - Add `calculateActualGrowth()` which uses the real NOW Index series (interpolation + forward projection via series CAGR)
  - Keep existing `calculateGrowthScenario()` and `yearsBetween()` for backward compatibility
- [x] 2. Update `src/pages/CalculatorPage.tsx`
  - Load real NOW Index series via `getPerformanceSeries()`
  - Use `calculateActualGrowth()` instead of `calculateGrowthScenario()`
  - Show NOW Index value at investment date, current value, and projected badge
- [x] 3. Update `README.md`
  - Document the new actual-data-based calculator logic
- [x] 4. Build & verify
  - Run `npm install` and `npm run build` in `Quant_NOW_Performance`

