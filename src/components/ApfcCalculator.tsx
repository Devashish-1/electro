'use client';

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Calculator, ArrowRight, Zap, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';

export const ApfcCalculator: React.FC = () => {
  const { products, addToCart, navigateTo, setRfqModalOpen } = useStore();

  const [loadUnit, setLoadUnit] = useState<'HP' | 'kW'>('HP');
  const [loadValue, setLoadValue] = useState<number>(100);
  const [initialPf, setInitialPf] = useState<number>(0.74);
  const [targetPf, setTargetPf] = useState<number>(0.98);

  // Electrical Calculation
  const powerInKw = loadUnit === 'HP' ? loadValue * 0.746 : loadValue;
  const theta1 = Math.acos(initialPf);
  const theta2 = Math.acos(targetPf);
  const tanTheta1 = Math.tan(theta1);
  const tanTheta2 = Math.tan(theta2);
  const requiredKvarRaw = powerInKw * (tanTheta1 - tanTheta2);
  const requiredKvar = Math.max(10, Math.ceil(requiredKvarRaw / 5) * 5); // Round to nearest 5 kVAR step

  // Estimated annual penalty saving based on typical Rajasthan industrial tariff (approx ₹120 per kVA penalty per month)
  const currentKva = powerInKw / initialPf;
  const improvedKva = powerInKw / targetPf;
  const kvaDemandReduced = Math.round(currentKva - improvedKva);
  const estimatedMonthlySavings = Math.round(kvaDemandReduced * 380 + (powerInKw * 8 * 25 * 0.45));

  // Find closest matching Dagdi APFC panel in inventory
  const matchingPanel = products.find(
    (p) => p.category === 'panels-switchgear' && p.subcategory === 'APFC Panels' && (requiredKvar > 80 ? p.price > 200000 : p.price < 200000)
  ) || products[0];

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--color-surface-border)',
        boxShadow: 'var(--shadow-md)',
        overflow: 'hidden'
      }}
    >
      {/* Title Bar */}
      <div
        style={{
          backgroundColor: '#0b1b3d',
          color: '#ffffff',
          padding: '20px 24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}
      >
        <div className="flex items-center gap-3">
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--color-accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={22} color="#ffffff" />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>
              Industrial APFC & Power Factor Calculator
            </h3>
            <p style={{ fontSize: '12px', color: '#93c5fd', margin: 0 }}>
              Calculate precise capacitor kVAR required to eliminate DISCOM electricity penalty surcharges.
            </p>
          </div>
        </div>

        <span className="badge badge-amber" style={{ fontSize: '11px', padding: '4px 10px' }}>
          ENGINEERING TOOL
        </span>
      </div>

      <div className="calculator-grid" style={{ padding: '20px 16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        {/* Left Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Motor Load */}
          <div>
            <div className="flex justify-between items-center" style={{ marginBottom: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-main)' }}>
                Total Connected Motor / Inductive Load
              </label>
              <div className="flex gap-1" style={{ background: '#f1f5f9', padding: '2px', borderRadius: '4px' }}>
                <button
                  type="button"
                  onClick={() => setLoadUnit('HP')}
                  style={{
                    padding: '2px 8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    borderRadius: '3px',
                    background: loadUnit === 'HP' ? 'var(--color-accent-blue)' : 'transparent',
                    color: loadUnit === 'HP' ? '#ffffff' : 'var(--color-text-muted)'
                  }}
                >
                  HP
                </button>
                <button
                  type="button"
                  onClick={() => setLoadUnit('kW')}
                  style={{
                    padding: '2px 8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    borderRadius: '3px',
                    background: loadUnit === 'kW' ? 'var(--color-accent-blue)' : 'transparent',
                    color: loadUnit === 'kW' ? '#ffffff' : 'var(--color-text-muted)'
                  }}
                >
                  kW
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input
                type="range"
                min="10"
                max="500"
                step="5"
                value={loadValue}
                onChange={(e) => setLoadValue(Number(e.target.value))}
                style={{ flex: 1, accentColor: 'var(--color-accent-blue)' }}
              />
              <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-primary-900)', width: '90px', textAlign: 'right' }} className="tabular-nums">
                {loadValue} {loadUnit}
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              Equivalent Active Power: <strong>{powerInKw.toFixed(1)} kW</strong>
            </div>
          </div>

          {/* Current Power Factor */}
          <div>
            <div className="flex justify-between items-center" style={{ marginBottom: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-main)' }}>
                Existing Measured Power Factor (Lagging)
              </label>
              <span style={{ fontSize: '14px', fontWeight: 800, color: initialPf < 0.85 ? '#dc2626' : '#d97706' }} className="tabular-nums">
                {initialPf.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.60"
              max="0.90"
              step="0.01"
              value={initialPf}
              onChange={(e) => setInitialPf(Number(e.target.value))}
              style={{ width: '100%', accentColor: initialPf < 0.8 ? '#ef4444' : '#f59e0b' }}
            />
            {initialPf < 0.85 && (
              <div className="flex items-center gap-1" style={{ fontSize: '11px', color: '#b91c1c', marginTop: '4px' }}>
                <AlertTriangle size={13} /> Heavy power factor penalty applied by DISCOM under 0.85
              </div>
            )}
          </div>

          {/* Target Power Factor */}
          <div>
            <div className="flex justify-between items-center" style={{ marginBottom: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-main)' }}>
                Desired Target Power Factor
              </label>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#059669' }} className="tabular-nums">
                {targetPf.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.92"
              max="0.99"
              step="0.01"
              value={targetPf}
              onChange={(e) => setTargetPf(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#10b981' }}
            />
            <div style={{ fontSize: '11px', color: '#047857', marginTop: '4px' }}>
              0.98 - 0.99 earns maximum power factor rebate on your industrial energy bill.
            </div>
          </div>
        </div>

        {/* Right Sizing Result & Recommendation */}
        <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-surface-border)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-subtle)', textTransform: 'uppercase', marginBottom: '8px' }}>
            Recommended APFC Panel Sizing
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '14px' }}>
            <span style={{ fontSize: '38px', fontWeight: 900, color: 'var(--color-primary-900)', lineHeight: 1 }} className="tabular-nums">
              {requiredKvar}
            </span>
            <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-accent-blue)' }}>
              kVAR
            </span>
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
              (Total Reactive Compensation)
            </span>
          </div>

          {/* Savings Metric */}
          <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
            <div className="flex items-center gap-2" style={{ color: '#065f46', fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>
              <TrendingUp size={16} /> Estimated Bill Surcharge Savings
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#047857' }} className="tabular-nums">
              ~₹{estimatedMonthlySavings.toLocaleString('en-IN')} / month
            </div>
            <div style={{ fontSize: '11px', color: '#065f46', marginTop: '2px' }}>
              Apparent demand reduced by approx. <strong>{kvaDemandReduced} kVA</strong>.
            </div>
          </div>

          {/* Recommended Panel Card */}
          {matchingPanel && (
            <div style={{ marginTop: 'auto', backgroundColor: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-accent-blue)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Matching Dagdi APFC Panel
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary-900)', marginBottom: '4px' }}>
                {matchingPanel.name}
              </div>
              <div className="flex items-center justify-between" style={{ marginTop: '8px' }}>
                <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-primary-900)' }} className="tabular-nums">
                  ₹{matchingPanel.price.toLocaleString('en-IN')}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => addToCart(matchingPanel, 1)}
                    className="btn btn-primary btn-sm"
                    style={{ fontSize: '12px' }}
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => setRfqModalOpen(true)}
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '12px' }}
                  >
                    Quote
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
