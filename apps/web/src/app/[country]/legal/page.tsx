'use client';

import React, { useState, use } from 'react';
import { CountryCode } from '@dhanshree/shared';
import { Header } from '../../../components/Header';

interface PageProps {
  params: Promise<{
    country: string;
  }>;
}

export default function LegalCompliancePage({ params }: PageProps) {
  const unwrappedParams = use(params);
  const countryParam = unwrappedParams.country.toUpperCase();

  const countryCode =
    countryParam === 'IN'
      ? CountryCode.INDIA
      : countryParam === 'AE'
      ? CountryCode.UAE
      : CountryCode.NEPAL;

  const [activeTab, setActiveTab] = useState<'PRIVACY' | 'TERMS' | 'ESCROW' | 'TAX'>('PRIVACY');

  const config = {
    NP: {
      privacyLaw: 'Individual Privacy Act, 2075 (2018)',
      dataNotice: 'Data resides in secure ISO-27001 certified regional cloud storage. Buyers have statutory rights to consent withdrawal and data access.',
      taxTitle: 'Inland Revenue Department (IRD) Nepal Rule 24',
      taxDetails: 'All sales registered on Dhanshree Nepal generate computer-printed VAT invoices with synchronous electronic transmission to the IRD central billing database. Seller PAN/VAT numbers are verified prior to listing.',
    },
    IN: {
      privacyLaw: 'Digital Personal Data Protection Act, 2023 (DPDP Act)',
      dataNotice: 'Consent architecture adheres strictly to DPDP Act Section 6. Personal identifiable information (PII) is encrypted at rest using AES-256 and processed solely for order fulfillment.',
      taxTitle: 'Goods & Services Tax Network (GSTN) & Section 52 TCS',
      taxDetails: 'As an Electronic Commerce Operator (ECO) under Section 52 of the CGST Act, 2017, Dhanshree collects and deposits 1% Tax Collected at Source (TCS) on the net value of taxable supplies. Monthly returns (GSTR-8) are electronically filed with the GSTN portal.',
    },
    AE: {
      privacyLaw: 'Federal Decree-Law No. 45/2021 on the Protection of Personal Data (UAE PDPL)',
      dataNotice: 'Compliant with UAE Data Office regulations. Cross-border transfers adhere to Article 22 adequate protection standards.',
      taxTitle: 'Federal Tax Authority (FTA) Executive Regulation Art. 59',
      taxDetails: 'Dhanshree operates under UAE Tax Registration Number (TRN) 100488291000003. All orders issue official bilingual Arabic/English tax invoices with transparent 5% VAT itemization.',
    },
  }[countryCode];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header currentCountry={countryCode} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>⚖️</span> Statutory Governance & Legal Policies
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Compliance, Privacy & Escrow Framework
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            Local legal terms and data protection policies governing buyers, sellers, and financial transactions in {countryCode}.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-2 border-b border-slate-200 pb-3 mb-6 overflow-x-auto">
          {(
            [
              { id: 'PRIVACY', label: 'Privacy & Data Protection' },
              { id: 'TERMS', label: 'Terms of Service' },
              { id: 'ESCROW', label: '7-Day Escrow Guarantee' },
              { id: 'TAX', label: 'Statutory Tax Compliance' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 text-xs text-slate-700 leading-relaxed">
          {activeTab === 'PRIVACY' && (
            <div className="space-y-4">
              <h2 className="text-base font-black text-slate-900">
                1. Privacy Policy & Data Sovereignty ({config.privacyLaw})
              </h2>
              <p>
                Dhanshree is committed to respecting the privacy of consumers and merchants in {countryCode}. We collect only necessary telemetry required to process orders, verify identity, and prevent fraud.
              </p>
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-950 font-medium">
                <b>Statutory Notice:</b> {config.dataNotice}
              </div>
              <h3 className="font-bold text-slate-900 text-sm mt-4">Data We Collect</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Contact & Delivery Coordinates (Name, Verified Phone, Shipping Address, Ward/PIN/Makani).</li>
                <li>Transaction records and tokenized payment identifiers (we NEVER store raw credit/debit card numbers or CVVs).</li>
                <li>Device logs, IP addresses, and session tokens for automated account protection and fraud prevention.</li>
              </ul>
              <h3 className="font-bold text-slate-900 text-sm mt-4">Your Data Rights</h3>
              <p>
                You may request access to your personal data, rectify inaccuracies, or request permanent account erasure by contacting our Data Protection Officer at <span className="font-mono text-blue-600">privacy@Dhanshree.global</span>.
              </p>
            </div>
          )}

          {activeTab === 'TERMS' && (
            <div className="space-y-4">
              <h2 className="text-base font-black text-slate-900">
                2. Marketplace User Agreement & Merchant Guidelines
              </h2>
              <p>
                By accessing or placing orders through Dhanshree ({countryCode} storefront), you enter into a legally binding contract subject to local commercial trade laws.
              </p>
              <h3 className="font-bold text-slate-900 text-sm">Merchant Obligations</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Sellers must maintain active, verified business licenses (PAN in Nepal, GSTIN in India, DED License in UAE).</li>
                <li>All products must be 100% genuine and authentic. Sale of counterfeit, gray-market, or refurbished items disguised as new results in immediate permanent store ban and escrow forfeiture.</li>
                <li>Orders must be packed and dispatched to assigned carriers within the mandatory 24-hour SLA window.</li>
              </ul>
            </div>
          )}

          {activeTab === 'ESCROW' && (
            <div className="space-y-4">
              <h2 className="text-base font-black text-slate-900">
                3. The 7-Day Buyer Escrow Protection Protocol
              </h2>
              <p>
                Unlike traditional classifieds or peer-to-peer portals, Dhanshree operates an institutional-grade escrow settlement system protecting both buyers and merchants.
              </p>
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                <b>How Your Money is Protected:</b> When you pay online (via eSewa, Khalti, UPI, Cards, or Apple Pay), your funds do not go directly to the seller. They are securely locked in Dhanshree Escrow. Funds are released to the seller only <b>7 days after carrier delivery</b>, giving you full opportunity to inspect the item for defects, authenticity, or transit damage.
              </div>
              <h3 className="font-bold text-slate-900 text-sm mt-4">Filing an Escrow Dispute</h3>
              <p>
                If an item arrives broken, defective, or does not match description, click <b>"File Dispute"</b> in your order timeline within 7 days. Our arbitration desk inspects photographic evidence and reverses funds directly back to your payment source.
              </p>
            </div>
          )}

          {activeTab === 'TAX' && (
            <div className="space-y-4">
              <h2 className="text-base font-black text-slate-900">
                4. Statutory Tax Disclosures ({config.taxTitle})
              </h2>
              <p>{config.taxDetails}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900 text-sm">Official Tax Invoices</div>
                  <p className="mt-1 text-slate-600">
                    Every order placed on Dhanshree generates a computer-verified, downloadable tax invoice with registered merchant identifiers.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900 text-sm">Anti-Fraud & RTO Protection</div>
                  <p className="mt-1 text-slate-600">
                    High-value Cash on Delivery (COD) transactions undergo automated phone OTP verification to prevent unauthorized orders.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
