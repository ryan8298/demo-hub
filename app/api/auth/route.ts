import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, first_name, last_name, company_name } = body;

    if (!email || !first_name || !last_name || !company_name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const is_microsoft = email.toLowerCase().endsWith('@microsoft.com');
    const session_token = uuidv4();

    const { data, error } = await supabaseAdmin
      .from('visitor_sessions')
      .upsert(
        {
          email,
          first_name,
          last_name,
          company_name,
          is_microsoft,
          session_token
        },
        { onConflict: 'email' }
      )
      .select()
      .single();

    if (error) throw error;

    const response = NextResponse.json({ success: true, data });
    response.cookies.set('demo_session', session_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30
    });

    return response;
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}