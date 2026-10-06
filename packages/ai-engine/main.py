"""
Dhanshree AI, Data Analysis & Automation Engine
Master CLI Entry Point

Usage:
  python main.py --mode all          # Run all three pillars & export executive reports
  python main.py --mode ml           # Run Machine Learning models & evaluations
  python main.py --mode eda          # Run Exploratory Data Analysis & Statistical Tests
  python main.py --mode automate     # Run Inventory stockout alerts & Pricing automation
  python main.py --test-order        # Real-time inference test for COD fraud risk
"""

import sys
import argparse
import sys
import io
import argparse
import json
from pathlib import Path

# Ensure UTF-8 safe output on Windows terminals
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# Add current directory to path
sys.path.insert(0, str(Path(__file__).parent))

from data.generate_dataset import save_dataset_if_not_exists
from ml.fraud_classifier import CODFraudRiskModel
from ml.customer_segmentation import CustomerSegmentationModel
from ml.demand_forecaster import FestiveDemandForecaster
from analytics.sales_eda import DhanshreeSalesEDA
from analytics.statistical_testing import StatisticalInferenceEngine
from automation.inventory_monitor import InventoryAutomationEngine
from automation.vastu_pricing_automation import harmonize_to_vastu_root, batch_harmonize_catalog
from automation.daily_batch_pipeline import DailyBatchPipeline


def run_ml_mode():
    print("\n[AI Pillar 1] EXECUTING MACHINE LEARNING SUITE...")
    df = save_dataset_if_not_exists()

    # Model 1: COD Fraud
    print("\n1. Training Supervised COD Fraud & Return Risk Classifier...")
    model = CODFraudRiskModel()
    X, y = model.prepare_data(df)
    metrics = model.train_and_evaluate(X, y)
    best_name = metrics['best_model_name']
    print(f"   [OK] Optimal Model: {best_name}")
    print(f"   [OK] Accuracy: {metrics['models'][best_name]['accuracy'] * 100:.2f}%")
    print(f"   [OK] ROC-AUC:  {metrics['models'][best_name]['roc_auc']:.4f}")
    print(f"   [OK] F1-Score: {metrics['models'][best_name]['f1_score']:.4f}")

    # Model 2: Clustering
    print("\n2. Executing Unsupervised Customer Segmentation (K-Means)...")
    seg = CustomerSegmentationModel()
    cust_df = seg.aggregate_customer_features(df)
    seg_res = seg.find_optimal_clusters_and_fit(cust_df)
    print(f"   [OK] Evaluated k=2..6 Silhouette scores: {seg_res['silhouette_scores']}")
    print(f"   [OK] Optimal Clusters: k={seg_res['optimal_k']} (Silhouette: {seg_res['best_silhouette_score']})")
    for prof in seg_res['profiles']:
        print(f"     * Cluster {prof['cluster_id']}: {prof['persona_title']} ({prof['population_pct']}%)")

    # Model 3: Forecasting
    print("\n3. Training Festive Demand Forecaster (Time Series)...")
    forecaster = FestiveDemandForecaster()
    daily_df = forecaster.prepare_time_series(df)
    fore_res = forecaster.train_and_forecast(daily_df)
    print(f"   [OK] Test MAE: {fore_res['test_model_mae']} orders/day")
    print(f"   [OK] Baseline Improvement: {fore_res['performance_improvement_over_baseline']}")
    print("   [OK] 7-Day Ahead Festive Outlook:")
    for f in fore_res['future_14_days_forecast'][:7]:
        print(f"     * {f['date']}: {f['predicted_orders']} orders (Surge: {f['festive_boost_factor']})")


def run_eda_mode():
    print("\n[AI Pillar 2] EXECUTING DATA ANALYSIS & STATISTICAL SUITE...")
    df = save_dataset_if_not_exists()
    eda = DhanshreeSalesEDA(df)
    res = eda.run_full_eda()

    print("\n1. Overall Market Velocity:")
    print(f"   - Transactions: {res['overview']['total_transactions']:,}")
    print(f"   - GMV Estimate: NPR {res['overview']['estimated_gross_merchandise_value_npr']:,.2f}")
    print(f"   - Return Rate:  {res['overview']['overall_return_fraud_rate_pct']}%")

    print("\n2. Multi-Country Market Breakdown:")
    for c in res['country_breakdown']:
        print(f"   - {c['country']} ({c['currency']}): {c['orders_count']} orders ({c['market_share_pct']}%) | AOV: {c['currency']} {c['average_order_value']} | COD: {c['cod_adoption_pct']}%")

    print("\n3. Statutory Taxes Collected:")
    for c, tax in res['tax_compliance_summary'].items():
        print(f"   - {c} ({tax['statutory_rate']}): {tax['currency']} {tax['total_tax_collected']:,.2f}")

    print("\n4. Statistical Significance (Vastu Effect):")
    stat_eng = StatisticalInferenceEngine(df)
    v_test = stat_eng.test_vastu_harmonic_effect()
    print(f"   - Harmonic vs Other Return Rate: {v_test['harmonic_return_rate_pct']}% vs {v_test['control_return_rate_pct']}%")
    print(f"   - Difference: {v_test['absolute_difference_pct']}% | p-value: {v_test['p_value']}")
    print(f"   - Conclusion: {v_test['conclusion']}")


