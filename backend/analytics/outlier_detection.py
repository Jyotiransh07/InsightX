import pandas as pd
import numpy as np

def detect_outliers(df: pd.DataFrame, profiling_metadata: dict) -> dict:
    numeric_cols = [c["column"] for c in profiling_metadata["columns"] if c["type"] == "numeric"]
    
    outliers_report = {
        "total_anomalies": 0,
        "affected_columns": [],
        "sample_records": []
    }
    
    if not numeric_cols or len(df) < 10:
        return outliers_report
        
    outlier_indices = set()
    col_anomalies = {}
    
    for col in numeric_cols:
        s = pd.to_numeric(df[col], errors='coerce').dropna()
        if len(s) < 10:
            continue
            
        q1 = s.quantile(0.25)
        q3 = s.quantile(0.75)
        iqr = q3 - q1
        
        lower_bound = q1 - 1.5 * iqr
        upper_bound = q3 + 1.5 * iqr
        
        # Find indices where value is outlier
        outliers_mask = (s < lower_bound) | (s > upper_bound)
        idx = s[outliers_mask].index.tolist()
        
        if idx:
            outlier_indices.update(idx)
            col_anomalies[col] = len(idx)
            if col not in outliers_report["affected_columns"]:
                outliers_report["affected_columns"].append(col)
                
    outliers_report["total_anomalies"] = len(outlier_indices)
    
    if outlier_indices:
        # Get up to 10 sample records
        sample_idx = list(outlier_indices)[:10]
        # Replace NaN with None for JSON serialization
        sample_df = df.loc[sample_idx].replace({np.nan: None})
        outliers_report["sample_records"] = sample_df.to_dict(orient="records")
        
    return outliers_report
