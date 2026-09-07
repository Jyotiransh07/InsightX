import pandas as pd
import numpy as np

def detect_column_type(df: pd.DataFrame, col_name: str) -> str:
    series = df[col_name]
    
    # 1. Check if boolean
    if pd.api.types.is_bool_dtype(series):
        return "boolean"
    if set(series.dropna().unique()).issubset({0, 1, '0', '1', 'True', 'False', 'true', 'false', 'Yes', 'No', 'Y', 'N'}):
        return "boolean"
        
    # 2. Check if Date
    if pd.api.types.is_datetime64_any_dtype(series):
        return "date"
    if series.dtype == 'object':
        try:
            # Check a sample to avoid full parse cost if not date
            sample = series.dropna().head(10)
            pd.to_datetime(sample, format='mixed', errors='raise')
            return "date"
        except (ValueError, TypeError, Exception):
            pass

    # 3. Check if numeric (integer or float)
    if pd.api.types.is_numeric_dtype(series):
        # Check if it's an identifier disguised as a number (e.g., ID column)
        if 'id' in col_name.lower() and series.nunique() == len(series.dropna()):
            return "identifier"
        return "numeric"
        
    # Check if numeric strings
    if series.dtype == 'object':
        try:
            sample = series.dropna().head(10)
            pd.to_numeric(sample, errors='raise')
            return "numeric"
        except (ValueError, TypeError, Exception):
            pass

    # 4. Check if Categorical or Identifier
    unique_count = series.nunique()
    total_count = len(series.dropna())
    
    if total_count == 0:
        return "empty"
        
    if unique_count / total_count > 0.9 or 'id' in col_name.lower():
        return "identifier"
        
    if unique_count < 20 or (unique_count / total_count < 0.1):
        return "categorical"
        
    return "text"
