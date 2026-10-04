'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { CountryCode, CurrencyCode, RfqInquiryResult } from '@dhanshree/shared';
import { Header } from '../../../components/Header';

interface PageProps {
  params: Promise<{
    country: string;
  }>;
}

export default function WholesaleRfqPage({ params }: PageProps) {
  const unwrappedParams = use(params);
  const countryParam = unwrappedParams.country.toUpperCase();

  const countryCode =
    countryParam === 'IN'
      ? CountryCode.INDIA
      : countryParam === 'AE'
      ? CountryCode.UAE
      : CountryCode.NEPAL;

  const config = {
    NP: {
      currency: 'NPR',
      symbol: 'रु',
      taxLabel: 'Business PAN / VAT Number',
      taxPlaceholder: 'e.g. PAN 601992819',
    },
    IN: {
      currency: 'INR',
      symbol: '₹',
      taxLabel: 'GSTIN Registration',
      taxPlaceholder: 'e.g. 27AABCS1429B1Z8',
    },
    AE: {
      currency: 'AED',
      symbol: 'AED',
      taxLabel: 'Corporate TRN / Trade License',
      taxPlaceholder: 'e.g. TRN 100488291000003',
    },
  }[countryCode];

  // Sample wholesale products with tiered price tables
  const wholesaleProducts = [
    {
      id: 'ws-001',
      title: 'Universal High-Speed USB-C GaN 65W Fast Chargers (Bulk Export Pack)',
      category: 'Consumer Electronics & Accessories',
      image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600',
      moq: 10,
      leadTimeDays: 7,
      basePrice: countryCode === 'IN' ? 1600 : countryCode === 'AE' ? 70 : 2500,
      tiers: [
        { min: 10, max: 49, discount: 12, price: countryCode === 'IN' ? 1408 : countryCode === 'AE' ? 61.6 : 2200 },
        { min: 50, max: 199, discount: 22, price: countryCode === 'IN' ? 1248 : countryCode === 'AE' ? 54.6 : 1950 },
        { min: 200, max: null, discount: 35, price: countryCode === 'IN' ? 1040 : countryCode === 'AE' ? 45.5 : 1625 },
      ],
    },
    {
      id: 'ws-002',
      title: 'Certified Organic Himalayan Orthodox Tea (Commercial 50kg Drum)',
      category: 'Agriculture & Food Commodities',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600',
      moq: 2,
      leadTimeDays: 14,
      basePrice: countryCode === 'IN' ? 53125 : countryCode === 'AE' ? 2295 : 85000,
      tiers: [
        { min: 2, max: 5, discount: 10, price: countryCode === 'IN' ? 47812 : countryCode === 'AE' ? 2065 : 76500 },
        { min: 6, max: 15, discount: 18, price: countryCode === 'IN' ? 43562 : countryCode === 'AE' ? 1881 : 69700 },
        { min: 16, max: null, discount: 28, price: countryCode === 'IN' ? 38250 : countryCode === 'AE' ? 1652 : 61200 },
      ],
    },
  ];

  // RFQ Modal State
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [businessName, setBusinessName] = useState('');
  const [businessTaxId, setBusinessTaxId] = useState('');
  const [orderQty, setOrderQty] = useState('50');
  const [targetUnitPrice, setTargetUnitPrice] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [rfqResult, setRfqResult] = useState<RfqInquiryResult | null>(null);

  const handleSubmitRfq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !businessTaxId || !orderQty) return;

    const result: RfqInquiryResult = {
      rfqId: `rfq-${Date.now()}`,
      referenceNumber: `RFQ-${countryCode}-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'MATCHING_SUPPLIERS',
      estimatedQuotesCount: 3,
      createdAt: new Date().toISOString(),
    };

    setRfqResult(result);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header currentCountry={countryCode} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-amber-100 text-xs font-semibold uppercase tracking-wider mb-2">
                <span>📦</span> Alibaba-Style B2B Wholesale & Custom Sourcing
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Bulk Tiered Pricing & Custom RFQ Engine
              </h1>
              <p className="text-xs sm:text-sm text-amber-100 mt-2 max-w-2xl leading-relaxed">
                Connect directly with enterprise manufacturers and authorized regional distributors across {countryCode}. Unlock volume discounts, request customized product quotes, and finance bulk shipments with verified escrow protection.
              </p>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 text-center shrink-0 border border-white/20">
              <div className="text-xs uppercase text-amber-100">Wholesale Savings</div>
              <div className="text-2xl font-black text-white mt-1">Up to 35% Off</div>
              <div className="text-[11px] text-amber-200 font-bold mt-1">Official Tax Invoices</div>
            </div>
          </div>
        </div>

        {/* Wholesale Product Showcase */}
        <div className="space-y-8">
          {wholesaleProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Left Column: Image & Lead Time */}
              <div className="space-y-4">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-56 object-cover rounded-2xl border border-slate-100"
                />
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500">Minimum Order:</span>
                    <div className="font-bold text-slate-900">{p.moq} Units</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Typical Lead Time:</span>
                    <div className="font-bold text-slate-900">{p.leadTimeDays} Days Dispatch</div>
                  </div>
                </div>
              </div>

              {/* Right Columns: Title, Tiered Price Brackets, & RFQ Action */}
              <div className="lg:col-span-2 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                    {p.category}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-2">{p.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Standard Base Price: <span className="line-through">{config.symbol} {p.basePrice.toLocaleString()}</span> / unit
                  </p>

                  {/* Volume Tier Table */}
                  <div className="mt-6 border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                    <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider flex justify-between">
                      <span>Volume Order Quantity</span>
                      <span>Discount %</span>
                      <span>Unit Price ({config.currency})</span>
                    </div>
                    <div className="divide-y divide-slate-100 text-xs">
                      {p.tiers.map((tier, idx) => (
                        <div
                          key={idx}
                          className="px-4 py-3 flex items-center justify-between hover:bg-amber-50/50 transition-colors"
                        >
                          <span className="font-bold text-slate-900">
                            {tier.min} {tier.max ? `– ${tier.max} units` : '+ units'}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[11px]">
                            -{tier.discount}% OFF
                          </span>
                          <span className="font-mono font-bold text-slate-900 text-sm">
                            {config.symbol} {tier.price.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="text-xs text-slate-500">
                    Need customized branding or export quantities over 1,000 units?
                  </div>
                  <button
                    onClick={() => {
                      setSelectedProduct(p);
                      setOrderQty(String(p.moq * 5));
                      setTargetUnitPrice(String(p.tiers[1].price));
                      setRfqResult(null);
                    }}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
                  >
                    Request Custom RFQ Quote →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* RFQ Submission Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div>
                <h3 className="text-base font-black text-slate-900">Request for Quotation (RFQ)</h3>
                <p className="text-xs text-slate-500 truncate max-w-xs">{selectedProduct.title}</p>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {rfqResult ? (
              <div className="space-y-4 text-xs">
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950">
                  <div className="font-black text-sm mb-1">🎉 RFQ Lodged Successfully!</div>
                  <div className="font-mono font-bold text-xs mt-1">
                    Tracking Ref: <span className="text-emerald-700">{rfqResult.referenceNumber}</span>
                  </div>
                  <p className="mt-2 text-slate-700 leading-relaxed">
                    Your wholesale inquiry has been dispatched to {rfqResult.estimatedQuotesCount} certified suppliers in {countryCode}. You will receive tailored binding quotations and freight quotes via email within 24 business hours.
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="px-5 py-2 bg-slate-900 text-white rounded-xl font-bold"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitRfq} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Business / Company Name *</label>
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Apex Traders Pvt Ltd"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{config.taxLabel} *</label>
                    <input
                      type="text"
                      required
                      value={businessTaxId}
                      onChange={(e) => setBusinessTaxId(e.target.value)}
                      placeholder={config.taxPlaceholder}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Required Quantity (Units) *</label>
                    <input
                      type="number"
                      required
                      min={selectedProduct.moq}
                      value={orderQty}
                      onChange={(e) => setOrderQty(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Target Unit Price ({config.symbol})
                    </label>
                    <input
                      type="number"
                      value={targetUnitPrice}
                      onChange={(e) => setTargetUnitPrice(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Contact Email *</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="procurement@company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Contact Phone *</label>
                    <input
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+977 / +91 / +971"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Custom Packaging or Freight Requirements</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Specify custom OEM packaging, palletization, or regional delivery warehouse..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-hidden leading-relaxed"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(null)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-md shadow-amber-500/20"
                  >
                    Submit RFQ Inquiry
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
