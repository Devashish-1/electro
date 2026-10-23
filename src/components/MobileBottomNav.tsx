'use client';

import React from 'react';
import { useStore } from '../context/StoreContext';
import { Home, Menu, Cpu, FileText, ShoppingCart } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const {
    activePage,
    navigateTo,
    cartCount,
    setCartDrawerOpen,
    setRfqModalOpen,
    mobileMenuOpen,
    setMobileMenuOpen,
  } = useStore();

  // Hide on admin page
  if (activePage === 'admin') {
    return null;
  }

  return (
    <nav
      className="mobile-bottom-nav"
      aria-label="Mobile Bottom Navigation"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '62px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        boxShadow: '0 -4px 16px rgba(11, 27, 61, 0.08)',
        display: 'none', // Shown via CSS media query @media (max-width: 768px)
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 900,
        padding: '0 8px',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      {/* 1. Home Button */}
      <button
        onClick={() => navigateTo('home')}
        className={`bottom-nav-item ${activePage === 'home' ? 'active' : ''}`}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3px',
          padding: '6px 0',
          color: activePage === 'home' ? '#0066ff' : '#64748b',
          transition: 'all 0.15s ease',
        }}
      >
        <Home size={20} strokeWidth={activePage === 'home' ? 2.5 : 2} />
        <span style={{ fontSize: '10px', fontWeight: activePage === 'home' ? 700 : 500, letterSpacing: '-0.2px' }}>
          Home
        </span>
      </button>

      {/* 2. Categories / 3-Line Menu Drawer Trigger */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className={`bottom-nav-item ${mobileMenuOpen ? 'active' : ''}`}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3px',
          padding: '6px 0',
          color: mobileMenuOpen ? '#0066ff' : '#64748b',
          transition: 'all 0.15s ease',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', alignItems: 'center', justifyContent: 'center', height: '20px' }}>
          <span style={{ display: 'block', width: '18px', height: '2px', backgroundColor: 'currentColor', borderRadius: '1px' }} />
          <span style={{ display: 'block', width: '18px', height: '2px', backgroundColor: 'currentColor', borderRadius: '1px' }} />
          <span style={{ display: 'block', width: '18px', height: '2px', backgroundColor: 'currentColor', borderRadius: '1px' }} />
        </div>
        <span style={{ fontSize: '10px', fontWeight: mobileMenuOpen ? 700 : 500, letterSpacing: '-0.2px' }}>
          Categories
        </span>
      </button>

      {/* 3. APFC Calculator */}
      <button
        onClick={() => navigateTo('calculator')}
        className={`bottom-nav-item ${activePage === 'calculator' ? 'active' : ''}`}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3px',
          padding: '6px 0',
          color: activePage === 'calculator' ? '#0066ff' : '#64748b',
          transition: 'all 0.15s ease',
        }}
      >
        <Cpu size={20} strokeWidth={activePage === 'calculator' ? 2.5 : 2} />
        <span style={{ fontSize: '10px', fontWeight: activePage === 'calculator' ? 700 : 500, letterSpacing: '-0.2px' }}>
          Calculator
        </span>
      </button>

      {/* 4. RFQ Quotation Builder */}
      <button
        onClick={() => setRfqModalOpen(true)}
        className="bottom-nav-item"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3px',
          padding: '6px 0',
          color: '#d97706',
          transition: 'all 0.15s ease',
        }}
      >
        <FileText size={20} strokeWidth={2} />
        <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '-0.2px' }}>
          RFQ Quote
        </span>
      </button>

      {/* 5. Cart with live badge */}
      <button
        onClick={() => setCartDrawerOpen(true)}
        className="bottom-nav-item"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3px',
          padding: '6px 0',
          color: '#0f172a',
          position: 'relative',
          transition: 'all 0.15s ease',
        }}
      >
        <div style={{ position: 'relative' }}>
          <ShoppingCart size={20} strokeWidth={2} />
          {cartCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-6px',
                right: '-10px',
                backgroundColor: '#0066ff',
                color: '#ffffff',
                fontSize: '10px',
                fontWeight: 800,
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {cartCount}
            </span>
          )}
        </div>
        <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '-0.2px' }}>
          Cart
        </span>
      </button>
    </nav>
  );
};
