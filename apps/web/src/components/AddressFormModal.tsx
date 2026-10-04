'use client';

import React, { useState } from 'react';
import { CountryCode } from '@dhanshree/shared';

export function AddressFormModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [country, setCountry] = useState<CountryCode>(CountryCode.NEPAL);

  // Common
  const [fullName, setFullName] = useState('Aayush Adhikari');
  const [phone, setPhone] = useState('+9779841234567');

  // Nepal
  const [province, setProvince] = useState('Bagmati Province');
  const [district, setDistrict] = useState('Kathmandu');
  const [municipality, setMunicipality] = useState('Kathmandu Metropolitan City');
  const [wardNumber, setWardNumber] = useState<number>(10);
  const [toleStreet, setToleStreet] = useState('New Baneshwor, Devkota Marg');

  // India
  const [state, setState] = useState('Maharashtra');
  const [districtCity, setDistrictCity] = useState('Mumbai');
  const [pinCode, setPinCode] = useState('400001');
  const [addressLine1, setAddressLine1] = useState('Flat 402, Sea View Apartments');

  // UAE
  const [emirate, setEmirate] = useState('DUBAI');
  const [areaNeighborhood, setAreaNeighborhood] = useState('Downtown Dubai');
  const [buildingVillaName, setBuildingVillaName] = useState('Burj Crown');
  const [apartmentNumber, setApartmentNumber] = useState('1804');
  const [makaniNumber, setMakaniNumber] = useState('30032 95320');

  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (country === CountryCode.NEPAL) {
      setSavedFeedback(
        `✅ Localized Nepal Address Validated: Ward ${wardNumber}, ${municipality}, ${district}, ${province}`,
      );
    } else if (country === CountryCode.INDIA) {
      setSavedFeedback(
        `✅ Localized India Address Validated: PIN ${pinCode}, ${districtCity}, ${state}`,
      );
    } else {
      setSavedFeedback(
        `✅ Localized UAE Address Validated: Makani ${makaniNumber}, ${buildingVillaName} Apt ${apartmentNumber}, ${areaNeighborhood}, ${emirate}`,
      );
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
      >
        <span>📍 Localized Address Validator</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Country-Specific Address Validator
                </h3>
                <p className="text-xs text-slate-500">
                  Dynamic Discriminated Address Schema per Region
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm"
              >
                &times;
              </button>
            </div>

            {/* Country Selector */}
            <div className="mt-4">
              <label className="font-bold text-slate-700 block mb-1 text-xs">
                Select Country Format
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { code: CountryCode.NEPAL, flag: '🇳🇵', label: 'Nepal (Ward/Muni)' },
                  { code: CountryCode.INDIA, flag: '🇮🇳', label: 'India (PIN/State)' },
                  { code: CountryCode.UAE, flag: '🇦🇪', label: 'UAE (Makani/Emirate)' },
                ].map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      setCountry(c.code);
                      setSavedFeedback(null);
                    }}
                    className={`p-2 rounded-xl border text-center transition-all text-xs ${
                      country === c.code
                        ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold'
                        : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span className="block text-sm">{c.flag}</span>
                    <span className="text-[11px] block">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
              {savedFeedback && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold">
                  {savedFeedback}
                </div>
              )}

              {/* COMMON FIELDS */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Recipient Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* NEPAL SPECIFIC FIELDS */}
              {country === CountryCode.NEPAL && (
                <div className="p-3 bg-red-50/50 rounded-xl border border-red-200 space-y-2">
                  <span className="font-bold text-red-900 block text-[11px]">
                    Nepal Municipal Address Hierarchy
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-600 block">Province</label>
                      <input
                        type="text"
                        required
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-600 block">District</label>
                      <input
                        type="text"
                        required
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className="text-[11px] text-slate-600 block">Municipality / Nagarpalika</label>
                      <input
                        type="text"
                        required
                        value={municipality}
                        onChange={(e) => setMunicipality(e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-600 block">Ward No. (1-32)</label>
                      <input
                        type="number"
                        min={1}
                        max={35}
                        required
                        value={wardNumber}
                        onChange={(e) => setWardNumber(Number(e.target.value))}
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 block">Tole / Street Name</label>
                    <input
                      type="text"
                      required
                      value={toleStreet}
                      onChange={(e) => setToleStreet(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              )}

              {/* INDIA SPECIFIC FIELDS */}
              {country === CountryCode.INDIA && (
                <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200 space-y-2">
                  <span className="font-bold text-amber-900 block text-[11px]">
                    India State & PIN Postal Code Model
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-600 block">State / UT</label>
                      <input
                        type="text"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-600 block">City / District</label>
                      <input
                        type="text"
                        required
                        value={districtCity}
                        onChange={(e) => setDistrictCity(e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-600 block">6-digit PIN</label>
                      <input
                        type="text"
                        maxLength={6}
                        pattern="^[1-9][0-9]{5}$"
                        required
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs font-mono font-bold"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[11px] text-slate-600 block">Flat / House / Building</label>
                      <input
                        type="text"
                        required
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* UAE SPECIFIC FIELDS */}
              {country === CountryCode.UAE && (
                <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-2">
                  <span className="font-bold text-emerald-900 block text-[11px]">
                    UAE Emirate & Makani Geospatial Model
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-600 block">Emirate</label>
                      <select
                        value={emirate}
                        onChange={(e) => setEmirate(e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold"
                      >
                        <option value="DUBAI">Dubai</option>
                        <option value="ABU_DHABI">Abu Dhabi</option>
                        <option value="SHARJAH">Sharjah</option>
                        <option value="AJMAN">Ajman</option>
                        <option value="RAS_AL_KHAIMAH">Ras Al Khaimah</option>
                        <option value="FUJAIRAH">Fujairah</option>
                        <option value="UMM_AL_QUWAIN">Umm Al Quwain</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-600 block">Area / Neighborhood</label>
                      <input
                        type="text"
                        required
                        value={areaNeighborhood}
                        onChange={(e) => setAreaNeighborhood(e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-600 block">Building / Villa Name</label>
                      <input
                        type="text"
                        required
                        value={buildingVillaName}
                        onChange={(e) => setBuildingVillaName(e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-600 block">Flat / Villa No.</label>
                      <input
                        type="text"
                        required
                        value={apartmentNumber}
                        onChange={(e) => setApartmentNumber(e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 block">
                      10-digit Makani Number (Dubai Coordinate)
                    </label>
                    <input
                      type="text"
                      value={makaniNumber}
                      onChange={(e) => setMakaniNumber(e.target.value)}
                      placeholder="e.g. 30032 95320"
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors"
              >
                Validate & Save Localized Address
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
