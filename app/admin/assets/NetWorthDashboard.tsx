'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { PieChart } from '@mui/x-charts/PieChart';
import { LineChart } from '@mui/x-charts/LineChart';

const TYPE_LABEL: Record<string, string> = {
  CASH: 'เงินสด',
  BANK: 'บัญชีธนาคาร',
  INVESTMENT: 'การลงทุน',
  PROPERTY: 'อสังหาฯ/ทรัพย์สิน',
  OTHER: 'อื่นๆ',
};

const TYPE_COLOR: Record<string, string> = {
  CASH: '#4ade80',
  BANK: '#38bdf8',
  INVESTMENT: '#a78bfa',
  PROPERTY: '#fb923c',
  OTHER: '#94a3b8',
};

type NetWorthData = {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  breakdown: { type: string; value: number }[];
  trend: { month: string; value: number }[];
};

const fmt = (n: number) => n.toLocaleString('th-TH', { maximumFractionDigits: 0 });

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', p: 3, flex: 1, minWidth: 180 }}>
      <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', letterSpacing: '0.05em' }}>
        {label}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 300, color, mt: 0.5 }}>
        ฿{fmt(value)}
      </Typography>
    </Box>
  );
}

export default function NetWorthDashboard() {
  const [data, setData] = useState<NetWorthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/networth')
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (!data) return null;

  const pieData = data.breakdown.map((b) => ({
    id: b.type,
    label: TYPE_LABEL[b.type] ?? b.type,
    value: b.value,
    color: TYPE_COLOR[b.type] ?? '#94a3b8',
  }));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <StatCard label="ทรัพย์สินรวม" value={data.totalAssets} color="#4ade80" />
        <StatCard label="หนี้สินรวม" value={data.totalLiabilities} color="#f87171" />
        <StatCard label="มูลค่าสุทธิ (Net Worth)" value={data.netWorth} color="#38bdf8" />
      </Box>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ border: '1px solid', borderColor: 'divider', p: 2, flex: 1, minWidth: 280 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', display: 'block', mb: 1 }}>
            สัดส่วนทรัพย์สิน
          </Typography>
          {pieData.length > 0 ? (
            <PieChart
              series={[{ data: pieData, innerRadius: 40, paddingAngle: 2, cornerRadius: 2 }]}
              height={220}
              slotProps={{ legend: { direction: 'vertical', position: { vertical: 'middle', horizontal: 'end' } } }}
            />
          ) : (
            <Typography variant="body2" color="text.disabled" sx={{ py: 6, textAlign: 'center' }}>
              ยังไม่มีข้อมูล
            </Typography>
          )}
        </Box>

        <Box sx={{ border: '1px solid', borderColor: 'divider', p: 2, flex: 1, minWidth: 280 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', display: 'block', mb: 1 }}>
            แนวโน้มมูลค่าทรัพย์สินรายเดือน
          </Typography>
          {data.trend.length > 0 ? (
            <LineChart
              xAxis={[{ data: data.trend.map((t) => t.month), scaleType: 'point' }]}
              series={[{ data: data.trend.map((t) => t.value), color: '#38bdf8', area: true }]}
              height={220}
            />
          ) : (
            <Typography variant="body2" color="text.disabled" sx={{ py: 6, textAlign: 'center' }}>
              ยังไม่มีข้อมูล
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
