'use client';

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartDrawerOpen,
    setCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    storeConfig,
    navigateTo
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  if (!cartDrawerOpen) return null;

  // Free shipping progress calculation
  const freeShippingThreshold = storeConfig.freeShippingThreshold;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));
  const amountNeeded = Math.max(0, freeShippingThreshold - cartSubtotal);

  // Apply Coupon
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponInput.trim().toUpperCase();
    if (code === 'DAGDIPOWER') {
      const disc = Math.round(cartSubtotal * 0.05); // 5% discount
      setAppliedCoupon({ code, discount: disc });
    } else if (code === 'FIRSTBUY') {
      setAppliedCoupon({ code, discount: 200 });
    } else {
      setCouponError('Invalid coupon code. Try DAGDIPOWER for 5% off.');
    }
  };

  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const shippingCharge = cartSubtotal >= freeShippingThreshold || cartSubtotal === 0 ? 0 : storeConfig.flatShippingRate;
  const finalTotal = Math.max(0, cartSubtotal - discountAmount + shippingCharge);
  const estimatedGst = Math.round((finalTotal * 18) / 118);

  const handleProceedToCheckout = () => {
    setCartDrawerOpen(false);
    navigateTo('checkout', { appliedCoupon, discountAmount, shippingCharge });
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(7, 14, 32, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        justifyContent: 'flex-end',
        transition: 'opacity 0.2s'
      }}
      onClick={() => setCartDrawerOpen(false)}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          backgroundColor: '#ffffff',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--color-surface-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#f8fafc'
          }}
        >
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} color="var(--color-accent-blue)" />
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-primary-900)', margin: 0 }}>
              Shopping Cart ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={() => setCartDrawerOpen(false)}
            style={{ padding: '6px', borderRadius: '6px', color: 'var(--color-text-subtle)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div style={{ padding: '12px 20px', backgroundColor: '#f0f9ff', borderBottom: '1px solid #e0f2fe' }}>
          <div className="flex items-center justify-between" style={{ fontSize: '12px', fontWeight: 600, color: '#0369a1', marginBottom: '6px' }}>
            {amountNeeded === 0 ? (
              <span className="flex items-center gap-1" style={{ color: '#059669', fontWeight: 700 }}>
                <ShieldCheck size={14} /> Congratulations! You unlocked FREE Delivery
              </span>
            ) : (
              <span>Add ₹{amountNeeded.toLocaleString('en-IN')} more for FREE Express Delivery</span>
            )}
            <span>{progressPercent}%</span>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                backgroundColor: progressPercent === 100 ? '#10b981' : '#0066ff',
                transition: 'width 0.3s'
              }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: 'var(--color-text-subtle)'
                }}
              >
                <ShoppingBag size={28} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-primary-900)', marginBottom: '8px' }}>
                Your cart is currently empty
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
                Explore Dagdi's range of APFC panels, Ador & D&H welding electrodes, copper wires, and motors.
              </p>
              <button
                onClick={() => {
                  setCartDrawerOpen(false);
                  navigateTo('catalog');
                }}
                className="btn btn-primary"
              >
                Browse Catalogue
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-surface-border)',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    style={{ width: '60px', height: '60px', objectFit: 'contain', borderRadius: '6px', background: '#f8fafc', padding: '4px' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary-900)', lineHeight: 1.3, marginBottom: '4px' }}>
                      {item.product.name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                      SKU: {item.product.sku} • {item.product.unit}
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity Selector */}
                      <div className="flex items-center" style={{ border: '1px solid var(--color-surface-border-strong)', borderRadius: '6px' }}>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          style={{ padding: '3px 8px', color: 'var(--color-text-main)' }}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span style={{ padding: '0 8px', fontSize: '13px', fontWeight: 700 }} className="tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          style={{ padding: '3px 8px', color: 'var(--color-text-main)' }}
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-primary-900)' }} className="tabular-nums">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--color-text-subtle)' }}>
                          ₹{item.product.price.toLocaleString('en-IN')} ea.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    style={{ color: '#ef4444', alignSelf: 'flex-start', padding: '4px' }}
                    title="Remove item"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Area with Summary, Coupon & Checkout */}
        {cart.length > 0 && (
          <div style={{ padding: '16px 20px', borderTop: '1px solid var(--color-surface-border)', backgroundColor: '#f8fafc' }}>
            {/* Promo Code Input */}
            <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type="text"
                  placeholder="Coupon (e.g. DAGDIPOWER)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px 8px 30px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-surface-border-strong)',
                    fontSize: '12px',
                    textTransform: 'uppercase'
                  }}
                />
                <Tag size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--color-text-subtle)' }} />
              </div>
              <button type="submit" className="btn btn-outline btn-sm" style={{ fontSize: '12px' }}>
                Apply
              </button>
            </form>

            {couponError && (
              <div style={{ color: '#ef4444', fontSize: '11px', marginBottom: '8px' }}>
                {couponError}
              </div>
            )}

            {appliedCoupon && (
              <div style={{ color: '#16a34a', fontSize: '11px', fontWeight: 600, marginBottom: '8px' }}>
                ✓ Coupon '{appliedCoupon.code}' applied! Saved ₹{appliedCoupon.discount.toLocaleString('en-IN')}
              </div>
            )}

            {/* Price Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', marginBottom: '14px' }}>
              <div className="flex justify-between" style={{ color: 'var(--color-text-muted)' }}>
                <span>Subtotal (All Items)</span>
                <span className="tabular-nums font-semibold">₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between" style={{ color: '#16a34a' }}>
                  <span>Discount</span>
                  <span className="tabular-nums font-semibold">-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between" style={{ color: 'var(--color-text-muted)' }}>
                <span>Estimated Shipping</span>
                <span className="tabular-nums font-semibold">
                  {shippingCharge === 0 ? <span style={{ color: '#10b981', fontWeight: 700 }}>FREE</span> : `₹${shippingCharge}`}
                </span>
              </div>

              <div className="flex justify-between" style={{ color: 'var(--color-text-subtle)', fontSize: '11px' }}>
                <span>Inclusive of 18% GST (CGST 9% + SGST 9%)</span>
                <span className="tabular-nums">₹{estimatedGst.toLocaleString('en-IN')}</span>
              </div>

              <div
                className="flex justify-between"
                style={{
                  borderTop: '1px solid var(--color-surface-border)',
                  paddingTop: '8px',
                  fontSize: '16px',
                  fontWeight: 800,
                  color: 'var(--color-primary-900)'
                }}
              >
                <span>Total Amount</span>
                <span className="tabular-nums">₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Direct Checkout CTA */}
            <button
              onClick={handleProceedToCheckout}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '15px', fontWeight: 700 }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
