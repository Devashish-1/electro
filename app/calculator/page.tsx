import { Metadata } from 'next';
import { ApfcCalculator } from '@/components/ApfcCalculator';

export const metadata: Metadata = {
  title: 'APFC Capacitor Sizing & Power Factor Calculator | DAGDI Electricals',
  description: 'Calculate required kVAR, capacitor bank stepping, DISCOM penalty savings and ROI payback for industrial power factor correction.',
};

export default function Page() {
  return (
    <div className="container" style={{ paddingTop: '32px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '1040px', margin: '0 auto 28px' }}>
        <span className="badge badge-amber" style={{ marginBottom: '8px' }}>
          ENGINEERING UTILITY
        </span>
        <h1 style={{ fontSize: '32px', fontWeight: 900, color: 'var(--color-primary-900)', margin: '0 0 8px' }}>
          APFC Panel Sizing & Power Factor Savings Calculator
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--color-text-muted)', margin: 0 }}>
          Determine exact kVAR requirements, avoid DISCOM low-power-factor billing surcharges, and compute return on investment for custom DAGDI APFC panels.
        </p>
      </div>

      <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
        <ApfcCalculator />
      </div>
    </div>
  );
}
