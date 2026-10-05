'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CountryCode, UserRole } from '@dhanshree/shared';

export interface MockUser {
  id: string;
  name: string;
  nameNepali: string;
  shortName: string;
  email: string;
  role: UserRole | 'LOGISTICS';
  roleLabel: string;
  roleLabelNepali: string;
  country: CountryCode;
  avatar: string;
  badge: string;
  balanceFormatted: string;
  description: string;
  storeName?: string;
  commissionRate?: string;
  expressPayoutEnabled?: boolean;
}

export const MOCK_PERSONAS: MockUser[] = [
  {
    id: 'usr-manoj-01',
    name: 'Manoj Kumar Singh',
    nameNepali: 'मनोज कुमार सिंह',
    shortName: 'Manoj',
    email: 'mdsinghnp@gmail.com',
    role: UserRole.ADMIN,
    roleLabel: 'Super Admin & Account Owner',
    roleLabelNepali: 'खाताधनी / सुपर एडमिन',
    country: CountryCode.NEPAL,
    avatar: '👤',
    badge: 'Verified Primary Account 🛡️',
    balanceFormatted: 'रु ४८,९०,००० (Platform Escrow Pool)',
    description: 'Account holder of mdsinghnp@gmail.com with complete marketplace and management access.',
  },
  {
    id: 'usr-buyer-01',
    name: 'Sita Sharma',
    nameNepali: 'सीता शर्मा',
    shortName: 'Sita',
    email: 'sita.sharma@dhanshree.com',
    role: UserRole.BUYER,
    roleLabel: 'Consumer / Buyer',
    roleLabelNepali: 'ग्राहक / उपभोक्ता',
    country: CountryCode.NEPAL,
    avatar: '🛍️',
    badge: 'Prime VIP Member 👑',
    balanceFormatted: 'रु २५,४५० (Wallet)',
    description: 'Kathmandu shopper preparing for Dashain, Tihar, and Chhath festivities.',
  },
  {
    id: 'usr-seller-01',
    name: 'Rajesh Shrestha',
    nameNepali: 'राजेश श्रेष्ठ',
    shortName: 'Rajesh',
    email: 'seller@dhanshree.com',
    role: UserRole.SELLER,
    roleLabel: 'Verified Merchant / Vendor',
    roleLabelNepali: 'बिक्रेता / व्यपारी',
    country: CountryCode.NEPAL,
    avatar: '🏪',
    badge: '0% Festival Commission Active 🌟',
    balanceFormatted: 'रु ५,२०,००० (Ready Payout)',
    description: 'Proprietor of Himalayan Handicrafts & Electronics Store. Eligible for 24h express payouts.',
    storeName: 'Himalayan Flagship Emporium',
    commissionRate: '0% (Dashain-Tihar Mahotsav Offer)',
    expressPayoutEnabled: true,
  },
  {
    id: 'usr-logistics-01',
    name: 'Bikash Thapa',
    nameNepali: 'विकास थापा',
    shortName: 'Bikash',
    email: 'logistics@dhanshree.com',
    role: 'LOGISTICS',
    roleLabel: 'Courier & Fleet Dispatcher',
    roleLabelNepali: 'डेलिभरी तथा लजिस्टिक पार्टनर',
    country: CountryCode.NEPAL,
    avatar: '🚚',
    badge: 'CanShip Express Logistics 🚚',
    balanceFormatted: '१२ Active Dispatches',
    description: 'Nepal CanShip & Delhivery hub coordinator handling festival priority shipping routes.',
  },
];

interface AuthContextType {
  currentUser: MockUser;
  availableUsers: MockUser[];
  switchUser: (idOrEmail: string) => void;
  loginCustom: (user: Partial<MockUser>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'dhanshree_mock_persona_v2';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<MockUser>(MOCK_PERSONAS[0]);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const matched = MOCK_PERSONAS.find((p) => p.id === parsed.id || p.email === parsed.email);
        if (matched) {
          setCurrentUser(matched);
        } else if (parsed.email) {
          setCurrentUser(parsed);
        }
      }
    } catch {
      // Fallback to default
    }
  }, []);

  const switchUser = (idOrEmail: string) => {
    const matched = MOCK_PERSONAS.find(
      (p) => p.id === idOrEmail || p.email.toLowerCase() === idOrEmail.toLowerCase()
    );
    if (matched) {
      setCurrentUser(matched);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(matched));
      } catch {}
    }
  };

  const loginCustom = (custom: Partial<MockUser>) => {
    const nameStr = custom.name || 'Custom User';
    const newUser: MockUser = {
      id: `usr-custom-${Date.now()}`,
      name: nameStr,
      nameNepali: custom.nameNepali || nameStr,
      shortName: nameStr.split(' ')[0],
      email: custom.email || `user-${Date.now()}@dhanshree.com`,
      role: custom.role || UserRole.BUYER,
      roleLabel: custom.roleLabel || 'Custom Role',
      roleLabelNepali: custom.roleLabelNepali || 'कस्टम भूमिका',
      country: custom.country || CountryCode.NEPAL,
      avatar: custom.avatar || (custom.role === UserRole.SELLER ? '🏪' : custom.role === UserRole.ADMIN ? '🛡️' : '👤'),
      badge: 'Active Mock User ✨',
      balanceFormatted: custom.balanceFormatted || 'रु ०',
      description: custom.description || 'Newly instantiated mock test account.',
      storeName: custom.storeName,
    };
    setCurrentUser(newUser);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    } catch {}
  };

  const logout = () => {
    const defaultUser = MOCK_PERSONAS[0];
    setCurrentUser(defaultUser);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUser));
    } catch {}
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        availableUsers: MOCK_PERSONAS,
        switchUser,
        loginCustom,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
