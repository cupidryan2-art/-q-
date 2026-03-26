"""
Module: data_fetcher.py
Fetches historical daily closing prices from Yahoo Finance.
"""

import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta


ASSETS = {
    "AAPL": "Apple",
    "TSLA": "Tesla",
    "NVDA": "NVIDIA",
    "^GSPC": "S&P 500",
    "BTC-USD": "Bitcoin",
}


def fetch_closing_prices(period_months: int = 12) -> pd.DataFrame:
    """
    Fetch daily closing prices for all assets over the past `period_months` months.
    Returns a DataFrame with dates as index and asset tickers as columns.
    """
    end_date = datetime.today()
    start_date = end_date - timedelta(days=period_months * 31)

    print(f"Fetching data from {start_date.date()} to {end_date.date()} ...")

    tickers = list(ASSETS.keys())
    raw = yf.download(
        tickers,
        start=start_date.strftime("%Y-%m-%d"),
        end=end_date.strftime("%Y-%m-%d"),
        auto_adjust=True,
        progress=False,
    )

    # Extract Close prices
    if isinstance(raw.columns, pd.MultiIndex):
        close_df = raw["Close"]
    else:
        close_df = raw[["Close"]].rename(columns={"Close": tickers[0]})

    close_df.index = pd.to_datetime(close_df.index)
    print(f"Raw data shape: {close_df.shape}")
    return close_df
