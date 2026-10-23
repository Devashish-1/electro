'use client';

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import {
  ChevronRight,
  ShieldCheck,
  Truck,
  FileText,
  Heart,
  Scale,
  ShoppingCart,
  Zap,
  CheckCircle2,
  Download,
  Share2,
  Star,
  MapPin,
  Clock,
  ArrowRight,
  HelpCircle
} from 'lucide-react';

export const ProductDetailPage: React.FC<{ initialProduct?: Product }> = ({ initialProduct }) => {
  const {
    pageParam,
    products,
    addToCart,
    toggleWishlist,
    isInWishlist,
    addToCompare,
    setRfqModalOpen,
    navigateTo,
    pincode,
    storeConfig
  } = useStore();

  const product: Product = React.useMemo(() => {
    if (initialProduct) return initialProduct;
    if (pageParam && (pageParam.id || pageParam.slug)) return pageParam;
    if (typeof window !== 'undefined') {
      const parts = window.location.pathname.split('/');
      const slugOrId = decodeURIComponent(parts[parts.length - 1] || '');
      if (slugOrId) {
        const found = products.find((p) => p.slug === slugOrId || p.id === slugOrId);
        if (found) return found;
      }
    }
    return products[0];
  }, [initialProduct, pageParam, products]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'applications' | 'warranty' | 'faq'>('overview');
  const [userPincode, setUserPincode] = useState(pincode);
  const [pincodeChecked, setPincodeChecked] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  const isWishlisted = isInWishlist(product.id);
  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  // Compatible & related products
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigateTo('checkout');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadDatasheet = () => {
    const content = `DAGDI ELECTRICALS & POWER CONTROLS
TECHNICAL DATASHEET - ${product.name.toUpperCase()}
SKU: ${product.sku} | HSN Code: ${product.hsnCode} | GST: ${product.gstRate}%
Manufacturer: ${product.brand}

SPECIFICATIONS:
${Object.entries(product.specs).map(([k, v]) => `${k}: ${v}`).join('\n')}

APPLICATIONS:
${product.applications.join(', ')}

MANUFACTURED & DISTRIBUTED BY:
Dagdi Electric Motor Rewinding Works
Near Tejaji Ka Than, Chhawani, Beawar, Rajasthan - 305901
GSTIN: ${storeConfig.gstin} | Phone: ${storeConfig.phone1}
`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${product.sku}-datasheet.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container" style={{ paddingTop: '20px', paddingBottom: '60px' }}>
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2" style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
        <button onClick={() => navigateTo('home')} style={{ color: 'var(--color-text-muted)' }}>
          Home
        </button>
        <ChevronRight size={14} />
        <button onClick={() => navigateTo('catalog', { category: product.category })} style={{ color: 'var(--color-text-muted)' }}>
          {product.category.replace('-', ' ').toUpperCase()}
        </button>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--color-primary-900)', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>
          {product.name}
        </span>
      </div>

      {/* Main Two-Column Sales Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
          gap: '40px',
          marginBottom: '48px'
        }}
      >
        {/* LEFT COLUMN: PRODUCT GALLERY */}
        <div>
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--color-surface-border)',
              padding: '24px',
              height: '420px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              boxShadow: 'var(--shadow-sm)',
              marginBottom: '16px'
            }}
          >
            {product.badge && (
              <span
                className="badge badge-navy"
                style={{ position: 'absolute', top: '16px', left: '16px', fontSize: '11px', padding: '4px 10px' }}
              >
                {product.badge}
              </span>
            )}

            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
            />
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '8px',
                    border: activeImageIndex === idx ? '2px solid var(--color-accent-blue)' : '1px solid var(--color-surface-border)',
                    padding: '6px',
                    background: '#ffffff',
                    boxShadow: 'var(--shadow-xs)'
                  }}
                >
                  <img src={img} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </button>
              ))}
            </div>
          )}

          {/* Trust Guarantees Box */}
          <div
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid var(--color-surface-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px 20px',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '14px',
              fontSize: '12px'
            }}
          >
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} color="#059669" />
              <span><strong>100% Genuine:</strong> Direct factory stockist</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText size={18} color="#0284c7" />
              <span><strong>GST Tax Invoice:</strong> HSN {product.hsnCode} (18% ITC)</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck size={18} color="#d97706" />
              <span><strong>Beawar Hub:</strong> Express Pan-India transit</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} color="#7c3aed" />
              <span><strong>Replacement:</strong> Verified transit insurance</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PRODUCT SUMMARY & PURCHASING */}
        <div>
          <div className="flex items-center justify-between" style={{ marginBottom: '8px' }}>
            <span className="badge badge-blue">{product.brand}</span>
            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="flex items-center gap-1"
                style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}
              >
                <Share2 size={14} />
                <span>{copiedLink ? 'Copied Link!' : 'Share'}</span>
              </button>
              <button
                onClick={() => addToCompare(product)}
                className="flex items-center gap-1"
                style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}
              >
                <Scale size={14} />
                <span>Compare</span>
              </button>
            </div>
          </div>

          <h1
            style={{
              fontSize: '26px',
              fontWeight: 800,
              color: 'var(--color-primary-900)',
              lineHeight: 1.3,
              marginBottom: '10px'
            }}
          >
            {product.name}
          </h1>

          <div className="flex items-center gap-4" style={{ marginBottom: '16px', fontSize: '13px' }}>
            <div className="flex items-center gap-1" style={{ color: '#d97706', fontWeight: 700 }}>
              <Star size={16} fill="#f59e0b" color="#f59e0b" />
              <span>{product.rating.toFixed(1)}</span>
              <span style={{ color: 'var(--color-text-subtle)', fontWeight: 400 }}>
                ({product.reviewCount} customer reviews)
              </span>
            </div>
            <span style={{ color: '#cbd5e1' }}>|</span>
            <span style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
              SKU: {product.sku}
            </span>
            <span style={{ color: '#cbd5e1' }}>|</span>
            <span style={{ color: '#059669', fontWeight: 600 }} className="flex items-center gap-1">
              <CheckCircle2 size={14} /> In Stock ({product.stockCount} {product.unit}s)
            </span>
          </div>

          {/* Pricing Card */}
          <div
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid var(--color-surface-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              marginBottom: '20px'
            }}
          >
            <div className="flex items-baseline gap-3">
              <span style={{ fontSize: '32px', fontWeight: 900, color: 'var(--color-primary-900)' }} className="tabular-nums">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.mrp > product.price && (
                <span style={{ fontSize: '18px', color: 'var(--color-text-subtle)', textDecoration: 'line-through' }} className="tabular-nums">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="badge badge-green" style={{ fontSize: '12px', padding: '4px 8px' }}>
                  Save {discountPercent}%
                </span>
              )}
              <span style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginLeft: 'auto' }}>
                Per {product.unit}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-subtle)', marginTop: '4px' }}>
              Price includes 18% GST (CGST ₹{Math.round(product.price * 0.09).toLocaleString('en-IN')} + SGST ₹{Math.round(product.price * 0.09).toLocaleString('en-IN')})
            </div>

            {/* Tier Wholesale Pricing Table */}
            {product.tierPricing && product.tierPricing.length > 0 && (
              <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary-900)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Bulk Contractor & Wholesale Tiers
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${product.tierPricing.length}, 1fr)`, gap: '8px' }}>
                  {product.tierPricing.map((tier, idx) => (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        padding: '8px',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        {tier.minQty}+ {product.unit}s
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-accent-blue)' }} className="tabular-nums">
                        ₹{tier.pricePerUnit.toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
            {product.shortDesc}
          </p>

          {/* Pincode Delivery Check */}
          <div style={{ marginBottom: '24px', padding: '14px 16px', background: '#ffffff', border: '1px solid var(--color-surface-border)', borderRadius: 'var(--radius-md)' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '8px' }}>
              <span className="flex items-center gap-1" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary-900)' }}>
                <MapPin size={16} color="var(--color-accent-blue)" /> Delivery Availability
              </span>
              <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>
                ✓ Central Godown Beawar: Dispatches in 24 Hrs
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                maxLength={6}
                value={userPincode}
                onChange={(e) => setUserPincode(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit Pincode"
                style={{ width: '180px', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 600 }}
              />
              <button
                type="button"
                onClick={() => setPincodeChecked(true)}
                className="btn btn-outline btn-sm"
              >
                Verify
              </button>
            </div>
          </div>

          {/* Quantity & CTA Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="flex items-center gap-4">
              <span style={{ fontSize: '13px', fontWeight: 700 }}>Quantity:</span>
              <div className="flex items-center" style={{ border: '1px solid var(--color-surface-border-strong)', borderRadius: '6px' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ padding: '8px 12px', fontSize: '16px' }}
                >
                  -
                </button>
                <span style={{ padding: '0 12px', fontSize: '14px', fontWeight: 700 }} className="tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ padding: '8px 12px', fontSize: '16px' }}
                >
                  +
                </button>
              </div>

              <button
                onClick={() => toggleWishlist(product.id)}
                className="btn btn-outline"
                style={{ padding: '10px 14px', marginLeft: 'auto' }}
                title="Wishlist"
              >
                <Heart size={18} fill={isWishlisted ? '#ef4444' : 'none'} color={isWishlisted ? '#ef4444' : 'currentColor'} />
                <span>{isWishlisted ? 'Saved' : 'Wishlist'}</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                onClick={handleAddToCart}
                className="btn btn-primary btn-lg flex items-center justify-center gap-2"
                style={{ width: '100%' }}
              >
                <ShoppingCart size={18} />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="btn btn-navy btn-lg flex items-center justify-center gap-2"
                style={{ width: '100%' }}
              >
                <Zap size={18} />
                <span>Buy Now</span>
              </button>
            </div>

            <button
              onClick={() => setRfqModalOpen(true)}
              className="btn btn-amber flex items-center justify-center gap-2"
              style={{ width: '100%', padding: '12px', fontWeight: 700 }}
            >
              <FileText size={18} />
              <span>Request Custom Panel or Bulk Quantity Quotation</span>
            </button>
          </div>

          {/* Download Datasheet Button */}
          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <button
              onClick={handleDownloadDatasheet}
              className="flex items-center gap-2"
              style={{ fontSize: '13px', color: 'var(--color-accent-blue)', fontWeight: 700 }}
            >
              <Download size={15} />
              <span>Download Technical Datasheet & Test Parameters (TXT/PDF)</span>
            </button>
          </div>
        </div>
      </div>

      {/* TABS: OVERVIEW / SPECS / APPLICATIONS / WARRANTY / FAQ */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-surface-border)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '48px'
        }}
      >
        <div style={{ display: 'flex', borderBottom: '1px solid var(--color-surface-border)', backgroundColor: '#f8fafc', overflowX: 'auto' }}>
          {[
            { id: 'overview', label: 'Product Overview' },
            { id: 'specs', label: 'Technical Specifications' },
            { id: 'applications', label: 'Applications & Use Cases' },
            { id: 'warranty', label: 'Warranty & GST Tax Credit' },
            { id: 'faq', label: 'Technical FAQs' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '14px 20px',
                fontSize: '14px',
                fontWeight: 700,
                color: activeTab === tab.id ? 'var(--color-accent-blue)' : 'var(--color-text-muted)',
                borderBottom: activeTab === tab.id ? '3px solid var(--color-accent-blue)' : '3px solid transparent',
                backgroundColor: activeTab === tab.id ? '#ffffff' : 'transparent',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ padding: '28px' }}>
          {activeTab === 'overview' && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-primary-900)', marginBottom: '12px' }}>
                Engineering Description
              </h3>
              <p style={{ fontSize: '15px', color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '20px' }}>
                {product.fullDesc}
              </p>

              <div style={{ backgroundColor: '#f0f9ff', padding: '16px', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0369a1', marginBottom: '6px' }}>
                  Verified Quality Assurance from Dagdi Works
                </h4>
                <p style={{ fontSize: '13px', color: '#075985', lineHeight: 1.5 }}>
                  Every panel, motor, and wire coil is thoroughly inspected at our Beawar workshop before packaging. Our products comply with relevant Indian Standards (IS/IEC) and include full batch traceability.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-primary-900)', marginBottom: '16px' }}>
                Detailed Technical Parameters
              </h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 700, width: '30%', backgroundColor: '#f8fafc' }}>Manufacturer</td>
                    <td style={{ padding: '10px 14px' }}>{product.brand}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 700, backgroundColor: '#f8fafc' }}>Model / SKU</td>
                    <td style={{ padding: '10px 14px' }}>{product.sku}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 700, backgroundColor: '#f8fafc' }}>HSN Code</td>
                    <td style={{ padding: '10px 14px' }}>{product.hsnCode}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 700, backgroundColor: '#f8fafc' }}>GST Tax Rate</td>
                    <td style={{ padding: '10px 14px' }}>{product.gstRate}% (Included in price)</td>
                  </tr>
                  {Object.entries(product.specs).map(([key, value]) => (
                    <tr key={key} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px 14px', fontWeight: 700, backgroundColor: '#f8fafc' }}>{key}</td>
                      <td style={{ padding: '10px 14px' }}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'applications' && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-primary-900)', marginBottom: '14px' }}>
                Recommended Field Applications
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                {product.applications.map((app, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '16px',
                      borderRadius: '8px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    <CheckCircle2 size={18} color="#059669" />
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>{app}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'warranty' && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-primary-900)', marginBottom: '12px' }}>
                Warranty, Dispatch & B2B Tax Policies
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                <div>
                  <strong style={{ color: 'var(--color-text-main)' }}>Warranty Coverage:</strong> Products carry official manufacturer warranties (e.g. 18 Months on APFC controllers, standard shelf life test certificates on welding electrodes and copper winding wires).
                </div>
                <div>
                  <strong style={{ color: 'var(--color-text-main)' }}>B2B Invoicing & GST Credit:</strong> Enter your 15-digit GSTIN at checkout or in the RFQ form. We generate a full GST invoice under GSTIN <strong>{storeConfig.gstin}</strong> so you can claim 100% Input Tax Credit.
                </div>
                <div>
                  <strong style={{ color: 'var(--color-text-main)' }}>Transit Insurance:</strong> All high-value shipments (Panels, heavy motor units, master cable drums) are insured against in-transit loss or damage.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-primary-900)', marginBottom: '16px' }}>
                Frequently Asked Technical Questions
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ background: '#f8fafc', padding: '14px 18px', borderRadius: '8px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--color-primary-900)', marginBottom: '4px' }}>
                    Q: Can I order sample quantities before issuing a full plant purchase order?
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                    Yes, you can order single boxes of electrodes or single coils of wire online directly, or contact our sales desk for bulk trial shipments.
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '14px 18px', borderRadius: '8px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--color-primary-900)', marginBottom: '4px' }}>
                    Q: How is the delivery handled for heavy APFC panels?
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                    Panel boards are crated in heavy wooden packaging and dispatched via dedicated transport lines (e.g. V-Trans, TCI Freight, or direct vehicle within Rajasthan).
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* COMPATIBLE & RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section>
          <div className="flex items-center justify-between" style={{ marginBottom: '20px' }}>
            <div>
              <div className="section-tag">
                <Zap size={14} /> Matching Equipment
              </div>
              <h2 className="section-heading" style={{ fontSize: '24px' }}>
                Frequently Purchased Together
              </h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
