"""
Dhanshree Synthetic E-Commerce Dataset Generator
Generates realistic multi-country e-commerce transaction data
incorporating Nepal (NPR), India (INR), and UAE (AED) market patterns.
"""

import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import random
from pathlib import Path


def generate_dhanshree_transactions(n_samples: int = 5000, random_seed: int = 42) -> pd.DataFrame:
    """
    Generate synthetic e-commerce transactions adhering to Dhanshree domain logic.
    """
    np.random.seed(random_seed)
    random.seed(random_seed)

    start_date = datetime(2026, 7, 1)
    dates = [start_date + timedelta(days=int(np.random.exponential(scale=30)) % 90) for _ in range(n_samples)]

    countries = np.random.choice(['NP', 'IN', 'AE'], size=n_samples, p=[0.55, 0.35, 0.10])
    
    categories = [
        'Computers', 'Electronics', 'Kitchen', 'Beauty',
        'Apparel', 'Toys', 'Fitness', 'Festive', 'Books'
    ]
    
    cat_weights = [0.15, 0.18, 0.12, 0.10, 0.16, 0.06, 0.05, 0.12, 0.06]
    chosen_categories = np.random.choice(categories, size=n_samples, p=cat_weights)

    data = []
    for i in range(n_samples):
        order_id = f"DHAN-ORD-{100000 + i}"
        customer_id = f"CUST-{random.randint(1000, 2500)}"
        country = countries[i]
        category = chosen_categories[i]
        order_date = dates[i]

        # Base price in local currency
        if country == 'NP':
            currency = 'NPR'
            base_price = np.random.lognormal(mean=8.2, sigma=1.1)  # Median ~3600 NPR
            payment_methods = ['ESEWA', 'KHALTI', 'COD', 'CONNECT_IPS']
            pm_probs = [0.42, 0.28, 0.22, 0.08]
        elif country == 'IN':
            currency = 'INR'
            base_price = np.random.lognormal(mean=7.7, sigma=1.0)  # Median ~2200 INR
            payment_methods = ['RAZORPAY', 'UPI', 'COD', 'CARD']
            pm_probs = [0.35, 0.40, 0.18, 0.07]
        else:  # AE
            currency = 'AED'
            base_price = np.random.lognormal(mean=5.1, sigma=0.9)  # Median ~160 AED
            payment_methods = ['CARD', 'APPLE_PAY', 'COD']
            pm_probs = [0.55, 0.35, 0.10]

        price = round(max(150.0, float(base_price)), 2)
        
        # Calculate digital root of integer price
        digits_sum = sum(int(d) for d in str(int(price)) if d.isdigit())
        while digits_sum > 9:
            digits_sum = sum(int(d) for d in str(digits_sum))
        digital_root = digits_sum

        payment_method = np.random.choice(payment_methods, p=pm_probs)
        account_age_days = int(np.random.gamma(shape=2.0, scale=60))
        previous_orders = max(0, int(np.random.poisson(lam=3.5)))
        previous_returns = int(np.random.binomial(n=previous_orders, p=0.08)) if previous_orders > 0 else 0
        device_type = np.random.choice(['Mobile_App', 'Mobile_Web', 'Desktop'], p=[0.60, 0.25, 0.15])
        is_festive_period = 1 if (order_date.month in [9, 10]) else 0

        # Tax calculation
        if country == 'NP':
            vat_gst_amount = round(price * 0.13, 2)
        elif country == 'IN':
            vat_gst_amount = round(price * 0.18, 2)
        else:
            vat_gst_amount = round(price * 0.05, 2)

        # Realistic fraud / COD return risk generation
        # High risk factors: COD, new accounts, high price, high return history, late-night orders
        risk_score = 0.05
        if payment_method == 'COD':
            risk_score += 0.25
        if account_age_days < 7:
            risk_score += 0.20
        if previous_orders > 0 and (previous_returns / previous_orders) > 0.3:
            risk_score += 0.35
        if price > 3000:
            risk_score += 0.10
        if digital_root in [5, 6]:
            risk_score -= 0.05  # Auspicious harmonic conversion stabilization

        risk_prob = min(0.95, max(0.01, risk_score + np.random.normal(0, 0.05)))
        is_fraud_or_return = 1 if np.random.rand() < risk_prob else 0

        data.append({
            'order_id': order_id,
            'customer_id': customer_id,
            'order_date': order_date.strftime('%Y-%m-%d'),
            'country': country,
            'currency': currency,
            'category': category,
            'item_price': price,
            'vat_gst_amount': vat_gst_amount,
            'payment_method': payment_method,
            'digital_root': digital_root,
            'account_age_days': account_age_days,
            'previous_orders': previous_orders,
            'previous_returns': previous_returns,
            'device_type': device_type,
            'is_festive_period': is_festive_period,
            'is_fraud_or_return': is_fraud_or_return,
        })

    df = pd.DataFrame(data)
    return df


def save_dataset_if_not_exists(csv_path: str = 'packages/ai-engine/data/transactions.csv', n_samples: int = 5000) -> pd.DataFrame:
    target_path = Path(csv_path)
    if target_path.exists():
        return pd.read_csv(target_path)
    
    target_path.parent.mkdir(parents=True, exist_ok=True)
    df = generate_dhanshree_transactions(n_samples=n_samples)
    df.to_csv(target_path, index=False)
    print(f"[OK] Synthetic transactions dataset generated: {target_path} ({len(df)} rows)")
    return df


if __name__ == '__main__':
    save_dataset_if_not_exists()
