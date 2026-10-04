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
  const [couponMessage, setCouponMessage] = useState<string | null>(null);

  // Cart state
  const [items, setItems] = useState([
    {
      id: 'v-001-blk',
      title: 'Sony WH-1000XM5 ANC Headphones',
      variant: 'Midnight Black',
      unitPrice: countryCode === 'NP' ? 44999 : countryCode === 'IN' ? 29999 : 1299,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120',
    },
  ]);

  const currencySymbol =
    countryCode === 'NP' ? 'रु' : countryCode === 'IN' ? '₹' : 'AED';

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const total = Math.max(0, subtotal - appliedDiscount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = coupon.toUpperCase().trim();
    if (['DASHAIN2026', 'DIWALI2026', 'RAMADAN2026', 'WELCOME10'].includes(code)) {
      const disc = Math.round(subtotal * 0.1);
      setAppliedDiscount(disc);
      setCouponMessage(`10% Festival Discount Applied (-${currencySymbol} ${disc.toLocaleString()})`);
    } else {
      setCouponMessage('Invalid coupon code. Try DASHAIN2026, DIWALI2026, or RAMADAN2026');
    }
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
        <span>🛒 Cart</span>
        <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
          {items.reduce((sum, i) => sum + i.quantity, 0)}
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between">
            {/* Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Your Shopping Cart</h3>
                <span className="text-xs text-slate-500">
                  {countryCode === 'NP' ? 'Nepal (NPR)' : countryCode === 'IN' ? 'India (INR)' : 'UAE (AED)'} Storefront
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
              {items.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <span className="text-4xl block mb-2">🛒</span>
                  <p className="font-bold text-slate-700">Your cart is empty</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <img src={item.image} alt={item.title} className="w-16 h-16 rounded-xl object-cover border border-slate-200" />
                    <div className="flex-1 min-w-0 text-xs">
                      <span className="font-bold text-slate-900 block truncate">{item.title}</span>
                      <span className="text-slate-400 block text-[11px] mb-2">{item.variant}</span>

                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-blue-600">
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

              {/* Coupon Box */}
              {items.length > 0 && (
                <form onSubmit={handleApplyCoupon} className="pt-2">
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Apply Festival Coupon
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="e.g. DASHAIN2026, DIWALI2026"
                      className="flex-1 px-3 py-1.5 border border-slate-300 rounded-xl text-xs uppercase"
                    />
                    <button type="submit" className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs">
                      Apply
                    </button>
                  </div>
                  {couponMessage && (
                    <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
                      {couponMessage}
                    </span>
                  )}
                </form>
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {items.length > 0 && (
              <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-800">
                    {currencySymbol} {subtotal.toLocaleString()}
                  </span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Coupon Discount</span>
                    <span className="font-bold">
                      -{currencySymbol} {appliedDiscount.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Estimated Total</span>
                  <span className="text-blue-600 font-mono">
                    {currencySymbol} {total.toLocaleString()}
                  </span>
                </div>

                <Link
                  href={`/${countryCode.toLowerCase()}/checkout`}
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md shadow-blue-600/20 text-center block transition-all text-xs"
                >
                  Proceed to Secure Checkout &rarr;
                </Link>

                <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 text-center">
                  <span>🔒 Escrow Protected &bull; Pluggable Gateways</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
