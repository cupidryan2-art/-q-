"""
main.py — Cross-Market Asset Correlation Analyzer
Orchestrates: fetch → clean → analyze → visualize
"""

import subprocess
import sys


def ensure_dependencies():
    required = ["yfinance", "pandas", "seaborn", "matplotlib", "numpy"]
    for pkg in required:
        try:
            __import__(pkg)
        except ImportError:
            print(f"Installing missing package: {pkg}")
            subprocess.check_call([sys.executable, "-m", "pip", "install", pkg, "-q"])


if __name__ == "__main__":
    ensure_dependencies()

    from data_fetcher import fetch_closing_prices
    from data_cleaner import align_and_clean
    from analyzer import run_analysis
    from visualizer import generate_all_charts

    print("=" * 55)
    print("   Cross-Market Asset Correlation Analyzer")
    print("=" * 55)

    # Step 1: Fetch
    raw_prices = fetch_closing_prices(period_months=12)

    # Step 2: Clean & align
    clean_prices = align_and_clean(raw_prices)

    # Step 3: Analyze
    results = run_analysis(clean_prices)

    # Step 4: Visualize
    generate_all_charts(results)

    print("\n✓ Analysis complete.")
