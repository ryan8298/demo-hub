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