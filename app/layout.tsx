import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppShell } from './AppShell';

export const metadata: Metadata = {
  title: 'DAGDI Electricals & Power Controls | Industrial Panels, Motors, Wires & Welding Electrodes',
  description:
    'Authorized industrial electrical stockist & engineering workshop in Beawar, Rajasthan. Custom APFC Panels, Ador & D&H Welding Electrodes, Milan Copper Wires, Motor Rewinding Services & B2B GST Invoicing.',
  keywords: [
    'APFC Panels',
    'Industrial Electricals',
    'Welding Electrodes',
    'Ador E7018',
    'D&H 6013',
    'Milan Copper Wire',
    'Motor Rewinding Beawar',
    'Rajasthan Electrical Distributor',
    'Power Factor Correction',
    'Submersible Pump Rewinding'
  ],
  authors: [{ name: 'DAGDI Electricals & Power Controls' }],
  metadataBase: new URL('https://dagdielectricals.com'),
  openGraph: {
    title: 'DAGDI Electricals & Power Controls — Industrial Power & Engineering Works',
    description:
      'Direct dispatch across Rajasthan and India. APFC Panels, Heavy-Duty Motors, Ador Welding Consumables & Copper Wires with 100% GST ITC.',
    url: 'https://dagdielectricals.com',
    siteName: 'DAGDI Electricals',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0b1b3d',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
