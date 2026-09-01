import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  MessMember,
  MarketLog,
  PushNotification,
  MarketStats,
  UserRole,
  AppLanguage,
} from '../types';
import {
  toBengaliNumber,
  formatBengaliCurrency,
  formatBengaliDate,
} from '../utils/bengali';

interface MessContextType {
  // Language
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;

  // Members & Roles
  members: MessMember[];
  activeUserId: string;
  setActiveUserId: (id: string) => void;
  activeUser: MessMember;
  isAdmin: boolean;
  viewMode: 'admin' | 'member';
  setViewMode: (mode: 'admin' | 'member') => void;

  // Market Logs & Expenses
  marketLogs: MarketLog[];
  addOrUpdateMarketLog: (
    logData: Omit<MarketLog, 'id' | 'timestamp' | 'recordedBy'> & { id?: string }
  ) => void;
  handleAddExpense: (
    logData: Omit<MarketLog, 'id' | 'timestamp' | 'recordedBy'> & { id?: string }
  ) => void;
  deleteMarketLog: (id: string) => void;
  getLogByDate: (date: string) => MarketLog | undefined;

  // Selection & Filters
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedFilter: 'all' | 'today' | 'planned' | 'past';
  setSelectedFilter: (filter: 'all' | 'today' | 'planned' | 'past') => void;

  // Stats & Date Formatters
  marketStats: MarketStats;
  todayLog: MarketLog | undefined;
  tomorrowLog: MarketLog | undefined;
  currency: string;
  formatMoney: (amount: number) => string;
  formatDisplayDate: (dateStr: string) => ReturnType<typeof formatBengaliDate>;

  // Instant Push Notifications Engine
  notifications: PushNotification[];
  unreadNotificationCount: number;
  sendPushNotification: (
    title: string,
    body: string,
    type: PushNotification['type'],
    priority?: 'normal' | 'urgent',
    targetMemberId?: string,
    relatedDate?: string,
    amount?: number
  ) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotification: (id: string) => void;
  latestToast: PushNotification | null;
  dismissToast: () => void;

  // Browser Web Notification Permission
  webNotificationPermission: NotificationPermission | 'unsupported';
  requestNotificationPermission: () => Promise<void>;

  // Real-Time Sync Status
  isSyncing: boolean;
  lastSyncedTime: string;

  // Reset Data Helper
  resetToSampleData: () => void;
}

const MessContext = createContext<MessContextType | undefined>(undefined);

const INITIAL_MEMBERS: MessMember[] = [
  {
    id: 'user_rahim',
    name: 'Rahim Khan',
    nameBangla: 'রহিম খান (ম্যানেজার/অ্যাডমিন)',
    role: 'admin',
    phone: '+880 1711-234567',
    room: 'Flat 4B (Admin)',
    roomBangla: 'ফ্ল্যাট ৪বি (ম্যানেজার রুম)',
    avatar: '👨‍💼',
    color: '#0d9488',
  },
  {
    id: 'user_karim',
    name: 'Karim Ahmed',
    nameBangla: 'করিম আহমেদ',
    role: 'member',
    phone: '+880 1812-987654',
    room: 'Flat 4B (Bed 1)',
    roomBangla: 'ফ্ল্যাট ৪বি (রুম ১)',
    avatar: '👨‍🎓',
    color: '#3b82f6',
  },
  {
    id: 'user_tanvir',
    name: 'Tanvir Hasan',
    nameBangla: 'তানভীর হাসান',
    role: 'member',
    phone: '+880 1913-456789',
    room: 'Flat 4B (Bed 2)',
    roomBangla: 'ফ্ল্যাট ৪বি (রুম ২)',
    avatar: '👨‍🍳',
    color: '#8b5cf6',
  },
  {
    id: 'user_sakib',
    name: 'Sakib Al Mahmud',
    nameBangla: 'সাকিব আল মাহমুদ',
    role: 'member',
    phone: '+880 1614-112233',
    room: 'Flat 4B (Bed 3)',
    roomBangla: 'ফ্ল্যাট ৪বি (রুম ৩)',
    avatar: '👨‍💻',
    color: '#f59e0b',
  },
];

