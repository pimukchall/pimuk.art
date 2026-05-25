import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import ThemeRegistry from './ThemeRegistry';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Pimuk — Full-Stack Developer & Enterprise Architect',
  description:
    'Full-Stack Developer specialising in Enterprise ERP & ISO Digital Transformation. Zero to Production. Clean Architecture. Nonthaburi, Thailand.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={geistSans.variable}>
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
