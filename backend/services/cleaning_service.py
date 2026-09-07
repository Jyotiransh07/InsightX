import pandas as pd
import numpy as np
from utils.column_detector import detect_column_type

def clean_dataset(df: pd.DataFrame, profiling_metadata: dict) -> tuple[pd.DataFrame, dict]:
    """
    Cleans the dataset and returns the cleaned DataFrame along with a cleaning report.
    """
    report = {
        "rows_before": len(df),
        "rows_after": 0,
        "duplicates_removed": 0,
        "missing_values_handled": 0,
        "invalid_values_handled": 0,
        "columns_processed": len(df.columns),
        "quality_score": 100
    }
    
    # 1. Remove complete duplicates
    initial_len = len(df)
    df = df.drop_duplicates()
    report["duplicates_removed"] = initial_len - len(df)
    
    # 2. Handle missing and normalize values based on type
    for col_meta in profiling_metadata["columns"]:
        col = col_meta["column"]
        c_type = col_meta["type"]
        
        missing_count = int(df[col].isna().sum())
        if missing_count > 0:
            report["missing_values_handled"] += missing_count
            
            if c_type == "numeric":
                # Ensure it's actually numeric, convert strings to numbers
                df[col] = pd.to_numeric(df[col], errors='coerce')
                # Impute with median
                median_val = df[col].median()
                if not pd.isna(median_val):
                    df[col] = df[col].fillna(median_val)
                else:
                    df[col] = df[col].fillna(0)
                    
            elif c_type == "categorical" or c_type == "text":
                # Normalize whitespace
                if df[col].dtype == 'object':
                    df[col] = df[col].astype(str).str.strip()
                df[col] = df[col].fillna("Unknown")
                
            elif c_type == "date":
                # Convert to datetime and forward fill or drop
                df[col] = pd.to_datetime(df[col], errors='coerce')
                df[col] = df[col].ffill().bfill()
                
            elif c_type == "boolean":
                mode_val = df[col].mode()
                if not mode_val.empty:
                    df[col] = df[col].fillna(mode_val[0])
                    
    # Calculate simple quality score (100 - penalties)
    total_cells = len(df) * len(df.columns)
    if total_cells > 0:
        penalty = ((report["missing_values_handled"] * 0.5) + (report["duplicates_removed"] * 1.0)) / total_cells * 100
        report["quality_score"] = max(0, min(100, int(100 - penalty)))
        
    report["rows_after"] = len(df)
    return df, report
