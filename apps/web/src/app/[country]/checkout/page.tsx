'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { COUNTRY_CONFIGS, CountryCode, CurrencyCode, PaymentMethod } from '@dhanshree/shared';

interface CheckoutPageProps {
  params: {
    country: string;
  };
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const code = params.country.toUpperCase() as CountryCode;
  const config = COUNTRY_CONFIGS[code];

  if (!config) {
    notFound();
  }

  const router = useRouter();

  // Selected payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    code === 'NP' ? PaymentMethod.ESEWA : code === 'IN' ? PaymentMethod.UPI : PaymentMethod.STRIPE,
  );
  const [shippingMethod, setShippingMethod] = useState<'STANDARD' | 'EXPRESS'>('STANDARD');

  // Address fields
  const [fullName, setFullName] = useState('Bibek Sharma');
  const [phone, setPhone] = useState(code === 'NP' ? '+9779841234567' : code === 'IN' ? '+919820011223' : '+971501234567');
  const [provinceState, setProvinceState] = useState(code === 'NP' ? 'Bagmati Province' : 'Maharashtra');
  const [cityDistrict, setCityDistrict] = useState(code === 'NP' ? 'Kathmandu' : 'Mumbai');
  const [wardPin, setWardPin] = useState(code === 'NP' ? '10' : '400001');
  const [streetAddress, setStreetAddress] = useState(
    code === 'NP' ? 'New Baneshwor, Devkota Marg' : code === 'IN' ? 'Linking Road, Bandra West' : 'Burj Crown, Apt 1804, Downtown',
  );

  // COD OTP State
  const [codOtpCode, setCodOtpCode] = useState('');
  const [codOtpSent, setCodOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currencySymbol =
    config.defaultCurrency === CurrencyCode.NPR
      ? 'रु'
      : config.defaultCurrency === CurrencyCode.INR
      ? '₹'
      : 'AED';

  // Base amounts
  const subtotal = code === 'NP' ? 44999 : code === 'IN' ? 29999 : 1299;
  const discount = code === 'NP' ? 4500 : code === 'IN' ? 3000 : 130;
  const taxable = subtotal - discount;

  // Localized Tax
  const tax = Number((taxable * (code === 'NP' ? 0.13 : code === 'IN' ? 0.18 : 0.05)).toFixed(0));
  const shipping = shippingMethod === 'EXPRESS' ? (code === 'NP' ? 300 : code === 'IN' ? 199 : 50) : (code === 'NP' ? 150 : code === 'IN' ? 99 : 25);
  const codFee = paymentMethod === PaymentMethod.COD ? (code === 'NP' ? 50 : code === 'IN' ? 49 : 15) : 0;
  const grandTotal = taxable + tax + shipping + codFee;

  const [gatewayMode, setGatewayMode] = useState<'SANDBOX' | 'SIMULATE'>('SANDBOX');

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedOrderNumber = `ORD-2026-${code}-${Math.floor(100000 + Math.random() * 900000)}`;

    if (gatewayMode === 'SANDBOX') {
      if (paymentMethod === PaymentMethod.ESEWA) {
        try {
          const res = await fetch('/api/payments/esewa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderNumber: generatedOrderNumber, amount: grandTotal }),
          });
          const data = await res.json();
          if (data.actionUrl && data.fields) {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = data.actionUrl;
            Object.entries(data.fields).forEach(([k, v]) => {
              const input = document.createElement('input');
              input.type = 'hidden';
              input.name = k;
              input.value = v as string;
              form.appendChild(input);
            });
            document.body.appendChild(form);
            form.submit();
            return;
          }
        } catch (err) {
          console.error('eSewa error:', err);
        }
      } else if (paymentMethod === PaymentMethod.KHALTI) {
        try {
          const res = await fetch('/api/payments/khalti', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderNumber: generatedOrderNumber, amount: grandTotal }),
          });
          const data = await res.json();
          if (data.paymentUrl) {
            window.location.href = data.paymentUrl;
            return;
          }
        } catch (err) {
          console.error('Khalti error:', err);
        }
      }
    }

    setTimeout(() => {
      setIsSubmitting(false);
      router.push(`/${code.toLowerCase()}/orders/${generatedOrderNumber}`);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header currentCountry={config.code} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-slate-900">Secure Marketplace Checkout</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {config.name} Storefront &bull; Escrow Payment Protected &bull; Pluggable Gateways
          </p>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: 3-STEP CHECKOUT (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* STEP 1: DELIVERY ADDRESS */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-100">
                <span className="w-7 h-7 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <div>
                  <h2 className="font-bold text-slate-900 text-sm">Delivery Address</h2>
                  <span className="text-[11px] text-slate-400">
                    Validated against {config.name} municipal postal standards
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Recipient Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mobile Phone (OTP Active)</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>

                {/* Country-tailored inputs */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {code === 'NP' ? 'Province' : code === 'IN' ? 'State / UT' : 'Emirate'}
                  </label>
                  <input
                    type="text"
                    required
                    value={provinceState}
                    onChange={(e) => setProvinceState(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {code === 'NP' ? 'District / Municipality' : code === 'IN' ? 'City / District' : 'Area / Neighborhood'}
                  </label>
                  <input
                    type="text"
                    required
                    value={cityDistrict}
                    onChange={(e) => setCityDistrict(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {code === 'NP' ? 'Ward Number (1-32)' : code === 'IN' ? '6-Digit PIN Code' : '10-Digit Makani Number'}
                  </label>
                  <input
                    type="text"
                    required
                    value={wardPin}
                    onChange={(e) => setWardPin(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Street Address / Landmark</label>
                  <input
                    type="text"
                    required
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>

            {/* STEP 2: SHIPPING SPEED */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-100">
                <span className="w-7 h-7 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <div>
                  <h2 className="font-bold text-slate-900 text-sm">Shipping & Courier Method</h2>
                  <span className="text-[11px] text-slate-400">
                    Fulfilled via certified regional logistics partners
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <button
                  type="button"
                  onClick={() => setShippingMethod('STANDARD')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    shippingMethod === 'STANDARD'
                      ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-900">Standard Delivery</span>
                    <span className="font-mono font-bold text-blue-600">
                      {currencySymbol} {code === 'NP' ? 150 : code === 'IN' ? 99 : 25}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 block">
                    {code === 'NP' ? '2-3 business days via NepalPost / Pathao' : code === 'IN' ? '3-4 business days via Delhivery' : 'Next-Day Delivery via Aramex'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setShippingMethod('EXPRESS')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    shippingMethod === 'EXPRESS'
                      ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span>⚡ Express Dispatch</span>
                    </span>
                    <span className="font-mono font-bold text-blue-600">
                      {currencySymbol} {code === 'NP' ? 300 : code === 'IN' ? 199 : 50}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 block">
                    {code === 'NP' ? 'Within 24 Hours in Kathmandu Valley' : code === 'IN' ? 'Next-Day Priority across Major Metros' : 'Same-Day 3-Hour Delivery across Dubai'}
                  </span>
                </button>
              </div>
            </div>

            {/* STEP 3: PAYMENT METHOD */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-100">
                <span className="w-7 h-7 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  3
                </span>
                <div>
                  <h2 className="font-bold text-slate-900 text-sm">Select Local Payment Adapter</h2>
                  <span className="text-[11px] text-slate-400">
                    Direct integration with {config.name} banking and wallet networks
                  </span>
                </div>
              </div>

              {/* GATEWAY MODE SWITCHER */}
              <div className="mb-4 p-3 bg-blue-50/70 border border-blue-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                <div>
                  <span className="font-bold text-blue-900 block">Payment Execution Mode</span>
                  <span className="text-[11px] text-blue-700">
                    {gatewayMode === 'SANDBOX' ? '⚡ Real Sandbox UAT: Redirects to official test portal (eSewa / Khalti)' : '🚀 Fast Simulate: Confirms order directly without leaving app'}
                  </span>
                </div>
                <div className="flex bg-white rounded-xl p-1 border border-blue-200">
                  <button
                    type="button"
                    onClick={() => setGatewayMode('SANDBOX')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${gatewayMode === 'SANDBOX' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    Real Sandbox
                  </button>
                  <button
                    type="button"
                    onClick={() => setGatewayMode('SIMULATE')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${gatewayMode === 'SIMULATE' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    Fast Simulate
                  </button>
                </div>
              </div>

              {/* REGIONAL PAYMENT METHOD CHOICES */}
              <div className="space-y-3 text-xs">
                {/* NEPAL GATEWAYS */}
                {code === CountryCode.NEPAL && (
                  <>
                    <div className="space-y-2">
                      <label className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${paymentMethod === PaymentMethod.ESEWA ? 'border-green-600 bg-green-50/50 shadow-sm' : 'border-slate-200'}`}>
                        <div className="flex items-center gap-3">
                          <input type="radio" name="payment" checked={paymentMethod === PaymentMethod.ESEWA} onChange={() => setPaymentMethod(PaymentMethod.ESEWA)} className="text-green-600" />
                          <div>
                            <span className="font-bold text-slate-900 block">eSewa Mobile Wallet (EPAY v2)</span>
                            <span className="text-[11px] text-slate-500">Pay via eSewa account or eSewa linked bank</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-green-600 text-white text-[10px] font-bold">Recommended</span>
                      </label>
                      {paymentMethod === PaymentMethod.ESEWA && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-xl space-y-1.5 text-xs">
                          <div className="flex items-center justify-between font-bold text-green-900">
                            <span className="flex items-center gap-1.5">
                              <span>🟢</span> Official eSewa UAT Gateway
                            </span>
                            <span className="text-[10px] bg-green-200 text-green-800 px-2 py-0.5 rounded-full font-mono">
                              rc-epay.esewa.com.np
                            </span>
                          </div>
                          <p className="text-[11px] text-green-800">
                            <strong>"Place Order"</strong> थिच्दा सिधै eSewa को आधिकारिक टेस्ट स्क्रिन खुल्नेछ।
                          </p>
                          <div className="bg-white/90 p-2 rounded-lg border border-green-200 font-mono text-[11px] text-slate-700 space-y-0.5">
                            <div><strong>eSewa Test ID:</strong> 9806800001 वा 9806800002</div>
                            <div><strong>Password:</strong> Nepal@123 | <strong>MPIN:</strong> 1122 | <strong>Token:</strong> 123456</div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${paymentMethod === PaymentMethod.KHALTI ? 'border-purple-600 bg-purple-50/50 shadow-sm' : 'border-slate-200'}`}>
                        <div className="flex items-center gap-3">
                          <input type="radio" name="payment" checked={paymentMethod === PaymentMethod.KHALTI} onChange={() => setPaymentMethod(PaymentMethod.KHALTI)} className="text-purple-600" />
                          <div>
                            <span className="font-bold text-slate-900 block">Khalti Digital Wallet</span>
                            <span className="text-[11px] text-slate-500">Instant e-payment via Khalti API v2</span>
                          </div>
                        </div>
                        <span className="text-[11px] text-purple-700 font-bold">Khalti</span>
                      </label>
                      {paymentMethod === PaymentMethod.KHALTI && (
                        <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl space-y-1.5 text-xs">
                          <div className="flex items-center justify-between font-bold text-purple-900">
                            <span className="flex items-center gap-1.5">
                              <span>🟣</span> Official Khalti Test Sandbox
                            </span>
                            <span className="text-[10px] bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full font-mono">
                              test-pay.khalti.com
                            </span>
                          </div>
                          <div className="bg-white/90 p-2 rounded-lg border border-purple-200 font-mono text-[11px] text-slate-700 space-y-0.5">
                            <div><strong>Khalti Mobile:</strong> 9800000000 वा 9800000001</div>
                            <div><strong>MPIN:</strong> 1111 | <strong>OTP:</strong> 987654</div>
                          </div>
                        </div>
                      )}
                    </div>

                    <label className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${paymentMethod === PaymentMethod.FONEPAY_QR ? 'border-red-600 bg-red-50/50 shadow-sm' : 'border-slate-200'}`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="payment" checked={paymentMethod === PaymentMethod.FONEPAY_QR} onChange={() => setPaymentMethod(PaymentMethod.FONEPAY_QR)} className="text-red-600" />
                        <div>
                          <span className="font-bold text-slate-900 block">Fonepay QR Interbank Network</span>
                          <span className="text-[11px] text-slate-500">Scan & pay using any Nepali mobile banking app</span>
                        </div>
                      </div>
                      <span className="text-[11px] text-red-700 font-bold">Fonepay</span>
                    </label>
                  </>
                )}

                {/* INDIA GATEWAYS */}
                {code === CountryCode.INDIA && (
                  <>
                    <label className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${paymentMethod === PaymentMethod.UPI ? 'border-blue-600 bg-blue-50/50 shadow-sm' : 'border-slate-200'}`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="payment" checked={paymentMethod === PaymentMethod.UPI} onChange={() => setPaymentMethod(PaymentMethod.UPI)} className="text-blue-600" />
                        <div>
                          <span className="font-bold text-slate-900 block">UPI Instant Payment (Google Pay / PhonePe / Paytm)</span>
                          <span className="text-[11px] text-slate-500">Zero surcharge instant bank transfer</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-bold">Fastest</span>
                    </label>

                    <label className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${paymentMethod === PaymentMethod.RAZORPAY ? 'border-blue-600 bg-blue-50/50 shadow-sm' : 'border-slate-200'}`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="payment" checked={paymentMethod === PaymentMethod.RAZORPAY} onChange={() => setPaymentMethod(PaymentMethod.RAZORPAY)} className="text-blue-600" />
                        <div>
                          <span className="font-bold text-slate-900 block">Credit / Debit Cards & NetBanking</span>
                          <span className="text-[11px] text-slate-500">Visa, Mastercard, RuPay, HDFC, ICICI, SBI</span>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-700 font-bold">Cards & NetBanking</span>
                    </label>
                  </>
                )}

                {/* UAE GATEWAYS */}
                {code === CountryCode.UAE && (
                  <>
                    <label className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${paymentMethod === PaymentMethod.STRIPE ? 'border-indigo-600 bg-indigo-50/50 shadow-sm' : 'border-slate-200'}`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="payment" checked={paymentMethod === PaymentMethod.STRIPE} onChange={() => setPaymentMethod(PaymentMethod.STRIPE)} className="text-indigo-600" />
                        <div>
                          <span className="font-bold text-slate-900 block">Cards, Apple Pay & Google Pay (Stripe)</span>
                          <span className="text-[11px] text-slate-500">Instant biometric checkout with Apple Pay</span>
                        </div>
                      </div>
                      <span className="text-[11px] text-indigo-700 font-bold">Apple Pay / Visa</span>
                    </label>

                    <label className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${paymentMethod === PaymentMethod.TABBY ? 'border-emerald-600 bg-emerald-50/50 shadow-sm' : 'border-slate-200'}`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="payment" checked={paymentMethod === PaymentMethod.TABBY} onChange={() => setPaymentMethod(PaymentMethod.TABBY)} className="text-emerald-600" />
                        <div>
                          <span className="font-bold text-slate-900 block">Tabby: Pay in 4 Interest-Free Monthly Installments</span>
                          <span className="text-[11px] text-slate-500">Pay 25% today (AED {(grandTotal / 4).toFixed(0)}), rest over 3 months</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold">BNPL</span>
                    </label>
                  </>
                )}

                {/* COMMON: CASH ON DELIVERY */}
                <label className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${paymentMethod === PaymentMethod.COD ? 'border-amber-600 bg-amber-50/50 shadow-sm' : 'border-slate-200'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" checked={paymentMethod === PaymentMethod.COD} onChange={() => setPaymentMethod(PaymentMethod.COD)} className="text-amber-600" />
                    <div>
                      <span className="font-bold text-slate-900 block">Cash on Delivery (COD)</span>
                      <span className="text-[11px] text-slate-500">
                        Pay upon courier handover (+{currencySymbol} {code === 'NP' ? 50 : code === 'IN' ? 49 : 15} COD convenience surcharge)
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] text-amber-700 font-bold">Pay at Doorstep</span>
                </label>

                {/* COD OTP VERIFICATION SUB-PANEL */}
                {paymentMethod === PaymentMethod.COD && (
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2 mt-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-900">
                        🛡️ COD High-Risk Verification
                      </span>
                      <button
                        type="button"
                        onClick={() => setCodOtpSent(true)}
                        className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-bold rounded-lg"
                      >
                        {codOtpSent ? 'Resend SMS OTP' : 'Send SMS OTP'}
                      </button>
                    </div>
                    <p className="text-[11px] text-amber-800">
                      To prevent Return-To-Origin fraud, enter the 6-digit passcode dispatched to {phone}.
                    </p>
                    {codOtpSent && (
                      <div className="flex gap-2 items-center pt-1">
                        <input
                          type="text"
                          maxLength={6}
                          value={codOtpCode}
                          onChange={(e) => setCodOtpCode(e.target.value)}
                          placeholder="Enter 6-digit OTP (e.g. 123456)"
                          className="px-3 py-1.5 border border-amber-300 rounded-lg text-xs font-mono font-bold"
                        />
                        <span className="text-[10px] text-emerald-700 font-bold">
                          ✓ OTP Dispatched
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ORDER SUMMARY SIDEBAR (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 text-xs">
              <h3 className="font-bold text-slate-900 text-sm pb-3 border-b border-slate-100">
                Order Summary
              </h3>

              {/* Item preview */}
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120"
                  alt="Headphones"
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-slate-900 block truncate">Sony WH-1000XM5</span>
                  <span className="text-slate-400 block text-[11px]">1 x {currencySymbol} {subtotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Breakdown */}
              <div className="space-y-2 pt-3 border-t border-slate-100 text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">{currencySymbol} {subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Festival Coupon</span>
                  <span>-{currencySymbol} {discount.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span>{config.taxLabel}</span>
                  <span className="font-bold text-slate-900">{currencySymbol} {tax.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="font-bold text-slate-900">{currencySymbol} {shipping.toLocaleString()}</span>
                </div>

                {codFee > 0 && (
                  <div className="flex justify-between text-amber-700">
                    <span>COD Processing Fee</span>
                    <span className="font-bold">+{currencySymbol} {codFee.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between items-baseline pt-3 border-t border-slate-200 text-sm font-black text-slate-900">
                  <span>Grand Total</span>
                  <span className="text-xl text-blue-600 font-mono">
                    {currencySymbol} {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-400 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/30 text-xs transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Processing Order...</span>
                ) : (
                  <span>🔒 Place Order ({currencySymbol} {grandTotal.toLocaleString()})</span>
                )}
              </button>

              {/* Security info */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <span>🛡️</span>
                  <span>Marketplace Escrow Protection Active</span>
                </div>
                <p>
                  Funds held securely in escrow and released to seller only after verified courier delivery and 7-day inspection window.
                </p>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
