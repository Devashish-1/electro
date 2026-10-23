'use client';

import React from 'react';
import { useStore } from '../context/StoreContext';
import { categories, brands } from '../data/catalogue';
import { ProductCard } from '../components/ProductCard';
import { ApfcCalculator } from '../components/ApfcCalculator';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Wrench,
  Truck,
  Award,
  Sparkles,
  FileText,
  Phone,
  CheckCircle2,
  BookOpen,
  Building2,
  Factory
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const {
    products,
    navigateTo,
    setRfqModalOpen,
    setRewindingModalOpen,
    setAiAssistantOpen,
    storeConfig
  } = useStore();

  const bestsellers = products.filter((p) => p.featured).slice(0, 4);
  const weldingProducts = products.filter((p) => p.category === 'welding-solutions').slice(0, 4);
  const wireProducts = products.filter((p) => p.category === 'wires-cables').slice(0, 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', paddingBottom: '60px' }}>
      {/* 1. HERO SECTION */}
      <section
        style={{
          background: 'linear-gradient(135deg, #070e20 0%, #0b1b3d 60%, #102a54 100%)',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          padding: '60px 0 80px'
        }}
      >
        {/* Subtle grid background pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.08,
            backgroundImage:
              'radial-gradient(#0066ff 1px, transparent 1px), radial-gradient(#0066ff 1px, #070e20 1px)',
            backgroundSize: '40px 40px',
            backgroundPosition: '0 0, 20px 20px'
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px',
              alignItems: 'center'
            }}
          >
            {/* Left Content */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(0, 102, 255, 0.2)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#7dd3fc',
                  marginBottom: '20px',
                  letterSpacing: '0.5px'
                }}
              >
                <Zap size={14} color="#38bdf8" />
                <span>AUTHORIZED STOCKIST & INDUSTRIAL AUTOMATION • EST. 2017</span>
              </div>

              <h1
                style={{
                  fontSize: '44px',
                  fontWeight: 900,
                  lineHeight: 1.15,
                  letterSpacing: '-1px',
                  color: '#ffffff',
                  marginBottom: '18px'
                }}
              >
                Powering Every Space.{' '}
                <span style={{ color: '#38bdf8' }}>Connecting Every Possibility.</span>
              </h1>

              <p
                style={{
                  fontSize: '16px',
                  lineHeight: 1.6,
                  color: '#cbd5e1',
                  marginBottom: '28px',
                  maxWidth: '560px'
                }}
              >
                Direct supplier of certified <strong>Ador & D&H Welding Electrodes</strong>, custom <strong>APFC Electrical Panels</strong>, 99.99% pure <strong>Milan Copper Wires</strong>, and heavy-duty <strong>3-Phase Motor Rewinding</strong>.
              </p>

              {/* Dual Primary CTAs */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '36px' }}>
                <button
                  onClick={() => navigateTo('catalog')}
                  className="btn btn-primary btn-lg flex items-center gap-2"
                  style={{ boxShadow: '0 4px 18px rgba(0, 102, 255, 0.45)' }}
                >
                  <span>Explore Catalogue</span>
                  <ArrowRight size={18} />
                </button>

                <button
                  onClick={() => setRfqModalOpen(true)}
                  className="btn btn-amber btn-lg flex items-center gap-2"
                >
                  <FileText size={18} />
                  <span>Request Bulk / Panel Quote</span>
                </button>

                <button
                  onClick={() => setRewindingModalOpen(true)}
                  className="btn btn-outline btn-lg"
                  style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.05)' }}
                >
                  <Wrench size={18} />
                  <span>Motor Rewinding Desk</span>
                </button>
              </div>

              {/* Live Metric Counters */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '16px',
                  paddingTop: '20px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.12)'
                }}
              >
                <div>
                  <div style={{ fontSize: '26px', fontWeight: 900, color: '#38bdf8' }}>5,000+</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>Motors Rewound & Serviced</div>
                </div>
                <div>
                  <div style={{ fontSize: '26px', fontWeight: 900, color: '#fbbf24' }}>100%</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>Pure Electrolytic Copper</div>
                </div>
                <div>
                  <div style={{ fontSize: '26px', fontWeight: 900, color: '#34d399' }}>08ADOPD...</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>GST Verified Invoicing</div>
                </div>
              </div>
            </div>

            {/* Right Showcase Image Card */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
                  border: '2px solid rgba(255, 255, 255, 0.15)',
                  backgroundColor: '#0b1b3d'
                }}
              >
                <img
                  src="/images/hero_banner.jpg"
                  alt="Dagdi Electricals Showroom & Manufacturing Facility"
                  style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
                />
              </div>

              {/* Floating verified badge */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-20px',
                  left: '20px',
                  backgroundColor: '#ffffff',
                  color: 'var(--color-primary-900)',
                  padding: '12px 18px',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-xl)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  border: '1px solid #e2e8f0'
                }}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800 }}>Beawar Central Godown</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Same-Day Dispatch Across Rajasthan</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DEDICATED CATEGORY HUBS */}
      <section className="container">
        <div className="section-title-wrap">
          <div className="section-tag">
            <Zap size={14} /> Comprehensive Inventory
          </div>
          <h2 className="section-heading">Browse Dedicated Category Hubs</h2>
          <p className="section-subheading">
            Each category features complete engineering specifications, subcategory filters, and direct B2B pricing.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigateTo('category', { slug: cat.id })}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-surface-border)',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(2, 132, 199, 0.15), 0 8px 10px -6px rgba(2, 132, 199, 0.1)';
                e.currentTarget.style.borderColor = 'var(--color-accent-blue)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)';
                e.currentTarget.style.borderColor = 'var(--color-surface-border)';
              }}
            >
              <div style={{ width: '100%', height: '170px', backgroundColor: '#f8fafc', overflow: 'hidden', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <img
                  src={cat.image}
                  alt={cat.name}
                  style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', transition: 'transform 0.3s' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: 'rgba(2, 132, 199, 0.1)',
                    color: '#0284c7',
                    border: '1px solid rgba(2, 132, 199, 0.2)',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '11px',
                    fontWeight: 700
                  }}
                >
                  {cat.count} Products
                </span>
              </div>

              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--color-primary-900)', marginBottom: '6px' }}>
                  {cat.name}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: '14px' }}>
                  {cat.description}
                </p>

                {/* Subcategory Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
                  {cat.subcategories.slice(0, 3).map((sub) => (
                    <span
                      key={sub}
                      style={{
                        fontSize: '11px',
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontWeight: 500
                      }}
                    >
                      {sub}
                    </span>
                  ))}
                  {cat.subcategories.length > 3 && (
                    <span style={{ fontSize: '11px', color: '#94a3b8', padding: '3px 4px' }}>
                      +{cat.subcategories.length - 3} more
                    </span>
                  )}
                </div>

                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: '12px',
                    borderTop: '1px solid #f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--color-accent-blue)'
                  }}
                >
                  <span>Open Category Hub</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. BESTSELLING INDUSTRIAL EQUIPMENT */}
      <section className="container">
        <div className="flex items-center justify-between" style={{ marginBottom: '24px' }}>
          <div>
            <div className="section-tag">
              <Sparkles size={14} /> High Demand
            </div>
            <h2 className="section-heading">Featured & Bestselling Lines</h2>
          </div>
          <button
            onClick={() => navigateTo('catalog')}
            className="btn btn-outline btn-sm flex items-center gap-1"
          >
            <span>View All ({products.length})</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. INTERACTIVE APFC SIZING CALCULATOR */}
      <section className="container">
        <ApfcCalculator />
      </section>

      {/* 5. SHOP BY INDUSTRIAL APPLICATION */}
      <section className="container">
        <div className="section-title-wrap">
          <div className="section-tag">
            <Factory size={14} /> Engineering Solutions
          </div>
          <h2 className="section-heading">Engineered for Your Industry</h2>
          <p className="section-subheading">
            Discover tailored electrical packages designed for specific operating environments across Rajasthan & India.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {/* App 1 */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              border: '1px solid var(--color-surface-border)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Factory size={22} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--color-primary-900)', marginBottom: '8px' }}>
              Stone Crushers & Marble Mining
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
              Heavy dust, fluctuating inductive loads, and harsh ambient heat. We supply 150 kVAR detuned APFC panels, 11kV gang-operated AB switches, and Ador E7018 structural electrodes for heavy machinery welding.
            </p>
            <button
              onClick={() => navigateTo('catalog', { category: 'panels-switchgear' })}
              className="btn btn-outline btn-sm"
              style={{ marginTop: 'auto' }}
            >
              Explore Mining Equipment →
            </button>
          </div>

          {/* App 2 */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              border: '1px solid var(--color-surface-border)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Building2 size={22} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--color-primary-900)', marginBottom: '8px' }}>
              Textile & Spinning Mills
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
              Continuous 24/7 motor operations requiring precise power factor stabilization near 0.99, harmonic suppression, and IE3 energy efficient induction motors to minimize power bills.
            </p>
            <button
              onClick={() => navigateTo('catalog', { category: 'motors-rewinding' })}
              className="btn btn-outline btn-sm"
              style={{ marginTop: 'auto' }}
            >
              Explore Textile Solutions →
            </button>
          </div>

          {/* App 3 */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              border: '1px solid var(--color-surface-border)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#ecfdf5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Zap size={22} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--color-primary-900)', marginBottom: '8px' }}>
              Agricultural & Deep Borewells
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
              Water-lubricated submersible pumps, waterproof BOPP poly-wrapped copper winding wire, and KEI 3-core flat power cables designed for depths up to 800 feet.
            </p>
            <button
              onClick={() => navigateTo('catalog', { category: 'wires-cables' })}
              className="btn btn-outline btn-sm"
              style={{ marginTop: 'auto' }}
            >
              Explore Borewell Supplies →
            </button>
          </div>
        </div>
      </section>

      {/* 6. MOTOR REWINDING & ENGINEERING WORKSHOP SHOWCASE */}
      <section
        style={{
          backgroundColor: '#0b1b3d',
          color: '#ffffff',
          padding: '60px 0'
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px',
              alignItems: 'center'
            }}
          >
            <div>
              <span className="badge badge-amber" style={{ marginBottom: '12px' }}>
                BEAWAR WORKSHOP FACILITY
              </span>
              <h2 style={{ fontSize: '32px', fontWeight: 800, lineHeight: 1.2, marginBottom: '16px', color: '#ffffff' }}>
                Heavy 3-Phase Electric Motor Rewinding & Overhaul
              </h2>
              <p style={{ fontSize: '15px', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '24px' }}>
                Since 2017, Dagdi Electric Motor Rewinding Works has served hundreds of industrial plants across Rajasthan. We do not use substandard scrap copper wire. We exclusively utilize <strong>Milan 99.99% ETP electrolytic dual-coated copper</strong>, Class H Nomex insulation, and vacuum varnish baking for maximum thermal longevity.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} color="#34d399" />
                  <span style={{ fontSize: '14px', color: '#f1f5f9' }}>
                    <strong>Vacuum Pressure Impregnation (VPI):</strong> Deep varnish penetration eliminates coil void hotspots.
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} color="#34d399" />
                  <span style={{ fontSize: '14px', color: '#f1f5f9' }}>
                    <strong>Computerized Dynamic Rotor Balancing:</strong> Eliminates shaft vibrations and extends bearing life.
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} color="#34d399" />
                  <span style={{ fontSize: '14px', color: '#f1f5f9' }}>
                    <strong>High Potential (Hi-Pot) & Megger Insulation Testing:</strong> Every motor test run before dispatch.
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setRewindingModalOpen(true)}
                  className="btn btn-amber flex items-center gap-2"
                  style={{ padding: '12px 24px' }}
                >
                  <Wrench size={18} />
                  <span>Book Motor Rewinding Overhaul</span>
                </button>

                <a
                  href={`tel:${storeConfig.phone1}`}
                  className="btn btn-outline"
                  style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#ffffff' }}
                >
                  <Phone size={16} />
                  <span>Call Workshop Desk</span>
                </a>
              </div>
            </div>

            <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-xl)', border: '2px solid rgba(255,255,255,0.1)' }}>
              <img
                src="/images/electric_motor.jpg"
                alt="Motor Rewinding & Testing"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          </div>
        </div>
      </section>



      {/* 8. AUTHORIZED BRANDS DIRECTORY */}
      <section className="container">
        <div className="section-title-wrap" style={{ textAlign: 'center' }}>
          <div className="section-tag" style={{ justifyContent: 'center' }}>
            <Award size={14} /> Direct Wholesale Partnerships
          </div>
          <h2 className="section-heading">Authorized Stockist & Partner Brands</h2>
          <p className="section-subheading" style={{ margin: '6px auto 0' }}>
            All products are 100% authentic, directly procured from authorized manufacturers with full warranty.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          {brands.map((b) => (
            <div
              key={b.id}
              onClick={() => navigateTo('catalog', { brand: b.id })}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--color-surface-border)',
                borderRadius: 'var(--radius-md)',
                padding: '20px 16px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: 'var(--shadow-xs)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-accent-blue)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-surface-border)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>{b.logo}</div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-primary-900)' }}>
                {b.name}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-accent-blue)', fontWeight: 600, marginTop: '2px' }}>
                {b.tagline}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--color-text-subtle)', marginTop: '6px' }}>
                {b.productCount} Items Available
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. TECHNICAL BUYING GUIDES & RESOURCES */}
      <section className="container">
        <div className="section-title-wrap">
          <div className="section-tag">
            <BookOpen size={14} /> Knowledge & Safety
          </div>
          <h2 className="section-heading">Electrical Engineering Guides</h2>
          <p className="section-subheading">
            Technical resources prepared by our engineering desk to guide selection and safe installation.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--color-surface-border)' }}>
            <span className="badge badge-blue" style={{ marginBottom: '8px' }}>WELDING GUIDE</span>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-primary-900)', marginBottom: '8px' }}>
              Choosing Between E7018 and 6013 Welding Electrodes
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: '14px' }}>
              Understand when low-hydrogen basic electrodes (E7018) are mandatory for radiographic welds, crack resistance, and thick structural steel versus general purpose 6013 rods.
            </p>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-accent-blue)' }}>
              Read Full Technical Guide →
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--color-surface-border)' }}>
            <span className="badge badge-amber" style={{ marginBottom: '8px' }}>POWER FACTOR</span>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-primary-900)', marginBottom: '8px' }}>
              How APFC Panels Eliminate DISCOM Power Penalties
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: '14px' }}>
              Step-by-step calculation showing how reactive power compensation reduces maximum kVA demand, prevents transformer overheating, and earns prompt payment rebates.
            </p>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-accent-blue)' }}>
              Read Sizing Handbook →
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--color-surface-border)' }}>
            <span className="badge badge-green" style={{ marginBottom: '8px' }}>REWINDING STANDARDS</span>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-primary-900)', marginBottom: '8px' }}>
              Pure Copper vs Recycled Copper in Motor Winding
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: '14px' }}>
              Why 99.99% electrolytic copper prevents eddy current losses, reduces operating temperature by up to 25°C, and prevents recurring motor burnouts in stone quarries.
            </p>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-accent-blue)' }}>
              View Insulation Specifications →
            </div>
          </div>
        </div>
      </section>

      {/* 10. B2B WHOLESALE BANNER CALLOUT */}
      <section className="container">
        <div
          style={{
            backgroundColor: '#070e20',
            color: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            padding: '40px',
            backgroundImage: 'linear-gradient(135deg, #070e20 0%, #102a54 100%)',
            border: '2px solid rgba(0, 102, 255, 0.3)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            boxShadow: 'var(--shadow-xl)'
          }}
        >
          <div style={{ maxWidth: '640px' }}>
            <span className="badge badge-amber" style={{ marginBottom: '10px' }}>
              CONTRACTOR & INDUSTRIAL PROCUREMENT
            </span>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
              Need Bulk Quantities or a Custom Panel Quotation?
            </h2>
            <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: 1.6 }}>
              Upload your Bill of Materials (BOM), request custom capacitor kVAR configurations, or get direct wholesale contractor rates with official GST tax credit.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setRfqModalOpen(true)}
              className="btn btn-amber btn-lg flex items-center gap-2"
              style={{ padding: '14px 28px', fontWeight: 800 }}
            >
              <FileText size={20} />
              <span>Submit RFQ Bill of Materials</span>
            </button>

            <button
              onClick={() => setAiAssistantOpen(true)}
              className="btn btn-outline btn-lg"
              style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#ffffff' }}
            >
              <Sparkles size={18} />
              <span>Ask AI Advisor</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
