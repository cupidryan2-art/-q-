"""
Module: visualizer.py
Generates and saves three charts:
  1. Cumulative Returns over time
  2. Correlation Matrix heatmap
  3. Sharpe Ratio bar chart
"""

import os
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import seaborn as sns
import pandas as pd

ASSET_LABELS = {
    "AAPL": "AAPL (Apple)",
    "TSLA": "TSLA (Tesla)",
    "NVDA": "NVDA (NVIDIA)",
    "^GSPC": "^GSPC (S&P 500)",
    "BTC-USD": "BTC-USD (Bitcoin)",
}

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "output")


def _ensure_output_dir():
    os.makedirs(OUTPUT_DIR, exist_ok=True)


def plot_cumulative_returns(cumulative_returns: pd.DataFrame):
    _ensure_output_dir()
    fig, ax = plt.subplots(figsize=(12, 6))

    for col in cumulative_returns.columns:
        label = ASSET_LABELS.get(col, col)
        ax.plot(cumulative_returns.index, cumulative_returns[col] * 100, label=label, linewidth=2)

    ax.axhline(0, color="gray", linestyle="--", linewidth=0.8)
    ax.yaxis.set_major_formatter(mticker.FormatStrFormatter("%.0f%%"))
    ax.set_title("Cumulative Returns — Past 12 Months", fontsize=15, fontweight="bold")
    ax.set_xlabel("Date")
    ax.set_ylabel("Cumulative Return (%)")
    ax.legend(loc="upper left")
    ax.grid(True, alpha=0.3)
    fig.tight_layout()

    path = os.path.join(OUTPUT_DIR, "1_cumulative_returns.png")
    fig.savefig(path, dpi=150)
    plt.close(fig)
    print(f"Saved: {path}")


def plot_correlation_matrix(correlation_matrix: pd.DataFrame):
    _ensure_output_dir()
    labels = [ASSET_LABELS.get(c, c) for c in correlation_matrix.columns]

    fig, ax = plt.subplots(figsize=(8, 6))
    sns.heatmap(
        correlation_matrix,
        annot=True,
        fmt=".3f",
        cmap="RdYlGn",
        vmin=-1,
        vmax=1,
        center=0,
        xticklabels=labels,
        yticklabels=labels,
        linewidths=0.5,
        ax=ax,
        annot_kws={"size": 10},
    )
    ax.set_title("Asset Return Correlation Matrix", fontsize=15, fontweight="bold")
    ax.tick_params(axis="x", rotation=30)
    ax.tick_params(axis="y", rotation=0)
    fig.tight_layout()

    path = os.path.join(OUTPUT_DIR, "2_correlation_matrix.png")
    fig.savefig(path, dpi=150)
    plt.close(fig)
    print(f"Saved: {path}")


def plot_sharpe_ratios(sharpe_ratios: pd.Series):
    _ensure_output_dir()
    labels = [ASSET_LABELS.get(c, c) for c in sharpe_ratios.index]
    colors = ["#2ecc71" if v > 0 else "#e74c3c" for v in sharpe_ratios.values]

    fig, ax = plt.subplots(figsize=(9, 5))
    bars = ax.bar(labels, sharpe_ratios.values, color=colors, edgecolor="white", linewidth=0.8)

    for bar, val in zip(bars, sharpe_ratios.values):
        ax.text(
            bar.get_x() + bar.get_width() / 2,
            bar.get_height() + (0.05 if val >= 0 else -0.15),
            f"{val:.2f}",
            ha="center",
            va="bottom",
            fontsize=11,
            fontweight="bold",
        )

    ax.axhline(0, color="black", linewidth=0.8)
    ax.set_title("Annualized Sharpe Ratio (Risk-Free Rate = 4%)", fontsize=15, fontweight="bold")
    ax.set_ylabel("Sharpe Ratio")
    ax.tick_params(axis="x", rotation=20)
    ax.grid(axis="y", alpha=0.3)
    fig.tight_layout()

    path = os.path.join(OUTPUT_DIR, "3_sharpe_ratios.png")
    fig.savefig(path, dpi=150)
    plt.close(fig)
    print(f"Saved: {path}")


def generate_all_charts(results: dict):
    print("\n--- Generating Charts ---")
    plot_cumulative_returns(results["cumulative_returns"])
    plot_correlation_matrix(results["correlation_matrix"])
    plot_sharpe_ratios(results["sharpe_ratios"])
    print(f"\nAll charts saved to: {OUTPUT_DIR}")
