import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { runDueRecurringRules } from '@/lib/recurring-engine';

export const dynamic = 'force-dynamic';

export async function POST() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const result = await runDueRecurringRules();
  return NextResponse.json(result);
}
