'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, CartItem, Order, QuotationRequest, StoreConfig, RewindingBooking } from '../types';
import { initialProducts, initialOrders, initialQuotations, initialStoreConfig } from '../data/catalogue';

interface StoreContextType {
  products: Product[];
  storeConfig: StoreConfig;
  cart: CartItem[];
  wishlist: string[];
  compareList: Product[];
  orders: Order[];
  quotations: QuotationRequest[];
  rewindings: RewindingBooking[];
  activePage: string;
  pageParam: any;
  pincode: string;
  searchQuery: string;
  selectedCategory: string;
  cartDrawerOpen: boolean;
  rfqModalOpen: boolean;
  compareModalOpen: boolean;
  aiAssistantOpen: boolean;
  rewindingModalOpen: boolean;
  quickViewProduct: Product | null;
  isLoading: boolean;

  // Actions
  navigateTo: (page: string, param?: any) => void;
  setPincode: (pincode: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (cat: string) => void;
  setCartDrawerOpen: (open: boolean) => void;
  setRfqModalOpen: (open: boolean) => void;
  setCompareModalOpen: (open: boolean) => void;
  setAiAssistantOpen: (open: boolean) => void;
  setRewindingModalOpen: (open: boolean) => void;
  setQuickViewProduct: (product: Product | null) => void;

  // Cart & Commerce
  addToCart: (product: Product, quantity?: number, selectedVariant?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;

  // Wishlist & Compare
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  addToCompare: (product: Product) => boolean;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;

  // Orders & B2B RFQs
  placeOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'date'>) => Order;
  submitQuotation: (rfq: Omit<QuotationRequest, 'id' | 'rfqNumber' | 'date' | 'status'>) => QuotationRequest;
  submitRewinding: (booking: Omit<RewindingBooking, 'id' | 'bookingNumber' | 'date' | 'status'>) => RewindingBooking;

  // Admin Management Actions
  updateStoreConfig: (newConfig: StoreConfig) => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['orderStatus']) => Promise<void>;
  updateQuotationStatus: (rfqId: string, status: QuotationRequest['status'], adminNotes?: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [storeConfig, setStoreConfig] = useState<StoreConfig>(initialStoreConfig);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [quotations, setQuotations] = useState<QuotationRequest[]>(initialQuotations);
  const [rewindings, setRewindings] = useState<RewindingBooking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<Product[]>([]);

  // Navigation & UI state
  const [activePage, setActivePage] = useState<string>('home');
  const [pageParam, setPageParam] = useState<any>(null);
  const [pincode, setPincode] = useState<string>('305901');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [cartDrawerOpen, setCartDrawerOpen] = useState<boolean>(false);
  const [rfqModalOpen, setRfqModalOpen] = useState<boolean>(false);
  const [compareModalOpen, setCompareModalOpen] = useState<boolean>(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState<boolean>(false);
  const [rewindingModalOpen, setRewindingModalOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Load client localStorage data on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedCart = localStorage.getItem('dagdi_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem('dagdi_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedPincode = localStorage.getItem('dagdi_pincode');
      if (savedPincode) setPincode(savedPincode);
    } catch (e) {
      console.warn('Could not read from localStorage', e);
    }
  }, []);

  // Fetch data from Node.js backend API
  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      // Fetch Products
      const prodRes = await fetch('/api/products');
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        if (prodData.success && Array.isArray(prodData.data) && prodData.data.length > 0) {
          setProducts(prodData.data);
        }
      }

      // Fetch Config
      const configRes = await fetch('/api/config');
      if (configRes.ok) {
        const confData = await configRes.json();
        if (confData.success && confData.data) {
          setStoreConfig(confData.data);
        }
      }

