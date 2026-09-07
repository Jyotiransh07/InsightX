def generate_insights(profiling_metadata: dict, analytics_results: dict) -> list:
    insights = []
    
    # Overview
    rows = profiling_metadata["overview"]["num_rows"]
    cols = profiling_metadata["overview"]["num_cols"]
    insights.append({
        "type": "overview",
        "title": "Dataset Overview",
        "description": f"The dataset contains {rows} records and {cols} columns.",
        "importance": "high"
    })
    
    # Trends
    if "trends" in analytics_results and analytics_results["trends"].get("status") == "success":
        metric = analytics_results["trends"]["metric_column"]
        trends_data = analytics_results["trends"]["trends"]
        if trends_data:
            first_val = trends_data[0]["value"]
            last_val = trends_data[-1]["value"]
            direction = "increased" if last_val > first_val else "decreased"
            pct = abs(last_val - first_val) / max(1, first_val) * 100
            
            insights.append({
                "type": "trend",
                "title": f"{metric} Trend",
                "description": f"Overall, {metric} has {direction} by approximately {pct:.1f}% over the observed period.",
                "importance": "high"
            })
            
    # Correlation
    if "correlation" in analytics_results:
        corr = analytics_results["correlation"]
        if corr.get("strongest_positive"):
            c1, c2 = corr["strongest_positive"]["cols"]
            val = corr["strongest_positive"]["value"]
            if val > 0.7:
                insights.append({
                    "type": "correlation",
                    "title": "Strong Positive Relationship",
                    "description": f"There is a strong positive correlation ({val:.2f}) between {c1} and {c2}. As one increases, the other tends to increase.",
                    "importance": "medium"
                })
        
        if corr.get("strongest_negative"):
            c1, c2 = corr["strongest_negative"]["cols"]
            val = corr["strongest_negative"]["value"]
            if val < -0.7:
                insights.append({
                    "type": "correlation",
                    "title": "Strong Negative Relationship",
                    "description": f"There is a strong negative correlation ({val:.2f}) between {c1} and {c2}. As one increases, the other tends to decrease.",
                    "importance": "medium"
                })
                
    # Outliers
    if "outliers" in analytics_results:
        anomalies = analytics_results["outliers"].get("total_anomalies", 0)
        if anomalies > 0:
            insights.append({
                "type": "anomaly",
                "title": "Anomalies Detected",
                "description": f"Detected {anomalies} potential anomalous records that deviate significantly from standard patterns.",
                "importance": "medium" if anomalies < 100 else "high"
            })
            
    # Clusters
    if "clusters" in analytics_results and analytics_results["clusters"].get("status") == "success":
        num_clusters = analytics_results["clusters"]["num_clusters"]
        insights.append({
            "type": "cluster",
            "title": "Data Segmentation",
            "description": f"The AI successfully segmented the dataset into {num_clusters} distinct clusters based on underlying numerical patterns.",
            "importance": "medium"
        })
        
    return insights
