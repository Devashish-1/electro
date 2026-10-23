'use client';

import React from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { ShoppingCart, Heart, Scale, Eye, FileText, CheckCircle2, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, compact = false }) => {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    addToCompare,
    compareList,
    navigateTo,
    setQuickViewProduct,
    setRfqModalOpen
  } = useStore();

  const isWishlisted = isInWishlist(product.id);
  const isCompared = compareList.some((p) => p.id === product.id);
  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCompare(product);
  };

  const handleCardClick = () => {
    navigateTo('product-detail', product);
  };

  return (
    <div
      onClick={handleCardClick}
      style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-surface-border)',
        boxShadow: 'var(--shadow-xs)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative',
        transition: 'all var(--transition-normal)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
        e.currentTarget.style.borderColor = 'var(--color-surface-border-strong)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
        e.currentTarget.style.borderColor = 'var(--color-surface-border)';
      }}
    >
      {/* Badges Overlay */}
      <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {product.badge && (
          <span
            className={`badge ${
              product.badge === 'HEAVY DUTY'
                ? 'badge-navy'
                : product.badge === 'BESTSELLER'
                ? 'badge-amber'
                : 'badge-blue'
            }`}
          >
            {product.badge}
          </span>
        )}
        {discountPercent > 0 && (
          <span className="badge badge-green" style={{ fontSize: '10px' }}>
            {discountPercent}% OFF
          </span>
        )}
      </div>

      {/* Floating Action Buttons (Wishlist, Compare, Quick View) */}
      <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <button
          onClick={handleToggleWishlist}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isWishlisted ? '#ef4444' : 'var(--color-text-subtle)',
            border: '1px solid #f1f5f9'
          }}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={16} fill={isWishlisted ? '#ef4444' : 'none'} />
        </button>

        <button
          onClick={handleToggleCompare}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: isCompared ? 'var(--color-accent-blue)' : '#ffffff',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isCompared ? '#ffffff' : 'var(--color-text-subtle)',
            border: '1px solid #f1f5f9'
          }}
          title="Compare with another item"
        >
          <Scale size={15} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setQuickViewProduct(product);
          }}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-text-subtle)',
            border: '1px solid #f1f5f9'
          }}
          title="Quick View"
        >
          <Eye size={15} />
        </button>
      </div>

      {/* Product Image Area */}
      <div
        style={{
          width: '100%',
          height: compact ? '180px' : '220px',
          backgroundColor: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          style={{
            maxHeight: '100%',
            maxWidth: '100%',
            objectFit: 'contain',
            transition: 'transform var(--transition-normal)'
          }}
          onError={(e) => {
            // Fallback to placeholder SVG if image load fails
            e.currentTarget.src =
              'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect fill="%23f1f5f9" width="200" height="200"/><text fill="%2394a3b8" font-family="sans-serif" font-size="12" dy="105" font-weight="bold" text-anchor="middle" x="100">DAGDI ELECTRICALS</text></svg>';
          }}
        />
      </div>

      {/* Product Details Section */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Brand & HSN Code Bar */}
        <div className="flex items-center justify-between" style={{ marginBottom: '6px', fontSize: '11px' }}>
          <span style={{ color: 'var(--color-accent-blue)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {product.brand}
          </span>
          <span style={{ color: 'var(--color-text-subtle)', background: '#f1f5f9', padding: '1px 6px', borderRadius: '4px', fontFamily: 'var(--font-mono)' }}>
            HSN {product.hsnCode}
          </span>
        </div>

        {/* Product Title */}
        <h3
          style={{
            fontSize: '14px',
            fontWeight: 700,
            color: 'var(--color-primary-900)',
            lineHeight: 1.4,
            height: '40px',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            marginBottom: '8px'
          }}
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Rating and Stock */}
        <div className="flex items-center justify-between" style={{ marginBottom: '10px', fontSize: '12px' }}>
          <div className="flex items-center gap-1" style={{ color: '#d97706', fontWeight: 700 }}>
            <Star size={14} fill="#f59e0b" color="#f59e0b" />
            <span>{product.rating.toFixed(1)}</span>
            <span style={{ color: 'var(--color-text-subtle)', fontWeight: 400 }}>({product.reviewCount})</span>
          </div>

          <div className="flex items-center gap-1" style={{ color: '#059669', fontSize: '11px', fontWeight: 600 }}>
            <CheckCircle2 size={13} />
            <span>In Stock</span>
          </div>
        </div>

        {/* Tier Pricing Pill if available */}
        {product.tierPricing && product.tierPricing.length > 1 && (
          <div
            style={{
              backgroundColor: '#fef3c7',
              border: '1px dashed #f59e0b',
              borderRadius: 'var(--radius-sm)',
              padding: '4px 8px',
              fontSize: '11px',
              color: '#92400e',
              fontWeight: 600,
              marginBottom: '10px'
            }}
          >
            Bulk Tier: ₹{product.tierPricing[product.tierPricing.length - 1].pricePerUnit.toLocaleString('en-IN')} for {product.tierPricing[product.tierPricing.length - 1].minQty}+ units
          </div>
        )}

        {/* Price Area */}
        <div style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
          <div className="flex items-baseline gap-2">
            <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-primary-900)' }} className="tabular-nums">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.mrp > product.price && (
              <span style={{ fontSize: '13px', color: 'var(--color-text-subtle)', textDecoration: 'line-through' }} className="tabular-nums">
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
            )}
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginLeft: 'auto' }}>
              /{product.unit}
            </span>
          </div>
          <div style={{ fontSize: '10px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
            Incl. 18% GST • Free Shipping &gt; ₹5k
          </div>
        </div>

        {/* Action Buttons: Add to Cart & B2B RFQ */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '6px', marginTop: '12px' }}>
          <button
            onClick={handleQuickAdd}
            className="btn btn-primary btn-sm flex items-center justify-center gap-1"
            style={{ width: '100%', fontSize: '12px', padding: '8px' }}
          >
            <ShoppingCart size={15} />
            <span>Add to Cart</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setRfqModalOpen(true);
            }}
            className="btn btn-outline btn-sm flex items-center justify-center"
            style={{ padding: '8px 10px', borderColor: 'var(--color-surface-border-strong)' }}
            title="Request Bulk Quotation (RFQ)"
          >
            <FileText size={15} color="var(--color-primary-900)" />
          </button>
        </div>
      </div>
    </div>
  );
};
