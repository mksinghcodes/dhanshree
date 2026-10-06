"""
Dhanshree Multi-Country Sales Exploratory Data Analysis (EDA)
Comprehensive data analysis module covering:
- Cross-border revenue distribution (Nepal NPR, India INR, UAE AED)
- Tax & statutory compliance analytics (VAT & GST metrics)
- Payment Gateway & COD penetration
- Department sales velocity
- Outlier detection using IQR
- Vastu Digital Root distribution analysis
"""

import numpy as np
import pandas as pd
from typing import Dict, Any, List


class DhanshreeSalesEDA:
    def __init__(self, df: pd.DataFrame):
        self.df = df.copy()

    def run_full_eda(self) -> Dict[str, Any]:
        """
        Executes end-to-end multi-dimensional exploratory data analysis.
        """
        results = {
            'overview': self._get_overview(),
            'country_breakdown': self._get_country_breakdown(),
            'tax_compliance_summary': self._get_tax_summary(),
            'payment_method_analysis': self._get_payment_analysis(),
            'category_performance': self._get_category_performance(),
            'vastu_numerology_insights': self._get_vastu_insights(),
            'outlier_analysis': self._get_outlier_analysis(),
        }
        return results

    def _get_overview(self) -> Dict[str, Any]:
        total_orders = len(self.df)
        unique_customers = self.df['customer_id'].nunique()
        total_revenue_approx_npr = float(
            self.df[self.df['country'] == 'NP']['item_price'].sum() +
            self.df[self.df['country'] == 'IN']['item_price'].sum() * 1.6 +
            self.df[self.df['country'] == 'AE']['item_price'].sum() * 36.5
        )

        overall_return_rate = float(self.df['is_fraud_or_return'].mean() * 100)

        return {
            'total_transactions': total_orders,
            'unique_customers': unique_customers,
            'estimated_gross_merchandise_value_npr': round(total_revenue_approx_npr, 2),
            'overall_return_fraud_rate_pct': round(overall_return_rate, 2),
            'date_range_start': str(self.df['order_date'].min()),
            'date_range_end': str(self.df['order_date'].max()),
        }

    def _get_country_breakdown(self) -> List[Dict[str, Any]]:
        country_stats = []
        for c_code, group in self.df.groupby('country'):
            orders_count = len(group)
            pct_orders = round(orders_count / len(self.df) * 100, 1)
            total_rev = round(float(group['item_price'].sum()), 2)
            avg_order = round(float(group['item_price'].mean()), 2)
            currency = group['currency'].iloc[0]
            cod_rate = round(float((group['payment_method'] == 'COD').mean() * 100), 1)
            return_rate = round(float(group['is_fraud_or_return'].mean() * 100), 1)

            country_stats.append({
                'country': c_code,
                'currency': currency,
                'orders_count': orders_count,
                'market_share_pct': pct_orders,
                'total_revenue': total_rev,
                'average_order_value': avg_order,
                'cod_adoption_pct': cod_rate,
                'return_risk_pct': return_rate
            })
        return country_stats

    def _get_tax_summary(self) -> Dict[str, Any]:
        tax_by_country = {}
        for c_code, group in self.df.groupby('country'):
            tax_sum = round(float(group['vat_gst_amount'].sum()), 2)
            curr = group['currency'].iloc[0]
            rate_label = "13% VAT" if c_code == 'NP' else "18% GST" if c_code == 'IN' else "5% VAT"
            tax_by_country[c_code] = {
                'statutory_rate': rate_label,
                'currency': curr,
                'total_tax_collected': tax_sum
            }
        return tax_by_country

    def _get_payment_analysis(self) -> List[Dict[str, Any]]:
        pm_stats = []
        for pm, group in self.df.groupby('payment_method'):
            cnt = len(group)
            pct = round(cnt / len(self.df) * 100, 1)
            ret_rate = round(float(group['is_fraud_or_return'].mean() * 100), 1)
            pm_stats.append({
                'payment_method': pm,
                'transaction_count': cnt,
                'share_pct': pct,
                'return_or_fraud_rate_pct': ret_rate
            })
        pm_stats.sort(key=lambda x: x['transaction_count'], reverse=True)
        return pm_stats

    def _get_category_performance(self) -> List[Dict[str, Any]]:
        cat_stats = []
        for cat, group in self.df.groupby('category'):
            cnt = len(group)
            pct = round(cnt / len(self.df) * 100, 1)
            aov = round(float(group['item_price'].mean()), 2)
            festive_share = round(float(group['is_festive_period'].mean() * 100), 1)
            cat_stats.append({
                'category': cat,
                'orders_count': cnt,
                'volume_share_pct': pct,
                'mean_price': aov,
                'festive_season_concentration_pct': festive_share
            })
        cat_stats.sort(key=lambda x: x['orders_count'], reverse=True)
        return cat_stats

    def _get_vastu_insights(self) -> Dict[str, Any]:
        root_counts = self.df['digital_root'].value_counts().to_dict()
        harmonic_count = sum(root_counts.get(r, 0) for r in [5, 6])
        harmonic_pct = round(harmonic_count / len(self.df) * 100, 1)

        # Compare return rate for harmonic vs non-harmonic
        harmonic_returns = float(self.df[self.df['digital_root'].isin([5, 6])]['is_fraud_or_return'].mean() * 100)
        other_returns = float(self.df[~self.df['digital_root'].isin([5, 6])]['is_fraud_or_return'].mean() * 100)

        return {
            'digital_root_frequencies': {int(k): int(v) for k, v in root_counts.items()},
            'harmonic_vibrations_share_pct': harmonic_pct,
            'harmonic_roots_5_and_6_return_rate_pct': round(harmonic_returns, 2),
            'other_roots_return_rate_pct': round(other_returns, 2),
            'stability_advantage': f"{round(other_returns - harmonic_returns, 2)}% lower returns in harmonic prices"
        }

    def _get_outlier_analysis(self) -> Dict[str, Any]:
        q1 = self.df['item_price'].quantile(0.25)
        q3 = self.df['item_price'].quantile(0.75)
        iqr = q3 - q1
        upper_bound = q3 + 1.5 * iqr
        lower_bound = max(0, q1 - 1.5 * iqr)

        outliers = self.df[self.df['item_price'] > upper_bound]
        return {
            'q1_price': round(float(q1), 2),
            'median_price': round(float(self.df['item_price'].median()), 2),
            'q3_price': round(float(q3), 2),
            'iqr': round(float(iqr), 2),
            'outlier_threshold_high': round(float(upper_bound), 2),
            'outlier_count': int(len(outliers)),
            'outlier_percentage': round(len(outliers) / len(self.df) * 100, 2),
            'max_recorded_price': round(float(self.df['item_price'].max()), 2)
        }
