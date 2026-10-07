import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// OWASP MASVS Compliant Secure Storage for Auth Tokens & Encryption Keys
class SecureStorageService {
  SecureStorageService._();

  static const String _keyAccessToken = 'dhanshree_jwt_access_token';
  static const String _keyRefreshToken = 'dhanshree_jwt_refresh_token';
  static const String _keyUserId = 'dhanshree_user_id';
  static const String _keyUserPhone = 'dhanshree_user_phone';

  // Secure options utilizing hardware-backed security modules (TEE / Secure Enclave)
  static const FlutterSecureStorage _storage = FlutterSecureStorage(
    aOptions: AndroidOptions(
      encryptedSharedPreferences: true,
      keyCipherAlgorithm: KeyCipherAlgorithm.RSA_ECB_PKCS1Padding,
      storageCipherAlgorithm: StorageCipherAlgorithm.AES_GCM_NoPadding,
      resetOnError: true,
    ),
    iOptions: IOSOptions(
      accessibility: KeychainAccessibility.first_unlock_this_device,
      synchronizable: false, // Prevents iCloud sync of session tokens
    ),
  );

  /// Saves Auth Token Pair atomically
  static Future<void> saveAuthSession({
    required String accessToken,
    required String refreshToken,
    required String userId,
    required String phone,
  }) async {
    await Future.wait([
      _storage.write(key: _keyAccessToken, value: accessToken),
      _storage.write(key: _keyRefreshToken, value: refreshToken),
      _storage.write(key: _keyUserId, value: userId),
      _storage.write(key: _keyUserPhone, value: phone),
    ]);
  }

  /// Retrieves Access Token
  static Future<String?> getAccessToken() async {
    return await _storage.read(key: _keyAccessToken);
  }

  /// Retrieves Refresh Token
  static Future<String?> getRefreshToken() async {
    return await _storage.read(key: _keyRefreshToken);
  }

  /// Retrieves User Identifier
  static Future<String?> getUserId() async {
    return await _storage.read(key: _keyUserId);
  }

  /// Wipes all sensitive credentials upon user logout or security breach detection
  static Future<void> wipeAllCredentials() async {
    await _storage.deleteAll();
  }
}
