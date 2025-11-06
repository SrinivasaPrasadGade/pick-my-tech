import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { calculateRecommendationScore } from '@/lib/utils'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        preferences: true,
        quizResults: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // If user has quiz results with recommendations, use those
    if (user.quizResults?.recommendedDevices) {
      const deviceIds = JSON.parse(user.quizResults.recommendedDevices || '[]')
      const devices = await prisma.device.findMany({
        where: {
          id: { in: deviceIds },
        },
      })

      const devicesWithScores = devices.map((device) => ({
        ...device,
        score: calculateRecommendationScore(device, user.preferences),
      }))

      return NextResponse.json({
        recommendations: devicesWithScores.sort((a, b) => (b.score || 0) - (a.score || 0)),
      })
    }

    // Otherwise, generate recommendations based on preferences
    if (user.preferences) {
      const devices = await prisma.device.findMany({
        where: {
          category: user.preferences.deviceType?.toLowerCase() || undefined,
          price: {
            gte: user.preferences.budgetMin || 0,
            lte: user.preferences.budgetMax || 1000000,
          },
        },
        take: 20,
      })

      const devicesWithScores = devices.map((device) => ({
        ...device,
        score: calculateRecommendationScore(device, user.preferences),
      }))

      return NextResponse.json({
        recommendations: devicesWithScores
          .sort((a, b) => (b.score || 0) - (a.score || 0))
          .slice(0, 10),
      })
    }

    return NextResponse.json({ recommendations: [] })
  } catch (error) {
    console.error('Error fetching recommendations:', error)
    return NextResponse.json({ recommendations: [] })
  }
}

