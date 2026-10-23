import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { CompareModal } from './components/CompareModal';
import { RfqModal } from './components/RfqModal';
import { RewindingServiceModal } from './components/RewindingServiceModal';
import { AiAdvisorModal } from './components/AiAdvisorModal';

// Views
import { HomePage } from './views/HomePage';
import { CatalogPage } from './views/CatalogPage';
import { ProductDetailPage } from './views/ProductDetailPage';
import { CheckoutPage } from './views/CheckoutPage';
import { OrderConfirmationPage } from './views/OrderConfirmationPage';
import { QuotationBuilderPage } from './views/QuotationBuilderPage';
import { RewindingPage } from './views/RewindingPage';
import { AboutPage } from './views/AboutPage';
import { ContactPage } from './views/ContactPage';
import { OrderTrackingPage } from './views/OrderTrackingPage';
import { AdminDashboardPage } from './views/AdminDashboardPage';

const AppContent: React.FC = () => {
  const { activePage } = useStore();

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage />;
      case 'catalog':
        return <CatalogPage />;
      case 'product-detail':
        return <ProductDetailPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'order-confirmation':
        return <OrderConfirmationPage />;
      case 'quotation-builder':
        return <QuotationBuilderPage />;
      case 'rewinding-service':
        return <RewindingPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'order-tracking':
        return <OrderTrackingPage />;
      case 'admin':
        return <AdminDashboardPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Hide storefront header/footer in admin dashboard view for clean separation */}
      {activePage !== 'admin' && <Header />}

      <main style={{ flex: 1 }}>{renderPage()}</main>

      {activePage !== 'admin' && <Footer />}

      {/* Global Interactive Overlays */}
      <CartDrawer />
      <QuickViewModal />
      <CompareModal />
      <RfqModal />
      <RewindingServiceModal />
      <AiAdvisorModal />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
