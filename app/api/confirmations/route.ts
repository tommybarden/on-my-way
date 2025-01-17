// /app/api/confirmations/route.ts

import { createAdminClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';


// API-route som hämtar kvitteringar
export async function GET(request: Request) {
  const supabase = createAdminClient();

  // Hämta alarmId från query-parametrarna
  const alarmId = new URL(request.url).searchParams.get("alarmId");

  if (!alarmId) {
    return NextResponse.json({ error: "alarmId saknas" }, { status: 400 });
  }

  // Hämta kvitteringar från databasen
  const { data: confirmations, error } = await supabase
    .from('Responses')
    .select('*')
    .order('created_at')
    .eq('alarm_id', alarmId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Hämta alla användare från Supabase Authentication
  const { data: users, error: userError } = await supabase.auth.admin.listUsers();

  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 });
  }

  // Kombinera kvitteringar med användardata
  const confirmationsWithUsers = users.map((user:any) => {
    const confirmation = confirmations.find((conf) => conf.created_by === user.id);
    return { ...user, confirmation };
  });

  return NextResponse.json(confirmationsWithUsers);
}
