import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const category = searchParams.get('category') || 'all'

    const apiKey = process.env.NEWS_API_KEY

    if (!apiKey) {
      // Return mock data if API key is not configured
      return NextResponse.json({
        articles: [
          {
            id: '1',
            title: 'Latest iPhone 15 Pro Review: A Game Changer',
            description: 'The iPhone 15 Pro brings revolutionary features with titanium design and A17 Pro chip.',
            url: '#',
            urlToImage: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800',
            publishedAt: new Date().toISOString(),
            source: { name: 'TechCrunch' },
          },
          {
            id: '2',
            title: 'New MacBook Pro with M3 Chip Launched',
            description: 'Apple announces the new MacBook Pro featuring the powerful M3 chip with enhanced performance.',
            url: '#',
            urlToImage: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800',
            publishedAt: new Date(Date.now() - 3600000).toISOString(),
            source: { name: 'The Verge' },
          },
          {
            id: '3',
            title: 'Samsung Galaxy S24 Ultra: Camera Revolution',
            description: 'Samsung\'s latest flagship device features groundbreaking camera technology and AI capabilities.',
            url: '#',
            urlToImage: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800',
            publishedAt: new Date(Date.now() - 7200000).toISOString(),
            source: { name: 'Engadget' },
          },
        ],
      })
    }

    // Build query based on category
    let query = 'technology'
    if (category !== 'all') {
      query = category === 'mobile' ? 'smartphone mobile phone' :
              category === 'laptop' ? 'laptop computer' :
              category === 'gadgets' ? 'gadgets devices' :
              category === 'ai' ? 'artificial intelligence' :
              category === 'gaming' ? 'gaming console' : category
    }

    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&language=en&pageSize=20&apiKey=${apiKey}`

    const response = await fetch(url)
    const data = await response.json()

    if (data.status === 'ok') {
      return NextResponse.json({
        articles: data.articles.map((article: any, index: number) => ({
          id: `${index}`,
          title: article.title,
          description: article.description,
          url: article.url,
          urlToImage: article.urlToImage,
          publishedAt: article.publishedAt,
          source: article.source,
        })),
      })
    }

    return NextResponse.json({ articles: [] })
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json({ articles: [] })
  }
}

