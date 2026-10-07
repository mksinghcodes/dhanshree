# Dhanshree FinTech Integration Specification (Nepal Market)

> **Role:** Senior FinTech Integration Engineer  
> **Market:** Nepal E-Commerce (eSewa, Khalti, Cash on Delivery, Sparrow SMS / Aakash SMS)  
> **Security Standards:** HMAC-SHA256 Signatures, TLS 1.3, Idempotency-Key HTTP Headers, Dual-Provider Failover

---

## 1. End-to-End Payment Flow Architectures

### 1.1 eSewa ePay 2.0 Integration Architecture

```mermaid
sequenceDiagram
    autonumber
    actor User as Buyer (Mobile App)
    participant Client as Flutter Client
    participant Backend as Dhanshree Node.js API
    participant DB as PostgreSQL (Prisma)
    participant eSewa as eSewa Gateway (epay.esewa.com.np)

    User->>Client: Tap "Pay with eSewa"
    Client->>Backend: POST /api/v1/orders/checkout (Idempotency-Key)
    Backend->>Backend: Generate HMAC-SHA256 Signature (Amount + Uuid + Merchant)
    Backend->>DB: Create PaymentTransaction (Status: INITIATED)
    Backend-->>Client: Return Signed Form Parameters
    Client->>eSewa: Launch eSewa SDK / WebView Form POST
    User->>eSewa: Enter eSewa MPIN & Confirm OTP
    eSewa-->>Client: Redirect to Success URL with Base64 Encoded Payload
    Client->>Backend: POST /api/v1/payments/verify-esewa (encodedData)
    Backend->>Backend: Verify HMAC Signature with Secret Key
    Backend->>eSewa: Server-to-Server Status Check (GET /api/epay/transaction/status)
    eSewa-->>Backend: 200 OK (status: COMPLETE)
    Backend->>DB: Atomic Tx: Mark Payment SUCCESS & Order ORDER_PLACED
    Backend-->>Client: Return Order Confirmation (#DHAN-89241)
    Client-->>User: Display Success Screen & Trigger Dispatch
```

---

### 1.2 Khalti v2 e-Payment Integration Architecture

```mermaid
sequenceDiagram
    autonumber
    actor User as Buyer (Mobile App)
    participant Client as Flutter Client
    participant Backend as Dhanshree Node.js API
    participant DB as PostgreSQL (Prisma)
    participant Khalti as Khalti API (khalti.com/api/v2)

    User->>Client: Tap "Pay with Khalti"
    Client->>Backend: POST /api/v1/orders/checkout (Payment: KHALTI)
    Backend->>Backend: Convert NPR to Paisa (NPR * 100)
    Backend->>Khalti: POST /epayment/initiate/ (Key <Secret>, ReturnUrl, Paisa)
    Khalti-->>Backend: Return { pidx, payment_url, expires_at }
    Backend->>DB: Create PaymentTransaction (pidx, Status: INITIATED)
    Backend-->>Client: Return { pidx, payment_url }
    Client->>Khalti: Open Khalti Payment Sheet / WebView
    User->>Khalti: Authenticate & Confirm Payment
    Khalti-->>Client: Payment Completed Callback
    Client->>Backend: POST /api/v1/payments/verify-khalti (pidx, transactionUuid)
    Backend->>Khalti: POST /epayment/lookup/ (Header: Key <Secret>, Body: { pidx })
    Khalti-->>Backend: Return { status: "Completed", total_amount }
    Backend->>Backend: Verify Paisa Matches Database Record
    Backend->>DB: Atomic Tx: Mark Payment SUCCESS & Order ORDER_PLACED
    Backend-->>Client: Return Order Confirmation
    Client-->>User: Display Success Dialog
```

---

### 1.3 Cash on Delivery (COD) with Automated SMS OTP Confirmation

