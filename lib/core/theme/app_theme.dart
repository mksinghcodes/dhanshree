import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Design tokens and central Theme configuration for Dhanshree
class AppTheme {
  AppTheme._();

  // ============================================================
  // BRAND COLOR TOKENS
  // ============================================================
  static const Color primaryNavy = Color(0xFF0F172A);      // Slate 900
  static const Color primaryNavyLight = Color(0xFF1E293B); // Slate 800
  static const Color accentEmerald = Color(0xFF10B981);     // Emerald 500 (Primary CTA)
  static const Color accentEmeraldHover = Color(0xFF059669);// Emerald 600
  static const Color accentEmeraldTint = Color(0xFFECFDF5); // Emerald 50
  static const Color secondaryGold = Color(0xFFF59E0B);     // Amber 500 (Flash deals/Stars)
  static const Color secondaryGoldLight = Color(0xFFFEF3C7);// Amber 100
  static const Color backgroundCanvas = Color(0xFFF8FAFC);  // Off-white canvas
  static const Color surfaceCard = Color(0xFFFFFFFF);      // Pure white
  static const Color borderSubtle = Color(0xFFE2E8F0);      // Slate 200
  static const Color textPrimary = Color(0xFF0F172A);
  static const Color textSecondary = Color(0xFF475569);    // Slate 600
  static const Color textMuted = Color(0xFF94A3B8);        // Slate 400
  static const Color errorRed = Color(0xFFEF4444);

  // ============================================================
  // SPACING SCALE (8pt Grid)
  // ============================================================
  static const double space4 = 4.0;
  static const double space8 = 8.0;
  static const double space12 = 12.0;
  static const double space16 = 16.0;
  static const double space20 = 20.0;
  static const double space24 = 24.0;
  static const double space32 = 32.0;

  // ============================================================
  // CORNER RADIUS
  // ============================================================
  static const double radiusSm = 8.0;
  static const double radiusMd = 12.0;
  static const double radiusLg = 16.0;
  static const double radiusXl = 24.0;
  static const double radiusPill = 999.0;

  // ============================================================
  // SHADOWS
  // ============================================================
  static List<BoxShadow> get cardShadow => [
        BoxShadow(
          color: primaryNavy.withOpacity(0.04),
          blurRadius: 8,
          offset: const Offset(0, 2),
        ),
        BoxShadow(
          color: primaryNavy.withOpacity(0.02),
          blurRadius: 2,
          offset: const Offset(0, 1),
        ),
      ];

  static List<BoxShadow> get emeraldGlowShadow => [
        BoxShadow(
          color: accentEmerald.withOpacity(0.35),
          blurRadius: 18,
          offset: const Offset(0, 6),
        ),
      ];

  // ============================================================
  // FLUTTER THEMEDATA CONFIGURATION
  // ============================================================
  static ThemeData get lightTheme {
    final baseTextTheme = Typography.material2021().black;

    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      primaryColor: primaryNavy,
      scaffoldBackgroundColor: backgroundCanvas,
      colorScheme: const ColorScheme(
        brightness: Brightness.light,
        primary: primaryNavy,
        onPrimary: Colors.white,
        secondary: accentEmerald,
        onSecondary: Colors.white,
        tertiary: secondaryGold,
        onTertiary: primaryNavy,
        error: errorRed,
        onError: Colors.white,
        surface: surfaceCard,
        onSurface: textPrimary,
      ),

      // Typographic hierarchy using Poppins (Headings) and Inter (Body)
      textTheme: TextTheme(
        // Display Hero
        displayLarge: GoogleFonts.poppins(
          fontSize: 26,
          fontWeight: FontWeight.w700,
          color: textPrimary,
          letterSpacing: -0.5,
        ),
        // H1 Title
        headlineLarge: GoogleFonts.poppins(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: textPrimary,
          letterSpacing: -0.2,
        ),
        // H2 Section Header
        headlineMedium: GoogleFonts.poppins(
          fontSize: 17,
          fontWeight: FontWeight.w600,
          color: textPrimary,
        ),
        // H3 Card Title
        headlineSmall: GoogleFonts.poppins(
          fontSize: 15,
          fontWeight: FontWeight.w500,
          color: textPrimary,
        ),
        // Body Large
        bodyLarge: GoogleFonts.inter(
          fontSize: 15,
          fontWeight: FontWeight.w400,
          color: textPrimary,
          height: 1.45,
        ),
        // Body Medium (Default)
        bodyMedium: GoogleFonts.inter(
          fontSize: 13,
          fontWeight: FontWeight.w400,
          color: textSecondary,
          height: 1.4,
        ),
        // Body Small / Captions
        bodySmall: GoogleFonts.inter(
          fontSize: 11,
          fontWeight: FontWeight.w500,
          color: textMuted,
        ),
        // Button Text
        labelLarge: GoogleFonts.poppins(
          fontSize: 14,
          fontWeight: FontWeight.w600,
          color: Colors.white,
        ),
      ),

      // App Bar Theme
      appBarTheme: AppBarTheme(
        backgroundColor: surfaceCard,
        elevation: 0,
        scrolledUnderElevation: 1,
        surfaceTintColor: Colors.transparent,
        centerTitle: true,
        titleTextStyle: GoogleFonts.poppins(
          fontSize: 16,
          fontWeight: FontWeight.w600,
          color: textPrimary,
        ),
        iconTheme: const IconThemeData(color: primaryNavy),
      ),

      // Elevated Buttons
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: accentEmerald,
          foregroundColor: Colors.white,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(radiusMd),
          ),
          textStyle: GoogleFonts.poppins(
            fontSize: 14,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),

      // Input Decoration Theme
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: const Color(0xFFF1F5F9),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        hintStyle: GoogleFonts.inter(
          fontSize: 13,
          color: textMuted,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusMd),
          borderSide: const BorderSide(color: borderSubtle),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusMd),
          borderSide: const BorderSide(color: borderSubtle),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusMd),
          borderSide: const BorderSide(color: accentEmerald, width: 1.5),
        ),
      ),

      // Divider Theme
      dividerTheme: const DividerThemeData(
        color: borderSubtle,
        thickness: 1,
        space: 1,
      ),
    );
  }
}
