'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { AmazonFooter } from '@/components/AmazonFooter';
import { CountryCode, COUNTRY_CONFIGS } from '@dhanshree/shared';
import { useResolvedParams } from '@/lib/params';
import { useAuth } from '@/context/AuthContext';

interface OrdersPageProps {
  params: any;
}

export default function OrdersPage({ params }: OrdersPageProps) {
  const unwrappedParams = useResolvedParams<{ country: string }>(params);
  const code = (unwrappedParams.country || 'np').toUpperCase() as CountryCode;
  const config = COUNTRY_CONFIGS[code] || COUNTRY_CONFIGS[CountryCode.NEPAL];
  const c = code.toLowerCase();

  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'buy-again' | 'not-shipped' | 'digital' | 'cancelled'>('orders');
  const [searchOrderText, setSearchOrderText] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currencySymbol =
    config.defaultCurrency === 'NPR'
      ? 'रु'
      : config.defaultCurrency === 'INR'
      ? '₹'
      : 'AED';

  const ordersList = [
    {
      orderNumber: 'ORD-2026-NP-89215',
      date: 'October 5, 2026',
      total: code === 'NP' ? 54999 : code === 'IN' ? 34999 : 1450,
      recipient: currentUser.name,
      status: 'Arriving Tomorrow by 8 PM',
      statusSub: 'In transit with Nepal CanShip & Express Logistics',
      statusColor: 'text-[#007600]',
      itemTitle: 'Lenovo Business 15.6" FHD Laptop, Intel Processor, 8GB DDR5, 128GB Storage',
      itemSub: 'Condition: New | Sold by: Lenovo Authorized Store',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300',
      returnWindow: 'Return window eligible until November 5, 2026',
    },
    {
      orderNumber: 'ORD-2026-NP-89211',
      date: 'October 4, 2026',
      total: code === 'NP' ? 44999 : code === 'IN' ? 29999 : 1299,
      recipient: currentUser.name,
      status: 'Delivered October 4, 2026',
      statusSub: 'Package was handed directly to resident',
      statusColor: 'text-[#007600]',
      itemTitle: 'Sony WH-1000XM5 Premium Noise Cancelling Wireless Headphones',
      itemSub: 'Color: Platinum Silver | Sold by: Sony Official Flagship',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
      returnWindow: 'Return window eligible until November 4, 2026',
    },
    {
      orderNumber: 'ORD-2026-NP-89208',
      date: 'September 28, 2026',
      total: code === 'NP' ? 2450 : code === 'IN' ? 1550 : 75,
      recipient: currentUser.name,
      status: 'Delivered September 30, 2026',
      statusSub: 'Delivered to Kathmandu Hub',
      statusColor: 'text-[#007600]',
      itemTitle: 'Supreme Royal Bhaitika Bhai Masala & Dry Fruits Gift Hamper',
      itemSub: 'Festive Pack (1 KG) | Sold by: Himalayan Organics',
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300',
      returnWindow: 'Return closed on October 3, 2026',
    },
  ];

  const handleAction = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredOrders = ordersList.filter((o) =>
    o.itemTitle.toLowerCase().includes(searchOrderText.toLowerCase()) ||
    o.orderNumber.toLowerCase().includes(searchOrderText.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white text-[#0f1111] font-sans flex flex-col">
      <Header currentCountry={config.code} />

      {/* Floating Action Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#131921] text-white px-5 py-3 rounded-lg shadow-2xl border border-slate-700 flex items-center gap-2 text-xs font-bold animate-in slide-in-from-bottom-5">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-[1020px] mx-auto w-full px-4 py-6">
        {/* Breadcrumb */}
        <div className="text-xs text-slate-500 mb-2 flex items-center gap-1.5">
          <Link href={`/${c}`} className="hover:text-[#c45500] hover:underline">
            Your Account
          </Link>
          <span>›</span>
          <span className="text-[#c45500] font-semibold">Your Orders</span>
        </div>

        {/* Page Title & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-2">
          <h1 className="text-2xl sm:text-3xl font-normal text-[#0f1111]">
            Your Orders
          </h1>

          {/* Search all orders input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchOrderText}
              onChange={(e) => setSearchOrderText(e.target.value)}
              placeholder="Search all orders..."
              className="px-3 py-1.5 border border-slate-300 rounded text-xs w-60 sm:w-72 outline-none focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600]"
            />
            <button
              onClick={() => handleAction('Searching orders...')}
              className="px-4 py-1.5 bg-[#131921] hover:bg-[#232f3e] text-white rounded text-xs font-medium transition-colors"
            >
              Search Orders
            </button>
          </div>
        </div>

        {/* Amazon Order Tabs */}
        <div className="flex items-center gap-4 sm:gap-6 border-b border-slate-300 text-xs sm:text-sm font-semibold mb-6 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === 'orders'
                ? 'border-[#e77600] text-[#0f1111] font-bold'
                : 'border-transparent text-slate-600 hover:text-[#0f1111]'
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab('buy-again')}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === 'buy-again'
                ? 'border-[#e77600] text-[#0f1111] font-bold'
                : 'border-transparent text-slate-600 hover:text-[#0f1111]'
            }`}
          >
            Buy Again
          </button>
          <button
            onClick={() => setActiveTab('not-shipped')}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === 'not-shipped'
                ? 'border-[#e77600] text-[#0f1111] font-bold'
                : 'border-transparent text-slate-600 hover:text-[#0f1111]'
            }`}
          >
            Not Yet Shipped
          </button>
          <button
            onClick={() => setActiveTab('digital')}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === 'digital'
                ? 'border-[#e77600] text-[#0f1111] font-bold'
                : 'border-transparent text-slate-600 hover:text-[#0f1111]'
            }`}
          >
            Digital Orders
          </button>
          <button
            onClick={() => setActiveTab('cancelled')}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === 'cancelled'
                ? 'border-[#e77600] text-[#0f1111] font-bold'
                : 'border-transparent text-slate-600 hover:text-[#0f1111]'
            }`}
          >
            Cancelled Orders
          </button>
        </div>

        {/* Total Orders Count Bar */}
        <div className="flex items-center justify-between text-xs text-slate-600 mb-4">
          <span>
            <strong className="text-slate-900">{filteredOrders.length} orders</strong> placed in the past 3 months
          </span>
          <select className="border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 bg-slate-50 outline-none cursor-pointer">
            <option>past 3 months</option>
            <option>past 6 months</option>
            <option>2026</option>
            <option>2025</option>
          </select>
        </div>

        {/* Order Cards List (Exact Amazon Order Card Architecture) */}
        <div className="space-y-5">
          {filteredOrders.map((order) => (
            <div
              key={order.orderNumber}
              className="border border-[#d5d9d9] rounded-lg overflow-hidden bg-white shadow-xs"
            >
              {/* Order Card Top Header (#f0f2f2) */}
              <div className="bg-[#f0f2f2] px-4 py-3 border-b border-[#d5d9d9] flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
                <div className="flex flex-wrap items-center gap-6">
                  <div>
                    <span className="block uppercase text-[10px] text-slate-500 font-semibold">
                      Order Placed
                    </span>
                    <span className="font-medium text-slate-800">{order.date}</span>
                  </div>

                  <div>
                    <span className="block uppercase text-[10px] text-slate-500 font-semibold">
                      Total
                    </span>
                    <span className="font-bold text-slate-900">
                      {currencySymbol} {order.total.toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <span className="block uppercase text-[10px] text-slate-500 font-semibold">
                      Ship To
                    </span>
                    <span className="text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer font-medium">
                      {order.recipient} ▾
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="block uppercase text-[10px] text-slate-500 font-semibold">
                    Order # {order.orderNumber}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Link
                      href={`/${c}/orders/${order.orderNumber}`}
                      className="text-[#007185] hover:text-[#c45500] hover:underline font-medium"
                    >
                      View order details
                    </Link>
                    <span className="text-slate-300">|</span>
                    <button
                      onClick={() => handleAction(`इन्भ्वाइस डाउनलोड हुँदैछ (${order.orderNumber})...`)}
                      className="text-[#007185] hover:text-[#c45500] hover:underline font-medium"
                    >
                      Invoice ▾
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Card Body */}
              <div className="p-4 sm:p-5 flex flex-col lg:flex-row items-start justify-between gap-6">
                {/* Left: Status & Product Info */}
                <div className="flex-1">
                  <h3 className={`text-base sm:text-lg font-bold ${order.statusColor} mb-0.5`}>
                    {order.status}
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">{order.statusSub}</p>

                  <div className="flex items-start gap-4">
                    <img
                      src={order.image}
                      alt={order.itemTitle}
                      className="w-20 sm:w-24 h-20 sm:h-24 object-cover rounded border border-slate-200 shrink-0"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer leading-snug">
                        {order.itemTitle}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">{order.itemSub}</p>
                      <p className="text-xs text-slate-600 mt-2 font-medium">
                        {order.returnWindow}
                      </p>

                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={() => handleAction('सामान पुनः कार्टमा थपियो!')}
                          className="px-3.5 py-1.5 bg-[#ffd814] hover:bg-[#f7ca00] text-slate-900 rounded-full text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <span>🔄</span>
                          <span>Buy it again</span>
                        </button>
                        <Link
                          href={`/${c}/products`}
                          className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 rounded-full text-xs text-slate-800 font-medium transition-colors"
                        >
                          View your item
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Order Action Buttons */}
                <div className="w-full lg:w-56 shrink-0 flex flex-col gap-2 text-xs">
                  <Link
                    href={`/${c}/orders/${order.orderNumber}`}
                    className="w-full py-2 bg-[#ffd814] hover:bg-[#f7ca00] text-slate-900 font-bold rounded-full text-center shadow-xs transition-colors block"
                  >
                    Track package
                  </Link>

                  <button
                    onClick={() => handleAction(`सामान फिर्ता/साट्ने अनुरोध सुरु भयो (${order.orderNumber})`)}
                    className="w-full py-1.5 border border-slate-300 hover:bg-slate-50 rounded-full text-slate-800 font-medium text-center transition-colors"
                  >
                    Return or replace items
                  </button>

                  <button
                    onClick={() => handleAction('उपहार रसिद सेयरिङ लिंक प्रतिलिपि भयो!')}
                    className="w-full py-1.5 border border-slate-300 hover:bg-slate-50 rounded-full text-slate-800 font-medium text-center transition-colors"
                  >
                    Share gift receipt
                  </button>

                  <button
                    onClick={() => handleAction('बिक्रेता मूल्याङ्कन फारम खुल्यो')}
                    className="w-full py-1.5 border border-slate-300 hover:bg-slate-50 rounded-full text-slate-800 font-medium text-center transition-colors"
                  >
                    Leave seller feedback
                  </button>

                  <button
                    onClick={() => handleAction('ग्राहक समीक्षा लेख्ने फारम खुल्यो')}
                    className="w-full py-1.5 border border-slate-300 hover:bg-slate-50 rounded-full text-slate-800 font-medium text-center transition-colors"
                  >
                    Write a product review
                  </button>

                  <button
                    onClick={() => handleAction('अर्डर सफलतापूर्वक अभिलेख (Archive) गरियो')}
                    className="w-full py-1 text-slate-500 hover:text-slate-800 hover:underline text-center text-[11px]"
                  >
                    Archive order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Amazon Footer */}
      <AmazonFooter countryCode={config.code} />
    </div>
  );
}
