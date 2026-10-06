"""
Dhanshree Automated Inventory Monitoring & Alerting Engine
Calculates Days of Inventory Remaining (DOI), safety buffers,
and triggers automated multi-channel reorder alerts.
"""

from typing import Dict, Any, List
from datetime import datetime


class InventoryAutomationEngine:
    def __init__(self, critical_doi_threshold_days: int = 5, reorder_lead_time_days: int = 4):
        self.critical_doi_threshold = critical_doi_threshold_days
        self.lead_time = reorder_lead_time_days

    def analyze_inventory(self, inventory_items: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Evaluate stock levels against daily sales velocity.
        """
        critical_alerts = []
        healthy_items = []

        for item in inventory_items:
            sku = item['sku']
            title = item['title']
            current_stock = item['current_stock']
            avg_daily_sales = max(0.1, item['avg_daily_sales'])
            supplier = item.get('supplier', 'Dhanshree Central Warehouse')
            country = item.get('country', 'NP')

            doi = current_stock / avg_daily_sales

            # Recommended reorder quantity: target 21 days coverage + lead time buffer
            target_stock = int(avg_daily_sales * (21 + self.lead_time))
            reorder_units = max(0, target_stock - current_stock)

            status = 'CRITICAL' if doi <= self.critical_doi_threshold else 'LOW' if doi <= 10 else 'HEALTHY'

            alert_entry = {
                'sku': sku,
                'title': title,
                'country': country,
                'current_stock': current_stock,
                'avg_daily_sales': round(avg_daily_sales, 1),
                'days_of_inventory_remaining': round(doi, 1),
                'status': status,
                'recommended_reorder_units': reorder_units,
                'supplier': supplier,
                'urgency': 'HIGH' if status == 'CRITICAL' else 'MEDIUM' if status == 'LOW' else 'LOW'
            }

            if status in ['CRITICAL', 'LOW']:
                # Generate automated WhatsApp / SMS dispatch notification payload
                alert_entry['dispatch_notification_payload'] = self._generate_notification_text(alert_entry)
                critical_alerts.append(alert_entry)
            else:
                healthy_items.append(alert_entry)

        return {
            'timestamp': datetime.now().isoformat(),
            'total_skus_monitored': len(inventory_items),
            'critical_stockout_risk_count': len([a for a in critical_alerts if a['status'] == 'CRITICAL']),
            'low_stock_warning_count': len([a for a in critical_alerts if a['status'] == 'LOW']),
            'healthy_count': len(healthy_items),
            'actionable_alerts': critical_alerts
        }

    def _generate_notification_text(self, item: Dict[str, Any]) -> str:
        return (
            f"⚠️ [DHANSHREE INVENTORY ALERT - {item['status']}]\n"
            f"Product: {item['title']} ({item['sku']})\n"
            f"Stock: {item['current_stock']} units left (~{item['days_of_inventory_remaining']} days remaining).\n"
            f"Action: Immediately reorder {item['recommended_reorder_units']} units from {item['supplier']}."
        )
