import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../cart/domain/cart_item.dart';
import '../../../cart/presentation/cart_controller.dart';
import '../../domain/product.dart';

class ProductCard extends ConsumerStatefulWidget {
  final Product product;
  final VoidCallback? onTap;

  const ProductCard({
    super.key,
    required this.product,
    this.onTap,
  });

  @override
  ConsumerState<ProductCard> createState() => _ProductCardState();
}

class _ProductCardState extends ConsumerState<ProductCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _animController;
  late Animation<double> _scaleAnimation;
  bool _isOptimisticAdded = false;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 180),
    );
    _scaleAnimation = Tween<double>(begin: 1.0, end: 0.88).animate(
      CurvedAnimation(parent: _animController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  Future<void> _handleOptimisticAddToCart() async {
    HapticFeedback.mediumImpact();
    await _animController.forward();
    await _animController.reverse();

    setState(() => _isOptimisticAdded = true);

    // Pick first variant by default
    final variant = widget.product.variants.first;
    final cartItem = CartItem(
      variantId: variant.id,
      productId: widget.product.id,
      title: widget.product.title,
      variantName: variant.name,
      priceNpr: variant.priceNpr,
      compareAtPriceNpr: variant.compareAtPriceNpr,
      imageUrl: widget.product.images.isNotEmpty
          ? widget.product.images.first
          : 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=400&q=80',
      quantity: 1,
      sellerName: widget.product.sellerName,
      isCodAvailable: widget.product.isCodAvailable,
    );

    // Optimistically update Riverpod and Hive
    ref.read(cartProvider.notifier).addItem(cartItem);

    if (mounted) {
      ScaffoldMessenger.of(context).hideCurrentSnackBar();
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
              Expanded(
                child: Text(
                  'Added to cart! (रु ${variant.priceNpr.toStringAsFixed(0)})',
                  style: const TextStyle(color: Colors.white, fontSize: 13),
                ),
              ),
            ],
          ),
          duration: const Duration(milliseconds: 1500),
        ),
      );
    }

    // Reset button icon after a brief pause
    await Future.delayed(const Duration(milliseconds: 1200));
    if (mounted) {
      setState(() => _isOptimisticAdded = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final hasDiscount = widget.product.discountPercent > 0;
    final primaryImage = widget.product.images.isNotEmpty
        ? widget.product.images.first
        : 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=400&q=80';

    return GestureDetector(
      onTap: widget.onTap,
      child: Container(
        decoration: BoxDecoration(
          color: AppTheme.surfaceCard,
          borderRadius: BorderRadius.circular(AppTheme.radiusMd),
          border: Border.all(color: AppTheme.borderSubtle, width: 1),
          boxShadow: AppTheme.cardShadow,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ==========================================
            // PRODUCT IMAGE & BADGES
            // ==========================================
            Stack(
              children: [
                ClipRRect(
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(AppTheme.radiusMd - 1),
                  ),
                  child: AspectRatio(
                    aspectRatio: 1.05,
                    child: CachedNetworkImage(
                      imageUrl: primaryImage,
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
                        child: const Icon(
                          Icons.image_not_supported_outlined,
                          color: AppTheme.textMuted,
                          size: 32,
                        ),
                      ),
                    ),
                  ),
                ),

                // Discount Badge (Top Left)
                if (hasDiscount)
                  Positioned(
                    top: 8,
                    left: 8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 6,
                        vertical: 3,
                      ),
                      decoration: BoxDecoration(
                        color: const Color(0xFFE11D48), // Rose 600
                        borderRadius: BorderRadius.circular(AppTheme.radiusSm),
                      ),
                      child: Text(
                        '-${widget.product.discountPercent}%',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 10,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ),

                // Fast Valley Delivery Pill (Bottom Left)
                if (widget.product.isValleyExpress)
                  Positioned(
                    bottom: 6,
                    left: 8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 6,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: AppTheme.primaryNavy.withOpacity(0.85),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.bolt, color: AppTheme.secondaryGold, size: 12),
                          SizedBox(width: 2),
                          Text(
                            'Valley 24h',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 9,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
              ],
            ),

            // ==========================================
            // PRODUCT INFORMATION
            // ==========================================
            Padding(
              padding: const EdgeInsets.all(AppTheme.space12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Merchant / Verified tag
                  Row(
                    children: [
                      Flexible(
                        child: Text(
                          widget.product.sellerName,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: theme.textTheme.bodySmall?.copyWith(
                            color: AppTheme.textMuted,
                            fontSize: 10,
                          ),
                        ),
                      ),
                      if (widget.product.isVerifiedSeller) ...[
                        const SizedBox(width: 4),
                        const Icon(
                          Icons.verified,
                          color: AppTheme.accentEmerald,
                          size: 12,
                        ),
                      ],
                    ],
                  ),
                  const SizedBox(height: 4),

                  // Title
                  Text(
                    widget.product.title,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: theme.textTheme.headlineSmall?.copyWith(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: AppTheme.textPrimary,
                      height: 1.25,
                    ),
                  ),
                  const SizedBox(height: 6),

                  // Rating row
                  Row(
                    children: [
                      const Icon(
                        Icons.star_rounded,
                        color: AppTheme.secondaryGold,
                        size: 16,
                      ),
                      const SizedBox(width: 2),
                      Text(
                        widget.product.rating.toStringAsFixed(1),
                        style: const TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: AppTheme.textPrimary,
                        ),
                      ),
                      const SizedBox(width: 4),
                      Text(
                        '(${widget.product.reviewCount})',
                        style: const TextStyle(
                          fontSize: 11,
                          color: AppTheme.textMuted,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),

                  // Price and Add to Cart Action Row
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      // Pricing Block (रु Symbol)
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'रु ${widget.product.startingPriceNpr.toStringAsFixed(0)}',
                            style: theme.textTheme.headlineMedium?.copyWith(
                              fontSize: 15,
                              fontWeight: FontWeight.w700,
                              color: AppTheme.primaryNavy,
                            ),
                          ),
                          if (widget.product.compareAtPriceNpr != null)
                            Text(
                              'रु ${widget.product.compareAtPriceNpr!.toStringAsFixed(0)}',
                              style: const TextStyle(
                                fontSize: 11,
                                color: AppTheme.textMuted,
                                decoration: TextDecoration.lineThrough,
                              ),
                            ),
                        ],
                      ),

                      // Optimistic Add Button with scale animation
                      ScaleTransition(
                        scale: _scaleAnimation,
                        child: InkWell(
                          onTap: _handleOptimisticAddToCart,
                          borderRadius: BorderRadius.circular(AppTheme.radiusSm),
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 200),
                            width: 34,
                            height: 34,
                            decoration: BoxDecoration(
                              color: _isOptimisticAdded
                                  ? AppTheme.accentEmerald
                                  : AppTheme.primaryNavy,
                              borderRadius:
                                  BorderRadius.circular(AppTheme.radiusSm),
                              boxShadow: _isOptimisticAdded
                                  ? AppTheme.emeraldGlowShadow
                                  : null,
                            ),
                            child: Icon(
                              _isOptimisticAdded ? Icons.check : Icons.add,
                              color: Colors.white,
                              size: 18,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
