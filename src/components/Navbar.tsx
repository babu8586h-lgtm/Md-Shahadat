import React from 'react';
import { useMess } from '../context/MessContext';
import { AppLogo } from './AppLogo';
import {
  Bell,
  Sparkles,
  Send,
  PlusCircle,
  RotateCcw,
  LogOut,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

interface NavbarProps {
  onOpenNotificationDrawer: () => void;
  onOpenAddMarketModal: () => void;
  onOpenBroadcastModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenNotificationDrawer,
  onOpenAddMarketModal,
  onOpenBroadcastModal,
}) => {
  const {
    currentUser,
    isAdmin,
    unreadNotificationCount,
    marketStats,
    formatMoney,
    resetToSampleData,
    language,
    webNotificationPermission,
    requestNotificationPermission,
    isSyncing,
    logout,
  } = useMess();

  return (
    <header className="sticky top-0 z-40 bg-[#0F172A]/95 backdrop-blur-xl border-b border-slate-800 shadow-2xl shadow-indigo-950/20 font-['Hind_Siliguri',sans-serif]">
      {/* Top Banner Notice */}
      <div className="bg-slate-950/90 text-slate-300 text-[11px] py-1.5 px-4 sm:px-6 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <span
              className={`inline-block w-2 h-2 rounded-full shrink-0 ${
                isSyncing ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'
              }`}
            />
            <span className="font-semibold text-white truncate">
              🟢 ব্যাচেলর মেস ফ্ল্যাট ৪বি • লাইভ সিঙ্ক
            </span>
            <span className="hidden md:inline text-slate-400">
              (চলতি মাস: <strong className="text-indigo-300 font-bold">{formatMoney(marketStats.totalMonthSpend)}</strong> • আজকের বাজার: <strong className="text-emerald-400 font-bold">{formatMoney(marketStats.todaysSpend)}</strong>)
            </span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {webNotificationPermission !== 'granted' && (
              <button
                onClick={requestNotificationPermission}
                className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/40 transition-colors flex items-center gap-1 cursor-pointer"
                title="ব্রাউজার পুশ নোটিফিকেশন অন করুন"
              >
                <Bell className="w-2.5 h-2.5" />
                <span>পুশ অ্যালার্ট</span>
              </button>
            )}

            <div className="flex items-center gap-1.5">
              {isAdmin ? (
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-400" />
                  <span>👑 ম্যানেজার মোড</span>
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-indigo-400" />
                  <span>মেম্বার মোড (Read Only)</span>
                </span>
              )}
            </div>

            {isAdmin && (
              <button
                onClick={resetToSampleData}
                className="text-slate-400 hover:text-white text-[10px] hidden lg:flex items-center gap-1 transition-colors cursor-pointer"
                title="নমুনা ডেটায় রিস্টোর করুন"
              >
                <RotateCcw className="w-3 h-3" />
                <span>ডেমো রিসেট</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* App Bengali Logo */}
        <AppLogo />

        {/* Right Controls & User Session */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Admin Fast Action: Add Market Log in Bengali */}
          {isAdmin && (
            <>
              <button
                onClick={onOpenAddMarketModal}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 via-blue-600 to-violet-600 hover:from-indigo-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>বাজার এন্ট্রি</span>
              </button>

              <button
                onClick={onOpenBroadcastModal}
                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/80 text-amber-300 font-bold text-xs transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>পুশ ব্রডকাস্ট</span>
              </button>
            </>
          )}

          {/* Push Notifications Bell with Alert Badge */}
          <button
            onClick={onOpenNotificationDrawer}
            className="relative p-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/80 text-slate-200 transition-colors cursor-pointer"
            title="লাইভ পুশ নোটিফিকেশন হিস্ট্রি"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white font-black text-[10px] flex items-center justify-center border-2 border-slate-900 shadow-md animate-bounce">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {/* User Profile & Logout Button */}
          {currentUser && (
            <div className="flex items-center gap-2 pl-1 border-l border-slate-800">
              <div className="hidden sm:flex flex-col items-end text-right">
                <span className="text-xs font-bold text-white leading-tight">
                  {currentUser.nameBangla}
                </span>
                <span className="text-[10px] text-slate-400 leading-tight">
                  {isAdmin ? '👑 মেস ম্যানেজার' : '👤 রুমমেট মেম্বার'}
                </span>
              </div>

              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-sm shadow-inner">
                {currentUser.avatar || '👤'}
              </div>

              <button
                onClick={logout}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 transition-all cursor-pointer flex items-center gap-1"
                title="লগআউট করুন"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline text-xs font-bold">লগআউট</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
