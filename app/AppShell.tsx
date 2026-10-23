'use client';

import React from 'react';
import { StoreProvider, useStore } from '@/context/StoreContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { QuickViewModal } from '@/components/QuickViewModal';
import { CompareModal } from '@/components/CompareModal';
import { RfqModal } from '@/components/RfqModal';
import { RewindingServiceModal } from '@/components/RewindingServiceModal';
import { AiAdvisorModal } from '@/components/AiAdvisorModal';

const ShellContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activePage } = useStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Show header on all pages except admin */}
      {activePage !== 'admin' && <Header />}

      <main style={{ flex: 1 }}>{children}</main>

      {/* Show footer on all pages except admin */}
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

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <ShellContent>{children}</ShellContent>
    </StoreProvider>
  );
}
