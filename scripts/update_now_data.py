from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / 'data'
DATA_DIR.mkdir(exist_ok=True)


def main() -> None:
    dataset = {
        'source': 'NOW Index Demo Data',
        'last_updated': '2026-08-01T16:30:00Z',
        'series': [
            {'date': '2020-01-01', 'value': 100.0},
            {'date': '2020-06-01', 'value': 108.9},
            {'date': '2021-01-01', 'value': 123.4},
            {'date': '2022-01-01', 'value': 150.2},
            {'date': '2023-01-01', 'value': 183.7},
            {'date': '2024-01-01', 'value': 214.6},
            {'date': '2025-01-01', 'value': 249.5},
        ],
    }

    output_path = DATA_DIR / 'now_index.json'
    output_path.write_text(json.dumps(dataset, indent=2), encoding='utf-8')
    print(f'Wrote {output_path}')


if __name__ == '__main__':
    main()
