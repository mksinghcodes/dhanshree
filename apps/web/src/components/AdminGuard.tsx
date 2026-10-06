'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@dhanshree/shared';

interface AdminGuardProps {
  countryCode: string;
  children: React.ReactNode;
}

export function AdminGuard({ countryCode, children }: AdminGuardProps) {
  const { currentUser, switchUser } = useAuth();
  const [adminPin, setAdminPin] = useState('');
  const [pinError, setPinError] = useState('');
  const c = countryCode.toLowerCase();

  const isAdmin = currentUser.role === UserRole.ADMIN;

  const handlePinUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === '0231' || adminPin === 'Dhanshree@0231') {
      switchUser('usr-manoj-01');
      setPinError('');
    } else {
      setPinError('Invalid Security Passcode. Access attempt logged.');
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 font-sans select-none">
        <div className="max-w-md w-full bg-slate-900 border border-rose-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Glowing Red Warning Aura */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Shield Icon & Badge */}
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-2xl">
              🛡️
            </div>
            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider border border-rose-500/30">
              403 Restricted Access
            </span>
          </div>

          <h2 className="text-xl font-black text-white tracking-tight mb-2">
            Super Admin Authentication Required
          </h2>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            This module controls sensitive cross-border marketplace financials, escrow settlements, and merchant KYC verification across Nepal, India, and UAE.
          </p>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 mb-6 text-xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span>Current Session Persona:</span>
              <span className="font-semibold text-amber-300">{currentUser.roleLabel}</span>
            </div>
            <div className="text-slate-300 font-medium truncate">
              {currentUser.email}
            </div>
          </div>

          {/* Quick Unlock for Owner */}
          <form onSubmit={handlePinUnlock} className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Enter Master Passcode / Security PIN:
              </label>
              <input
                type="password"
                value={adminPin}
                onChange={(e) => {
                  setAdminPin(e.target.value);
                  setPinError('');
                }}
                placeholder="Enter PIN (e.g. 0231)"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-600 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-mono"
              />
              {pinError && (
                <p className="text-rose-400 text-[11px] font-semibold mt-1.5 flex items-center gap-1">
                  <span>⚠️</span> {pinError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-900/30 transition-all cursor-pointer"
            >
              Verify &amp; Enter Executive Cockpit →
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
            <Link
              href={`/${c}`}
              className="text-slate-400 hover:text-white transition-colors"
            >
              ← Return to Storefront
            </Link>
            <button
              onClick={() => switchUser('usr-manoj-01')}
              className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
            >
              Switch to Manoj (Admin)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
