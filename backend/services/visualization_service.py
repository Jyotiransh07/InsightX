import pandas as pd
import numpy as np

def recommend_visualizations(df: pd.DataFrame, profiling_metadata: dict, analytics_results: dict) -> list:
    charts = []
    
    num_cols = [c["column"] for c in profiling_metadata["columns"] if c["type"] == "numeric"]
    cat_cols = [c["column"] for c in profiling_metadata["columns"] if c["type"] == "categorical"]
    date_cols = [c["column"] for c in profiling_metadata["columns"] if c["type"] == "date"]
    
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
                "data": trend_info["trends"][:60], # top 60 points for smooth rendering
                "xAxis": "date",
                "yAxis": "value",
                "color": "#3b82f6",
                "gridArea": "col-span-12 lg:col-span-8"
            })
            chart_id += 1
            
    # 2. Categorical Distribution Bar Chart
    if cat_cols:
        primary_cat = cat_cols[0]
        # Aggregate by count or if numeric col exists, sum of numeric col
        if num_cols:
            primary_num = num_cols[0]
            grouped = df.groupby(primary_cat)[primary_num].sum().reset_index()
            grouped = grouped.sort_values(by=primary_num, ascending=False).head(8)
            cat_data = [
                {"name": str(row[primary_cat])[:15], "value": round(float(row[primary_num]), 2)}
                for _, row in grouped.iterrows()
            ]
            chart_title = f"{primary_num} by {primary_cat}"
        else:
            vc = df[primary_cat].value_counts().head(8).reset_index()
            vc.columns = ["name", "value"]
            cat_data = [
                {"name": str(row["name"])[:15], "value": int(row["value"])}
                for _, row in vc.iterrows()
            ]
            chart_title = f"Distribution by {primary_cat}"
            
        if cat_data:
            charts.append({
                "id": f"chart_{chart_id}",
                "type": "bar",
                "title": chart_title,
                "subtitle": f"Top segments in {primary_cat}",
                "data": cat_data,
                "xAxis": "name",
                "yAxis": "value",
                "color": "#6366f1",
                "gridArea": "col-span-12 lg:col-span-4"
            })
            chart_id += 1
            
    # 3. Numeric Distribution / Histogram
    if num_cols:
        target_num = num_cols[0]
        s = pd.to_numeric(df[target_num], errors="coerce").dropna()
        if len(s) >= 5:
            counts, bin_edges = np.histogram(s, bins=min(10, max(4, len(s)//5)))
            hist_data = []
            for i in range(len(counts)):
                label = f"{round(bin_edges[i], 1)} - {round(bin_edges[i+1], 1)}"
                hist_data.append({
                    "range": label,
                    "count": int(counts[i])
                })
            charts.append({
                "id": f"chart_{chart_id}",
                "type": "histogram",
                "title": f"{target_num} Distribution Frequency",
                "subtitle": "Binned frequency histogram",
                "data": hist_data,
                "xAxis": "range",
                "yAxis": "count",
                "color": "#0ea5e9",
                "gridArea": "col-span-12 lg:col-span-6"
            })
            chart_id += 1

    # 4. Correlation Scatter Plot
    if "correlation" in analytics_results:
        corr = analytics_results["correlation"]
        strong = corr.get("strongest_positive") or corr.get("strongest_negative")
        if strong and strong.get("cols"):
            c1, c2 = strong["cols"][0], strong["cols"][1]
            sample_sub = df[[c1, c2]].dropna().head(100)
            scatter_data = [
                {"x": round(float(r[c1]), 2), "y": round(float(r[c2]), 2), "label": f"{c1}: {r[c1]}, {c2}: {r[c2]}"}
                for _, r in sample_sub.iterrows()
            ]
            if scatter_data:
                charts.append({
                    "id": f"chart_{chart_id}",
                    "type": "scatter",
                    "title": f"Relationship: {c1} vs {c2}",
                    "subtitle": f"Pearson Correlation r = {strong['value']:.2f}",
                    "data": scatter_data,
                    "xCol": c1,
                    "yCol": c2,
                    "color": "#8b5cf6",
                    "gridArea": "col-span-12 lg:col-span-6"
                })
                chart_id += 1

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

    return charts
