'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import PageHeader from './_components/PageHeader';
import AdminCard from './_components/AdminCard';

type Stats = {
  unreadContacts: number;
  publishedProjects: number;
  gamesCount: number;
  itAssetsCount: number;
  licensesRenewingSoon: number;
  subscriptionsDueSoon: number;
  tasksDueOrOverdue: number;
  netWorth: number;
  monthIncome: number;
  monthExpense: number;
};

const fmt = (n: number) => n.toLocaleString('th-TH', { maximumFractionDigits: 0 });

function StatTile({ label, value, href, color = '#38bdf8' }: { label: string; value: string; href: string; color?: string }) {
  return (
    <Box component={Link} href={href} sx={{ textDecoration: 'none', flex: '1 1 200px', minWidth: 200 }}>
      <AdminCard sx={{ flexDirection: 'column', alignItems: 'flex-start', gap: 0.5, height: '100%', transition: 'border-color 0.15s', '&:hover': { borderColor: color } }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', letterSpacing: '0.05em' }}>
          {label}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 300, color }}>{value}</Typography>
      </AdminCard>
    </Box>
  );
}

export default function AdminDashboardClient({ stats }: { stats: Stats }) {
  return (
    <Container maxWidth="lg" sx={{ px: { xs: 3, md: 6 }, py: { xs: 6, md: 8 } }}>
      <PageHeader title="Dashboard" caption="overview" />

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <StatTile label="ข้อความยังไม่อ่าน" value={String(stats.unreadContacts)} href="/admin/contacts" color="#38bdf8" />
        <StatTile label="Projects เผยแพร่แล้ว" value={String(stats.publishedProjects)} href="/admin/projects" color="#4ade80" />
        <StatTile label="เกมทั้งหมด" value={String(stats.gamesCount)} href="/admin/games" color="#a78bfa" />
        <StatTile label="IT Assets ทั้งหมด" value={String(stats.itAssetsCount)} href="/admin/it-assets" color="#fb923c" />
        <StatTile label="Licenses ใกล้ต่ออายุ" value={String(stats.licensesRenewingSoon)} href="/admin/licenses" color="#facc15" />
        <StatTile label="รายจ่ายประจำใกล้ตัดเงิน" value={String(stats.subscriptionsDueSoon)} href="/admin/transactions" color="#facc15" />
        <StatTile label="Task ที่ต้องทำวันนี้/เลยกำหนด" value={String(stats.tasksDueOrOverdue)} href="/admin/tasks" color="#f87171" />
        <StatTile label="มูลค่าสุทธิ (Net Worth)" value={`฿${fmt(stats.netWorth)}`} href="/admin/assets" color="#38bdf8" />
        <StatTile label="รายรับเดือนนี้" value={`฿${fmt(stats.monthIncome)}`} href="/admin/transactions" color="#4ade80" />
        <StatTile label="รายจ่ายเดือนนี้" value={`฿${fmt(stats.monthExpense)}`} href="/admin/transactions" color="#f87171" />
      </Box>
    </Container>
  );
}
