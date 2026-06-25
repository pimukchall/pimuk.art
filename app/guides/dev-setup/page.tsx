import type { Metadata } from 'next';
import { Suspense } from 'react';
import DevSetupGuide from './DevSetupGuide';

export const metadata: Metadata = {
  title: 'Dev Environment Setup Guide — Pimuk',
  description:
    'คู่มือติดตั้งเครื่องมือพัฒนาเว็บสำหรับ Windows และ macOS — Git, Node.js, VS Code, Database, Docker และ Cloud/Deploy Tools',
};

export default function DevSetupPage() {
  return (
    <Suspense fallback={null}>
      <DevSetupGuide />
    </Suspense>
  );
}
