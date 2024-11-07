import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export async function POST(req: NextRequest) {
  try {
    const { access_code } = await req.json();

    if (!access_code) {
      return NextResponse.json(
        { error: 'Access code is required.' },
        { status: 400 }
      );
    }

    // Pobierz token z nagłówka
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token is missing.' },
        { status: 401 }
      );
    }

    // Użyj tokenu do autoryzacji
    const { data: authData, error: authError } = await supabase.auth.getUser(token);

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: 'You must be logged in to join a project.' },
        { status: 401 }
      );
    }

    const userId = authData.user.id;

    // Znajdź projekt na podstawie kodu dostępu
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('access_code', access_code)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: 'Invalid access code.' }, { status: 404 });
    }

    // Dodaj użytkownika do projektu
    const { error: insertError } = await supabase
      .from('project_members')
      .insert([{ project_id: project.id, user_id: userId }]);

    if (insertError) {
      return NextResponse.json({ error: 'Failed to join project.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Successfully joined the project.' });
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred while processing the request.' },
      { status: 500 }
    );
  }
}
