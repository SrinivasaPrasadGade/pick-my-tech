import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { answers } = await req.json()

    // Get or create user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Save quiz results
    const quizResult = await prisma.quizResult.upsert({
      where: { userId: user.id },
      update: {
        answers: JSON.stringify(answers),
      },
      create: {
        userId: user.id,
        answers: JSON.stringify(answers),
      },
    })

    // Parse budget range
    const budgetRanges: Record<string, { min: number; max: number }> = {
      'Under ₹20,000': { min: 0, max: 20000 },
      '₹20,000 - ₹50,000': { min: 20000, max: 50000 },
      '₹50,000 - ₹1,00,000': { min: 50000, max: 100000 },
      '₹1,00,000 - ₹2,00,000': { min: 100000, max: 200000 },
      'Above ₹2,00,000': { min: 200000, max: 10000000 },
    }

    const budget = budgetRanges[answers.budget] || { min: 0, max: 1000000 }

    // Save user preferences
    await prisma.userPreferences.upsert({
      where: { userId: user.id },
      update: {
        deviceType: answers.deviceType,
        usageType: answers.usageType,
        budgetMin: budget.min,
        budgetMax: budget.max,
        preferredBrands: JSON.stringify(answers.preferredBrands || []),
      },
      create: {
        userId: user.id,
        deviceType: answers.deviceType,
        usageType: answers.usageType,
        budgetMin: budget.min,
        budgetMax: budget.max,
        preferredBrands: JSON.stringify(answers.preferredBrands || []),
      },
    })

    // Generate recommendations (simplified - in production, use ML algorithm)
    const devices = await prisma.device.findMany({
      where: {
        category: answers.deviceType.toLowerCase(),
        price: {
          gte: budget.min,
          lte: budget.max,
        },
      },
      take: 10,
    })

    // Calculate scores and sort
    const devicesWithScores = devices.map((device) => ({
      device,
      score: calculateScore(device, answers),
    }))

    devicesWithScores.sort((a, b) => b.score - a.score)
    const recommendedDevices = devicesWithScores.slice(0, 5).map((d) => d.device.id)

    // Update quiz result with recommendations
    await prisma.quizResult.update({
      where: { id: quizResult.id },
      data: {
        recommendedDevices: JSON.stringify(recommendedDevices),
      },
    })

    return NextResponse.json({ success: true, recommendations: recommendedDevices })
  } catch (error) {
    console.error('Error submitting quiz:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function calculateScore(device: any, answers: any): number {
  let score = 0

  // Brand preference
  if (answers.preferredBrands && answers.preferredBrands.includes(device.brand)) {
    score += 30
  }

  // Rating
  score += (device.rating / 5) * 40

  // Review count
  score += Math.min(device.reviewCount / 100, 1) * 30

  return score
}