def run_automate_mode():
    print("\n[AI Pillar 3] EXECUTING AUTOMATION ENGINE...")

    # Automation 1: Inventory DOI Monitor
    print("\n1. Running Inventory Days-of-Inventory (DOI) Stockout Monitor...")
    sample_inventory = [
        {'sku': 'DHAN-KITCH-01', 'title': 'Philips Digital Air Fryer XL', 'current_stock': 6, 'avg_daily_sales': 2.8, 'supplier': 'Philips Nepal HQ', 'country': 'NP'},
        {'sku': 'DHAN-FEST-02', 'title': 'Tihar Premium Bhai Tika Dry Fruit Box', 'current_stock': 3, 'avg_daily_sales': 6.0, 'supplier': 'Mithila Handloom & Agri', 'country': 'NP'},
        {'sku': 'DHAN-ELEC-03', 'title': 'Apple MacBook Pro M3 Max', 'current_stock': 12, 'avg_daily_sales': 0.7, 'supplier': 'Apple Authorized Distributor', 'country': 'NP'},
        {'sku': 'DHAN-TOYS-04', 'title': 'LEGO Classic Creative Bricks Box', 'current_stock': 1, 'avg_daily_sales': 1.2, 'supplier': 'Global Toy Importers', 'country': 'IN'},
    ]
    inv = InventoryAutomationEngine()
    inv_res = inv.analyze_inventory(sample_inventory)
    print(f"   [OK] Monitored {inv_res['total_skus_monitored']} SKUs.")
    print(f"   [ALERT] Triggered {inv_res['critical_stockout_risk_count']} Critical Stockout Alerts:")
    for a in inv_res['actionable_alerts']:
        print(f"     - [{a['status']}] {a['title']}: {a['current_stock']} units left (~{a['days_of_inventory_remaining']} days). Target reorder: {a['recommended_reorder_units']} units.")

    # Automation 2: Vastu Pricing Harmonization
    print("\n2. Running Automated Vastu & Numerology Price Harmonizer...")
    items = [
        {'id': 'item-01', 'title': 'Smart 4K Cinema TV', 'price': 52999, 'preferred_root': 5},
        {'id': 'item-02', 'title': 'Cashmere Pashmina Shawl', 'price': 8500, 'preferred_root': 6},
        {'id': 'item-03', 'title': 'Brass Puja Diya Set', 'price': 1200, 'preferred_root': 6},
    ]
    pricing_res = batch_harmonize_catalog(items)
    for p in pricing_res['products']:
        print(f"   - {p['title']}: {p['original_price']} -> {p['harmonized_price']} (Root #{p['digital_root']} - {p['vibration_planet']}, Voucher: {p['voucher_code']})")


def run_test_order_mode():
    print("\n[*] REAL-TIME INFERENCE: Scoring Sample Transaction...")
    df = save_dataset_if_not_exists()
    model = CODFraudRiskModel()
    X, y = model.prepare_data(df)
    model.train_and_evaluate(X, y)

    sample_order = {
        'country': 'NP',
        'category': 'Electronics',
        'payment_method': 'COD',
        'device_type': 'Mobile_Web',
        'item_price': 12000.0,
        'digital_root': 3,
        'account_age_days': 2,
        'previous_orders': 0,
        'previous_returns': 0,
        'return_ratio': 0.0,
        'is_new_customer': 1,
        'is_festive_period': 1
    }

    result = model.predict_risk(sample_order)
    print("\nTransaction Features:")
    print(json.dumps(sample_order, indent=2))
    print("\nAI Risk Scoring Output:")
    print(json.dumps(result, indent=2))


def main():
    parser = argparse.ArgumentParser(description="Dhanshree AI, Data Analysis & Automation Engine")
    parser.add_argument('--mode', choices=['all', 'ml', 'eda', 'automate'], default='all',
                        help="Select module to execute (default: all)")
    parser.add_argument('--test-order', action='store_true',
                        help="Run real-time inference on a sample COD order")

    args = parser.parse_args()

    if args.test_order:
        run_test_order_mode()
        return

    if args.mode == 'all':
        pipeline = DailyBatchPipeline()
        pipeline.run_pipeline()
    elif args.mode == 'ml':
        run_ml_mode()
    elif args.mode == 'eda':
        run_eda_mode()
    elif args.mode == 'automate':
        run_automate_mode()


if __name__ == '__main__':
    main()
