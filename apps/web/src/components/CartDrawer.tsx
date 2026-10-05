'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CountryCode, CurrencyCode } from '@dhanshree/shared';

interface CartDrawerProps {
  countryCode?: CountryCode;
}

export function CartDrawer({ countryCode = CountryCode.NEPAL }: CartDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);

  // Cart state with festive and regular items
  const [items, setItems] = useState([
    {
      id: 'v-001-festive',
      title: 'भाइटिका प्रिमियम ओखर, काजु र बदाम उपहार प्याक (Bhai Masala)',
      variant: '1 KG Festive Gift Box',
      unitPrice: countryCode === 'NP' ? 2450 : countryCode === 'IN' ? 1550 : 75,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=120',
    },
    {
      id: 'v-002-dhaka',
      title: 'अन्तर्राष्ट्रिय गुणस्तर पाल्पाली ढाका टोपी तथा खादा सेट',
      variant: 'Handloom Classic Maroon',
      unitPrice: countryCode === 'NP' ? 1200 : countryCode === 'IN' ? 750 : 35,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1607344645866-009c320b5ab8?w=120',
    },
  ]);

  const currencySymbol =
    countryCode === 'NP' ? 'रु' : countryCode === 'IN' ? '₹' : 'AED';

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const total = Math.max(0, subtotal - appliedDiscount);

  const applyCode = (rawCode: string) => {
    const code = rawCode.toUpperCase().trim();
    if (code === 'DASHAIN2026') {
      const disc = Math.round(subtotal * 0.2);
      setAppliedDiscount(disc);
      setAppliedCouponCode('DASHAIN2026');
      setCouponMessage(`दशैँ २०% महाबचत छुट लागू भयो (-${currencySymbol} ${disc.toLocaleString()})!`);
    } else if (code === 'TIHAR500') {
      const flatDisc = countryCode === 'NP' ? 500 : countryCode === 'IN' ? 350 : 15;
      const disc = Math.min(subtotal, flatDisc);
      setAppliedDiscount(disc);
      setAppliedCouponCode('TIHAR500');
      setCouponMessage(`तिहार विशेष रु ५०० फ्ल्याट छुट लागू भयो (-${currencySymbol} ${disc.toLocaleString()})!`);
    } else if (code === 'CHHATH20') {
      const disc = Math.round(subtotal * 0.2);
      setAppliedDiscount(disc);
      setAppliedCouponCode('CHHATH20');
      setCouponMessage(`छठ पूजा २०% क्यासब्याक छुट लागू भयो (-${currencySymbol} ${disc.toLocaleString()})!`);
    } else if (['DIWALI2026', 'WELCOME10'].includes(code)) {
      const disc = Math.round(subtotal * 0.1);
      setAppliedDiscount(disc);
      setAppliedCouponCode(code);
      setCouponMessage(`१०% चाडपर्व छुट लागू भयो (-${currencySymbol} ${disc.toLocaleString()})!`);
    } else {
      setCouponMessage('अमान्य कूपन कोड। DASHAIN2026, TIHAR500, वा CHHATH20 प्रयोग गर्नुहोस्।');
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    applyCode(coupon);
  };

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as any,
    );
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
      >
        <span>🛒 कार्ट</span>
        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">
          {items.reduce((sum, i) => sum + i.quantity, 0)}
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between">
            {/* Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-1.5">
                  <span>🛒 किनमेल कार्ट</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200">
                    चाडपर्व बजार
                  </span>
                </h3>
                <span className="text-xs text-slate-500">
                  {countryCode === 'NP' ? 'नेपाल (NPR) स्टोर' : countryCode === 'IN' ? 'भारत (INR) स्टोर' : 'दुबई UAE (AED) स्टोर'}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm"
              >
                &times;
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Festive Free Shipping Progress Bar */}
              <div className="p-3 bg-gradient-to-r from-amber-50 to-red-50 rounded-xl border border-amber-200/80 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-amber-900 flex items-center gap-1">
                    <span>🚚</span> चाडपर्व निशुल्क डेलिभरी
                  </span>
                  <span className="text-[11px] font-extrabold text-emerald-700">
                    {subtotal >= 2500 ? '✓ निशुल्क डेलिभरी सक्रिय!' : `${currencySymbol} ${Math.max(0, 2500 - subtotal).toLocaleString()} बाँकी`}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-rose-600 h-1.5 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (subtotal / 2500) * 100)}%` }}
                  />
                </div>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <span className="text-4xl block mb-2">🛒</span>
                  <p className="font-bold text-slate-700">तपाईंको कार्ट खाली छ</p>
                  <p className="text-xs text-slate-400 mt-1">चाडपर्वका विशेष अफरहरू हेर्नुहोस्!</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <img src={item.image} alt={item.title} className="w-16 h-16 rounded-xl object-cover border border-slate-200" />
                    <div className="flex-1 min-w-0 text-xs">
                      <span className="font-bold text-slate-900 block truncate">{item.title}</span>
                      <span className="text-slate-400 block text-[11px] mb-2">{item.variant}</span>

                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-rose-600">
                          {currencySymbol} {(item.unitPrice * item.quantity).toLocaleString()}
                        </span>

                        <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 px-2 py-0.5">
                          <button onClick={() => updateQty(item.id, -1)} className="font-bold text-slate-500 hover:text-slate-900">
                            -
                          </button>
                          <span className="font-bold text-slate-900 px-1">{item.quantity}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="font-bold text-slate-500 hover:text-slate-900">
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Coupon Box & Quick Festive Chips */}
              {items.length > 0 && (
                <div className="pt-2">
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    चाडपर्व कूपन कोड (Festival Coupon)
                  </label>
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="e.g. DASHAIN2026, TIHAR500"
                      className="flex-1 px-3 py-1.5 border border-slate-300 rounded-xl text-xs uppercase"
                    />
                    <button type="submit" className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs">
                      Apply
                    </button>
                  </form>

                  {/* 1-Click Festive Coupon Chips */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCoupon('DASHAIN2026');
                        applyCode('DASHAIN2026');
                      }}
                      className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-[10px] font-bold"
                    >
                      🏷️ DASHAIN2026 (२०% छुट)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCoupon('TIHAR500');
                        applyCode('TIHAR500');
                      }}
                      className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-[10px] font-bold"
                    >
                      🪔 TIHAR500 (रु ५०० छुट)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCoupon('CHHATH20');
                        applyCode('CHHATH20');
                      }}
                      className="px-2 py-1 bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 rounded-lg text-[10px] font-bold"
                    >
                      ☀️ CHHATH20 (२०% क्यासब्याक)
                    </button>
                  </div>

                  {couponMessage && (
                    <span className="text-[11px] text-emerald-700 font-bold block mt-2 p-1.5 bg-emerald-50 rounded-lg border border-emerald-200">
                      {couponMessage}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {items.length > 0 && (
              <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal (उप-जम्मा)</span>
                  <span className="font-bold text-slate-800">
                    {currencySymbol} {subtotal.toLocaleString()}
                  </span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>चाडपर्व कूपन छुट ({appliedCouponCode})</span>
                    <span>
                      -{currencySymbol} {appliedDiscount.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>कुल भुक्तानी (Total)</span>
                  <span className="text-rose-600 font-mono">
                    {currencySymbol} {total.toLocaleString()}
                  </span>
                </div>

                <Link
                  href={`/${countryCode.toLowerCase()}/checkout`}
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-700/20 text-center block transition-all text-xs active:scale-[0.98]"
                >
                  सुरक्षित भुक्तानी (Proceed to Checkout) &rarr;
                </Link>

                <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 text-center">
                  <span>🔒 Escrow सुरक्षित • eSewa, Khalti, COD, Cards उपलब्ध</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
