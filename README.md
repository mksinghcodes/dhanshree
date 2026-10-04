# Dhanshree — World-Class Global Multi-Vendor Marketplace Platform
> Launching in **Nepal (NP)**, **India (IN)**, and the **United Arab Emirates (Dubai - AE)**.  
> Comparable to **Amazon**, **eBay**, **Alibaba**, and **Flipkart**.  
> Engineered with **Next.js 14+ (App Router)**, **TypeScript**, **Tailwind CSS**, **NestJS (Modular Monolith)**, **PostgreSQL 16**, **Prisma ORM**, **Redis**, **Meilisearch**, and **BullMQ**.

---

## 1. System Architecture & Component Diagram

Dhanshree is structured as a resilient, multi-region modular platform capable of operating as a unified monolith or splitting horizontally into independent microservices.

```mermaid
graph TD
    User([Customer / Merchant / Admin]) --> Cloudflare[Cloudflare Global Edge CDN & WAF]
    
    subgraph Storefront Layer [Next.js App Router (Port 3000)]
        Cloudflare --> NP_Store[/np - Nepal Storefront (NPR, 13% VAT)/]
        Cloudflare --> IN_Store[/in - India Storefront (INR, GST & 1% TCS)/]
        Cloudflare --> AE_Store[/ae - UAE Storefront (AED, 5% VAT, RTL)/]
    end

    subgraph Service Layer [NestJS Modular Monolith API (Port 4000)]
        NP_Store & IN_Store & AE_Store --> Gateway[API Gateway / Router]
        Gateway --> AuthMod[Auth & RBAC Module (JWT / OTP)]
        Gateway --> CatalogMod[Catalog & Faceted Search Engine]
        Gateway --> CartMod[Cart & Inventory Reservation Module]
        Gateway --> OrderMod[Orders & Quote Calculation Module]
        Gateway --> PaymentMod[Pluggable Multi-Gateway Payment Engine]
        Gateway --> SellerMod[Enterprise Seller Operations Portal]
        Gateway --> AdminMod[Super Admin Governance & Audit Desk]
        Gateway --> AdvancedMod[Auctions, RFQ Wholesale & AI Concierge]
        Gateway --> LogisticsMod[Courier Webhooks & Cross-Border Duty Engine]
    end

    subgraph Data & Queue Layer
        ServiceLayer --> Postgres[(PostgreSQL 16 Multi-Tenant DB)]
        ServiceLayer --> RedisCache[(Redis Cache & Session Store)]
        ServiceLayer --> SearchEngine[(Meilisearch Fast Full-Text Engine)]
        ServiceLayer --> QueueBroker[(BullMQ / RabbitMQ Background Workers)]
    end

    subgraph Regional External Integrations
        PaymentMod --> NP_Pay[eSewa / Khalti / Fonepay / ConnectIPS]
        PaymentMod --> IN_Pay[Razorpay / UPI / NetBanking / Cashfree]
        PaymentMod --> AE_Pay[Stripe / Apple Pay / Tabby 4-Mo BNPL]
        LogisticsMod --> NP_Courier[Nepal CanShip & Express / Pathao]
        LogisticsMod --> IN_Courier[Delhivery Surface / BlueDart]
        LogisticsMod --> AE_Courier[Aramex Priority UAE / Careem Box]
    end
```

---

## 2. Multi-Country Market Matrix

