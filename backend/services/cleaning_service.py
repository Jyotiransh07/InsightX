import pandas as pd
import numpy as np

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
        
        if col not in df.columns:
            continue
            
        missing_count = int(df[col].isna().sum())
        if missing_count > 0:
            report["missing_values_handled"] += missing_count
            
        if c_type == "numeric":
            # Clean possible string symbols ($, commas, %)
            if pd.api.types.is_string_dtype(df[col]) or pd.api.types.is_object_dtype(df[col]) or df[col].dtype == 'object':
                df[col] = df[col].astype(str).str.replace(r'[\$,%]', '', regex=True).str.strip()
            df[col] = pd.to_numeric(df[col], errors='coerce')
            df[col] = df[col].replace([np.inf, -np.inf], np.nan)
            median_val = df[col].median()
            if not pd.isna(median_val):
                df[col] = df[col].fillna(median_val)
            else:
                df[col] = df[col].fillna(0.0)
                
        elif c_type in ["categorical", "text", "identifier"]:
            df[col] = df[col].fillna("Unknown").astype(str).str.strip()
            
        elif c_type == "date":
            df[col] = pd.to_datetime(df[col], errors='coerce')
            df[col] = df[col].ffill().bfill()
            
        elif c_type == "boolean":
            mode_val = df[col].mode()
            if not mode_val.empty:
                df[col] = df[col].fillna(mode_val[0])
            else:
                df[col] = df[col].fillna(False)
                    
    # Calculate simple quality score (100 - penalties)
    total_cells = len(df) * len(df.columns)
    if total_cells > 0:
        penalty = ((report["missing_values_handled"] * 0.5) + (report["duplicates_removed"] * 1.0)) / total_cells * 100
        report["quality_score"] = max(0, min(100, int(100 - penalty)))
        
    report["rows_after"] = len(df)
    return df, report
