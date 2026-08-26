import type { VercelConfig } from '@vercel/config/v1';

export const config: VercelConfig = {
  crons: [{ path: '/api/cron/run-recurring', schedule: '0 1 * * *' }],
};
