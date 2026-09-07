import pandas as pd
from utils.column_detector import detect_column_type

def profile_dataset(df: pd.DataFrame):
    num_rows = len(df)
    num_cols = len(df.columns)
    
    columns_meta = []
    col_types = {
        "numeric": 0,
        "categorical": 0,
        "date": 0,
        "boolean": 0,
        "identifier": 0,
        "text": 0
    }
    
    for col in df.columns:
        col_type = detect_column_type(df, col)
        if col_type in col_types:
            col_types[col_type] += 1
            
        missing = int(df[col].isna().sum())
        unique = int(df[col].nunique())
        
        meta = {
            "column": str(col),
            "type": col_type,
            "missing": missing,
            "missing_percentage": float((missing / num_rows) * 100) if num_rows > 0 else 0,
            "unique": unique
        }
        
        if col_type == "numeric" and pd.api.types.is_numeric_dtype(df[col]):
            meta["min"] = float(df[col].min()) if not pd.isna(df[col].min()) else None
            meta["max"] = float(df[col].max()) if not pd.isna(df[col].max()) else None
            
        columns_meta.append(meta)
        
    return {
        "overview": {
            "num_rows": num_rows,
            "num_cols": num_cols,
            "column_types": col_types
        },
        "columns": columns_meta
    }
