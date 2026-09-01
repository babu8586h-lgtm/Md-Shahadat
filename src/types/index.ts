export type UserRole = 'admin' | 'member';

export interface MessMember {
  id: string;
  name: string;
  role: UserRole;
  phone: string;
  room: string;
  avatar: string;
  color: string;
}

export interface MarketLog {
  id: string;
  date: string; // ISO Date YYYY-MM-DD
  itemsBought: string; // e.g. "Chicken 1.5kg, Spinach 2 bunches, Potatoes, Green Chillies"
  menuCooked: string; // e.g. "Chicken Curry, Spinach Bhaji, Thick Lentil Dal & Rice"
  amount: number; // e.g. 350
  shopperName: string; // Who went to market
  recordedBy: string; // Admin ID
  isPlanned?: boolean; // True if it's a planned/future date entry
  notes?: string; // Additional info / receipts
  timestamp: string; // When recorded/updated
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
