import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  MessMember,
  MarketLog,
  PushNotification,
  MarketStats,
  UserRole,
  AppLanguage,
  UserAccount,
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

  // Authentication & Current User Session
  currentUser: UserAccount | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => { success: boolean; message: string };
  signup: (data: {
    name: string;
    nameBangla?: string;
    email: string;
    password: string;
    roomBangla?: string;
    phone?: string;
  }) => { success: boolean; message: string };
  logout: () => void;
  userAccounts: UserAccount[];

  // Members & Active Role
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
  ) => PushNotification;
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

// Internal secret constant for verified super admin - NEVER displayed to public UI
const SUPER_ADMIN_EMAIL = 'babu8586h@gmail.com';

const INITIAL_ACCOUNTS: UserAccount[] = [
  {
    id: 'user_admin_babu',
    name: 'Rahim Khan (Admin)',
    nameBangla: 'রহিম খান (ম্যানেজার)',
    email: 'babu8586h@gmail.com',
    password: 'password123',
    role: 'admin',
    phone: '+880 1711-234567',
    room: 'Flat 4B (Manager)',
    roomBangla: 'ফ্ল্যাট ৪বি (ম্যানেজার রুম)',
    avatar: '👨‍💼',
    color: '#0d9488',
    createdAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'user_karim',
    name: 'Karim Ahmed',
    nameBangla: 'করিম আহমেদ',
    email: 'karim@gmail.com',
    password: 'password123',
    role: 'member',
    phone: '+880 1812-987654',
    room: 'Flat 4B (Bed 1)',
    roomBangla: 'ফ্ল্যাট ৪বি (রুম ১)',
    avatar: '👨‍🎓',
    color: '#3b82f6',
    createdAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'user_tanvir',
    name: 'Tanvir Hasan',
    nameBangla: 'তানভীর হাসান',
    email: 'tanvir@gmail.com',
    password: 'password123',
    role: 'member',
    phone: '+880 1913-456789',
    room: 'Flat 4B (Bed 2)',
    roomBangla: 'ফ্ল্যাট ৪বি (রুম ২)',
    avatar: '👨‍🍳',
    color: '#8b5cf6',
    createdAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'user_sakib',
    name: 'Sakib Al Mahmud',
    nameBangla: 'সাকিব আল মাহমুদ',
    email: 'sakib@gmail.com',
    password: 'password123',
    role: 'member',
    phone: '+880 1614-112233',
    room: 'Flat 4B (Bed 3)',
    roomBangla: 'ফ্ল্যাট ৪বি (রুম ৩)',
    avatar: '🧑‍💻',
    color: '#f59e0b',
    createdAt: '2026-09-01T00:00:00.000Z',
  },
];

