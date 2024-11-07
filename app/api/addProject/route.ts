import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export async function POST(req: NextRequest) {
  try {
    const { name, description, owner_id } = await req.json();

    if (!name || !owner_id) {
      return NextResponse.json(
        { error: 'Project name are required.' },
        { status: 400 }
      );
    }

    // Generowanie unikalnego kodu dostępu
    const accessCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Zapis projektu z kodem dostępu
    const { data, error } = await supabase
      .from('projects')
      .insert([{ name, description, owner_id, access_code: accessCode }])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data, accessCode });
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred while processing the request.' },
      { status: 500 }
    );
  }
}
