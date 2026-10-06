'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface DepartmentItem {
  name: string;
  category: string;
  icon?: string;
  badge?: string;
}

export const DHANSHREE_DEPARTMENTS_DATA: DepartmentItem[] = [
  { name: 'All Departments', category: 'All', icon: '🌐' },
  { name: 'Computers & Laptops', category: 'Computers', icon: '💻' },
  { name: 'Electronics & Gadgets', category: 'Electronics', icon: '⚡' },
  { name: 'Mobile & Tablets', category: 'Mobile & Tablets', icon: '📱' },
  { name: 'Audio & Headphones', category: 'Audio & Headphones', icon: '🎧' },
  { name: 'Smart TVs & Video', category: 'Smart TVs & Video', icon: '📺' },
  { name: 'Home & Kitchen', category: 'Home & Kitchen', icon: '🍳' },
  { name: 'Kitchen & Dining', category: 'Kitchen & Dining', icon: '🍽️' },
  { name: 'Pooja & Mandir', category: 'Pooja & Mandir', icon: '🪔' },
  { name: 'Beauty & Personal Care', category: 'Beauty & Personal Care', icon: '🌿' },
  { name: 'Fashion & Apparel', category: 'Fashion & Apparel', icon: '👗' },
  { name: "Men's Fashion", category: "Men's Fashion", icon: '👔' },
  { name: "Women's Fashion", category: "Women's Fashion", icon: '🥻' },
  { name: 'Kids & Baby', category: 'Kids & Baby', icon: '👶' },
  { name: 'Toys & Games', category: 'Toys & Games', icon: '🎮' },
  { name: 'Fitness & Sports', category: 'Fitness & Sports', icon: '🏋️' },
  { name: 'Festive Deals & Hampers', category: 'Festive Deals & Hampers', icon: '🏮' },
  { name: 'Books & Learning', category: 'Books & Learning', icon: '📚' },
  { name: 'Bestsellers', category: 'Bestsellers', icon: '⭐', badge: 'Hot' },
  { name: 'Deals & Offers', category: 'Deals & Offers', icon: '🏷️', badge: 'Up to 70%' },
];

export const DHANSHREE_DEPARTMENTS = DHANSHREE_DEPARTMENTS_DATA.map((d) => d.name);

// For backwards compatibility
export const AMAZON_DEPARTMENTS = DHANSHREE_DEPARTMENTS;

export interface DhanshreeCategoryDropdownProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export function DhanshreeCategoryDropdown({
  selectedCategory,
  onSelectCategory,
}: DhanshreeCategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayLabel =
    !selectedCategory || selectedCategory === 'All' || selectedCategory === 'All Departments'
      ? 'All'
      : selectedCategory.length > 13
      ? `${selectedCategory.slice(0, 12)}..`
      : selectedCategory;

  return (
    <div className="relative h-full" ref={dropdownRef}>
      {/* Category Toggle Button with Slightly Curved Left Corner */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-full bg-[#f1f3f5] hover:bg-[#e4e7eb] text-[#0f1111] text-xs px-3 font-semibold border-r border-[#d1d5db] cursor-pointer flex items-center gap-1.5 transition-colors select-none rounded-l-xl shrink-0"
        aria-label="Category Selection"
        title={`Department: ${selectedCategory || 'All'}`}
      >
        <span className="truncate max-w-[85px]">{displayLabel}</span>
        <span className="text-[9px] text-slate-500 font-bold">▾</span>
      </button>

      {/* Tall Scrollable Category Menu */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 w-64 max-h-[380px] overflow-y-auto bg-white rounded-xl shadow-2xl border border-slate-300 z-50 text-xs text-[#0f1111] divide-y divide-slate-100 animate-in fade-in">
          {DHANSHREE_DEPARTMENTS_DATA.map((dept) => {
            const isCurrent =
              (dept.name === 'All Departments' &&
                (!selectedCategory || selectedCategory === 'All' || selectedCategory === 'All Departments')) ||
              selectedCategory === dept.name ||
              selectedCategory === dept.category;

            return (
              <button
                key={dept.name}
                type="button"
                onClick={() => {
                  onSelectCategory(dept.name === 'All Departments' ? 'All' : dept.name);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                  isCurrent
                    ? 'bg-amber-100 font-bold text-amber-950'
                    : 'hover:bg-[#007185] hover:text-white text-slate-800'
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  <span className="text-sm shrink-0">{dept.icon}</span>
                  <span className="truncate">{dept.name}</span>
                </span>
                <span className="flex items-center gap-1 shrink-0 ml-2">
                  {dept.badge && (
                    <span className="text-[9px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.5 rounded-full">
                      {dept.badge}
                    </span>
                  )}
                  {isCurrent && <span className="text-amber-800 text-[11px] font-bold">✓</span>}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default DhanshreeCategoryDropdown;
