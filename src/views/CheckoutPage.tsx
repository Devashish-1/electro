'use client';

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  CreditCard,
  Building,
  Truck,
  FileText,
  AlertCircle
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    storeConfig,
    placeOrder,
    navigateTo,
    pageParam
  } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Beawar');
  const [state, setState] = useState('Rajasthan');
  const [pincode, setPincode] = useState('305901');

  // B2B GST Invoicing toggle
  const [isB2B, setIsB2B] = useState(false);
  const [gstin, setGstin] = useState('');
  const [companyName, setCompanyName] = useState('');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking' | 'NEFT_RTGS' | 'COD'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);

  // Discount and shipping passed from drawer or calculated
  const discountAmount = pageParam?.discountAmount || 0;
  const couponCode = pageParam?.appliedCoupon?.code;
  const shippingCharge =
    cartSubtotal >= storeConfig.freeShippingThreshold || cartSubtotal === 0
      ? 0
      : storeConfig.flatShippingRate;

  const finalTotal = Math.max(0, cartSubtotal - discountAmount + shippingCharge);
  const taxAmount = Math.round((finalTotal * 18) / 118);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert('Your cart is empty.');
      navigateTo('catalog');
      return;
    }

    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      alert('Please fill all required billing and shipping address fields.');
      return;
    }

    if (isB2B && gstin.trim().length !== 15) {
      alert('Please enter a valid 15-digit GSTIN or uncheck B2B Tax Credit.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const orderItems = cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        sku: item.product.sku,
        price: item.product.price,
        quantity: item.quantity,
        unit: item.product.unit,
        image: item.product.images[0]
      }));

      const newOrder = placeOrder({
        customerName,
        email: email || 'customer@dagdielectricals.com',
        phone,
        address,
        city,
        state,
        pincode,
        isB2B,
        gstin: isB2B ? gstin : undefined,
        companyName: isB2B ? companyName : undefined,
        items: orderItems,
        subtotal: cartSubtotal,
        taxAmount,
        shippingCost: shippingCharge,
        discountAmount,
        couponCode,
        totalAmount: finalTotal,
        paymentMethod,
        paymentStatus: paymentMethod === 'COD' ? 'COD Verified' : 'Paid',
        orderStatus: 'Confirmed'
      });

      setIsProcessing(false);
      navigateTo('order-confirmation', newOrder);
    }, 1000);
  };

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-primary-900)', marginBottom: '12px' }}>
          Your Shopping Cart is Empty
        </h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
          Please add products to your cart before proceeding to checkout.
        </p>
        <button onClick={() => navigateTo('catalog')} className="btn btn-primary">
          Explore Catalogue
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '32px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-primary-900)', margin: '0 0 6px' }}>
            Secure Order Checkout
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', margin: 0 }}>
            Complete your order with official 18% GST invoice and verified warehouse dispatch.
          </p>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '32px', alignItems: 'start' }}>
            {/* LEFT COLUMN: CONTACT, ADDRESS & B2B GST */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* 1. Contact Info */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-surface-border)',
                  padding: '24px',
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-primary-900)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--color-accent-blue)', color: '#fff', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
                  <span>Contact Information</span>
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kailash Choudhary"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--color-surface-border-strong)' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Mobile / WhatsApp (for Dispatch SMS) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98290 12345"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--color-surface-border-strong)' }}
                    />
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Email Address (for GST Tax Invoice PDF)
                    </label>
                    <input
                      type="email"
                      placeholder="accounts@marwarstone.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--color-surface-border-strong)' }}
                    />
                  </div>
                </div>
              </div>

              {/* 2. Shipping Address */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-surface-border)',
                  padding: '24px',
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-primary-900)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--color-accent-blue)', color: '#fff', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
                  <span>Delivery Address</span>
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Street Address / Workshop / Factory Plot *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Plot 44, Industrial Area, Sendra Road"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--color-surface-border-strong)' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--color-surface-border-strong)' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                        State *
                      </label>
                      <input
                        type="text"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--color-surface-border-strong)' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                        Pincode *
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--color-surface-border-strong)' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. B2B GST Invoicing Option */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  border: isB2B ? '2px solid var(--color-accent-blue)' : '1px solid var(--color-surface-border)',
                  padding: '20px',
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                <label className="flex items-center gap-3" style={{ cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isB2B}
                    onChange={(e) => setIsB2B(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--color-accent-blue)' }}
                  />
                  <div>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-primary-900)' }}>
                      I have a GSTIN for Business Tax Credit (Input Tax Credit 18%)
                    </span>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: 0 }}>
                      Claim eligible GST credit on this commercial purchase under GSTIN {storeConfig.gstin}.
                    </p>
                  </div>
                </label>

                {isB2B && (
                  <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                        Registered Business / Firm Name *
                      </label>
                      <input
                        type="text"
                        required={isB2B}
                        placeholder="e.g. Marwar Stone Mills Pvt Ltd"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-surface-border-strong)' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                        15-Digit GSTIN Number *
                      </label>
                      <input
                        type="text"
                        maxLength={15}
                        required={isB2B}
                        placeholder="08AAACM4912K1Z4"
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value.toUpperCase())}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-surface-border-strong)', textTransform: 'uppercase' }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Payment Method Selection */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-surface-border)',
                  padding: '24px',
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-primary-900)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--color-accent-blue)', color: '#fff', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
                  <span>Payment Method (India)</span>
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { id: 'UPI', label: 'Instant UPI (Google Pay, PhonePe, Paytm, BHIM)', desc: 'Zero transaction fee, instant verification' },
                    { id: 'Card', label: 'Credit / Debit Cards (Visa, Mastercard, RuPay)', desc: 'Secure 256-bit encrypted gateway' },
                    { id: 'NetBanking', label: 'NetBanking (SBI, HDFC, ICICI, PNB & All Major Banks)', desc: 'Direct corporate & retail banking transfer' },
                    { id: 'NEFT_RTGS', label: 'NEFT / RTGS (For Large B2B Wholesale Amounts)', desc: 'Proforma bank transfer for plant purchase orders' },
                    { id: 'COD', label: 'Cash on Delivery / Pay on Workshop Pickup', desc: 'Available for orders up to ₹25,000' }
                  ].map((method) => (
                    <label
                      key={method.id}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: paymentMethod === method.id ? '2px solid var(--color-accent-blue)' : '1px solid var(--color-surface-border)',
                        backgroundColor: paymentMethod === method.id ? '#f0f9ff' : '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id as any)}
                        style={{ accentColor: 'var(--color-accent-blue)' }}
                      />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary-900)' }}>
                          {method.label}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                          {method.desc}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: ORDER SUMMARY & FINAL CONFIRMATION */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-surface-border)',
                padding: '24px',
                boxShadow: 'var(--shadow-sm)',
                position: 'sticky',
                top: '120px'
              }}
            >
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-primary-900)', marginBottom: '16px' }}>
                Order Summary ({cart.reduce((s, i) => s + i.quantity, 0)} Items)
              </h2>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '240px', overflowY: 'auto', marginBottom: '16px' }}>
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3" style={{ fontSize: '12px', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      style={{ width: '40px', height: '40px', objectFit: 'contain', background: '#f8fafc', borderRadius: '4px' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, color: 'var(--color-primary-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.product.name}
                      </div>
                      <div style={{ color: 'var(--color-text-muted)' }}>
                        Qty: {item.quantity} {item.product.unit} • ₹{item.product.price.toLocaleString('en-IN')} ea.
                      </div>
                    </div>
                    <div style={{ fontWeight: 800, color: 'var(--color-primary-900)' }} className="tabular-nums">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', marginBottom: '20px' }}>
                <div className="flex justify-between" style={{ color: 'var(--color-text-muted)' }}>
                  <span>Items Subtotal</span>
                  <span className="tabular-nums font-semibold">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between" style={{ color: '#16a34a' }}>
                    <span>Coupon Discount {couponCode ? `(${couponCode})` : ''}</span>
                    <span className="tabular-nums font-semibold">-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between" style={{ color: 'var(--color-text-muted)' }}>
                  <span>Shipping & Handling</span>
                  <span className="tabular-nums font-semibold">
                    {shippingCharge === 0 ? <span style={{ color: '#10b981', fontWeight: 700 }}>FREE</span> : `₹${shippingCharge}`}
                  </span>
                </div>

                <div className="flex justify-between" style={{ color: 'var(--color-text-subtle)', fontSize: '11px' }}>
                  <span>Includes 18% GST (CGST 9% + SGST 9%)</span>
                  <span className="tabular-nums">₹{taxAmount.toLocaleString('en-IN')}</span>
                </div>

                <div
                  className="flex justify-between"
                  style={{
                    borderTop: '2px solid var(--color-surface-border)',
                    paddingTop: '10px',
                    fontSize: '18px',
                    fontWeight: 900,
                    color: 'var(--color-primary-900)'
                  }}
                >
                  <span>Total Payable</span>
                  <span className="tabular-nums">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={isProcessing}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', padding: '14px', fontSize: '16px', fontWeight: 800 }}
              >
                {isProcessing ? (
                  <span>Processing Secure Order...</span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Lock size={18} />
                    <span>Place Order & Generate Invoice</span>
                  </span>
                )}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '11px', color: 'var(--color-text-subtle)', marginTop: '12px' }}>
                <ShieldCheck size={14} color="#059669" />
                <span>SSL Encrypted • Dagdi Works Official Checkout</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