| Dimension | Nepal (`NP`) | India (`IN`) | UAE (`AE`) |
| :--- | :--- | :--- | :--- |
| **Storefront Route** | `/np` | `/in` | `/ae` |
| **Currency** | `NPR` (रु) | `INR` (₹) | `AED` (AED) |
| **Languages** | Nepali (`ne`), English (`en`) | Hindi (`hi`), English (`en`) | Arabic (`ar` Full RTL), English (`en`) |
| **Address Structure** | Ward, Municipality, District, Province | Flat/House, Street, PIN Code (6-digit), State | Villa/Building, Street, Makani Number, Emirate |
| **Payment Gateways** | eSewa EPAY v2, Khalti v2, COD | Razorpay, UPI QR & Collect, NetBanking, COD | Stripe Cards, Apple Pay, Tabby 4-Month BNPL |
| **COD Engine Limits** | Limit: NPR 50,000 (NPR 50 fee) | Limit: INR 30,000 (₹49 fee) | Limit: AED 2,500 (AED 15 fee) |
| **Statutory Tax** | 13% VAT (IRD Rule 24 e-billing) | 5/12/18/28% GST + **1% Section 52 TCS** | 5% Standard VAT (FTA Executive Reg Art. 59) |
| **Tax Invoicing** | Official कर बीजक (VAT Tax Invoice) | GST Tax Invoice with HSN & E-Way Ref | فاتورة ضريبية / Bilingual Tax Invoice with TRN |
| **Merchant KYC** | 9-digit PAN / VAT Registration Certificate | 15-character GSTIN & State Code Verification | DED Commercial Trade License & Emirates ID |
| **Default Carrier** | Nepal CanShip & Express Logistics | Delhivery Surface Express | Aramex Priority Express Dubai |
| **Data Protection** | Individual Privacy Act 2018 | Digital Personal Data Protection Act 2023 | UAE Data Protection Law (Decree No. 45/2021) |
| **Festival Engines** | Dashain & Tihar Mega Discounts | Diwali Dhamaka Festival Flash Sales | Ramadan & Eid Al-Fitr Gift Campaigns |

---

## 3. Monorepo Organization

```
dhanshree/
├── apps/
│   ├── api/                                # NestJS Modular Monolith API
│   │   ├── prisma/                         # PostgreSQL 16 schema.prisma & seed data
│   │   ├── src/
│   │   │   ├── database/                   # Safe dynamic PrismaService
│   │   │   ├── modules/
│   │   │   │   ├── auth/                   # JWT rotation, phone OTP (Sparrow/MSG91/Twilio), RBAC
│   │   │   │   ├── users/                  # Localized addresses (Ward/PIN/Makani) & user profiles
│   │   │   │   ├── catalog/                # Unlimited category tree, brands, faceted search
│   │   │   │   ├── cart/                   # Cart item sync, inventory reservation, festival coupons
│   │   │   │   ├── payments/               # Pluggable adapters (eSewa, Khalti, Razorpay, Stripe, Tabby, COD)
│   │   │   │   ├── orders/                 # Order lifecycle, escrow payout splits, tax invoicing
│   │   │   │   ├── sellers/                # Multi-WH inventory, AI copy generator, CSV bulk uploader, AWB labels
│   │   │   │   ├── admin/                  # Multi-region cockpit, seller KYC queue, commission rules, disputes
│   │   │   │   ├── advanced/               # eBay auctions, Alibaba wholesale RFQ, PPC ads, Prime loyalty, AI bot
│   │   │   │   └── logistics/              # Serviceability, cross-border duty (CEPA/Treaties), carrier webhooks
│   │   │   ├── app.module.ts               # Core NestJS application module
│   │   │   └── main.ts                     # Swagger documentation & validation pipes
│   │   └── tsconfig.json
│   │
│   └── web/                                # Next.js 14+ (App Router) Storefront
│       ├── src/
│       │   ├── app/
│       │   │   ├── [country]/page.tsx      # Localized Country Storefront (/np, /in, /ae)
│       │   │   ├── [country]/products/     # Faceted product catalog & details with Schema.org JSON-LD
│       │   │   ├── [country]/checkout/     # 3-step localized checkout (Address, Payment, Review)
│       │   │   ├── [country]/orders/       # Live fulfillment stepper, carrier telemetry, official tax invoice
│       │   │   ├── [country]/seller/       # Seller Central: KPIs, Multi-WH inventory, 1-click AWB labels, payouts
│       │   │   ├── [country]/admin/        # Super Admin: Tri-country GMV, KYC audit, commissions, dispute desk
│       │   │   ├── [country]/auctions/     # eBay-style live auctions with countdowns & counter-offers
│       │   │   ├── [country]/rfq/          # Alibaba-style B2B wholesale tiered pricing & custom RFQs
│       │   │   ├── [country]/membership/   # Amazon Prime VIP club benefits & loyalty point redemption
│       │   │   ├── [country]/shipping/     # Cross-border customs duty calculator (CEPA/Nepal-India treaties)
│       │   │   └── [country]/legal/        # Statutory privacy (DPDP/PDPL) & 7-day escrow terms
│       │   └── components/
│       │       ├── Header.tsx              # Storefront switcher & secondary advanced navbar
│       │       ├── CartDrawer.tsx          # Flyout cart drawer with live coupon engine
│       │       ├── AiShoppingAssistant.tsx # Floating conversational AI concierge
│       │       ├── SellerNav.tsx           # Unified merchant navigation
│       │       └── AdminNav.tsx            # Super admin top navigation
│       ├── e2e/marketplace.spec.ts         # Playwright E2E integration test suite
│       └── tsconfig.json
│
├── packages/
│   └── shared/                             # Zero-dependency TypeScript Core Library
│       ├── src/
│       │   ├── constants/                  # Country definitions, tax rules, currencies
│       │   └── types/                      # DTOs: cart, checkout, seller, admin, advanced, logistics
│       └── dist/                           # Compiled types and constants
│
├── infra/
│   ├── docker-compose.yml                  # Local development multi-container stack
│   ├── docker-compose.prod.yml             # Production hardened stack with replicas
│   ├── k8s/                                # Production Kubernetes manifests
│   │   ├── marketplace-ingress.yaml        # Domain routing (nepal/india/uae.Dhanshree.global)
│   │   ├── api-deployment.yaml             # API deployment with HPA (4-24 replicas)
│   │   └── web-deployment.yaml             # Next.js web deployment with HPA (4-20 replicas)
│   └── schema.sql                          # Pure SQL DDL (30+ relational entities)
│
└── .github/workflows/
    └── ci-cd.yml                           # GitHub Actions CI/CD pipeline
```

