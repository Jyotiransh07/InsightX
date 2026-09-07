import pandas as pd
import numpy as np

def safe_float(val, default=0.0):
    try:
        f = float(val)
        return default if np.isnan(f) or np.isinf(f) else round(f, 2)
    except Exception:
        return default

def recommend_visualizations(df: pd.DataFrame, profiling_metadata: dict, analytics_results: dict) -> list:
    charts = []
    
    num_cols = [c["column"] for c in profiling_metadata["columns"] if c["type"] == "numeric" and c["column"] in df.columns]
    cat_cols = [c["column"] for c in profiling_metadata["columns"] if c["type"] in ["categorical", "text"] and c["column"] in df.columns]
    date_cols = [c["column"] for c in profiling_metadata["columns"] if c["type"] == "date" and c["column"] in df.columns]
    
    palette = ["#3b82f6", "#6366f1", "#0ea5e9", "#8b5cf6", "#10b981", "#f59e0b"]
    chart_id = 1
    
    # 1. Trend Line/Area Chart (Time Series)
    if "trends" in analytics_results and analytics_results["trends"].get("status") == "success":
        trend_info = analytics_results["trends"]
        if trend_info.get("trends"):
            charts.append({
                "id": f"chart_{chart_id}",
                "type": "area",
                "title": f"{trend_info['metric_column']} Over Time",
                "subtitle": f"{trend_info.get('granularity', 'Daily')} aggregation based on {trend_info.get('date_column', 'date')}",
                "data": trend_info["trends"][:60],
                "xAxis": "date",
                "yAxis": "value",
                "color": palette[0],
                "gridArea": "col-span-12 lg:col-span-8"
            })
            chart_id += 1
            
    # 2. Categorical Distribution Bar Charts (up to 2 categories)
    for cat_idx, primary_cat in enumerate(cat_cols[:2]):
        cat_data = []
        chart_title = ""
        # Aggregate by sum of first numeric column if available
        if num_cols and cat_idx == 0:
            primary_num = num_cols[0]
            try:
                grouped = df.groupby(primary_cat)[primary_num].sum().reset_index()
                grouped = grouped.sort_values(by=primary_num, ascending=False).head(10)
                cat_data = [
                    {"name": str(row[primary_cat])[:20], "value": safe_float(row[primary_num])}
                    for _, row in grouped.iterrows()
                ]
                chart_title = f"{primary_num} by {primary_cat}"
            except Exception:
                pass
                
        if not cat_data:
            try:
                vc = df[primary_cat].value_counts().head(10).reset_index()
                vc.columns = ["name", "value"]
                cat_data = [
                    {"name": str(row["name"])[:20], "value": int(row["value"])}
                    for _, row in vc.iterrows()
                ]
                chart_title = f"Distribution by {primary_cat}"
            except Exception:
                pass
            
        if cat_data:
            charts.append({
                "id": f"chart_{chart_id}",
                "type": "bar",
                "title": chart_title,
                "subtitle": f"Top distribution in {primary_cat}",
                "data": cat_data,
                "xAxis": "name",
                "yAxis": "value",
                "color": palette[(chart_id - 1) % len(palette)],
                "gridArea": "col-span-12 lg:col-span-6" if len(charts) > 0 else "col-span-12"
            })
            chart_id += 1
            
    # 3. Numeric Distributions / Histograms (up to 2 numeric features)
    for num_idx, target_num in enumerate(num_cols[:2]):
        try:
            s = pd.to_numeric(df[target_num], errors="coerce").dropna()
            s = s[np.isfinite(s)]
            if len(s) >= 3:
                num_bins = min(10, max(3, len(s) // 4))
                if s.nunique() > 1:
                    counts, bin_edges = np.histogram(s, bins=num_bins)
                    hist_data = []
                    for i in range(len(counts)):
                        label = f"{round(bin_edges[i], 1)} - {round(bin_edges[i+1], 1)}"
                        hist_data.append({
                            "range": label,
                            "count": int(counts[i])
                        })
                else:
                    # Constant value
                    val = round(s.iloc[0], 1)
                    hist_data = [{"range": f"Exact value: {val}", "count": len(s)}]
                    
                charts.append({
                    "id": f"chart_{chart_id}",
                    "type": "histogram",
                    "title": f"{target_num} Distribution Frequency",
                    "subtitle": "Binned frequency histogram",
                    "data": hist_data,
                    "xAxis": "range",
                    "yAxis": "count",
                    "color": palette[(chart_id - 1) % len(palette)],
                    "gridArea": "col-span-12 lg:col-span-6"
                })
                chart_id += 1
        except Exception:
            pass

    # 4. Correlation Scatter Plot
    if "correlation" in analytics_results:
        corr = analytics_results["correlation"]
        strong = corr.get("strongest_positive") or corr.get("strongest_negative")
        if strong and strong.get("cols") and len(strong["cols"]) >= 2:
            c1, c2 = strong["cols"][0], strong["cols"][1]
            if c1 in df.columns and c2 in df.columns:
                try:
                    sample_sub = df[[c1, c2]].dropna().head(100)
                    scatter_data = [
                        {"x": safe_float(r[c1]), "y": safe_float(r[c2]), "label": f"{c1}: {r[c1]}, {c2}: {r[c2]}"}
                        for _, r in sample_sub.iterrows()
                    ]
                    if scatter_data:
                        r_val = strong.get('value')
                        r_text = f"r = {r_val:.2f}" if isinstance(r_val, (int, float)) else ""
                        charts.append({
                            "id": f"chart_{chart_id}",
                            "type": "scatter",
                            "title": f"Relationship: {c1} vs {c2}",
                            "subtitle": f"Pearson Correlation {r_text}".strip(),
                            "data": scatter_data,
                            "xCol": c1,
                            "yCol": c2,
                            "color": palette[(chart_id - 1) % len(palette)],
                            "gridArea": "col-span-12 lg:col-span-6"
                        })
                        chart_id += 1
                except Exception:
                    pass

    # 5. ML Clusters Scatter
    if "clusters" in analytics_results and analytics_results["clusters"].get("status") == "success":
        cluster_info = analytics_results["clusters"]
        if cluster_info.get("clusters"):
            charts.append({
                "id": f"chart_{chart_id}",
                "type": "cluster_scatter",
                "title": f"K-Means Machine Learning Clusters (K={cluster_info['num_clusters']})",
                "subtitle": f"Segmentation across {', '.join(cluster_info['features'][:2])}",
                "data": cluster_info["clusters"][:150],
                "features": cluster_info["features"],
                "gridArea": "col-span-12"
            })
            chart_id += 1

    # Fallback Guarantee: If still no charts, create basic metric summaries from any column
    if not charts:
        for col in df.columns[:3]:
            try:
                vc = df[col].astype(str).value_counts().head(8).reset_index()
                vc.columns = ["name", "value"]
                data = [{"name": str(r["name"])[:20], "value": int(r["value"])} for _, r in vc.iterrows()]
                if data:
                    charts.append({
                        "id": f"chart_{chart_id}",
                        "type": "bar",
                        "title": f"Frequency Breakdown: {col}",
                        "subtitle": f"Sample distribution of {col}",
                        "data": data,
                        "xAxis": "name",
                        "yAxis": "value",
                        "color": palette[(chart_id - 1) % len(palette)],
                        "gridArea": "col-span-12 lg:col-span-6"
                    })
                    chart_id += 1
            except Exception:
                pass

    return charts
