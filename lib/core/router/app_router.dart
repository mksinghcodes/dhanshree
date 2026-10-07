import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../features/catalog/domain/product.dart';
import '../../features/catalog/presentation/views/product_details_view.dart';
import '../../features/catalog/presentation/widgets/product_card.dart';
import '../../features/navigation/presentation/main_scaffold.dart';
import '../../features/cart/presentation/cart_controller.dart';
import '../theme/app_theme.dart';

// Sample mock products for immediate local preview
final List<Product> mockCatalogProducts = [
  const Product(
    id: 'prod-shilajit-1',
    title: 'Pure Himalayan Organic Shilajit Gold Resin (50g)',
    titleNepali: 'अर्गानिक हिमालयन सिलाजित',
    description:
        'High-altitude purified organic Shilajit resin directly harvested from the Himalayas of Nepal. Rich in fulvic acid and 84+ minerals.',
    slug: 'himalayan-shilajit-resin-50g',
    startingPriceNpr: 3499.0,
    compareAtPriceNpr: 4999.0,
    images: [
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=600&q=80',
    ],
    rating: 4.9,
    reviewCount: 1240,
    isCodAvailable: true,
    isValleyExpress: true,
    sellerName: 'Himalayan Herbals',
    variants: [
      ProductVariant(
        id: 'var-shila-25g',
        sku: 'SHILA-25G',
        name: '25g Jar',
        priceNpr: 1899.0,
        compareAtPriceNpr: 2500.0,
        stockQuantity: 40,
        images: [],
        attributes: {'weight': '25g'},
      ),
      ProductVariant(
        id: 'var-shila-50g',
        sku: 'SHILA-50G',
        name: '50g Jar (Popular)',
        priceNpr: 3499.0,
        compareAtPriceNpr: 4999.0,
        stockQuantity: 25,
        images: [],
        attributes: {'weight': '50g'},
      ),
      ProductVariant(
        id: 'var-shila-100g',
        sku: 'SHILA-100G',
        name: '100g Jar (Best Value)',
        priceNpr: 6200.0,
        compareAtPriceNpr: 8500.0,
        stockQuantity: 15,
        images: [],
        attributes: {'weight': '100g'},
      ),
    ],
  ),
  const Product(
    id: 'prod-dhaka-2',
    title: 'Authentic Palpali Handwoven Dhaka Shawl',
    titleNepali: 'पाल्पाली हाते बुना ढाका शल',
    description:
        'Traditional Nepali handwoven pattern shawl made with pure cotton threads by local artisans in Palpa, Nepal.',
    slug: 'palpali-handwoven-dhaka-shawl',
    startingPriceNpr: 1850.0,
    compareAtPriceNpr: 2500.0,
    images: [
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=600&q=80',
    ],
    rating: 4.8,
    reviewCount: 320,
    isCodAvailable: true,
    isValleyExpress: true,
    sellerName: 'Palpa Crafts Co.',
    variants: [
      ProductVariant(
        id: 'var-dhaka-std',
        sku: 'DHAKA-RED-STD',
        name: 'Traditional Crimson / Black',
        priceNpr: 1850.0,
        compareAtPriceNpr: 2500.0,
        stockQuantity: 18,
        images: [],
        attributes: {'color': 'Red'},
      ),
    ],
  ),
];

// Navigation Global Keys
final GlobalKey<NavigatorState> _rootNavigatorKey =
    GlobalKey<NavigatorState>(debugLabel: 'root');

/// GoRouter provider
final appRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: '/',
    routes: [
      // Stateful Nested Shell Route for Bottom Nav
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) {
          return MainScaffold(navigationShell: navigationShell);
        },
        branches: [
          // Branch 1: Home
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/',
                builder: (context, state) => const _HomeTabScreen(),
              ),
            ],
          ),

          // Branch 2: Categories
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/categories',
                builder: (context, state) => const _SimplePlaceholder(title: 'All Categories'),
              ),
            ],
          ),

          // Branch 3: Deals
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/deals',
                builder: (context, state) => const _SimplePlaceholder(title: '⚡ Dhamaka Flash Deals'),
              ),
            ],
          ),

          // Branch 4: Cart
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/cart',
                builder: (context, state) => const _CartTabScreen(),
              ),
            ],
          ),

          // Branch 5: Profile
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/profile',
                builder: (context, state) => const _SimplePlaceholder(title: 'My Dhanshree Account'),
              ),
            ],
          ),
        ],
      ),

      // Standalone Fullscreen Route: Product Details Page
      GoRoute(
        path: '/products/:id',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) {
          final id = state.pathParameters['id'];
          final product = mockCatalogProducts.firstWhere(
            (p) => p.id == id,
            orElse: () => mockCatalogProducts.first,
          );
          return ProductDetailsView(product: product);
        },
      ),
    ],
  );
});