---

## 4. Local Quick Start Guide

### Prerequisites
- **Node.js**: v20.x or v24.x
- **Docker & Docker Compose** (optional for local PostgreSQL/Redis stack)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-org/dhanshree.git
cd dhanshree
npm install
```

### 2. Compile Shared Types
```bash
npx tsc -p packages/shared/tsconfig.json
```

### 3. Start Infrastructure Stack
```bash
docker compose -f infra/docker-compose.yml up -d
```

### 4. Run Development Servers
In separate terminals:
```bash
# Terminal 1: Start Backend API (Port 4000)
cd apps/api
npm run start:dev

# Terminal 2: Start Frontend Web Storefront (Port 3000)
cd apps/web
npm run dev
```

Visit in your browser:
- **Global Portal**: [http://localhost:3000](http://localhost:3000)
- **Nepal Storefront**: [http://localhost:3000/np](http://localhost:3000/np)
- **India Storefront**: [http://localhost:3000/in](http://localhost:3000/in)
- **UAE Dubai Storefront**: [http://localhost:3000/ae](http://localhost:3000/ae)
- **API Swagger Documentation**: [http://localhost:4000/api/docs](http://localhost:4000/api/docs)
- **Seller Operations Hub**: [http://localhost:3000/np/seller](http://localhost:3000/np/seller)
- **Super Admin Cockpit**: [http://localhost:3000/np/admin](http://localhost:3000/np/admin)

---

## 5. Verification & Testing

Verify that all packages and applications compile with **0 errors**:
```bash
# Typecheck Shared Package
npx tsc -p packages/shared/tsconfig.json

# Typecheck Backend API
npx tsc -p apps/api/tsconfig.json --noEmit

# Typecheck Frontend Web
npx tsc -p apps/web/tsconfig.json --noEmit

# Run Playwright E2E Suite
npx playwright test apps/web/e2e/marketplace.spec.ts
```

---

## 6. Production Deployment

### Docker Container Build
```bash
docker build -t ghcr.io/Dhanshree/api:latest -f apps/api/Dockerfile .
docker build -t ghcr.io/Dhanshree/web:latest -f apps/web/Dockerfile .
```

### Kubernetes Zero-Downtime Rollout
```bash
kubectl apply -f infra/k8s/api-deployment.yaml -n Dhanshree-prod
kubectl apply -f infra/k8s/web-deployment.yaml -n Dhanshree-prod
kubectl apply -f infra/k8s/marketplace-ingress.yaml -n Dhanshree-prod
```
