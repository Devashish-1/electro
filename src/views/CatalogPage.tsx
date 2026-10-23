'use client';

import React, { useState, useMemo } from 'react';
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
  Tag
} from 'lucide-react';

export const CatalogPage: React.FC = () => {
  const {
    products,
    pageParam,
    navigateTo,
    wishlist
  } = useStore();

  // Filters state
  const initialCategory = pageParam?.category || 'all';
  const initialBrand = pageParam?.brand || 'all';
  const initialQuery = pageParam?.query || '';
  const initialWishlistOnly = pageParam?.wishlistOnly || false;

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>(initialQuery);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300000]);
  const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('relevance');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Compute filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Wishlist only filter
      if (initialWishlistOnly && !wishlist.includes(p.id)) return false;

      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;

      // Subcategory filter
      if (selectedSubcategory !== 'all' && p.subcategory !== selectedSubcategory) return false;

      // Brand filter
      if (selectedBrand !== 'all') {
        const brandObj = brands.find((b) => b.id === selectedBrand);
        if (brandObj && p.brand !== brandObj.name) return false;
      }

      // Stock filter
      if (inStockOnly && (!p.inStock || p.stockCount <= 0)) return false;

      // Price filter
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;

      // Search query filter
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
      return 0; // relevance
    });
  }, [products, selectedCategory, selectedSubcategory, selectedBrand, inStockOnly, searchFilter, priceRange, sortBy, initialWishlistOnly, wishlist]);

  const activeCategoryObj = categories.find((c) => c.id === selectedCategory);

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSelectedSubcategory('all');
    setInStockOnly(false);
    setSearchFilter('');
    setPriceRange([0, 300000]);
    setSortBy('relevance');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedBrand !== 'all' ||
    selectedSubcategory !== 'all' ||
    inStockOnly ||
    searchFilter.trim() !== '' ||
    priceRange[0] > 0 ||
    priceRange[1] < 300000;

  return (
    <div className="container" style={{ paddingTop: '24px', paddingBottom: '60px' }}>
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2" style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
        <button onClick={() => navigateTo('home')} style={{ color: 'var(--color-text-muted)' }}>
          Home
        </button>
        <ChevronRight size={14} />
        <button onClick={() => setSelectedCategory('all')} style={{ color: selectedCategory === 'all' ? 'var(--color-primary-900)' : 'var(--color-text-muted)', fontWeight: selectedCategory === 'all' ? 700 : 400 }}>
          All Products
        </button>
        {activeCategoryObj && (
          <>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--color-primary-900)', fontWeight: 700 }}>
              {activeCategoryObj.name}
            </span>
          </>
        )}
        {initialWishlistOnly && (
          <>
            <ChevronRight size={14} />
            <span style={{ color: '#ef4444', fontWeight: 700 }}>My Saved Wishlist</span>
          </>
        )}
      </div>

      {/* Category Header */}
      <div style={{ marginBottom: '24px', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-primary-900)', margin: '0 0 6px' }}>
            {initialWishlistOnly
              ? 'My Wishlist'
              : activeCategoryObj
              ? activeCategoryObj.name
              : 'Electrical & Industrial Product Catalogue'}
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', margin: 0 }}>
            {activeCategoryObj
              ? activeCategoryObj.description
              : 'Authorized stock of APFC panels, Ador & D&H welding rods, pure copper winding wire, motors and HT switchgear.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
            Showing <strong>{filteredProducts.length}</strong> products
          </span>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <label style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                padding: '8px 12px',
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
              <option value="rating">Highest Customer Rating</option>
              <option value="newest">Most Popular / Reviews</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Products */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '32px', alignItems: 'start' }}>
        {/* DESKTOP FILTER SIDEBAR */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-surface-border)',
            padding: '20px',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--color-surface-border)' }}>
            <div className="flex items-center gap-2">
              <Filter size={18} color="var(--color-accent-blue)" />
              <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-primary-900)' }}>
                Filters
              </span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1"
                style={{ fontSize: '12px', color: '#ef4444', fontWeight: 600 }}
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Search within results */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-main)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              Search Keywords
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Model, spec, HSN..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '7px 28px 7px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-surface-border-strong)',
                  fontSize: '12px'
                }}
              />
              <Search size={14} style={{ position: 'absolute', right: '8px', top: '10px', color: 'var(--color-text-subtle)' }} />
            </div>
          </div>

          {/* Categories Filter */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-main)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              Category
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
              <label className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="cat"
                  checked={selectedCategory === 'all'}
                  onChange={() => {
                    setSelectedCategory('all');
                    setSelectedSubcategory('all');
                  }}
                  style={{ accentColor: 'var(--color-accent-blue)' }}
                />
                <span style={{ fontWeight: selectedCategory === 'all' ? 700 : 400 }}>All Categories</span>
              </label>

              {categories.map((c) => (
                <label key={c.id} className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="cat"
                    checked={selectedCategory === c.id}
                    onChange={() => {
                      setSelectedCategory(c.id);
                      setSelectedSubcategory('all');
                    }}
                    style={{ accentColor: 'var(--color-accent-blue)' }}
                  />
                  <span style={{ fontWeight: selectedCategory === c.id ? 700 : 400 }}>{c.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Subcategories (if a category is active) */}
          {activeCategoryObj && (
            <div style={{ marginBottom: '20px', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-accent-blue)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                Subcategory
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
                <button
                  onClick={() => setSelectedSubcategory('all')}
                  style={{
                    textAlign: 'left',
                    color: selectedSubcategory === 'all' ? 'var(--color-accent-blue)' : 'var(--color-text-main)',
                    fontWeight: selectedSubcategory === 'all' ? 700 : 400
                  }}
                >
                  • All {activeCategoryObj.name}
                </button>
                {activeCategoryObj.subcategories.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubcategory(sub)}
                    style={{
                      textAlign: 'left',
                      color: selectedSubcategory === sub ? 'var(--color-accent-blue)' : 'var(--color-text-muted)',
                      fontWeight: selectedSubcategory === sub ? 700 : 400
                    }}
                  >
                    • {sub}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Brand Filter */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-main)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              Authorized Brand
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
              <label className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="brand"
                  checked={selectedBrand === 'all'}
                  onChange={() => setSelectedBrand('all')}
                  style={{ accentColor: 'var(--color-accent-blue)' }}
                />
                <span style={{ fontWeight: selectedBrand === 'all' ? 700 : 400 }}>All Brands</span>
              </label>

              {brands.map((b) => (
                <label key={b.id} className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="brand"
                    checked={selectedBrand === b.id}
                    onChange={() => setSelectedBrand(b.id)}
                    style={{ accentColor: 'var(--color-accent-blue)' }}
                  />
                  <span style={{ fontWeight: selectedBrand === b.id ? 700 : 400 }}>{b.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Availability Filter */}
          <div style={{ marginBottom: '20px' }}>
            <label className="flex items-center gap-2" style={{ fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#10b981' }}
              />
              <span className="flex items-center gap-1" style={{ color: '#059669' }}>
                <CheckCircle2 size={14} /> In Stock Only
              </span>
            </label>
          </div>

          {/* Price Range Filter */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-main)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              Price Range (₹)
            </label>
            <div className="flex items-center gap-2" style={{ fontSize: '12px', marginBottom: '8px' }}>
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                placeholder="Min"
              />
              <span>-</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                placeholder="Max"
              />
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-subtle)' }}>
              From ₹{priceRange[0].toLocaleString('en-IN')} to ₹{priceRange[1].toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* PRODUCTS GRID */}
        <div>
          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
              {selectedCategory !== 'all' && (
                <span className="badge badge-blue" style={{ fontSize: '11px', padding: '4px 10px', textTransform: 'none' }}>
                  Category: {activeCategoryObj?.name}
                  <button onClick={() => setSelectedCategory('all')} style={{ marginLeft: '4px' }}>×</button>
                </span>
              )}
              {selectedSubcategory !== 'all' && (
                <span className="badge badge-blue" style={{ fontSize: '11px', padding: '4px 10px', textTransform: 'none' }}>
                  Sub: {selectedSubcategory}
                  <button onClick={() => setSelectedSubcategory('all')} style={{ marginLeft: '4px' }}>×</button>
                </span>
              )}
              {selectedBrand !== 'all' && (
                <span className="badge badge-amber" style={{ fontSize: '11px', padding: '4px 10px', textTransform: 'none' }}>
                  Brand: {brands.find((b) => b.id === selectedBrand)?.name}
                  <button onClick={() => setSelectedBrand('all')} style={{ marginLeft: '4px' }}>×</button>
                </span>
              )}
              {inStockOnly && (
                <span className="badge badge-green" style={{ fontSize: '11px', padding: '4px 10px', textTransform: 'none' }}>
                  In Stock Only
                  <button onClick={() => setInStockOnly(false)} style={{ marginLeft: '4px' }}>×</button>
                </span>
              )}
              {searchFilter && (
                <span className="badge badge-navy" style={{ fontSize: '11px', padding: '4px 10px', textTransform: 'none' }}>
                  Keyword: "{searchFilter}"
                  <button onClick={() => setSearchFilter('')} style={{ marginLeft: '4px' }}>×</button>
                </span>
              )}
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-surface-border)',
                padding: '60px 20px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚡</div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-primary-900)', marginBottom: '8px' }}>
                No Products Found Matching Your Selection
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', maxWidth: '460px', margin: '0 auto 20px' }}>
                Try adjusting your price range, clearing filters, or request a custom quotation if you need specific electrical equipment.
              </p>
              <div className="flex justify-center gap-3">
                <button onClick={clearAllFilters} className="btn btn-outline">
                  Reset All Filters
                </button>
                <button onClick={() => navigateTo('quotation-builder')} className="btn btn-primary">
                  Request Custom Quote
                </button>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '20px'
              }}
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
