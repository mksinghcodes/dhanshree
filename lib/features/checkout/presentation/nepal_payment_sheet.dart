import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../cart/presentation/cart_controller.dart';

enum NepalPaymentMethod { esewa, khalti, cod }

class NepalPaymentSheet extends ConsumerStatefulWidget {
  final double totalAmountNpr;
  final String shippingAddressId;

  const NepalPaymentSheet({
    super.key,
    required this.totalAmountNpr,
    required this.shippingAddressId,
  });

  @override
  ConsumerState<NepalPaymentSheet> createState() => _NepalPaymentSheetState();
}

class _NepalPaymentSheetState extends ConsumerState<NepalPaymentSheet> {
  NepalPaymentMethod _selectedMethod = NepalPaymentMethod.esewa;
  bool _isProcessing = false;
  String? _activeOtpSessionOrderId;
  final TextEditingController _codOtpController = TextEditingController();

  @override
  void dispose() {
    _codOtpController.dispose();
    super.dispose();
  }

  /// Initiates Checkout & Payment Handshake
  Future<void> _handlePaymentSubmit() async {
    setState(() => _isProcessing = true);

    try {
      switch (_selectedMethod) {
        case NepalPaymentMethod.esewa:
          await _executeEsewaFlow();
          break;
        case NepalPaymentMethod.khalti:
          await _executeKhaltiFlow();
          break;
        case NepalPaymentMethod.cod:
          await _executeCodOtpFlow();
          break;
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            backgroundColor: AppTheme.errorRed,
            content: Text('Payment Error: $e'),
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _isProcessing = false);
    }
  }

  /// 1. eSewa Flow: Launches gateway & verifies callback on backend
  Future<void> _executeEsewaFlow() async {
    // In production, invoke eSewa Mobile SDK or WebView form redirect
    // Simulated SDK callback payload
    await Future.delayed(const Duration(seconds: 1));

    // Sample payload returned by eSewa
    final mockCallbackPayload = {
      'transaction_code': 'ESEWA-TXN-9021',
      'status': 'COMPLETE',
      'total_amount': widget.totalAmountNpr.toStringAsFixed(2),
      'transaction_uuid': 'DHAN-ESEWA-ORDER-12345',
      'product_code': 'EPAYTEST',
      'signature': 'SAMPLE_HMAC_SIGNATURE',
    };

    final encodedData = base64Encode(utf8.encode(jsonEncode(mockCallbackPayload)));

    // Send encodedData to Backend endpoint /api/v1/payments/verify-esewa
    _showSuccessDialog('eSewa Payment Verified! Transaction: ESEWA-TXN-9021');
  }

  /// 2. Khalti Flow: Initiates session, gets pidx, launches webview/SDK
  Future<void> _executeKhaltiFlow() async {
    await Future.delayed(const Duration(seconds: 1));
    const mockPidx = 'HT6o6pebEcHoAAYdS6TFep';

    // Verify pidx with Backend endpoint /api/v1/payments/verify-khalti
    _showSuccessDialog('Khalti Payment Completed! Reference: $mockPidx');
  }

  /// 3. Cash on Delivery Flow: Requests 6-digit confirmation OTP
  Future<void> _executeCodOtpFlow() async {
    await Future.delayed(const Duration(milliseconds: 600));
    _activeOtpSessionOrderId = 'DHAN-ORDER-9921';

    if (mounted) {
      _showCodOtpConfirmationDialog();
    }
  }

