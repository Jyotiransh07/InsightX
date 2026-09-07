from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
import pandas as pd
import numpy as np
import io
import json

from services.profiling_service import profile_dataset
from services.cleaning_service import clean_dataset
from services.visualization_service import recommend_visualizations
from services.insight_service import generate_insights

from analytics.statistics import calculate_descriptive_stats
from analytics.correlation import calculate_correlations
from analytics.outlier_detection import detect_outliers
from analytics.clustering import perform_clustering
from analytics.trend_analysis import analyze_trends

router = APIRouter()

def sanitize_for_json(obj):
    """
    Recursively sanitizes any NumPy, Pandas, NaN, NaT, or non-primitive object
    into standard JSON-compliant Python types (int, float, str, bool, None).
    Guarantees no 500 serialization crashes.
    """
    if isinstance(obj, dict):
        return {str(k): sanitize_for_json(v) for k, v in obj.items()}
    elif isinstance(obj, (list, tuple, set)):
        return [sanitize_for_json(v) for v in obj]
    elif isinstance(obj, (np.integer, int)):
        return int(obj)
    elif isinstance(obj, (np.floating, float)):
        if np.isnan(obj) or np.isinf(obj):
            return None
        return round(float(obj), 4)
    elif isinstance(obj, (np.bool_, bool)):
        return bool(obj)
    elif isinstance(obj, (pd.Timestamp, np.datetime64)):
        return str(obj)
    elif pd.isna(obj):
        return None
    return obj

def process_dataframe(df: pd.DataFrame, filename: str):
    if df.empty or len(df) == 0:
        raise ValueError("The uploaded dataset contains no rows.")
        
    # 1. Profile Raw Data
    raw_profiling = profile_dataset(df)
    
    # 2. Clean Data
    cleaned_df, cleaning_report = clean_dataset(df.copy(), raw_profiling)
    
    # 3. Profile Cleaned Data
    clean_profiling = profile_dataset(cleaned_df)
    
    # 4. Analytics Engine
    analytics_results = {}
    analytics_results["statistics"] = calculate_descriptive_stats(cleaned_df, clean_profiling)
    analytics_results["correlation"] = calculate_correlations(cleaned_df, clean_profiling)
    analytics_results["outliers"] = detect_outliers(cleaned_df, clean_profiling)
    analytics_results["clusters"] = perform_clustering(cleaned_df, clean_profiling)
    analytics_results["trends"] = analyze_trends(cleaned_df, clean_profiling)
    
    # 5. Visualization Recommendation with real data
    charts = recommend_visualizations(cleaned_df, clean_profiling, analytics_results)
    
    # 6. Insight Generation
    insights = generate_insights(clean_profiling, analytics_results)
    
    # 7. Data Explorer Payload (First 100 rows preview)
    preview_df = cleaned_df.head(100).copy()
    # Convert dates/objects to string for clean serialization
    for col in preview_df.columns:
        if pd.api.types.is_datetime64_any_dtype(preview_df[col]):
            preview_df[col] = preview_df[col].astype(str)
    
    records = preview_df.to_dict(orient="records")
    explorer_data = [sanitize_for_json(r) for r in records]
    
    payload = {
        "status": "success",
        "filename": filename,
        "data_quality": cleaning_report,
        "metadata": clean_profiling,
        "analytics": analytics_results,
        "charts": charts,
        "insights": insights,
        "explorer_data": explorer_data
    }
    
    return sanitize_for_json(payload)

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        content = await file.read()
        filename = file.filename or "dataset.csv"
        
        if filename.endswith(".csv"):
            try:
                df = pd.read_csv(io.BytesIO(content))
            except UnicodeDecodeError:
                df = pd.read_csv(io.BytesIO(content), encoding="latin1")
        elif filename.endswith((".xls", ".xlsx")):
            df = pd.read_excel(io.BytesIO(content))
        elif filename.endswith(".json"):
            df = pd.read_json(io.BytesIO(content))
        elif filename.endswith((".tsv", ".tab")):
            df = pd.read_csv(io.BytesIO(content), sep="\t")
        else:
            # Attempt CSV parsing fallback
            try:
                df = pd.read_csv(io.BytesIO(content))
            except Exception:
                raise HTTPException(status_code=400, detail="Unsupported file format. Please upload CSV, Excel, or JSON.")
                
        return process_dataframe(df, filename)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing dataset: {str(e)}")

