'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { CountryCode, CurrencyCode, SellerProductItem } from '@dhanshree/shared';
import { SellerNav } from '../../../../components/SellerNav';

interface PageProps {
  params: Promise<{
    country: string;
  }>;
}

export default function SellerProductsPage({ params }: PageProps) {
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

  const [products, setProducts] = useState<SellerProductItem[]>([
    {
      id: 'prod-sny-001',
      sku: 'SNY-XM5-BLK',
      title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones - Black',
      categoryName: 'Consumer Electronics > Audio',
      brandName: 'Sony',
      price: countryCode === 'IN' ? 29999 : countryCode === 'AE' ? 1299 : 44999,
      currency: countryCode === 'IN' ? CurrencyCode.INR : countryCode === 'AE' ? CurrencyCode.AED : CurrencyCode.NPR,
      stockQuantity: 42,
      warehouseLocation: countryCode === 'IN' ? 'Mumbai Bhiwandi Hub (WH-MH-01)' : countryCode === 'AE' ? 'Dubai JAFZA Freezone (WH-DXB-01)' : 'Kathmandu Central Hub (WH-KT-01)',
      status: 'ACTIVE',
      rating: 4.9,
      salesCount: 148,
      updatedAt: '2026-10-04T08:30:00Z',
    },
    {
      id: 'prod-sny-002',
      sku: 'SNY-XM5-SLV',
      title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones - Platinum Silver',
      categoryName: 'Consumer Electronics > Audio',
      brandName: 'Sony',
      price: countryCode === 'IN' ? 29999 : countryCode === 'AE' ? 1299 : 44999,
      currency: countryCode === 'IN' ? CurrencyCode.INR : countryCode === 'AE' ? CurrencyCode.AED : CurrencyCode.NPR,
      stockQuantity: 8,
      warehouseLocation: countryCode === 'IN' ? 'Mumbai Bhiwandi Hub (WH-MH-01)' : countryCode === 'AE' ? 'Dubai JAFZA Freezone (WH-DXB-01)' : 'Kathmandu Central Hub (WH-KT-01)',
      status: 'ACTIVE',
      rating: 4.8,
      salesCount: 86,
      updatedAt: '2026-10-03T14:15:00Z',
    },
    {
      id: 'prod-apl-003',
      sku: 'APL-MBP-M3',
      title: 'Apple MacBook Pro 14" (M3 Pro 18GB/512GB)',
      categoryName: 'Computers > Laptops',
      brandName: 'Apple',
      price: countryCode === 'IN' ? 199900 : countryCode === 'AE' ? 8499 : 289999,
      currency: countryCode === 'IN' ? CurrencyCode.INR : countryCode === 'AE' ? CurrencyCode.AED : CurrencyCode.NPR,
      stockQuantity: 15,
      warehouseLocation: countryCode === 'IN' ? 'Bangalore Whitefield Hub (WH-KA-02)' : countryCode === 'AE' ? 'Dubai Silicon Oasis (WH-DXB-02)' : 'Lalitpur Logistics Hub (WH-LP-02)',
      status: 'ACTIVE',
      rating: 5.0,
      salesCount: 34,
      updatedAt: '2026-10-02T11:00:00Z',
    },
    {
      id: 'prod-sam-004',
      sku: 'SAM-S24U-512',
      title: 'Samsung Galaxy S24 Ultra 512GB Titanium Black',
      categoryName: 'Mobile Phones > Flagships',
      brandName: 'Samsung',
      price: countryCode === 'IN' ? 129999 : countryCode === 'AE' ? 4699 : 184999,
      currency: countryCode === 'IN' ? CurrencyCode.INR : countryCode === 'AE' ? CurrencyCode.AED : CurrencyCode.NPR,
      stockQuantity: 0,
      warehouseLocation: countryCode === 'IN' ? 'Delhi NCR Hub (WH-DL-01)' : countryCode === 'AE' ? 'Dubai JAFZA Freezone (WH-DXB-01)' : 'Kathmandu Central Hub (WH-KT-01)',
      status: 'OUT_OF_STOCK',
      rating: 4.7,
      salesCount: 112,
      updatedAt: '2026-10-01T09:20:00Z',
    },
  ]);

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ACTIVE' | 'LOW_STOCK' | 'OUT_OF_STOCK'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Add Product Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSku, setNewSku] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newStock, setNewStock] = useState('20');
  const [newCategory, setNewCategory] = useState('Consumer Electronics');
  const [newWarehouse, setNewWarehouse] = useState('Central Warehouse');
  const [newDescription, setNewDescription] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Bulk CSV state
  const defaultCsv = `sku,title,category,price,stock,warehouse
SNY-LINKBUDS-S,Sony LinkBuds S Truly Wireless,Audio,${countryCode === 'IN' ? '12990' : countryCode === 'AE' ? '549' : '19999'},25,Main Regional WH
ANKER-737-GAN,Anker 737 GaN 140W PowerBank,Accessories,${countryCode === 'IN' ? '9999' : countryCode === 'AE' ? '399' : '14500'},30,Main Regional WH
KEYCHRON-Q1-PRO,Keychron Q1 Pro Wireless Mechanical Keyboard,Peripherals,${countryCode === 'IN' ? '18500' : countryCode === 'AE' ? '799' : '28500'},12,East Logistic Center`;

  const [csvContent, setCsvContent] = useState(defaultCsv);
  const [bulkStatusMsg, setBulkStatusMsg] = useState<string | null>(null);

  // Filtered products list
  const filteredProducts = products.filter((p) => {
    if (activeFilter === 'ACTIVE' && p.stockQuantity === 0) return false;
    if (activeFilter === 'LOW_STOCK' && (p.stockQuantity > 10 || p.stockQuantity === 0)) return false;
    if (activeFilter === 'OUT_OF_STOCK' && p.stockQuantity > 0) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    }
    return true;
  });

  // Handle AI Description Generation
  const handleGenerateAiDescription = () => {
    if (!newTitle.trim()) {
      alert('Please enter a product title first before generating AI description.');
      return;
    }
    setIsAiGenerating(true);
    setTimeout(() => {
      setNewDescription(
        `Experience premier performance with the ${newTitle}. Crafted with surgical precision, industry-leading components, and optimized for maximum durability. Includes full 1-year manufacturer warranty, zero-hassle exchange guarantee, and priority regional dispatch.`
      );
      setIsAiGenerating(false);
    }, 700);
  };

  // Submit Add Product Form
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSku || !newPrice) return;

    const newItem: SellerProductItem = {
      id: `prod-user-${Date.now()}`,
      sku: newSku.toUpperCase(),
      title: newTitle,
      categoryName: newCategory,
      brandName: 'Sony Flagship Store',
      price: parseFloat(newPrice),
      currency: countryCode === 'IN' ? CurrencyCode.INR : countryCode === 'AE' ? CurrencyCode.AED : CurrencyCode.NPR,
      stockQuantity: parseInt(newStock, 10) || 0,
      warehouseLocation: newWarehouse,
      status: parseInt(newStock, 10) > 0 ? 'ACTIVE' : 'OUT_OF_STOCK',
      rating: 5.0,
      salesCount: 0,
      updatedAt: new Date().toISOString(),
    };

    setProducts([newItem, ...products]);
    setShowAddModal(false);
    setNewTitle('');
    setNewSku('');
    setNewPrice('');
    setNewDescription('');
  };

  // Submit Bulk Upload
  const handleBulkUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = csvContent.split('\n').filter((l) => l.trim().length > 0);
    if (lines.length < 2) {
      setBulkStatusMsg('Error: CSV must contain header and at least 1 item row');
      return;
    }

    const newItems: SellerProductItem[] = [];
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map((c) => c.trim());
      if (parts.length >= 4) {
        newItems.push({
          id: `prod-bulk-${Date.now()}-${i}`,
          sku: parts[0].toUpperCase(),
          title: parts[1],
          categoryName: parts[2],
          brandName: 'Bulk Catalog Import',
          price: parseFloat(parts[3]) || 1000,
          currency: countryCode === 'IN' ? CurrencyCode.INR : countryCode === 'AE' ? CurrencyCode.AED : CurrencyCode.NPR,
          stockQuantity: parseInt(parts[4], 10) || 10,
          warehouseLocation: parts[5] || 'Primary Hub',
          status: 'ACTIVE',
          rating: 5.0,
          salesCount: 0,
          updatedAt: new Date().toISOString(),
        });
      }
    }

    setProducts([...newItems, ...products]);
    setBulkStatusMsg(`Success! Imported ${newItems.length} products into active inventory.`);
    setTimeout(() => {
      setShowBulkModal(false);
      setBulkStatusMsg(null);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-900/5 flex flex-col font-sans">
      <SellerNav countryCode={countryCode} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Products & Inventory Catalog
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage multi-warehouse stock, SKUs, and pricing across your {countryCode} storefront.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowBulkModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs transition-colors"
            >
              <span>📄 Bulk CSV Upload</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
            >
              <span>+ Add New Product</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {(
              [
                { id: 'ALL', label: 'All Products', count: products.length },
                { id: 'ACTIVE', label: 'Active', count: products.filter((p) => p.stockQuantity > 0).length },
                { id: 'LOW_STOCK', label: 'Low Stock (≤10)', count: products.filter((p) => p.stockQuantity > 0 && p.stockQuantity <= 10).length },
                { id: 'OUT_OF_STOCK', label: 'Out of Stock', count: products.filter((p) => p.stockQuantity === 0).length },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  activeFilter === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          <div className="w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by SKU, Title, or Brand..."
              className="w-full text-xs px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Product / SKU</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock & Warehouse</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Sales & Rating</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => {
                  const isLow = p.stockQuantity > 0 && p.stockQuantity <= 10;
                  const isOut = p.stockQuantity === 0;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm max-w-xs truncate">{p.title}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">SKU: {p.sku}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {p.categoryName}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {currencySymbol} {p.price.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-bold ${
                              isOut ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-slate-900'
                            }`}
                          >
                            {p.stockQuantity} units
                          </span>
                          {isLow && <span className="text-[10px] text-amber-600 font-bold">(Low)</span>}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[200px]">
                          {p.warehouseLocation}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isOut
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : isLow
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'Active'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="font-semibold text-slate-800">{p.salesCount} sold</div>
                        <div className="text-[10px] text-amber-500">★ {p.rating}</div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            const newQty = prompt(`Update stock for ${p.sku}:`, String(p.stockQuantity));
                            if (newQty !== null) {
                              const parsed = parseInt(newQty, 10);
                              if (!isNaN(parsed) && parsed >= 0) {
                                setProducts(
                                  products.map((item) =>
                                    item.id === p.id
                                      ? {
                                          ...item,
                                          stockQuantity: parsed,
                                          status: parsed > 0 ? 'ACTIVE' : 'OUT_OF_STOCK',
                                        }
                                      : item,
                                  ),
                                );
                              }
                            }
                          }}
                          className="px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold"
                        >
                          Edit Stock
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <div>
                <h3 className="text-lg font-black text-slate-900">Add New Marketplace Listing</h3>
                <p className="text-xs text-slate-500">List an item in the {countryCode} Storefront</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Sony WH-1000XM5 ANC Headphones"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                    placeholder="e.g. SNY-XM5-WHT"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 uppercase font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price ({currencySymbol}) *</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="44999"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Warehouse Allocation</label>
                  <select
                    value={newWarehouse}
                    onChange={(e) => setNewWarehouse(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
                  >
                    <option value="Kathmandu Central Hub (WH-KT-01)">Kathmandu Central Hub (WH-KT-01)</option>
                    <option value="Lalitpur Logistics Hub (WH-LP-02)">Lalitpur Logistics Hub (WH-LP-02)</option>
                    <option value="Mumbai Bhiwandi Hub (WH-MH-01)">Mumbai Bhiwandi Hub (WH-MH-01)</option>
                    <option value="Dubai JAFZA Freezone (WH-DXB-01)">Dubai JAFZA Freezone (WH-DXB-01)</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">Product Description & Copy</label>
                  <button
                    type="button"
                    onClick={handleGenerateAiDescription}
                    disabled={isAiGenerating}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-bold shadow-xs hover:opacity-90"
                  >
                    <span>✨</span>
                    <span>{isAiGenerating ? 'Synthesizing AI Copy...' : 'AI Generate Description'}</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Enter detailed description or click AI Generate to write SEO-optimized copy automatically..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden leading-relaxed"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20"
                >
                  Save & Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk CSV Upload Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">Bulk Product CSV Import</h3>
                <p className="text-xs text-slate-500">Upload or paste tabular inventory rows for instant ingestion</p>
              </div>
              <button
                onClick={() => setShowBulkModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {bulkStatusMsg && (
              <div
                className={`p-3 rounded-xl mb-4 text-xs font-bold ${
                  bulkStatusMsg.startsWith('Success')
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {bulkStatusMsg}
              </div>
            )}

            <form onSubmit={handleBulkUpload} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">CSV Content (sku,title,category,price,stock,warehouse)</label>
                <textarea
                  rows={8}
                  value={csvContent}
                  onChange={(e) => setCsvContent(e.target.value)}
                  className="w-full font-mono text-[11px] p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-slate-50 leading-relaxed"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-100 text-slate-600 text-[11px] leading-relaxed">
                <b>Tip:</b> Prices should match your current market currency ({currencySymbol}). Duplicate SKUs will be rejected automatically.
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowBulkModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 shadow-xs"
                >
                  Parse & Ingest Products
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
