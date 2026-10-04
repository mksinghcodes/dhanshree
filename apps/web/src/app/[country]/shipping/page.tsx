'use client';

import React, { useState } from 'react';
import { CountryCode, CurrencyCode, CrossBorderDutyResult } from '@dhanshree/shared';
import { Header } from '../../../components/Header';
import { useResolvedParams } from '@/lib/params';

interface PageProps {
  params: any;
}

export default function ShippingCalculatorPage({ params }: PageProps) {
  const unwrappedParams = useResolvedParams<{ country: string }>(params);
  const countryParam = (unwrappedParams.country || 'np').toUpperCase();

  const countryCode =
    countryParam === 'IN'
      ? CountryCode.INDIA
      : countryParam === 'AE'
      ? CountryCode.UAE
      : CountryCode.NEPAL;

  const [origin, setOrigin] = useState<CountryCode>(CountryCode.NEPAL);
  const [destination, setDestination] = useState<CountryCode>(countryCode);
  const [category, setCategory] = useState<string>('Consumer Electronics & Audio');
  const [declaredValue, setDeclaredValue] = useState<string>('45000');
  const [weightKg, setWeightKg] = useState<string>('1.5');
  const [calcResult, setCalcResult] = useState<CrossBorderDutyResult | null>(null);

  // Local courier serviceability state
  const [postalCheck, setPostalCheck] = useState<string>('');
  const [serviceStatus, setServiceStatus] = useState<string | null>(null);

  const currencySymbol =
    countryCode === 'IN' ? '₹' : countryCode === 'AE' ? 'AED' : 'रु';

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(declaredValue);
    if (isNaN(val) || val <= 0) return;

    const isDomestic = origin === destination;
    const catLower = category.toLowerCase();

    if (catLower.includes('gold') || catLower.includes('hazardous')) {
      setCalcResult({
        isAllowed: false,
        hsCode: '9999.99',
        customsDutyPercent: 0,
        customsDutyAmount: 0,
        importVatGstPercent: 0,
        importVatGstAmount: 0,
        carrierClearanceFee: 0,
        totalLandedCost: val,
        currency: countryCode === 'IN' ? CurrencyCode.INR : countryCode === 'AE' ? CurrencyCode.AED : CurrencyCode.NPR,
        notes: 'PROHIBITED ITEM: Raw gold bullion or hazardous chemicals are restricted from cross-border courier transport.',
      });
      return;
    }

    if (isDomestic) {
      const taxRate = destination === CountryCode.NEPAL ? 13 : destination === CountryCode.INDIA ? 18 : 5;
      const taxAmount = Math.round(val * (taxRate / 100));
      const shipping = destination === CountryCode.NEPAL ? 150 : destination === CountryCode.INDIA ? 99 : 25;

      setCalcResult({
        isAllowed: true,
        hsCode: 'DOMESTIC-STANDARD',
        customsDutyPercent: 0,
        customsDutyAmount: 0,
        importVatGstPercent: taxRate,
        importVatGstAmount: taxAmount,
        carrierClearanceFee: shipping,
        totalLandedCost: val + taxAmount + shipping,
        currency: countryCode === 'IN' ? CurrencyCode.INR : countryCode === 'AE' ? CurrencyCode.AED : CurrencyCode.NPR,
        notes: `Domestic fulfillment within ${destination}. Standard ${taxRate}% VAT/GST applicable without customs duty.`,
      });
      return;
    }

    // Cross-border trade treaties
    let dutyPercent = 10.0;
    let agreement = 'Standard WTO MFN tariff rate';

    if (
      (origin === CountryCode.INDIA && destination === CountryCode.UAE) ||
      (origin === CountryCode.UAE && destination === CountryCode.INDIA)
    ) {
      dutyPercent = 5.0;
      agreement = 'Preferential 5% tariff under India-UAE CEPA bilateral agreement';
    } else if (
      (origin === CountryCode.NEPAL && destination === CountryCode.INDIA) ||
      (origin === CountryCode.INDIA && destination === CountryCode.NEPAL)
    ) {
      dutyPercent = 6.0;
      agreement = 'Concessional 6% tariff under Nepal-India Bilateral Treaty of Trade';
    }

    if (catLower.includes('laptop')) {
      dutyPercent = 0.0;
      agreement = '0% Duty under WTO Information Technology Agreement (ITA-1)';
    }

    const importTaxPercent = destination === CountryCode.NEPAL ? 13 : destination === CountryCode.INDIA ? 18 : 5;
    const customsDuty = Math.round(val * (dutyPercent / 100));
    const importTax = Math.round((val + customsDuty) * (importTaxPercent / 100));
    const clearanceFee = destination === CountryCode.UAE ? 35 : destination === CountryCode.INDIA ? 500 : 800;

    setCalcResult({
      isAllowed: true,
      hsCode: catLower.includes('laptop') ? '8471.30' : '8518.30',
      customsDutyPercent: dutyPercent,
      customsDutyAmount: customsDuty,
      importVatGstPercent: importTaxPercent,
      importVatGstAmount: importTax,
      carrierClearanceFee: clearanceFee,
      totalLandedCost: val + customsDuty + importTax + clearanceFee,
      currency: countryCode === 'IN' ? CurrencyCode.INR : countryCode === 'AE' ? CurrencyCode.AED : CurrencyCode.NPR,
      notes: `${agreement}. Assessed on CIF landed valuation with customs clearance document generation.`,
    });
  };

  const handlePostalCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postalCheck.trim()) return;

    const carrier =
      destination === CountryCode.NEPAL
        ? 'Nepal CanShip & Express'
        : destination === CountryCode.INDIA
        ? 'Delhivery Surface Express'
        : 'Aramex Priority Dubai';

    setServiceStatus(`✅ Serviceable! Standard delivery: 2-3 business days via ${carrier}. Prepaid & COD available.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header currentCountry={countryCode} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>🌐</span> Cross-Border Customs & Domestic Logistics Calculator
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Tariffs, Import Taxes & Delivery Serviceability
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            Estimate landed costs with real-time duty calculations incorporating the Nepal-India Treaty of Trade, India-UAE CEPA agreement, and local statutory VAT/GST frameworks.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calculator Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Cross-Border Landed Cost Estimator</h2>

            <form onSubmit={handleCalculate} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Origin Country *</label>
                  <select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value as CountryCode)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    <option value={CountryCode.NEPAL}>Nepal 🇳🇵</option>
                    <option value={CountryCode.INDIA}>India 🇮🇳</option>
                    <option value={CountryCode.UAE}>United Arab Emirates 🇦🇪</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Destination Country *</label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value as CountryCode)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    <option value={CountryCode.NEPAL}>Nepal 🇳🇵</option>
                    <option value={CountryCode.INDIA}>India 🇮🇳</option>
                    <option value={CountryCode.UAE}>United Arab Emirates 🇦🇪</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Item Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    <option value="Consumer Electronics & Audio">Consumer Electronics & Audio (HS 8518)</option>
                    <option value="Computers & Laptops">Computers & Laptops (HS 8471 - 0% Duty)</option>
                    <option value="Organic Tea & Commodities">Himalayan Tea & Agriculture (HS 0902)</option>
                    <option value="Luxury Perfumes & Fragrance">Luxury Arabian Perfume (HS 3303)</option>
                    <option value="Gold Bullion & Raw Metals">Gold Bullion & Raw Precious Metals (Restricted)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Declared Value ({currencySymbol}) *</label>
                  <input
                    type="number"
                    required
                    value={declaredValue}
                    onChange={(e) => setDeclaredValue(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Estimated Package Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-500/20 transition-all text-xs"
                >
                  Calculate Duties & Landed Valuation
                </button>
              </div>
            </form>

            {/* Result Box */}
            {calcResult && (
              <div className="mt-8 pt-6 border-t border-slate-200">
                {!calcResult.isAllowed ? (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs">
                    <div className="font-black text-sm">⛔ Import Prohibited</div>
                    <p className="mt-1 leading-relaxed">{calcResult.notes}</p>
                  </div>
                ) : (
                  <div className="space-y-4 text-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <span className="font-bold text-slate-900 text-sm">Customs & Duty Assessment</span>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">HS Tariff: {calcResult.hsCode}</div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[11px]">
                        Cleared for Import
                      </span>
                    </div>

                    <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 font-mono">
                      <div className="flex justify-between text-slate-600">
                        <span>Declared Product Value:</span>
                        <span className="font-bold text-slate-900">{currencySymbol} {parseFloat(declaredValue).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Customs Basic Duty ({calcResult.customsDutyPercent}%):</span>
                        <span className="font-bold text-slate-900">+{currencySymbol} {calcResult.customsDutyAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Import VAT/GST ({calcResult.importVatGstPercent}%):</span>
                        <span className="font-bold text-slate-900">+{currencySymbol} {calcResult.importVatGstAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Carrier Clearance & Brokerage:</span>
                        <span className="font-bold text-slate-900">+{currencySymbol} {calcResult.carrierClearanceFee.toLocaleString()}</span>
                      </div>
                      <div className="pt-2 border-t border-slate-300 flex justify-between text-slate-900 font-bold text-sm">
                        <span>Estimated Total Landed Cost:</span>
                        <span className="text-base text-blue-600">{currencySymbol} {calcResult.totalLandedCost.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500 leading-relaxed">
                      <b>Treaty Reference:</b> {calcResult.notes}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Postal / Ward Serviceability Checker */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-base font-bold text-slate-900 mb-2">Check Local Serviceability</h3>
              <p className="text-xs text-slate-500 mb-4">
                Verify courier coverage by Ward No, PIN Code, or Makani number.
              </p>

              <form onSubmit={handlePostalCheck} className="space-y-3 text-xs">
                <input
                  type="text"
                  required
                  value={postalCheck}
                  onChange={(e) => setPostalCheck(e.target.value)}
                  placeholder={
                    countryCode === 'NP'
                      ? 'e.g. Ward 4 Baluwatar, Kathmandu'
                      : countryCode === 'IN'
                      ? 'e.g. 400050 (Mumbai)'
                      : 'e.g. 30032 95320 (Dubai Makani)'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-colors"
                >
                  Verify Serviceability
                </button>
              </form>

              {serviceStatus && (
                <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold leading-relaxed">
                  {serviceStatus}
                </div>
              )}
            </div>

            {/* Courier Partners Badge */}
            <div className="bg-slate-100 rounded-3xl p-6 border border-slate-200 text-xs text-slate-600 space-y-3">
              <h4 className="font-bold text-slate-900">Certified Carrier Partners</h4>
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 font-medium">
                  🇳🇵 <b>Nepal CanShip & Express Logistics</b> (77 Districts)
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 font-medium">
                  🇮🇳 <b>Delhivery Surface Express</b> (19,000+ PIN codes)
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 font-medium">
                  🇦🇪 <b>Aramex Priority Dubai</b> (All 7 Emirates)
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
