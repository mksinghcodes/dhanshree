'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { CountryCode, CurrencyCode, OrderStatus, SellerOrderSummary, ShippingLabelData } from '@dhanshree/shared';
import { SellerNav } from '../../../../components/SellerNav';

interface PageProps {
  params: Promise<{
    country: string;
  }>;
}

export default function SellerOrdersPage({ params }: PageProps) {
  const unwrappedParams = use(params);
  const countryParam = unwrappedParams.country.toUpperCase();

  const countryCode =
    countryParam === 'IN'
      ? CountryCode.INDIA
      : countryParam === 'AE'
      ? CountryCode.UAE
      : CountryCode.NEPAL;

  const currencySymbol =
    countryCode === 'IN' ? '₹' : countryCode === 'AE' ? 'AED' : 'रु';

  const defaultCarrier =
    countryCode === 'IN'
      ? 'Delhivery Surface Express'
      : countryCode === 'AE'
      ? 'Aramex Priority UAE'
      : 'Nepal CanShip & Express Logistics';

  const [orders, setOrders] = useState<SellerOrderSummary[]>([
    {
      id: 'ord-s-101',
      orderNumber: 'ORD-2026-NP-89211',
      buyerName: 'Manoj Singh',
      buyerPhone: '+977 9801234567',
      destinationCity: 'Kathmandu (Ward 4, Baluwatar)',
      itemCount: 1,
      totalAmount: countryCode === 'IN' ? 32498 : countryCode === 'AE' ? 1259 : 46499,
      currency: countryCode === 'IN' ? CurrencyCode.INR : countryCode === 'AE' ? CurrencyCode.AED : CurrencyCode.NPR,
      orderStatus: OrderStatus.PACKED,
      paymentMethod: countryCode === 'IN' ? 'UPI Instant (HDFC)' : countryCode === 'AE' ? 'Apple Pay (Stripe)' : 'eSewa Mobile Wallet',
      isCod: false,
      createdAt: '2026-10-04T05:30:00Z',
      courierName: defaultCarrier,
      trackingNumber: `${countryCode === 'IN' ? 'IN-DEL-' : countryCode === 'AE' ? 'AE-ARX-' : 'NP-CAN-'}99821447`,
      shippingLabelGenerated: true,
    },
    {
      id: 'ord-s-102',
      orderNumber: 'ORD-2026-NP-89215',
      buyerName: 'Pooja Shrestha',
      buyerPhone: '+977 9841890212',
      destinationCity: 'Pokhara (Ward 6, Lakeside)',
      itemCount: 1,
      totalAmount: countryCode === 'IN' ? 29999 : countryCode === 'AE' ? 1299 : 44999,
      currency: countryCode === 'IN' ? CurrencyCode.INR : countryCode === 'AE' ? CurrencyCode.AED : CurrencyCode.NPR,
      orderStatus: OrderStatus.PAYMENT_CONFIRMED,
      paymentMethod: countryCode === 'IN' ? 'Razorpay NetBanking' : countryCode === 'AE' ? 'Tabby 4-Month Split' : 'Khalti e-Payment',
      isCod: false,
      createdAt: '2026-10-04T07:15:00Z',
      shippingLabelGenerated: false,
    },
    {
      id: 'ord-s-103',
      orderNumber: 'ORD-2026-NP-89219',
      buyerName: 'Rabin Thapa',
      buyerPhone: '+977 9851099231',
      destinationCity: 'Biratnagar (Main Road)',
      itemCount: 2,
      totalAmount: countryCode === 'IN' ? 59998 : countryCode === 'AE' ? 2598 : 91498,
      currency: countryCode === 'IN' ? CurrencyCode.INR : countryCode === 'AE' ? CurrencyCode.AED : CurrencyCode.NPR,
      orderStatus: OrderStatus.PAYMENT_CONFIRMED,
      paymentMethod: 'Cash on Delivery (COD Verified)',
      isCod: true,
      createdAt: '2026-10-04T08:00:00Z',
      shippingLabelGenerated: false,
    },
  ]);

  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'PACKED' | 'DELIVERED'>('ALL');
  const [selectedLabel, setSelectedLabel] = useState<ShippingLabelData | null>(null);

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'PENDING') return o.orderStatus === OrderStatus.PAYMENT_CONFIRMED;
    if (activeTab === 'PACKED') return o.orderStatus === OrderStatus.PACKED || o.orderStatus === OrderStatus.IN_TRANSIT;
    if (activeTab === 'DELIVERED') return o.orderStatus === OrderStatus.DELIVERED;
    return true;
  });

  // Pack & Generate Shipping Label
  const handlePackOrder = (order: SellerOrderSummary) => {
    const awbPrefix = countryCode === 'IN' ? 'IN-DEL-' : countryCode === 'AE' ? 'AE-ARX-' : 'NP-CAN-';
    const awbNumber = order.trackingNumber || `${awbPrefix}${Math.floor(10000000 + Math.random() * 90000000)}`;

    const labelData: ShippingLabelData = {
      orderNumber: order.orderNumber,
      carrier: defaultCarrier,
      awbNumber,
      barcodeSvg: '',
      sellerStoreName: 'Sony Official Flagship Store',
      sellerTaxId:
        countryCode === 'IN'
          ? 'GSTIN 27AABCS1429B1Z8'
          : countryCode === 'AE'
          ? 'TRN 100488291000003'
          : 'PAN 601992819',
      sellerAddress:
        countryCode === 'IN'
          ? 'Nariman Point, Mumbai 400021, India'
          : countryCode === 'AE'
          ? 'Downtown Financial Center, Dubai, UAE'
          : 'Durbarmarg Commercial Center, Kathmandu, Nepal',
      buyerName: order.buyerName,
      buyerPhone: order.buyerPhone,
      buyerAddress: order.destinationCity,
      declaredValue: order.totalAmount,
      currency: order.currency,
      packageWeightKg: 0.85,
      routingCode:
        countryCode === 'IN' ? 'BOM-WEST-400' : countryCode === 'AE' ? 'DXB-DOWNTOWN-01' : 'HUB-KTM-NORTH-04',
      isCod: order.isCod,
      codCollectAmount: order.isCod ? order.totalAmount : undefined,
    };

    // Update status in orders list
    setOrders((prev) =>
      prev.map((o) =>
        o.id === order.id
          ? {
              ...o,
              orderStatus: OrderStatus.PACKED,
              trackingNumber: awbNumber,
              courierName: defaultCarrier,
              shippingLabelGenerated: true,
            }
          : o,
      ),
    );

    setSelectedLabel(labelData);
  };

  return (
    <div className="min-h-screen bg-slate-900/5 flex flex-col font-sans">
      <SellerNav countryCode={countryCode} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Order Fulfillment & Courier Dispatch
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Generate carrier-certified AWB shipping labels and hand packages over to {defaultCarrier}.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs">
              SLA Standard: Same-day dispatch before 4:00 PM
            </span>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex gap-2 mb-6 border-b border-slate-200 pb-3">
          {(
            [
              { id: 'ALL', label: 'All Orders', count: orders.length },
              {
                id: 'PENDING',
                label: 'Awaiting Packing',
                count: orders.filter((o) => o.orderStatus === OrderStatus.PAYMENT_CONFIRMED).length,
              },
              {
                id: 'PACKED',
                label: 'Packed / In Transit',
                count: orders.filter((o) => o.orderStatus === OrderStatus.PACKED || o.orderStatus === OrderStatus.IN_TRANSIT).length,
              },
              {
                id: 'DELIVERED',
                label: 'Delivered',
                count: orders.filter((o) => o.orderStatus === OrderStatus.DELIVERED).length,
              },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Order / Date</th>
                  <th className="py-3 px-4">Buyer & Destination</th>
                  <th className="py-3 px-4">Items / Total</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Fulfillment Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((ord) => {
                  const isAwaiting = ord.orderStatus === OrderStatus.PAYMENT_CONFIRMED;

                  return (
                    <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-slate-900 text-sm">{ord.orderNumber}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {new Date(ord.createdAt).toLocaleString()}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{ord.buyerName}</div>
                        <div className="text-slate-500 text-[11px]">{ord.destinationCity}</div>
                        <div className="text-slate-400 font-mono text-[10px]">{ord.buyerPhone}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 font-mono">
                          {currencySymbol} {ord.totalAmount.toLocaleString()}
                        </div>
                        <div className="text-slate-400 text-[11px]">{ord.itemCount} item(s)</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800">{ord.paymentMethod}</div>
                        {ord.isCod && (
                          <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded-sm border border-amber-200 mt-0.5 inline-block">
                            Collect on Delivery
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isAwaiting
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {isAwaiting ? 'Awaiting Packing' : 'Packed / Dispatched'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {isAwaiting ? (
                          <button
                            onClick={() => handlePackOrder(ord)}
                            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                          >
                            Pack & Print Label
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePackOrder(ord)}
                            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                          >
                            Reprint Label
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Official Courier Shipping Label Modal */}
      {selectedLabel && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div>
                <h3 className="text-base font-black text-slate-900">Carrier Shipping Label</h3>
                <span className="text-xs text-slate-500">Official AWB for {selectedLabel.carrier}</span>
              </div>
              <button
                onClick={() => setSelectedLabel(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Printable Thermal Label Sheet */}
            <div className="border-2 border-black p-4 rounded-xl text-black font-mono text-xs space-y-3 bg-white">
              {/* Carrier Header */}
              <div className="flex justify-between items-start border-b-2 border-black pb-2">
                <div>
                  <div className="font-black text-sm uppercase">{selectedLabel.carrier}</div>
                  <div className="text-[10px]">Priority Air / Surface Cargo</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px]">SORT ROUTE:</div>
                  <div className="font-black text-base">{selectedLabel.routingCode}</div>
                </div>
              </div>

              {/* Barcode & AWB */}
              <div className="text-center py-2 border-b-2 border-black">
                <div className="text-xs tracking-widest font-bold">AWB: {selectedLabel.awbNumber}</div>
                <div className="h-10 bg-slate-900 mx-auto my-1 flex items-center justify-center text-white text-[10px] tracking-widest">
                  ||||| | |||| ||| |||||| | ||||| |||| || |
                </div>
                <div className="text-[9px] text-slate-600">Scan at Origin Sorting Facility</div>
              </div>

              {/* Shipper & Consignee */}
              <div className="grid grid-cols-2 gap-2 border-b-2 border-black pb-2 text-[10px]">
                <div className="border-r border-black pr-2">
                  <div className="font-bold underline">SHIP FROM (SELLER):</div>
                  <div className="font-bold">{selectedLabel.sellerStoreName}</div>
                  <div>Tax: {selectedLabel.sellerTaxId}</div>
                  <div>{selectedLabel.sellerAddress}</div>
                </div>
                <div className="pl-1">
                  <div className="font-bold underline">SHIP TO (BUYER):</div>
                  <div className="font-bold">{selectedLabel.buyerName}</div>
                  <div>{selectedLabel.buyerAddress}</div>
                  <div>Tel: {selectedLabel.buyerPhone}</div>
                </div>
              </div>

              {/* Financial & Weight Info */}
              <div className="flex justify-between items-center text-[11px] pt-1">
                <div>
                  <span>Weight: <b>{selectedLabel.packageWeightKg} kg</b></span>
                </div>
                <div className="text-right">
                  {selectedLabel.isCod ? (
                    <span className="font-black text-xs px-2 py-0.5 bg-black text-white rounded-xs">
                      COD COLLECT: {currencySymbol} {selectedLabel.codCollectAmount?.toLocaleString()}
                    </span>
                  ) : (
                    <span className="font-bold text-slate-700">PREPAID • DO NOT COLLECT CASH</span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSelectedLabel(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 shadow-sm"
              >
                🖨️ Print Shipping Label (4x6 Thermal)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
