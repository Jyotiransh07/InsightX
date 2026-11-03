# 🚀 InsightX – AI-Powered Automated Data Intelligence Platform

<p align="center">
  <strong>Transform Raw Data into Meaningful Insights with AI</strong>
</p>

InsightX is an AI-powered data intelligence platform designed to simplify data analysis and help users make data-driven decisions. It allows users to upload datasets and automatically performs data profiling, cleaning, statistical analysis, pattern detection, and visualization.

By combining Python-based analytics with an interactive web interface, InsightX transforms complex datasets into meaningful insights, visualizations, and actionable recommendations.

---

## 🌟 Key Features

### 📂 1. Dataset Upload
- Upload datasets in CSV, XLSX, and XLS formats.
- Supports analysis of different types of structured datasets.
- Preview uploaded data before analysis.

### 🧹 2. Automated Data Cleaning
- Detect missing values.
- Identify duplicate records.
- Handle inconsistent data.
- Perform data preprocessing and transformation.
- Generate data quality summaries.

### 📊 3. Exploratory Data Analysis (EDA)
- Generate descriptive statistics.
- Analyze numerical and categorical columns.
- Identify correlations between variables.
- Detect outliers and unusual patterns.
- Understand dataset distributions.

### 📈 4. Intelligent Data Visualization
- Generate relevant charts and graphs.
- Visualize relationships between variables.
- Explore trends and patterns.
- Present analytical results through an interactive dashboard.

### 🤖 5. AI-Powered Insights
- Generate automated summaries of datasets.
- Identify important trends and patterns.
- Provide actionable recommendations.
- Simplify complex analytical findings.

### 🔍 6. Advanced Analytics
- Correlation analysis.
- Outlier detection.
- Clustering and segmentation.
- Trend analysis.
- Statistical insights.

### 💬 7. Interactive Data Querying
- Ask questions about uploaded datasets.
- Retrieve relevant analytical information.
- Explore data through natural-language-style queries.

---

## 🛠️ Technology Stack

| Component | Technologies |
|---|---|
| Frontend | React.js, Vite |
| Backend | Python, FastAPI |
| Data Processing | Pandas, NumPy |
| Machine Learning | Scikit-learn |
| Data Visualization | Interactive charts and graphs |
| Workflow Automation | n8n |
| Data Formats | CSV, XLSX, XLS |
| Development Tools | VS Code, Git, GitHub |

---

## 🏗️ Project Architecture

InsightX follows a frontend-backend architecture.

```text
                 ┌──────────────────────┐
                 │      USER            │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │   React + Vite       │
                 │   Frontend           │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │   FastAPI Backend    │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │  Data Processing     │
                 │  & Preprocessing     │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │  Analytics & ML      │
                 │  Engine              │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │  Insights & Charts   │
                 │  Generation          │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │  Interactive         │
                 │  Dashboard           │
                 └──────────────────────┘
```

---

## 📁 Project Structure

```text
InsightX/
│
├── backend/
│   ├── analytics/
│   ├── api/
│   ├── services/
│   ├── utils/
│   └── main.py
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── test_data.csv
│
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites

Make sure you have the following installed:

- Python 3.10+
- Node.js and npm
- Git
- Visual Studio Code (recommended)

### 1. Clone the Repository

```bash
git clone https://github.com/Jyotiransh07/InsightX.git
```

Navigate to the project directory:

```bash
cd InsightX
```

### 2. Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Create a Python virtual environment:

```bash
python -m venv venv
```

Activate the environment.

**Windows:**

```powershell
.\venv\Scripts\Activate.ps1
```

**Linux / macOS:**

```bash
source venv/bin/activate
```

Install the required dependencies:

```bash
pip install fastapi uvicorn pandas numpy scikit-learn python-multipart openpyxl
```

Start the backend server:

```bash
uvicorn main:app --reload
```

Backend API:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend application:

```text
http://localhost:5173
```

---

## 🚀 How It Works

1. **Upload Dataset:** The user uploads a CSV or Excel dataset.
2. **Data Processing:** The backend processes and prepares the uploaded dataset.
3. **Data Analysis:** InsightX performs exploratory data analysis and statistical computations.
4. **Pattern Detection:** The analytics engine identifies correlations, outliers, clusters, and trends.
5. **Insight Generation:** Analytical findings are converted into understandable insights.
6. **Visualization:** Results are presented through an interactive dashboard.
7. **Data Exploration:** Users can explore their datasets and query relevant information.

---

## 🎯 Project Objectives

- Make data analytics accessible and easier to understand.
- Automate repetitive data analysis tasks.
- Reduce manual effort in data preprocessing.
- Identify hidden patterns and relationships in datasets.
- Convert raw data into actionable insights.
- Support informed and data-driven decision-making.

---

## 🔮 Future Enhancements

- Advanced AI-powered conversational data assistant.
- More predictive machine learning models.
- Enhanced interactive visualizations.
- Automated report generation and export.
- Support for additional data sources.
- Improved real-time analytics and recommendations.

---

## 👥 Contributors

This project was collaboratively developed by:

| Contributor | Role |
|---|---|
| **Jyotiransh Rai** | Project Contributor |
| **Fiona Fernandes** | Project Contributor |
| **Madhav Pareek** | Project Contributor |
| **Parmeet Kaur Randhawa** | Project Contributor |

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome!

If you would like to contribute:

1. Fork this repository.
2. Create a new feature branch.
3. Make your changes.
4. Commit your changes.
5. Submit a Pull Request.

---

## 📌 Repository

**GitHub:** https://github.com/Jyotiransh07/InsightX

---

<p align="center">
  <strong>InsightX – Making Data Smarter, One Insight at a Time. 🚀</strong>
</p>