      // Fetch Orders
      const ordersRes = await fetch('/api/orders');
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        if (ordersData.success && Array.isArray(ordersData.data)) {
          setOrders(ordersData.data);
        }
      }

      // Fetch Quotations
      const rfqRes = await fetch('/api/rfq');
      if (rfqRes.ok) {
        const rfqData = await rfqRes.json();
        if (rfqData.success && Array.isArray(rfqData.data)) {
          setQuotations(rfqData.data);
        }
      }

      // Fetch Rewindings
      const rewRes = await fetch('/api/rewinding');
      if (rewRes.ok) {
        const rewData = await rewRes.json();
        if (rewData.success && Array.isArray(rewData.data)) {
          setRewindings(rewData.data);
        }
      }
    } catch (err) {
      console.error('Error fetching backend data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Sync cart & wishlist to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dagdi_cart', JSON.stringify(cart));
    }
  }, [cart]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dagdi_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dagdi_pincode', pincode);
    }
  }, [pincode]);

  const navigateTo = (page: string, param?: any) => {
    setActivePage(page);
    setPageParam(param || null);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Update browser history URL for Next.js friendly routing
      let targetPath = '/';
      switch (page) {
        case 'home': targetPath = '/'; break;
        case 'category':
          targetPath = `/category/${param?.slug || param?.id || param || ''}`;
          break;
        case 'catalog':
          targetPath = param?.category && param.category !== 'all' ? `/category/${encodeURIComponent(param.category)}` : '/catalog';
          break;
        case 'product-detail':
          targetPath = `/products/${param?.slug || param?.id || ''}`;
          break;
        case 'checkout': targetPath = '/checkout'; break;
        case 'order-confirmation':
          targetPath = `/order-confirmation/${param?.orderNumber || param?.id || ''}`;
          break;
        case 'quotation-builder': targetPath = '/quotation-builder'; break;
        case 'rewinding-service': targetPath = '/rewinding-service'; break;
        case 'calculator': targetPath = '/calculator'; break;
        case 'about': targetPath = '/about'; break;
        case 'contact': targetPath = '/contact'; break;
        case 'order-tracking': targetPath = '/order-tracking'; break;
        case 'admin': targetPath = '/admin'; break;
      }
      try {
        if (window.location.pathname !== targetPath) {
          window.history.pushState({}, '', targetPath);
        }
      } catch (e) {
        // Safe fallback
      }
    }
  };

  // Cart Calculations
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const addToCart = (product: Product, quantity = 1, selectedVariant?: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id && item.selectedVariant === selectedVariant);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.selectedVariant === selectedVariant
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedVariant }];
    });
    setCartDrawerOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Compare
  const addToCompare = (product: Product) => {
    if (compareList.length >= 4) {
      alert('You can compare a maximum of 4 products at a time.');
      return false;
    }
    if (!compareList.some((p) => p.id === product.id)) {
      setCompareList([...compareList, product]);
    }
    setCompareModalOpen(true);
    return true;
  };

  const removeFromCompare = (productId: string) => {
    setCompareList(compareList.filter((p) => p.id !== productId));
  };

  const clearCompare = () => setCompareList([]);

  // Orders
  const placeOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'date'>): Order => {
    const timestamp = Date.now().toString().slice(-4);
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `DGD-2026-${timestamp}`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    // Sync to Node.js backend
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder),
    }).catch((err) => console.warn('Order sync error', err));

    return newOrder;
  };

  // RFQ Quotations
  const submitQuotation = (rfqData: Omit<QuotationRequest, 'id' | 'rfqNumber' | 'date' | 'status'>): QuotationRequest => {
    const timestamp = Math.floor(100 + Math.random() * 900);
    const newRfq: QuotationRequest = {
      ...rfqData,
      id: `rfq-${Date.now()}`,
      rfqNumber: `RFQ-2026-${timestamp}`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'New',
    };

    setQuotations((prev) => [newRfq, ...prev]);

    // Sync to Node.js backend
    fetch('/api/rfq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRfq),
    }).catch((err) => console.warn('RFQ sync error', err));

    return newRfq;
  };

  // Rewinding Service Bookings
  const submitRewinding = (bookingData: Omit<RewindingBooking, 'id' | 'bookingNumber' | 'date' | 'status'>): RewindingBooking => {
    const timestamp = Math.floor(1000 + Math.random() * 9000);
    const newBooking: RewindingBooking = {
      ...bookingData,
      id: `rewind-${Date.now()}`,
      bookingNumber: `MRW-${timestamp}`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'Received',
    };

    setRewindings((prev) => [newBooking, ...prev]);

    // Sync to Node.js backend
    fetch('/api/rewinding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBooking),
    }).catch((err) => console.warn('Rewinding sync error', err));

    return newBooking;
  };

  // Admin Actions
  const updateStoreConfig = async (newConfig: StoreConfig) => {
    setStoreConfig(newConfig);
    try {
      await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig),
      });
    } catch (err) {
      console.warn('Failed to sync store config with backend', err);
    }
  };

  const addProduct = async (product: Product) => {
    setProducts((prev) => [product, ...prev]);
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
    } catch (err) {
      console.warn('Failed to sync new product with backend', err);
    }
  };

  const updateProduct = async (product: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
    try {
      await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
    } catch (err) {
      console.warn('Failed to sync updated product with backend', err);
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn('Failed to sync deleted product with backend', err);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['orderStatus']) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, orderStatus: status } : o)));
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: status }),
      });
    } catch (err) {
      console.warn('Failed to sync order status with backend', err);
    }
  };

  const updateQuotationStatus = async (rfqId: string, status: QuotationRequest['status'], adminNotes?: string) => {
    setQuotations((prev) =>
      prev.map((q) => (q.id === rfqId ? { ...q, status, ...(adminNotes ? { adminNotes } : {}) } : q))
    );
    try {
      await fetch(`/api/rfq/${rfqId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes }),
      });
    } catch (err) {
      console.warn('Failed to sync quotation status with backend', err);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        storeConfig,
        cart,
        wishlist,
        compareList,
        orders,
        quotations,
        rewindings,
        activePage,
        pageParam,
        pincode,
        searchQuery,
        selectedCategory,
        cartDrawerOpen,
        rfqModalOpen,
        compareModalOpen,
        aiAssistantOpen,
        rewindingModalOpen,
        quickViewProduct,
        isLoading,

        navigateTo,
        setPincode,
        setSearchQuery,
        setSelectedCategory,
        setCartDrawerOpen,
        setRfqModalOpen,
        setCompareModalOpen,
        setAiAssistantOpen,
        setRewindingModalOpen,
        setQuickViewProduct,

        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,

        toggleWishlist,
        isInWishlist,
        addToCompare,
        removeFromCompare,
        clearCompare,

        placeOrder,
        submitQuotation,
        submitRewinding,

        updateStoreConfig,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        updateQuotationStatus,
        refreshData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
