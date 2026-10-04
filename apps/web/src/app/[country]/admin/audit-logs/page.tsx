'use client';

import React, { useState, use } from 'react';
import { CountryCode, UserRole, AdminAuditLog } from '@dhanshree/shared';
import { AdminNav } from '../../../../components/AdminNav';

interface PageProps {
  params: Promise<{
    country: string;
  }>;
}

export default function AdminAuditLogsPage({ params }: PageProps) {
  const unwrappedParams = use(params);
  const countryParam = unwrappedParams.country.toUpperCase();

  const countryCode =
    countryParam === 'IN'
      ? CountryCode.INDIA
      : countryParam === 'AE'
      ? CountryCode.UAE
      : CountryCode.NEPAL;

  const [logs] = useState<AdminAuditLog[]>([
    {
      id: 'aud-005',
      actorEmail: 'superadmin@marketplace.global',
      actorRole: UserRole.SUPER_ADMIN,
      action: 'SELLER_KYC_APPROVED',
      entityType: 'SELLER',
      entityId: 'usr-seller-dxb',
      ipAddress: '192.168.1.101',
      details: 'Approved Dubai Gold & Fragrance Trading FZE (TRN 100488291000003). Set 7.5% commission rate.',
      createdAt: '2026-10-04T07:45:00Z',
    },
    {
      id: 'aud-004',
      actorEmail: 'support.arbitrator@marketplace.global',
      actorRole: UserRole.SUPPORT,
      action: 'DISPUTE_REFUND_BUYER',
      entityType: 'ESCROW_DISPUTE',
      entityId: 'disp-001',
      ipAddress: '192.168.1.108',
      details: 'Approved transit damage claim on ORD-2026-NP-88190. Reversed NPR 4,800 from escrow back to buyer.',
      createdAt: '2026-10-04T06:20:00Z',
    },
    {
      id: 'aud-003',
      actorEmail: 'finance.lead@marketplace.global',
      actorRole: UserRole.FINANCE,
      action: 'COMMISSION_RATE_UPDATED',
      entityType: 'COMMISSION_RULE',
      entityId: 'rule-elec-in',
      ipAddress: '192.168.1.104',
      details: 'Updated Consumer Electronics & Audio India fee from 10.0% to 9.0% for Diwali festive campaign.',
      createdAt: '2026-10-03T11:15:00Z',
    },
    {
      id: 'aud-002',
      actorEmail: 'finance.lead@marketplace.global',
      actorRole: UserRole.FINANCE,
      action: 'TCS_LEDGER_SYNC',
      entityType: 'TAX_RECONCILIATION',
      entityId: 'GST-TCS-IN-2026-09',
      ipAddress: '192.168.1.104',
      details: 'Reconciled 1% Section 52 TCS returns with GSTN portal for September 2026.',
      createdAt: '2026-10-02T14:30:00Z',
    },
    {
      id: 'aud-001',
      actorEmail: 'superadmin@marketplace.global',
      actorRole: UserRole.SUPER_ADMIN,
      action: 'PLATFORM_BOOTSTRAP',
      entityType: 'SYSTEM',
      entityId: 'SYS-GLOBAL-01',
      ipAddress: '10.0.0.1',
      details: 'Tri-country localized storefront clusters initialized for NP, IN, AE.',
      createdAt: '2026-10-01T00:00:00Z',
    },
  ]);

  const [search, setSearch] = useState('');

  const filtered = logs.filter((log) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      log.actorEmail.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-900/5 flex flex-col font-sans">
      <AdminNav countryCode={countryCode} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Security & Regulatory Audit Trail
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Immutable ledger of administrative decisions, tax reconciliations, and escrow movements.
            </p>
          </div>
          <div className="w-full sm:w-72">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search audit events, actors, or actions..."
              className="w-full text-xs px-3.5 py-2 rounded-xl bg-white border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-rose-500 shadow-xs"
            />
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actor & Role</th>
                  <th className="py-3 px-4">Action Taken</th>
                  <th className="py-3 px-4">Target Entity</th>
                  <th className="py-3 px-4">Event Details</th>
                  <th className="py-3 px-4 text-right">Client IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {filtered.map((log) => {
                  const isSuper = log.actorRole === UserRole.SUPER_ADMIN;
                  const isFinance = log.actorRole === UserRole.FINANCE;

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-sans font-bold text-slate-900">{log.actorEmail}</div>
                        <span
                          className={`inline-block px-2 py-0.2 rounded-full text-[9px] font-bold mt-0.5 ${
                            isSuper
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : isFinance
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-purple-50 text-purple-700 border border-purple-200'
                          }`}
                        >
                          {log.actorRole}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {log.action}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <span className="text-slate-400">{log.entityType}:</span> {log.entityId}
                      </td>
                      <td className="py-3.5 px-4 font-sans text-xs text-slate-700 max-w-md">
                        {log.details}
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-400 font-mono">
                        {log.ipAddress}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
