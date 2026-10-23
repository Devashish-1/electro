'use client';

import React from 'react';
import { useStore } from '../context/StoreContext';
import { categories, brands } from '../data/catalogue';
import { Phone, Mail, MapPin, ShieldCheck, Clock, Award, FileText, Wrench } from 'lucide-react';

export const Footer: React.FC = () => {
  const { storeConfig, navigateTo, setRewindingModalOpen, setRfqModalOpen } = useStore();

  return (
    <footer style={{ backgroundColor: '#070e20', color: '#cbd5e1', paddingTop: '48px', paddingBottom: '32px', borderTop: '4px solid var(--color-accent-blue)' }}>
      <div className="container">
        {/* Top Trust Pillars Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
            gap: '20px',
            paddingBottom: '36px',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <div className="flex items-center gap-3">
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(0,102,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '15px' }}>100% Genuine Certified</div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Direct authorized stockist for Ador, D&H, KEI & Milan</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24' }}>
              <FileText size={24} />
            </div>
            <div>
              <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '15px' }}>B2B GST Tax Invoicing</div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Full 18% input tax credit with valid HSN billing</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
              <Wrench size={24} />
            </div>
            <div>
              <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '15px' }}>In-House Workshop</div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Advanced stator rewinding & vacuum varnish testing</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(168,85,247,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc' }}>
              <Clock size={24} />
            </div>
            <div>
              <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '15px' }}>Pan-India Dispatch</div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Express transit from Beawar central junction</div>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
            gap: '30px',
            paddingTop: '36px',
            paddingBottom: '36px'
          }}
        >
          {/* Col 1: Business Identity */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{ fontSize: '22px' }}>⚡</div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>DAGDI ELECTRICALS</div>
                <div style={{ fontSize: '11px', color: '#93c5fd', fontWeight: 600 }}>& POWER CONTROLS</div>
              </div>
            </div>
            <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#94a3b8', marginBottom: '16px' }}>
              Trading name of <strong>Dagdi Electric Motor Rewinding Works</strong>. Established in 2017 in Beawar (Ajmer), providing premium industrial automation panels, heavy rewinding, high-tensile welding rods, and certified copper wires.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
              <div><strong>Proprietor:</strong> {storeConfig.proprietor}</div>
              <div><strong>GSTIN:</strong> <span style={{ color: '#fbbf24', fontWeight: 700 }}>{storeConfig.gstin}</span></div>
              <div><strong>MSME Reg:</strong> UDYAM-RJ-01-0028419</div>
            </div>
          </div>

          {/* Col 2: Product Categories */}
          <div>
            <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '15px', marginBottom: '16px', borderLeft: '3px solid var(--color-accent-blue)', paddingLeft: '8px' }}>
              Catalogue Categories
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              {categories.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => navigateTo('catalog', { category: c.id })}
                    style={{ color: '#94a3b8', transition: 'color 0.15s', textAlign: 'left' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                  >
                    {c.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => setRewindingModalOpen(true)}
                  style={{ color: '#fcd34d', fontWeight: 600, textAlign: 'left' }}
                >
                  ⚡ Motor Rewinding & Overhaul
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('quotation-builder')}
                  style={{ color: '#38bdf8', fontWeight: 600, textAlign: 'left' }}
                >
                  📋 Request Custom Panel Quote
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Authorized Brands */}
          <div>
            <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '15px', marginBottom: '16px', borderLeft: '3px solid var(--color-accent-blue)', paddingLeft: '8px' }}>
              Authorized Brands
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              {brands.map((b) => (
                <li key={b.id}>
                  <button
                    onClick={() => navigateTo('catalog', { brand: b.id })}
                    style={{ color: '#94a3b8', transition: 'color 0.15s', textAlign: 'left' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                  >
                    {b.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact & Workshop Location */}
          <div>
            <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '15px', marginBottom: '16px', borderLeft: '3px solid var(--color-accent-blue)', paddingLeft: '8px' }}>
              Workshop & Sales Depot
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#94a3b8' }}>
              <div className="flex items-start gap-2">
                <MapPin size={18} color="var(--color-accent-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Near Tejaji Ka Than, Chhawani, Beawar, District Ajmer, Rajasthan - 305901</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} color="var(--color-status-success)" />
                <a href={`tel:${storeConfig.phone1}`} style={{ color: '#ffffff', fontWeight: 600 }}>
                  {storeConfig.phone1}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} color="var(--color-status-success)" />
                <a href={`tel:${storeConfig.phone2}`} style={{ color: '#ffffff', fontWeight: 600 }}>
                  {storeConfig.phone2}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} color="var(--color-accent-amber)" />
                <span>{storeConfig.email}</span>
              </div>
              <div style={{ marginTop: '8px' }}>
                <a
                  href={`https://wa.me/${storeConfig.whatsapp.replace('+', '')}?text=Hello%20Dagdi%20Electricals,%20I%20have%20an%20enquiry%20regarding%20products/services`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm"
                  style={{ backgroundColor: '#25D366', color: '#ffffff', width: '100%', fontWeight: 700 }}
                >
                  WhatsApp Direct Enquiry
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Copyright & Admin CMS Link */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '20px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            fontSize: '12px',
            color: '#64748b'
          }}
        >
          <div>
            © {new Date().getFullYear()} Dagdi Electric Motor Rewinding Works. All Rights Reserved. All brand logos & trademarks belong to their respective owners.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigateTo('about')} style={{ color: '#94a3b8' }}>About Us</button>
            <button onClick={() => navigateTo('contact')} style={{ color: '#94a3b8' }}>Contact</button>
            <button onClick={() => navigateTo('order-tracking')} style={{ color: '#94a3b8' }}>Order Tracking</button>
            <button onClick={() => navigateTo('admin')} style={{ color: '#fbbf24', fontWeight: 600 }}>
              Admin Panel
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
