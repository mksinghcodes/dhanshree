'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CountryCode, CurrencyCode, AiProductRecommendation } from '@dhanshree/shared';

interface AiShoppingAssistantProps {
  countryCode: CountryCode;
}

export function AiShoppingAssistant({ countryCode }: AiShoppingAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const isIndia = countryCode === CountryCode.INDIA;
  const isUae = countryCode === CountryCode.UAE;

  const currencySymbol = isIndia ? '₹' : isUae ? 'AED' : 'रु';
  const currencyCode = isIndia ? CurrencyCode.INR : isUae ? CurrencyCode.AED : CurrencyCode.NPR;

  const [messages, setMessages] = useState<
    { role: 'assistant' | 'user'; content: string; recommendations?: AiProductRecommendation[] }[]
  >([
    {
      role: 'assistant',
      content: `Namaste & Welcome! I am your AI Shopping Concierge for the ${
        countryCode === 'NP' ? 'Nepal 🇳🇵' : countryCode === 'IN' ? 'India 🇮🇳' : 'UAE 🇦🇪'
      } storefront. Ask me anything about specifications, price comparisons, or festival deals!`,
    },
  ]);

  const quickPills =
    countryCode === 'NP'
      ? ['Best ANC headphones under NPR 50K', 'Dashain festival top discounts', 'Flagship laptops for coding']
      : countryCode === 'IN'
      ? ['Best Diwali gift boxes under ₹5000', 'Top noise cancelling earbuds', 'MacBook M3 Pro pricing']
      : ['Luxury Arabian Oud & Fragrances', 'Apple iPhone & Watch bundles', 'Fast delivery Dubai Downtown'];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const newMessages = [...messages, { role: 'user' as const, content: text }];
    setMessages(newMessages);
    if (!textToSend) setInput('');
    setLoading(true);

    // Simulate intelligent NLP recommendation
    setTimeout(() => {
      const q = text.toLowerCase();
      let reply = `Based on current verified merchant inventory in ${countryCode}, here are the highest-rated recommendations matching your criteria:`;
      let recs: AiProductRecommendation[] = [];

      if (q.includes('headphone') || q.includes('audio') || q.includes('earbuds') || q.includes('anc') || q.includes('50k')) {
        recs = [
          {
            id: 'rec-001',
            title: 'Sony WH-1000XM5 ANC Wireless Headphones',
            price: isIndia ? 29999 : isUae ? 1299 : 44999,
            currency: currencyCode,
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
            slug: 'sony-wh-1000xm5-anc-headphones',
            badge: 'Top Rated',
          },
          {
            id: 'rec-002',
            title: 'Sony LinkBuds S Truly Wireless Earbuds',
            price: isIndia ? 12990 : isUae ? 549 : 19999,
            currency: currencyCode,
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300',
            slug: 'sony-linkbuds-s-truly-wireless',
            badge: 'Value Pick',
          },
        ];
        reply = `The Sony WH-1000XM5 is the absolute benchmark for active noise cancellation, featuring 8 microphones and LDAC high-res audio. Qualifies for free Prime delivery!`;
      } else if (q.includes('laptop') || q.includes('macbook') || q.includes('coding')) {
        recs = [
          {
            id: 'rec-003',
            title: 'Apple MacBook Pro 14" (M3 Pro 18GB/512GB)',
            price: isIndia ? 199900 : isUae ? 8499 : 289999,
            currency: currencyCode,
            rating: 5.0,
            image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300',
            slug: 'apple-macbook-pro-14-m3-pro',
            badge: 'Pro Tier',
          },
        ];
        reply = `For demanding software compilation and heavy multi-tasking, the Apple Silicon M3 Pro delivers unrivaled efficiency and up to 18 hours battery life.`;
      } else {
        recs = [
          {
            id: 'rec-001',
            title: 'Sony WH-1000XM5 ANC Wireless Headphones',
            price: isIndia ? 29999 : isUae ? 1299 : 44999,
            currency: currencyCode,
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
            slug: 'sony-wh-1000xm5-anc-headphones',
            badge: 'Featured Deal',
          },
        ];
        reply = `I located trending verified deals across verified flagship stores. All products include a 100% genuine guarantee and 7-day hassle-free return protection!`;
      }

      setMessages([...newMessages, { role: 'assistant', content: reply, recommendations: recs }]);
      setLoading(false);
    }, 700);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all group border border-white/20"
      >
        <span className="text-xl animate-bounce">🤖</span>
        <span className="text-xs font-black tracking-tight">AI Concierge</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </button>

      {/* Slide-out / Modal Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-end sm:justify-end p-0 sm:p-6">
          <div className="bg-white w-full sm:w-[440px] h-[92vh] sm:h-[650px] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden font-sans">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-lg shadow-sm">
                  ✨
                </div>
                <div>
                  <h3 className="text-sm font-black">AI Shopping Assistant</h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online • Grounded on {countryCode} Catalog
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xs font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs bg-slate-50">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none shadow-xs font-medium'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-xs'
                    }`}
                  >
                    {m.content}
                  </div>

                  {/* Product Recommendation Cards */}
                  {m.recommendations && m.recommendations.length > 0 && (
                    <div className="mt-3 w-full space-y-2">
                      {m.recommendations.map((rec) => (
                        <div
                          key={rec.id}
                          className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs flex items-center gap-3 hover:border-blue-400 transition-colors"
                        >
                          <img
                            src={rec.image}
                            alt={rec.title}
                            className="w-16 h-16 rounded-xl object-cover border border-slate-100 bg-slate-50 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            {rec.badge && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-blue-50 text-blue-700 border border-blue-200">
                                {rec.badge}
                              </span>
                            )}
                            <h4 className="font-bold text-slate-900 text-xs truncate mt-0.5">
                              {rec.title}
                            </h4>
                            <div className="flex items-center justify-between mt-1">
                              <span className="font-mono font-bold text-slate-900">
                                {currencySymbol} {rec.price.toLocaleString()}
                              </span>
                              <span className="text-[10px] text-amber-500 font-bold">★ {rec.rating}</span>
                            </div>
                            <Link
                              href={`/${countryCode.toLowerCase()}/products/${rec.slug}`}
                              onClick={() => setIsOpen(false)}
                              className="mt-1.5 inline-block text-[11px] font-bold text-blue-600 hover:underline"
                            >
                              View Product Details →
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-slate-400 text-xs italic">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                  Synthesizing catalog matches...
                </div>
              )}
            </div>

            {/* Quick Pills */}
            <div className="p-2.5 bg-white border-t border-slate-200 flex gap-2 overflow-x-auto scrollbar-none shrink-0">
              {quickPills.map((pill, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(pill)}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-[10px] font-semibold text-slate-700 whitespace-nowrap transition-colors"
                >
                  {pill}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask AI Concierge for recommendations..."
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm hover:bg-blue-700 disabled:opacity-40 shadow-xs"
              >
                ➔
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
