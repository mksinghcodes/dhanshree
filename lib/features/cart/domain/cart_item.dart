/// Cart item entity representing a product variant added to the cart
class CartItem {
  final String variantId;
  final String productId;
  final String title;
  final String variantName;
  final double priceNpr;
  final double? compareAtPriceNpr;
  final String imageUrl;
  final int quantity;
  final String? sellerName;
  final bool isCodAvailable;

  const CartItem({
    required this.variantId,
    required this.productId,
    required this.title,
    required this.variantName,
    required this.priceNpr,
    this.compareAtPriceNpr,
    required this.imageUrl,
    this.quantity = 1,
    this.sellerName,
    this.isCodAvailable = true,
  });

  CartItem copyWith({
    String? variantId,
    String? productId,
    String? title,
    String? variantName,
    double? priceNpr,
    double? compareAtPriceNpr,
    String? imageUrl,
    int? quantity,
    String? sellerName,
    bool? isCodAvailable,
  }) {
    return CartItem(
      variantId: variantId ?? this.variantId,
      productId: productId ?? this.productId,
      title: title ?? this.title,
      variantName: variantName ?? this.variantName,
      priceNpr: priceNpr ?? this.priceNpr,
      compareAtPriceNpr: compareAtPriceNpr ?? this.compareAtPriceNpr,
      imageUrl: imageUrl ?? this.imageUrl,
      quantity: quantity ?? this.quantity,
      sellerName: sellerName ?? this.sellerName,
      isCodAvailable: isCodAvailable ?? this.isCodAvailable,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'variantId': variantId,
      'productId': productId,
      'title': title,
      'variantName': variantName,
      'priceNpr': priceNpr,
      'compareAtPriceNpr': compareAtPriceNpr,
      'imageUrl': imageUrl,
      'quantity': quantity,
      'sellerName': sellerName,
      'isCodAvailable': isCodAvailable,
    };
  }

  factory CartItem.fromJson(Map<String, dynamic> json) {
    return CartItem(
      variantId: json['variantId'] as String,
      productId: json['productId'] as String,
      title: json['title'] as String,
      variantName: json['variantName'] as String,
      priceNpr: (json['priceNpr'] as num).toDouble(),
      compareAtPriceNpr: json['compareAtPriceNpr'] != null
          ? (json['compareAtPriceNpr'] as num).toDouble()
          : null,
      imageUrl: json['imageUrl'] as String,
      quantity: json['quantity'] as int? ?? 1,
      sellerName: json['sellerName'] as String?,
      isCodAvailable: json['isCodAvailable'] as bool? ?? true,
    );
  }
}
