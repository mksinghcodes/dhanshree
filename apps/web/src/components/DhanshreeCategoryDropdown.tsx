'use client';

import React, { useState, useRef, useEffect } from 'react';

export const DHANSHREE_DEPARTMENTS = [
  'All Departments',
  'Electronics',
  'Computers & Laptops',
  'Mobile & Tablets',
  'Audio & Headphones',
  'Fashion & Apparel',
  "Men's Fashion",
  "Women's Fashion",
  "Kids & Baby",
  'Home & Kitchen',
  'Kitchen & Dining',
  'Pooja & Mandir',
  'Beauty & Personal Care',
  'Books & Learning',
  'Toys & Games',
  'Fitness & Sports',
  'Festive Hampers',
  'Deals & Offers',
  'Bestsellers',
];

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
    selectedCategory === 'All' || selectedCategory === 'All Departments'
      ? 'All'
      : selectedCategory.length > 12
      ? `${selectedCategory.slice(0, 11)}..`
      : selectedCategory;

  return (
    <div className="relative h-full" ref={dropdownRef}>
      {/* Category Toggle Button with Slightly Curved Left Corner */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-full bg-[#f1f3f5] hover:bg-[#e4e7eb] text-[#0f1111] text-xs px-3 font-semibold border-r border-[#d1d5db] cursor-pointer flex items-center gap-1.5 transition-colors select-none rounded-l-xl shrink-0"
        aria-label="Category Selection"
      >
        <span className="truncate max-w-[85px]">{displayLabel}</span>
        <span className="text-[9px] text-slate-500 font-bold">▾</span>
      </button>

      {/* Tall Scrollable Category Menu */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 w-64 max-h-[380px] overflow-y-auto bg-white rounded-xl shadow-2xl border border-slate-300 z-50 text-xs text-[#0f1111] divide-y divide-slate-100 animate-in fade-in">
          {DHANSHREE_DEPARTMENTS.map((dept) => {
            const isCurrent =
              (dept === 'All Departments' && (selectedCategory === 'All' || selectedCategory === 'All Departments')) ||
              selectedCategory === dept;

            return (
              <button
                key={dept}
                type="button"
                onClick={() => {
                  onSelectCategory(dept === 'All Departments' ? 'All' : dept);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                  isCurrent
                    ? 'bg-amber-100 font-bold text-amber-950'
                    : 'hover:bg-[#007185] hover:text-white text-slate-800'
                }`}
              >
                <span>{dept}</span>
                {isCurrent && <span className="text-amber-800 text-[11px] font-bold">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default DhanshreeCategoryDropdown;
