/**
 * Utils - Fonctions utilitaires OpenClaw
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formate une date en format lisible
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

/**
 * Formate un montant en euros
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

/**
 * Génère un slug à partir d'une chaîne
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Valide un email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Tronque un texte avec des ellipses
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

/**
 * Calcule le temps de lecture estimé
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

/**
 * Génère une couleur aléatoire
 */
export function generateRandomColor(): string {
  const colors = [
    '#1E40AF', '#7C3AED', '#059669', '#DC2626', 
    '#EA580C', '#0891B2', '#BE185D', '#65A30D'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

/**
 * Déboute une fonction
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Vérifie si un objet est vide
 */
export function isEmpty(obj: any): boolean {
  return Object.keys(obj).length === 0
}

/**
 * Clone profondément un objet
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Génère un ID unique
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

/**
 * Retarde l'exécution
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Vérifie si une URL est valide
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Formate un nombre avec séparateurs
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('fr-FR').format(num)
}

/**
 * Obtient les initiales d'un nom
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
