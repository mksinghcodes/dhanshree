class ProductVariant {
  final String id;
  final String sku;
  final String name; // e.g. "50g Resin" or "Navy Blue / M"
  final double priceNpr;
  final double? compareAtPriceNpr;
  final int stockQuantity;
  final List<String> images;
  final Map<String, dynamic> attributes;

  const ProductVariant({
    required this.id,
    required this.sku,
    required this.name,
    required this.priceNpr,
    this.compareAtPriceNpr,
    required this.stockQuantity,
    required this.images,
    required this.attributes,
  });

  bool get isInStock => stockQuantity > 0;
}

class Product {
  final String id;
  final String title;
  final String? titleNepali;
  final String description;
  final String slug;
  final double startingPriceNpr;
  final double? compareAtPriceNpr;
  final List<String> images;
  final double rating;
  final int reviewCount;
  final bool isCodAvailable;
  final bool isValleyExpress;
  final String sellerName;
  final bool isVerifiedSeller;
  final List<ProductVariant> variants;

  const Product({
    required this.id,
    required this.title,
    this.titleNepali,
    required this.description,
    required this.slug,
    required this.startingPriceNpr,
    this.compareAtPriceNpr,
    required this.images,
    this.rating = 4.8,
    this.reviewCount = 0,
    this.isCodAvailable = true,
    this.isValleyExpress = true,
    required this.sellerName,
    this.isVerifiedSeller = true,
    required this.variants,
  });

  int get discountPercent {
    if (compareAtPriceNpr == null || compareAtPriceNpr! <= startingPriceNpr) {
      return 0;
    }
    return (((compareAtPriceNpr! - startingPriceNpr) / compareAtPriceNpr!) * 100)
        .round();
  }
}
