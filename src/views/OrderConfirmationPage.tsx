'use client';

import React from 'react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';
import {
  CheckCircle2,
  FileText,
  Truck,
  Printer,
  ArrowRight,
  Phone,
  ShieldCheck,
  PackageCheck
} from 'lucide-react';

export const OrderConfirmationPage: React.FC<{ initialOrder?: Order }> = ({ initialOrder }) => {
  const { pageParam, navigateTo, storeConfig } = useStore();

  const order: Order = initialOrder || pageParam;

  if (!order) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Order Not Found</h2>
        <button onClick={() => navigateTo('home')} className="btn btn-primary" style={{ marginTop: '16px' }}>
          Return Home
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container" style={{ paddingTop: '32px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '840px', margin: '0 auto' }}>
        {/* Success Header Banner */}
        <div
          style={{
            backgroundColor: '#ecfdf5',
            border: '2px solid #a7f3d0',
            borderRadius: 'var(--radius-xl)',
            padding: '32px 24px',
            textAlign: 'center',
            marginBottom: '32px'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
            }}
          >
            <CheckCircle2 size={36} />
          </div>

          <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#065f46', marginBottom: '8px' }}>
            Thank You! Your Order has been Placed
          </h1>
          <p style={{ fontSize: '15px', color: '#047857', marginBottom: '16px' }}>
            Your order reference number is:
          </p>

          <div
            style={{
              display: 'inline-block',
              backgroundColor: '#ffffff',
              border: '2px dashed #059669',
              padding: '8px 24px',
              borderRadius: '8px',
              fontSize: '22px',
              fontWeight: 900,
              color: '#065f46',
              fontFamily: 'var(--font-mono)',
              marginBottom: '16px'
            }}
          >
            {order.orderNumber}
          </div>

          <p style={{ fontSize: '13px', color: '#065f46', maxWidth: '520px', margin: '0 auto' }}>
            Confirmation SMS and WhatsApp notification sent to <strong>{order.phone}</strong>. Our Beawar logistics dispatch team is preparing your package.
          </p>
        </div>

        {/* GST Tax Invoice Document Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-surface-border)',
            padding: '32px',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '28px'
          }}
          id="printable-tax-invoice"
        >
          {/* Invoice Header */}
          <div className="flex justify-between items-start" style={{ paddingBottom: '20px', borderBottom: '2px solid var(--color-primary-900)', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--color-primary-900)' }}>
                {storeConfig.businessName}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                {storeConfig.tradeName}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                {storeConfig.address}, {storeConfig.city}, {storeConfig.state} - {storeConfig.pincode}
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary-900)', marginTop: '2px' }}>
                GSTIN: {storeConfig.gstin}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className="badge badge-navy" style={{ fontSize: '12px', padding: '4px 10px', marginBottom: '6px' }}>
                TAX INVOICE / PROFORMA
              </span>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary-900)' }}>
                Invoice No: {order.orderNumber}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                Date: {order.date}
              </div>
              <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>
                Status: {order.paymentStatus} ({order.paymentMethod})
              </div>
            </div>
          </div>

          {/* Bill To & Ship To */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '24px', fontSize: '13px' }}>
            <div>
              <div style={{ fontWeight: 800, color: 'var(--color-primary-900)', textTransform: 'uppercase', fontSize: '11px', marginBottom: '4px' }}>
                Billed / Shipped To:
              </div>
              <div style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>{order.customerName}</div>
              {order.companyName && <div style={{ fontWeight: 600 }}>{order.companyName}</div>}
              {order.gstin && (
                <div style={{ color: 'var(--color-accent-blue)', fontWeight: 700 }}>
                  GSTIN: {order.gstin} (B2B Recipient)
                </div>
              )}
              <div style={{ color: 'var(--color-text-muted)' }}>{order.address}</div>
              <div style={{ color: 'var(--color-text-muted)' }}>{order.city}, {order.state} - {order.pincode}</div>
              <div style={{ color: 'var(--color-text-muted)' }}>Phone: {order.phone}</div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 800, color: 'var(--color-primary-900)', textTransform: 'uppercase', fontSize: '11px', marginBottom: '4px' }}>
                Dispatched By:
              </div>
              <div style={{ fontWeight: 700 }}>Dagdi Beawar Central Godown</div>
              <div style={{ color: 'var(--color-text-muted)' }}>Near Tejaji Ka Than, Chhawani, Beawar</div>
              <div style={{ color: 'var(--color-text-muted)' }}>Support: {storeConfig.phone1}</div>
              <div style={{ color: '#059669', fontWeight: 600, marginTop: '4px' }}>
                Transit Insurance Covered
              </div>
            </div>
          </div>

          {/* Items Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px', marginBottom: '20px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '10px 12px' }}>#</th>
                <th style={{ padding: '10px 12px' }}>Product Description</th>
                <th style={{ padding: '10px 12px' }}>SKU</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Qty</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Unit Price</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 12px', color: 'var(--color-text-subtle)' }}>{idx + 1}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 600 }}>{item.productName}</td>
                  <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-muted)' }}>{item.sku}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }} className="tabular-nums">{item.quantity}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }} className="tabular-nums">₹{item.price.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700 }} className="tabular-nums">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Financial Breakdown */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
            <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="tabular-nums font-semibold">₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between" style={{ color: '#16a34a' }}>
                  <span>Discount</span>
                  <span className="tabular-nums font-semibold">-₹{order.discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="tabular-nums font-semibold">
                  {order.shippingCost === 0 ? 'FREE' : `₹${order.shippingCost}`}
                </span>
              </div>
              <div className="flex justify-between" style={{ color: 'var(--color-text-subtle)', fontSize: '11px' }}>
                <span>CGST (9%)</span>
                <span className="tabular-nums">₹{Math.round(order.taxAmount / 2).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between" style={{ color: 'var(--color-text-subtle)', fontSize: '11px' }}>
                <span>SGST (9%)</span>
                <span className="tabular-nums">₹{Math.round(order.taxAmount / 2).toLocaleString('en-IN')}</span>
              </div>
              <div
                className="flex justify-between"
                style={{
                  borderTop: '2px solid var(--color-primary-900)',
                  paddingTop: '8px',
                  fontSize: '16px',
                  fontWeight: 900,
                  color: 'var(--color-primary-900)'
                }}
              >
                <span>Grand Total</span>
                <span className="tabular-nums">₹{order.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', fontSize: '11px', color: 'var(--color-text-subtle)', textAlign: 'center' }}>
            This is a computer generated commercial tax invoice issued by Dagdi Electric Motor Rewinding Works under Section 31 of CGST Act.
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '14px' }}>
          <div className="flex gap-3">
            <button onClick={handlePrint} className="btn btn-outline flex items-center gap-2">
              <Printer size={16} />
              <span>Print Tax Invoice</span>
            </button>
            <a
              href={`https://wa.me/${storeConfig.whatsapp.replace('+', '')}?text=Hello%20Dagdi%20team,%20inquiring%20about%20my%20Order%20${order.orderNumber}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline flex items-center gap-2"
              style={{ color: '#16a34a', borderColor: '#86efac' }}
            >
              <Phone size={16} />
              <span>WhatsApp Support</span>
            </a>
          </div>

          <button onClick={() => navigateTo('home')} className="btn btn-primary flex items-center gap-2">
            <span>Continue Shopping</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
