'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CountryCode, OrderStatus, PaymentStatus } from '@dhanshree/shared';
import { Header } from '../../../../components/Header';
import { useResolvedParams } from '@/lib/params';

interface PageProps {
  params: any;
}

export default function OrderTrackingPage({ params }: PageProps) {
  const unwrappedParams = useResolvedParams<{ country: string; orderNumber: string }>(params);
  const countryParam = (unwrappedParams.country || 'np').toUpperCase();
  const orderNumber = unwrappedParams.orderNumber || 'ORD-2026-NP-89211';

  const countryCode =
    countryParam === 'IN'
      ? CountryCode.INDIA
      : countryParam === 'AE'
      ? CountryCode.UAE
      : CountryCode.NEPAL;

  const [activeStep, setActiveStep] = useState<number>(2); // 0: Placed, 1: Paid, 2: Packed/Dispatched, 3: In Transit, 4: Out for Delivery, 5: Delivered
  const [showInvoiceModal, setShowInvoiceModal] = useState<boolean>(false);

  // Localization settings
  const config = {
    NP: {
      currency: 'NPR',
      symbol: 'रु',
      countryName: 'Nepal',
      courier: 'Nepal CanShip & Express Logistics',
      trackingPrefix: 'CAN-NP-',
      taxType: '13% VAT',
      invoiceTitle: 'कर बीजक (VAT Tax Invoice)',
      authority: 'Inland Revenue Department (IRD) Nepal Rule 24 Compliant',
      sellerPan: 'PAN 601992819',
      buyerAddress: 'Ward No. 4, Baluwatar, Kathmandu Metropolitan City, Bagmati Province',
      paymentMethod: 'eSewa Mobile Wallet (Ref: ESW-982103)',
    },
    IN: {
      currency: 'INR',
      symbol: '₹',
      countryName: 'India',
      courier: 'Delhivery Surface Express',
      trackingPrefix: 'DEL-IN-',
      taxType: '18% GST (9% CGST + 9% SGST)',
      invoiceTitle: 'TAX INVOICE (Rule 46 CGST Rules)',
      authority: 'Goods and Services Tax Network (GSTN) E-Invoice Standard',
      sellerPan: 'GSTIN 27AABCS1429B1Z8',
      buyerAddress: 'Flat 402, Sea Green Heights, Bandra West, Mumbai 400050, Maharashtra',
      paymentMethod: 'UPI Instant Transfer (ref: 9281@okhdfcbank)',
    },
    AE: {
      currency: 'AED',
      symbol: 'AED',
      countryName: 'United Arab Emirates',
      courier: 'Aramex Priority Express Dubai',
      trackingPrefix: 'ARX-AE-',
      taxType: '5% Standard VAT',
      invoiceTitle: 'فاتورة ضريبية / TAX INVOICE',
      authority: 'Federal Tax Authority (FTA) Executive Regulation Art. 59',
      sellerPan: 'TRN 100488291000003',
      buyerAddress: 'Tower B, Suite 1204, Downtown Dubai, Makani: 30032 95320, UAE',
      paymentMethod: 'Apple Pay via Stripe (Visa ending in 4242)',
    },
  }[countryCode];

  // Sample order amounts
  const samplePricing = {
    NP: { item: 44999, shipping: 150, tax: 5850, discount: 4500, total: 46499 },
    IN: { item: 29999, shipping: 99, tax: 5400, discount: 3000, total: 32498 },
    AE: { item: 1299, shipping: 25, tax: 65, discount: 130, total: 1259 },
  }[countryCode];

  const steps = [
    { title: 'Order Placed', time: 'Today, 09:30 AM', desc: 'Order received and verified' },
    { title: 'Payment Confirmed', time: 'Today, 09:32 AM', desc: 'Funds secured in Marketplace Escrow' },
    { title: 'Packed & Dispatched', time: 'Today, 01:15 PM', desc: `Handed over to ${config.courier}` },
    { title: 'In Transit', time: 'Estimated Tomorrow', desc: 'Moving between regional sorting hub' },
    { title: 'Out for Delivery', time: 'Estimated in 2 days', desc: 'Assigned to courier delivery rider' },
    { title: 'Delivered', time: 'Estimated in 3 days', desc: '7-day inspection and return window opens' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header currentCountry={countryCode} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb & Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link href={`/${countryCode.toLowerCase()}`} className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <Link href={`/${countryCode.toLowerCase()}/products`} className="hover:text-blue-600">Store</Link>
            <span>/</span>
            <span className="font-semibold text-slate-900">Order #{orderNumber}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowInvoiceModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 shadow-sm transition-all"
            >
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View Official Tax Invoice
            </button>
            <Link
              href={`/${countryCode.toLowerCase()}/products`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-sm transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Success Confirmation Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-emerald-100 text-xs font-semibold uppercase tracking-wider mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
                Live Order Confirmed
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Thank you! Your order #{orderNumber} has been received
              </h1>
              <p className="mt-2 text-emerald-100 text-sm max-w-2xl">
                A localized confirmation with shipment milestones has been sent to your registered email and WhatsApp number.
              </p>
            </div>
            <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center md:min-w-[200px]">
              <div className="text-xs uppercase tracking-wider text-emerald-100 font-medium">Estimated Arrival</div>
              <div className="text-xl sm:text-2xl font-black mt-1">3 Business Days</div>
              <div className="text-xs text-emerald-200 mt-1">Via {config.courier}</div>
            </div>
          </div>
        </div>

        {/* Escrow & Buyer Protection Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 sm:p-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                Marketplace Escrow Protected
                <span className="text-[11px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">Funds Secured</span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Your payment of {config.symbol} {samplePricing.total.toLocaleString()} is securely held in platform escrow. The seller will only be paid 7 days after you receive the item and confirm complete satisfaction.
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <span className="text-xs font-semibold text-blue-700 bg-white border border-blue-200 px-3 py-1.5 rounded-xl shadow-xs">
              7-Day Hassle-Free Returns
            </span>
          </div>
        </div>

        {/* 2-Column Grid: Left Tracking Stepper + Items; Right Summary & Address */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Fulfillment Stepper */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Shipment Status & Milestones</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Carrier AWB: <span className="font-mono font-semibold text-slate-700">{config.trackingPrefix}99821447</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500">Live Carrier Telemetry:</span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    In Transit Hub
                  </span>
                </div>
              </div>

              {/* Stepper Timeline */}
              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-[19px] sm:before:left-[27px] before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                {steps.map((step, idx) => {
                  const isDone = idx < activeStep;
                  const isCurrent = idx === activeStep;
                  return (
                    <div key={idx} className="relative flex items-start gap-4">
                      {/* Step Circle */}
                      <div
                        className={`absolute -left-[30px] sm:-left-[38px] w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                          isDone
                            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                            : isCurrent
                            ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-md shadow-blue-500/30'
                            : 'bg-white border-2 border-slate-300 text-slate-400'
                        }`}
                      >
                        {isDone ? (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          idx + 1
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <h3
                            className={`text-sm font-bold ${
                              isDone || isCurrent ? 'text-slate-900' : 'text-slate-400'
                            }`}
                          >
                            {step.title}
                          </h3>
                          <span className="text-xs font-mono text-slate-500">{step.time}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Telemetry Action Controls */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs text-slate-500">Interactive Simulation: Advance courier delivery milestone</span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={activeStep <= 0}
                    onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                  >
                    Previous Milestone
                  </button>
                  <button
                    disabled={activeStep >= steps.length - 1}
                    onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 disabled:opacity-40 shadow-xs"
                  >
                    Advance Milestone
                  </button>
                </div>
              </div>
            </div>

            {/* Ordered Products Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Items in This Package (1)</h2>
              <div className="divide-y divide-slate-100">
                <div className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=160"
                    alt="Sony WH-1000XM5 ANC Headphones"
                    className="w-20 h-20 rounded-2xl object-cover border border-slate-100 bg-slate-50"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          Sony WH-1000XM5 Wireless Noise Cancelling Headphones
                        </h4>
                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                          <span>Variant: <b className="text-slate-700">Midnight Black</b></span>
                          <span>•</span>
                          <span>SKU: <b className="text-slate-700 font-mono">SNY-XM5-BLK</b></span>
                          <span>•</span>
                          <span>Qty: <b className="text-slate-700">1</b></span>
                        </div>
                        <div className="text-xs text-emerald-600 font-medium mt-1">
                          Fulfilled by Official Flagship Store • 1 Year Warranty Included
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-slate-900">
                          {config.symbol} {samplePricing.item.toLocaleString()}
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">Tax Incl.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary, Shipping & Payment */}
          <div className="space-y-6">
            {/* Price Breakdown Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4">Payment Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Items Subtotal</span>
                  <span className="font-semibold text-slate-900">
                    {config.symbol} {samplePricing.item.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>Festival Discount</span>
                  <span className="font-semibold">
                    -{config.symbol} {samplePricing.discount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping & Delivery ({config.courier})</span>
                  <span className="font-semibold text-slate-900">
                    {config.symbol} {samplePricing.shipping.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Estimated Tax ({config.taxType})</span>
                  <span className="font-semibold text-slate-900">
                    {config.symbol} {samplePricing.tax.toLocaleString()}
                  </span>
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="text-base font-bold text-slate-900">Total Paid</span>
                  <span className="text-xl font-black text-slate-900">
                    {config.symbol} {samplePricing.total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Payment Method</span>
                <span className="font-semibold text-slate-700">{config.paymentMethod}</span>
              </div>
            </div>

            {/* Delivery Address Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-slate-900">Shipping Details</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                  Standard Home
                </span>
              </div>
              <div className="text-xs text-slate-600 space-y-1.5">
                <div className="font-bold text-sm text-slate-900">Manoj Singh</div>
                <div>+977 9801234567 / +971 501234567</div>
                <div className="leading-relaxed text-slate-700 font-medium">
                  {config.buyerAddress}
                </div>
                <div className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mt-2">
                  Country: {config.countryName}
                </div>
              </div>
            </div>

            {/* Support & Need Help */}
            <div className="bg-slate-100 rounded-3xl p-6 border border-slate-200 text-xs text-slate-600">
              <h4 className="font-bold text-slate-900 mb-1">Need Help With This Order?</h4>
              <p className="leading-relaxed">
                Our 24/7 localized support team is available via Live Chat and WhatsApp. You can request cancellation before courier handover or request a return within 7 days of delivery.
              </p>
              <div className="mt-4 flex gap-2">
                <button className="flex-1 py-2 rounded-xl bg-white border border-slate-300 font-semibold text-slate-800 hover:bg-slate-50 text-center">
                  Chat With Support
                </button>
                <button className="flex-1 py-2 rounded-xl bg-white border border-slate-300 font-semibold text-slate-800 hover:bg-slate-50 text-center">
                  Return Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Tax Compliant Bilingual Invoice Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-black text-slate-900">{config.invoiceTitle}</h3>
                <span className="text-xs text-slate-500 font-medium">{config.authority}</span>
              </div>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Printable Invoice Body */}
            <div className="mt-6 space-y-6 text-xs text-slate-800 font-sans">
              {/* Top Seller & Buyer Info */}
              <div className="grid grid-cols-2 gap-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="font-bold uppercase text-[10px] text-slate-400 mb-1">Supplier / Seller</div>
                  <div className="font-bold text-slate-900 text-sm">Dhanshree Global Sellers Ltd.</div>
                  <div>Tax Identifier: <b className="font-mono">{config.sellerPan}</b></div>
                  <div>Registration Office: Central Business District, {config.countryName}</div>
                  <div>VAT / GST Registered Taxpayer</div>
                </div>
                <div>
                  <div className="font-bold uppercase text-[10px] text-slate-400 mb-1">Billed To (Customer)</div>
                  <div className="font-bold text-slate-900 text-sm">Manoj Singh</div>
                  <div>Invoice No: <b className="font-mono">INV-2026-{countryCode}-00481</b></div>
                  <div>Order Reference: <b className="font-mono">{orderNumber}</b></div>
                  <div>Invoice Date: <b className="font-mono">{new Date().toISOString().split('T')[0]}</b></div>
                  <div>Destination: {config.countryName}</div>
                </div>
              </div>

              {/* Line Items Table */}
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-200 text-slate-500 uppercase text-[10px]">
                    <th className="py-2">Description</th>
                    <th className="py-2 text-center">HSN/Code</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Unit Price</th>
                    <th className="py-2 text-right">Tax Rate</th>
                    <th className="py-2 text-right">Net Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 font-semibold text-slate-900">
                      Sony WH-1000XM5 Wireless Noise Cancelling Headphones
                      <div className="text-[10px] text-slate-500 font-normal">Color: Midnight Black</div>
                    </td>
                    <td className="py-3 text-center font-mono">85183000</td>
                    <td className="py-3 text-center">1</td>
                    <td className="py-3 text-right font-mono">
                      {config.symbol} {samplePricing.item.toLocaleString()}
                    </td>
                    <td className="py-3 text-right font-mono">{config.taxType}</td>
                    <td className="py-3 text-right font-mono font-bold text-slate-900">
                      {config.symbol} {(samplePricing.item - samplePricing.discount).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Calculations */}
              <div className="flex justify-end">
                <div className="w-64 space-y-1.5 text-right">
                  <div className="flex justify-between text-slate-500">
                    <span>Taxable Subtotal:</span>
                    <span className="font-mono">{config.symbol} {(samplePricing.item - samplePricing.discount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Tax Amount ({config.taxType}):</span>
                    <span className="font-mono">{config.symbol} {samplePricing.tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Delivery Charge:</span>
                    <span className="font-mono">{config.symbol} {samplePricing.shipping.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t-2 border-slate-900 font-bold text-sm text-slate-900">
                    <span>Total Payable:</span>
                    <span className="font-mono">{config.symbol} {samplePricing.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Regulatory Declaration */}
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
                <b>Tax Declaration:</b> This is a digitally signed computer-generated tax invoice compliant with the statutory regulations of {config.countryName}. E-way Bill and carrier clearance documents have been automatically lodged.
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 shadow-sm"
              >
                Print / Save PDF
              </button>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
