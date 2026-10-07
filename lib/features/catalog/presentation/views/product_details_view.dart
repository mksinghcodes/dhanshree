import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../cart/domain/cart_item.dart';
import '../../../cart/presentation/cart_controller.dart';
import '../../domain/product.dart';

class ProductDetailsView extends ConsumerStatefulWidget {
  final Product product;

  const ProductDetailsView({
    super.key,
    required this.product,
  });

  @override
  ConsumerState<ProductDetailsView> createState() => _ProductDetailsViewState();
}

class _ProductDetailsViewState extends ConsumerState<ProductDetailsView> {
  late PageController _pageController;
  int _currentImageIndex = 0;
  late ProductVariant _selectedVariant;
  int _quantity = 1;
  bool _isFavorite = false;

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
    _selectedVariant = widget.product.variants.first;
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _handleAddToCart() {
    HapticFeedback.lightImpact();
    final cartItem = CartItem(
      variantId: _selectedVariant.id,
      productId: widget.product.id,
      title: widget.product.title,
      variantName: _selectedVariant.name,
      priceNpr: _selectedVariant.priceNpr,
      compareAtPriceNpr: _selectedVariant.compareAtPriceNpr,
      imageUrl: widget.product.images.isNotEmpty
          ? widget.product.images.first
          : 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80',
      quantity: _quantity,
      sellerName: widget.product.sellerName,
      isCodAvailable: widget.product.isCodAvailable,
    );

    ref.read(cartProvider.notifier).addItem(cartItem);

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        behavior: SnackBarBehavior.floating,
        backgroundColor: AppTheme.primaryNavy,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppTheme.radiusMd),
        ),
        content: Row(
          children: [
            const Icon(Icons.check_circle, color: AppTheme.accentEmerald, size: 20),
            const SizedBox(width: 8),
            Text(
              'Added $_quantity item(s) to Cart!',
              style: const TextStyle(color: Colors.white, fontSize: 13),
            ),
          ],
        ),
        action: SnackBarAction(
          label: 'View Cart',
          textColor: AppTheme.secondaryGold,
          onPressed: () => context.go('/cart'),
        ),
      ),
    );
  }

  void _handleBuyNow() {
    _handleAddToCart();
    context.push('/checkout');
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final images = widget.product.images.isNotEmpty
        ? widget.product.images
        : [
            'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80'
          ];

    return Scaffold(
      backgroundColor: AppTheme.backgroundCanvas,
      appBar: AppBar(
        title: const Text('Product Details'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, size: 20),
          onPressed: () => context.pop(),
        ),
        actions: [
          IconButton(
            icon: Icon(
              _isFavorite ? Icons.favorite : Icons.favorite_border,
              color: _isFavorite ? const Color(0xFFE11D48) : AppTheme.primaryNavy,
            ),
            onPressed: () {
              HapticFeedback.selectionClick();
              setState(() => _isFavorite = !_isFavorite);
            },
          ),
          IconButton(
            icon: const Icon(Icons.share_outlined),
            onPressed: () {},
          ),
          // Cart badge action
          Consumer(
            builder: (context, ref, _) {
              final count = ref.watch(cartBadgeCountProvider);
              return Stack(
                alignment: Alignment.center,
                children: [
                  IconButton(
                    icon: const Icon(Icons.shopping_bag_outlined),
                    onPressed: () => context.push('/cart'),
                  ),
                  if (count > 0)
                    Positioned(
                      top: 6,
                      right: 6,
                      child: Container(
                        padding: const EdgeInsets.all(4),
                        decoration: const BoxDecoration(
                          color: AppTheme.secondaryGold,
                          shape: BoxShape.circle,
                        ),
                        constraints: const BoxConstraints(minWidth: 16, minHeight: 16),
                        child: Text(
                          '$count',
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            color: AppTheme.primaryNavy,
                            fontSize: 10,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                      ),
                    ),
                ],
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ==========================================
            // 1. HD IMAGE CAROUSEL WITH INDICATOR
            // ==========================================
            Stack(
              children: [
                SizedBox(
                  height: 380,
                  width: double.infinity,
                  child: PageView.builder(
                    controller: _pageController,
                    itemCount: images.length,
                    onPageChanged: (index) {
                      setState(() => _currentImageIndex = index);
                    },
                    itemBuilder: (context, index) {
                      return CachedNetworkImage(
                        imageUrl: images[index],
                        fit: BoxFit.cover,
                        placeholder: (context, url) => Container(
                          color: const Color(0xFFF1F5F9),
                          child: const Center(
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              color: AppTheme.accentEmerald,
                            ),
                          ),
                        ),
                        errorWidget: (context, url, error) => Container(
                          color: const Color(0xFFF1F5F9),
                          child: const Icon(Icons.broken_image, size: 48),
                        ),
                      );
                    },
                  ),
                ),

                // Counter Indicator Pill (Bottom Right)
                Positioned(
                  bottom: 14,
                  right: 16,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.black.withOpacity(0.65),
                      borderRadius: BorderRadius.circular(AppTheme.radiusPill),
                    ),
                    child: Text(
                      '${_currentImageIndex + 1} / ${images.length}',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),

                // Nepali Authenticity Tag (Bottom Left)
                Positioned(
                  bottom: 14,
                  left: 16,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppTheme.accentEmerald,
                      borderRadius: BorderRadius.circular(AppTheme.radiusSm),
                    ),
                    child: const Row(
                      children: [
                        Icon(Icons.shield_outlined, color: Colors.white, size: 14),
                        SizedBox(width: 4),
                        Text(
                          '100% Authentic Guarantee',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),

            // ==========================================
            // 2. PRICING & SOCIAL PROOF CARD
            // ==========================================
            Container(
              width: double.infinity,
              color: AppTheme.surfaceCard,
              padding: const EdgeInsets.all(AppTheme.space16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Price row
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.baseline,
                    textBaseline: TextBaseline.alphabetic,
                    children: [
                      Text(
                        'रु ${_selectedVariant.priceNpr.toStringAsFixed(0)}',
                        style: theme.textTheme.displayLarge?.copyWith(
                          color: AppTheme.primaryNavy,
                          fontSize: 24,
                        ),
                      ),
                      if (_selectedVariant.compareAtPriceNpr != null) ...[
                        const SizedBox(width: 8),
                        Text(
                          'रु ${_selectedVariant.compareAtPriceNpr!.toStringAsFixed(0)}',
                          style: const TextStyle(
                            fontSize: 14,
                            color: AppTheme.textMuted,
                            decoration: TextDecoration.lineThrough,
                          ),
                        ),
                      ],
                      if (widget.product.discountPercent > 0) ...[
                        const SizedBox(width: 10),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: AppTheme.accentEmeraldTint,
                            borderRadius: BorderRadius.circular(AppTheme.radiusSm),
                          ),
                          child: Text(
                            '${widget.product.discountPercent}% OFF',
                            style: const TextStyle(
                              color: Color(0xFF059669),
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                  const SizedBox(height: 8),

                  // Title
                  Text(
                    widget.product.title,
                    style: theme.textTheme.headlineLarge?.copyWith(
                      fontSize: 17,
                      height: 1.35,
                    ),
                  ),
                  if (widget.product.titleNepali != null) ...[
                    const SizedBox(height: 2),
                    Text(
                      widget.product.titleNepali!,
                      style: theme.textTheme.bodyMedium?.copyWith(
                        color: AppTheme.textMuted,
                        fontSize: 13,
                      ),
                    ),
                  ],
                  const SizedBox(height: 10),

                  // Rating and reviews
                  Row(
                    children: [
                      const Icon(Icons.star_rounded, color: AppTheme.secondaryGold, size: 18),
                      const SizedBox(width: 3),
                      Text(
                        '${widget.product.rating}',
                        style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13),
                      ),
                      const SizedBox(width: 6),
                      Text(
                        '(${widget.product.reviewCount} customer ratings)',
                        style: const TextStyle(color: AppTheme.textSecondary, fontSize: 12),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppTheme.space12),

            // ==========================================
            // 3. VARIANT SELECTION (WEIGHT / SIZE CHIPS)
            // ==========================================
            Container(
              width: double.infinity,
              color: AppTheme.surfaceCard,
              padding: const EdgeInsets.all(AppTheme.space16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Select Variant / Size',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: AppTheme.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: widget.product.variants.map((v) {
                      final isSelected = v.id == _selectedVariant.id;
                      return ChoiceChip(
                        label: Text(v.name),
                        selected: isSelected,
                        selectedColor: AppTheme.primaryNavy,
                        backgroundColor: const Color(0xFFF1F5F9),
                        labelStyle: TextStyle(
                          color: isSelected ? Colors.white : AppTheme.textPrimary,
                          fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                          fontSize: 12,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(AppTheme.radiusMd),
                          side: BorderSide(
                            color: isSelected ? AppTheme.primaryNavy : AppTheme.borderSubtle,
                          ),
                        ),
                        onSelected: (selected) {
                          if (selected) {
                            setState(() => _selectedVariant = v);
                          }
                        },
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 16),

                  // Quantity Stepper
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Quantity',
                        style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
                      ),
                      Container(
                        decoration: BoxDecoration(
                          border: Border.all(color: AppTheme.borderSubtle),
                          borderRadius: BorderRadius.circular(AppTheme.radiusSm),
                        ),
                        child: Row(
                          children: [
                            IconButton(
                              icon: const Icon(Icons.remove, size: 16),
                              onPressed: _quantity > 1
                                  ? () => setState(() => _quantity--)
                                  : null,
                            ),
                            Text(
                              '$_quantity',
                              style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
                            ),
                            IconButton(
                              icon: const Icon(Icons.add, size: 16),
                              onPressed: () => setState(() => _quantity++),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppTheme.space12),

            // ==========================================
            // 4. NEPAL DELIVERY & COD ESTIMATE
            // ==========================================
            Container(
              width: double.infinity,
              color: AppTheme.surfaceCard,
              padding: const EdgeInsets.all(AppTheme.space16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Delivery Information (Nepal)',
                        style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
                      ),
                      TextButton(
                        onPressed: () {},
                        child: const Text('Change Location', style: TextStyle(color: AppTheme.accentEmerald, fontSize: 12)),
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF8FAFC),
                      borderRadius: BorderRadius.circular(AppTheme.radiusMd),
                      border: Border.all(color: AppTheme.borderSubtle),
                    ),
                    child: const Column(
                      children: [
                        Row(
                          children: [
                            Icon(Icons.local_shipping_outlined, color: AppTheme.accentEmerald, size: 20),
                            SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                'Inside Ring Road (Kathmandu): Guaranteed Tomorrow',
                                style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500),
                              ),
                            ),
                            Text('रु ६०', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 12)),
                          ],
                        ),
                        Divider(height: 16),
                        Row(
                          children: [
                            Icon(Icons.schedule, color: AppTheme.textMuted, size: 18),
                            SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                'Outside Valley (Pokhara, Butwal): 2-3 Days',
                                style: TextStyle(fontSize: 12, color: AppTheme.textSecondary),
                              ),
                            ),
                            Text('रु १२०', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 12)),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 10),
                  // COD Banner
                  if (widget.product.isCodAvailable)
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: AppTheme.secondaryGoldLight,
                        borderRadius: BorderRadius.circular(AppTheme.radiusMd),
                        border: Border.all(color: AppTheme.secondaryGold.withOpacity(0.3)),
                      ),
                      child: const Row(
                        children: [
                          Icon(Icons.payments_outlined, color: Color(0xFFB45309), size: 18),
                          SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              'Cash on Delivery (COD) supported for this product',
                              style: TextStyle(
                                fontSize: 12,
                                color: Color(0xFF92400E),
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                ],
              ),
            ),
            const SizedBox(height: AppTheme.space12),

            // ==========================================
            // 5. MERCHANT PROFILE CARD
            // ==========================================
            Container(
              width: double.infinity,
              color: AppTheme.surfaceCard,
              padding: const EdgeInsets.all(AppTheme.space16),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 22,
                    backgroundColor: const Color(0xFFF1F5F9),
                    child: Text(
                      widget.product.sellerName.substring(0, 1),
                      style: const TextStyle(fontWeight: FontWeight.w700, color: AppTheme.primaryNavy),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text(
                              widget.product.sellerName,
                              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700),
                            ),
                            if (widget.product.isVerifiedSeller) ...[
                              const SizedBox(width: 4),
                              const Icon(Icons.verified, color: AppTheme.accentEmerald, size: 14),
                            ],
                          ],
                        ),
                        const Text(
                          'Verified Merchant • 98% Positive Feedback',
                          style: TextStyle(fontSize: 11, color: AppTheme.textMuted),
                        ),
                      ],
                    ),
                  ),
                  OutlinedButton(
                    onPressed: () {},
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      side: const BorderSide(color: AppTheme.borderSubtle),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppTheme.radiusSm)),
                    ),
                    child: const Text('Chat', style: TextStyle(fontSize: 12, color: AppTheme.primaryNavy)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 100), // Spacing for sticky bottom bar
          ],
        ),
      ),

      // ==========================================
      // 6. STICKY BOTTOM ACTION BAR
      // ==========================================
      bottomSheet: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: AppTheme.surfaceCard,
          border: const Border(top: BorderSide(color: AppTheme.borderSubtle)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, -3),
            ),
          ],
        ),
        child: SafeArea(
          child: Row(
            children: [
              // Chat / Store icon
              IconButton(
                icon: const Icon(Icons.storefront_outlined, color: AppTheme.primaryNavy),
                onPressed: () {},
              ),
              const SizedBox(width: 8),
              // Add to Cart
              Expanded(
                flex: 1,
                child: OutlinedButton(
                  onPressed: _handleAddToCart,
                  style: OutlinedButton.styleFrom(
                    backgroundColor: AppTheme.primaryNavy,
                    side: const BorderSide(color: AppTheme.primaryNavy),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(AppTheme.radiusMd),
                    ),
                  ),
                  child: const Text(
                    'Add to Cart',
                    style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 13),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              // Buy Now (Emerald CTA)
              Expanded(
                flex: 1,
                child: ElevatedButton(
                  onPressed: _handleBuyNow,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.accentEmerald,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(AppTheme.radiusMd),
                    ),
                    elevation: 3,
                    shadowColor: AppTheme.accentEmerald.withOpacity(0.5),
                  ),
                  child: const Text(
                    'Buy Now',
                    style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 13),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
