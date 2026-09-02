import React from 'react';
import { useMess } from '../context/MessContext';
import { AppLogo } from './AppLogo';
import {
  ShieldAlert,
  Bell,
  UserCheck,
  Sparkles,
  Send,
  PlusCircle,
  RotateCcw,
  Languages,
  CheckCircle2,
  Volume2,
} from 'lucide-react';

interface NavbarProps {
  onOpenNotificationDrawer: () => void;
  onOpenAddMarketModal: () => void;
  onOpenBroadcastModal: () => void;
  onOpenAdminLoginModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenNotificationDrawer,
  onOpenAddMarketModal,
  onOpenBroadcastModal,
  onOpenAdminLoginModal,
}) => {
  const {
    activeUser,
    members,
    setActiveUserId,
    viewMode,
    setViewMode,
    unreadNotificationCount,
    marketStats,
    formatMoney,
    resetToSampleData,
    language,
    webNotificationPermission,
    requestNotificationPermission,
    isSyncing,
    isAdminAuthenticated,
    superAdminEmail,
    logoutAdmin,
  } = useMess();

  return (
    <header className="sticky top-0 z-40 bg-[#0F172A]/90 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl shadow-indigo-950/20">
      {/* Top Banner Notice */}
      <div className="bg-slate-950/80 text-slate-300 text-[11px] py-1.5 px-4 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden">
            <span
              className={`inline-block w-2 h-2 rounded-full shrink-0 ${
                isSyncing ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'
              }`}
            />
            <span className="font-semibold text-white truncate font-['Hind_Siliguri',sans-serif]">
              {language === 'bn'
                ? '🟢 ব্যাচেলর মেস ফ্ল্যাট ৪বি • রিয়েল-টাইম বাজার ও রান্নার লাইভ সিঙ্ক'
                : '🟢 Bachelor Mess Flat 4B • Live Market & Cooking Sync'}
            </span>
            <span className="hidden md:inline text-slate-400 font-['Hind_Siliguri',sans-serif]">
              (চলতি মাস: <strong className="text-indigo-300 font-bold">{formatMoney(marketStats.totalMonthSpend)}</strong> • আজকের বাজার: <strong className="text-emerald-400 font-bold">{formatMoney(marketStats.todaysSpend)}</strong>)
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {webNotificationPermission !== 'granted' && (
              <button
                onClick={requestNotificationPermission}
                className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/40 transition-colors flex items-center gap-1 cursor-pointer"
                title="ব্রাউজার পুশ নোটিফিকেশন অন করুন"
              >
                <Bell className="w-2.5 h-2.5" />
                <span>পুশ অ্যালার্ট অন করুন</span>
              </button>
            )}

            <div className="flex items-center gap-1.5">
              {isAdminAuthenticated ? (
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3 text-amber-400" />
                  <span className="hidden sm:inline">ভেরিফাইড অ্যাডমিন ({superAdminEmail})</span>
                  <span className="sm:hidden">অ্যাডমিন</span>
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1">
                  <span>🔒 সাধারণ মেম্বার (Read Only)</span>
                </span>
              )}
            </div>

            {isAdminAuthenticated && (
              <button
                onClick={resetToSampleData}
                className="text-slate-400 hover:text-white text-[10px] hidden lg:flex items-center gap-1 transition-colors cursor-pointer"
                title="নমুনা ডেটায় রিস্টোর করুন"
              >
                <RotateCcw className="w-3 h-3" />
                <span>রিসেট ডেমো</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* App Bengali Logo */}
        <AppLogo />

        {/* Center / Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Admin Authentication & Mode Switcher */}
          {isAdminAuthenticated ? (
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-xs font-bold text-amber-300 flex items-center gap-1.5 shadow-md shadow-amber-950/20">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">অ্যাডমিন সক্রিয়</span>
              </div>

              {/* Fast Action: Add Market Log in Bengali */}
              <button
                onClick={onOpenAddMarketModal}
                className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 via-blue-600 to-violet-600 hover:from-indigo-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>বাজার এন্ট্রি</span>
              </button>

              {/* Fast Action: Push Alert Broadcast */}
              <button
                onClick={onOpenBroadcastModal}
                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/80 text-amber-300 font-bold text-xs transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>পুশ ব্রডকাস্ট</span>
              </button>

              {/* Lock / Logout Admin Button */}
              <button
                onClick={logoutAdmin}
                className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/40 border border-slate-700 hover:border-rose-500/40 text-slate-300 hover:text-rose-300 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                title="অ্যাডমিন সেশন লক করুন"
              >
                <span>লক / প্রস্থান</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-400">
                <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>মেম্বার ভিউ (রিড-অনলি)</span>
              </div>

              {/* Admin Login Trigger Button */}
              <button
                onClick={onOpenAdminLoginModal}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>ম্যানেজার লগইন</span>
              </button>
            </div>
          )}

          {/* Push Notifications Bell with Alert Badge */}
          <button
            onClick={onOpenNotificationDrawer}
            className="relative p-2.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/80 text-slate-200 transition-colors cursor-pointer"
            title="লাইভ পুশ নোটিফিকেশন হিস্ট্রি"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white font-black text-[10px] flex items-center justify-center border-2 border-slate-900 shadow-md animate-bounce">
                {unreadNotificationCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
