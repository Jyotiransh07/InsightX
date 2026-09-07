import pandas as pd

def analyze_trends(df: pd.DataFrame, profiling_metadata: dict) -> dict:
    date_cols = [c["column"] for c in profiling_metadata["columns"] if c["type"] == "date"]
    numeric_cols = [c["column"] for c in profiling_metadata["columns"] if c["type"] == "numeric"]
    
    result = {
        "status": "skipped",
        "reason": "",
        "trends": []
    }
    
    if not date_cols or not numeric_cols:
        result["reason"] = "Trend analysis requires at least one date column and one numeric column."
        return result
        
    try:
        date_col = date_cols[0]
        # Pick the first numeric col that looks like a metric (not an ID)
        metric_col = numeric_cols[0]
        
        # Ensure datetime
        df_temp = df[[date_col, metric_col]].copy()
        df_temp[date_col] = pd.to_datetime(df_temp[date_col], errors='coerce')
        df_temp = df_temp.dropna(subset=[date_col])
        
        if len(df_temp) < 5:
            result["reason"] = "Not enough valid date entries for trend analysis."
            return result
            
        # Sort by date
        df_temp = df_temp.sort_values(by=date_col)
        
        # Group by day, week, or month based on range
        date_range = df_temp[date_col].max() - df_temp[date_col].min()
        
        if date_range.days > 365:
            freq = 'ME' # Monthly
        elif date_range.days > 30:
            freq = 'W' # Weekly
        else:
            freq = 'D' # Daily
            
        trend_df = df_temp.groupby(pd.Grouper(key=date_col, freq=freq))[metric_col].sum().reset_index()
        
        # Format for visualization
        trends = []
        for _, row in trend_df.iterrows():
            trends.append({
                "date": row[date_col].strftime("%Y-%m-%d"),
                "value": float(row[metric_col])
            })
            
        result["status"] = "success"
        result["trends"] = trends
        result["date_column"] = date_col
        result["metric_column"] = metric_col
        result["granularity"] = "Monthly" if freq == 'ME' else ("Weekly" if freq == 'W' else "Daily")
        
    except Exception as e:
        result["status"] = "error"
        result["reason"] = str(e)
        
    return result
