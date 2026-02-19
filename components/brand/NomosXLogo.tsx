
"use client";

import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'symbol' | 'wordmark';
  className?: string;
}

const symbolSizes = { sm: 28, md: 36, lg: 44, xl: 60 };
const textSizes   = { sm: 'text-[15px]', md: 'text-[18px]', lg: 'text-[22px]', xl: 'text-[30px]' };
const gapSizes    = { sm: 'gap-2', md: 'gap-2.5', lg: 'gap-3', xl: 'gap-4' };

function NomosSymbol({ px, className }: { px: number; className?: string }) {
  const r = px / 2;
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="nx-logo-grad" x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%"   stopColor="#6366F1" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <filter id="nx-logo-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Left vertical bar */}
      <path d="M 25 28 L 25 92 L 34 92 L 34 28 Z" fill="url(#nx-logo-grad)" />

      {/* Right vertical bar */}
      <path d="M 86 28 L 86 92 L 95 92 L 95 28 Z" fill="url(#nx-logo-grad)" />

      {/* Top-left to centre diagonal */}
      <path d="M 34 33 L 62 60 L 86 84 L 94 77 L 62 51 L 34 26 Z" fill="url(#nx-logo-grad)" />

      {/* Top-right to centre diagonal */}
      <path d="M 86 33 L 58 60 L 34 84 L 26 77 L 58 51 L 86 26 Z" fill="url(#nx-logo-grad)" opacity="0.85" />

      {/* Centre node */}
      <circle cx="60" cy="60" r="7"  fill="white"    filter="url(#nx-logo-glow)" />
      <circle cx="60" cy="60" r="3.5" fill="#6366F1" />
    </svg>
  );
}

export function NomosXLogo({ size = 'md', variant = 'full', className }: LogoProps) {
  const px = symbolSizes[size];

  if (variant === 'symbol') {
    return (
      <div className={cn('inline-flex items-center justify-center', className)}>
        <NomosSymbol px={px} />
      </div>
    );
  }

  if (variant === 'wordmark') {
    return (
      <div className={cn('inline-flex items-center', className)}>
        <span className={cn(
          'font-display font-semibold tracking-tight',
          'bg-gradient-to-r from-white via-indigo-200 to-white bg-clip-text text-transparent',
          textSizes[size]
        )}>
          NomosX
        </span>
      </div>
    );
  }

  return (
    <div className={cn('inline-flex items-center', gapSizes[size], className)}>
      <NomosSymbol px={px} />
      <span className={cn(
        'font-display font-semibold tracking-tight text-white/90',
        textSizes[size]
      )}>
        NomosX
      </span>
    </div>
  );
}
