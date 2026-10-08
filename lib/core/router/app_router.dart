import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../features/catalog/domain/product.dart';
import '../../features/catalog/presentation/views/product_details_view.dart';
import '../../features/catalog/presentation/widgets/product_card.dart';
import '../../features/navigation/presentation/main_scaffold.dart';
import '../../features/cart/presentation/cart_controller.dart';
import '../theme/app_theme.dart';

// Live catalog products synchronized with https://dhanshree-marketplace.vercel.app/
final List<Product> mockCatalogProducts = [
  const Product(
    id: 'prod-macbook-m3-max',
    title: 'Apple MacBook Pro M3 Max (16-inch, 36GB RAM, 1TB SSD)',
    titleNepali: 'एप्पल म्याकबुक प्रो एम३ म्याक्स (१६-इन्च)',
    description:
        'Apple M3 Max chip with 14-core CPU and 30-core GPU, 36GB Unified Memory, 1TB SSD storage. 16.2-inch Liquid Retina XDR display. Calibrated with Mercury Fast Trade #5. Zero duty WTO ITA-0 compliant.',
    slug: 'apple-macbook-pro-m3-max',
    startingPriceNpr: 334400.0,
    compareAtPriceNpr: 380003.0,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop',
    ],
    rating: 4.9,
    reviewCount: 342,
    isCodAvailable: true,
    isValleyExpress: true,
    sellerName: 'Apple Authorized Store Nepal',
    variants: [
      ProductVariant(
        id: 'var-macbook-m3-16-1tb',
        sku: 'MBP-M3-16-36-1TB',
        name: '16-inch / 36GB RAM / 1TB SSD (Space Black)',
        priceNpr: 334400.0,
        compareAtPriceNpr: 380003.0,
        stockQuantity: 8,
        images: [
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop',
        ],
        attributes: {'color': 'Space Black', 'ram': '36GB', 'storage': '1TB'},
      ),
    ],
  ),
  const Product(
    id: 'prod-banarasi-silk-saree',
    title: 'Pure Banarasi Handloom Festive Silk Saree with Zari Weave',
    titleNepali: 'शुद्ध बनारसी हातेबुना दशैँ-तिहार रेशमी सारी',
    description:
        'Artisanal handloom pure Katan Banarasi silk saree with royal Zari motifs. Specially woven for Dashain, Tihar, and Chhath 2083 festivals. Calibrated with Venus Luxury Root #6.',
    slug: 'pure-banarasi-festive-silk-saree',
    startingPriceNpr: 14397.0,
    compareAtPriceNpr: 17997.0,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop',
    ],
    rating: 4.8,
    reviewCount: 189,
    isCodAvailable: true,
    isValleyExpress: true,
    sellerName: 'Banarasi Heritage Nepal',
    variants: [
      ProductVariant(
        id: 'var-saree-crimson',
        sku: 'SAR-BAN-CRIMSON',
        name: 'Crimson Red & Antique Gold Zari',
        priceNpr: 14397.0,
        compareAtPriceNpr: 17997.0,
        stockQuantity: 15,
        images: [
          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop',
        ],
        attributes: {'color': 'Crimson Red', 'material': 'Pure Silk'},
      ),
    ],
  ),
  const Product(
    id: 'prod-brass-lakshmi-ganesh',
    title: 'Pure Brass Asthadhatu Lakshmi-Ganesh Idol Set with Brass Diya',
    titleNepali: 'अष्टधातु महालक्ष्मी तथा गणेश मूर्ति सेट',
    description:
        'Auspicious Asthadhatu consecrated brass Lakshmi-Ganesh murti set with traditional Akhand Diya. Energized with Digital Vastu Maha Lakshmi Harmony #5 for financial prosperity and Diwali pujan.',
    slug: 'pure-brass-lakshmi-ganesh-idol',
    startingPriceNpr: 5522.0,
    compareAtPriceNpr: 6503.0,
    images: [
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop',
    ],
    rating: 4.9,
    reviewCount: 512,
    isCodAvailable: true,
    isValleyExpress: true,
    sellerName: 'Mandir Living Crafts',
    variants: [
      ProductVariant(
        id: 'var-idol-set-7in',
        sku: 'IDOL-LG-7IN',
        name: '7-inch Asthadhatu Brass Set + Diya',
        priceNpr: 5522.0,
        compareAtPriceNpr: 6503.0,
        stockQuantity: 24,
        images: [
          'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop',
        ],
        attributes: {'material': 'Asthadhatu Brass', 'height': '7 inches'},
      ),
    ],
  ),
  const Product(
    id: 'prod-spatial-studio-headphones',
    title: 'Spatial Studio Wireless Noise Cancelling Over-Ear Headphones',
    titleNepali: 'स्पेसियल स्टुडियो वायरलेस हेडफोन (एएनसी)',
    description:
        'Premium active noise cancellation studio headset with 60-hour battery life, 3D Spatial Audio, and plush protein leather earcups. Calibrated with Venus Delight Root #6.',
    slug: 'spatial-studio-wireless-headphones',
    startingPriceNpr: 11247.0,
    compareAtPriceNpr: 14999.0,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop',
    ],
    rating: 4.7,
    reviewCount: 220,
    isCodAvailable: true,
    isValleyExpress: true,
    sellerName: 'Spatial Audio Lab',
    variants: [
      ProductVariant(
        id: 'var-headphone-matte-black',
        sku: 'SPATIAL-ANC-BLK',
        name: 'Matte Black',
        priceNpr: 11247.0,
        compareAtPriceNpr: 14999.0,
        stockQuantity: 30,
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop',
        ],
        attributes: {'color': 'Matte Black', 'battery': '60 Hours'},
      ),
    ],
  ),
  const Product(
    id: 'prod-sony-wh1000xm5',
    title: 'Sony WH-1000XM5 ANC Wireless Headphones',
    titleNepali: 'सोनी डब्लुएच-१०००एक्सएम५ हेडफोन',
    description:
        'Industry-leading noise cancellation powered by two processors and eight microphones. Ultra-comfortable lightweight design with soft fit leather.',
    slug: 'sony-wh-1000xm5-anc-headphones',
    startingPriceNpr: 44999.0,
    compareAtPriceNpr: 54999.0,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
    ],
    rating: 4.9,
    reviewCount: 450,
    isCodAvailable: true,
    isValleyExpress: true,
    sellerName: 'Sony Official Store Nepal',
    variants: [
      ProductVariant(
        id: 'var-sony-xm5-silver',
        sku: 'SONY-XM5-SLV',
        name: 'Platinum Silver',
        priceNpr: 44999.0,
        compareAtPriceNpr: 54999.0,
        stockQuantity: 12,
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
        ],
        attributes: {'color': 'Silver'},
      ),
    ],
  ),
  const Product(
    id: 'prod-bhaitika-bhai-masala',
    title: 'Royal Bhaitika Bhai Masala & Dry Fruits Hamper',
    titleNepali: 'रोयल भाइटिका भाइ मसला तथा ड्राई फ्रुट्स',
    description:
        'Traditional Nepali Tihar Bhaitika gift basket packed with high-grade California almonds, Afghan cashews, Kashmiri walnuts, green pistachios, cardamom, and clove cones.',
    slug: 'royal-bhaitika-bhai-masala-hamper',
    startingPriceNpr: 2450.0,
    compareAtPriceNpr: 3500.0,
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300',
    ],
    rating: 4.9,
    reviewCount: 680,
    isCodAvailable: true,
    isValleyExpress: true,
    sellerName: 'KTM Dry Fruits Hub',
    variants: [
      ProductVariant(
        id: 'var-masala-hamper-1kg',
        sku: 'MASALA-1KG-BOX',
        name: '1kg Royal Wood Carved Gift Box',
        priceNpr: 2450.0,
        compareAtPriceNpr: 3500.0,
        stockQuantity: 150,
        images: [
          'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300',
        ],
        attributes: {'weight': '1kg', 'occasion': 'Bhaitika 2083'},
      ),
    ],
  ),
  const Product(
    id: 'prod-palpali-dhaka-topi',
    title: 'Palpali Handloom Dhaka Topi & Silk Khada',
    titleNepali: 'पाल्पाली हातेबुना ढाका टोपी र रेशमी खादा',
    description:
        'Authentic 100% handwoven Palpali Dhaka Topi crafted by heritage weavers in Palpa, paired with an auspicious golden yellow ceremonial silk Khada for Dashain Tika.',
    slug: 'palpali-handloom-dhaka-topi',
    startingPriceNpr: 1200.0,
    compareAtPriceNpr: 1800.0,
    images: [
      'https://images.unsplash.com/photo-1607344645866-009c320b5ab8?w=300',
    ],
    rating: 4.8,
    reviewCount: 310,
    isCodAvailable: true,
    isValleyExpress: true,
    sellerName: 'Palpa Crafts Co.',
    variants: [
      ProductVariant(
        id: 'var-dhaka-standard',
        sku: 'DHAKA-TOPI-STD',
        name: 'Traditional Palpali Pattern (Universal Fit)',
        priceNpr: 1200.0,
        compareAtPriceNpr: 1800.0,
        stockQuantity: 80,
        images: [
          'https://images.unsplash.com/photo-1607344645866-009c320b5ab8?w=300',
        ],
        attributes: {'size': 'Free Size', 'origin': 'Tansen, Palpa'},
      ),
    ],
  ),
  const Product(
    id: 'prod-smart-4k-tv-55',
    title: 'Smart 4K Ultra HD 55" Android Cinema TV',
    titleNepali: 'स्मार्ट ४के अल्ट्रा एचडी ५५ इन्च टिभी',
    description:
        '55-inch Bezel-less Quantum 4K Ultra HD display with Dolby Vision HDR, Dolby Atmos audio, built-in Google TV, and hands-free voice control.',
    slug: 'smart-4k-ultra-hd-55-cinema-tv',
    startingPriceNpr: 52999.0,
    compareAtPriceNpr: 68000.0,
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300',
    ],
    rating: 4.7,
    reviewCount: 195,
    isCodAvailable: true,
    isValleyExpress: true,
    sellerName: 'Vision Electronics',
    variants: [
      ProductVariant(
        id: 'var-tv-55-inch',
        sku: 'TV-4K-55-CINEMA',
        name: '55-inch Ultra HD 4K',
        priceNpr: 52999.0,
        compareAtPriceNpr: 68000.0,
        stockQuantity: 20,
        images: [
          'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300',
        ],
        attributes: {'screen_size': '55 inches', 'resolution': '4K UHD'},
      ),
    ],
  ),
  const Product(
    id: 'prod-mithila-chhath-soop',
    title: 'Mithila Chhath Puja Bamboo Soop & Ghee Thekua Mix',
    titleNepali: 'मिथिला छठ पूजा बाँसको सूप र घिउ ठेकुवा',
    description:
        'Sacred handwoven bamboo Soop from Janakpurdham, traditional Chhath Puja ritual pottery, and organic whole wheat flour + pure cow ghee Thekua mix for holy Arghya.',
    slug: 'mithila-chhath-puja-bamboo-soop',
    startingPriceNpr: 1650.0,
    compareAtPriceNpr: 2400.0,
    images: [
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300',
    ],
    rating: 5.0,
    reviewCount: 142,
    isCodAvailable: true,
    isValleyExpress: true,
    sellerName: 'Janakpur Handicrafts',
    variants: [
      ProductVariant(
        id: 'var-chhath-puja-set',
        sku: 'CHHATH-SOOP-SET',
        name: 'Complete Holy Chhath Puja Set',
        priceNpr: 1650.0,
        compareAtPriceNpr: 2400.0,
        stockQuantity: 65,
        images: [
          'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300',
        ],
        attributes: {'festival': 'Chhath Mahaparva 2083', 'origin': 'Janakpurdham'},
      ),
    ],
  ),
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
    ],
    rating: 4.9,
    reviewCount: 1240,
    isCodAvailable: true,
    isValleyExpress: true,
    sellerName: 'Himalayan Herbals',
    variants: [
      ProductVariant(
        id: 'var-shila-50g',
        sku: 'SHILA-50G',
        name: '50g Jar (Popular)',
        priceNpr: 3499.0,
        compareAtPriceNpr: 4999.0,
        stockQuantity: 25,
        images: [
          'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80',
        ],
        attributes: {'weight': '50g'},
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
              padding: const EdgeInsets.fromLTRB(
                AppTheme.space16,
                AppTheme.space16,
                AppTheme.space16,
                AppTheme.space8,
              ),
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
                        'Search MacBook, Banarasi Saree, Electronics, Puja...',
                        style: TextStyle(color: AppTheme.textMuted, fontSize: 13),
                      ),
                    ),
                    Icon(Icons.mic_none, color: AppTheme.textMuted, size: 20),
                  ],
                ),
              ),
            ),
          ),

          // Festive & Digital Vastu Banner (Synchronized with live website)
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: AppTheme.space16,
                vertical: AppTheme.space8,
              ),
              child: Container(
                padding: const EdgeInsets.all(AppTheme.space16),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [
                      Color(0xFF0D1B2A),
                      Color(0xFF162A45),
                      Color(0xFF059669),
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(AppTheme.radiusLg),
                  boxShadow: const [
                    BoxShadow(
                      color: Colors.black26,
                      blurRadius: 8,
                      offset: Offset(0, 3),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 3,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.amber.shade400,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: const Text(
                            '⚡ महाबचत २०८३',
                            style: TextStyle(
                              color: Color(0xFF0F172A),
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        const Text(
                          'दशैँ • तिहार • छठ महोत्सव',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      'Digital Vastu Harmonized Commerce',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Mercury #5 (Fast Trade) & Venus #6 (Customer Delight)\n🏷️ Vouchers: DHAN5 • SHREE6 | 🚚 Free Delivery > रु 5,000',
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.9),
                        fontSize: 11,
                        height: 1.3,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Section Title
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(
                AppTheme.space16,
                AppTheme.space12,
                AppTheme.space16,
                AppTheme.space8,
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Live Marketplace Catalog',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.textPrimary,
                    ),
                  ),
                  Text(
                    '${mockCatalogProducts.length} Items Available',
                    style: const TextStyle(
                      fontSize: 11,
                      color: AppTheme.accentEmerald,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
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
                  final product = mockCatalogProducts[index];
                  return ProductCard(
                    product: product,
                    onTap: () => context.push('/products/${product.id}'),
                  );
                },
                childCount: mockCatalogProducts.length,
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
