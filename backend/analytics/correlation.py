import pandas as pd
import numpy as np

def calculate_correlations(df: pd.DataFrame, profiling_metadata: dict) -> dict:
    numeric_cols = [c["column"] for c in profiling_metadata["columns"] if c["type"] == "numeric"]
    
    if len(numeric_cols) < 2:
        return {"matrix": [], "strongest_positive": None, "strongest_negative": None}
        
    # Ensure they are numeric
    for c in numeric_cols:
        df[c] = pd.to_numeric(df[c], errors='coerce')
        
    corr_df = df[numeric_cols].corr()
    
    # format for visualization
    matrix = []
    for col in corr_df.columns:
        for row in corr_df.index:
            val = corr_df.loc[row, col]
            if not pd.isna(val):
                matrix.append({
                    "x": col,
                    "y": row,
                    "value": float(val)
                })
                
    # Find strongest correlations (ignoring self correlation 1.0)
    strongest_pos = None
    strongest_neg = None
    max_pos = -1
    min_neg = 1
    
    for i in range(len(corr_df.columns)):
        for j in range(i+1, len(corr_df.columns)):
            col1 = corr_df.columns[i]
            col2 = corr_df.columns[j]
            val = corr_df.iloc[i, j]
            
            if pd.isna(val): continue
                
            if val > max_pos:
                max_pos = val
                strongest_pos = {"cols": [col1, col2], "value": float(val)}
            if val < min_neg:
                min_neg = val
                strongest_neg = {"cols": [col1, col2], "value": float(val)}
                
    return {
        "matrix": matrix,
        "strongest_positive": strongest_pos,
        "strongest_negative": strongest_neg
    }
