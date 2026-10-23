'use client';

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, Order, QuotationRequest, StoreConfig } from '../types';
import {
  BarChart3,
  Package,
  ShoppingCart,
  FileText,
  Settings,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Search,
  Filter
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const {
    products,
    orders,
    quotations,
    storeConfig,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    updateQuotationStatus,
    updateStoreConfig,
    navigateTo
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'quotations' | 'config'>('overview');

  // Search & Edit state for products
  const [productSearch, setProductSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  // New product form state
  const [newProdName, setNewProdName] = useState('');
  const [newProdSku, setNewProdSku] = useState('');
  const [newProdPrice, setNewProdPrice] = useState(2500);
  const [newProdMrp, setNewProdMrp] = useState(2900);
  const [newProdCategory, setNewProdCategory] = useState('welding-solutions');
  const [newProdBrand, setNewProdBrand] = useState('Ador Welding Ltd');
  const [newProdStock, setNewProdStock] = useState(50);
  const [newProdUnit, setNewProdUnit] = useState('Box (20 Kg)');
  const [newProdHsn, setNewProdHsn] = useState('83111000');
  const [newProdDesc, setNewProdDesc] = useState('');

  // Store Config editing state
  const [configForm, setConfigForm] = useState<StoreConfig>(storeConfig);
  const [configSaved, setConfigSaved] = useState(false);

  // Filtered lists
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Real Stored Data Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' ? o.totalAmount : 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.orderStatus === 'Processing' || o.orderStatus === 'Confirmed').length;
  const pendingQuotationsCount = quotations.filter((q) => q.status === 'New' || q.status === 'Under Review').length;
  const lowStockCount = products.filter((p) => p.stockCount < 10).length;

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreConfig(configForm);
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 2500);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdSku.trim()) {
      alert('Please fill product name and SKU.');
      return;
    }

    const newP: Product = {
      id: `prod-${Date.now()}`,
      name: newProdName,
      sku: newProdSku,
      slug: newProdName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      brand: newProdBrand,
      category: newProdCategory,
      subcategory: 'General',
      price: Number(newProdPrice),
      mrp: Number(newProdMrp),
      unit: newProdUnit,
      inStock: newProdStock > 0,
      stockCount: Number(newProdStock),
      hsnCode: newProdHsn,
      gstRate: 18,
      rating: 5.0,
      reviewCount: 1,
      featured: false,
      images: ['/images/welding_electrodes.jpg'],
      shortDesc: newProdDesc || 'Genuine electrical supply from Dagdi Electric Works.',
      fullDesc: newProdDesc || 'Industrial quality item backed by warranty.',
      specs: {
        'Quality Standard': 'Industrial Grade Certified',
        'Warranty': 'Manufacturer Standard'
      },
      applications: ['Heavy Fabrication', 'Industrial Plants']
    };

    addProduct(newP);
    setIsCreatingProduct(false);
    // Reset
    setNewProdName('');
    setNewProdSku('');
  };

  return (
    <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', paddingBottom: '60px' }}>
      {/* Admin Top Header */}
      <div style={{ backgroundColor: '#070e20', color: '#ffffff', padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span style={{ fontSize: '22px' }}>⚡</span>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800 }}>DAGDI ELECTRICALS — ADMIN CONTROL CMS</div>
              <div style={{ fontSize: '11px', color: '#93c5fd' }}>
                Workshop Operations, Live Inventory & Quotation Pipeline
              </div>
            </div>
          </div>

          <button
            onClick={() => navigateTo('home')}
            className="btn btn-outline btn-sm"
            style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)' }}
          >
            ← View Live Customer Storefront
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--color-surface-border)', padding: '0 24px' }}>
        <div className="container flex items-center gap-2" style={{ overflowX: 'auto' }}>
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: BarChart3 },
            { id: 'products', label: `Products & Stock (${products.length})`, icon: Package },
            { id: 'orders', label: `Customer Orders (${orders.length})`, icon: ShoppingCart },
            { id: 'quotations', label: `B2B RFQs & Quotations (${quotations.length})`, icon: FileText },
            { id: 'config', label: 'Store Configuration', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className="flex items-center gap-2"
                style={{
                  padding: '14px 18px',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: activeTab === tab.id ? 'var(--color-accent-blue)' : 'var(--color-text-muted)',
                  borderBottom: activeTab === tab.id ? '3px solid var(--color-accent-blue)' : '3px solid transparent',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container" style={{ paddingTop: '24px' }}>
        {/* TAB 1: OVERVIEW METRICS */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* KPI Cards Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-surface-border)', boxShadow: 'var(--shadow-xs)' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-subtle)', textTransform: 'uppercase' }}>
                  Total Realized GMV
                </div>
                <div style={{ fontSize: '26px', fontWeight: 900, color: 'var(--color-primary-900)', margin: '6px 0' }} className="tabular-nums">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600 }}>
                  Calculated from verified orders
                </div>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-surface-border)', boxShadow: 'var(--shadow-xs)' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-subtle)', textTransform: 'uppercase' }}>
                  Orders In Pipeline
                </div>
                <div style={{ fontSize: '26px', fontWeight: 900, color: 'var(--color-accent-blue)', margin: '6px 0' }} className="tabular-nums">
                  {orders.length}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  {pendingOrdersCount} pending dispatch
                </div>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-surface-border)', boxShadow: 'var(--shadow-xs)' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-subtle)', textTransform: 'uppercase' }}>
                  Open B2B Quotations
                </div>
                <div style={{ fontSize: '26px', fontWeight: 900, color: '#f59e0b', margin: '6px 0' }} className="tabular-nums">
                  {quotations.length}
                </div>
                <div style={{ fontSize: '11px', color: '#b45309', fontWeight: 600 }}>
                  {pendingQuotationsCount} requiring review
                </div>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-surface-border)', boxShadow: 'var(--shadow-xs)' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-subtle)', textTransform: 'uppercase' }}>
                  Low Stock Warnings
                </div>
                <div style={{ fontSize: '26px', fontWeight: 900, color: lowStockCount > 0 ? '#ef4444' : '#10b981', margin: '6px 0' }} className="tabular-nums">
                  {lowStockCount} Items
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  Threshold &lt; 10 units in godown
                </div>
              </div>
            </div>

            {/* Recent Orders & Quotations Split */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
              {/* Recent Orders Card */}
              <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-surface-border)' }}>
                <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-primary-900)', margin: 0 }}>
                    Recent Customer Orders
                  </h3>
                  <button onClick={() => setActiveTab('orders')} style={{ fontSize: '12px', color: 'var(--color-accent-blue)', fontWeight: 700 }}>
                    View All →
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {orders.slice(0, 3).map((o) => (
                    <div key={o.id} style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '13px' }}>{o.orderNumber}</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{o.customerName}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, fontSize: '14px' }}>₹{o.totalAmount.toLocaleString('en-IN')}</div>
                        <span className="badge badge-blue" style={{ fontSize: '9px' }}>{o.orderStatus}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending RFQs Card */}
              <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-surface-border)' }}>
                <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-primary-900)', margin: 0 }}>
                    Pending B2B Quotations (RFQ)
                  </h3>
                  <button onClick={() => setActiveTab('quotations')} style={{ fontSize: '12px', color: 'var(--color-accent-blue)', fontWeight: 700 }}>
                    Manage Pipeline →
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {quotations.slice(0, 3).map((q) => (
                    <div key={q.id} style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '13px' }}>{q.rfqNumber}</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{q.contactName} ({q.city})</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span className="badge badge-amber" style={{ fontSize: '9px' }}>{q.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS & INVENTORY CMS */}
        {activeTab === 'products' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-surface-border)', padding: '24px' }}>
            <div className="flex justify-between items-center" style={{ marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-primary-900)', margin: 0 }}>
                  Catalogue & Inventory Management ({products.length} Products)
                </h2>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '2px 0 0' }}>
                  Manage stock levels, adjust prices, edit HSN codes, and define tier discounts.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsCreatingProduct(!isCreatingProduct)}
                  className="btn btn-primary btn-sm flex items-center gap-1"
                >
                  <Plus size={16} />
                  <span>Add New Product</span>
                </button>
              </div>
            </div>

            {/* Product Creation Modal/Accordion */}
            {isCreatingProduct && (
              <form
                onSubmit={handleCreateProduct}
                style={{
                  backgroundColor: '#f8fafc',
                  border: '2px solid var(--color-accent-blue)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  marginBottom: '24px'
                }}
              >
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-primary-900)', marginBottom: '14px' }}>
                  Add New Item to Dagdi Godown Inventory
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Product Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. D&H 7018 3.15mm Welding Electrode"
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>SKU Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="DAG-E7018-315"
                      value={newProdSku}
                      onChange={(e) => setNewProdSku(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Selling Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(Number(e.target.value))}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>MRP (₹)</label>
                    <input
                      type="number"
                      value={newProdMrp}
                      onChange={(e) => setNewProdMrp(Number(e.target.value))}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Stock Quantity</label>
                    <input
                      type="number"
                      value={newProdStock}
                      onChange={(e) => setNewProdStock(Number(e.target.value))}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>HSN Code</label>
                    <input
                      type="text"
                      value={newProdHsn}
                      onChange={(e) => setNewProdHsn(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setIsCreatingProduct(false)} className="btn btn-ghost btn-sm">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    Save to Database
                  </button>
                </div>
              </form>
            )}

            {/* Filter search */}
            <div style={{ marginBottom: '16px', maxWidth: '320px' }}>
              <input
                type="text"
                placeholder="Search products by name or SKU..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
              />
            </div>

            {/* Products Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '10px 12px' }}>Product</th>
                    <th style={{ padding: '10px 12px' }}>SKU</th>
                    <th style={{ padding: '10px 12px' }}>Brand</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Price (₹)</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center' }}>Stock</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px 12px' }}>
                        <div className="flex items-center gap-3">
                          <img src={p.images[0]} alt={p.name} style={{ width: '36px', height: '36px', objectFit: 'contain', background: '#f8fafc', borderRadius: '4px' }} />
                          <div style={{ fontWeight: 700, color: 'var(--color-primary-900)' }}>{p.name}</div>
                        </div>
                      </td>
                      <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{p.sku}</td>
                      <td style={{ padding: '10px 12px' }}>{p.brand}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800 }} className="tabular-nums">
                        ₹{p.price.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                        <input
                          type="number"
                          value={p.stockCount}
                          onChange={(e) => updateProduct({ ...p, stockCount: Number(e.target.value), inStock: Number(e.target.value) > 0 })}
                          style={{ width: '65px', padding: '4px', textAlign: 'center', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                        />
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          style={{ color: '#ef4444', padding: '4px' }}
                          title="Delete product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CUSTOMER ORDERS */}
        {activeTab === 'orders' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-surface-border)', padding: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-primary-900)', marginBottom: '16px' }}>
              Customer Order Management ({orders.length} Orders)
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {orders.map((o) => (
                <div
                  key={o.id}
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid var(--color-surface-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px'
                  }}
                >
                  <div className="flex justify-between items-start" style={{ marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: '15px', fontWeight: 900, color: 'var(--color-primary-900)' }}>
                          {o.orderNumber}
                        </span>
                        <span className="badge badge-navy" style={{ fontSize: '10px' }}>
                          {o.paymentMethod}
                        </span>
                        {o.isB2B && <span className="badge badge-amber" style={{ fontSize: '10px' }}>B2B GST: {o.gstin}</span>}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        Customer: <strong>{o.customerName}</strong> ({o.phone}) • {o.city}, {o.state}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '16px', fontWeight: 900, color: 'var(--color-primary-900)' }}>
                          ₹{o.totalAmount.toLocaleString('en-IN')}
                        </div>
                        <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600 }}>{o.paymentStatus}</div>
                      </div>

                      {/* Status Selector */}
                      <select
                        value={o.orderStatus}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value as any)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: '1px solid var(--color-accent-blue)',
                          fontSize: '12px',
                          fontWeight: 700,
                          backgroundColor: '#ffffff'
                        }}
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', borderTop: '1px solid #e2e8f0', paddingTop: '8px' }}>
                    Items: {o.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: B2B RFQ QUOTATIONS PIPELINE */}
        {activeTab === 'quotations' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-surface-border)', padding: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-primary-900)', marginBottom: '16px' }}>
              B2B Quotations Pipeline ({quotations.length} Requests)
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {quotations.map((q) => (
                <div
                  key={q.id}
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid var(--color-surface-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '20px'
                  }}
                >
                  <div className="flex justify-between items-start" style={{ marginBottom: '12px' }}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: '16px', fontWeight: 900, color: 'var(--color-primary-900)' }}>
                          {q.rfqNumber}
                        </span>
                        <span className="badge badge-amber">{q.status}</span>
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-main)', marginTop: '4px' }}>
                        {q.contactName} {q.companyName ? `— ${q.companyName}` : ''}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                        Phone: {q.phone} • Email: {q.email} • Location: {q.city}, {q.state}
                        {q.gstin && ` • GSTIN: ${q.gstin}`}
                      </div>
                    </div>

                    {/* Quotation Status Selector */}
                    <div className="flex items-center gap-2">
                      <label style={{ fontSize: '12px', fontWeight: 600 }}>Stage:</label>
                      <select
                        value={q.status}
                        onChange={(e) => updateQuotationStatus(q.id, e.target.value as any)}
                        style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', fontWeight: 700 }}
                      >
                        <option value="New">New</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Quotation Prepared">Quotation Prepared</option>
                        <option value="Sent">Sent to Client</option>
                        <option value="Won">Won (Order Confirmed)</option>
                        <option value="Lost">Lost</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '10px', fontSize: '12px' }}>
                    <strong>Requested Line Items:</strong>
                    <ul style={{ paddingLeft: '20px', marginTop: '4px' }}>
                      {q.requestedItems.map((item, idx) => (
                        <li key={idx}>
                          <strong>{item.productName}</strong> — Qty: {item.quantity} {item.unit}{' '}
                          {item.targetSpecs && <span style={{ color: 'var(--color-text-muted)' }}>({item.targetSpecs})</span>}
                        </li>
                      ))}
                    </ul>
                    {q.projectNotes && (
                      <div style={{ marginTop: '8px', color: 'var(--color-text-muted)' }}>
                        <strong>Client Project Note:</strong> {q.projectNotes}
                      </div>
                    )}
                  </div>

                  {/* Internal Admin Note */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add internal engineering follow-up note..."
                      defaultValue={q.adminNotes || ''}
                      onBlur={(e) => updateQuotationStatus(q.id, q.status, e.target.value)}
                      style={{ flex: 1, padding: '6px 10px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                    />
                    <span style={{ fontSize: '11px', color: 'var(--color-text-subtle)' }}>Auto-saves on blur</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: STORE CONFIGURATION CMS */}
        {activeTab === 'config' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-surface-border)', padding: '28px', maxWidth: '780px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-primary-900)', marginBottom: '16px' }}>
              Business Identity & Tax Settings
            </h2>

            {configSaved && (
              <div style={{ backgroundColor: '#ecfdf5', color: '#047857', padding: '10px 14px', borderRadius: '6px', marginBottom: '16px', fontWeight: 600, fontSize: '13px' }}>
                ✓ Store configuration successfully saved and updated across website!
              </div>
            )}

            <form onSubmit={handleSaveConfig} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Legal Business Name</label>
                  <input
                    type="text"
                    value={configForm.businessName}
                    onChange={(e) => setConfigForm({ ...configForm, businessName: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Trade Brand Name</label>
                  <input
                    type="text"
                    value={configForm.tradeName}
                    onChange={(e) => setConfigForm({ ...configForm, tradeName: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>GSTIN Number</label>
                  <input
                    type="text"
                    value={configForm.gstin}
                    onChange={(e) => setConfigForm({ ...configForm, gstin: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', textTransform: 'uppercase' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Proprietor</label>
                  <input
                    type="text"
                    value={configForm.proprietor}
                    onChange={(e) => setConfigForm({ ...configForm, proprietor: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Phone 1 (Main Hotline)</label>
                  <input
                    type="text"
                    value={configForm.phone1}
                    onChange={(e) => setConfigForm({ ...configForm, phone1: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>WhatsApp Direct Number</label>
                  <input
                    type="text"
                    value={configForm.whatsapp}
                    onChange={(e) => setConfigForm({ ...configForm, whatsapp: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Registered Workshop Address</label>
                <input
                  type="text"
                  value={configForm.address}
                  onChange={(e) => setConfigForm({ ...configForm, address: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Top Header Announcement Bar Text</label>
                <textarea
                  rows={2}
                  value={configForm.announcementText}
                  onChange={(e) => setConfigForm({ ...configForm, announcementText: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div className="flex justify-end">
                <button type="submit" className="btn btn-primary flex items-center gap-2">
                  <Save size={16} />
                  <span>Update Business Configuration</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
