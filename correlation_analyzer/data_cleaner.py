"""
Module: data_cleaner.py
Aligns multi-market data (stocks vs crypto trading calendars)
and handles missing values.
"""

import pandas as pd


def align_and_clean(df: pd.DataFrame) -> pd.DataFrame:
    """
    1. Reindex to a full calendar date range (Mon-Sun) to unify stock & crypto.
    2. Forward-fill stock NaNs (market closed days inherit last known price).
    3. Drop any remaining rows where ALL values are NaN (e.g. initial gaps).
    4. Report on the cleaning operations performed.
    """
    print("\n--- Data Cleaning ---")
    print(f"Before alignment: {df.shape[0]} rows, {df.shape[1]} columns")

    # Full daily date range (includes weekends for crypto alignment)
    full_range = pd.date_range(start=df.index.min(), end=df.index.max(), freq="D")
    df = df.reindex(full_range)

    nan_before = df.isna().sum().sum()
    print(f"NaN values after reindex (before fill): {nan_before}")

    # Forward-fill: propagate last valid observation forward
    df = df.ffill()

    # Drop leading rows where data hasn't started yet
    df = df.dropna(how="all")

    nan_after = df.isna().sum().sum()
    print(f"NaN values after forward-fill: {nan_after}")

    if nan_after > 0:
        # Fill any remaining NaN with column median as last resort
        df = df.fillna(df.median())
        print("Remaining NaNs filled with column median.")

    print(f"After alignment: {df.shape[0]} rows, {df.shape[1]} columns")
    return df
