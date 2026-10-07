import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';
import '../domain/cart_item.dart';

const String kCartHiveBoxName = 'dhanshree_cart_box';
const String kCartHiveStorageKey = 'persisted_cart_items';
const double kFreeDeliveryThresholdNpr = 3000.0;

/// Immutable Cart state
class CartState {
  final List<CartItem> items;
  final bool isLoading;
  final String? errorMessage;

  const CartState({
    this.items = const [],
    this.isLoading = false,
    this.errorMessage,
  });

  CartState copyWith({
    List<CartItem>? items,
    bool? isLoading,
    String? errorMessage,
  }) {
    return CartState(
      items: items ?? this.items,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: errorMessage,
    );
  }

  int get totalItemCount => items.fold(0, (sum, item) => sum + item.quantity);

  double get subtotalNpr =>
      items.fold(0.0, (sum, item) => sum + (item.priceNpr * item.quantity));

  bool get isFreeDeliveryEligible => subtotalNpr >= kFreeDeliveryThresholdNpr;

  double get freeDeliveryProgress =>
      (subtotalNpr / kFreeDeliveryThresholdNpr).clamp(0.0, 1.0);

  double get amountRemainingForFreeDelivery =>
      (kFreeDeliveryThresholdNpr - subtotalNpr).clamp(0.0, kFreeDeliveryThresholdNpr);
}

/// Riverpod Cart Notifier with Hive offline persistence
class CartNotifier extends Notifier<CartState> {
  late final Box _cartBox;

  @override
  CartState build() {
    _initHiveAndLoadCart();
    return const CartState(isLoading: true);
  }

  /// Initialize local Hive storage and restore persisted items
  Future<void> _initHiveAndLoadCart() async {
    try {
      if (!Hive.isBoxOpen(kCartHiveBoxName)) {
        _cartBox = await Hive.openBox(kCartHiveBoxName);
      } else {
        _cartBox = Hive.box(kCartHiveBoxName);
      }

      final rawData = _cartBox.get(kCartHiveStorageKey);
      if (rawData != null && rawData is String) {
        final List<dynamic> decoded = jsonDecode(rawData);
        final restoredItems = decoded
            .map((item) => CartItem.fromJson(item as Map<String, dynamic>))
            .toList();

        state = CartState(items: restoredItems, isLoading: false);
      } else {
        state = const CartState(items: [], isLoading: false);
      }
    } catch (e) {
      state = CartState(
        items: const [],
        isLoading: false,
        errorMessage: 'Failed to load local cart: $e',
      );
    }
  }

  /// Persists current items list to local disk
  Future<void> _persistCart(List<CartItem> items) async {
    try {
      final jsonList = items.map((e) => e.toJson()).toList();
      await _cartBox.put(kCartHiveStorageKey, jsonEncode(jsonList));
    } catch (e) {
      // Local write fallback warning (silent logging in production)
    }
  }

  /// Optimistic Add to Cart
  Future<void> addItem(CartItem item) async {
    final existingIndex =
        state.items.indexWhere((element) => element.variantId == item.variantId);

    List<CartItem> updatedList;
    if (existingIndex >= 0) {
      // Item exists, increment quantity
      final currentItem = state.items[existingIndex];
      final updatedItem =
          currentItem.copyWith(quantity: currentItem.quantity + item.quantity);
      updatedList = [...state.items];
      updatedList[existingIndex] = updatedItem;
    } else {
      // New item, prepend to list
      updatedList = [item, ...state.items];
    }

    // Update memory state immediately (Optimistic UI)
    state = state.copyWith(items: updatedList);

    // Persist to Hive offline database
    await _persistCart(updatedList);
  }

  /// Decrement or remove item
  Future<void> updateQuantity(String variantId, int newQuantity) async {
    if (newQuantity <= 0) {
      await removeItem(variantId);
      return;
    }

    final updatedList = state.items.map((item) {
      if (item.variantId == variantId) {
        return item.copyWith(quantity: newQuantity);
      }
      return item;
    }).toList();

    state = state.copyWith(items: updatedList);
    await _persistCart(updatedList);
  }

  /// Remove item by variant ID
  Future<void> removeItem(String variantId) async {
    final updatedList =
        state.items.where((item) => item.variantId != variantId).toList();

    state = state.copyWith(items: updatedList);
    await _persistCart(updatedList);
  }

  /// Clear entire cart
  Future<void> clearCart() async {
    state = const CartState(items: []);
    await _cartBox.delete(kCartHiveStorageKey);
  }
}

// ============================================================
// RIVERPOD PROVIDERS
// ============================================================

final cartProvider = NotifierProvider<CartNotifier, CartState>(() {
  return CartNotifier();
});

/// Selector provider for badge counter on the bottom navigation bar
final cartBadgeCountProvider = Provider<int>((ref) {
  return ref.watch(cartProvider).totalItemCount;
});

/// Selector provider for cart subtotal amount
final cartSubtotalProvider = Provider<double>((ref) {
  return ref.watch(cartProvider).subtotalNpr;
});
