'use client';

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { QuotationItem } from '../types';
import {
  FileText,
  Plus,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Building,
  Phone,
  Upload,
  ArrowRight
} from 'lucide-react';

export const QuotationBuilderPage: React.FC = () => {
  const { products, submitQuotation, navigateTo, storeConfig } = useStore();

  const [contactName, setContactName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [gstin, setGstin] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Beawar');
  const [state, setState] = useState('Rajasthan');
  const [pincode, setPincode] = useState('305901');
  const [projectNotes, setProjectNotes] = useState('');
  const [estimatedBudget, setEstimatedBudget] = useState('₹ 1,00,000 - ₹ 5,00,000');

  const [items, setItems] = useState<QuotationItem[]>([
    {
      productId: 'prod-apfc-150',
      productName: 'Automatic Power Factor Control (APFC) Panel - 150 kVAR',
      quantity: 1,
      unit: 'Pieces',
      targetSpecs: '415V 12-Step with detuned reactors'
    },
    {
      productId: 'prod-ador-e7018-315',
      productName: 'Ador Welding Electrode E7018 Super-6 (3.15mm)',
      quantity: 10,
      unit: 'Boxes (20kg)',
      targetSpecs: 'Fresh batch with test certificate'
    }
  ]);

  const [submittedRfq, setSubmittedRfq] = useState<string | null>(null);

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

  const handleProductSelect = (index: number, prodId: string) => {
    const selected = products.find((p) => p.id === prodId);
    if (selected) {
      const updated = [...items];
      updated[index] = {
        ...updated[index],
        productId: selected.id,
        productName: selected.name,
        unit: selected.unit,
        targetSpecs: selected.shortDesc
      };
      setItems(updated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !phone.trim() || items.length === 0) {
      alert('Please fill contact name, phone, and at least one item.');
      return;
    }

    const rfq = submitQuotation({
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

    setSubmittedRfq(rfq.rfqNumber);
  };

  return (
    <div className="container" style={{ paddingTop: '32px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <div style={{ marginBottom: '28px' }}>
          <span className="badge badge-amber" style={{ marginBottom: '8px' }}>
            B2B WHOLESALE & CORPORATE PROCUREMENT
          </span>
          <h1 style={{ fontSize: '32px', fontWeight: 900, color: 'var(--color-primary-900)', margin: '0 0 8px' }}>
            Commercial Quotation & Bill of Materials (BOM) Builder
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--color-text-muted)', margin: 0 }}>
            Generate formal price quotes for custom APFC panels, bulk welding electrode call-offs, or contractor copper wire packages.
          </p>
        </div>

        {submittedRfq ? (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              border: '2px solid #10b981',
              padding: '48px 24px',
              textAlign: 'center',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#ecfdf5',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}
            >
              <CheckCircle2 size={36} />
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: 900, color: 'var(--color-primary-900)', marginBottom: '8px' }}>
              Quotation Request Successfully Registered!
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
              Your official quotation reference ID is:
            </p>

            <div
              style={{
                display: 'inline-block',
                backgroundColor: '#f1f5f9',
                border: '2px dashed var(--color-accent-blue)',
                padding: '10px 28px',
                borderRadius: '8px',
                fontSize: '22px',
                fontWeight: 900,
                color: 'var(--color-primary-900)',
                fontFamily: 'var(--font-mono)',
                marginBottom: '24px'
              }}
            >
              {submittedRfq}
            </div>

            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', maxWidth: '560px', margin: '0 auto 28px', lineHeight: 1.6 }}>
              Our commercial engineering manager (Sandesh Dagdi Saini) has received your request. A formal PDF proforma with valid HSN codes, quantity discount slab, and delivery timeline will be transmitted via email & WhatsApp.
            </p>

            <div className="flex justify-center gap-3">
              <button onClick={() => navigateTo('order-tracking')} className="btn btn-outline">
                Track Quotation Status
              </button>
              <button onClick={() => navigateTo('home')} className="btn btn-primary">
                Return to Storefront
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Step 1: Items List */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-surface-border)',
                padding: '28px',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: '18px' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-primary-900)', margin: 0 }}>
                    1. Bill of Materials / Equipment List
                  </h2>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '2px 0 0' }}>
                    Select from catalogue or enter custom technical items and target specifications.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddItem}
                  className="btn btn-primary btn-sm flex items-center gap-1"
                >
                  <Plus size={16} />
                  <span>Add Line Item</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid var(--color-surface-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '16px',
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr auto',
                      gap: '12px',
                      alignItems: 'start'
                    }}
                  >
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-subtle)', display: 'block', marginBottom: '4px' }}>
                        Product / Custom Specification
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 150 kVAR APFC Panel / E7018 3.15mm / Milan Copper Wire"
                        value={item.productName}
                        onChange={(e) => handleItemChange(idx, 'productName', e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', marginBottom: '6px' }}
                      />
                      <input
                        type="text"
                        placeholder="Target specs (e.g. 12-step controller, Class H, 415V)"
                        value={item.targetSpecs || ''}
                        onChange={(e) => handleItemChange(idx, 'targetSpecs', e.target.value)}
                        style={{ width: '100%', padding: '6px 10px', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-subtle)', display: 'block', marginBottom: '4px' }}>
                        Quantity
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, 'quantity', parseInt(e.target.value) || 1)}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-subtle)', display: 'block', marginBottom: '4px' }}>
                        Unit
                      </label>
                      <select
                        value={item.unit}
                        onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                      >
                        <option value="Pieces">Pieces</option>
                        <option value="Boxes (20kg)">Boxes (20kg)</option>
                        <option value="Kg">Kg (Wire)</option>
                        <option value="Meters">Meters (Cable)</option>
                        <option value="Sets">Sets</option>
                      </select>
                    </div>

                    <div>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          style={{ color: '#ef4444', padding: '10px 4px', marginTop: '18px' }}
                          title="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Company & Delivery Info */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-surface-border)',
                padding: '28px',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-primary-900)', marginBottom: '16px' }}>
                2. Company Details & Delivery Location
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sunil Sharma / Er. Mahendra"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--color-surface-border-strong)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Company / Firm Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Shree Marwar Mining Pvt Ltd"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--color-surface-border-strong)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Company GSTIN (for 18% Tax Credit)
                  </label>
                  <input
                    type="text"
                    maxLength={15}
                    placeholder="08AAACM4912K1Z4"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--color-surface-border-strong)', textTransform: 'uppercase' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Phone / WhatsApp Number *
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

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="procurement@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--color-surface-border-strong)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Delivery Destination City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--color-surface-border-strong)' }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Project Timeline, Voltage Requirements & Special Instructions
                </label>
                <textarea
                  rows={3}
                  placeholder="Specify transformer capacity, incoming breaker ratings, delivery target date, or specific brand preferences..."
                  value={projectNotes}
                  onChange={(e) => setProjectNotes(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--color-surface-border-strong)', fontSize: '13px' }}
                />
              </div>
            </div>

            {/* Submission Row */}
            <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '16px' }}>
              <div className="flex items-center gap-2" style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                <ShieldCheck size={18} color="#059669" />
                <span>Fast response guarantee: Quotation delivered within 2 hours.</span>
              </div>

              <button
                type="submit"
                className="btn btn-amber btn-lg flex items-center gap-2"
                style={{ padding: '14px 32px', fontWeight: 800 }}
              >
                <FileText size={20} />
                <span>Submit RFQ & Get Factory Wholesale Price</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
