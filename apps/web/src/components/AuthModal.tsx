'use client';

import React, { useState } from 'react';
import { CountryCode, UserRole } from '@dhanshree/shared';
import { useAuth, MOCK_PERSONAS, MockUser } from '@/context/AuthContext';

export function AuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'MOCK' | 'LOGIN' | 'REGISTER' | 'OTP'>('MOCK');

  const { currentUser, switchUser, loginCustom } = useAuth();

  // Form states for custom / manual auth
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.BUYER);
  const [country, setCountry] = useState<CountryCode>(CountryCode.NEPAL);
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [authMessage, setAuthMessage] = useState<string | null>(null);

  // Custom mock user creation state
  const [showCreateMock, setShowCreateMock] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customRole, setCustomRole] = useState<UserRole>(UserRole.BUYER);
  const [customCountry, setCustomCountry] = useState<CountryCode>(CountryCode.NEPAL);
  const [customBalance, setCustomBalance] = useState('रु ५०,०००');

  const handleSimulatedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'LOGIN') {
      loginCustom({
        email,
        name: email.split('@')[0],
        role: UserRole.BUYER,
        country,
      });
      setAuthMessage(`सफलतापूर्वक लगईन भयो: ${email}! (Bearer token issued)`);
      setTimeout(() => setIsOpen(false), 1500);
    } else if (authMode === 'REGISTER') {
      loginCustom({
        name: fullName,
        email,
        role,
        country,
      });
      setAuthMessage(`नयाँ खाता दर्ता भयो: ${fullName} (${role} - ${country})!`);
      setTimeout(() => setIsOpen(false), 1500);
    } else if (authMode === 'OTP') {
      if (!otpSent) {
        setOtpSent(true);
        setAuthMessage(`६-अंकको OTP कोड ${phone} मा पठाइयो (SMS gateway).`);
      } else {
        loginCustom({
          name: `User ${phone.slice(-4)}`,
          email: `${phone.replace(/\D/g, '')}@dhanshree-sms.com`,
          role: UserRole.BUYER,
          country,
        });
        setAuthMessage(`फोन प्रमाणित भयो (OTP ${otpCode})! सक्रिय सत्र स्थापित भयो।`);
        setTimeout(() => setIsOpen(false), 1500);
      }
    }
  };

  const handleSelectMockPersona = (persona: MockUser) => {
    switchUser(persona.id);
    setAuthMessage(`स्विच गरियो: ${persona.nameNepali} (${persona.roleLabelNepali})`);
    setTimeout(() => {
      setAuthMessage(null);
      setIsOpen(false);
    }, 1000);
  };

  const handleCreateCustomMock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName || !customEmail) return;
    loginCustom({
      name: customName,
      nameNepali: customName,
      email: customEmail,
      role: customRole,
      country: customCountry,
      balanceFormatted: customBalance,
      roleLabel: customRole === UserRole.SELLER ? 'Custom Merchant' : customRole === UserRole.ADMIN ? 'Custom Admin' : 'Custom Buyer',
      roleLabelNepali: customRole === UserRole.SELLER ? 'कस्टम बिक्रेता' : customRole === UserRole.ADMIN ? 'कस्टम एडमिन' : 'कस्टम ग्राहक',
    });
    setAuthMessage(`नयाँ मोक युजर सिर्जना गरी लगईन भयो: ${customName}!`);
    setTimeout(() => {
      setAuthMessage(null);
      setShowCreateMock(false);
      setIsOpen(false);
    }, 1200);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
      >
        <span>🔑 लगईन / मोक स्विच</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Header & Tabs */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setAuthMode('MOCK');
                    setAuthMessage(null);
                  }}
                  className={`text-xs font-bold pb-1 transition-all ${
                    authMode === 'MOCK'
                      ? 'text-red-600 border-b-2 border-red-600'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  ⚡ १-क्लिक मोक युजरहरू
                </button>
                <button
                  onClick={() => {
                    setAuthMode('LOGIN');
                    setAuthMessage(null);
                  }}
                  className={`text-xs font-bold pb-1 transition-all ${
                    authMode === 'LOGIN'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  Password Login
                </button>
                <button
                  onClick={() => {
                    setAuthMode('REGISTER');
                    setAuthMessage(null);
                  }}
                  className={`text-xs font-bold pb-1 transition-all ${
                    authMode === 'REGISTER'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  Register
                </button>
                <button
                  onClick={() => {
                    setAuthMode('OTP');
                    setAuthMessage(null);
                    setOtpSent(false);
                  }}
                  className={`text-xs font-bold pb-1 transition-all ${
                    authMode === 'OTP'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  SMS OTP
                </button>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm"
              >
                &times;
              </button>
            </div>

            {authMessage && (
              <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                <span>✓</span>
                <span>{authMessage}</span>
              </div>
            )}

            {/* TAB 1: 1-CLICK MOCK PERSONAS FOR TESTING */}
            {authMode === 'MOCK' && (
              <div className="mt-4 space-y-3">
                <div className="p-3 bg-gradient-to-r from-red-50 to-amber-50 rounded-xl border border-red-100 text-xs">
                  <span className="font-extrabold text-red-900 block mb-0.5">
                    🎯 मोक परीक्षण कन्सोल (Mock Testing Console)
                  </span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    विभिन्न भूमिका (Roles) परीक्षण गर्न तलको कुनै पनि खातामा १-क्लिक गर्नुहोस्। यसले तपाईंको सेसन तुरुन्त परिवर्तन गरिदिन्छ।
                  </p>
                </div>

                <div className="space-y-2 mt-3">
                  {MOCK_PERSONAS.map((persona) => {
                    const isCurrent = currentUser.id === persona.id;
                    return (
                      <div
                        key={persona.id}
                        className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                          isCurrent
                            ? 'bg-blue-50/60 border-blue-300 shadow-xs'
                            : 'bg-white hover:bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl p-2 bg-slate-100 rounded-xl">{persona.avatar}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-slate-900">
                                {persona.nameNepali} ({persona.name})
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700">
                                {persona.roleLabelNepali}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400 font-mono block">
                              {persona.email} • {persona.balanceFormatted}
                            </span>
                            <span className="text-[10px] text-slate-500 block mt-0.5">
                              {persona.description}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleSelectMockPersona(persona)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                            isCurrent
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-900 hover:bg-slate-800 text-white'
                          }`}
                        >
                          {isCurrent ? 'सक्रिय (Active)' : 'यो लगईन गर्नुहोस् →'}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Custom User Creation Option */}
                <div className="pt-3 border-t border-slate-100">
                  {!showCreateMock ? (
                    <button
                      onClick={() => setShowCreateMock(true)}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
                    >
                      + नयाँ आफ्नै कस्टम युजर सिर्जना गर्नुहोस् (Create Custom Mock User)
                    </button>
                  ) : (
                    <form onSubmit={handleCreateCustomMock} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900">नयाँ मोक युजर थप्नुहोस्:</span>
                        <button
                          type="button"
                          onClick={() => setShowCreateMock(false)}
                          className="text-slate-400 hover:text-slate-600 text-[11px]"
                        >
                          रद्द गर्नुहोस्
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Full Name</label>
                          <input
                            type="text"
                            required
                            value={customName}
                            onChange={(e) => setCustomName(e.target.value)}
                            placeholder="e.g. Ramesh Adhikari"
                            className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Email Address</label>
                          <input
                            type="email"
                            required
                            value={customEmail}
                            onChange={(e) => setCustomEmail(e.target.value)}
                            placeholder="ramesh@example.com"
                            className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">भूमिका (Role)</label>
                          <select
                            value={customRole}
                            onChange={(e) => setCustomRole(e.target.value as any)}
                            className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs"
                          >
                            <option value={UserRole.BUYER}>Buyer (ग्राहक)</option>
                            <option value={UserRole.SELLER}>Seller (व्यपारी)</option>
                            <option value={UserRole.ADMIN}>Admin (प्रशासक)</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Country</label>
                          <select
                            value={customCountry}
                            onChange={(e) => setCustomCountry(e.target.value as any)}
                            className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs"
                          >
                            <option value={CountryCode.NEPAL}>Nepal (NP)</option>
                            <option value={CountryCode.INDIA}>India (IN)</option>
                            <option value={CountryCode.UAE}>UAE (AE)</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Test Balance</label>
                          <input
                            type="text"
                            value={customBalance}
                            onChange={(e) => setCustomBalance(e.target.value)}
                            placeholder="रु ५०,०००"
                            className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full mt-2 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs shadow-xs"
                      >
                        यो युजर सिर्जना गरी लगईन गर्नुहोस्
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2, 3, 4: STANDARD AUTH FLOWS */}
            {authMode !== 'MOCK' && (
              <form onSubmit={handleSimulatedSubmit} className="mt-4 space-y-3 text-xs">
                {/* REGISTER EXTRA FIELDS */}
                {authMode === 'REGISTER' && (
                  <>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Ramesh Koirala"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Account Role</label>
                        <select
                          value={role}
                          onChange={(e) => setRole(e.target.value as any)}
                          className="w-full px-2 py-2 border border-slate-300 rounded-lg text-xs"
                        >
                          <option value={UserRole.BUYER}>Buyer (ग्राहक)</option>
                          <option value={UserRole.SELLER}>Seller / Vendor (व्यपारी)</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Home Country</label>
                        <select
                          value={country}
                          onChange={(e) => setCountry(e.target.value as any)}
                          className="w-full px-2 py-2 border border-slate-300 rounded-lg text-xs"
                        >
                          <option value={CountryCode.NEPAL}>Nepal (NP)</option>
                          <option value={CountryCode.INDIA}>India (IN)</option>
                          <option value={CountryCode.UAE}>UAE (AE)</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {/* COMMON EMAIL & PASSWORD */}
                {authMode !== 'OTP' && (
                  <>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="user@example.com"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Password</label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  </>
                )}

                {/* OTP FLOW */}
                {authMode === 'OTP' && (
                  <>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Mobile Phone (with country code)
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+9779841234567 or +919820011223"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                      />
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Routes via Sparrow SMS (Nepal), MSG91 (India), or Twilio (UAE)
                      </span>
                    </div>

                    {otpSent && (
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Enter 6-Digit OTP</label>
                        <input
                          type="text"
                          maxLength={6}
                          required
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder="123456"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono tracking-widest text-center text-base font-bold"
                        />
                      </div>
                    )}
                  </>
                )}

                <button
                  type="submit"
                  className="w-full mt-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
                >
                  {authMode === 'LOGIN'
                    ? 'Sign In to Marketplace'
                    : authMode === 'REGISTER'
                    ? 'Create Marketplace Account'
                    : !otpSent
                    ? 'Send SMS OTP Passcode'
                    : 'Verify & Authenticate'}
                </button>
              </form>
            )}

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-[11px] text-slate-400">
              <span>JWT + Refresh Rotation</span>
              <span>Argon2 / Bcrypt Encrypted</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
