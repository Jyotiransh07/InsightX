import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

def perform_clustering(df: pd.DataFrame, profiling_metadata: dict) -> dict:
    numeric_cols = [c["column"] for c in profiling_metadata["columns"] if c["type"] == "numeric"]
    
    result = {
        "status": "skipped",
        "reason": "",
        "clusters": []
    }
    
    if len(numeric_cols) < 2:
        result["reason"] = "Clustering requires at least two numeric features."
        return result
        
    if len(df) < 20:
        result["reason"] = "Dataset is too small for meaningful clustering."
        return result
        
    try:
        # Take up to 3 most important numeric columns for visualization simplicity
        # Ideally we'd do PCA, but for hackathon keeping it simple
        selected_cols = numeric_cols[:3]
        
        X = df[selected_cols].copy()
        
        # Fill missing values
        X = X.fillna(X.median())
        
        # Scale
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        
        # Choose K
        k = 3 if len(df) > 50 else 2
        
        kmeans = KMeans(n_clusters=k, random_state=42, n_init='auto')
        clusters = kmeans.fit_predict(X_scaled)
        
        # Format for output
        # Return a sample of clustered data for plotting (x, y, cluster)
        plot_data = []
        # Sample down if too large for frontend
        sample_size = min(500, len(df))
        indices = np.random.choice(len(df), sample_size, replace=False)
        
        for idx in indices:
            point = {
                "x": float(X.iloc[idx, 0]),
                "y": float(X.iloc[idx, 1]),
                "cluster": int(clusters[idx])
            }
            if len(selected_cols) == 3:
                point["z"] = float(X.iloc[idx, 2])
            plot_data.append(point)
            
        result["status"] = "success"
        result["clusters"] = plot_data
        result["features"] = selected_cols
        result["num_clusters"] = k
        
    except Exception as e:
        result["status"] = "error"
        result["reason"] = str(e)
        
    return result