```mermaid
sequenceDiagram
    autonumber
    actor User as Buyer
    participant Client as Flutter Client
    participant Backend as Dhanshree API
    participant SMS as Local SMS Gateway (Sparrow/Aakash)
    participant DB as PostgreSQL

    User->>Client: Select "Cash on Delivery" & Tap "Place Order"
    Client->>Backend: POST /api/v1/checkout/cod/initiate
    Backend->>Backend: Generate Cryptographic 6-Digit OTP (Expires in 5m)
    Backend->>DB: Store SHA-256 Hash of OTP (Attempts: 0, Max: 3)
    Backend->>SMS: Dispatch SMS to +977 Mobile
    SMS-->>User: "Your Dhanshree code is 742951..."
    Backend-->>Client: Prompt 6-Digit OTP Dialog
    User->>Client: Input 6-Digit Code
    Client->>Backend: POST /api/v1/checkout/cod/verify (enteredOtp)
    Backend->>DB: Validate Hash & Attempts < 3
    Backend->>DB: Mark OTP Consumed, Create Payment (Status: PENDING), Order: ORDER_PLACED
    Backend-->>Client: Order Confirmed
    Client-->>User: Show Success Screen
```

---

## 2. Error Handling & Edge-Case Safeguards

### 2.1 Duplicate Order Prevention via Idempotency Keys
Implemented in [`backend/middleware/idempotency_guard.ts`](file:///C:/Users/Admin/.gemini/antigravity/brain/a10408c1-0c7e-4f69-8ee6-ffc1f84eb625/backend/middleware/idempotency_guard.ts):
- Every checkout request must pass a client-generated UUID in `Idempotency-Key`.
- **States:**
  - `PROCESSING`: Returns HTTP `409 Conflict` if a twin request arrives while the first is running.
  - `COMPLETED`: Returns cached response with header `X-Idempotent-Replay: true`, preventing double debit.
  - `FAILED`: Cleans key to allow safe customer retry.

### 2.2 User Cancellation & Inventory Release
Implemented in [`backend/services/cod_verification_service.ts`](file:///C:/Users/Admin/.gemini/antigravity/brain/a10408c1-0c7e-4f69-8ee6-ffc1f84eb625/backend/services/cod_verification_service.ts):
- When a user cancels during eSewa/Khalti redirect or leaves COD unverified after 15 minutes:
  - Background worker marks `Order.orderStatus = CANCELLED`.
  - Atomically increments `ProductVariant.stockQuantity` for all item lines, ensuring stock is freed up for other shoppers.

---

## 3. Local SMS Gateway Integration (Sparrow & Aakash)

Implemented in [`backend/services/sms_gateway_service.ts`](file:///C:/Users/Admin/.gemini/antigravity/brain/a10408c1-0c7e-4f69-8ee6-ffc1f84eb625/backend/services/sms_gateway_service.ts):

### Provider Comparison & Auto-Failover Strategy

| Provider | API Endpoint | Auth Method | Delivery Speed in Nepal | Primary/Fallback Role |
| :--- | :--- | :--- | :--- | :--- |
| **Sparrow SMS (Janaki Tech)** | `http://api.sparrowsms.com/v2/sms/` | Query Token + Sender ID (`Dhanshree`) | ~3–5 seconds (Direct NTC/Ncell SS7 pipe) | **Primary Gateway** |
| **Aakash SMS** | `https://sms.aakashsms.com/sms/v3/send` | JSON `auth_token` | ~4–7 seconds | **Automatic Fallback** |

```typescript
// Auto-Failover Logic
try {
  return await sendViaSparrow(sanitizedNumber, message);
} catch (sparrowErr) {
  console.warn("Sparrow failed, falling back to Aakash SMS...");
  return await sendViaAakash(sanitizedNumber, message);
}
```

---

## 4. Sandbox Testing Credentials

### eSewa ePay Test Environment:
- **Product Code:** `EPAYTEST`
- **Secret Key:** `8gBm/:&EnhH.1/q`
- **Form URL:** `https://rc-epay.esewa.com.np/api/epay/main/v2/form`
- **Test Credentials:** ID: `9841000000` / Password: `Nepal@123` / MPIN: `1122`

### Khalti EPAY Test Environment:
- **Public Key:** `test_public_key_...`
- **Secret Key:** `live_secret_key_6821360862b2434f81014e308910b427` (Test mode activated on sandbox)
- **Initiate URL:** `https://a.khalti.com/api/v2/epayment/initiate/`
- **Test Credentials:** ID: `9800000000` / MPIN: `1111` / OTP: `987654`
