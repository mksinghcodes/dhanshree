'use client';

import React, { useState, useRef, useEffect } from 'react';

export const AMAZON_DEPARTMENTS = [
  'All Departments',
  'Arts & Crafts',
  'Automotive',
  'Baby',
  'Beauty & Personal Care',
  'Books',
  "Boys' Fashion",
  'Computers',
  'Deals',
  'Digital Music',
  'Electronics',
  "Girls' Fashion",
  'Health & Household',
  'Home & Kitchen',
  'Industrial & Scientific',
  'Kindle Store',
  'Luggage',
  "Men's Fashion",
  'Movies & TV',
  'Music, CDs & Vinyl',
  'Pet Supplies',
  'Prime Video',
  'Software',
  'Sports & Outdoors',
  'Tools & Home Improvement',
  'Toys & Games',
  'Video Games',
];

interface AmazonCategoryDropdownProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export function AmazonCategoryDropdown({
  selectedCategory,
  onSelectCategory,
}: AmazonCategoryDropdownProps) {
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

  const displayLabel = selectedCategory === 'All' || selectedCategory === 'All Departments'
    ? 'All'
    : selectedCategory.length > 12
    ? `${selectedCategory.slice(0, 11)}..`
    : selectedCategory;

  return (
    <div className="relative h-full" ref={dropdownRef}>
      {/* Category Toggle Button matching Image 3 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-full bg-[#e6e6e6] hover:bg-[#d4d4d4] text-[#0f1111] text-xs px-2.5 font-medium border-r border-[#cdcdcd] cursor-pointer flex items-center gap-1.5 transition-colors select-none"
        aria-label="Category Selection"
      >
        <span className="truncate max-w-[85px]">{displayLabel}</span>
        <span className="text-[9px] text-slate-500 font-bold">▾</span>
      </button>

      {/* Tall Scrollable Category Menu (Exact match of Image 3) */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-60 max-h-[380px] overflow-y-auto bg-white rounded-md shadow-2xl border border-slate-300 z-50 text-xs text-[#0f1111] divide-y divide-slate-100 animate-in fade-in">
          {AMAZON_DEPARTMENTS.map((dept) => {
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
                className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between ${
                  isCurrent
                    ? 'bg-slate-200 font-bold text-slate-950'
                    : 'hover:bg-[#007185] hover:text-white text-slate-800'
                }`}
              >
                <span>{dept}</span>
                {isCurrent && <span className="text-slate-600 text-[11px]">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
