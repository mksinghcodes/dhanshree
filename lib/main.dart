import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'core/router/app_router.dart';
import 'core/theme/app_theme.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // 1. Initialize Hive for lightning-fast offline persistence
  await Hive.initFlutter();

  // 2. Launch Root App wrapped with Riverpod ProviderScope
  runApp(
    const ProviderScope(
      child: DhanshreeApp(),
    ),
  );
}

class DhanshreeApp extends ConsumerWidget {
  const DhanshreeApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(appRouterProvider);

    return MaterialApp.router(
      title: 'Dhanshree Nepal',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      routerConfig: router,
    );
  }
}
