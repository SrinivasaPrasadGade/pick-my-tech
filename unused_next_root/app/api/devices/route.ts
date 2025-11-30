import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const devices = await prisma.device.findMany({
      take: 100,
      orderBy: {
        rating: 'desc',
      },
    })

    return NextResponse.json(devices)
  } catch (error) {
    console.error('Error fetching devices:', error)
    // Return mock data if database is not set up
    return NextResponse.json([
      {
        id: '1',
        name: 'iPhone 15 Pro Max',
        brand: 'Apple',
        category: 'Mobile Phone',
        price: 159900,
        rating: 4.8,
        reviewCount: 1250,
        imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
      },
      {
        id: '2',
        name: 'MacBook Pro 16"',
        brand: 'Apple',
        category: 'Laptop',
        price: 249900,
        rating: 4.9,
        reviewCount: 890,
        imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500',
      },
      {
        id: '3',
        name: 'Samsung Galaxy S24 Ultra',
        brand: 'Samsung',
        category: 'Mobile Phone',
        price: 129999,
        rating: 4.7,
        reviewCount: 2100,
        imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500',
      },
      {
        id: '4',
        name: 'Dell XPS 15',
        brand: 'Dell',
        category: 'Laptop',
        price: 189999,
        rating: 4.6,
        reviewCount: 650,
        imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
      },
    ])
  }
}

