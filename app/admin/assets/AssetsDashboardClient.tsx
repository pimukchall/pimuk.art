'use client';

import { useState } from 'react';
import type { Asset, Liability, Category, AssetValuation } from '@prisma/client';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import NetWorthDashboard from './NetWorthDashboard';
import AssetsClient from './AssetsClient';
import LiabilitiesClient from './LiabilitiesClient';
import CategoriesClient from './CategoriesClient';
import PageHeader from '../_components/PageHeader';

export default function AssetsDashboardClient({
  assets: initialAssets,
  liabilities: initialLiabilities,
  categories: initialCategories,
}: {
  assets: Asset[];
  liabilities: Liability[];
  categories: Category[];
  valuations: AssetValuation[];
}) {
  const [tab, setTab] = useState(0);
  const [assets, setAssets] = useState(initialAssets);
  const [liabilities, setLiabilities] = useState(initialLiabilities);
  const [categories, setCategories] = useState(initialCategories);

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 3, md: 6 }, py: { xs: 6, md: 8 } }}>
      <PageHeader title="Assets" />

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 4, borderBottom: '1px solid', borderColor: 'divider', minHeight: 36 }}>
        <Tab label="Dashboard" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', minHeight: 36 }} />
        <Tab label="Assets" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', minHeight: 36 }} />
        <Tab label="Liabilities" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', minHeight: 36 }} />
        <Tab label="Categories" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', minHeight: 36 }} />
      </Tabs>

      {tab === 0 && <NetWorthDashboard />}
      {tab === 1 && <AssetsClient assets={assets} setAssets={setAssets} />}
      {tab === 2 && <LiabilitiesClient liabilities={liabilities} setLiabilities={setLiabilities} />}
      {tab === 3 && <CategoriesClient categories={categories} setCategories={setCategories} />}
    </Container>
  );
}
