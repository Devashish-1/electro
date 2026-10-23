'use client';

import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, ShoppingCart, CheckCircle, ArrowRight } from 'lucide-react';

export const CompareModal: React.FC = () => {
  const {
    compareList,
    compareModalOpen,
    setCompareModalOpen,
    removeFromCompare,
    clearCompare,
    addToCart,
    navigateTo
  } = useStore();

  if (!compareModalOpen) return null;

  // Collect all unique specification keys across all compared products
  const allSpecKeys = Array.from(
    new Set(compareList.flatMap((p) => Object.keys(p.specs)))
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1060,
        backgroundColor: 'rgba(7, 14, 32, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={() => setCompareModalOpen(false)}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          maxWidth: '1100px',
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid var(--color-surface-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#f8fafc'
          }}
        >
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-primary-900)', margin: 0 }}>
              Technical Product Comparison Matrix ({compareList.length}/4)
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '2px 0 0' }}>
              Compare specifications, electrical ratings, materials, and pricing side-by-side.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {compareList.length > 0 && (
              <button
                onClick={clearCompare}
                className="btn btn-ghost btn-sm"
                style={{ color: '#ef4444', fontSize: '12px' }}
              >
                Clear All
              </button>
            )}
            <button onClick={() => setCompareModalOpen(false)} style={{ padding: '6px' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowX: 'auto', overflowY: 'auto', padding: '24px' }}>
          {compareList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 20px' }}>
              <p style={{ fontSize: '15px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                No products selected for comparison yet. Click the comparison icon on any product card in the catalogue.
              </p>
              <button
                onClick={() => {
                  setCompareModalOpen(false);
                  navigateTo('catalog');
                }}
                className="btn btn-primary"
              >
                Explore Catalogue
              </button>
            </div>
          ) : (
            <div className="responsive-table-wrap" style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr>
                  <th style={{ width: '220px', padding: '12px', backgroundColor: '#f8fafc', borderBottom: '2px solid var(--color-surface-border-strong)', fontSize: '13px', color: 'var(--color-text-subtle)' }}>
                    Attribute / Feature
                  </th>
                  {compareList.map((p) => (
                    <th
                      key={p.id}
                      style={{
                        padding: '12px',
                        borderBottom: '2px solid var(--color-surface-border-strong)',
                        verticalAlign: 'top',
                        minWidth: '200px'
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
                        <button
                          onClick={() => removeFromCompare(p.id)}
                          style={{ position: 'absolute', top: 0, right: 0, color: '#ef4444' }}
                          title="Remove from comparison"
                        >
                          <Trash2 size={16} />
                        </button>
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          style={{ width: '90px', height: '90px', objectFit: 'contain', background: '#f8fafc', borderRadius: '8px', padding: '6px' }}
                        />
                        <div style={{ fontSize: '11px', color: 'var(--color-accent-blue)', fontWeight: 700, textTransform: 'uppercase' }}>
                          {p.brand}
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary-900)', lineHeight: 1.3 }}>
                          {p.name}
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-primary-900)' }} className="tabular-nums">
                          ₹{p.price.toLocaleString('en-IN')}{' '}
                          <span style={{ fontSize: '11px', color: 'var(--color-text-subtle)', fontWeight: 400 }}>/{p.unit}</span>
                        </div>
                        <button
                          onClick={() => addToCart(p, 1)}
                          className="btn btn-primary btn-sm flex items-center justify-center gap-1"
                          style={{ marginTop: '4px' }}
                        >
                          <ShoppingCart size={13} />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* General rows */}
                <tr>
                  <td style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--color-text-main)', borderBottom: '1px solid #f1f5f9' }}>
                    SKU & HSN Code
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} style={{ padding: '10px 12px', borderBottom: '1px solid #f1f5f9', fontSize: '12px' }}>
                      {p.sku} • HSN {p.hsnCode}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--color-text-main)', borderBottom: '1px solid #f1f5f9' }}>
                    GST Rate
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} style={{ padding: '10px 12px', borderBottom: '1px solid #f1f5f9', fontSize: '12px' }}>
                      {p.gstRate}% (Included in price)
                    </td>
                  ))}
                </tr>

                <tr>
                  <td style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--color-text-main)', borderBottom: '1px solid #f1f5f9' }}>
                    Availability
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} style={{ padding: '10px 12px', borderBottom: '1px solid #f1f5f9', fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>
                      ✓ In Stock ({p.stockCount} {p.unit}s available)
                    </td>
                  ))}
                </tr>

                {/* Technical Specifications Rows */}
                {allSpecKeys.map((specKey) => (
                  <tr key={specKey}>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--color-text-main)', borderBottom: '1px solid #f1f5f9' }}>
                      {specKey}
                    </td>
                    {compareList.map((p) => (
                      <td key={p.id} style={{ padding: '10px 12px', borderBottom: '1px solid #f1f5f9', fontSize: '12px' }}>
                        {p.specs[specKey] || <span style={{ color: '#94a3b8' }}>—</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};
