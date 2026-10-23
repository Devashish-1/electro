'use client';

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Wrench,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  Activity,
  Award
} from 'lucide-react';

export const RewindingPage: React.FC = () => {
  const { setRewindingModalOpen, storeConfig } = useStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', paddingBottom: '60px' }}>
      {/* Hero Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, #070e20 0%, #0b1b3d 60%, #172554 100%)',
          color: '#ffffff',
          padding: '60px 0 80px'
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '780px' }}>
            <span className="badge badge-amber" style={{ marginBottom: '12px' }}>
              CERTIFIED WORKSHOP EST. 2017 • BEAWAR
            </span>
            <h1 style={{ fontSize: '40px', fontWeight: 900, lineHeight: 1.15, marginBottom: '16px' }}>
              Heavy 3-Phase Electric Motor Rewinding & Precision Overhauling
            </h1>
            <p style={{ fontSize: '16px', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '28px' }}>
              Specialized rewinding for AC induction motors (up to 150 HP), deep-well submersible borehole pumps, DC industrial armatures, and transformers. Utilizing only 100% electrolytic Milan copper and Class H 200°C insulation.
            </p>

            <div className="flex gap-3" style={{ flexWrap: 'wrap' }}>
              <button
                onClick={() => setRewindingModalOpen(true)}
                className="btn btn-amber btn-lg flex items-center gap-2"
                style={{ fontWeight: 800 }}
              >
                <Wrench size={18} />
                <span>Book Rewinding Overhaul Now</span>
              </button>

              <a
                href={`tel:${storeConfig.phone1}`}
                className="btn btn-outline btn-lg"
                style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#ffffff' }}
              >
                <Phone size={18} />
                <span>Call Workshop: {storeConfig.phone1}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6-Step Engineering Workflow */}
      <section className="container">
        <div className="section-title-wrap" style={{ textAlign: 'center' }}>
          <div className="section-tag" style={{ justifyContent: 'center' }}>
            <Activity size={14} /> Quality Standard
          </div>
          <h2 className="section-heading">Our 6-Step Precision Overhaul Process</h2>
          <p className="section-subheading" style={{ margin: '6px auto 0' }}>
            Every rewound motor undergoes rigorous testing matching original factory IE2/IE3 efficiency curves.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '20px' }}>
          {[
            { step: '01', title: 'Initial Megger & Surge Diagnosis', desc: 'Inspection of insulation resistance, winding short circuits, phase imbalance, and rotor eccentricity.' },
            { step: '02', title: 'Controlled Stripping & Core Inspection', desc: 'Coil burnout removal without heating stator laminations above 350°C to preserve magnetic core flux.' },
            { step: '03', title: 'Stator Rewinding with ETP Copper', desc: 'Hand-wound using 99.99% electrolytic Milan wire, Class H Nomex slot liners, and double phase separators.' },
            { step: '04', title: 'Vacuum Varnish Baking in Oven', desc: 'Multi-dip solventless polyester varnish impregnation cured in our temperature controlled oven.' },
            { step: '05', title: 'Computerized Dynamic Balancing', desc: 'Rotor balancing down to ISO 1940 G2.5 precision to eliminate bearing hum and shaft fatigue.' },
            { step: '06', title: 'Full Load & Hi-Pot Testing', desc: 'Final 2.5 kV dielectric withstand test, no-load current test, and thermal run verification before dispatch.' }
          ].map((item) => (
            <div
              key={item.step}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--color-surface-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--color-accent-blue)', marginBottom: '8px' }}>
                {item.step}
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-primary-900)', marginBottom: '8px' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Workshop Location & Emergency Breakdown Contact */}
      <section className="container">
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-surface-border)',
            padding: '36px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: '32px',
            alignItems: 'center',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div>
            <span className="badge badge-blue" style={{ marginBottom: '8px' }}>VISIT OUR WORKSHOP</span>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-primary-900)', marginBottom: '12px' }}>
              Dagdi Electric Motor Rewinding Works, Beawar
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
              Conveniently located in Chhawani, Beawar with dedicated crane loading bays for heavy motors up to 5 tons. Serving Ajmer, Kishangarh marble hub, Sendra road stone quarries, and Nasirabad industrial clusters.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--color-text-main)' }}>
              <div className="flex items-center gap-2">
                <MapPin size={16} color="var(--color-accent-blue)" />
                <span>Near Tejaji Ka Than, Chhawani, Beawar, Rajasthan - 305901</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} color="#d97706" />
                <span>Workshop Hours: Monday - Saturday 8:00 AM to 8:30 PM (Sunday by appointment)</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} color="#059669" />
                <span>Master Technician: {storeConfig.proprietor} ({storeConfig.phone1})</span>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#f8fafc', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-primary-900)', marginBottom: '8px' }}>
              Emergency Industrial Breakdown?
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
              We understand that motor downtime stops your entire plant. Call our emergency hotline for priority same-day rewind turnaround.
            </p>
            <button
              onClick={() => setRewindingModalOpen(true)}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginBottom: '10px' }}
            >
              Book Priority Overhaul
            </button>
            <a
              href={`tel:${storeConfig.phone1}`}
              style={{ fontSize: '13px', color: 'var(--color-accent-blue)', fontWeight: 700 }}
            >
              Or Call Hotline Directly: {storeConfig.phone1}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
