import React from 'react';

export interface DhanshreeLogoProps {
  /**
   * Presentation variant:
   * - 'full': Monogram emblem + "DHANSHREE" wordmark + "ONLINE/RETAIL" subtitle
   * - 'icon': Standalone monogram emblem (ideal for mobile, favicon, compact header)
   * - 'horizontal': Streamlined single-row lockup
   */
  variant?: 'full' | 'icon' | 'horizontal';

  /**
   * Color theme mode:
   * - 'dark': For dark backgrounds like Royal Navy (#0F172A / #0D1B2A)
   * - 'light': For pure white (#FFFFFF) or light neutral canvases
   */
  theme?: 'dark' | 'light';

  /**
   * Sub-brand label under DHANSHREE
   * Default is "ONLINE"
   */
  subtext?: 'ONLINE' | 'RETAIL' | string;

  /**
   * Optional country code extension (e.g. "NP", "IN", "AE")
   */
  countryCode?: string;

  /**
   * Preset sizes or custom class
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;

  /**
   * Accessible text for screen readers
   */
  ariaLabel?: string;
}

/**
 * Pure Vector SVG Monogram Emblem for Dhanshree
 * Combines the Capital Letter "D", Shopping Bag handle, and Upward Growth Arrow in negative space.
 */
export const DhanshreeEmblem: React.FC<{
  size?: number;
  theme?: 'dark' | 'light';
  className?: string;
}> = ({ size = 36, theme = 'dark', className = '' }) => {
  const isDark = theme === 'dark';
  const bagColor = isDark ? '#FFFFFF' : '#0F172A';
  const handleColor = '#F59E0B'; // Luxury Warm Gold
  const arrowColor = '#10B981'; // Vibrant Emerald Green
  const arrowGold = '#F59E0B'; // Gold accent on arrowhead

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-200 group-hover:scale-105 ${className}`}
      aria-hidden="true"
    >
      <defs>
        {/* Emerald to Teal Growth Gradient */}
        <linearGradient id="dhanshreeArrowGrad" x1="20" y1="80" x2="80" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>

        {/* Subtle drop shadow for app icon fidelity */}
        <filter id="dhanshreeGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* 1. Shopping Bag Handle Arched Loop at Top */}
      <path
        d="M38 28 C38 15, 62 15, 62 28"
        stroke={handleColor}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Handle Anchor Rivets */}
      <circle cx="38" cy="28" r="2.5" fill={handleColor} />
      <circle cx="62" cy="28" r="2.5" fill={handleColor} />

      {/* 2. Capital Letter "D" / Shopping Bag Silhouette Body */}
      {/* Smooth outer curve with rounded corners */}
      <path
        d="M20 28 C20 25.8 21.8 24 24 24 H56 C75.9 24 92 40.1 92 60 C92 79.9 75.9 96 56 96 H24 C21.8 96 20 94.2 20 92 V28 Z"
        fill={bagColor}
      />

      {/* 3. Inner Negative Space Counter of the "D" */}
      <path
        d="M34 38 H54 C66.2 38 76 47.8 76 60 C76 72.2 66.2 82 54 82 H34 V38 Z"
        fill={isDark ? '#0F172A' : '#FFFFFF'}
      />

      {/* 4. Dynamic Upward Growth Arrow sculpted inside and breaking upward */}
      {/* Arrow Shaft (Zig-zag upward trajectory representing trade expansion) */}
      <path
        d="M26 76 L42 60 L52 68 L74 44"
        stroke="url(#dhanshreeArrowGrad)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Arrow Head (Dynamic directional pointer toward North-East / Ishan zone) */}
      <path
        d="M62 42 H76 V56 Z"
        fill={arrowGold}
      />
      <path
        d="M60 40 L78 40 L78 58 L72 52 L66 58 Z"
        fill="#10B981"
      />
    </svg>
  );
};

/**
 * Complete Professional Dhanshree Logo Component
 */
export const DhanshreeLogo: React.FC<DhanshreeLogoProps> = ({
  variant = 'full',
  theme = 'dark',
  subtext = 'ONLINE',
  countryCode,
  size = 'md',
  className = '',
  ariaLabel = 'Dhanshree - Shop. Discover. Delight',
}) => {
  const isDark = theme === 'dark';

  // Sizing definitions
  const sizeMap = {
    xs: { icon: 24, font: 'text-sm', sub: 'text-[9px]', tracking: 'tracking-normal' },
    sm: { icon: 28, font: 'text-base', sub: 'text-[10px]', tracking: 'tracking-wider' },
    md: { icon: 38, font: 'text-xl sm:text-2xl', sub: 'text-[11px]', tracking: 'tracking-widest' },
    lg: { icon: 48, font: 'text-2xl sm:text-3xl', sub: 'text-xs', tracking: 'tracking-[0.25em]' },
    xl: { icon: 60, font: 'text-4xl sm:text-5xl', sub: 'text-sm', tracking: 'tracking-[0.3em]' },
  };

  const currentSize = sizeMap[size];

  // If icon-only variant
  if (variant === 'icon') {
    return (
      <div
        className={`inline-flex items-center justify-center ${className}`}
        role="img"
        aria-label={ariaLabel}
      >
        <DhanshreeEmblem size={currentSize.icon} theme={theme} />
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2.5 select-none font-sans group ${className}`}
      role="img"
      aria-label={ariaLabel}
    >
      {/* 1. Left Monogram Emblem */}
      <DhanshreeEmblem size={currentSize.icon} theme={theme} />

      {/* 2. Wordmark + Subtitle Hierarchy */}
      <div className="flex flex-col justify-center leading-none">
        {/* Main Brand Wordmark */}
        <div className="flex items-baseline">
          <span
            className={`font-black ${currentSize.font} tracking-tight font-sans uppercase ${
              isDark ? 'text-white' : 'text-[#0F172A]'
            }`}
          >
            DHANSHREE
          </span>

          {countryCode && (
            <span className="text-[11px] font-bold text-[#F59E0B] ml-1 lowercase">
              .{countryCode.toLowerCase()}
            </span>
          )}
        </div>

        {/* Secondary Subtitle with Emerald Accent */}
        <div className="flex items-center justify-between gap-1 mt-0.5">
          <span
            className={`font-bold ${currentSize.sub} uppercase tracking-[0.22em] ${
              isDark ? 'text-[#10B981]' : 'text-[#059669]'
            }`}
          >
            {subtext}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
          <span className="text-[9px] text-slate-400 font-semibold tracking-wider hidden sm:inline">
            PROSPERITY
          </span>
        </div>
      </div>
    </div>
  );
};

export default DhanshreeLogo;
