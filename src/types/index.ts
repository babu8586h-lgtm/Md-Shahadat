export type UserRole = 'admin' | 'member';
export type AppLanguage = 'bn' | 'en';

export interface UserAccount {
  id: string;
  name: string;
  nameBangla: string;
  email: string;
  password?: string;
  role: UserRole;
  phone?: string;
  room?: string;
  roomBangla?: string;
  avatar?: string;
  color?: string;
  createdAt?: string;
}

export interface MessMember {
  id: string;
  name: string;
  nameBangla: string;
  role: UserRole;
  phone: string;
  room: string;
  roomBangla: string;
  avatar: string;
  color: string;
  email?: string;
}

export interface MarketLog {
  id: string;
  date: string; // ISO Date YYYY-MM-DD
  itemsBought: string; // e.g. "১.৫ কেজি মুরগি, ২ আঁটি লাল শাক, আলু ও কাঁচা মরিচ"
  menuCooked: string; // e.g. "মুরগির মাংসের ভুনা ঝোল, লাল শাক ভাজি, মসুর ডাল ও ভাত"
  amount: number; // e.g. 350 (formatted as ৳৩৫০)
  shopperName: string; // Who went to market (e.g. "করিম আহমেদ")
  recordedBy: string; // Admin ID
  isPlanned?: boolean; // True if it's a planned/future date entry
  notes?: string; // Additional info / receipts in Bengali or English
  timestamp: string; // ISO string when recorded/updated
}

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  type: 'market_added' | 'market_updated' | 'admin_broadcast' | 'menu_planned';
  timestamp: string;
  read: boolean;
  targetMemberId: 'all' | string;
  priority: 'normal' | 'urgent';
  relatedDate?: string;
  amount?: number;
}

export interface MarketStats {
  totalMonthSpend: number;
  todaysSpend: number;
  dailyAverage: number;
  totalMarketDays: number;
  plannedCount: number;
}

