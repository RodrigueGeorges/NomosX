
"use client";
/**
 * NomosX Intelligence Symbol - Logo OpenClaw
 * Logo moderne symbolisant l'intelligence collective
 */


import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'full' | 'symbol' | 'wordmark'
  className?: string
}

export function NomosXLogo({ size = 'md', variant = 'full', className }: LogoProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-5xl'
  }

  if (variant === 'symbol') {
    return (
      <div className={cn('relative', sizeClasses[size], className)}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Cerveau global stylisé */}
          <circle cx="50" cy="50" r="45" fill="url(#gradient)" opacity="0.9"/>
          <path
            d="M30 35 Q50 25, 70 35 Q75 50, 70 65 Q50 75, 30 65 Q25 50, 30 35"
            fill="white"
            opacity="0.8"
          />
          {/* Lettres N et X intégrées */}
          <text x="35" y="55" fontSize="20" fontWeight="bold" fill="url(#gradient)">N</text>
          <text x="55" y="55" fontSize="20" fontWeight="bold" fill="url(#gradient)">X</text>
          
          {/* Définition du gradient */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E40AF" />
              <stop offset="50%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    )
  }

  if (variant === 'wordmark') {
    return (
      <div className={cn('flex items-center', className)}>
        <span 
          className={cn(
            'font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent',
            textSizes[size]
          )}
        >
          NomosX
        </span>
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={sizeClasses[size]}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="45" fill="url(#gradient)" opacity="0.9"/>
          <path
            d="M30 35 Q50 25, 70 35 Q75 50, 70 65 Q50 75, 30 65 Q25 50, 30 35"
            fill="white"
            opacity="0.8"
          />
          <text x="35" y="55" fontSize="20" fontWeight="bold" fill="url(#gradient)">N</text>
          <text x="55" y="55" fontSize="20" fontWeight="bold" fill="url(#gradient)">X</text>
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E40AF" />
              <stop offset="50%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <span 
        className={cn(
          'font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent',
          textSizes[size]
        )}
      >
        NomosX
      </span>
    </div>
  )
}
