# Dhanshree Mobile App: Frontend Clean Architecture Scaffolding

> **Framework:** Flutter 3.19+ & Dart 3.3+ (Cross-Platform iOS & Android)  
> **State Management:** Flutter Riverpod 2.5 (Compile-safe Notifiers & Providers)  
> **Offline Database:** Hive 2.2 (`hive_flutter` for sub-millisecond cart persistence)  
> **Navigation:** GoRouter 14.0 with `StatefulShellRoute` (persistent bottom navigation)  
> **Brand Palette:** Royal Navy (`#0F172A`), Emerald CTA (`#10B981`), Prosperity Gold (`#F59E0B`), Canvas (`#F8FAFC`)

---

## 1. Feature-First Project Folder Structure

```
dhanshree_mobile/
├── pubspec.yaml                          # Dependencies (Riverpod, GoRouter, Hive, GoogleFonts)
└── lib/
    ├── main.dart                         # Entrypoint: Hive initialization + ProviderScope
    ├── core/
    │   ├── theme/
    │   │   └── app_theme.dart            # Brand tokens, Typography (Poppins/Inter), 8pt Grid
    │   ├── router/
    │   │   └── app_router.dart           # GoRouter setup with StatefulShellRoute for 5 tabs
    │   └── network/
    │       └── api_client.dart           # Dio HTTP client with JWT interceptor & refresh hook
    └── features/
        ├── navigation/
        │   └── presentation/
        │       └── main_scaffold.dart    # 5-Tab BottomNavigationBar + Live Cart Badge
        ├── catalog/
        │   ├── domain/
        │   │   └── product.dart          # Product & ProductVariant entities
        │   └── presentation/
        │       ├── widgets/
        │       │   └── product_card.dart # Image caching + Optimistic Add-to-Cart
        │       └── views/
        │           └── product_details_view.dart # PDP with image slider & variant chips
        └── cart/
            ├── domain/
            │   └── cart_item.dart        # CartItem with JSON/Hive serialization
            └── presentation/
                └── cart_controller.dart  # CartNotifier with Hive offline persistence
```

---

## 2. Key Architecture Implementations

### 2.1 Design Tokens & Theming ([`app_theme.dart`](file:///C:/Users/Admin/.gemini/antigravity/brain/a10408c1-0c7e-4f69-8ee6-ffc1f84eb625/lib/core/theme/app_theme.dart))
- **Colors:**
  - `primaryNavy`: `Color(0xFF0F172A)`
  - `accentEmerald`: `Color(0xFF10B981)`
  - `secondaryGold`: `Color(0xFFF59E0B)`
  - `backgroundCanvas`: `Color(0xFFF8FAFC)`
- **Typography:**
  - Headings, Prices, and Brand Tags: `GoogleFonts.poppins()`
  - Body Text, Captions, and Form Controls: `GoogleFonts.inter()`
- **8pt Grid:** `space4`, `space8`, `space12`, `space16`, `space20`, `space24`, `space32`.

### 2.2 Offline Persistence ([`cart_controller.dart`](file:///C:/Users/Admin/.gemini/antigravity/brain/a10408c1-0c7e-4f69-8ee6-ffc1f84eb625/lib/features/cart/presentation/cart_controller.dart))
- Uses a local Hive binary box (`dhanshree_cart_box`) storing serialized cart records.
- On cold app launch, `CartNotifier._initHiveAndLoadCart()` reads from disk before any network calls, eliminating loading spinners on the cart screen.
- When an item is added via `addItem()`, the memory state updates immediately (**Optimistic UI**), followed by an asynchronous write to Hive.

### 2.3 Reusable Product Card ([`product_card.dart`](file:///C:/Users/Admin/.gemini/antigravity/brain/a10408c1-0c7e-4f69-8ee6-ffc1f84eb625/lib/features/catalog/presentation/widgets/product_card.dart))
- Integrates `CachedNetworkImage` with memory disk caching and placeholder shimmers.
- Provides tactile feedback via `HapticFeedback.mediumImpact()`.
- Optimistic scale animation (`ScaleTransition`) on the plus button toggles from Navy to Emerald with an instant SnackBar prompt.

### 2.4 Product Details Screen ([`product_details_view.dart`](file:///C:/Users/Admin/.gemini/antigravity/brain/a10408c1-0c7e-4f69-8ee6-ffc1f84eb625/lib/features/catalog/presentation/views/product_details_view.dart))
- Horizontal image carousel with real-time `1/5` count pill.
- Weight/size variant choice chips with active state styling.
- Localized delivery matrix:
  - Inside Valley (Kathmandu Ring Road): Guaranteed Tomorrow (`रु ६०`).
  - Outside Valley (Pokhara, Butwal, etc.): 2–3 Days (`रु १२०`).
  - Cash on Delivery (COD) availability pill.
- Fixed `bottomSheet` with "Add to Cart" and "Buy Now".

### 2.5 5-Tab Navigation ([`main_scaffold.dart`](file:///C:/Users/Admin/.gemini/antigravity/brain/a10408c1-0c7e-4f69-8ee6-ffc1f84eb625/lib/features/navigation/presentation/main_scaffold.dart))
- BottomNavigationBar with 5 tabs: **Home, Categories, Deals, Cart, Account**.
- Real-time `cartBadgeCountProvider` listens to the Riverpod cart state and renders a Gold counter badge over the Cart tab.
- Integrated with GoRouter's `StatefulShellRoute.indexedStack` to preserve scroll positions across tab changes.
