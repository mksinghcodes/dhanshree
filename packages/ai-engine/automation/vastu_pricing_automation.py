"""
Automated Vastu & Numerological Pricing Engine (Batch Harmonization)
Automatically aligns product pricing to Commercial Numerology vibrational roots:
- Root 5 (Mercury / Budh) -> Rapid turnover, fast e-commerce trade
- Root 6 (Venus / Shukra) -> Customer attraction, luxury, high retention
Eliminates disharmonious roots (Root 4, Root 8) with minimal variance (+/- 1 to 4 units).
"""

from typing import Dict, Any, List


def calculate_digital_root(num: int) -> int:
    """Computes single-digit digital root (Vedic numerology sum)."""
    n = abs(int(num))
    if n == 0:
        return 0
    while n > 9:
        n = sum(int(digit) for digit in str(n))
    return n


def harmonize_to_vastu_root(price: int, preferred_vibration: int = 5) -> Dict[str, Any]:
    """
    Finds the nearest rounded integer price whose digital root is 5 or 6.
    """
    target_root = 6 if preferred_vibration == 6 else 5
    current_root = calculate_digital_root(price)

    if current_root in [5, 6]:
        return {
            'original_price': price,
            'harmonized_price': price,
            'delta': 0,
            'digital_root': current_root,
            'vibration_planet': 'Mercury (Fast Trade)' if current_root == 5 else 'Venus (Attraction & Prosperity)',
            'voucher_code': 'DHAN5' if current_root == 5 else 'SHREE6',
            'status': 'ALREADY_HARMONIC'
        }

    # Search within minimal radius (-4 to +4)
    best_candidate = price
    min_distance = 999

    for offset in [1, -1, 2, -2, 3, -3, 4, -4]:
        candidate = price + offset
        if candidate > 0 and calculate_digital_root(candidate) == target_root:
            best_candidate = candidate
            min_distance = abs(offset)
            break

    # Fallback to alternate harmonic root (6 or 5)
    if min_distance == 999:
        alt_root = 6 if target_root == 5 else 5
        for offset in [1, -1, 2, -2, 3, -3, 4, -4]:
            candidate = price + offset
            if candidate > 0 and calculate_digital_root(candidate) == alt_root:
                best_candidate = candidate
                target_root = alt_root
                break

    final_root = calculate_digital_root(best_candidate)
    return {
        'original_price': price,
        'harmonized_price': best_candidate,
        'delta': best_candidate - price,
        'digital_root': final_root,
        'vibration_planet': 'Mercury (Fast Trade)' if final_root == 5 else 'Venus (Attraction & Prosperity)',
        'voucher_code': 'DHAN5' if final_root == 5 else 'SHREE6',
        'status': 'HARMONIZED'
    }


def batch_harmonize_catalog(items: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Batch processing job for product catalogs.
    """
    harmonized_list = []
    total_adjusted = 0

    for item in items:
        raw_price = int(round(item['price']))
        pref = item.get('preferred_root', 5)
        res = harmonize_to_vastu_root(raw_price, preferred_vibration=pref)

        if res['status'] == 'HARMONIZED':
            total_adjusted += 1

        harmonized_list.append({
            'id': item.get('id', 'N/A'),
            'title': item.get('title', 'Unknown Product'),
            'category': item.get('category', 'General'),
            **res
        })

    return {
        'total_products_checked': len(items),
        'total_harmonized_adjustments': total_adjusted,
        'already_aligned_count': len(items) - total_adjusted,
        'products': harmonized_list
    }
