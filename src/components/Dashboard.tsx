import React, { useState } from 'react';
import { useMess } from '../context/MessContext';
import { MarketLog } from '../types';
import {
  ShoppingBag,
  UtensilsCrossed,
  Calendar,
  DollarSign,
  Search,
  PlusCircle,
  Bell,
  Clock,
  User,
  Edit2,
  Trash2,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Filter,
  CalendarDays,
  Receipt,
  ChefHat,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';

interface DashboardProps {
  onOpenAddMarketModal: (log?: MarketLog, targetDate?: string) => void;
  onOpenBroadcastModal: () => void;
  onOpenNotificationDrawer: () => void;
  onOpenAdminLoginModal?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onOpenAddMarketModal,
  onOpenBroadcastModal,
  onOpenNotificationDrawer,
  onOpenAdminLoginModal,
}) => {
  const {
    marketLogs,
    deleteMarketLog,
    marketStats,
    todayLog,
    tomorrowLog,
    formatMoney,
    formatDisplayDate,
    selectedDate,
    setSelectedDate,
    searchQuery,
    setSearchQuery,
    selectedFilter,
    setSelectedFilter,
    viewMode,
    notifications,
    unreadNotificationCount,
    isAdmin,
    isAdminAuthenticated,
    superAdminEmail,
  } = useMess();

  const [specificDateFilter, setSpecificDateFilter] = useState<string>('');
  const latestNotif = notifications[0];

  // Filtering logs based on search query, specific date filter, filter chip
  const filteredLogs = marketLogs.filter((log) => {
    // Specific date filter
    if (specificDateFilter && log.date !== specificDateFilter) {
      return false;
    }

    // Search query filter (matches items, menu, shopper, notes, or date)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchItems = log.itemsBought.toLowerCase().includes(q);
      const matchMenu = log.menuCooked.toLowerCase().includes(q);
      const matchShopper = log.shopperName.toLowerCase().includes(q);
      const matchNotes = log.notes?.toLowerCase().includes(q);
      const matchDate = log.date.toLowerCase().includes(q);
      if (!matchItems && !matchMenu && !matchShopper && !matchNotes && !matchDate) {
        return false;
      }
    }

    // Filter chip filter
    const dateInfo = formatDisplayDate(log.date);
    if (selectedFilter === 'today') {
      return dateInfo.isToday;
    }
    if (selectedFilter === 'planned') {
      return log.isPlanned;
    }
    if (selectedFilter === 'past') {
      return !log.isPlanned && !dateInfo.isToday;
    }

    return true;
  });

  // Sort logs: Today first, then planned/future, then past chronological descending
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Selected date log lookup
  const selectedDateLog = marketLogs.find((l) => l.date === selectedDate);
  const selectedDateInfo = formatDisplayDate(selectedDate);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* 1. HERO SPOTLIGHT: Today's Market & Cooking Menu (VIP Glassmorphic Card) */}
      <div className="bg-gradient-to-br from-slate-900 via-[#1E1B4B]/70 to-[#0F172A] text-white rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/40 relative overflow-hidden border border-indigo-500/20">
        {/* Glow ambient effects */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>ফ্ল্যাট ৪বি • দৈনিক বাজার ও লাইভ পুশ নোটিফিকেশন</span>
            </div>

            <h2 className="font-['Noto_Sans_Bengali','Outfit',sans-serif] font-black text-2xl sm:text-3xl text-white tracking-tight leading-snug">
              ব্যাচেলর মেস ট্র্যাকার
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 font-['Hind_Siliguri',sans-serif] leading-relaxed">
              তারিখ অনুযায়ী মেসের যাবতীয় বাজার খরচ ও রান্নার মেন্যু সার্বক্ষণিক রিয়েল-টাইম সিঙ্ক।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {viewMode === 'admin' ? (
              <button
                onClick={() => onOpenAddMarketModal()}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-blue-600 to-violet-600 hover:from-indigo-400 hover:to-blue-500 text-white font-black text-xs shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <PlusCircle className="w-4 h-4" />
                <span>দৈনিক বাজার এন্ট্রি</span>
              </button>
            ) : (
              <div className="px-4 py-2.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 flex items-center gap-2 shadow-inner">
                <User className="w-4 h-4 text-indigo-400" />
                <span>মেম্বার ভিউ মোড</span>
              </div>
            )}

            <button
              onClick={onOpenNotificationDrawer}
              className="px-4 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              <span>নোটিফিকেশন ({unreadNotificationCount})</span>
            </button>
          </div>
        </div>

        {/* Highlight Card: TODAY'S MARKET & MEAL (Bengali Bold Typography) */}
        <div className="mt-8 pt-6 border-t border-indigo-500/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5 font-['Hind_Siliguri',sans-serif]">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>আজকের লাইভ বাজার ও মেন্যু ({formatDisplayDate(new Date().toISOString().split('T')[0]).fullBangla})</span>
            </span>

            {viewMode === 'admin' && todayLog && (
              <button
                onClick={() => onOpenAddMarketModal(todayLog)}
                className="text-[11px] font-bold text-indigo-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
                <span>সম্পাদনা করুন</span>
              </button>
            )}
          </div>

          {todayLog ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/60 border border-indigo-500/30 rounded-2xl p-5 backdrop-blur-md shadow-xl">
              {/* Items Bought */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-indigo-400" />
                  <span>কেনাকাটা / বাজারের তালিকা:</span>
                </div>
                <p className="text-sm font-bold text-white leading-snug font-['Hind_Siliguri',sans-serif]">
                  {todayLog.itemsBought}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] text-slate-400">ক্রেতা: <strong className="text-slate-200">{todayLog.shopperName}</strong></span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>পরিশোধিত ও সম্পন্ন</span>
                  </span>
                </div>
              </div>

              {/* Menu Cooked */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                  <ChefHat className="w-3.5 h-3.5 text-amber-400" />
                  <span>আজকের রান্নার মেন্যু:</span>
                </div>
                <p className="text-sm font-bold text-amber-300 leading-snug font-['Hind_Siliguri',sans-serif]">
                  {todayLog.menuCooked}
                </p>
                {todayLog.notes && (
                  <p className="text-[11px] text-slate-400 italic font-['Hind_Siliguri',sans-serif]">"{todayLog.notes}"</p>
                )}
              </div>

              {/* Total Spent */}
              <div className="flex flex-col justify-between items-start md:items-end border-t md:border-t-0 md:border-l border-slate-700/60 pt-3 md:pt-0 md:pl-4">
                <span className="text-[11px] text-slate-400 font-semibold">আজকের মোট খরচ:</span>
                <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-['Outfit','Noto_Sans_Bengali',sans-serif] tracking-tight drop-shadow-sm">
                  {formatMoney(todayLog.amount)}
                </span>
                <span className="text-[10px] text-slate-400">
                  আপডেট: {new Date(todayLog.timestamp).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 text-slate-300">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span className="font-['Hind_Siliguri',sans-serif]">আজকের তারিখের বাজার এখনও এন্ট্রি করা হয়নি।</span>
              </div>

              {viewMode === 'admin' && (
                <button
                  onClick={() => onOpenAddMarketModal(undefined, new Date().toISOString().split('T')[0])}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>আজকের বাজার যোগ করুন</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* 4 Core Quick Financial Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mt-6">
          {/* Card 1: Month's Cumulative Total */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-700/60 backdrop-blur-md hover:border-indigo-500/40 transition-all shadow-md">
            <div className="flex items-center justify-between text-slate-300 text-xs font-semibold mb-1">
              <span>চলতি মাসের মোট বাজার</span>
              <Receipt className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-white font-['Outfit','Noto_Sans_Bengali',sans-serif]">
              {formatMoney(marketStats.totalMonthSpend)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-['Hind_Siliguri',sans-serif]">
              সার্বিক মেস খরচ
            </div>
          </div>

          {/* Card 2: Today's Market Spend */}
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 backdrop-blur-md hover:border-indigo-500/60 transition-all shadow-md">
            <div className="flex items-center justify-between text-indigo-200 text-xs font-semibold mb-1">
              <span>আজকের বাজার খরচ</span>
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 font-['Outfit','Noto_Sans_Bengali',sans-serif]">
              {formatMoney(marketStats.todaysSpend)}
            </div>
            <div className="text-[11px] text-indigo-200/80 mt-1 font-['Hind_Siliguri',sans-serif]">
              {todayLog ? 'যাচাইকৃত ও লিপিবদ্ধ' : 'অপেক্ষমান'}
            </div>
          </div>

          {/* Card 3: Daily Average Market Spend */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-700/60 backdrop-blur-md hover:border-blue-500/40 transition-all shadow-md">
            <div className="flex items-center justify-between text-slate-300 text-xs font-semibold mb-1">
              <span>দৈনিক গড় খরচ</span>
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-blue-300 font-['Outfit','Noto_Sans_Bengali',sans-serif]">
              {formatMoney(marketStats.dailyAverage)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-['Hind_Siliguri',sans-serif]">
              প্রতি দিনের গড় ব্যয়
            </div>
          </div>

          {/* Card 4: Total Tracked Days */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-700/60 backdrop-blur-md hover:border-amber-500/40 transition-all shadow-md">
            <div className="flex items-center justify-between text-slate-300 text-xs font-semibold mb-1">
              <span>মোট হিসাবকৃত দিন</span>
              <CalendarDays className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-300 font-['Outfit','Noto_Sans_Bengali',sans-serif]">
              {marketStats.totalMarketDays} দিন
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-['Hind_Siliguri',sans-serif]">
              {marketStats.plannedCount} দিন অগ্রিম নির্ধারিত
            </div>
          </div>
        </div>
      </div>

      {/* 2. LIVE NOTIFICATION ACTIVITY STRIP */}
      {latestNotif && (
        <div
          onClick={onOpenNotificationDrawer}
          className="bg-slate-900/80 hover:bg-slate-800/90 border border-indigo-500/30 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs text-slate-200 cursor-pointer transition-all shadow-lg backdrop-blur-md group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4 text-indigo-400 animate-pulse" />
            </div>
            <div>
              <div className="font-bold flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-600 text-white font-extrabold uppercase shadow-xs">
                  লাইভ পুশ অ্যালার্ট
                </span>
                <span className="font-semibold text-white font-['Hind_Siliguri',sans-serif]">{latestNotif.title}</span>
              </div>
              <p className="text-slate-300 text-[11px] mt-0.5 line-clamp-1 font-['Hind_Siliguri',sans-serif]">{latestNotif.body}</p>
            </div>
          </div>

          <span className="text-[11px] font-bold text-indigo-300 group-hover:text-white flex items-center gap-1 shrink-0 transition-colors">
            <span>সব দেখুন ({notifications.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      )}

      {/* 3. DATE PICKER & INSTANT SEARCH / FILTER BAR */}
      <div className="bg-slate-900/80 rounded-3xl p-5 sm:p-6 border border-slate-800/80 shadow-xl backdrop-blur-md space-y-4 font-['Hind_Siliguri',sans-serif]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="font-['Noto_Sans_Bengali','Outfit',sans-serif] font-bold text-lg text-white flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-indigo-400" />
              <span>তারিখ অনুযায়ী দৈনিক বাজার ও রান্নার মেন্যু</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              নির্দিষ্ট কোনো তারিখের বাজার ফিল্টার করতে নিচের ক্যালেন্ডার বা সার্চ ইনপুট ব্যবহার করুন।
            </p>
          </div>

          {/* Quick Date Filter Input (Above Market List) */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-950/60 border border-slate-700/80 rounded-2xl p-1.5 text-xs w-full sm:w-auto">
            <span className="text-slate-300 font-bold px-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>তারিখ ফিল্টার:</span>
            </span>
            <input
              type="date"
              value={specificDateFilter}
              onChange={(e) => {
                setSpecificDateFilter(e.target.value);
                setSelectedDate(e.target.value);
              }}
              className="bg-slate-900 text-white px-3 py-1.5 rounded-xl border border-slate-700 font-bold text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            />
            {specificDateFilter && (
              <button
                onClick={() => setSpecificDateFilter('')}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] transition-colors cursor-pointer"
                title="ফিল্টার মুছে সব তারিখ দেখুন"
              >
                সব তারিখ দেখুন
              </button>
            )}
          </div>
        </div>

        {/* Search Bar and Filter Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="বাজারের আইটেম (যেমন: শাক ও মুরগি, আলু, মাছ) বা রান্নার মেন্যু লিখে সার্চ করুন..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-slate-950/50 text-white placeholder-slate-500 font-['Hind_Siliguri',sans-serif]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
              >
                রিসেট
              </button>
            )}
          </div>

          <div className="sm:col-span-4 flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => {
                setSelectedFilter('all');
                setSpecificDateFilter('');
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedFilter === 'all' && !specificDateFilter
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              সব দিন ({marketLogs.length})
            </button>
            <button
              onClick={() => {
                setSelectedFilter('today');
                setSpecificDateFilter('');
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedFilter === 'today'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              আজকের বাজার
            </button>
            <button
              onClick={() => {
                setSelectedFilter('planned');
                setSpecificDateFilter('');
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedFilter === 'planned'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              অগ্রিম মেন্যু
            </button>
          </div>
        </div>

        {/* Selected Date Quick Spotlight Card (If user picked a specific date) */}
        {selectedDate && (
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-sm shadow-md shrink-0">
                {new Date(selectedDate).getDate() || '📅'}
              </div>
              <div>
                <div className="font-bold text-white flex items-center gap-2 font-['Hind_Siliguri',sans-serif]">
                  <span>নির্বাচিত তারিখ: {selectedDateInfo.fullBangla}</span>
                  {selectedDateInfo.isToday && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                      আজ
                    </span>
                  )}
                  {selectedDateInfo.isTomorrow && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                      আগামীকাল
                    </span>
                  )}
                </div>

                {selectedDateLog ? (
                  <p className="text-slate-300 text-[11px] mt-0.5 font-['Hind_Siliguri',sans-serif]">
                    <strong>মেন্যু:</strong> {selectedDateLog.menuCooked} • <strong>খরচ:</strong>{' '}
                    <span className="text-emerald-400 font-bold">{formatMoney(selectedDateLog.amount)}</span> ({selectedDateLog.shopperName})
                  </p>
                ) : (
                  <p className="text-slate-400 text-[11px] mt-0.5 font-['Hind_Siliguri',sans-serif]">
                    এই তারিখের জন্য কোনো বাজার এন্ট্রি পাওয়া যায়নি।
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              {viewMode === 'admin' && (
                <button
                  onClick={() => onOpenAddMarketModal(selectedDateLog, selectedDate)}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {selectedDateLog ? (
                    <>
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>সম্পাদনা করুন</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>{selectedDateInfo.monthDayBangla} এন্ট্রি করুন</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 4. SLEEK TIMELINE VIEW: DATE-WISE MARKET & MENU HISTORY FEED */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h4 className="font-['Noto_Sans_Bengali','Outfit',sans-serif] font-bold text-base text-white flex items-center gap-2">
            <span>দৈনিক বাজার ও মেন্যু টাইমলাইন</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-indigo-300 border border-slate-700">
              {sortedLogs.length} টি রেকর্ড
            </span>
          </h4>

          {viewMode === 'admin' && (
            <button
              onClick={() => onOpenAddMarketModal()}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>নতুন এন্ট্রি</span>
            </button>
          )}
        </div>

        {sortedLogs.length === 0 ? (
          <div className="bg-slate-900/80 rounded-3xl p-12 text-center border border-slate-800/80 space-y-3 shadow-xl backdrop-blur-md">
            <ShoppingBag className="w-10 h-10 mx-auto text-slate-500 stroke-1" />
            <h4 className="font-bold text-white text-sm font-['Hind_Siliguri',sans-serif]">কোনো বাজার তালিকা পাওয়া যায়নি</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto font-['Hind_Siliguri',sans-serif]">
              {searchQuery
                ? `"${searchQuery}" এর সাথে মিলে এমন কোনো রেকর্ড পাওয়া যায়নি। ফিল্টার রিসেট করে আবার দেখুন।`
                : 'এই ফিল্টারে এখনও কোনো বাজার এন্ট্রি করা হয়নি।'}
            </p>

            {viewMode === 'admin' && (
              <button
                onClick={() => onOpenAddMarketModal()}
                className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md hover:bg-indigo-500 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>বাজার এন্ট্রি তৈরি করুন</span>
              </button>
            )}
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-indigo-500 before:via-slate-700 before:to-slate-800">
            {sortedLogs.map((log) => {
              const dateInfo = formatDisplayDate(log.date);

              return (
                <div key={log.id} className="relative group">
                  {/* Timeline Glowing Node Indicator */}
                  <div
                    className={`absolute -left-6 sm:-left-8 top-6 w-3 h-3 rounded-full border-2 transform -translate-x-1/2 transition-all ${
                      dateInfo.isToday
                        ? 'bg-emerald-400 border-slate-950 ring-4 ring-emerald-500/30'
                        : log.isPlanned
                        ? 'bg-amber-400 border-slate-950 ring-4 ring-amber-500/30'
                        : 'bg-indigo-400 border-slate-950 group-hover:ring-4 group-hover:ring-indigo-500/30'
                    }`}
                  />

                  {/* Timeline Card */}
                  <div
                    className={`bg-slate-900/80 rounded-2xl p-5 sm:p-6 border transition-all duration-200 backdrop-blur-md hover:shadow-xl hover:shadow-indigo-950/30 ${
                      dateInfo.isToday
                        ? 'border-emerald-500/50 ring-1 ring-emerald-500/20 bg-gradient-to-r from-slate-900 via-emerald-950/20 to-slate-900'
                        : log.isPlanned
                        ? 'border-amber-500/40 bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900'
                        : 'border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                      {/* Date Badge and Title Info */}
                      <div className="flex items-start gap-3.5">
                        <div
                          className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-extrabold shadow-md shrink-0 ${
                            dateInfo.isToday
                              ? 'bg-emerald-500 text-slate-950'
                              : log.isPlanned
                              ? 'bg-amber-500 text-slate-950'
                              : 'bg-slate-800 text-indigo-300 border border-slate-700'
                          }`}
                        >
                          <span className="text-[10px] uppercase font-bold tracking-wider">
                            {dateInfo.monthNameBangla || dateInfo.monthDayBangla.split(' ')[1]}
                          </span>
                          <span className="text-base font-black font-['Outfit','Noto_Sans_Bengali',sans-serif] leading-none">
                            {dateInfo.dayNumberBangla || dateInfo.monthDayBangla.split(' ')[0]}
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-['Noto_Sans_Bengali','Outfit',sans-serif] font-bold text-base text-white">
                              {dateInfo.fullBangla}
                            </h4>
                            <span className="text-xs font-semibold text-slate-400 font-['Hind_Siliguri',sans-serif]">
                              • {dateInfo.dayBangla}
                            </span>

                            {dateInfo.isToday && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                <span>আজকের বাজার</span>
                              </span>
                            )}

                            {log.isPlanned && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5" />
                                <span>অগ্রিম নির্ধারিত মেন্যু</span>
                              </span>
                            )}
                          </div>

                          {/* Items Bought Pill */}
                          <div className="flex items-center gap-2 text-xs text-slate-300 pt-0.5 font-['Hind_Siliguri',sans-serif]">
                            <ShoppingBag className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                            <span className="font-semibold text-slate-400">বাজারের দ্রব্যাদি:</span>
                            <span className="text-white font-bold bg-slate-800/80 px-2.5 py-0.5 rounded-lg border border-slate-700">
                              {log.itemsBought}
                            </span>
                          </div>

                          {/* Menu Cooked Pill */}
                          <div className="flex items-center gap-2 text-xs text-slate-300 font-['Hind_Siliguri',sans-serif]">
                            <ChefHat className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span className="font-semibold text-slate-400">রান্নার মেন্যু:</span>
                            <span className="text-amber-300 font-bold bg-amber-950/40 px-2.5 py-0.5 rounded-lg border border-amber-500/30">
                              {log.menuCooked}
                            </span>
                          </div>

                          {log.notes && (
                            <p className="text-[11px] text-slate-400 italic pt-0.5 font-['Hind_Siliguri',sans-serif]">
                              নোট: {log.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right side: Amount Spent, Shopper & Admin Controls */}
                      <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800 gap-3">
                        <div className="text-left lg:text-right">
                          <div className="text-[11px] text-slate-400 font-semibold font-['Hind_Siliguri',sans-serif]">মোট খরচ</div>
                          <div className="text-2xl font-black font-['Outfit','Noto_Sans_Bengali',sans-serif] text-emerald-400">
                            {formatMoney(log.amount)}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center lg:justify-end gap-1 font-['Hind_Siliguri',sans-serif]">
                            <User className="w-3 h-3 text-indigo-400" />
                            <span>ক্রেতা: <strong className="text-slate-200">{log.shopperName}</strong></span>
                          </div>
                        </div>

                        {/* Admin action buttons */}
                        {viewMode === 'admin' && (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => onOpenAddMarketModal(log)}
                              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
                              title="সম্পাদনা করুন"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteMarketLog(log.id)}
                              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 border border-slate-700 transition-colors cursor-pointer"
                              title="মুছে ফেলুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. TOMORROW'S PLANNED MEAL HIGHLIGHT BOX */}
      {tomorrowLog && (
        <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/40 border border-amber-500/30 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl backdrop-blur-md font-['Hind_Siliguri',sans-serif]">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-lg shadow-md shrink-0">
              📋
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-['Noto_Sans_Bengali','Outfit',sans-serif] font-bold text-base text-amber-200">
                  আগামীকালের অগ্রিম মেন্যু ({formatDisplayDate(tomorrowLog.date).fullBangla})
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  অগ্রিম নির্ধারিত
                </span>
              </div>
              <p className="text-xs text-slate-200 mt-1">
                <strong>মেন্যু:</strong> <span className="text-amber-300">{tomorrowLog.menuCooked}</span> • <strong>যেসব দ্রব্যাদি কেনা লাগবে:</strong> {tomorrowLog.itemsBought}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                বাজারে যাবেন: <strong className="text-white">{tomorrowLog.shopperName}</strong> • সম্ভাব্য বাজেট: <strong className="text-emerald-400">{formatMoney(tomorrowLog.amount)}</strong>
              </p>
            </div>
          </div>

          {viewMode === 'admin' && (
            <button
              onClick={() => onOpenAddMarketModal(tomorrowLog)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>অগ্রিম মেন্যু আপডেট</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
