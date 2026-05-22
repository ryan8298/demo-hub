import { NextRequest, NextResponse } from 'next/server';
import { fetchMetaTags } from '@/lib/fetchMetaTags';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { demo_url } = body;

    if (!demo_url) {
      return NextResponse.json(
        { error: 'demo_url required' },
        { status: 400 }
      );
    }

    const metaData = await fetchMetaTags(demo_url);
    return NextResponse.json(metaData);
  } catch (error) {
    console.error('Preview scrape error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preview' },
      { status: 500 }
    );
  }
}