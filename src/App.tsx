import React, { useState } from 'react';
import { MessProvider, useMess } from './context/MessContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { MarketLogModal } from './components/MarketLogModal';
import { PushNotificationDrawer } from './components/PushNotificationDrawer';
import { BroadcastModal } from './components/BroadcastModal';
import { LivePushToast } from './components/LivePushToast';
import { AuthScreen } from './components/AuthScreen';
import { MarketLog } from './types';

const MainAppContent: React.FC = () => {
  const { isLoggedIn, isAdmin } = useMess();

  // Modals state
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isMarketLogModalOpen, setIsMarketLogModalOpen] = useState(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<MarketLog | null>(null);
  const [targetDateForNewLog, setTargetDateForNewLog] = useState<string | undefined>(undefined);

  // If not authenticated, render the dedicated Sign In / Sign Up gate
  if (!isLoggedIn) {
    return <AuthScreen />;
  }

  const handleOpenAddMarketModal = (log?: MarketLog, targetDate?: string) => {
    if (!isAdmin) {
      return;
    }
    setEditingLog(log || null);
    setTargetDateForNewLog(targetDate);
    setIsMarketLogModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-['Hind_Siliguri','Plus_Jakarta_Sans',sans-serif] selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      {/* Subtle ambient lighting orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-10 left-1/3 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Fixed Navbar */}
      <Navbar
        onOpenNotificationDrawer={() => setIsNotificationDrawerOpen(true)}
        onOpenAddMarketModal={() => handleOpenAddMarketModal()}
        onOpenBroadcastModal={() => {
          if (isAdmin) {
            setIsBroadcastModalOpen(true);
          }
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6">
        <Dashboard
          onOpenAddMarketModal={handleOpenAddMarketModal}
          onOpenBroadcastModal={() => {
            if (isAdmin) {
              setIsBroadcastModalOpen(true);
            }
          }}
          onOpenNotificationDrawer={() => setIsNotificationDrawerOpen(true)}
        />
      </main>

      {/* Floating Push Notification Toast Alert */}
      <LivePushToast onOpenDrawer={() => setIsNotificationDrawerOpen(true)} />

      {/* Drawers & Modals */}
      <PushNotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        onOpenBroadcastModal={() => {
          if (isAdmin) {
            setIsBroadcastModalOpen(true);
          }
        }}
      />

      <MarketLogModal
        isOpen={isMarketLogModalOpen}
        onClose={() => {
          setIsMarketLogModalOpen(false);
          setEditingLog(null);
          setTargetDateForNewLog(undefined);
        }}
        initialLog={editingLog}
        targetDate={targetDateForNewLog}
      />

      <BroadcastModal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <MessProvider>
      <MainAppContent />
    </MessProvider>
  );
};

export default App;
