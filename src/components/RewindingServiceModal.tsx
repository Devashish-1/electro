'use client';

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Wrench, CheckCircle2, ShieldCheck, MapPin, Phone, Calculator } from 'lucide-react';

export const RewindingServiceModal: React.FC = () => {
  const {
    rewindingModalOpen,
    setRewindingModalOpen,
    submitRewinding,
    navigateTo,
    storeConfig
  } = useStore();

  const [motorType, setMotorType] = useState<'3-Phase AC Induction' | 'Submersible Borewell Pump' | 'DC Industrial Motor' | 'Transformer / Armature'>('3-Phase AC Induction');
  const [hpRating, setHpRating] = useState('15 HP');
  const [rpm, setRpm] = useState('1440 RPM');
  const [voltage, setVoltage] = useState('415V');
  const [issueDescription, setIssueDescription] = useState('Burnt coil / Overheated winding');
  const [pickupRequired, setPickupRequired] = useState(false);
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('Beawar, Rajasthan');

  const [bookingResult, setBookingResult] = useState<string | null>(null);

  if (!rewindingModalOpen) return null;

  // Compute ballpark estimate based on HP and motor type
  const calculateEstimate = () => {
    const hpNum = parseInt(hpRating) || 10;
    let base = hpNum * 480;
    if (motorType === 'Submersible Borewell Pump') base *= 1.15;
    if (motorType === 'DC Industrial Motor') base *= 1.35;
    const low = Math.round(base * 0.9);
    const high = Math.round(base * 1.15);
    return `₹ ${low.toLocaleString('en-IN')} - ₹ ${high.toLocaleString('en-IN')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !phone.trim()) {
      alert('Please fill your contact name and phone number.');
      return;
    }

    const booking = submitRewinding({
      motorType,
      hpRating,
      rpm,
      voltage,
      issueDescription,
      pickupRequired,
      contactName,
      phone,
      address,
      estimatedCostRange: calculateEstimate()
    });

    setBookingResult(booking.bookingNumber);
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
      onClick={() => setRewindingModalOpen(false)}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          maxWidth: '720px',
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
          <div className="flex items-center gap-3">
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--color-accent-blue)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wrench size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>
                Motor Rewinding & Overhaul Booking
              </h2>
              <p style={{ fontSize: '12px', color: '#93c5fd', margin: 0 }}>
                Certified workshop in Beawar: Class H insulation, 100% pure electrolytic copper & vacuum varnish baking.
              </p>
            </div>
          </div>
          <button onClick={() => setRewindingModalOpen(false)} style={{ color: '#ffffff' }}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {bookingResult ? (
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
                Service Booking Confirmed!
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                Your service job ticket number is:
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
                  marginBottom: '16px'
                }}
              >
                {bookingResult}
              </div>
              <div style={{ backgroundColor: '#f0f9ff', padding: '14px', borderRadius: '8px', maxWidth: '480px', margin: '0 auto 20px', textAlign: 'left', fontSize: '13px' }}>
                <div><strong>Estimated Rewinding Cost:</strong> {calculateEstimate()}</div>
                <div><strong>Workshop Location:</strong> Near Tejaji Ka Than, Chhawani, Beawar</div>
                <div><strong>Helpline:</strong> {storeConfig.phone1}</div>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
                Our technician will contact you to coordinate drop-off inspection or transport pickup.
              </p>
              <button
                onClick={() => {
                  setBookingResult(null);
                  setRewindingModalOpen(false);
                }}
                className="btn btn-primary"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Workshop Trust Info */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', fontSize: '12px', textAlign: 'center' }}>
                <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontWeight: 800, color: 'var(--color-accent-blue)' }}>99.99% ETP Copper</div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>Milan dual-coat winding wire</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontWeight: 800, color: '#10b981' }}>Vacuum Varnish Baking</div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>Temperature controlled oven</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontWeight: 800, color: '#f59e0b' }}>Dynamic Balancing</div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>Zero vibration testing</div>
                </div>
              </div>

              {/* Motor Specifications */}
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-primary-900)', textTransform: 'uppercase', marginBottom: '10px' }}>
                  1. Motor Specifications
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Motor Type
                    </label>
                    <select
                      value={motorType}
                      onChange={(e) => setMotorType(e.target.value as any)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-surface-border-strong)' }}
                    >
                      <option value="3-Phase AC Induction">3-Phase AC Induction Motor</option>
                      <option value="Submersible Borewell Pump">Submersible Borewell Pump Motor</option>
                      <option value="DC Industrial Motor">DC Industrial Motor</option>
                      <option value="Transformer / Armature">Transformer / Armature / Generator</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Power Rating (HP / kW)
                    </label>
                    <select
                      value={hpRating}
                      onChange={(e) => setHpRating(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-surface-border-strong)' }}
                    >
                      <option value="3 HP">3 HP (2.2 kW)</option>
                      <option value="5 HP">5 HP (3.7 kW)</option>
                      <option value="7.5 HP">7.5 HP (5.5 kW)</option>
                      <option value="10 HP">10 HP (7.5 kW)</option>
                      <option value="15 HP">15 HP (11 kW)</option>
                      <option value="20 HP">20 HP (15 kW)</option>
                      <option value="25 HP">25 HP (18.5 kW)</option>
                      <option value="30 HP">30 HP (22 kW)</option>
                      <option value="50 HP">50 HP (37 kW)</option>
                      <option value="75 HP">75 HP (55 kW)</option>
                      <option value="100 HP+">100 HP+ Heavy Industrial</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Rated Speed (RPM)
                    </label>
                    <select
                      value={rpm}
                      onChange={(e) => setRpm(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-surface-border-strong)' }}
                    >
                      <option value="2880 RPM (2-Pole)">2880 RPM (2-Pole)</option>
                      <option value="1440 RPM (4-Pole)">1440 RPM (4-Pole)</option>
                      <option value="960 RPM (6-Pole)">960 RPM (6-Pole)</option>
                      <option value="720 RPM (8-Pole)">720 RPM (8-Pole)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Reported Issue
                    </label>
                    <select
                      value={issueDescription}
                      onChange={(e) => setIssueDescription(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-surface-border-strong)' }}
                    >
                      <option value="Burnt coil / Overheated winding">Burnt coil / Overheated winding</option>
                      <option value="Low insulation resistance (Megger fail)">Low insulation resistance (Megger fail)</option>
                      <option value="Heavy bearing sound / rotor rubbing">Heavy bearing sound / rotor rubbing</option>
                      <option value="Submersible water ingress & short circuit">Submersible water ingress & short circuit</option>
                      <option value="Routine preventative maintenance & varnishing">Routine preventative maintenance & varnishing</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Live Cost Estimator Card */}
              <div style={{ backgroundColor: '#fef3c7', border: '1px solid #fde68a', borderRadius: '8px', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="flex items-center gap-2">
                  <Calculator size={18} color="#d97706" />
                  <div>
                    <div style={{ fontSize: '12px', color: '#92400e', fontWeight: 700 }}>Estimated Overhaul Cost Range:</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#78350f' }} className="tabular-nums">
                      {calculateEstimate()}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '11px', color: '#92400e', maxWidth: '240px', textAlign: 'right' }}>
                  Includes 100% pure copper winding wire, F/H class Nomex slot insulation, and test run report.
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-primary-900)', textTransform: 'uppercase', marginBottom: '10px' }}>
                  2. Contact & Pickup Details
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Customer / Firm Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rameshwar Lal"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-surface-border-strong)' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Phone / Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 94140 12345"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-surface-border-strong)' }}
                    />
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Location / Workshop Address
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Factory / Farm address in Beawar or nearby Rajasthan region"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-surface-border-strong)' }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '10px' }}>
                  <label className="flex items-center gap-2" style={{ fontSize: '13px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={pickupRequired}
                      onChange={(e) => setPickupRequired(e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: 'var(--color-accent-blue)' }}
                    />
                    <span>Request Doorstep Vehicle Transport Pickup (Applicable within 60 km radius of Beawar)</span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '12px', borderTop: '1px solid var(--color-surface-border)' }}>
                <button
                  type="button"
                  onClick={() => setRewindingModalOpen(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex items-center gap-2"
                  style={{ padding: '12px 24px', fontWeight: 700 }}
                >
                  <Wrench size={18} />
                  <span>Book Rewinding Overhaul</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
