import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import ThemeRegistry from './ThemeRegistry';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Pimuk — Creative Portfolio',
  description: 'Art director, designer & creative explorer based in Bangkok.',
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
