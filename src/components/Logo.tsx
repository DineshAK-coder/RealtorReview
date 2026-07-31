import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'color'; // 'light' for dark bg (Navbar), 'dark' for light bg, 'color' for original logo colors
  showText?: boolean;
}

export const LogoIcon: React.FC<{ sizeClass?: string; shieldColor?: string; houseColor?: string; checkColor?: string; bgFill?: string }> = ({
  sizeClass = 'w-9 h-9',
  shieldColor = '#0d3843',
  houseColor = '#e8981c',
  checkColor = '#ffffff',
  bgFill = '#ffffff',
}) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`${sizeClass} shrink-0 drop-shadow-xs`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Shield */}
      <path
        d="M 50 6 C 78 6, 90 17, 92 32 C 94 62, 73 84, 50 95 C 27 84, 6 62, 8 32 C 10 17, 22 6, 50 6 Z"
        fill={bgFill}
        stroke={shieldColor}
        strokeWidth="9"
        strokeLinejoin="round"
      />

      {/* House Base & Roof */}
      <path
        d="M 50 28 L 76 49 L 70 49 L 70 73 L 30 73 L 30 49 L 24 49 Z"
        fill={houseColor}
      />

      {/* Chimney */}
      <path
        d="M 62 38 L 62 31 L 68 31 L 68 43 Z"
        fill={houseColor}
      />

      {/* Checkmark Overlaid */}
      <path
        d="M 35 53 L 47 65 C 47 65, 62 48, 77 38"
        stroke={checkColor}
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  variant = 'light',
  showText = true,
}) => {
  // Size mapping
  const iconSizeMap = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-16 h-16',
  };

  const textSizeMap = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-4xl',
  };

  const subtextSizeMap = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-[11px]',
    xl: 'text-[13px]',
  };

  // Color schemes based on variant
  // 'light' -> header/navbar with dark bg (white/yellow text)
  // 'dark' -> white modal / light background (dark navy text)
  // 'color' -> original logo with dark teal shield & text
  let shieldColor = '#0d3843';
  let houseColor = '#e8981c';
  let checkColor = '#ffffff';
  let bgFill = '#ffffff';
  let realtorTextColor = 'text-white font-medium';
  let reviewTextColor = 'text-white font-extrabold';
  let subtextColor = 'text-teal-300';

  if (variant === 'light') {
    // Header/Navbar version on teal-950
    shieldColor = '#ffffff';
    houseColor = '#f59e0b'; // amber/gold
    checkColor = '#0f3742';
    bgFill = 'transparent';
    realtorTextColor = 'text-white font-medium';
    reviewTextColor = 'text-amber-400 font-extrabold';
    subtextColor = 'text-teal-300';
  } else if (variant === 'dark') {
    // Light background version
    shieldColor = '#0d3843';
    houseColor = '#e8981c';
    checkColor = '#ffffff';
    bgFill = '#ffffff';
    realtorTextColor = 'text-teal-950 font-normal';
    reviewTextColor = 'text-teal-950 font-black';
    subtextColor = 'text-teal-700';
  } else if (variant === 'color') {
    // Standard color version matching image exactly
    shieldColor = '#0c3843';
    houseColor = '#e8981c';
    checkColor = '#ffffff';
    bgFill = '#ffffff';
    realtorTextColor = 'text-[#0c3843] font-normal';
    reviewTextColor = 'text-[#0c3843] font-black';
    subtextColor = 'text-slate-500';
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoIcon
        sizeClass={iconSizeMap[size]}
        shieldColor={shieldColor}
        houseColor={houseColor}
        checkColor={checkColor}
        bgFill={bgFill}
      />
      {showText && (
        <div className="leading-tight">
          <div className={`${textSizeMap[size]} tracking-tight flex items-center gap-0.5`}>
            <span className={realtorTextColor}>REALTOR</span>
            <span className={reviewTextColor}>REVIEW</span>
          </div>
          <span className={`block ${subtextSizeMap[size]} font-semibold tracking-wider uppercase opacity-80 ${subtextColor}`}>
            India Rental Intelligence
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
