'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { CountryCode, CurrencyCode, AuctionItem, MakeOfferResult } from '@dhanshree/shared';
import { Header } from '../../../components/Header';

interface PageProps {
  params: Promise<{
    country: string;
  }>;
}

export default function AuctionsPage({ params }: PageProps) {
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

  const [auctions, setAuctions] = useState<AuctionItem[]>([
    {
      id: 'auc-001',
      productId: 'prod-vintage-camera',
      title: 'Leica M6 Classic 35mm Rangefinder Camera (Near Mint)',
      thumbnailUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600',
      countryCode,
      currency: countryCode === 'IN' ? CurrencyCode.INR : countryCode === 'AE' ? CurrencyCode.AED : CurrencyCode.NPR,
      startingPrice: countryCode === 'IN' ? 112500 : countryCode === 'AE' ? 4850 : 180000,
      currentBid: countryCode === 'IN' ? 153000 : countryCode === 'AE' ? 6600 : 245000,
      reservePrice: countryCode === 'IN' ? 140000 : countryCode === 'AE' ? 6000 : 220000,
      minBidIncrement: countryCode === 'IN' ? 3000 : countryCode === 'AE' ? 150 : 5000,
      totalBidsCount: 14,
      highestBidderMasked: 'b***r@gmail.com',
      endsAt: new Date(Date.now() + 3600000 * 5).toISOString(),
      status: 'ACTIVE',
      allowOffers: true,
    },
    {
      id: 'auc-002',
      productId: 'prod-macbook-custom',
      title: 'Apple MacBook Pro 16" M3 Max 64GB RAM / 2TB SSD Custom Space Black',
      thumbnailUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600',
      countryCode,
      currency: countryCode === 'IN' ? CurrencyCode.INR : countryCode === 'AE' ? CurrencyCode.AED : CurrencyCode.NPR,
      startingPrice: countryCode === 'IN' ? 180000 : countryCode === 'AE' ? 7900 : 288000,
      currentBid: countryCode === 'IN' ? 215000 : countryCode === 'AE' ? 9400 : 344000,
      reservePrice: countryCode === 'IN' ? 200000 : countryCode === 'AE' ? 8800 : 320000,
      minBidIncrement: countryCode === 'IN' ? 3000 : countryCode === 'AE' ? 150 : 5000,
      totalBidsCount: 22,
      highestBidderMasked: 'v***k@outlook.com',
      endsAt: new Date(Date.now() + 3600000 * 2).toISOString(),
      status: 'ACTIVE',
      allowOffers: true,
    },
    {
      id: 'auc-003',
      productId: 'prod-rolex-sub',
      title: 'Rolex Submariner Date 41mm Oystersteel 2024 Box & Papers',
      thumbnailUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600',
      countryCode,
      currency: countryCode === 'IN' ? CurrencyCode.INR : countryCode === 'AE' ? CurrencyCode.AED : CurrencyCode.NPR,
      startingPrice: countryCode === 'IN' ? 950000 : countryCode === 'AE' ? 42000 : 1520000,
      currentBid: countryCode === 'IN' ? 1160000 : countryCode === 'AE' ? 51500 : 1855000,
      reservePrice: countryCode === 'IN' ? 1100000 : countryCode === 'AE' ? 50000 : 1760000,
      minBidIncrement: countryCode === 'IN' ? 15000 : countryCode === 'AE' ? 1000 : 25000,
      totalBidsCount: 18,
      highestBidderMasked: 't***q@emirates.net.ae',
      endsAt: new Date(Date.now() + 3600000 * 8).toISOString(),
      status: 'ACTIVE',
      allowOffers: true,
    },
  ]);

  const [activeBidModal, setActiveBidModal] = useState<AuctionItem | null>(null);
  const [activeOfferModal, setActiveOfferModal] = useState<AuctionItem | null>(null);
  const [bidAmount, setBidAmount] = useState<string>('');
  const [offerAmount, setOfferAmount] = useState<string>('');
  const [offerMessage, setOfferMessage] = useState<string>('');
  const [offerResult, setOfferResult] = useState<MakeOfferResult | null>(null);

  const handlePlaceBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBidModal) return;

    const amt = parseFloat(bidAmount);
    const minAllowed = activeBidModal.currentBid + activeBidModal.minBidIncrement;
    if (isNaN(amt) || amt < minAllowed) {
      alert(`Minimum bid must be at least ${currencySymbol} ${minAllowed.toLocaleString()}`);
      return;
    }

    setAuctions((prev) =>
      prev.map((a) =>
        a.id === activeBidModal.id
          ? {
              ...a,
              currentBid: amt,
              totalBidsCount: a.totalBidsCount + 1,
              highestBidderMasked: 'you (Highest Bidder)',
            }
          : a,
      ),
    );

    alert(`Success! You are now the highest bidder at ${currencySymbol} ${amt.toLocaleString()}`);
    setActiveBidModal(null);
  };

  const handleMakeOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOfferModal) return;

    const amt = parseFloat(offerAmount);
    const reserve = activeOfferModal.reservePrice || activeOfferModal.currentBid;
    const ratio = amt / reserve;

    let res: MakeOfferResult;
    if (ratio >= 0.9) {
      res = {
        offerId: `off-${Date.now()}`,
        status: 'ACCEPTED',
        offerAmount: amt,
        message: 'Congratulations! The verified seller has automatically accepted your formal offer.',
      };
    } else if (ratio >= 0.75) {
      const counter = Math.round(reserve * 0.92);
      res = {
        offerId: `off-${Date.now()}`,
        status: 'COUNTERED',
        offerAmount: amt,
        counterAmount: counter,
        message: `The seller proposes a counter-offer of ${currencySymbol} ${counter.toLocaleString()}.`,
      };
    } else {
      res = {
        offerId: `off-${Date.now()}`,
        status: 'REJECTED',
        offerAmount: amt,
        message: 'Your offer is below the minimum threshold acceptable by the seller.',
      };
    }

    setOfferResult(res);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header currentCountry={countryCode} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2">
                <span>🔨</span> eBay-Style Live Marketplace Auctions
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Rare Finds, Certified Collectibles & Flagship Gear
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
                Place competitive live bids or submit private offers directly to verified collectors in {countryCode}. All transactions are 100% secured by platform escrow until physical inspection.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center shrink-0 border border-white/10">
              <div className="text-xs uppercase text-slate-300">Live Active Auctions</div>
              <div className="text-2xl font-black text-white mt-1">3 Certified Lots</div>
              <div className="text-[11px] text-emerald-400 font-bold mt-1">Escrow Backed</div>
            </div>
          </div>
        </div>

        {/* Auctions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {auctions.map((item) => {
            const minNextBid = item.currentBid + item.minBidIncrement;

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
              >
                {/* Image & Countdown */}
                <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                    Ends in 4h 32m
                  </div>
                  <div className="absolute top-3 right-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {item.totalBidsCount} Bids
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                    <div className="mt-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                      <div className="flex justify-between text-slate-500">
                        <span>Current High Bid:</span>
                        <span className="font-mono font-bold text-slate-900 text-sm">
                          {currencySymbol} {item.currentBid.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>High Bidder:</span>
                        <span className="font-mono">{item.highestBidderMasked}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                        <span>Min Next Bid:</span>
                        <span className="font-mono font-semibold text-blue-600">
                          {currencySymbol} {minNextBid.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
                    <button
                      onClick={() => {
                        setActiveBidModal(item);
                        setBidAmount(String(minNextBid));
                      }}
                      className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors"
                    >
                      Place Bid
                    </button>
                    {item.allowOffers && (
                      <button
                        onClick={() => {
                          setActiveOfferModal(item);
                          setOfferAmount(String(Math.round(item.currentBid * 0.95)));
                          setOfferResult(null);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                      >
                        Make Offer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Place Bid Modal */}
      {activeBidModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div>
                <h3 className="text-base font-black text-slate-900">Place Live Bid</h3>
                <p className="text-xs text-slate-500 truncate max-w-xs">{activeBidModal.title}</p>
              </div>
              <button
                onClick={() => setActiveBidModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePlaceBid} className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span className="text-slate-500 font-medium">Current Bid:</span>
                <span className="font-mono font-bold text-base text-slate-900">
                  {currencySymbol} {activeBidModal.currentBid.toLocaleString()}
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Your Maximum Bid ({currencySymbol}) *
                </label>
                <input
                  type="number"
                  required
                  min={activeBidModal.currentBid + activeBidModal.minBidIncrement}
                  step={activeBidModal.minBidIncrement}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-base focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Must be at least {currencySymbol} {(activeBidModal.currentBid + activeBidModal.minBidIncrement).toLocaleString()} (+{currencySymbol} {activeBidModal.minBidIncrement.toLocaleString()} increment)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-[11px] leading-relaxed">
                <b>Escrow Guarantee:</b> If you win, payment is securely held until you inspect the physical item upon arrival.
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveBidModal(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20"
                >
                  Submit Official Bid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Make Offer Modal */}
      {activeOfferModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div>
                <h3 className="text-base font-black text-slate-900">Make an Offer (eBay-Style)</h3>
                <p className="text-xs text-slate-500 truncate max-w-xs">{activeOfferModal.title}</p>
              </div>
              <button
                onClick={() => {
                  setActiveOfferModal(null);
                  setOfferResult(null);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {offerResult ? (
              <div className="space-y-4 text-xs">
                <div
                  className={`p-4 rounded-2xl border ${
                    offerResult.status === 'ACCEPTED'
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                      : offerResult.status === 'COUNTERED'
                      ? 'bg-amber-50 text-amber-900 border-amber-300'
                      : 'bg-rose-50 text-rose-900 border-rose-300'
                  }`}
                >
                  <div className="font-bold text-sm mb-1">
                    {offerResult.status === 'ACCEPTED'
                      ? '🎉 Offer Accepted!'
                      : offerResult.status === 'COUNTERED'
                      ? '🤝 Seller Counter-Offer Received'
                      : '❌ Offer Declined'}
                  </div>
                  <p className="leading-relaxed">{offerResult.message}</p>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setActiveOfferModal(null);
                      setOfferResult(null);
                    }}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleMakeOffer} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Your Proposed Price ({currencySymbol}) *
                  </label>
                  <input
                    type="number"
                    required
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-base focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Message to Seller (Optional)</label>
                  <textarea
                    rows={2}
                    value={offerMessage}
                    onChange={(e) => setOfferMessage(e.target.value)}
                    placeholder="e.g. Ready for immediate payment upon acceptance..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden leading-relaxed"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveOfferModal(null)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 shadow-xs"
                  >
                    Send Offer to Seller
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
