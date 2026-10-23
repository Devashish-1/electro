'use client';

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, ShoppingCart, Heart, FileText, CheckCircle2, ShieldCheck, ArrowRight, Star } from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setRfqModalOpen,
    navigateTo
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isWishlisted = isInWishlist(product.id);
  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuickViewProduct(null);
  };

  const handleViewFullDetails = () => {
    setQuickViewProduct(null);
    navigateTo('product-detail', product);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1050,
        backgroundColor: 'rgba(7, 14, 32, 0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={() => setQuickViewProduct(null)}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          maxWidth: '860px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '28px',
          padding: '28px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            padding: '6px',
            borderRadius: '50%',
            backgroundColor: '#f1f5f9',
            color: 'var(--color-text-subtle)'
          }}
        >
          <X size={20} />
        </button>

        {/* Left Column: Gallery */}
        <div>
          <div
            style={{
              width: '100%',
              height: '320px',
              backgroundColor: '#f8fafc',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              marginBottom: '12px',
              border: '1px solid var(--color-surface-border)'
            }}
          >
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
            />
          </div>

          {product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '8px' }}>
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '8px',
                    border: activeImageIndex === idx ? '2px solid var(--color-accent-blue)' : '1px solid var(--color-surface-border)',
                    padding: '4px',
                    background: '#f8fafc'
                  }}
                >
                  <img src={img} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </button>
              ))}
            </div>
          )}

          <div style={{ marginTop: '16px', padding: '12px', background: '#f8fafc', borderRadius: '8px', fontSize: '12px' }}>
            <div className="flex items-center gap-2" style={{ color: '#059669', fontWeight: 600, marginBottom: '4px' }}>
              <ShieldCheck size={16} /> 100% Genuine Guaranteed by Dagdi
            </div>
            <div style={{ color: 'var(--color-text-muted)' }}>
              Dispatched with manufacturer warranty & GST tax invoice from Beawar facility.
            </div>
          </div>
        </div>

        {/* Right Column: Details & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="flex items-center gap-2" style={{ marginBottom: '8px', fontSize: '12px' }}>
            <span className="badge badge-blue">{product.brand}</span>
            <span style={{ color: 'var(--color-text-subtle)' }}>SKU: {product.sku}</span>
            <span style={{ color: 'var(--color-text-subtle)' }}>• HSN: {product.hsnCode}</span>
          </div>

          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-primary-900)', lineHeight: 1.3, marginBottom: '10px' }}>
            {product.name}
          </h2>

          <div className="flex items-center gap-3" style={{ marginBottom: '14px', fontSize: '13px' }}>
            <div className="flex items-center gap-1" style={{ color: '#d97706', fontWeight: 700 }}>
              <Star size={16} fill="#f59e0b" color="#f59e0b" />
              <span>{product.rating.toFixed(1)}</span>
              <span style={{ color: 'var(--color-text-subtle)', fontWeight: 400 }}>({product.reviewCount} reviews)</span>
            </div>
            <span style={{ color: '#cbd5e1' }}>|</span>
            <div className="flex items-center gap-1" style={{ color: '#059669', fontWeight: 600 }}>
              <CheckCircle2 size={14} />
              <span>In Stock ({product.stockCount} {product.unit}s)</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div style={{ padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-surface-border)', marginBottom: '16px' }}>
            <div className="flex items-baseline gap-3">
              <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-primary-900)' }} className="tabular-nums">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.mrp > product.price && (
                <span style={{ fontSize: '16px', color: 'var(--color-text-subtle)', textDecoration: 'line-through' }} className="tabular-nums">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="badge badge-green">{discountPercent}% OFF</span>
              )}
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginLeft: 'auto' }}>
                Per {product.unit}
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-subtle)', marginTop: '4px' }}>
              Inclusive of 18% GST (CGST 9% + SGST 9%) • Input Tax Credit eligible
            </div>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
            {product.shortDesc}
          </p>

          {/* Key Specifications Preview */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary-900)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Key Technical Specs
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', fontSize: '12px' }}>
              {Object.entries(product.specs).slice(0, 4).map(([key, val]) => (
                <div key={key} style={{ background: '#f8fafc', padding: '6px 8px', borderRadius: '4px' }}>
                  <div style={{ color: 'var(--color-text-subtle)', fontSize: '11px' }}>{key}</div>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
            <button
              onClick={handleAddToCart}
              className="btn btn-primary flex items-center justify-center gap-2"
              style={{ flex: 1, padding: '12px' }}
            >
              <ShoppingCart size={18} />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={() => {
                setQuickViewProduct(null);
                setRfqModalOpen(true);
              }}
              className="btn btn-outline flex items-center justify-center gap-1"
              style={{ padding: '12px 14px' }}
              title="Request Bulk Quote"
            >
              <FileText size={18} />
              <span>RFQ Quote</span>
            </button>

            <button
              onClick={() => toggleWishlist(product.id)}
              className="btn btn-outline"
              style={{ padding: '12px' }}
              title="Add to Wishlist"
            >
              <Heart size={18} fill={isWishlisted ? '#ef4444' : 'none'} color={isWishlisted ? '#ef4444' : 'currentColor'} />
            </button>
          </div>

          <button
            onClick={handleViewFullDetails}
            style={{
              marginTop: '12px',
              textAlign: 'center',
              fontSize: '13px',
              color: 'var(--color-accent-blue)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <span>View Full Specifications & Datasheet</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
