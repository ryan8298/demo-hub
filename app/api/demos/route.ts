import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const audience = searchParams.get('audience') || 'customer';

    let { data, error } = await supabase
      .from('demos')
      .select('*')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Filter by audience on the client side
    if (data) {
      data = data.filter(demo => demo.audience && demo.audience.includes(audience));
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching demos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch demos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Validate admin API key
    const adminKey = request.headers.get('X-Admin-Key');
    const expectedKey = process.env.ADMIN_API_KEY || process.env.NEXT_PUBLIC_ADMIN_API_KEY;
    if (adminKey !== expectedKey) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, demo_url, slug, audience, roi_summary } = body;

    // Validate required fields
    if (!title || !demo_url || !slug || !audience || audience.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('demos')
      .insert([
        {
          title,
          description: description || null,
          demo_url,
          slug,
          audience: audience,
          roi_summary: roi_summary || null,
          featured: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error creating demo:', error);
    return NextResponse.json(
      { error: 'Failed to create demo' },
      { status: 500 }
    );
  }
}