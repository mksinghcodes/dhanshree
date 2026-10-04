'use client';

import React, { useState } from 'react';
import { CountryCode, CurrencyCode, calculateItemTax } from '@dhanshree/shared';

export function TaxCalculatorModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [country, setCountry] = useState<CountryCode>(CountryCode.NEPAL);
  const [amount, setAmount] = useState<number>(10000);
  const [sellerState, setSellerState] = useState<string>('Maharashtra');
  const [buyerState, setBuyerState] = useState<string>('Maharashtra');
  const [hsnCode, setHsnCode] = useState<string>('8517.13');

  const result = calculateItemTax({
    countryCode: country,
    amount,
    sellerState,
    buyerState,
    hsnCode,
    trnNumber: country === CountryCode.UAE ? '100234567800003' : undefined,
  });

  const currencySymbol =
    country === CountryCode.NEPAL ? 'रु' : country === CountryCode.INDIA ? '₹' : 'AED';

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
      >
        <span>⚡ Test Local Tax Engine</span>
        <span className="text-[10px] bg-emerald-700/80 px-2 py-0.5 rounded-full font-mono">
          Live VAT / GST
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Localized Tax Engine Calculator
                </h3>
                <p className="text-xs text-slate-500">
                  Simulating Phase 2 Multi-Country Tax Rules
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm"
              >
                &times;
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              {/* Country Selection */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5 uppercase tracking-wider">
                  Target Storefront Country
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { code: CountryCode.NEPAL, name: 'Nepal 🇳🇵', sub: '13% VAT' },
                    { code: CountryCode.INDIA, name: 'India 🇮🇳', sub: 'GST (Intra/Inter)' },
                    { code: CountryCode.UAE, name: 'UAE 🇦🇪', sub: '5% VAT (TRN)' },
                  ].map((c) => (
                    <button
                      key={c.code}
                      onClick={() => setCountry(c.code)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        country === c.code
                          ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold'
                          : 'border-slate-200 bg-slate-50 text-slate-600'
                      }`}
                    >
                      <span className="block font-bold">{c.name}</span>
                      <span className="text-[10px] text-slate-400 block">{c.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount input */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Taxable Item Value ({currencySymbol})
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* India-specific controls */}
              {country === CountryCode.INDIA && (
                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 space-y-2">
                  <span className="font-bold text-amber-900 block text-[11px]">
                    India GST Interstate vs Intrastate Config
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-600 block">Seller State</label>
                      <input
                        type="text"
                        value={sellerState}
                        onChange={(e) => setSellerState(e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-600 block">Buyer Delivery State</label>
                      <input
                        type="text"
                        value={buyerState}
                        onChange={(e) => setBuyerState(e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 block">HSN / SAC Code</label>
                    <input
                      type="text"
                      value={hsnCode}
                      onChange={(e) => setHsnCode(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Result Breakdown */}
              <div className="mt-4 p-4 rounded-xl bg-slate-900 text-white space-y-2">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Tax Policy Category:</span>
                  <span className="font-mono text-emerald-400 font-bold">{result.taxType}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Standard Rate:</span>
                  <span className="font-bold text-slate-200">{result.ratePercent}%</span>
                </div>

                {/* Localized Breakdown Rows */}
                {result.breakdown.nepalVatAmount !== undefined && (
                  <div className="flex justify-between items-center text-slate-300 border-t border-slate-800 pt-2">
                    <span>Nepal VAT (13%):</span>
                    <span className="font-mono font-bold text-white">
                      रु {result.breakdown.nepalVatAmount.toLocaleString()}
                    </span>
                  </div>
                )}

                {result.breakdown.cgstAmount !== undefined && (
                  <>
                    <div className="flex justify-between items-center text-slate-300 border-t border-slate-800 pt-2">
                      <span>CGST ({result.breakdown.cgstPercent}%):</span>
                      <span className="font-mono font-bold text-white">
                        ₹ {result.breakdown.cgstAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-slate-300">
                      <span>SGST ({result.breakdown.sgstPercent}%):</span>
                      <span className="font-mono font-bold text-white">
                        ₹ {result.breakdown.sgstAmount?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-amber-300/90 text-[11px]">
                      <span>1% Section 52 TCS (Marketplace):</span>
                      <span className="font-mono">
                        ₹ {result.breakdown.indiaTcsAmount?.toLocaleString()}
                      </span>
                    </div>
                  </>
                )}

                {result.breakdown.igstAmount !== undefined && (
                  <>
                    <div className="flex justify-between items-center text-slate-300 border-t border-slate-800 pt-2">
                      <span>Interstate IGST ({result.breakdown.igstPercent}%):</span>
                      <span className="font-mono font-bold text-white">
                        ₹ {result.breakdown.igstAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-amber-300/90 text-[11px]">
                      <span>1% Section 52 TCS (Marketplace):</span>
                      <span className="font-mono">
                        ₹ {result.breakdown.indiaTcsAmount?.toLocaleString()}
                      </span>
                    </div>
                  </>
                )}

                {result.breakdown.uaeVatAmount !== undefined && (
                  <div className="flex justify-between items-center text-slate-300 border-t border-slate-800 pt-2">
                    <span>UAE 5% VAT (TRN: {result.breakdown.trnNumber}):</span>
                    <span className="font-mono font-bold text-white">
                      AED {result.breakdown.uaeVatAmount.toLocaleString()}
                    </span>
                  </div>
                )}

                {/* Total */}
                <div className="flex justify-between items-center border-t border-slate-700 pt-3 text-sm">
                  <span className="font-bold text-white">Total with Local Tax:</span>
                  <span className="font-bold text-emerald-400 font-mono text-base">
                    {currencySymbol} {(amount + result.totalTax).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl"
              >
                Close Calculator
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
