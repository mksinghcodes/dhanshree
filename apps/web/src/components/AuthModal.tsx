'use client';

import React, { useState } from 'react';
import { CountryCode, UserRole } from '@dhanshree/shared';

export function AuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER' | 'OTP'>('LOGIN');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.BUYER);
  const [country, setCountry] = useState<CountryCode>(CountryCode.NEPAL);
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [authMessage, setAuthMessage] = useState<string | null>(null);

  const handleSimulatedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'LOGIN') {
      setAuthMessage(`Logged in successfully as ${email}! (Bearer token issued)`);
    } else if (authMode === 'REGISTER') {
      setAuthMessage(`Registered ${fullName} as ${role} for ${country}! KYC record initiated.`);
    } else if (authMode === 'OTP') {
      if (!otpSent) {
        setOtpSent(true);
        setAuthMessage(`6-digit OTP code dispatched to ${phone} via regional SMS partner.`);
      } else {
        setAuthMessage(`Phone verified with OTP code ${otpCode}! Active session established.`);
      }
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5"
      >
        <span>👤 Account & OTP Auth</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex gap-2">
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
                  SMS OTP Login
                </button>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSimulatedSubmit} className="mt-4 space-y-3 text-xs">
              {authMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium">
                  {authMessage}
                </div>
              )}

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
                        <option value={UserRole.BUYER}>Buyer</option>
                        <option value={UserRole.SELLER}>Seller / Vendor</option>
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
                    <label className="font-semibold text-slate-700 block mb-1">Mobile Phone (with country code)</label>
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
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono tracking-widest text-center text-base font-bold"
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