  /// Modal for entering COD 6-digit verification code
  void _showCodOtpConfirmationDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppTheme.radiusLg)),
        title: const Row(
          children: [
            Icon(Icons.mark_email_read_outlined, color: AppTheme.secondaryGold),
            SizedBox(width: 8),
            Text('Confirm COD Order', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'A 6-digit verification code was sent to your phone via SMS. Please enter it to place your order.',
              style: TextStyle(fontSize: 12, color: AppTheme.textSecondary),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _codOtpController,
              keyboardType: TextInputType.number,
              maxLength: 6,
              style: const TextStyle(letterSpacing: 4, fontWeight: FontWeight.bold, fontSize: 18),
              decoration: const InputDecoration(
                hintText: '000000',
                counterText: '',
                prefixIcon: Icon(Icons.lock_outline),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel', style: TextStyle(color: AppTheme.textMuted)),
          ),
          ElevatedButton(
            onPressed: () {
              if (_codOtpController.text.length == 6) {
                Navigator.pop(context);
                _showSuccessDialog('Cash on Delivery Order Confirmed! (#DHAN-9921)');
              }
            },
            child: const Text('Verify & Confirm'),
          ),
        ],
      ),
    );
  }

  void _showSuccessDialog(String message) {
    ref.read(cartProvider.notifier).clearCart();
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppTheme.radiusLg)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.check_circle_rounded, color: AppTheme.accentEmerald, size: 56),
            const SizedBox(height: 12),
            const Text('Success!', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 6),
            Text(message, textAlign: TextAlign.center, style: const TextStyle(fontSize: 12)),
          ],
        ),
        actions: [
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context); // Close dialog
              Navigator.pop(context); // Close sheet
            },
            child: const Text('Back to Home'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppTheme.space20),
      decoration: const BoxDecoration(
        color: AppTheme.surfaceCard,
        borderRadius: BorderRadius.vertical(top: Radius.circular(AppTheme.radiusXl)),
      ),
      child: SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Select Payment Method',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                IconButton(
                  icon: const Icon(Icons.close),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
            const Divider(),
            const SizedBox(height: 8),

            // Option 1: eSewa
            _buildPaymentOption(
              method: NepalPaymentMethod.esewa,
              title: 'eSewa Mobile Wallet',
              subtitle: 'Pay directly via eSewa account or ePay',
              badge: 'Popular',
              logoColor: const Color(0xFF60BB46),
              logoText: 'eS',
            ),
            const SizedBox(height: 10),

            // Option 2: Khalti
            _buildPaymentOption(
              method: NepalPaymentMethod.khalti,
              title: 'Khalti Digital Wallet',
              subtitle: 'Pay via Khalti ID or MPIN',
              logoColor: const Color(0xFF5C2D91),
              logoText: 'Kh',
            ),
            const SizedBox(height: 10),

            // Option 3: COD
            _buildPaymentOption(
              method: NepalPaymentMethod.cod,
              title: 'Cash on Delivery (COD)',
              subtitle: 'Pay cash upon receiving parcel (SMS OTP required)',
              logoColor: AppTheme.secondaryGold,
              logoText: '💵',
            ),
            const SizedBox(height: 20),

            // Submit Button
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                onPressed: _isProcessing ? null : _handlePaymentSubmit,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.accentEmerald,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppTheme.radiusMd)),
                ),
                child: _isProcessing
                    ? const SizedBox(
                        width: 22,
                        height: 22,
                        child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                      )
                    : Text(
                        'Pay रु ${widget.totalAmountNpr.toStringAsFixed(0)}',
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPaymentOption({
    required NepalPaymentMethod method,
    required String title,
    required String subtitle,
    required Color logoColor,
    required String logoText,
    String? badge,
  }) {
    final isSelected = _selectedMethod == method;

    return InkWell(
      onTap: () => setState(() => _selectedMethod = method),
      borderRadius: BorderRadius.circular(AppTheme.radiusMd),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: isSelected ? AppTheme.accentEmeraldTint : const Color(0xFFF8FAFC),
          borderRadius: BorderRadius.circular(AppTheme.radiusMd),
          border: Border.all(
            color: isSelected ? AppTheme.accentEmerald : AppTheme.borderSubtle,
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Row(
          children: [
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: logoColor,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Center(
                child: Text(
                  logoText,
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                      if (badge != null) ...[
                        const SizedBox(width: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppTheme.accentEmerald,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(badge, style: const TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold)),
                        ),
                      ],
                    ],
                  ),
                  Text(subtitle, style: const TextStyle(color: AppTheme.textMuted, fontSize: 11)),
                ],
              ),
            ),
            Icon(
              isSelected ? Icons.radio_button_checked : Icons.radio_button_off,
              color: isSelected ? AppTheme.accentEmerald : AppTheme.textMuted,
            ),
          ],
        ),
      ),
    );
  }
}
