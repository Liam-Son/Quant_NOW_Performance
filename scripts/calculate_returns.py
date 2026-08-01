from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / 'data'
OUTPUT_DIR = ROOT / 'data'


def main() -> None:
    payload = json.loads((DATA_DIR / 'now_index.json').read_text(encoding='utf-8'))
    series = payload['series']
    returns = []

    for previous, current in zip(series, series[1:]):
        prev_value = previous['value']
        curr_value = current['value']
        daily_return = (curr_value - prev_value) / prev_value
        returns.append({
            'from': previous['date'],
            'to': current['date'],
            'return': round(daily_return, 6),
        })

    OUTPUT_DIR.mkdir(exist_ok=True)
    (OUTPUT_DIR / 'returns.json').write_text(json.dumps({'returns': returns}, indent=2), encoding='utf-8')
    print('Generated returns.json')


if __name__ == '__main__':
    main()
