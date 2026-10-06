"""
Customer Segmentation & Cohort Clustering (Unsupervised Machine Learning)
Follows strict ML best practices:
- Aggregation by customer entity
- Standardization of numerical features
- Optimal cluster selection via Silhouette Score analysis across k in [2..6]
- Centroid analysis and business profile narratives
"""

import numpy as np
import pandas as pd
from typing import Dict, Any, List
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score


class CustomerSegmentationModel:
    def __init__(self, random_state: int = 42):
        self.random_state = random_state
        self.optimal_k = None
        self.scaler = StandardScaler()
        self.kmeans_model = None
        self.silhouette_scores: Dict[int, float] = {}
        self.cluster_profiles: List[Dict[str, Any]] = []

    def aggregate_customer_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Aggregate transaction level data to unique customer level profiles.
        """
        cust_df = df.groupby('customer_id').agg(
            total_orders=('order_id', 'count'),
            total_spend=('item_price', 'sum'),
            avg_order_value=('item_price', 'mean'),
            max_order_value=('item_price', 'max'),
            account_age_days=('account_age_days', 'max'),
            total_returns=('previous_returns', 'max'),
            festive_orders=('is_festive_period', 'sum'),
            harmonic_vastu_orders=('digital_root', lambda x: sum(1 for val in x if val in [5, 6]))
        ).reset_index()

        cust_df['return_rate'] = np.where(
            cust_df['total_orders'] > 0,
            cust_df['total_returns'] / cust_df['total_orders'],
            0.0
        )
        
        cust_df['vastu_preference_ratio'] = np.where(
            cust_df['total_orders'] > 0,
            cust_df['harmonic_vastu_orders'] / cust_df['total_orders'],
            0.0
        )

        return cust_df

    def find_optimal_clusters_and_fit(self, cust_df: pd.DataFrame) -> Dict[str, Any]:
        """
        Perform silhouette score evaluation across k=2..6 and fit optimal model.
        """
        feature_cols = [
            'total_orders', 'total_spend', 'avg_order_value',
            'account_age_days', 'return_rate', 'vastu_preference_ratio'
        ]

        X_raw = cust_df[feature_cols].copy()
        
        # Standardize features
        X_scaled = self.scaler.fit_transform(X_raw)

        best_score = -1.0
        best_k = 3

        for k in range(2, 7):
            km = KMeans(n_clusters=k, random_state=self.random_state, n_init=10)
            labels = km.fit_predict(X_scaled)
            score = float(silhouette_score(X_scaled, labels))
            self.silhouette_scores[k] = round(score, 4)

            if score > best_score:
                best_score = score
                best_k = k

        self.optimal_k = best_k
        self.kmeans_model = KMeans(n_clusters=self.optimal_k, random_state=self.random_state, n_init=10)
        cust_df['cluster_id'] = self.kmeans_model.fit_predict(X_scaled)

        # Profile Centroids
        self.cluster_profiles = []
        for c_id in range(self.optimal_k):
            sub = cust_df[cust_df['cluster_id'] == c_id]
            size = len(sub)
            pct = round((size / len(cust_df)) * 100, 1)

            avg_orders = round(float(sub['total_orders'].mean()), 1)
            avg_spend = round(float(sub['total_spend'].mean()), 2)
            avg_aov = round(float(sub['avg_order_value'].mean()), 2)
            avg_ret = round(float(sub['return_rate'].mean() * 100), 1)
            avg_vastu = round(float(sub['vastu_preference_ratio'].mean() * 100), 1)

            # Assign business persona
            if avg_spend > cust_df['total_spend'].median() * 1.5 and avg_ret < 15:
                persona = "Venus #6 VIP Brand Advocates (High LTV, Low Returns)"
                strategy = "Exclusive luxury bundles, VIP early festive access, personal concierge"
            elif avg_orders > cust_df['total_orders'].median() and avg_vastu > 30:
                persona = "Mercury #5 Fast-Paced Deal Shoppers (Frequent, Discount Responsive)"
                strategy = "Lightning deals, flash discount vouchers (DHAN5), gamified rewards"
            elif avg_ret > 25:
                persona = "High Return / Friction Cohort"
                strategy = "Restrict high-value COD, mandatory OTP verification, return fee warnings"
            else:
                persona = "Saturn #8 Steady Core Consumers (Conservative, Reliable)"
                strategy = "Quality assurances, warranty highlights, trust and escrow badges"

            self.cluster_profiles.append({
                'cluster_id': c_id,
                'persona_title': persona,
                'population_count': size,
                'population_pct': pct,
                'mean_orders': avg_orders,
                'mean_total_spend': avg_spend,
                'mean_aov': avg_aov,
                'mean_return_rate_pct': avg_ret,
                'vastu_preference_pct': avg_vastu,
                'marketing_recommendation': strategy
            })

        return {
            'optimal_k': self.optimal_k,
            'silhouette_scores': self.silhouette_scores,
            'best_silhouette_score': round(best_score, 4),
            'total_customers_analyzed': len(cust_df),
            'profiles': self.cluster_profiles
        }