const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getOffsetDateString = (offsetDays: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const INITIAL_MARKET_LOGS: MarketLog[] = [
  {
    id: 'log_today',
    date: getTodayDateString(),
    itemsBought: '১.৫ কেজি ব্রয়লার মুরগি, ২ আঁটি তাজা লাল শাক, কাঁচা মরিচ, ২ কেজি গোল আলু ও ১ লিটার তেল',
    menuCooked: 'ঝাল মুরগির মাংসের ভুনা ঝোল, মচমচে লাল শাক ভাজি, মসুর ডাল ও গরম ভাত',
    amount: 400,
    shopperName: 'করিম আহমেদ',
    recordedBy: 'user_rahim',
    isPlanned: false,
    notes: 'কারওয়ান বাজার ভোরবেলা থেকে তাজা কেনা হয়েছে।',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'log_tomorrow',
    date: getOffsetDateString(1),
    itemsBought: '১২টি ফার্মের ডিম, ১ কেজি করলা, ৫০০ গ্রাম গরুর কিমা, ১ কেজি টমেটো',
    menuCooked: 'ডিম ও আলু কোরমা (দুপুর), করলা ভাজি ও স্পাইসি কিমা ভুনা (রাত)',
    amount: 520,
    shopperName: 'তানভীর হাসান (নির্ধারিত)',
    recordedBy: 'user_rahim',
    isPlanned: true,
    notes: 'আগামীকালের বাজার লিস্ট ও অগ্রিম খাবারের মেন্যু।',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'log_yesterday',
    date: getOffsetDateString(-1),
    itemsBought: '১.২ কেজি নদীর তাজা রুই মাছ, ১ কেজি বেগুন, খাঁটি সরিষার তেল, আদা-রসুন বাটা',
    menuCooked: 'আলু দিয়ে রুই মাছের পাতলা ঝোল, পোড়া বেগুন ভর্তা, লেবু ডাল ও ভাত',
    amount: 480,
    shopperName: 'রহিম খান',
    recordedBy: 'user_rahim',
    isPlanned: false,
    notes: 'মোহাম্মদপুর কৃষি মার্কেট থেকে তাজা মাছ।',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'log_past_sep1',
    date: getOffsetDateString(-2),
    itemsBought: 'ফার্মের ডিম ও গোল আলু, শুকনা মরিচ, সরিষার তেল',
    menuCooked: 'ডিম ভুনা, স্পাইসি আলু ভর্তা ও পাতলা মসুর ডাল',
    amount: 150,
    shopperName: 'সাকিব আল মাহমুদ',
    recordedBy: 'user_rahim',
    isPlanned: false,
    notes: 'দ্রুত সকালের বাজার ও রান্না।',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'log_past_3',
    date: getOffsetDateString(-3),
    itemsBought: '২ কেজি চিনিগুঁড়া চাল, ১ কেজি গরুর মাংস, বিরিয়ানি মশলা, শসা ও মিষ্টি দই',
    menuCooked: 'মেসের স্পেশাল গরুর তেহারি, বোরহানি ও ফ্রেশ শসা-লেবুর সালাদ',
    amount: 850,
    shopperName: 'রহিম খান',
    recordedBy: 'user_rahim',
    isPlanned: false,
    notes: 'সাপ্তাহিক স্পেশাল মেস ফিস্ট পার্টি।',
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'log_past_4',
    date: getOffsetDateString(-4),
    itemsBought: '১.৫ কেজি পাঙ্গাশ মাছ, কাঁচা পেঁপে, ডাল ১ কেজি, কাঁচা মরিচ',
    menuCooked: 'মচমচে পাঙ্গাশ মাছ ভাজি, কাঁচা পেঁপে ঘণ্ট ও টমেটো চাটনি',
    amount: 320,
    shopperName: 'করিম আহমেদ',
    recordedBy: 'user_rahim',
    isPlanned: false,
    notes: 'নরমাল ডেইল বাজার।',
    timestamp: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
];

const INITIAL_NOTIFICATIONS: PushNotification[] = [
  {
    id: 'notif_001',
    title: '📢 আজকের বাজারের আপডেট: খরচ ৳৪০০',
    body: 'আজকের বাজারে মুরগির মাংস ও লাল শাক কেনা হয়েছে (৳৪০০)। রান্নার মেন্যু: ঝাল মুরগির ঝোল ও লাল শাক ভাজি।',
    type: 'market_added',
    timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    read: false,
    targetMemberId: 'all',
    priority: 'urgent',
    relatedDate: getTodayDateString(),
    amount: 400,
  },
  {
    id: 'notif_002',
    title: '📋 আগামীকালের রান্নার মেন্যু প্ল্যান হয়েছে',
    body: 'আগামীকালের মেন্যু: ডিম-আলু কোরমা ও কিমা ভুনা (আনুমানিক ৳৫২০)। বাজার করবেন তানভীর।',
    type: 'menu_planned',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    read: false,
    targetMemberId: 'all',
    priority: 'normal',
    relatedDate: getOffsetDateString(1),
    amount: 520,
  },
  {
    id: 'notif_003',
    title: '📢 মেস ম্যানেজমেন্ট নোটিশ: ফ্ল্যাট ৪বি',
    body: 'প্রতিদিনের বাজার ও রান্নার মেন্যু রিয়েল-টাইমে আপডেট হচ্ছে। যেকোনো তারিখ সিলেক্ট করে বাজারের তালিকা ও রান্নার বিবরণ দেখুন।',
    type: 'admin_broadcast',
    timestamp: new Date(Date.now() - 3600000 * 10).toISOString(),
    read: true,
    targetMemberId: 'all',
    priority: 'normal',
  },
];

const STORAGE_KEYS = {
  MARKET_LOGS: 'bachelor_mess_market_logs_v4',
  MEMBERS: 'bachelor_mess_members_v4',
  NOTIFS: 'bachelor_mess_notifs_v4',
  ACTIVE_USER: 'bachelor_mess_active_user_v4',
  VIEW_MODE: 'bachelor_mess_view_mode_v4',
  LANGUAGE: 'bachelor_mess_lang_v4',
};

const SYNC_CHANNEL_NAME = 'bachelor_mess_sync_bus_v4';

export const MessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<AppLanguage>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
      return (saved as AppLanguage) || 'bn';
    } catch {
      return 'bn';
    }
  });

  const [members, setMembers] = useState<MessMember[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEMBERS);
      return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
    } catch {
      return INITIAL_MEMBERS;
    }
  });

  const [activeUserId, setActiveUserId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
      return saved || 'user_rahim';
    } catch {
      return 'user_rahim';
    }
  });

  const [viewMode, setViewMode] = useState<'admin' | 'member'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VIEW_MODE);
      return (saved as 'admin' | 'member') || 'admin';
    } catch {
      return 'admin';
    }
  });

  const [marketLogs, setMarketLogs] = useState<MarketLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MARKET_LOGS);
      return saved ? JSON.parse(saved) : INITIAL_MARKET_LOGS;
    } catch {
      return INITIAL_MARKET_LOGS;
    }
  });

  const [notifications, setNotifications] = useState<PushNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'today' | 'planned' | 'past'>('all');
  const [latestToast, setLatestToast] = useState<PushNotification | null>(null);

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('এখনই');

  const [webNotificationPermission, setWebNotificationPermission] = useState<
    NotificationPermission | 'unsupported'
  >(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });

  // Save changes locally
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MARKET_LOGS, JSON.stringify(marketLogs));
  }, [marketLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, activeUserId);
  }, [activeUserId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VIEW_MODE, viewMode);
  }, [viewMode]);

  // High Quality Web Audio Chime Trigger for Live Push Alerts
  const triggerAudioChime = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
      osc.frequency.exponentialRampToValueAtTime(987.77, ctx.currentTime + 0.12); // B5

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.38);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // Audio might be muted or constrained until gesture
    }
  }, []);

  // Native Browser Web Push Notification Engine
  const fireNativeWebPush = useCallback(
    (title: string, body: string, relatedDate?: string) => {
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        try {
          const notif = new Notification(title, {
            body,
            icon: 'https://cdn-icons-png.flaticon.com/512/3081/3081840.png',
            tag: `mess-update-${Date.now()}`,
          });

          notif.onclick = () => {
            window.focus();
            if (relatedDate) {
              setSelectedDate(relatedDate);
            }
            notif.close();
          };
        } catch {
          // Silent fallback
        }
      }
    },
    []
  );

  const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setWebNotificationPermission(perm);
        if (perm === 'granted') {
          fireNativeWebPush(
            '🔔 পুশ নোটিফিকেশন চালু হয়েছে',
            'মেসের বাজার ও রান্নার মেন্যু আপডেট সাথে সাথে আপনার স্ক্রিনে চলে আসবে।'
          );
        }
      } catch {
        // Handle error
      }
    }
  };

  // Cross-Tab / Cross-Window Real-Time Synchronization via BroadcastChannel & Storage Event
  useEffect(() => {
    let broadcastChannel: BroadcastChannel | null = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        broadcastChannel = new BroadcastChannel(SYNC_CHANNEL_NAME);
        broadcastChannel.onmessage = (event) => {
          const { type, payload } = event.data || {};
          if (type === 'MARKET_LOGS_SYNC' && payload) {
            setIsSyncing(true);
            setMarketLogs(payload.logs);
            if (payload.newNotif) {
              setNotifications((prev) => [payload.newNotif, ...prev]);
              setLatestToast(payload.newNotif);
              triggerAudioChime();
              fireNativeWebPush(payload.newNotif.title, payload.newNotif.body, payload.newNotif.relatedDate);
            }
            setTimeout(() => {
              setIsSyncing(false);
              setLastSyncedTime(new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }));
            }, 300);
          }
        };
      }
    } catch {
      // BroadcastChannel unavailable fallback
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.MARKET_LOGS && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setMarketLogs(parsed);
          setIsSyncing(true);
          setTimeout(() => setIsSyncing(false), 200);
        } catch {
          // Ignore
        }
      }
      if (e.key === STORAGE_KEYS.NOTIFS && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setNotifications(parsed);
        } catch {
          // Ignore
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      if (broadcastChannel) {
        broadcastChannel.close();
      }
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [triggerAudioChime, fireNativeWebPush]);

  // Broadcast to other tabs
  const broadcastSync = (logs: MarketLog[], newNotif?: PushNotification) => {
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const bc = new BroadcastChannel(SYNC_CHANNEL_NAME);
        bc.postMessage({
          type: 'MARKET_LOGS_SYNC',
          payload: { logs, newNotif },
        });
        bc.close();
      }
    } catch {
      // Ignore
    }
  };

  const activeUser = useMemo(() => {
    return members.find((m) => m.id === activeUserId) || members[0];
  }, [members, activeUserId]);

  const isAdmin = activeUser.role === 'admin';

  // Currency
  const currency = '৳';
  const formatMoney = useCallback(
    (amount: number) => {
      return formatBengaliCurrency(amount, language === 'bn');
    },
    [language]
  );

  const formatDisplayDate = useCallback((dateStr: string) => {
    return formatBengaliDate(dateStr);
  }, []);

  const todayDateStr = getTodayDateString();
  const tomorrowDateStr = getOffsetDateString(1);

  const todayLog = useMemo(() => {
    return marketLogs.find((l) => l.date === todayDateStr);
  }, [marketLogs, todayDateStr]);

  const tomorrowLog = useMemo(() => {
    return marketLogs.find((l) => l.date === tomorrowDateStr);
  }, [marketLogs, tomorrowDateStr]);

  const marketStats = useMemo<MarketStats>(() => {
    const actualLogs = marketLogs.filter((l) => !l.isPlanned);
    const plannedLogs = marketLogs.filter((l) => l.isPlanned);

    const totalMonthSpend = actualLogs.reduce((sum, log) => sum + (log.amount || 0), 0);
    const todaysSpend = todayLog?.amount || 0;
    const totalMarketDays = actualLogs.length;
    const dailyAverage = totalMarketDays > 0 ? Math.round(totalMonthSpend / totalMarketDays) : 0;

    return {
      totalMonthSpend,
      todaysSpend,
      dailyAverage,
      totalMarketDays,
      plannedCount: plannedLogs.length,
    };
  }, [marketLogs, todayLog]);

  // Dispatch Push Notification Alert
  const sendPushNotification = useCallback(
    (
      title: string,
      body: string,
      type: PushNotification['type'],
      priority: 'normal' | 'urgent' = 'normal',
      targetMemberId: string = 'all',
      relatedDate?: string,
      amount?: number
    ) => {
      const newNotif: PushNotification = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        title,
        body,
        type,
        timestamp: new Date().toISOString(),
        read: false,
        targetMemberId,
        priority,
        relatedDate,
        amount,
      };

      setNotifications((prev) => [newNotif, ...prev]);
      setLatestToast(newNotif);
      triggerAudioChime();
      fireNativeWebPush(title, body, relatedDate);

      return newNotif;
    },
    [triggerAudioChime, fireNativeWebPush]
  );

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const dismissToast = () => {
    setLatestToast(null);
  };

  // Add or Update Market Log in Bengali with Push Notification Trigger
  const addOrUpdateMarketLog = (
    logData: Omit<MarketLog, 'id' | 'timestamp' | 'recordedBy'> & { id?: string }
  ) => {
    setIsSyncing(true);
    const existingIndex = marketLogs.findIndex(
      (l) => l.id === logData.id || l.date === logData.date
    );

    const isPlanned = logData.isPlanned || false;
    const formattedDate = formatBengaliDate(logData.date);

    let updatedLogs: MarketLog[];
    let emittedNotif: PushNotification;

    if (existingIndex >= 0) {
      // Update entry
      const existingId = marketLogs[existingIndex].id;
      const updatedLog: MarketLog = {
        ...marketLogs[existingIndex],
        ...logData,
        id: existingId,
        recordedBy: activeUserId,
        timestamp: new Date().toISOString(),
      };

      updatedLogs = [...marketLogs];
      updatedLogs[existingIndex] = updatedLog;
      setMarketLogs(updatedLogs);

      const title = `📢 ${formattedDate.relativeLabel}র বাজারের আপডেট: ${formatBengaliCurrency(
        updatedLog.amount
      )}`;
      const body = `${updatedLog.shopperName} বাজার আপডেট করেছেন। কেনা হয়েছে: ${updatedLog.itemsBought}, মেন্যু: ${updatedLog.menuCooked}।`;

      emittedNotif = sendPushNotification(
        title,
        body,
        isPlanned ? 'menu_planned' : 'market_updated',
        'normal',
        'all',
        updatedLog.date,
        updatedLog.amount
      );
    } else {
      // Brand new entry
      const newLog: MarketLog = {
        ...logData,
        id: logData.id || `log_${Date.now()}`,
        recordedBy: activeUserId,
        timestamp: new Date().toISOString(),
      };

      updatedLogs = [newLog, ...marketLogs];
      setMarketLogs(updatedLogs);

      // Example requested: "📢 আজকের বাজারের আপডেট: আলু ও ডিম কেনা হয়েছে, খরচ: ৳২০০।"
      const title = formattedDate.isToday
        ? `📢 আজকের বাজারের আপডেট: খরচ ${formatBengaliCurrency(newLog.amount)}`
        : `🛒 ${formattedDate.monthDayBangla}র বাজার এন্ট্রি: ${formatBengaliCurrency(newLog.amount)}`;

      const body = `${newLog.itemsBought} কেনা হয়েছে, খরচ: ${formatBengaliCurrency(
        newLog.amount
      )}। রান্নার মেন্যু: "${newLog.menuCooked}"।`;

      emittedNotif = sendPushNotification(
        title,
        body,
        isPlanned ? 'menu_planned' : 'market_added',
        formattedDate.isToday ? 'urgent' : 'normal',
        'all',
        newLog.date,
        newLog.amount
      );
    }

    // Broadcast live sync
    broadcastSync(updatedLogs, emittedNotif);

    // Firebase Cloud Messaging (FCM) Push Notification Trigger simulation
    console.info('[FCM Push Notification Triggered]', {
      fcmPayload: {
        notification: {
          title: emittedNotif.title,
          body: emittedNotif.body,
        },
        data: {
          logId: existingIndex >= 0 ? marketLogs[existingIndex].id : logData.id,
          date: logData.date,
          amount: String(logData.amount),
          shopper: logData.shopperName,
          items: logData.itemsBought,
          menu: logData.menuCooked,
        },
        topic: 'flat4b_market_updates',
      },
    });

    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncedTime(new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }));
    }, 250);
  };

  // Alias for compatibility
  const handleAddExpense = addOrUpdateMarketLog;

  const deleteMarketLog = (id: string) => {
    const target = marketLogs.find((l) => l.id === id);
    if (!target) return;

    const newLogs = marketLogs.filter((l) => l.id !== id);
    setMarketLogs(newLogs);

    const dateInfo = formatBengaliDate(target.date);
    const notif = sendPushNotification(
      `🗑️ ${dateInfo.monthDayBangla}র বাজার তালিকা মুছে ফেলা হয়েছে`,
      `অ্যাডমিন ${dateInfo.fullBangla}র বাজার এন্ট্রি (${formatBengaliCurrency(target.amount)}) বাতিল করেছেন।`,
      'admin_broadcast',
      'normal',
      'all'
    );

    broadcastSync(newLogs, notif);
  };

  const getLogByDate = (dateStr: string) => {
    return marketLogs.find((l) => l.date === dateStr);
  };

  const resetToSampleData = () => {
    setMarketLogs(INITIAL_MARKET_LOGS);
    setMembers(INITIAL_MEMBERS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActiveUserId('user_rahim');
    setViewMode('admin');
    setSelectedDate(getTodayDateString());
    setSearchQuery('');
    setSelectedFilter('all');

    const notif = sendPushNotification(
      '🔄 প্রাথমিক ডেমো ডেটা রিস্টোর সম্পন্ন',
      'সেপ্টেম্বর মাসের সকল বাংলা বাজার ও রান্নার মেন্যু সফলভাবে রিলোড করা হয়েছে।',
      'admin_broadcast',
      'urgent',
      'all'
    );

    broadcastSync(INITIAL_MARKET_LOGS, notif);
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  return (
    <MessContext.Provider
      value={{
        language,
        setLanguage,
        members,
        activeUserId,
        setActiveUserId,
        activeUser,
        isAdmin,
        viewMode,
        setViewMode,
        marketLogs,
        addOrUpdateMarketLog,
        handleAddExpense,
        deleteMarketLog,
        getLogByDate,
        selectedDate,
        setSelectedDate,
        searchQuery,
        setSearchQuery,
        selectedFilter,
        setSelectedFilter,
        marketStats,
        todayLog,
        tomorrowLog,
        currency,
        formatMoney,
        formatDisplayDate,
        notifications,
        unreadNotificationCount,
        sendPushNotification,
        markNotificationAsRead,
        markAllNotificationsRead,
        clearNotification,
        latestToast,
        dismissToast,
        webNotificationPermission,
        requestNotificationPermission,
        isSyncing,
        lastSyncedTime,
        resetToSampleData,
      }}
    >
      {children}
    </MessContext.Provider>
  );
};

export const useMess = (): MessContextType => {
  const context = useContext(MessContext);
  if (!context) {
    throw new Error('useMess must be used within a MessProvider');
  }
  return context;
};
