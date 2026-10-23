'use client';

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Search,
  PackageCheck,
  Truck,
  CheckCircle2,
  Clock,
  FileText,
  Wrench,
  AlertCircle,
  Phone
} from 'lucide-react';

export const OrderTrackingPage: React.FC = () => {
  const { orders, quotations, rewindings, storeConfig, navigateTo } = useStore();

  const [searchId, setSearchId] = useState('');
  const [searched, setSearched] = useState(false);

  const trimmed = searchId.trim().toUpperCase();

  // Find matching record across all 3 pipelines
  const matchedOrder = orders.find((o) => o.orderNumber.toUpperCase() === trimmed || o.id.toUpperCase() === trimmed);
  const matchedRfq = quotations.find((q) => q.rfqNumber.toUpperCase() === trimmed || q.id.toUpperCase() === trimmed);
  const matchedRewinding = rewindings.find((r) => r.bookingNumber.toUpperCase() === trimmed || r.id.toUpperCase() === trimmed);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  return (
    <div className="container" style={{ paddingTop: '32px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span className="badge badge-blue" style={{ marginBottom: '8px' }}>
            STATUS & DISPATCH TRACKER
          </span>
          <h1 style={{ fontSize: '32px', fontWeight: 900, color: 'var(--color-primary-900)', margin: '0 0 8px' }}>
            Track Order, RFQ Quotation or Service Ticket
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--color-text-muted)', margin: 0 }}>
            Enter your Order ID (DGD-2026-...), RFQ Reference (RFQ-2026-...), or Rewinding Ticket (MRW-...)
          </p>
        </div>

        {/* Search Bar */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-surface-border)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '32px'
          }}
        >
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="e.g. DGD-2026-1001 or RFQ-2026-801"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-surface-border-strong)',
                fontSize: '15px',
                fontWeight: 600,
                textTransform: 'uppercase'
              }}
              autoFocus
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '15px' }}>
              <Search size={18} />
              <span>Track Status</span>
            </button>
          </form>

          {/* Quick Demo Track Buttons */}
          <div style={{ marginTop: '14px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Quick Track Demo:</span>
            {orders.slice(0, 2).map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setSearchId(o.orderNumber);
                  setSearched(true);
                }}
                style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontWeight: 600 }}
              >
                {o.orderNumber}
              </button>
            ))}
            {quotations.slice(0, 1).map((q) => (
              <button
                key={q.id}
                type="button"
                onClick={() => {
                  setSearchId(q.rfqNumber);
                  setSearched(true);
                }}
                style={{ background: '#fef3c7', padding: '3px 8px', borderRadius: '4px', border: '1px solid #fde68a', fontWeight: 600, color: '#92400e' }}
              >
                {q.rfqNumber}
              </button>
            ))}
          </div>
        </div>

        {/* RESULTS SECTION */}
        {searched && (
          <div>
            {matchedOrder && (
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-surface-border)',
                  padding: '28px',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div className="flex justify-between items-start" style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                  <div>
                    <span className="badge badge-green" style={{ marginBottom: '6px' }}>
                      ONLINE ORDER
                    </span>
                    <h2 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--color-primary-900)', margin: 0 }}>
                      Order #{matchedOrder.orderNumber}
                    </h2>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                      Customer: {matchedOrder.customerName} • Placed on {matchedOrder.date}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--color-primary-900)' }} className="tabular-nums">
                      ₹{matchedOrder.totalAmount.toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 700 }}>
                      Payment: {matchedOrder.paymentStatus}
                    </div>
                  </div>
                </div>

                {/* Progress Bar Timeline */}
                <div style={{ margin: '28px 0', padding: '16px 20px', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', textAlign: 'center', position: 'relative' }}>
                    {[
                      { label: 'Confirmed', done: true },
                      { label: 'Packaging in Beawar', done: ['Processing', 'Dispatched', 'Delivered'].includes(matchedOrder.orderStatus) },
                      { label: 'Dispatched in Transit', done: ['Dispatched', 'Delivered'].includes(matchedOrder.orderStatus) },
                      { label: 'Delivered', done: matchedOrder.orderStatus === 'Delivered' }
                    ].map((step, idx) => (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: step.done ? '#10b981' : '#e2e8f0',
                            color: step.done ? '#ffffff' : '#94a3b8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '13px',
                            marginBottom: '6px'
                          }}
                        >
                          {step.done ? '✓' : idx + 1}
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: step.done ? 700 : 500, color: step.done ? 'var(--color-primary-900)' : 'var(--color-text-subtle)' }}>
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Items */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-primary-900)', marginBottom: '8px' }}>
                    Purchased Equipment ({matchedOrder.items.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {matchedOrder.items.map((i, idx) => (
                      <div key={idx} className="flex justify-between items-center" style={{ fontSize: '13px', padding: '8px 12px', background: '#f8fafc', borderRadius: '6px' }}>
                        <div>
                          <strong>{i.productName}</strong>
                          <span style={{ color: 'var(--color-text-muted)', marginLeft: '6px' }}>({i.quantity} {i.unit})</span>
                        </div>
                        <span style={{ fontWeight: 700 }}>₹{(i.price * i.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center" style={{ paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                    Delivery Destination: {matchedOrder.city}, {matchedOrder.state} - {matchedOrder.pincode}
                  </span>
                  <button
                    onClick={() => navigateTo('order-confirmation', matchedOrder)}
                    className="btn btn-outline btn-sm"
                  >
                    View Tax Invoice
                  </button>
                </div>
              </div>
            )}

            {matchedRfq && (
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-surface-border)',
                  padding: '28px',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div className="flex justify-between items-start" style={{ marginBottom: '16px' }}>
                  <div>
                    <span className="badge badge-amber" style={{ marginBottom: '6px' }}>
                      B2B QUOTATION REQUEST
                    </span>
                    <h2 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--color-primary-900)', margin: 0 }}>
                      RFQ #{matchedRfq.rfqNumber}
                    </h2>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                      {matchedRfq.contactName} {matchedRfq.companyName ? `(${matchedRfq.companyName})` : ''} • Date: {matchedRfq.date}
                    </div>
                  </div>
                  <div>
                    <span className="badge badge-navy" style={{ fontSize: '12px', padding: '4px 10px' }}>
                      Status: {matchedRfq.status}
                    </span>
                  </div>
                </div>

                <div style={{ backgroundColor: '#f0f9ff', padding: '16px', borderRadius: '8px', border: '1px solid #bae6fd', marginBottom: '20px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0369a1', marginBottom: '4px' }}>
                    Engineering Desk Review Notes:
                  </div>
                  <div style={{ fontSize: '13px', color: '#075985' }}>
                    {matchedRfq.adminNotes || 'Under technical evaluation by Sandesh Dagdi Saini. Test certificates and proforma invoice in preparation.'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-primary-900)', marginBottom: '8px' }}>
                    Requested Equipment:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {matchedRfq.requestedItems.map((item, idx) => (
                      <div key={idx} style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: '6px', fontSize: '13px' }}>
                        <div style={{ fontWeight: 700 }}>{item.productName} — {item.quantity} {item.unit}</div>
                        {item.targetSpecs && <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Specs: {item.targetSpecs}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!matchedOrder && !matchedRfq && !matchedRewinding && (
              <div style={{ textAlign: 'center', padding: '48px 20px', backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-surface-border)' }}>
                <AlertCircle size={40} color="#f59e0b" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-primary-900)', marginBottom: '8px' }}>
                  No Record Found for "{searchId}"
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                  Please verify your reference number or contact our Beawar desk with your mobile number.
                </p>
                <a
                  href={`tel:${storeConfig.phone1}`}
                  className="btn btn-primary btn-sm flex items-center justify-center gap-2"
                  style={{ display: 'inline-flex' }}
                >
                  <Phone size={14} />
                  <span>Call Support Desk: {storeConfig.phone1}</span>
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
