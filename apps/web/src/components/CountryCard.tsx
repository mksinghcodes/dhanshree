import React from 'react';
import Link from 'next/link';

interface CountryCardProps {
  countryCode: string;
  name: string;
  nativeName: string;
  flag: string;
  currency: string;
  languages: string;
  tax: string;
  paymentGateways: string[];
  addressStructure: string[];
  accentColor: string;
}

export function CountryCard({
  countryCode,
  name,
  nativeName,
  flag,
  currency,
  languages,
  tax,
  paymentGateways,
  addressStructure,
  accentColor,
}: CountryCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      <div className={`h-2 ${accentColor}`} />
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl">{flag}</span>
                <h3 className="text-xl font-bold text-slate-900">{name}</h3>
              </div>
              <p className="text-sm font-medium text-slate-500 mt-0.5">{nativeName}</p>
            </div>
            <span className="px-2.5 py-1 bg-slate-100 text-slate-800 text-xs font-bold rounded-lg border border-slate-200">
              {countryCode}
            </span>
          </div>

          {/* Quick Specs */}
          <div className="grid grid-cols-2 gap-3 mt-5 p-3.5 bg-slate-50 rounded-xl text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Currency</span>
              <span className="font-bold text-slate-900">{currency}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Languages</span>
              <span className="font-bold text-slate-900">{languages}</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400 block font-medium">Tax & Compliance</span>
              <span className="font-semibold text-slate-800">{tax}</span>
            </div>
          </div>

          {/* Payment Gateways */}
          <div className="mt-5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Payment Adapters
            </span>
            <div className="flex flex-wrap gap-1.5">
              {paymentGateways.map((gw) => (
                <span
                  key={gw}
                  className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[11px] font-semibold rounded-md border border-blue-100"
                >
                  {gw}
                </span>
              ))}
            </div>
          </div>

          {/* Address Fields */}
          <div className="mt-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Localized Address Spec
            </span>
            <ul className="text-xs text-slate-600 space-y-1">
              {addressStructure.map((field, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  {field}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Enter Storefront CTA */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <Link
            href={`/${countryCode.toLowerCase()}`}
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            Launch {name} Storefront &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
