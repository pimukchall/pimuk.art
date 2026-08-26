import { NextResponse } from 'next/server';
import { runDueRecurringRules } from '@/lib/recurring-engine';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await runDueRecurringRules();
  return NextResponse.json(result);
}