const INITIAL_MEMBERS: MessMember[] = [
  {
    id: 'user_admin_babu',
    name: 'Rahim Khan',
    nameBangla: 'রহিম খান (ম্যানেজার)',
    role: 'admin',
    email: 'babu8586h@gmail.com',
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
    email: 'karim@gmail.com',
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
    email: 'tanvir@gmail.com',
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
    email: 'sakib@gmail.com',
    phone: '+880 1614-112233',
    room: 'Flat 4B (Bed 3)',
    roomBangla: 'ফ্ল্যাট ৪বি (রুম ৩)',
    avatar: '🧑‍💻',
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
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const INITIAL_MARKET_LOGS: MarketLog[] = [
  {
    id: 'log_2026_09_01',
    date: getTodayDateString(),
    itemsBought: '১.৫ কেজি দেশি মুরগি, ২ আঁটি লাল শাক, ১ কেজি আলু ও কাঁচা মরিচ',
    menuCooked: 'মুরগির মাংসের ভুনা ঝোল, লাল শাক ভাজি, মসুর ডাল ও গরম ভাত',
    amount: 350,
    shopperName: 'করিম আহমেদ',
    recordedBy: 'user_admin_babu',
    isPlanned: false,
    notes: 'কারওয়ান বাজার থেকে কেনা হয়েছে। ফ্রেশ দেশি মুরগি।',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'log_2026_08_31',
    date: getOffsetDateString(-1),
    itemsBought: '১ কেজি রুই মাছ, ৫০০ গ্রাম বেগুন, টমেটো ও পেঁয়াজ',
    menuCooked: 'বেগুন দিয়ে রুই মাছের ঝোল, টমেটো ভর্তা, পাতলা ডাল ও ভাত',
    amount: 420,
    shopperName: 'তানভীর হাসান',
    recordedBy: 'user_admin_babu',
    isPlanned: false,
    notes: 'রুই মাছ কেজি ৩২০ টাকা ও সবজি ১০০ টাকা।',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'log_2026_08_30',
    date: getOffsetDateString(-2),
    itemsBought: '১ ডজন দেশি হাঁসের ডিম, ১ কেজি মিষ্টি কুমড়া, শসা ও লেবু',
    menuCooked: 'হাঁসের ডিম ভুনা, মিষ্টি কুমড়া ভাজি, ঘন ডাল ও সালাদ',
    amount: 220,
    shopperName: 'সাকিব আল মাহমুদ',
    recordedBy: 'user_admin_babu',
    isPlanned: false,
    notes: 'ডিম ১৬০ টাকা ও বাকি সবজি ৬০ টাকা।',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'log_2026_08_29',
    date: getOffsetDateString(-3),
    itemsBought: '১ কেজি গরুর মাংস, ১ কেজি পোলাওয়ের চাল, সালাদ ও মশলা',
    menuCooked: 'শুক্রবার স্পেশাল: বিফ তেহারি, ঝাল পেঁয়াজের সালাদ ও বোরহানি',
    amount: 980,
    shopperName: 'রহিম খান (ম্যানেজার)',
    recordedBy: 'user_admin_babu',
    isPlanned: false,
    notes: 'শুক্রবার স্পেশাল মিলের খরচ। সবাই মিলে উৎসবমুখর খাওয়া।',
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'log_2026_08_28',
    date: getOffsetDateString(-4),
    itemsBought: '১ কেজি কাচকি মাছ, কাঁচকলা, ডাটা শাক ও ধনেপাতা',
    menuCooked: 'কাচকি মাছের চচ্চড়ি, কাঁচকলা দিয়ে মসুর ডাল ও ডাটা শাক ভাজি',
    amount: 280,
    shopperName: 'করিম আহমেদ',
    recordedBy: 'user_admin_babu',
    isPlanned: false,
    notes: 'কাচকি মাছ খুবই টাটকা ছিল।',
    timestamp: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'log_2026_09_02_plan',
    date: getOffsetDateString(1),
    itemsBought: '১.২ কেজি পাঙ্গাশ/তেলাপিয়া মাছ, চালকুমড়া ও আলু (পরিকল্পিত)',
    menuCooked: 'আগামীকালের মেন্যু: চালকুমড়া দিয়ে মাছের পাতলা ঝোল ও ডাল',
    amount: 300,
    shopperName: 'তানভীর হাসান',
    recordedBy: 'user_admin_babu',
    isPlanned: true,
    notes: 'সকালে দ্রুত বাজার করা হবে। তানভীরের ডিউটি।',
    timestamp: new Date().toISOString(),
  },
];

const INITIAL_NOTIFICATIONS: PushNotification[] = [
  {
    id: 'notif_001',
    title: '📢 আজকের বাজার আপডেট: খরচ ৳৩৫০',
    body: 'আজকের বাজারের আপডেট: করিম আহমেদ ১.৫ কেজি মুরগি ও লাল শাক কিনেছেন, মোট খরচ: ৳৩৫০। মেন্যু: মুরগির মাংসের ভুনা ঝোল ও ডাল।',
    type: 'market_added',
    timestamp: new Date().toISOString(),
    read: false,
    targetMemberId: 'all',
    priority: 'urgent',
    relatedDate: getTodayDateString(),
    amount: 350,
  },
  {
    id: 'notif_002',
    title: '🛒 আগামীকালের রান্নার মেন্যু প্ল্যান',
    body: 'আগামীকালের মেন্যু: চালকুমড়া দিয়ে মাছের পাতলা ঝোল ও মসুর ডাল। বাজার ডিউটি: তানভীর হাসান।',
    type: 'menu_planned',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    read: false,
    targetMemberId: 'all',
    priority: 'normal',
    relatedDate: getOffsetDateString(1),
    amount: 300,
  },
];

const STORAGE_KEYS = {
  ACCOUNTS: 'bachelor_mess_accounts_v6',
  CURRENT_USER: 'bachelor_mess_current_user_v6',
  MARKET_LOGS: 'bachelor_mess_market_logs_v6',
  MEMBERS: 'bachelor_mess_members_v6',
  NOTIFS: 'bachelor_mess_notifs_v6',
  LANGUAGE: 'bachelor_mess_lang_v6',
};

const SYNC_CHANNEL_NAME = 'bachelor_mess_sync_bus_v6';

export const MessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. User Accounts State
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      if (saved) {
        const parsed: UserAccount[] = JSON.parse(saved);
        // Ensure admin account always exists in list
        const hasAdmin = parsed.some((a) => a.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase());
        if (!hasAdmin) {
          return [...INITIAL_ACCOUNTS, ...parsed];
        }
        return parsed;
      }
      return INITIAL_ACCOUNTS;
    } catch {
      return INITIAL_ACCOUNTS;
    }
  });

  // 2. Current Logged In User State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (saved) {
        const user: UserAccount = JSON.parse(saved);
        // Recalculate strict role based on email
        const isSuperAdmin = user.email.trim().toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
        return {
          ...user,
          role: isSuperAdmin ? 'admin' : 'member',
        };
      }
      return null;
    } catch {
      return null;
    }
  });

  const isLoggedIn = currentUser !== null;
  const isAdmin = currentUser !== null && currentUser.email.trim().toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

  // Strict viewMode: strictly 'admin' only if isAdmin is true, else 'member'
  const [viewModeState, setViewModeState] = useState<'admin' | 'member'>('member');
  const viewMode: 'admin' | 'member' = isAdmin ? (viewModeState === 'member' ? 'member' : 'admin') : 'member';

  const setViewMode = useCallback(
    (mode: 'admin' | 'member') => {
      if (mode === 'admin') {
        if (!isAdmin) return; // Block unauthorized elevation
        setViewModeState('admin');
      } else {
        setViewModeState('member');
      }
    },
    [isAdmin]
  );

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
    return currentUser?.id || 'user_admin_babu';
  });

  // Keep active user synced with currentUser
  useEffect(() => {
    if (currentUser) {
      setActiveUserId(currentUser.id);
      if (currentUser.email.trim().toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
        setViewModeState('admin');
      } else {
        setViewModeState('member');
      }
    }
  }, [currentUser]);

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

  // Local Storage Synchronizations
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(userAccounts));
  }, [userAccounts]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

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

  // Audio Chime Synthesis (Web Audio API)
  const triggerAudioChime = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5

      osc2.frequency.setValueAtTime(440, now);
      osc2.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // E5

      gainNode.gain.setValueAtTime(0.2, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.6);
      osc2.stop(now + 0.6);
    } catch {
      // Ignore if autoplay restricted
    }
  }, []);

  // Request browser web push permission
  const requestNotificationPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setWebNotificationPermission('unsupported');
      return;
    }
    try {
      const perm = await Notification.requestPermission();
      setWebNotificationPermission(perm);
    } catch {
      setWebNotificationPermission('denied');
    }
  };

  // Trigger Native Web Notification if supported
  const fireNativeWebPush = useCallback((title: string, body: string) => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
        });
      } catch {
        // Ignore iframe policy block
      }
    }
  }, []);

  // Broadcast to other open tabs
  const broadcastSync = useCallback((newLogs: MarketLog[], newNotif?: PushNotification) => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
        channel.postMessage({
          type: 'MESS_SYNC_UPDATE',
          logs: newLogs,
          notification: newNotif,
          timestamp: Date.now(),
        });
        channel.close();
      } catch {
        // Fallback silently
      }
    }
  }, []);

  // Listen for Live Sync across tabs
  useEffect(() => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return;
    try {
      const channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
      channel.onmessage = (event) => {
        if (event.data?.type === 'MESS_SYNC_UPDATE') {
          if (event.data.logs) {
            setMarketLogs(event.data.logs);
          }
          if (event.data.notification) {
            setNotifications((prev) => [event.data.notification, ...prev]);
            setLatestToast(event.data.notification);
            triggerAudioChime();
          }
          setIsSyncing(true);
          setLastSyncedTime(new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }));
          setTimeout(() => setIsSyncing(false), 500);
        }
      };
      return () => {
        channel.close();
      };
    } catch {
      // Ignored
    }
  }, [triggerAudioChime]);

  // Send Push Notification
  const sendPushNotification = useCallback(
    (
      title: string,
      body: string,
      type: PushNotification['type'] = 'admin_broadcast',
      priority: 'normal' | 'urgent' = 'normal',
      targetMemberId: string = 'all',
      relatedDate?: string,
      amount?: number
    ): PushNotification => {
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
      fireNativeWebPush(title, body);

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

  // 3. Authentication: Login Function
  const login = useCallback(
    (email: string, password: string) => {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();

      const account = userAccounts.find(
        (a) => a.email.trim().toLowerCase() === cleanEmail
      );

      if (!account) {
        return {
          success: false,
          message: 'এই ইমেইলে কোনো একাউন্ট পাওয়া যায়নি! নতুন একাউন্ট তৈরি করতে সাইন-আপ ট্যাবে যান।',
        };
      }

      if (account.password && account.password !== cleanPassword) {
        return {
          success: false,
          message: 'ভুল পাসওয়ার্ড! অনুগ্রহ করে সঠিক পাসওয়ার্ড দিন।',
        };
      }

      const isSuperAdmin = cleanEmail === SUPER_ADMIN_EMAIL.toLowerCase();
      const authenticatedUser: UserAccount = {
        ...account,
        role: isSuperAdmin ? 'admin' : 'member',
      };

      setCurrentUser(authenticatedUser);
      setActiveUserId(authenticatedUser.id);
      setViewModeState(isSuperAdmin ? 'admin' : 'member');

      sendPushNotification(
        isSuperAdmin ? '👑 মেস ম্যানেজার লগইন' : '👋 মেস মেম্বার লগইন',
        isSuperAdmin
          ? 'মেস ম্যানেজার সফলভাবে লগইন করেছেন। বাজার ও রান্নার পূর্ণ এডিটিং মোড সচল।'
          : `${authenticatedUser.nameBangla} মেস ট্র্যাকার সিস্টেমে সাইন-ইন করেছেন।`,
        'admin_broadcast',
        isSuperAdmin ? 'urgent' : 'normal',
        'all'
      );

      return {
        success: true,
        message: `স্বাগতম ${authenticatedUser.nameBangla}! আপনি সফলভাবে লগইন করেছেন।`,
      };
    },
    [userAccounts, sendPushNotification]
  );

  // 4. Authentication: Sign Up Function
  const signup = useCallback(
    (data: {
      name: string;
      nameBangla?: string;
      email: string;
      password: string;
      roomBangla?: string;
      phone?: string;
    }) => {
      const cleanEmail = data.email.trim().toLowerCase();
      const cleanPassword = data.password.trim();

      if (!cleanEmail || !cleanPassword) {
        return {
          success: false,
          message: 'ইমেইল ও পাসওয়ার্ড দেওয়া আবশ্যক।',
        };
      }

      const exists = userAccounts.some((a) => a.email.trim().toLowerCase() === cleanEmail);
      if (exists) {
        return {
          success: false,
          message: 'এই ইমেইলটি দিয়ে ইতিমধ্যে একাউন্ট খোলা আছে। অনুগ্রহ করে লগইন করুন।',
        };
      }

      const isSuperAdmin = cleanEmail === SUPER_ADMIN_EMAIL.toLowerCase();
      const assignedRole: UserRole = isSuperAdmin ? 'admin' : 'member';
      const nameBangla = data.nameBangla || data.name;

      const newAccount: UserAccount = {
        id: `user_${Date.now()}`,
        name: data.name,
        nameBangla,
        email: cleanEmail,
        password: cleanPassword,
        role: assignedRole,
        phone: data.phone || '+880 1700-000000',
        roomBangla: data.roomBangla || 'ফ্ল্যাট ৪বি',
        avatar: isSuperAdmin ? '👨‍💼' : '👨‍🎓',
        color: isSuperAdmin ? '#0d9488' : '#3b82f6',
        createdAt: new Date().toISOString(),
      };

      const newMember: MessMember = {
        id: newAccount.id,
        name: newAccount.name,
        nameBangla: newAccount.nameBangla,
        role: assignedRole,
        email: cleanEmail,
        phone: newAccount.phone || '',
        room: 'Flat 4B',
        roomBangla: newAccount.roomBangla || 'ফ্ল্যাট ৪বি',
        avatar: newAccount.avatar || '👨‍🎓',
        color: newAccount.color || '#3b82f6',
      };

      const updatedAccounts = [...userAccounts, newAccount];
      const updatedMembers = [...members, newMember];

      setUserAccounts(updatedAccounts);
      setMembers(updatedMembers);
      setCurrentUser(newAccount);
      setActiveUserId(newAccount.id);
      setViewModeState(isSuperAdmin ? 'admin' : 'member');

      sendPushNotification(
        '🎉 নতুন মেম্বার যুক্ত হয়েছেন',
        `${nameBangla} ব্যাচেলর মেস ফ্ল্যাট ৪বি সিস্টেমে নতুন একাউন্ট খুলেছেন।`,
        'admin_broadcast',
        'normal',
        'all'
      );

      return {
        success: true,
        message: `অভিনন্দন ${nameBangla}! আপনার একাউন্ট সফলভাবে তৈরি হয়েছে।`,
      };
    },
    [userAccounts, members, sendPushNotification]
  );

  // 5. Authentication: Logout Function
  const logout = useCallback(() => {
    setCurrentUser(null);
    setViewModeState('member');
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);

    sendPushNotification(
      '🔒 সেশন সমাপ্ত',
      'ইউজার সফলভাবে মেস ট্র্যাকার থেকে লগআউট করেছেন।',
      'admin_broadcast',
      'normal',
      'all'
    );
  }, [sendPushNotification]);

  // Add or Update Market Log in Bengali with Push Notification Trigger (Admin-Guarded)
  const addOrUpdateMarketLog = (
    logData: Omit<MarketLog, 'id' | 'timestamp' | 'recordedBy'> & { id?: string }
  ) => {
    if (!isAdmin) {
      sendPushNotification(
        '⚠️ এন্ট্রি ব্যর্থ: অনুমতি নেই',
        'শুধুমাত্র মেস ম্যানেজার বাজার খরচ এন্ট্রি বা এডিট করতে পারবেন।',
        'admin_broadcast',
        'urgent',
        'all'
      );
      return;
    }

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

    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncedTime(new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }));
    }, 250);
  };

  const handleAddExpense = addOrUpdateMarketLog;

  const deleteMarketLog = (id: string) => {
    if (!isAdmin) {
      return;
    }

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
    if (!isAdmin) {
      return;
    }

    setMarketLogs(INITIAL_MARKET_LOGS);
    setMembers(INITIAL_MEMBERS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActiveUserId('user_admin_babu');
    setViewModeState('admin');
    setSelectedDate(getTodayDateString());
    setSearchQuery('');
    setSelectedFilter('all');

    const notif = sendPushNotification(
      '🔄 প্রাথমিক ডেমো ডেটা রিস্টোর সম্পন্ন',
      'মেসের সকল বাংলা বাজার ও রান্নার মেন্যু সফলভাবে রিলোড করা হয়েছে।',
      'admin_broadcast',
      'urgent',
      'all'
    );

    broadcastSync(INITIAL_MARKET_LOGS, notif);
  };

  // Active user resolver
  const activeUser = useMemo(() => {
    const found = members.find((m) => m.id === activeUserId);
    if (found) return found;
    return (
      members[0] || {
        id: 'fallback_user',
        name: 'User',
        nameBangla: 'ব্যবহারকারী',
        role: 'member',
        phone: '',
        room: '',
        roomBangla: '',
        avatar: '👤',
        color: '#64748b',
      }
    );
  }, [members, activeUserId]);

  // Statistics calculation
  const marketStats = useMemo<MarketStats>(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const todayStr = getTodayDateString();

    let totalMonthSpend = 0;
    let todaysSpend = 0;
    let pastMarketDaysCount = 0;
    let plannedCount = 0;

    marketLogs.forEach((log) => {
      const logDate = new Date(log.date);
      if (log.isPlanned) {
        plannedCount += 1;
        return;
      }

      if (log.date === todayStr) {
        todaysSpend += log.amount;
      }

      if (logDate.getMonth() === currentMonth && logDate.getFullYear() === currentYear) {
        totalMonthSpend += log.amount;
        pastMarketDaysCount += 1;
      }
    });

    const dailyAverage = pastMarketDaysCount > 0 ? Math.round(totalMonthSpend / pastMarketDaysCount) : 0;

    return {
      totalMonthSpend,
      todaysSpend,
      dailyAverage,
      totalMarketDays: pastMarketDaysCount,
      plannedCount,
    };
  }, [marketLogs]);

  const todayStr = getTodayDateString();
  const tomorrowStr = getOffsetDateString(1);

  const todayLog = useMemo(() => {
    return marketLogs.find((l) => l.date === todayStr && !l.isPlanned);
  }, [marketLogs, todayStr]);

  const tomorrowLog = useMemo(() => {
    return marketLogs.find((l) => l.date === tomorrowStr);
  }, [marketLogs, tomorrowStr]);

  const formatMoney = useCallback((amount: number) => {
    return formatBengaliCurrency(amount);
  }, []);

  const formatDisplayDate = useCallback((dateStr: string) => {
    return formatBengaliDate(dateStr);
  }, []);

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  return (
    <MessContext.Provider
      value={{
        language,
        setLanguage,
        currentUser,
        isLoggedIn,
        login,
        signup,
        logout,
        userAccounts,
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
        currency: '৳',
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