# Sample Datasets for instant 1-click evaluation (like analyzedata.io)
@router.get("/sample/{sample_type}")
async def get_sample_data(sample_type: str):
    np.random.seed(42)
    n = 120
    
    if sample_type == "ecommerce":
        dates = pd.date_range(start="2024-01-01", periods=n, freq="D")
        categories = ["Electronics", "Fashion", "Home & Garden", "Fitness", "Beauty"]
        cat_choices = np.random.choice(categories, size=n, p=[0.35, 0.25, 0.15, 0.15, 0.10])
        sales = np.random.normal(loc=1200, scale=450, size=n).clip(150, 4500)
        units = np.random.poisson(lam=18, size=n).clip(1, 60)
        discount = np.random.uniform(0.05, 0.35, size=n)
        ratings = np.random.uniform(3.2, 5.0, size=n).round(1)
        
        df = pd.DataFrame({
            "Transaction_ID": [f"TRX-{1000+i}" for i in range(n)],
            "Date": dates.strftime("%Y-%m-%d"),
            "Category": cat_choices,
            "Revenue": sales.round(2),
            "Units_Sold": units,
            "Discount_Rate": discount.round(2),
            "Customer_Rating": ratings
        })
        filename = "ecommerce_sales_sample.csv"
        
    elif sample_type == "saas":
        dates = pd.date_range(start="2024-01-01", periods=n, freq="D")
        mrr = np.cumsum(np.random.normal(loc=850, scale=300, size=n)) + 25000
        active_users = (mrr * 0.12 + np.random.normal(0, 150, n)).clip(500, 20000).astype(int)
        plans = np.random.choice(["Free Tier", "Pro Starter", "Enterprise Growth"], size=n, p=[0.5, 0.35, 0.15])
        churn_rate = np.random.uniform(1.2, 4.8, size=n).round(2)
        cac = np.random.normal(loc=180, scale=35, size=n).round(2)
        
        df = pd.DataFrame({
            "Record_Date": dates.strftime("%Y-%m-%d"),
            "Subscription_Plan": plans,
            "MRR_USD": mrr.round(2),
            "Active_Users": active_users,
            "Churn_Rate_Pct": churn_rate,
            "CAC_USD": cac
        })
        filename = "saas_metrics_sample.csv"
        
    elif sample_type == "hr":
        depts = ["Engineering", "Sales", "Product", "Operations", "Marketing", "HR"]
        dept_choices = np.random.choice(depts, size=n)
        salary = np.random.normal(loc=95000, scale=28000, size=n).clip(45000, 210000).round(0)
        tenure_years = np.random.uniform(0.5, 9.5, size=n).round(1)
        performance_score = np.random.choice([1, 2, 3, 4, 5], size=n, p=[0.05, 0.15, 0.50, 0.20, 0.10])
        remote_status = np.random.choice(["Remote", "Hybrid", "In-Office"], size=n, p=[0.4, 0.45, 0.15])
        attrition_risk = (tenure_years * -0.05 + (5 - performance_score) * 0.15 + np.random.uniform(0, 0.2, n)).clip(0.05, 0.95).round(2)
        
        df = pd.DataFrame({
            "Employee_ID": [f"EMP-{5000+i}" for i in range(n)],
            "Department": dept_choices,
            "Salary_USD": salary,
            "Tenure_Years": tenure_years,
            "Performance_Score": performance_score,
            "Work_Arrangement": remote_status,
            "Attrition_Risk": attrition_risk
        })
        filename = "hr_workforce_sample.csv"
    else:
        # Default sample
        dates = pd.date_range(start="2024-01-01", periods=60, freq="D")
        df = pd.DataFrame({
            "Date": dates.strftime("%Y-%m-%d"),
            "Traffic": np.random.randint(1500, 8500, size=60),
            "Conversion_Rate": np.random.uniform(1.8, 5.4, size=60).round(2),
            "Channel": np.random.choice(["Direct", "Organic Search", "Paid Ads", "Social"], size=60)
        })
        filename = "web_traffic_sample.csv"
        
    return process_dataframe(df, filename)

