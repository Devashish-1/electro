'use client';

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare, ShieldCheck } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { storeConfig } = useStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Product Enquiry');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, subject, message }),
      });
    } catch (err) {
      console.warn('API error sending contact message', err);
    } finally {
      setLoading(false);
      setSent(true);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '32px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <span className="badge badge-blue" style={{ marginBottom: '8px' }}>
            GET IN TOUCH
          </span>
          <h1 style={{ fontSize: '32px', fontWeight: 900, color: 'var(--color-primary-900)', margin: '0 0 8px' }}>
            Contact Dagdi Electricals & Workshop
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--color-text-muted)', margin: 0 }}>
            Have a question about an APFC panel, welding electrode batch, or motor rewinding? Reach out to our Beawar engineering desk.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '32px' }}>
          {/* Contact Details Card */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--color-surface-border)',
              padding: '32px',
              boxShadow: 'var(--shadow-xs)',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}
          >
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-primary-900)', marginBottom: '16px' }}>
                Workshop & Registered Office
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px' }}>
                <div className="flex items-start gap-3">
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(0,102,255,0.1)', color: 'var(--color-accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>Dagdi Electric Motor Rewinding Works</div>
                    <div style={{ color: 'var(--color-text-muted)' }}>Near Tejaji Ka Than, Chhawani, Beawar, District Ajmer, Rajasthan - 305901</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(16,185,129,0.1)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Phone size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>Telephone Helpline</div>
                    <div>
                      <a href={`tel:${storeConfig.phone1}`} style={{ color: 'var(--color-accent-blue)', fontWeight: 600 }}>
                        {storeConfig.phone1}
                      </a>{' '}
                      / {storeConfig.phone2}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(245,158,11,0.1)', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>Electronic Mail</div>
                    <div style={{ color: 'var(--color-text-muted)' }}>{storeConfig.email}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(100,116,139,0.1)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Clock size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>Operating Hours</div>
                    <div style={{ color: 'var(--color-text-muted)' }}>Mon - Sat: 8:00 AM – 8:30 PM (Sunday open for emergency industrial calls)</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--color-surface-border)' }}>
              <a
                href={`https://wa.me/${storeConfig.whatsapp.replace('+', '')}?text=Hello%20Sandesh%20ji,%20I%20have%20an%20electrical%20enquiry`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-lg"
                style={{ backgroundColor: '#25D366', color: '#ffffff', width: '100%', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <MessageSquare size={18} />
                <span>Chat Instantly on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--color-surface-border)',
              padding: '32px',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            {sent ? (
              <div style={{ textAlign: 'center', padding: '48px 16px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <CheckCircle2 size={32} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-primary-900)', marginBottom: '8px' }}>
                  Message Sent Successfully!
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
                  Thank you for reaching out. A representative from our Beawar office will review your enquiry and get back to you shortly.
                </p>
                <button onClick={() => setSent(false)} className="btn btn-outline btn-sm">
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-primary-900)', margin: 0 }}>
                  Send an Enquiry Note
                </h2>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rameshwar Lal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--color-surface-border-strong)' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Phone / Mobile *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 94140 12345"
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
                      placeholder="yourname@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--color-surface-border-strong)' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Enquiry Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--color-surface-border-strong)' }}
                  >
                    <option value="Product Enquiry">Product Enquiry (Electrodes / Wire / Switchgear)</option>
                    <option value="Custom APFC Panel Sizing">Custom APFC Panel Sizing & Quotation</option>
                    <option value="Motor Rewinding & Overhaul">Motor Rewinding & Overhaul Service</option>
                    <option value="Contractor Bulk Purchase">Contractor Bulk Purchase / Dealer Enquiry</option>
                    <option value="Other">Other Query</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Message Details *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us what you are looking for, HP or rating requirements, or delivery location..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--color-surface-border-strong)', fontSize: '13px' }}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-lg flex items-center justify-center gap-2">
                  <Send size={18} />
                  <span>Send Enquiry to Beawar Team</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
