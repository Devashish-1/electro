'use client';

import React, { useState } from 'react';
import { Category, Product } from '@/types';
import { useStore } from '@/context/StoreContext';
import { ProductCard } from '@/components/ProductCard';
import {
  ShieldCheck,
  FileText,
  SlidersHorizontal,
  ChevronRight,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Truck,
  CheckCircle2,
  Wrench,
  Calculator
} from 'lucide-react';

interface CategoryHubViewProps {
  category: Category;
  initialProducts: Product[];
}

export const CategoryHubView: React.FC<CategoryHubViewProps> = ({ category, initialProducts }) => {
  const { navigateTo, setRfqModalOpen, setAiAssistantOpen } = useStore();
  const [selectedSubcat, setSelectedSubcat] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('featured');

  const filteredProducts = initialProducts.filter((product) => {
    if (selectedSubcat === 'All') return true;
    return product.subcategory.toLowerCase().includes(selectedSubcat.toLowerCase());
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  // Category specific technical highlights
  const getCategoryHighlights = () => {
    switch (category.id) {
      case 'panels-switchgear':
        return [
          { label: 'CRCA Enclosures', desc: '14/16-Gauge Powder Coated IP54 Sheet' },
          { label: 'Busbars', desc: '99.9% Electrolytic ETP Copper With Color Sleeves' },
          { label: 'Microprocessor Relays', desc: 'Entes / Multispan Hunt-Free Intelligent Switching' },
          { label: 'Compliance', desc: 'Tested Conforming to IS 8623 / IEC 61439' },
        ];
      case 'welding-solutions':
        return [
          { label: 'AWS Classification', desc: 'AWS A5.1 E7018 / ASME SFA 5.1 Certified' },
          { label: 'Low Hydrogen', desc: 'Diffusible Hydrogen < 4ml/100g Weld Deposit' },
          { label: 'Packaging', desc: 'Hermetically Sealed Moisture-Proof Vacuum Boxes' },
          { label: 'Authorized Dealer', desc: 'Direct Factory Authorized Stockist for Ador & D&H' },
        ];
      case 'wires-cables':
        return [
          { label: 'Copper Purity', desc: '99.99% Pure Electrolytic Tough Pitch (ETP)' },
          { label: 'Insulation Class', desc: 'Class H (200°C) Dual Coated Modified Polyester' },
          { label: 'Conductivity', desc: '>101% IACS High Conductivity Standard' },
          { label: 'Applications', desc: 'Heavy Induction Motors, Submersibles & Transformers' },
        ];
      case 'motors-rewinding':
        return [
          { label: 'Motor Efficiency', desc: 'IE2 / IE3 Energy Efficient Squirrel Cage Stators' },
          { label: 'Rewinding Tech', desc: 'Vacuum Pressure Impregnation (VPI) & Baking' },
          { label: 'Balancing', desc: 'In-House Computerized Dynamic Rotor Balancing' },
          { label: 'Warranty', desc: 'Guaranteed 6-Month Service Warranty On Rewound Units' },
        ];
      default:
        return [
          { label: 'Accuracy Class', desc: 'Class 0.5 & 1.0 True RMS Microprocessor Meters' },
          { label: 'Capacitor Tech', desc: 'Heavy Duty MPP Cylindrical / Box with Overpressure' },
          { label: 'Relay Channels', desc: '6, 8, and 12-Step Automatic Switching Relays' },
          { label: 'Readings', desc: 'Simultaneous True RMS V, A, PF, Hz, & kVAR Display' },
        ];
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--color-surface-bg)', minHeight: '100vh', paddingBottom: '70px' }}>
      {/* 1. CLEAN BREADCRUMB */}
      <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--color-surface-border)', padding: '12px 0' }}>
        <div className="container flex items-center" style={{ gap: '8px', fontSize: '13px', color: 'var(--color-text-muted)', flexWrap: 'wrap' }}>
          <button onClick={() => navigateTo('home')} style={{ color: 'var(--color-text-muted)', cursor: 'pointer' }}>Home</button>
          <ChevronRight size={14} />
          <button onClick={() => navigateTo('catalog')} style={{ color: 'var(--color-text-muted)', cursor: 'pointer' }}>Catalog</button>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--color-primary-900)', fontWeight: 600 }}>{category.name}</span>
        </div>
      </div>

      {/* 2. MODERN UNCLUTTERED HERO BANNER */}
      <section
        style={{
          background: 'linear-gradient(135deg, #070e20 0%, #0b1b3d 60%, #102a54 100%)',
          color: '#ffffff',
          padding: '48px 0 40px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '350px',
            height: '350px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 102, 255, 0.25) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div className="container">
          <div style={{ maxWidth: '820px' }}>
            <div className="flex items-center" style={{ gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
              <span className="badge badge-amber" style={{ fontSize: '12px', padding: '4px 10px' }}>
                DIRECT STOCKIST
              </span>
              <span style={{ fontSize: '13px', color: '#93c5fd', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} /> 100% Genuine Certified Industrial Stock
              </span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(26px, 4vw, 38px)',
                fontWeight: 900,
                lineHeight: 1.2,
                color: '#ffffff',
                marginBottom: '14px',
                letterSpacing: '-0.5px',
              }}
            >
              {category.name}
            </h1>

            <p style={{ fontSize: '15px', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '24px' }}>
              {category.description}
            </p>

            <div className="flex items-center" style={{ gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setRfqModalOpen(true)}
                className="btn btn-amber"
                style={{ fontWeight: 700 }}
              >
                <FileText size={16} /> Request Custom Quotation (RFQ)
              </button>

              {category.id === 'panels-switchgear' && (
                <button
                  onClick={() => navigateTo('calculator')}
                  className="btn btn-outline"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.25)' }}
                >
                  <Calculator size={16} /> Open APFC Sizing Calculator
                </button>
              )}

              {category.id === 'motors-rewinding' && (
                <button
                  onClick={() => navigateTo('rewinding-service')}
                  className="btn btn-outline"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.25)' }}
                >
                  <Wrench size={16} /> Book Motor Rewinding
                </button>
              )}

              <button
                onClick={() => setAiAssistantOpen(true)}
                className="btn btn-ghost"
                style={{ color: '#93c5fd', backgroundColor: 'rgba(0,102,255,0.15)' }}
              >
                <Sparkles size={16} /> Ask AI Technical Advisor
              </button>
            </div>
          </div>

          {/* Key Specs Pills Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '14px',
              marginTop: '36px',
              paddingTop: '24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            }}
          >
            {getCategoryHighlights().map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-accent-amber)', fontWeight: 700, letterSpacing: '0.5px' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '13px', color: '#e2e8f0', marginTop: '2px', fontWeight: 500 }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SUBCATEGORY PILL NAV & FILTER BAR */}
      <div
        style={{
          position: 'sticky',
          top: '72px',
          zIndex: 40,
          backgroundColor: '#ffffff',
          borderBottom: '1px solid var(--color-surface-border)',
          boxShadow: 'var(--shadow-xs)',
          padding: '12px 0',
        }}
      >
        <div className="container flex items-center justify-between" style={{ gap: '16px', flexWrap: 'wrap' }}>
          {/* Subcategories Horizontal Scroll */}
          <div
            className="flex items-center"
            style={{
              gap: '8px',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              paddingBottom: '4px',
              maxWidth: '100%',
              scrollbarWidth: 'none',
            }}
          >
            <button
              onClick={() => setSelectedSubcat('All')}
              className={`btn btn-sm ${selectedSubcat === 'All' ? 'btn-primary' : 'btn-outline'}`}
              style={{ borderRadius: 'var(--radius-full)' }}
            >
              All {category.name} ({initialProducts.length})
            </button>
            {category.subcategories.map((sub, i) => (
              <button
                key={i}
                onClick={() => setSelectedSubcat(sub)}
                className={`btn btn-sm ${selectedSubcat === sub ? 'btn-primary' : 'btn-outline'}`}
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* Sort selector */}
          <div className="flex items-center" style={{ gap: '8px', marginLeft: 'auto' }}>
            <span style={{ fontSize: '13px', color: 'var(--color-text-subtle)', whiteSpace: 'nowrap' }}>
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-surface-border)',
                backgroundColor: '#ffffff',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--color-text-main)',
              }}
            >
              <option value="featured">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Customer Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. PRODUCT GRID */}
      <div className="container" style={{ paddingTop: '32px' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-primary-900)', margin: 0 }}>
              {selectedSubcat === 'All' ? `Available Products in ${category.name}` : selectedSubcat}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', margin: '4px 0 0' }}>
              Showing {filteredProducts.length} verified products with GST tax invoice support
            </p>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div
            style={{
              backgroundColor: '#ffffff',
              padding: '60px 20px',
              textAlign: 'center',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-surface-border)',
            }}
          >
            <p style={{ fontSize: '16px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
              No specific products found for "{selectedSubcat}".
            </p>
            <button onClick={() => setSelectedSubcat('All')} className="btn btn-primary">
              View All {category.name}
            </button>
          </div>
        ) : (
          <div
            className="product-responsive-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* 5. B2B DIRECT ASSISTANCE STRIP */}
      <div className="container" style={{ marginTop: '48px' }}>
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            padding: '32px',
            border: '1px solid var(--color-surface-border)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            alignItems: 'center',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div>
            <span className="badge badge-blue" style={{ marginBottom: '8px' }}>
              GOVERNMENT & CONTRACTOR SUPPLY
            </span>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-primary-900)', margin: '0 0 8px' }}>
              Need Custom Technical Specs or Tender Bidding?
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', margin: 0 }}>
              Dagdi Electric Motor Rewinding Works provides stamped technical compliance sheets, manufacturer test certificates (MTC), and volume DISCOM rates.
            </p>
          </div>

          <div className="flex items-center" style={{ gap: '12px', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
            <button
              onClick={() => setRfqModalOpen(true)}
              className="btn btn-primary btn-lg"
              style={{ flex: '1 1 200px' }}
            >
              <FileText size={18} /> Submit Tender RFQ
            </button>
            <a
              href="https://wa.me/919414281395"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-lg"
              style={{ flex: '1 1 180px', color: '#10b981', borderColor: '#10b981' }}
            >
              WhatsApp Engineer
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
