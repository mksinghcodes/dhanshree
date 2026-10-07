import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import '../../cart/presentation/cart_controller.dart';

/// Root Scaffold shell hosting the persistent 5-Tab Bottom Navigation Bar
class MainScaffold extends ConsumerWidget {
  final StatefulNavigationShell navigationShell;

  const MainScaffold({
    super.key,
    required this.navigationShell,
  });

  void _onItemTapped(int index) {
    navigationShell.goBranch(
      index,
      initialLocation: index == navigationShell.currentIndex,
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final cartCount = ref.watch(cartBadgeCountProvider);

    return Scaffold(
      body: navigationShell,
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          color: AppTheme.surfaceCard,
          border: Border(top: BorderSide(color: AppTheme.borderSubtle, width: 1)),
        ),
        child: NavigationBar(
          selectedIndex: navigationShell.currentIndex,
          onDestinationSelected: _onItemTapped,
          backgroundColor: AppTheme.surfaceCard,
          indicatorColor: AppTheme.accentEmeraldTint,
          elevation: 0,
          labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
          destinations: [
            // Tab 1: Home
            const NavigationDestination(
              icon: Icon(Icons.home_outlined, color: AppTheme.textSecondary),
              selectedIcon: Icon(Icons.home, color: AppTheme.accentEmerald),
              label: 'Home',
            ),

            // Tab 2: Categories
            const NavigationDestination(
              icon: Icon(Icons.grid_view_outlined, color: AppTheme.textSecondary),
              selectedIcon: Icon(Icons.grid_view_rounded, color: AppTheme.accentEmerald),
              label: 'Categories',
            ),

            // Tab 3: Deals / Dhamaka Offer
            const NavigationDestination(
              icon: Icon(Icons.bolt_outlined, color: AppTheme.textSecondary),
              selectedIcon: Icon(Icons.bolt, color: AppTheme.secondaryGold),
              label: 'Deals',
            ),

            // Tab 4: Cart (With live Badge Counter)
            NavigationDestination(
              icon: Badge(
                isLabelVisible: cartCount > 0,
                backgroundColor: AppTheme.secondaryGold,
                textColor: AppTheme.primaryNavy,
                textStyle: const TextStyle(fontWeight: FontWeight.w800, fontSize: 10),
                label: Text('$cartCount'),
                child: const Icon(Icons.shopping_bag_outlined, color: AppTheme.textSecondary),
              ),
              selectedIcon: Badge(
                isLabelVisible: cartCount > 0,
                backgroundColor: AppTheme.secondaryGold,
                textColor: AppTheme.primaryNavy,
                textStyle: const TextStyle(fontWeight: FontWeight.w800, fontSize: 10),
                label: Text('$cartCount'),
                child: const Icon(Icons.shopping_bag, color: AppTheme.accentEmerald),
              ),
              label: 'Cart',
            ),

            // Tab 5: Profile
            const NavigationDestination(
              icon: Icon(Icons.person_outline, color: AppTheme.textSecondary),
              selectedIcon: Icon(Icons.person, color: AppTheme.accentEmerald),
              label: 'Account',
            ),
          ],
        ),
      ),
    );
  }
}