class QuestionQuery(BaseModel):
    question: str
    metadata: dict
    analytics: dict

@router.post("/query")
async def ask_question(body: QuestionQuery):
    """
    Plain English Q&A over the analyzed dataset (like analyzedata.io).
    Translates questions about summary, trends, correlations, outliers into clear answers.
    """
    q = body.question.lower().strip()
    stats = body.analytics.get("statistics", [])
    corr = body.analytics.get("correlation", {})
    outliers = body.analytics.get("outliers", {})
    trends = body.analytics.get("trends", {})
    meta = body.metadata.get("overview", {})
    
    # Keyword detection and smart extraction
    if any(k in q for k in ["how many rows", "record count", "total records", "size", "rows", "columns"]):
        return {
            "answer": f"The dataset contains {meta.get('num_rows', 0):,} total rows and {meta.get('num_cols', 0)} columns across {sum(meta.get('column_types', {}).values())} detected features.",
            "type": "summary",
            "stat": f"{meta.get('num_rows', 0):,} Rows"
        }
        
    elif any(k in q for k in ["outlier", "anomaly", "anomalies", "abnormal"]):
        count = outliers.get("total_anomalies", 0)
        affected = ", ".join(outliers.get("affected_columns", [])) or "None"
        return {
            "answer": f"We detected {count} statistical anomalies using the Interquartile Range (IQR 1.5×) method. Affected columns: {affected}.",
            "type": "outlier",
            "stat": f"{count} Anomalies"
        }
        
    elif any(k in q for k in ["correlat", "relation", "relationship", "dependent"]):
        pos = corr.get("strongest_positive")
        neg = corr.get("strongest_negative")
        msg = ""
        if pos:
            msg += f"Strongest positive relationship is between '{pos['cols'][0]}' and '{pos['cols'][1]}' (Pearson r = {pos['value']:.2f}). "
        if neg and neg.get("value", 0) < -0.3:
            msg += f"Strongest inverse relationship is between '{neg['cols'][0]}' and '{neg['cols'][1]}' (r = {neg['value']:.2f})."
        if not msg:
            msg = "No significant linear correlations (|r| > 0.4) were detected among numeric columns."
        return {
            "answer": msg,
            "type": "correlation",
            "stat": f"r = {pos['value']:.2f}" if pos else "r < 0.4"
        }
        
    elif any(k in q for k in ["trend", "growth", "over time", "change", "direction"]):
        if trends.get("status") == "success":
            t_list = trends.get("trends", [])
            if t_list:
                first_v = t_list[0]["value"]
                last_v = t_list[-1]["value"]
                pct = ((last_v - first_v) / max(1, first_v)) * 100
                direction = "grew" if pct >= 0 else "declined"
                return {
                    "answer": f"Analysis of '{trends.get('metric_column')}' over time ({trends.get('granularity')}) shows that values {direction} by {abs(pct):.1f}% from {first_v:,.1f} to {last_v:,.1f}.",
                    "type": "trend",
                    "stat": f"{pct:+.1f}%"
                }
        return {
            "answer": "No date/temporal column was detected in this dataset to perform time-series trend analysis.",
            "type": "trend",
            "stat": "N/A"
        }
        
    elif any(k in q for k in ["average", "mean", "median", "summary", "stats", "highest", "max", "min"]):
        if stats:
            s0 = stats[0]
            return {
                "answer": f"For the primary metric '{s0['column']}', the average is {s0['mean']:,.2f} with a median of {s0['median']:,.2f}, ranging from {s0['min']:,.2f} to {s0['max']:,.2f}.",
                "type": "stats",
                "stat": f"Avg: {s0['mean']:,.1f}"
            }
            
    # Default fallback answer using overall insights
    return {
        "answer": f"Based on the automatic analysis of your dataset ({meta.get('num_rows', 0)} rows), key features show stable distributions with {outliers.get('total_anomalies', 0)} identified anomalies and {len(stats)} analyzed numerical dimensions.",
        "type": "general",
        "stat": "AI Analyzed"
    }
