'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from './AuthModal';

export interface DhanshreeAccountDropdownProps {
  countryCode: string;
}

export function DhanshreeAccountDropdown({ countryCode }: DhanshreeAccountDropdownProps) {
  const { currentUser, availableUsers, switchUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const c = countryCode.toLowerCase();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative shrink-0 select-none" ref={dropdownRef}>
      {/* Navbar Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-col text-left px-2 py-1 rounded-sm border border-transparent hover:border-white transition-all cursor-pointer"
        aria-label="Accounts Menu"
      >
        <span className="text-[11px] text-[#cccccc] leading-tight">
          Hello, {currentUser?.shortName || 'Manoj'}
        </span>
        <span className="text-[13px] text-white font-bold leading-tight flex items-center gap-1">
          Accounts
          <span className="text-[9px] text-[#cccccc]">▼</span>
        </span>
      </button>

      {/* Dropdown Menu Modal */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-[420px] bg-white rounded-xl shadow-2xl border border-slate-300 text-slate-800 z-50 p-4 text-xs animate-in fade-in">
          {/* Top User Account Card */}
          <div className="bg-[#ebf8fa] border border-[#c4e8ee] rounded-xl p-3.5 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center text-xl font-bold">
                👤
              </div>
              <div>
                <h4 className="font-extrabold text-[13px] text-slate-900 leading-tight">
                  {currentUser?.name || 'Manoj Kumar Singh'}
                </h4>
                <p className="text-[11px] text-slate-500 font-mono leading-tight mt-0.5">
                  {currentUser?.email || 'mdsinghnp@gmail.com'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setShowSwitchModal(true)}
                className="text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer"
              >
                Switch Accounts
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Two-Column Directory: Left: Your Lists | Right: Your Account */}
          <div className="grid grid-cols-2 gap-6 pt-1 border-t border-slate-100">
            {/* Left Column: Your Lists */}
            <div>
              <h3 className="font-bold text-sm text-[#0f1111] mb-2.5">
                Your Lists
              </h3>
              <ul className="space-y-2 text-[#0f1111]">
                <li>
                  <Link
                    href={`/${c}/orders`}
                    onClick={() => setIsOpen(false)}
                    className="hover:text-[#c7511f] hover:underline text-xs block"
                  >
                    Create a List
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${c}/orders`}
                    onClick={() => setIsOpen(false)}
                    className="hover:text-[#c7511f] hover:underline text-xs block"
                  >
                    Wishlist &amp; Registry
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${c}/orders`}
                    onClick={() => setIsOpen(false)}
                    className="hover:text-[#c7511f] hover:underline text-xs block"
                  >
                    Saved Items
                  </Link>
                </li>
              </ul>
            </div>

            {/* Right Column: Your Account */}
            <div>
              <h3 className="font-bold text-sm text-[#0f1111] mb-2.5">
                Your Account
              </h3>
              <ul className="space-y-1.5 text-[#0f1111]">
                <li>
                  <Link
                    href={`/${c}/orders`}
                    onClick={() => setIsOpen(false)}
                    className="hover:text-[#c7511f] hover:underline text-xs block"
                  >
                    Account Settings
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${c}/orders`}
                    onClick={() => setIsOpen(false)}
                    className="hover:text-[#c7511f] hover:underline text-xs block"
                  >
                    Orders &amp; Invoices
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${c}/products`}
                    onClick={() => setIsOpen(false)}
                    className="hover:text-[#c7511f] hover:underline text-xs block"
                  >
                    Recommended for You
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${c}/membership`}
                    onClick={() => setIsOpen(false)}
                    className="hover:text-[#c7511f] hover:underline text-xs block"
                  >
                    Dhanshree Club
                  </Link>
                </li>

                {/* Seller & Admin Shortcuts */}
                <li className="pt-2 border-t border-slate-100">
                  <Link
                    href={`/${c}/seller`}
                    onClick={() => setIsOpen(false)}
                    className="text-amber-700 font-bold hover:underline text-xs block flex items-center gap-1"
                  >
                    <span>🏪</span> Sell on Dhanshree (०% कमिसन)
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${c}/admin`}
                    onClick={() => setIsOpen(false)}
                    className="text-rose-700 font-bold hover:underline text-xs block flex items-center gap-1"
                  >
                    <span>🛡️</span> Super Admin Panel
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Dropdown Footer Tagline */}
          <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-semibold text-emerald-700">
              Dhanshree
            </span>
            <span className="italic text-slate-400">
              &ldquo;Shop. Discover. Delight&rdquo;
            </span>
          </div>
        </div>
      )}

      {/* Switch Accounts Modal */}
      {showSwitchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="font-extrabold text-sm text-slate-900">
                Switch Accounts (मोक खाता चयन गर्नुहोस्)
              </h3>
              <button
                type="button"
                onClick={() => setShowSwitchModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 mb-4">
              {availableUsers.map((u) => {
                const isSelected = u.id === currentUser?.id;
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      switchUser(u.id);
                      setShowSwitchModal(false);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded-lg text-xs flex items-center justify-between transition-colors border cursor-pointer ${
                      isSelected
                        ? 'bg-amber-50 border-amber-300 font-bold'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{u.avatar}</span>
                      <div>
                        <div className="font-bold text-slate-900">{u.name} ({u.nameNepali})</div>
                        <div className="text-[11px] text-slate-500 font-mono">{u.email}</div>
                        <div className="text-[10px] text-blue-600 mt-0.5">{u.roleLabelNepali} • {u.balanceFormatted}</div>
                      </div>
                    </div>
                    {isSelected && <span className="text-amber-800 font-bold text-xs">✓ Active</span>}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
              <span className="text-slate-400">Manage multiple roles</span>
              <AuthModal />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DhanshreeAccountDropdown;
