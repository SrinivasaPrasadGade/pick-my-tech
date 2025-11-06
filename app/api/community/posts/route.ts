import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const category = searchParams.get('category') || 'all'

    const where = category !== 'all' ? { category } : {}

    const posts = await prisma.post.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        comments: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    })

    const postsWithCounts = posts.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      category: post.category || 'general',
      upvotes: post.upvotes,
      comments: post.comments.length,
      createdAt: post.createdAt.toISOString(),
      user: {
        name: post.user.name || 'Anonymous',
        image: post.user.image || undefined,
      },
    }))

    return NextResponse.json({ posts: postsWithCounts })
  } catch (error) {
    console.error('Error fetching posts:', error)
    // Return mock data
    return NextResponse.json({
      posts: [
        {
          id: '1',
          title: 'Best laptop for programming in 2024?',
          content: 'I\'m looking for a laptop under ₹1,00,000 for software development. Any recommendations?',
          category: 'question',
          upvotes: 24,
          comments: 12,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          user: {
            name: 'John Doe',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
          },
        },
        {
          id: '2',
          title: 'iPhone 15 Pro Max Review - Is it worth it?',
          content: 'Just got my hands on the new iPhone 15 Pro Max. Here are my thoughts after using it for a week...',
          category: 'review',
          upvotes: 45,
          comments: 28,
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          user: {
            name: 'Sarah Johnson',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
          },
        },
      ],
    })
  }
}

