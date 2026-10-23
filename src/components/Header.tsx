'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { categories, brands } from '../data/catalogue';
import {
  Search,
  ShoppingCart,
  Heart,
  Scale,
  FileText,
  Phone,
  MapPin,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Wrench,
  ShieldCheck,
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    storeConfig,
    cartCount,
    wishlist,
    compareList,
    pincode,
    setPincode,
    setCartDrawerOpen,
    setRfqModalOpen,
    setCompareModalOpen,
    setAiAssistantOpen,
    setRewindingModalOpen,
    navigateTo,
    activePage,
    searchQuery,
    setSearchQuery,
    products
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [pincodeModalOpen, setPincodeModalOpen] = useState(false);
  const [tempPincode, setTempPincode] = useState(pincode);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter matching search suggestions
  const searchResults = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.subcategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.hsnCode.includes(searchQuery)
      ).slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchFocused(false);
      navigateTo('catalog', { query: searchQuery });
    }
  };

  const handleSelectProduct = (product: any) => {
    setSearchFocused(false);
    setSearchQuery('');
    navigateTo('product-detail', product);
  };

  const handleSavePincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempPincode.trim().length === 6) {
      setPincode(tempPincode);
      setPincodeModalOpen(false);
    }
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: '#ffffff', boxShadow: 'var(--shadow-sm)' }}>
      {/* 1. TOP ANNOUNCEMENT STRIP */}
      {storeConfig.announcementActive && (
        <div style={{ backgroundColor: 'var(--color-primary-950)', color: '#93c5fd', fontSize: '12px', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="container flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '8px' }}>
            <div className="flex items-center gap-2">
              <span className="badge badge-amber" style={{ fontSize: '10px', padding: '2px 6px' }}>OFFICIAL PORTAL</span>
              <span style={{ color: '#ffffff', fontWeight: 500 }}>{storeConfig.announcementText}</span>
            </div>
            <div className="flex items-center gap-4" style={{ fontSize: '12px', color: '#cbd5e1' }}>
              <span className="flex items-center gap-1">
                <ShieldCheck size={14} color="#10b981" /> GSTIN: <strong>{storeConfig.gstin}</strong>
              </span>
              <span className="flex items-center gap-1" style={{ display: 'none' }} id="top-workshop-time">
                <Clock size={14} /> Workshop: Mon-Sat 8AM - 8PM
              </span>
              <button
                onClick={() => navigateTo('admin')}
                style={{ color: '#f59e0b', fontWeight: 600, textDecoration: 'underline', fontSize: '11px' }}
                title="Open Management Portal"
              >
                Admin CMS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. TOP UTILITY STRIP */}
      <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--color-surface-border)', padding: '6px 0', fontSize: '13px' }}>
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-4" style={{ color: 'var(--color-text-muted)' }}>
            <span className="flex items-center gap-1">
              <MapPin size={14} color="var(--color-accent-blue)" />
              <span>Chhawani, Beawar, Rajasthan</span>
            </span>
            <span style={{ color: 'var(--color-surface-border-strong)' }}>|</span>
            <a href={`tel:${storeConfig.phone1}`} className="flex items-center gap-1" style={{ color: 'var(--color-text-main)', fontWeight: 600 }}>
              <Phone size={14} color="var(--color-status-success)" />
              <span>{storeConfig.phone1}</span>
            </a>
          </div>

          <div className="flex items-center gap-4">
            {/* Pincode selector button */}
            <button
              onClick={() => setPincodeModalOpen(true)}
              className="flex items-center gap-1"
              style={{ fontSize: '12px', color: 'var(--color-primary-900)', fontWeight: 600, background: '#f1f5f9', padding: '3px 10px', borderRadius: '4px' }}
            >
              <MapPin size={13} color="var(--color-accent-blue)" />
              <span>Deliver to: <strong>{pincode}</strong> (Change)</span>
            </button>
            <button
              onClick={() => navigateTo('order-tracking')}
              style={{ color: 'var(--color-text-muted)', fontSize: '12px', fontWeight: 500 }}
              className="hover-link"
            >
              Track Order / RFQ
            </button>
            <button
              onClick={() => navigateTo('about')}
              style={{ color: 'var(--color-text-muted)', fontSize: '12px', fontWeight: 500 }}
              className="hover-link"
            >
              About Dagdi
            </button>
            <button
              onClick={() => navigateTo('contact')}
              style={{ color: 'var(--color-text-muted)', fontSize: '12px', fontWeight: 500 }}
              className="hover-link"
            >
              Contact & Directions
            </button>
          </div>
        </div>
      </div>

      {/* 3. MAIN HEADER BAR */}
      <div className="container" style={{ padding: '12px 20px' }}>
        <div className="flex items-center justify-between gap-4">
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none' }}
            className="mobile-burger-btn"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

          {/* Logo & Brand Identity */}
          <div
            onClick={() => navigateTo('home')}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0b1b3d 0%, #0066ff 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(0, 102, 255, 0.35)',
                fontWeight: 900,
                fontSize: '22px',
                letterSpacing: '-1px'
              }}
            >
              ⚡
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-primary-900)', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
                DAGDI <span style={{ color: 'var(--color-accent-blue)', fontWeight: 700 }}>ELECTRICALS</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.3px' }}>
                DAGDI ELECTRIC MOTOR REWINDING WORKS • BEAWAR
              </div>
            </div>
          </div>

          {/* Search Bar with live autocomplete & filters */}
          <div ref={searchRef} style={{ flex: 1, maxWidth: '580px', position: 'relative' }}>
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', position: 'relative' }}>
              <input
                type="text"
                placeholder="Search APFC panels, E7018 electrodes, copper wire SWG, motors, 11kV AB switch..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchFocused(true);
                }}
                onFocus={() => setSearchFocused(true)}
                style={{
                  width: '100%',
                  padding: '11px 48px 11px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: searchFocused ? '2px solid var(--color-accent-blue)' : '1px solid var(--color-surface-border-strong)',
                  backgroundColor: '#f8fafc',
                  outline: 'none',
                  fontSize: '14px',
                  boxShadow: searchFocused ? '0 0 0 3px rgba(0, 102, 255, 0.15)' : 'none',
                  transition: 'all 0.2s'
                }}
              />
              <button
                type="submit"
                style={{
                  position: 'absolute',
                  right: '4px',
                  top: '4px',
                  bottom: '4px',
                  width: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'var(--color-accent-blue)',
                  color: '#ffffff',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'background-color 0.15s'
                }}
                aria-label="Submit search"
              >
                <Search size={18} />
              </button>
            </form>

            {/* Instant Search Suggestions Box */}
            {searchFocused && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: '6px',
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-xl)',
                  border: '1px solid var(--color-surface-border)',
                  zIndex: 200,
                  overflow: 'hidden'
                }}
              >
                {searchResults.length > 0 ? (
                  <div>
                    <div style={{ padding: '8px 14px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-subtle)', backgroundColor: '#f8fafc' }}>
                      Suggested Products ({searchResults.length})
                    </div>
                    {searchResults.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleSelectProduct(p)}
                        style={{
                          padding: '10px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          cursor: 'pointer',
                          borderBottom: '1px solid #f1f5f9',
                          transition: 'background-color 0.1s'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          style={{ width: '38px', height: '38px', objectFit: 'contain', borderRadius: '4px', background: '#f8fafc' }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {p.name}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                            {p.brand} • SKU: {p.sku}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-primary-900)' }}>
                            ₹{p.price.toLocaleString('en-IN')}
                          </div>
                          <div style={{ fontSize: '10px', color: '#10b981', fontWeight: 600 }}>In Stock</div>
                        </div>
                      </div>
                    ))}
                    <div
                      onClick={handleSearchSubmit}
                      style={{
                        padding: '10px 14px',
                        textAlign: 'center',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: 'var(--color-accent-blue)',
                        cursor: 'pointer',
                        backgroundColor: '#f8fafc'
                      }}
                    >
                      View all results for "{searchQuery}" →
                    </div>
                  </div>
                ) : searchQuery.trim() ? (
                  <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    <p style={{ fontSize: '14px', fontWeight: 600 }}>No exact matches found for "{searchQuery}"</p>
                    <p style={{ fontSize: '12px', marginTop: '4px' }}>Try searching by "E7018", "copper wire", "panel", "motor", or "Multispan".</p>
                    <button
                      onClick={() => navigateTo('quotation-builder', { query: searchQuery })}
                      className="btn btn-navy btn-sm"
                      style={{ marginTop: '12px' }}
                    >
                      Request a Custom Quote for this Item
                    </button>
                  </div>
                ) : (
                  <div style={{ padding: '14px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-subtle)', marginBottom: '8px' }}>
                      Popular Searches
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {['Ador E7018 3.15mm', '150 kVAR APFC Panel', 'Milan Copper Wire SWG 21', '11kV AB Switch', '15 HP Motor', 'KEI Submersible Cable'].map((term) => (
                        <button
                          key={term}
                          onClick={() => {
                            setSearchQuery(term);
                            navigateTo('catalog', { query: term });
                            setSearchFocused(false);
                          }}
                          style={{
                            fontSize: '12px',
                            padding: '4px 10px',
                            borderRadius: '4px',
                            background: '#f1f5f9',
                            color: 'var(--color-text-main)',
                            border: '1px solid #e2e8f0'
                          }}
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action CTAs: AI Assistant, Compare, Wishlist, Cart Drawer, RFQ */}
          <div className="flex items-center gap-3">
            {/* AI Advisor Button */}
            <button
              onClick={() => setAiAssistantOpen(true)}
              className="btn btn-outline btn-sm flex items-center gap-1"
              style={{
                borderColor: '#38bdf8',
                backgroundColor: '#f0f9ff',
                color: '#0369a1',
                padding: '7px 12px'
              }}
              title="Ask Dagdi PowerGenius AI Assistant"
            >
              <Sparkles size={16} color="#0284c7" />
              <span style={{ fontWeight: 700 }}>AI Advisor</span>
            </button>

            {/* Compare items button */}
            <button
              onClick={() => setCompareModalOpen(true)}
              style={{
                position: 'relative',
                padding: '8px',
                borderRadius: '8px',
                color: 'var(--color-text-main)',
                border: '1px solid var(--color-surface-border)'
              }}
              title="Compare Products"
            >
              <Scale size={20} />
              {compareList.length > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    background: 'var(--color-accent-amber)',
                    color: '#000',
                    fontSize: '11px',
                    fontWeight: 800,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {compareList.length}
                </span>
              )}
            </button>

            {/* Wishlist */}
            <button
              onClick={() => navigateTo('catalog', { wishlistOnly: true })}
              style={{
                position: 'relative',
                padding: '8px',
                borderRadius: '8px',
                color: 'var(--color-text-main)',
                border: '1px solid var(--color-surface-border)'
              }}
              title="Wishlist"
            >
              <Heart size={20} fill={wishlist.length > 0 ? '#ef4444' : 'none'} color={wishlist.length > 0 ? '#ef4444' : 'currentColor'} />
              {wishlist.length > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    background: '#ef4444',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 800,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setCartDrawerOpen(true)}
              className="btn btn-navy flex items-center gap-2"
              style={{ padding: '9px 16px' }}
              title="Open Shopping Cart"
            >
              <div style={{ position: 'relative' }}>
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '-10px',
                      background: 'var(--color-accent-blue)',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: 800,
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid #0b1b3d'
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </div>
              <span style={{ fontWeight: 700 }}>Cart</span>
            </button>

            {/* B2B RFQ Button */}
            <button
              onClick={() => setRfqModalOpen(true)}
              className="btn btn-amber flex items-center gap-1"
              style={{ padding: '9px 16px' }}
              title="Request a B2B Bulk Quotation"
            >
              <FileText size={16} />
              <span>Request Quote</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. CATEGORY NAVIGATION & MEGA MENU STRIP */}
      <div style={{ backgroundColor: 'var(--color-primary-900)', color: '#ffffff', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="container flex items-center justify-between" style={{ padding: '0 20px', height: '44px' }}>
          <div className="flex items-center gap-1" style={{ height: '100%' }}>
            {/* All Categories Mega Trigger */}
            <div
              style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
            >
              <button
                className="flex items-center gap-2"
                style={{
                  backgroundColor: megaMenuOpen ? 'var(--color-accent-blue)' : 'rgba(255,255,255,0.12)',
                  color: '#ffffff',
                  padding: '0 16px',
                  height: '100%',
                  fontWeight: 700,
                  fontSize: '13px',
                  transition: 'background-color 0.15s'
                }}
              >
                <Menu size={16} />
                <span>All Categories</span>
                <ChevronDown size={14} />
              </button>

              {/* Mega Menu Dropdown */}
              {megaMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    width: '780px',
                    backgroundColor: '#ffffff',
                    color: 'var(--color-text-main)',
                    borderRadius: '0 0 var(--radius-md) var(--radius-md)',
                    boxShadow: 'var(--shadow-xl)',
                    border: '1px solid var(--color-surface-border)',
                    padding: '20px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '20px',
                    zIndex: 300
                  }}
                >
                  {categories.map((cat) => (
                    <div key={cat.id}>
                      <div
                        onClick={() => {
                          setMegaMenuOpen(false);
                          navigateTo('catalog', { category: cat.id });
                        }}
                        style={{
                          fontWeight: 700,
                          fontSize: '14px',
                          color: 'var(--color-primary-900)',
                          marginBottom: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span style={{ color: 'var(--color-accent-blue)' }}>⚡</span>
                        <span>{cat.name}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {cat.subcategories.map((sub) => (
                          <div
                            key={sub}
                            onClick={() => {
                              setMegaMenuOpen(false);
                              navigateTo('catalog', { category: cat.id, subcategory: sub });
                            }}
                            style={{
                              fontSize: '12px',
                              color: 'var(--color-text-muted)',
                              cursor: 'pointer',
                              padding: '2px 0'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent-blue)')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                          >
                            • {sub}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {/* Workshop Service Special Column */}
                  <div style={{ backgroundColor: '#f0f9ff', padding: '14px', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                    <div style={{ fontWeight: 800, fontSize: '13px', color: '#0369a1', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Wrench size={16} /> Motor Rewinding Service
                    </div>
                    <p style={{ fontSize: '12px', color: '#075985', marginBottom: '10px' }}>
                      Heavy 3-phase AC motor stator rewinding, vacuum varnish baking & dynamic rotor balancing at Beawar workshop.
                    </p>
                    <button
                      onClick={() => {
                        setMegaMenuOpen(false);
                        setRewindingModalOpen(true);
                      }}
                      className="btn btn-primary btn-sm"
                      style={{ width: '100%', fontSize: '12px' }}
                    >
                      Book Repair / Overhaul
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Category Tabs */}
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigateTo('catalog', { category: cat.id })}
                style={{
                  color: '#e2e8f0',
                  fontSize: '13px',
                  fontWeight: 600,
                  padding: '0 12px',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'color 0.15s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#e2e8f0')}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Right Highlights */}
          <div className="flex items-center gap-3" style={{ fontSize: '12px' }}>
            <button
              onClick={() => setRewindingModalOpen(true)}
              className="flex items-center gap-1"
              style={{ color: '#fcd34d', fontWeight: 600 }}
            >
              <Wrench size={13} />
              <span>Rewinding Desk</span>
            </button>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
            <button
              onClick={() => navigateTo('catalog', { brand: 'ador-welding' })}
              style={{ color: '#ffffff', fontWeight: 500 }}
            >
              Ador Welding Store
            </button>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
            <button
              onClick={() => navigateTo('quotation-builder')}
              style={{ color: '#ffffff', fontWeight: 500 }}
            >
              B2B Quotations
            </button>
          </div>
        </div>
      </div>

      {/* 5. DELIVERY PINCODE MODAL */}
      {pincodeModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              maxWidth: '420px',
              width: '90%',
              boxShadow: 'var(--shadow-xl)'
            }}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
              <div style={{ fontWeight: 800, fontSize: '18px', color: 'var(--color-primary-900)' }}>
                Select Delivery Location
              </div>
              <button onClick={() => setPincodeModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
              Enter your 6-digit delivery pincode to check estimated dispatch time from Dagdi Beawar central godown.
            </p>
            <form onSubmit={handleSavePincode}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  maxLength={6}
                  value={tempPincode}
                  onChange={(e) => setTempPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 305901 (Beawar)"
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-surface-border-strong)',
                    fontSize: '15px',
                    fontWeight: 600
                  }}
                  autoFocus
                />
                <button type="submit" className="btn btn-primary">
                  Check & Apply
                </button>
              </div>
            </form>
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16a34a' }}>
                <CheckCircle size={14} /> Beawar & Ajmer Region: Same-Day / Next-Day Delivery
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2563eb' }}>
                <CheckCircle size={14} /> Jaipur, Jodhpur, Bhilwara: 24 to 48 Hours Dispatch
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)' }}>
                <CheckCircle size={14} /> Pan-India Transport: 3-5 Working Days
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
