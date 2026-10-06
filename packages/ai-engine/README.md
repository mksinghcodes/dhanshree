# 🧠 Dhanshree AI, Data Analysis & Automation Engine (पाइथन एआई इन्जिन)

A production-grade Python 3.14+ subsystem providing **Machine Learning (AI)**, **Data Analysis (EDA & Statistical Testing)**, and **Business Automation** tailored for Dhanshree's multi-country e-commerce ecosystem across Nepal (NPR), India (INR), and UAE (AED).

---

## 🏛️ Architecture Overview (संरचना)

The engine is structured into three dedicated pillars:

```
packages/ai-engine/
├── .venv/                         # Isolated Virtual Environment (pip & venv)
├── requirements.txt               # Locked dependencies (numpy, pandas, scikit-learn, scipy)
├── main.py                        # Master CLI & Real-time inference entry point
├── data/
│   ├── generate_dataset.py        # Realistic multi-country transaction simulator
│   └── transactions.csv           # Seed dataset (5,000 orders)
├── ml/                            # [Pillar 1] Machine Learning
│   ├── fraud_classifier.py        # COD & Fraud Risk Classifier (Logistic Regression & Random Forest)
│   ├── customer_segmentation.py   # Unsupervised K-Means clustering (optimal k via Silhouette scores)
│   └── demand_forecaster.py       # Time Series Demand Forecaster for festive surges (MAE / RMSE)
├── analytics/                     # [Pillar 2] Data Analysis & Statistics
│   ├── sales_eda.py               # Exploratory Data Analysis, tax metrics, and outlier detection
│   └── statistical_testing.py     # 95% Bootstrap CI & two-proportion hypothesis tests
├── automation/                    # [Pillar 3] Business Automation
│   ├── inventory_monitor.py       # Days-of-Inventory (DOI) calculator & multi-channel alerts
│   ├── vastu_pricing_automation.py# Automated price alignment to roots 5 (Mercury) & 6 (Venus)
│   └── daily_batch_pipeline.py    # Daily scheduled orchestrator exporting JSON/Markdown reports
└── reports/
    ├── daily_executive_report.json# Machine-readable report for API / Web integration
    └── daily_executive_report.md  # Human-readable executive markdown briefing
```

---

## 🚀 Quick Start & CLI Execution (कसरी चलाउने)

Run directly via `npm` from the monorepo root:

```bash
# 1. Run all three pillars & generate executive reports
npm run ai:all

# 2. Run Machine Learning models (COD Fraud, Clustering, Demand Forecasting)
npm run ai:ml

# 3. Run Exploratory Data Analysis & Statistical Significance Testing
npm run ai:eda

# 4. Run Inventory DOI monitor & Vastu pricing batch harmonizer
npm run ai:automate

# 5. Test real-time inference on an incoming sample COD order
npm run ai:test-order
```

Or run directly using Python in the virtual environment:

```bash
# Windows
.\packages\ai-engine\.venv\Scripts\python.exe packages/ai-engine/main.py --mode all

# Linux / macOS
./packages/ai-engine/.venv/bin/python packages/ai-engine/main.py --mode all
```

---

## 🔬 Core Algorithms & Methodologies

### 1. Machine Learning (मेसिन लर्निङ / AI)
- **Supervised COD Fraud Classifier:** Evaluates customer age, return ratio, order value, payment method, and country risk. Compares Logistic Regression against Random Forest with strict featurization ordering (splitting train/test before fitting pipelines) per ML best practices.
- **Unsupervised Customer Segmentation:** K-Means clustering with automated Silhouette score evaluation across $k \in [2..6]$. Identifies customer personas (*Venus VIPs*, *Mercury Fast-Movers*, *High Return Cohorts*).
- **Time Series Festive Forecasting:** Chronological split (train/validation/test) modeling seasonal holiday demand (Dashain, Tihar, Chhath) with lag-1, lag-7, and rolling 7-day features.

### 2. Data Analysis (डेटा एनालिसिस)
- **Multi-Country Revenue Analysis:** Detailed market share, GMV, and AOV for Nepal (NPR), India (INR), and UAE (AED).
- **Statutory Tax Tracking:** 13% Nepal VAT, 18% India GST (CGST/SGST), and 5% UAE VAT calculations.
- **Statistical Significance Testing:** Two-proportion Z-test and 1,000-iteration bootstrapping providing 95% confidence intervals on the stability effect of Vastu roots 5 and 6.

### 3. Automation (अटोमेसन)
- **Inventory DOI Alerts:** Real-time calculation of Days of Inventory Remaining ($DOI = \frac{\text{Current Stock}}{\text{Daily Sales Velocity}}$), automatically calculating required reorder quantities and generating notification payloads.
- **Numerology Batch Pricing:** Harmonizes prices so their single-digit digital root sum resolves to **5 (Mercury)** or **6 (Venus)** with minimal price variance ($\pm 1 \text{ to } 4$ currency units).
- **Executive Daily Exporter:** Exports consolidated daily KPI summaries in JSON for dashboard consumption and Markdown for leadership review.
