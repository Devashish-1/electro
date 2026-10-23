'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { categories, brands } from '../data/catalogue';
import { ProductCard } from '../components/ProductCard';
import {
  Filter,
  X,
  SlidersHorizontal,
  ChevronRight,
  RotateCcw,
  Search,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const CatalogPage: React.FC = () => {
  const {
    products,
    pageParam,
    navigateTo,
    wishlist
  } = useStore();

  // Read params
  const initialCategory = pageParam?.category || 'all';
  const initialBrand = pageParam?.brand || 'all';
  const initialQuery = pageParam?.query || '';
  const initialWishlistOnly = pageParam?.wishlistOnly || false;

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>(initialQuery);
  const [priceMax, setPriceMax] = useState<number>(300000);
  const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('relevance');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync from URL if directly visited with ?category=...
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const catParam = urlParams.get('category');
      const brandParam = urlParams.get('brand');
      const qParam = urlParams.get('search');
      if (catParam) setSelectedCategory(catParam);
      if (brandParam) setSelectedBrand(brandParam);
      if (qParam) setSearchFilter(qParam);
    }
  }, []);

  // Compute filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (initialWishlistOnly && !wishlist.includes(p.id)) return false;
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (selectedSubcategory !== 'all' && p.subcategory !== selectedSubcategory) return false;
      if (selectedBrand !== 'all') {
        const brandObj = brands.find((b) => b.id === selectedBrand);
        if (brandObj && p.brand !== brandObj.name) return false;
      }
      if (inStockOnly && (!p.inStock || p.stockCount <= 0)) return false;
      if (p.price > priceMax) return false;

      if (searchFilter.trim()) {
        const query = searchFilter.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesBrand = p.brand.toLowerCase().includes(query);
        const matchesSku = p.sku.toLowerCase().includes(query);
        const matchesHsn = p.hsnCode.includes(query);
        const matchesSubcat = p.subcategory.toLowerCase().includes(query);
        const matchesDesc = p.shortDesc.toLowerCase().includes(query);
        if (!matchesName && !matchesBrand && !matchesSku && !matchesHsn && !matchesSubcat && !matchesDesc) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return b.reviewCount - a.reviewCount;
      return 0;
    });
  }, [products, selectedCategory, selectedSubcategory, selectedBrand, inStockOnly, searchFilter, priceMax, sortBy, initialWishlistOnly, wishlist]);

  const activeCategoryObj = categories.find((c) => c.id === selectedCategory);

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSelectedSubcategory('all');
    setInStockOnly(false);
    setSearchFilter('');
    setPriceMax(300000);
    setSortBy('relevance');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedBrand !== 'all' ||
    selectedSubcategory !== 'all' ||
    inStockOnly ||
    searchFilter.trim() !== '' ||
    priceMax < 300000;

  return (
    <div style={{ backgroundColor: 'var(--color-surface-bg)', minHeight: '100vh', paddingBottom: '70px' }}>
      {/* 1. CLEAN BREADCRUMB */}
      <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--color-surface-border)', padding: '12px 0' }}>
        <div className="container flex items-center justify-between" style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
          <div className="flex items-center gap-2">
            <button onClick={() => navigateTo('home')} style={{ color: 'var(--color-text-muted)', cursor: 'pointer' }}>
              Home
            </button>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--color-primary-900)', fontWeight: 600 }}>
              {initialWishlistOnly ? 'Saved Wishlist' : 'Industrial Catalog'}
            </span>
            {activeCategoryObj && (
              <>
                <ChevronRight size={14} />
                <span style={{ color: 'var(--color-accent-blue)', fontWeight: 700 }}>
                  {activeCategoryObj.name}
                </span>
              </>
            )}
          </div>

          {activeCategoryObj && (
            <button
              onClick={() => navigateTo('category', { slug: activeCategoryObj.id })}
              className="flex items-center gap-1"
              style={{ color: 'var(--color-accent-blue)', fontWeight: 700, fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <span>Switch to {activeCategoryObj.name} Hub</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>

      {/* 2. DEDICATED CATEGORY TABS STRIP */}
      <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--color-surface-border)', padding: '14px 0', overflowX: 'auto' }}>
        <div className="container flex items-center gap-2" style={{ minWidth: 'max-content' }}>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedSubcategory('all');
            }}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              border: selectedCategory === 'all' ? '1px solid var(--color-accent-blue)' : '1px solid var(--color-surface-border)',
              backgroundColor: selectedCategory === 'all' ? 'var(--color-primary-900)' : '#ffffff',
              color: selectedCategory === 'all' ? '#ffffff' : 'var(--color-text-main)',
              transition: 'all 0.15s'
            }}
          >
            All Products ({products.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigateTo('category', { slug: cat.id })}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                border: selectedCategory === cat.id ? '1px solid var(--color-accent-blue)' : '1px solid var(--color-surface-border)',
                backgroundColor: selectedCategory === cat.id ? '#f0f9ff' : '#ffffff',
                color: selectedCategory === cat.id ? '#0284c7' : 'var(--color-text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s'
              }}
            >
              <span>{cat.name}</span>
              <span style={{ fontSize: '11px', opacity: 0.7, backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. MODERN HORIZONTAL FILTER BAR */}
      <div className="container" style={{ paddingTop: '20px' }}>
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-surface-border)',
            padding: '16px 20px',
            marginBottom: '24px',
            boxShadow: 'var(--shadow-xs)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}
        >
          {/* Left: Quick search and filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', flex: 1 }}>
            {/* Search within results */}
            <div style={{ position: 'relative', minWidth: '220px', flex: '1 1 220px' }}>
              <input
                type="text"
                placeholder="Search models, parts, HSN..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 32px 9px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-surface-border-strong)',
                  fontSize: '13px'
                }}
              />
              <Search size={15} style={{ position: 'absolute', right: '10px', top: '11px', color: '#94a3b8' }} />
            </div>

            {/* Brand Dropdown */}
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              style={{
                padding: '9px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-surface-border-strong)',
                fontSize: '13px',
                backgroundColor: '#ffffff',
                fontWeight: 600,
                color: '#334155'
              }}
            >
              <option value="all">All Brands ({brands.length})</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>

            {/* In Stock toggle chip */}
            <button
              onClick={() => setInStockOnly(!inStockOnly)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 14px',
                borderRadius: 'var(--radius-md)',
                border: inStockOnly ? '1px solid #10b981' : '1px solid var(--color-surface-border-strong)',
                backgroundColor: inStockOnly ? '#ecfdf5' : '#ffffff',
                color: inStockOnly ? '#047857' : '#334155',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <CheckCircle2 size={15} color={inStockOnly ? '#10b981' : '#94a3b8'} />
              <span>In-Stock Only</span>
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1"
                style={{
                  padding: '8px 12px',
                  color: '#ef4444',
                  fontSize: '12px',
                  fontWeight: 700,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <RotateCcw size={13} />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Right: Sort & Count */}
          <div className="flex items-center gap-3">
            <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              <strong>{filteredProducts.length}</strong> items
            </span>

            <div className="flex items-center gap-2">
              <label style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Sort:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                style={{
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-surface-border-strong)',
                  fontSize: '13px',
                  fontWeight: 600,
                  backgroundColor: '#ffffff'
                }}
              >
                <option value="relevance">Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Most Inquiries</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4. PRODUCT GRID */}
        {filteredProducts.length === 0 ? (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              padding: '60px 20px',
              textAlign: 'center',
              border: '1px solid var(--color-surface-border)'
            }}
          >
            <div style={{ fontSize: '42px', marginBottom: '12px' }}>🔍</div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-primary-900)', marginBottom: '8px' }}>
              No Industrial Equipment Matches Your Filter
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', maxWidth: '440px', margin: '0 auto 20px' }}>
              Try broadening your keyword search, selecting "All Brands", or clearing your active filters.
            </p>
            <button onClick={clearAllFilters} className="btn btn-primary">
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="product-responsive-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
