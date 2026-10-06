"""
COD Fraud & Return Risk Classifier (Supervised Machine Learning)
Follows strict ML best practices:
- Strict featurization ordering (split train/test BEFORE fit)
- Missing value audit & handling
- Baseline comparison (Logistic Regression vs Random Forest)
- Comprehensive evaluation (Precision, Recall, F1, Confusion Matrix, ROC-AUC)
"""

import numpy as np
import pandas as pd
from typing import Dict, Any, Tuple
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, classification_report
)


class CODFraudRiskModel:
    def __init__(self, random_state: int = 42):
        self.random_state = random_state
        self.pipeline_lr = None
        self.pipeline_rf = None
        self.best_model = None
        self.metrics: Dict[str, Any] = {}

    def prepare_data(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.Series]:
        """
        Audit schema, handle missing/null values, and extract features and target.
        """
        df_clean = df.copy()

        # 1. Missing & NULL Value Analysis
        missing_counts = df_clean.isnull().sum()
        if missing_counts.sum() > 0:
            # Impute or fill with business defaults
            df_clean['item_price'] = df_clean['item_price'].fillna(df_clean['item_price'].median())
            df_clean['account_age_days'] = df_clean['account_age_days'].fillna(30)
            df_clean['previous_orders'] = df_clean['previous_orders'].fillna(0)
            df_clean['previous_returns'] = df_clean['previous_returns'].fillna(0)

        # 2. Feature Engineering
        df_clean['return_ratio'] = np.where(
            df_clean['previous_orders'] > 0,
            df_clean['previous_returns'] / df_clean['previous_orders'],
            0.0
        )
        df_clean['is_new_customer'] = (df_clean['account_age_days'] < 14).astype(int)

        feature_cols = [
            'country', 'category', 'payment_method', 'device_type',
            'item_price', 'digital_root', 'account_age_days',
            'previous_orders', 'previous_returns', 'return_ratio',
            'is_new_customer', 'is_festive_period'
        ]

        target_col = 'is_fraud_or_return'
        X = df_clean[feature_cols]
        y = df_clean[target_col]

        return X, y

    def train_and_evaluate(self, X: pd.DataFrame, y: pd.Series) -> Dict[str, Any]:
        """
        Split dataset BEFORE fitting preprocessing pipelines.
        Trains both Logistic Regression baseline and Random Forest classifier.
        """
        # Strict train-test split (80% train, 20% test)
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.20, random_state=self.random_state, stratify=y
        )

        categorical_cols = ['country', 'category', 'payment_method', 'device_type']
        numerical_cols = [
            'item_price', 'digital_root', 'account_age_days',
            'previous_orders', 'previous_returns', 'return_ratio',
            'is_new_customer', 'is_festive_period'
        ]

        # ColumnTransformer fits strictly on training split
        preprocessor = ColumnTransformer(
            transformers=[
                ('num', StandardScaler(), numerical_cols),
                ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), categorical_cols)
            ]
        )

        # Model 1: Logistic Regression Baseline
        self.pipeline_lr = Pipeline([
            ('preprocessor', preprocessor),
            ('classifier', LogisticRegression(random_state=self.random_state, max_iter=500))
        ])

        # Model 2: Random Forest Classifier
        self.pipeline_rf = Pipeline([
            ('preprocessor', preprocessor),
            ('classifier', RandomForestClassifier(n_estimators=100, max_depth=8, random_state=self.random_state))
        ])

        # Fit models strictly on X_train
        self.pipeline_lr.fit(X_train, y_train)
        self.pipeline_rf.fit(X_train, y_train)

        # Evaluate Logistic Regression
        y_pred_lr = self.pipeline_lr.predict(X_test)
        y_prob_lr = self.pipeline_lr.predict_proba(X_test)[:, 1]
        metrics_lr = {
            'accuracy': float(accuracy_score(y_test, y_pred_lr)),
            'precision': float(precision_score(y_test, y_pred_lr, zero_division=0)),
            'recall': float(recall_score(y_test, y_pred_lr, zero_division=0)),
            'f1_score': float(f1_score(y_test, y_pred_lr, zero_division=0)),
            'roc_auc': float(roc_auc_score(y_test, y_prob_lr)),
            'confusion_matrix': confusion_matrix(y_test, y_pred_lr).tolist()
        }

        # Evaluate Random Forest
        y_pred_rf = self.pipeline_rf.predict(X_test)
        y_prob_rf = self.pipeline_rf.predict_proba(X_test)[:, 1]
        metrics_rf = {
            'accuracy': float(accuracy_score(y_test, y_pred_rf)),
            'precision': float(precision_score(y_test, y_pred_rf, zero_division=0)),
            'recall': float(recall_score(y_test, y_pred_rf, zero_division=0)),
            'f1_score': float(f1_score(y_test, y_pred_rf, zero_division=0)),
            'roc_auc': float(roc_auc_score(y_test, y_prob_rf)),
            'confusion_matrix': confusion_matrix(y_test, y_pred_rf).tolist()
        }

        # Select Best Model based on F1-Score & ROC-AUC
        if metrics_rf['f1_score'] >= metrics_lr['f1_score']:
            self.best_model = self.pipeline_rf
            best_name = 'RandomForestClassifier'
        else:
            self.best_model = self.pipeline_lr
            best_name = 'LogisticRegression'

        self.metrics = {
            'best_model_name': best_name,
            'models': {
                'LogisticRegression': metrics_lr,
                'RandomForestClassifier': metrics_rf
            },
            'test_set_size': len(y_test),
            'positive_rate': float(y.mean())
        }

        return self.metrics

    def predict_risk(self, order_dict: Dict[str, Any]) -> Dict[str, Any]:
        """
        Score a single real-time transaction for COD / Fraud risk.
        """
        if self.best_model is None:
            raise RuntimeError("Model has not been trained yet.")

        df_single = pd.DataFrame([order_dict])
        
        # Ensure engineered features exist
        if 'return_ratio' not in df_single.columns:
            prev_orders = df_single.get('previous_orders', [0])[0]
            prev_returns = df_single.get('previous_returns', [0])[0]
            df_single['return_ratio'] = prev_returns / prev_orders if prev_orders > 0 else 0.0

        if 'is_new_customer' not in df_single.columns:
            acc_age = df_single.get('account_age_days', [30])[0]
            df_single['is_new_customer'] = int(acc_age < 14)

        prob = float(self.best_model.predict_proba(df_single)[:, 1][0])
        decision = 'REJECT_COD_REQUIRE_PREPAYMENT' if prob > 0.50 else 'ALLOW_COD'
        otp_required = prob > 0.35

        return {
            'fraud_risk_score': round(prob * 100, 2),
            'high_risk_flag': prob > 0.50,
            'otp_verification_mandatory': otp_required,
            'policy_recommendation': decision
        }
