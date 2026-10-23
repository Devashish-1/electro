'use client';

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { QuotationItem } from '../types';
import { X, FileText, Plus, Trash2, CheckCircle2, ShieldCheck, ArrowRight, Building, Phone, Mail } from 'lucide-react';

export const RfqModal: React.FC = () => {
  const {
    rfqModalOpen,
    setRfqModalOpen,
    products,
    submitQuotation,
    navigateTo
  } = useStore();

  const [contactName, setContactName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [gstin, setGstin] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Beawar');
  const [state, setState] = useState('Rajasthan');
  const [pincode, setPincode] = useState('305901');
  const [projectNotes, setProjectNotes] = useState('');
  const [estimatedBudget, setEstimatedBudget] = useState('');

  // Selected items for quotation
  const [items, setItems] = useState<QuotationItem[]>([
    {
      productId: products[0]?.id,
      productName: products[0]?.name || 'Automatic Power Factor Control (APFC) Panel - 150 kVAR',
      quantity: 1,
      unit: 'Piece',
      targetSpecs: 'Standard 415V 12-Step panel with detuned reactors'
    }
  ]);

  const [submittedRfqNumber, setSubmittedRfqNumber] = useState<string | null>(null);

  if (!rfqModalOpen) return null;

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        productName: '',
        quantity: 1,
        unit: 'Pieces',
        targetSpecs: ''
      }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof QuotationItem, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !phone.trim() || items.length === 0) {
      alert('Please fill your contact name, phone number, and at least one item.');
      return;
    }

    const newRfq = submitQuotation({
      contactName,
      companyName,
      gstin,
      email,
      phone,
      city,
      state,
      pincode,
      requestedItems: items,
      projectNotes,
      estimatedBudget
    });

    setSubmittedRfqNumber(newRfq.rfqNumber);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1070,
        backgroundColor: 'rgba(7, 14, 32, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={() => setRfqModalOpen(false)}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          maxWidth: '780px',
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--color-surface-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#0b1b3d',
            color: '#ffffff'
          }}
        >
          <div className="flex items-center gap-2">
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--color-accent-amber)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
              <FileText size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>
                Request Formal B2B Quotation (RFQ)
              </h2>
              <p style={{ fontSize: '12px', color: '#93c5fd', margin: 0 }}>
                Commercial quotations for industrial panels, mining units, and contractor bulk orders.
              </p>
            </div>
          </div>
          <button onClick={() => setRfqModalOpen(false)} style={{ color: '#ffffff' }}>
            <X size={20} />
          </button>
        </div>

        {/* Form Body or Success State */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {submittedRfqNumber ? (
            <div style={{ textAlign: 'center', padding: '36px 16px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#ecfdf5',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}
              >
                <CheckCircle2 size={36} />
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-primary-900)', marginBottom: '8px' }}>
                Quotation Request Received!
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                Your enquiry reference number is:
              </p>
              <div
                style={{
                  display: 'inline-block',
                  backgroundColor: '#f1f5f9',
                  border: '2px dashed var(--color-accent-blue)',
                  padding: '8px 24px',
                  borderRadius: '8px',
                  fontSize: '20px',
                  fontWeight: 800,
                  color: 'var(--color-primary-900)',
                  fontFamily: 'var(--font-mono)',
                  marginBottom: '20px'
                }}
              >
                {submittedRfqNumber}
              </div>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', maxWidth: '520px', margin: '0 auto 24px', lineHeight: 1.5 }}>
                Our senior electrical engineer (Sandesh Dagdi Saini / Engineering Desk) will review your required specs and transmit an official GST proforma quotation via WhatsApp and email within 2 business hours.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    setRfqModalOpen(false);
                    navigateTo('order-tracking');
                  }}
                  className="btn btn-outline"
                >
                  Track Quotation Status
                </button>
                <button
                  onClick={() => {
                    setSubmittedRfqNumber(null);
                    setRfqModalOpen(false);
                  }}
                  className="btn btn-primary"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Trust banner */}
              <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#0369a1' }}>
                <ShieldCheck size={20} color="#0284c7" />
                <span>
                  <strong>Official Dagdi B2B Portal:</strong> Receive factory-direct wholesale pricing, HSN-wise 18% GST credit invoices, and certified test reports.
                </span>
              </div>

              {/* Company & Contact Section */}
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-primary-900)', textTransform: 'uppercase', marginBottom: '10px' }}>
                  1. Company & Contact Information
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-main)', display: 'block', marginBottom: '4px' }}>
                      Contact Person Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sunil Sharma / Er. Mahendra"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-surface-border-strong)' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-main)', display: 'block', marginBottom: '4px' }}>
                      Company / Firm Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Shree Marwar Mining Pvt Ltd"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-surface-border-strong)' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-main)', display: 'block', marginBottom: '4px' }}>
                      Company GSTIN (for 18% Tax Credit)
                    </label>
                    <input
                      type="text"
                      maxLength={15}
                      placeholder="e.g. 08AAACM4912K1Z4"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value.toUpperCase())}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-surface-border-strong)', textTransform: 'uppercase' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-main)', display: 'block', marginBottom: '4px' }}>
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98290 12345"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-surface-border-strong)' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-main)', display: 'block', marginBottom: '4px' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="procurement@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-surface-border-strong)' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-main)', display: 'block', marginBottom: '4px' }}>
                      Delivery Location / City
                    </label>
                    <input
                      type="text"
                      placeholder="Beawar / Kishangarh / Jaipur"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-surface-border-strong)' }}
                    />
                  </div>
                </div>
              </div>

              {/* Items / Bill of Materials Section */}
              <div>
                <div className="flex items-center justify-between" style={{ marginBottom: '10px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-primary-900)', textTransform: 'uppercase' }}>
                    2. Required Equipment & Quantities
                  </div>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="btn btn-outline btn-sm flex items-center gap-1"
                    style={{ fontSize: '12px' }}
                  >
                    <Plus size={14} />
                    <span>Add Another Item</span>
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-surface-border)',
                        backgroundColor: '#f8fafc',
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr 1fr auto',
                        gap: '8px',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <input
                          type="text"
                          required
                          placeholder="Item name / specification (e.g. 150 kVAR APFC Panel)"
                          value={item.productName}
                          onChange={(e) => handleItemChange(idx, 'productName', e.target.value)}
                          style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                        />
                      </div>

                      <div>
                        <input
                          type="number"
                          min="1"
                          required
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', parseInt(e.target.value) || 1)}
                          style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                        />
                      </div>

                      <div>
                        <select
                          value={item.unit}
                          onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                          style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                        >
                          <option value="Pieces">Pieces</option>
                          <option value="Boxes (20kg)">Boxes (20kg)</option>
                          <option value="Kg">Kg</option>
                          <option value="Meters">Meters</option>
                          <option value="Sets">Sets</option>
                        </select>
                      </div>

                      <div>
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            style={{ color: '#ef4444', padding: '6px' }}
                            title="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Project Notes & Additional Requirements */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-main)', display: 'block', marginBottom: '4px' }}>
                  Project Details, Desired Timeline & Technical Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Specify motor connected load, harmonic filter requirements, desired delivery date, or special switchgear specifications..."
                  value={projectNotes}
                  onChange={(e) => setProjectNotes(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--color-surface-border-strong)', fontSize: '13px' }}
                />
              </div>

              {/* Submit CTA */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '12px', borderTop: '1px solid var(--color-surface-border)' }}>
                <button
                  type="button"
                  onClick={() => setRfqModalOpen(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-amber flex items-center gap-2"
                  style={{ padding: '12px 24px', fontWeight: 700 }}
                >
                  <FileText size={18} />
                  <span>Submit RFQ & Get Best Price</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