// ==========================================
// TAB SCREENS
// ==========================================

class _HomeTabScreen extends StatelessWidget {
  const _HomeTabScreen();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dhanshree Nepal'),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_none),
            onPressed: () {},
          ),
        ],
      ),
      body: CustomScrollView(
        slivers: [
          // Top Search Bar
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(AppTheme.space16),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                decoration: BoxDecoration(
                  color: AppTheme.surfaceCard,
                  borderRadius: BorderRadius.circular(AppTheme.radiusMd),
                  border: Border.all(color: AppTheme.borderSubtle),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.search, color: AppTheme.textMuted),
                    SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Search Shilajit, Dhaka topi, Electronics...',
                        style: TextStyle(color: AppTheme.textMuted, fontSize: 13),
                      ),
                    ),
                    Icon(Icons.mic_none, color: AppTheme.textMuted, size: 20),
                  ],
                ),
              ),
            ),
          ),

          // Product Grid
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: AppTheme.space16),
            sliver: SliverGrid(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                mainAxisSpacing: 12,
                crossAxisSpacing: 12,
                childAspectRatio: 0.64,
              ),
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  final product = mockCatalogProducts[index % mockCatalogProducts.length];
                  return ProductCard(
                    product: product,
                    onTap: () => context.push('/products/${product.id}'),
                  );
                },
                childCount: 4,
              ),
            ),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 32)),
        ],
      ),
    );
  }
}

class _CartTabScreen extends ConsumerWidget {
  const _CartTabScreen();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final cartState = ref.watch(cartProvider);

    return Scaffold(
      appBar: AppBar(
        title: Text('My Cart (${cartState.totalItemCount})'),
        actions: [
          if (cartState.items.isNotEmpty)
            TextButton(
              onPressed: () => ref.read(cartProvider.notifier).clearCart(),
              child: const Text('Clear', style: TextStyle(color: AppTheme.errorRed)),
            ),
        ],
      ),
      body: cartState.items.isEmpty
          ? const Center(
              child: Text('Your Dhanshree shopping cart is empty.'),
            )
          : ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: cartState.items.length,
              separatorBuilder: (_, __) => const Divider(height: 24),
              itemBuilder: (context, index) {
                final item = cartState.items[index];
                return Row(
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: Image.network(item.imageUrl, width: 64, height: 64, fit: BoxFit.cover),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(item.title, maxLines: 1, style: const TextStyle(fontWeight: FontWeight.w600)),
                          Text(item.variantName, style: const TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                          Text('रु ${item.priceNpr.toStringAsFixed(0)}', style: const TextStyle(fontWeight: FontWeight.w700)),
                        ],
                      ),
                    ),
                    Row(
                      children: [
                        IconButton(
                          icon: const Icon(Icons.remove_circle_outline, size: 20),
                          onPressed: () => ref
                              .read(cartProvider.notifier)
                              .updateQuantity(item.variantId, item.quantity - 1),
                        ),
                        Text('${item.quantity}', style: const TextStyle(fontWeight: FontWeight.bold)),
                        IconButton(
                          icon: const Icon(Icons.add_circle_outline, size: 20),
                          onPressed: () => ref
                              .read(cartProvider.notifier)
                              .updateQuantity(item.variantId, item.quantity + 1),
                        ),
                      ],
                    ),
                  ],
                );
              },
            ),
    );
  }
}

class _SimplePlaceholder extends StatelessWidget {
  final String title;
  const _SimplePlaceholder({required this.title});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: Center(
        child: Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
      ),
    );
  }
}
