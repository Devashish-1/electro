'use client';

import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, Award, Zap, Wrench, Building, Users, MapPin, Phone } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { storeConfig, navigateTo } = useStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', paddingBottom: '60px' }}>
      {/* Hero */}
      <section
        style={{
          background: 'linear-gradient(135deg, #070e20 0%, #0b1b3d 100%)',
          color: '#ffffff',
          padding: '60px 0 70px'
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '780px' }}>
            <span className="badge badge-blue" style={{ marginBottom: '12px' }}>ABOUT US</span>
            <h1 style={{ fontSize: '38px', fontWeight: 900, marginBottom: '16px', lineHeight: 1.2 }}>
              Engineering Precision. Industrial Integrity.
            </h1>
            <p style={{ fontSize: '16px', color: '#cbd5e1', lineHeight: 1.6 }}>
              The journey of <strong>Dagdi Electric Motor Rewinding Works</strong> and our commercial brand <strong>DAGDI Electricals & Power Controls</strong> in Beawar, Rajasthan.
            </p>
          </div>
        </div>
      </section>

      {/* Story & Background */}
      <section className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-primary-900)', marginBottom: '16px' }}>
              Established in 2017 in the Heart of Rajasthan's Industrial Corridor
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '16px' }}>
              Founded under the leadership of <strong>Sandesh Dagdi Saini</strong>, Dagdi Electric Motor Rewinding Works commenced operations with a single fundamental premise: industrial machinery demands zero compromise on electrical materials.
            </p>
            <p style={{ fontSize: '15px', color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '20px' }}>
              Located in Beawar (Ajmer district) — surrounded by extensive cement plants, marble cutting factories, stone crushers, and mineral processing facilities — our workshop rapidly earned a reputation for mastering high-failure motor rewinds and engineering custom Automatic Power Factor Control (APFC) panels capable of enduring extreme thermal conditions.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '22px', fontWeight: 900, color: 'var(--color-accent-blue)' }}>7+ Years</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Continuous Engineering Operations</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '22px', fontWeight: 900, color: '#10b981' }}>5,000+</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Heavy Motors Overhauled</div>
              </div>
            </div>
          </div>

          <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
            <img
              src="/images/hero_banner.jpg"
              alt="Dagdi Manufacturing Facility"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        </div>
      </section>

      {/* Verified Core Principles */}
      <section className="container">
        <div className="section-title-wrap" style={{ textAlign: 'center' }}>
          <div className="section-tag" style={{ justifyContent: 'center' }}>
            <Award size={14} /> Our Core Values
          </div>
          <h2 className="section-heading">Why Engineers & Contractors Choose Dagdi</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-surface-border)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(0,102,255,0.1)', color: 'var(--color-accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Zap size={22} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--color-primary-900)', marginBottom: '8px' }}>
              100% Genuine Electrolytic Copper
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              We never utilize cheap secondary copper alloys. All our winding wires (Milan) and cables (KEI) are certified 99.99% pure ETP electrolytic copper conforming strictly to IS 13730 standards.
            </p>
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-surface-border)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(245,158,11,0.1)', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <ShieldCheck size={22} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--color-primary-900)', marginBottom: '8px' }}>
              Authorized Stockist Integrity
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              Direct supplier for Ador Welding, D&H Secheron, KEI Cables, and Multispan Instruments. Every electrode box and wire spool has full batch integrity and genuine factory packaging.
            </p>
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-surface-border)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(16,185,129,0.1)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Building size={22} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--color-primary-900)', marginBottom: '8px' }}>
              B2B Transparent GST Compliance
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              GSTIN <strong>{storeConfig.gstin}</strong>. We issue valid electronic tax invoices for commercial and industrial clients, enabling smooth 18% Input Tax Credit without discrepancies.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
