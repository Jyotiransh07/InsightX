import pandas as pd
import numpy as np

def calculate_descriptive_stats(df: pd.DataFrame, profiling_metadata: dict) -> list:
    stats = []
    
    numeric_cols = [c["column"] for c in profiling_metadata["columns"] if c["type"] == "numeric"]
    
    for col in numeric_cols:
        if col in df.columns and pd.api.types.is_numeric_dtype(df[col]):
            s = df[col].dropna()
            if len(s) > 0:
                stats.append({
                    "column": col,
                    "mean": float(s.mean()),
                    "median": float(s.median()),
                    "min": float(s.min()),
                    "max": float(s.max()),
                    "std": float(s.std()) if len(s) > 1 else 0.0,
                    "q1": float(s.quantile(0.25)),
                    "q3": float(s.quantile(0.75))
                })
    return stats
