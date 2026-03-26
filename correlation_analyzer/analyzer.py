"""
Module: analyzer.py
Computes:
  - Daily log returns
  - Cumulative returns
  - Correlation matrix
  - Annualized Sharpe Ratio (risk-free rate = 4%)
"""

import numpy as np
import pandas as pd

RISK_FREE_RATE_ANNUAL = 0.04  # 4% annualized
TRADING_DAYS_PER_YEAR = 252


def compute_daily_returns(prices: pd.DataFrame) -> pd.DataFrame:
    """Compute daily percentage returns."""
    return prices.pct_change().dropna()


def compute_cumulative_returns(returns: pd.DataFrame) -> pd.DataFrame:
    """Compute cumulative returns (start = 0%)."""
    return (1 + returns).cumprod() - 1


def compute_correlation_matrix(returns: pd.DataFrame) -> pd.DataFrame:
    """Pearson correlation matrix of daily returns."""
    return returns.corr()


def compute_sharpe_ratios(returns: pd.DataFrame) -> pd.Series:
    """
    Annualized Sharpe Ratio = (mean_daily_return - daily_rf) / std_daily * sqrt(trading_days)
    For crypto (BTC-USD), it trades 365 days; we use 365 for BTC and 252 for others.
    """
    daily_rf = RISK_FREE_RATE_ANNUAL / TRADING_DAYS_PER_YEAR

    sharpe = {}
    for col in returns.columns:
        r = returns[col].dropna()
        days = 365 if col == "BTC-USD" else TRADING_DAYS_PER_YEAR
        excess = r - (RISK_FREE_RATE_ANNUAL / days)
        sharpe[col] = (excess.mean() / excess.std()) * np.sqrt(days)

    return pd.Series(sharpe, name="Sharpe Ratio")


def run_analysis(prices: pd.DataFrame) -> dict:
    """Run the full analytical pipeline and return results dict."""
    daily_returns = compute_daily_returns(prices)
    cumulative_returns = compute_cumulative_returns(daily_returns)
    correlation_matrix = compute_correlation_matrix(daily_returns)
    sharpe_ratios = compute_sharpe_ratios(daily_returns)

    print("\n--- Analysis Results ---")
    print("\nFinal Cumulative Returns:")
    print((cumulative_returns.iloc[-1] * 100).round(2).to_string())

    print("\nCorrelation Matrix:")
    print(correlation_matrix.round(3).to_string())

    print("\nSharpe Ratios (annualized, rf=4%):")
    print(sharpe_ratios.round(3).to_string())

    return {
        "prices": prices,
        "daily_returns": daily_returns,
        "cumulative_returns": cumulative_returns,
        "correlation_matrix": correlation_matrix,
        "sharpe_ratios": sharpe_ratios,
    }
