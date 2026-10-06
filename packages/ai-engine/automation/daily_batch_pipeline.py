"""
Dhanshree Daily Automated AI & Analytics Pipeline
End-to-end automated orchestration pipeline:
- Ingests & validates transactions
- Executes ML COD Fraud detection
- Runs Customer Segmentation
- Generates Demand Forecasts
- Checks Inventory Health
- Exports comprehensive Executive Dashboard Reports (JSON & Markdown)
"""

import sys
import io
import json
from pathlib import Path
from datetime import datetime
import pandas as pd
from typing import Dict, Any

# Ensure UTF-8 safe output on Windows terminals
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

from data.generate_dataset import save_dataset_if_not_exists
from ml.fraud_classifier import CODFraudRiskModel
from ml.customer_segmentation import CustomerSegmentationModel
from ml.demand_forecaster import FestiveDemandForecaster
from analytics.sales_eda import DhanshreeSalesEDA
from analytics.statistical_testing import StatisticalInferenceEngine
from automation.inventory_monitor import InventoryAutomationEngine
from automation.vastu_pricing_automation import batch_harmonize_catalog


class DailyBatchPipeline:
    def __init__(self, output_dir: str = 'packages/ai-engine/reports'):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def run_pipeline(self) -> Dict[str, Any]:
        print("\n==================================================================")
        print("[*] STARTING DHANSHREE DAILY AUTOMATED AI & ANALYTICS PIPELINE")
        print("==================================================================")

        # 1. Ingest Data
        print("\n[Step 1/6] Ingesting transaction data...")
        df = save_dataset_if_not_exists()
        print(f"[OK] Loaded {len(df)} transactions spanning Nepal, India & UAE.")

        # 2. Exploratory Data Analysis (EDA)
        print("\n[Step 2/6] Running Sales EDA & Statutory Tax Analysis...")
        eda_engine = DhanshreeSalesEDA(df)
        eda_results = eda_engine.run_full_eda()
        print(f"[OK] Overview: GMV approx NPR {eda_results['overview']['estimated_gross_merchandise_value_npr']:,.2f}")
        print(f"[OK] Return/Fraud rate: {eda_results['overview']['overall_return_fraud_rate_pct']}%")

        # 3. Statistical Significance Testing
        print("\n[Step 3/6] Running Statistical Hypothesis Testing (95% CI)...")
        stat_engine = StatisticalInferenceEngine(df)
        vastu_test = stat_engine.test_vastu_harmonic_effect()
        ci_kpis = stat_engine.compute_kpi_confidence_intervals()
        print(f"[OK] Vastu Harmonic Effect: {vastu_test['conclusion']} (p={vastu_test['p_value']})")

        # 4. Machine Learning Pillar 1: COD Fraud Classifier
        print("\n[Step 4/6] Training & Evaluating ML COD Fraud & Return Risk Classifier...")
        fraud_model = CODFraudRiskModel()
        X, y = fraud_model.prepare_data(df)
        fraud_metrics = fraud_model.train_and_evaluate(X, y)
        best_model_name = fraud_metrics['best_model_name']
        best_stats = fraud_metrics['models'][best_model_name]
        print(f"[OK] Best Model: {best_model_name} (F1: {best_stats['f1_score']:.3f}, ROC-AUC: {best_stats['roc_auc']:.3f})")

        # 5. Machine Learning Pillar 2: Customer Segmentation & Demand Forecasting
        print("\n[Step 5/6] Running Unsupervised Clustering & Festive Demand Forecasting...")
        seg_model = CustomerSegmentationModel()
        cust_df = seg_model.aggregate_customer_features(df)
        seg_metrics = seg_model.find_optimal_clusters_and_fit(cust_df)
        print(f"[OK] Customer Segmentation: Optimal k={seg_metrics['optimal_k']} (Silhouette: {seg_metrics['best_silhouette_score']})")

        demand_model = FestiveDemandForecaster()
        daily_df = demand_model.prepare_time_series(df)
        demand_metrics = demand_model.train_and_forecast(daily_df)
        print(f"[OK] Demand Forecaster: Model MAE {demand_metrics['test_model_mae']} ({demand_metrics['performance_improvement_over_baseline']} better than baseline)")

        # 6. Automation Pillar: Inventory Health & Pricing Harmonization
        print("\n[Step 6/6] Executing Automation Jobs: Inventory DOI & Vastu Pricing...")
        sample_inventory = [
            {'sku': 'DHAN-KITCH-01', 'title': 'Philips Digital Air Fryer XL', 'current_stock': 8, 'avg_daily_sales': 3.2, 'supplier': 'Philips Nepal HQ', 'country': 'NP'},
            {'sku': 'DHAN-FEST-02', 'title': 'Tihar Premium Bhai Tika Dry Fruit Box', 'current_stock': 4, 'avg_daily_sales': 5.5, 'supplier': 'Mithila Handloom & Agri', 'country': 'NP'},
            {'sku': 'DHAN-ELEC-03', 'title': 'Apple MacBook Pro M3 Max', 'current_stock': 14, 'avg_daily_sales': 0.8, 'supplier': 'Apple Authorized Distributor', 'country': 'NP'},
            {'sku': 'DHAN-APPA-04', 'title': 'Palpali Handloom Dhaka Topi & Silk Khada', 'current_stock': 45, 'avg_daily_sales': 4.1, 'supplier': 'Palpa Weaver Collective', 'country': 'NP'},
            {'sku': 'DHAN-TOYS-05', 'title': 'LEGO Classic Creative Bricks Box', 'current_stock': 2, 'avg_daily_sales': 1.5, 'supplier': 'Global Toy Importers', 'country': 'IN'},
        ]
        inv_engine = InventoryAutomationEngine()
        inv_results = inv_engine.analyze_inventory(sample_inventory)
        print(f"[OK] Inventory Monitored: {inv_results['total_skus_monitored']} SKUs ({inv_results['critical_stockout_risk_count']} Critical Stockout Alerts)")

        sample_products = [
            {'id': 'prod-101', 'title': 'Wireless ANC Headphones', 'category': 'Electronics', 'price': 8999, 'preferred_root': 5},
            {'id': 'prod-102', 'title': 'Ayurvedic Saffron Face Cream', 'category': 'Beauty', 'price': 1450, 'preferred_root': 6},
            {'id': 'prod-103', 'title': 'Handmade Mithila Painting Soop', 'category': 'Festive', 'price': 1800, 'preferred_root': 6},
            {'id': 'prod-104', 'title': 'Gaming Mechanical Keyboard', 'category': 'Computers', 'price': 4200, 'preferred_root': 5},
        ]
        pricing_results = batch_harmonize_catalog(sample_products)
        print(f"[OK] Vastu Pricing Aligned: {pricing_results['total_harmonized_adjustments']} prices adjusted to roots 5 & 6.")

        # Consolidated Report
        report_data = {
            'generated_at': datetime.now().isoformat(),
            'platform': 'Dhanshree E-Commerce Intelligence Core',
            'summary': {
                'total_transactions': eda_results['overview']['total_transactions'],
                'gmv_estimate_npr': eda_results['overview']['estimated_gross_merchandise_value_npr'],
                'fraud_model_roc_auc': best_stats['roc_auc'],
                'optimal_customer_clusters': seg_metrics['optimal_k'],
                'forecast_improvement': demand_metrics['performance_improvement_over_baseline'],
                'critical_stockout_alerts': inv_results['critical_stockout_risk_count']
            },
            'eda': eda_results,
            'statistical_testing': {
                'vastu_effect': vastu_test,
                'confidence_intervals': ci_kpis
            },
            'machine_learning': {
                'cod_fraud_model': fraud_metrics,
                'customer_segmentation': seg_metrics,
                'demand_forecasting': demand_metrics
            },
            'automation': {
                'inventory_health': inv_results,
                'pricing_harmonization': pricing_results
            }
        }

        # Save JSON
        def json_serializable(obj):
            if hasattr(obj, 'item'):
                return obj.item()
            if isinstance(obj, (datetime, pd.Timestamp)):
                return obj.isoformat()
            return str(obj)

        json_path = self.output_dir / 'daily_executive_report.json'
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(report_data, f, indent=2, ensure_ascii=False, default=json_serializable)
        print(f"[OK] Executive report JSON written: {json_path}")

        # Save Markdown Report
        md_path = self.output_dir / 'daily_executive_report.md'
        self._write_markdown_report(md_path, report_data)
        print(f"[OK] Executive report Markdown written: {md_path}")

        print("\n==================================================================")
        print("[SUCCESS] DHANSHREE DAILY AUTOMATED AI & ANALYTICS PIPELINE FINISHED!")
        print("==================================================================\n")

        return report_data

    def _write_markdown_report(self, path: Path, data: Dict[str, Any]):
        overview = data['eda']['overview']
        ml_fraud = data['machine_learning']['cod_fraud_model']
        best_name = ml_fraud['best_model_name']
        best_stats = ml_fraud['models'][best_name]
        clusters = data['machine_learning']['customer_segmentation']['profiles']
        demand = data['machine_learning']['demand_forecasting']
        inv = data['automation']['inventory_health']
        vastu = data['eda']['vastu_numerology_insights']

        md_content = f"""# Dhanshree E-Commerce Intelligence & Automation Report
*Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} | Multi-Market AI Engine (NP, IN, AE)*

---

## 1. Executive Summary & Core KPIs
- **Total Transactions Analyzed:** {overview['total_transactions']:,}
- **Unique Customers:** {overview['unique_customers']:,}
- **Estimated Gross Merchandise Value (GMV):** NPR {overview['estimated_gross_merchandise_value_npr']:,.2f}
- **Overall Cancellation / Fraud Rate:** {overview['overall_return_fraud_rate_pct']}%
- **Vastu Harmonic Vibration Share (Roots 5 & 6):** {vastu['harmonic_vibrations_share_pct']}%

---

## 2. Machine Learning Pillar (मेसिन लर्निङ)

### A. COD Fraud & High-Risk Cancellation Classifier
- **Production Model:** `{best_name}`
- **ROC-AUC Score:** `{best_stats['roc_auc']:.4f}` | **F1-Score:** `{best_stats['f1_score']:.4f}`
- **Accuracy:** `{best_stats['accuracy'] * 100:.2f}%` | **Recall:** `{best_stats['recall'] * 100:.2f}%`
- **Policy Enforcement:** Flags high-risk orders for mandatory OTP verification and disables COD for suspect new accounts.

### B. Unsupervised Customer Segmentation (K-Means)
- **Optimal Clusters Found:** `{data['machine_learning']['customer_segmentation']['optimal_k']}` (Best Silhouette Score: `{data['machine_learning']['customer_segmentation']['best_silhouette_score']}`)
"""
        for prof in clusters:
            md_content += f"""
- **Cluster #{prof['cluster_id']}: {prof['persona_title']}**
  - Population: {prof['population_count']} ({prof['population_pct']}%)
  - Avg Spend: {prof['mean_total_spend']:,.2f} | Return Rate: {prof['mean_return_rate_pct']}%
  - Recommended Strategy: *{prof['marketing_recommendation']}*
"""

        md_content += f"""
### C. Festive Demand Forecasting (Time Series)
- **Model Test MAE:** `{demand['test_model_mae']}` orders/day (RMSE: `{demand['test_model_rmse']}`)
- **Improvement over 7-Day Rolling Baseline:** `{demand['performance_improvement_over_baseline']}`
- **14-Day Upcoming Festive Surge:**
"""
        for f in demand['future_14_days_forecast'][:7]:
            md_content += f"  - `{f['date']}`: **{f['predicted_orders']}** orders (Boost: {f['festive_boost_factor']})\n"

        md_content += f"""
---

## 3. Data Analysis Pillar (डेटा एनालिसिस)

### Statutory Tax Compliance (VAT / GST)
"""
        for c, t in data['eda']['tax_compliance_summary'].items():
            md_content += f"- **{c} ({t['statutory_rate']}):** {t['currency']} {t['total_tax_collected']:,.2f}\n"

        md_content += f"""
### Statistical Significance (Vastu Harmonic Effect)
- **Hypothesis:** {data['statistical_testing']['vastu_effect']['hypothesis']}
- **Harmonic Return Rate:** `{data['statistical_testing']['vastu_effect']['harmonic_return_rate_pct']}%` vs Non-Harmonic: `{data['statistical_testing']['vastu_effect']['control_return_rate_pct']}%`
- **Result:** {data['statistical_testing']['vastu_effect']['conclusion']} (p-value: `{data['statistical_testing']['vastu_effect']['p_value']}`)

---

## 4. Automation Pillar (अटोमेसन)

### Inventory Health & DOI Alerting
- **Total SKUs Scanned:** {inv['total_skus_monitored']}
- **Critical Stockout Risks:** {inv['critical_stockout_risk_count']}
"""
        for a in inv['actionable_alerts']:
            md_content += f"- **[{a['status']}] {a['title']} ({a['sku']}):** {a['current_stock']} units left (~{a['days_of_inventory_remaining']} days DOI). Target Reorder: **{a['recommended_reorder_units']} units** from *{a['supplier']}*.\n"

        md_content += f"""
---
*Automated Report generated by Dhanshree AI Analytics Engine (Python 3.14).*
"""
        with open(path, 'w', encoding='utf-8') as f:
            f.write(md_content)
