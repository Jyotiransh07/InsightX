import pandas as pd
import numpy as np

def detect_column_type(df: pd.DataFrame, col_name: str) -> str:
    series = df[col_name]
    
    # If duplicate columns exist, take first series
    if isinstance(series, pd.DataFrame):
        series = series.iloc[:, 0]
        
    col_str = str(col_name).lower()
    valid_series = series.dropna()
    total_count = len(valid_series)
    
    if total_count == 0:
        return "empty"
    
    # 1. Check if boolean
    if pd.api.types.is_bool_dtype(series):
        return "boolean"
    try:
        sample_unique = set(valid_series.head(50).unique())
        if sample_unique.issubset({0, 1, '0', '1', 'True', 'False', 'true', 'false', 'Yes', 'No', 'Y', 'N', 'yes', 'no'}):
            return "boolean"
    except Exception:
        pass
        
    # 2. Check if Date / Datetime
    if pd.api.types.is_datetime64_any_dtype(series):
        return "date"
        
    is_str_like = pd.api.types.is_string_dtype(series) or pd.api.types.is_object_dtype(series) or series.dtype == 'object'
    
    if is_str_like:
        try:
            sample = valid_series.head(15).astype(str).str.strip()
            # If not purely digits, test datetime
            is_pure_digits = sample.str.match(r'^\d+(\.\d+)?$').all()
            if not is_pure_digits or any(term in col_str for term in ['date', 'time', 'timestamp', 'day', 'month', 'year']):
                pd.to_datetime(sample, format='mixed', errors='raise')
                return "date"
        except Exception:
            pass

    # 3. Check if Identifier (check before numeric string conversion so IDs stay IDs)
    unique_count = series.nunique()
    if any(term in col_str for term in ['id', 'uuid', 'guid', 'key', 'ssn', 'hash', 'code']) and (unique_count / total_count > 0.7):
        return "identifier"
        
    if unique_count / total_count > 0.95 and total_count > 20:
        return "identifier"

    # 4. Check if numeric (integer or float)
    if pd.api.types.is_numeric_dtype(series):
        return "numeric"
        
    # Check if numeric strings (handles commas, currency symbols, percentages)
    if is_str_like:
        try:
            sample = valid_series.head(15).astype(str).str.replace(r'[\$,%]', '', regex=True).str.strip()
            pd.to_numeric(sample, errors='raise')
            return "numeric"
        except Exception:
            pass

    # 5. Check if freeform text (average length > 60 chars)
    try:
        avg_len = valid_series.head(50).astype(str).str.len().mean()
        if avg_len > 60:
            return "text"
    except Exception:
        pass
        
    # Otherwise, treat as categorical for aggregations & visualizations
    return "categorical"
