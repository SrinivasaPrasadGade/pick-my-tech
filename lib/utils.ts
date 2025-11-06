import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
}

export function calculateRecommendationScore(
  device: any,
  preferences: any
): number {
  let score = 0
  const maxScore = 100

  // Budget match (30 points)
  if (preferences.budgetMin && preferences.budgetMax) {
    if (device.price >= preferences.budgetMin && device.price <= preferences.budgetMax) {
      score += 30
    } else {
      const budgetMid = (preferences.budgetMin + preferences.budgetMax) / 2
      const diff = Math.abs(device.price - budgetMid) / budgetMid
      score += Math.max(0, 30 - diff * 30)
    }
  }

  // Brand preference (20 points)
  if (preferences.preferredBrands) {
    const brands = JSON.parse(preferences.preferredBrands || '[]')
    if (brands.includes(device.brand)) {
      score += 20
    }
  }

  // Usage type match (25 points)
  if (preferences.usageType && device.specifications) {
    const specs = JSON.parse(device.specifications || '{}')
    const usageType = preferences.usageType.toLowerCase()
    
    if (usageType === 'gaming' && (specs.gpu || specs.graphics)) {
      score += 25
    } else if (usageType === 'productivity' && specs.ram && specs.ram >= 8) {
      score += 25
    } else if (usageType === 'photography' && specs.camera) {
      score += 25
    }
  }

  // Device rating (15 points)
  score += (device.rating / 5) * 15

  // Review count factor (10 points)
  const reviewFactor = Math.min(device.reviewCount / 100, 1)
  score += reviewFactor * 10

  return Math.min(score, maxScore)
}

