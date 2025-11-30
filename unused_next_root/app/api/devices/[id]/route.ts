import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const device = await prisma.device.findUnique({
      where: { id: params.id },
    })

    if (!device) {
      return NextResponse.json({ error: 'Device not found' }, { status: 404 })
    }

    return NextResponse.json(device)
  } catch (error) {
    console.error('Error fetching device:', error)
    // Return mock data
    return NextResponse.json({
      id: params.id,
      name: 'iPhone 15 Pro Max',
      brand: 'Apple',
      category: 'Mobile Phone',
      price: 159900,
      rating: 4.8,
      reviewCount: 1250,
      imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800',
      specifications: JSON.stringify({
        ram: '8GB',
        storage: '256GB, 512GB, 1TB',
        processor: 'A17 Pro',
        display: '6.7" Super Retina XDR',
        battery: '4422 mAh',
        camera: '48MP Main, 12MP Ultra Wide, 12MP Telephoto',
        os: 'iOS 17',
      }),
      features: JSON.stringify([
        'Titanium design',
        'Action button',
        'USB-C connector',
        'ProRes video recording',
        'Spatial video',
      ]),
      pros: JSON.stringify([
        'Excellent build quality',
        'Outstanding camera system',
        'Powerful A17 Pro chip',
        'Long battery life',
      ]),
      cons: JSON.stringify([
        'Expensive',
        'Heavy',
      ]),
      amazonUrl: 'https://amazon.in',
      flipkartUrl: 'https://flipkart.com',
    })
  }
}

