# 🇳🇵 Dhanshree Nepal - Mobile E-Commerce Application

> Premier mobile e-commerce & FinTech platform architected for seamless buying and selling in Nepal, India, and UAE, featuring local digital wallets (**eSewa**, **Khalti**), **Cash on Delivery (COD)** with SMS verification, and offline-first state persistence.

---

## 🎨 Brand Design Tokens

| Token | Name | HEX Value | Primary Role |
| :--- | :--- | :--- | :--- |
| **Primary** | Deep Royal Navy Blue | `#0F172A` | Navigation bars, primary typography, brand headers |
| **Accent CTA** | Emerald Growth Green | `#10B981` | Primary conversions ("Buy Now", "Confirm & Pay", Verified badge) |
| **Secondary** | Warm Prosperity Gold | `#F59E0B` | Dhamaka Flash Sales, ratings, VIP seller tags |
| **Background**| Clean Off-White | `#F8FAFC` | Global screen canvas |

---

## 📱 Mobile Architecture & Tech Stack

- **Mobile Framework:** Flutter 3.19+ & Dart 3.3+ (Cross-Platform iOS & Android)
- **State Management:** Flutter Riverpod 2.5 (Compile-safe Notifiers & Providers)
- **Offline Persistence:** Hive 2.2 (`hive_flutter` for zero-latency cart persistence)
- **Routing:** GoRouter 14.0 with `StatefulShellRoute` (persistent 5-tab navigation)
- **Backend API:** Node.js (TypeScript / Express / NestJS)
- **Database ORM:** PostgreSQL 16 + Prisma ORM
- **FinTech Integrations:** eSewa ePay 2.0 (HMAC-SHA256), Khalti v2 e-Payment, Sparrow & Aakash SMS Gateways
- **Security:** OWASP MASVS Level 2, Android Keystore AES-256, iOS Keychain Secure Enclave, TLS Certificate Pinning

---

## 📂 Repository Structure

```
dhanshreeapp/
├── lib/                                     # Flutter Mobile Application
│   ├── main.dart                            # Entrypoint (Hive init + Riverpod Scope)
│   ├── core/theme/app_theme.dart            # Brand tokens, Typography (Poppins / Inter)
│   ├── core/router/app_router.dart          # 5-Tab GoRouter Navigation
│   ├── core/security/                       # Hardware Token Storage, Cert Pinning, Log Scrubber
│   ├── features/catalog/                    # ProductCard, PDP Screen, Variant Choice Chips
│   ├── features/cart/                       # CartNotifier with Hive Offline Storage
│   └── features/checkout/                   # NepalPaymentSheet (eSewa, Khalti, COD)
├── backend/                                 # Nepal FinTech Backend Services
│   ├── services/esewa_fintech_service.ts    # eSewa ePay 2.0 HMAC-SHA256 Verification
│   ├── services/khalti_fintech_service.ts   # Khalti v2 EPAY Initiate & Lookup
│   ├── services/cod_verification_service.ts # Cash on Delivery (COD) SMS OTP Engine
│   ├── services/sms_gateway_service.ts      # Sparrow & Aakash SMS Auto-Failover
│   └── middleware/idempotency_guard.ts      # Double-Charging & Duplicate Prevention
├── tests/                                   # Automated QA & FinTech Test Suite
│   ├── cart_and_payment.test.ts             # Cart arithmetic, Promo codes & HMAC tests
│   └── run_test_suite.mjs                   # Executable test runner (17/17 Passing)
├── devops/                                  # DevOps & CI/CD Pipelines
│   └── workflows/                           # GitHub Actions: Signed AAB, APK & TestFlight
├── ios/fastlane/                            # Fastlane Automation for App Store
├── schema.prisma                            # Normalized PostgreSQL Database Schema
├── openapi.yaml                             # RESTful API Contracts (OpenAPI 3.0)
└── dhanshree_mobile_prototype.html          # Interactive Mobile Browser Simulator
```

---

## ⚡ Quick Start

### 1. Run the Interactive Browser Simulator
Open `dhanshree_mobile_prototype.html` directly in your browser or run:
```bash
node server.mjs
```
Then visit: **`http://localhost:3000`**

### 2. Run the Automated QA & FinTech Tests
```bash
npm test
```
All 17 test suites execute in ~60ms using Node's native test runner.

---

## 💳 Nepal FinTech Handshake Protocols

### eSewa ePay 2.0 (HMAC-SHA256)
Outgoing requests and incoming callbacks are cryptographically verified using:
$$\text{HMAC-SHA256}\big(K_{\text{secret}}, \text{"total\_amount="} + A + \text{",transaction\_uuid="} + U + \text{",product\_code="} + P\big)$$
Followed by a server-to-server query against `https://epay.esewa.com.np/api/epay/transaction/status/`.

### Khalti v2 e-Payment
Amounts are calculated in integer Paisa ($1\text{ NPR} = 100\text{ Paisa}$) and verified via server-to-server lookup with secret key authorization.

### Cash on Delivery (COD)
Includes automated 6-digit SMS OTP confirmation with inventory reservation leases and anti-fraud protections.

---

## 📄 License
UNLICENSED - Dhanshree Nepal. All Rights Reserved.
