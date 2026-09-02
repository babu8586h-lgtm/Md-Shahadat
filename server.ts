import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "db.json");

// Middleware
app.use(express.json({ limit: "10mb" }));

// Helper functions for initial relative date generation
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

// Initial state template if db.json is missing
const getInitialState = () => ({
  userAccounts: [
    {
      id: 'user_admin_babu',
      name: 'Shahadat Hossain',
      nameBangla: 'শাহাদাত হোসেন',
      email: 'babu8586h@gmail.com',
      password: 'admin1234',
      role: 'admin',
      phone: '+880 1711-000001',
      room: 'Flat 4B (Manager)',
      roomBangla: 'ফ্ল্যাট ৪বি (ম্যানেজার রুম)',
      avatar: '👨‍💼',
      color: '#0d9488',
      createdAt: '2026-09-01T00:00:00.000Z',
    },
    {
      id: 'user_tamim',
      name: 'Mohammad Tamim',
      nameBangla: 'মোহাম্মদ তামিম',
      email: 'tamim@gmail.com',
      password: 'password123',
      role: 'member',
      phone: '+880 1711-000002',
      room: 'Flat 4B (Bed 1)',
      roomBangla: 'ফ্ল্যাট ৪বি (রুম ১)',
      avatar: '👨‍🎓',
      color: '#3b82f6',
      createdAt: '2026-09-01T00:00:00.000Z',
    },
    {
      id: 'user_shifat',
      name: 'Mohammad Shifat',
      nameBangla: 'মোহাম্মদ শিফাত',
      email: 'shifat@gmail.com',
      password: 'password123',
      role: 'member',
      phone: '+880 1711-000003',
      room: 'Flat 4B (Bed 2)',
      roomBangla: 'ফ্ল্যাট ৪বি (রুম ২)',
      avatar: '👨‍🍳',
      color: '#8b5cf6',
      createdAt: '2026-09-01T00:00:00.000Z',
    },
    {
      id: 'user_arafat',
      name: 'Mohammad Arafat',
      nameBangla: 'মোহাম্মদ আরাফাত',
      email: 'arafat@gmail.com',
      password: 'password123',
      role: 'member',
      phone: '+880 1711-000004',
      room: 'Flat 4B (Bed 3)',
      roomBangla: 'ফ্ল্যাট ৪বি (রুম ৩)',
      avatar: '🧑‍💻',
      color: '#f59e0b',
      createdAt: '2026-09-01T00:00:00.000Z',
    },
  ],
  members: [
    {
      id: 'user_admin_babu',
      name: 'Shahadat Hossain',
      nameBangla: 'শাহাদাত হোসেন',
      role: 'admin',
      email: 'babu8586h@gmail.com',
      phone: '+880 1711-000001',
      room: 'Flat 4B (Admin)',
      roomBangla: 'ফ্ল্যাট ৪বি (ম্যানেজার রুম)',
      avatar: '👨‍💼',
      color: '#0d9488',
    },
    {
      id: 'user_tamim',
      name: 'Mohammad Tamim',
      nameBangla: 'মোহাম্মদ তামিম',
      role: 'member',
      email: 'tamim@gmail.com',
      phone: '+880 1711-000002',
      room: 'Flat 4B (Bed 1)',
      roomBangla: 'ফ্ল্যাট ৪বি (রুম ১)',
      avatar: '👨‍🎓',
      color: '#3b82f6',
    },
    {
      id: 'user_shifat',
      name: 'Mohammad Shifat',
      nameBangla: 'মোহাম্মদ শিফাত',
      role: 'member',
      email: 'shifat@gmail.com',
      phone: '+880 1711-000003',
      room: 'Flat 4B (Bed 2)',
      roomBangla: 'ফ্ল্যাট ৪বি (রুম ২)',
      avatar: '👨‍🍳',
      color: '#8b5cf6',
    },
    {
      id: 'user_arafat',
      name: 'Mohammad Arafat',
      nameBangla: 'মোহাম্মদ আরাফাত',
      role: 'member',
      email: 'arafat@gmail.com',
      phone: '+880 1711-000004',
      room: 'Flat 4B (Bed 3)',
      roomBangla: 'ফ্ল্যাট ৪বি (রুম ৩)',
      avatar: '🧑‍💻',
      color: '#f59e0b',
    },
  ],
  marketLogs: [
    {
      id: 'log_2026_09_01',
      date: getTodayDateString(),
      itemsBought: '১.৫ কেজি দেশি মুরগি, ২ আঁটি লাল শাক, ১ কেজি আলু ও কাঁচা মরিচ',
      menuCooked: 'মুরগির মাংসের ভুনা ঝোল, লাল শাক ভাজি, মসুর ডাল ও গরম ভাত',
      amount: 350,
      shopperName: 'মোহাম্মদ তামিম',
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
      shopperName: 'মোহাম্মদ শিফাত',
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
      shopperName: 'মোহাম্মদ আরাফাত',
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
      shopperName: 'শাহাদাত হোসেন',
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
      shopperName: 'মোহাম্মদ তামিম',
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
      shopperName: 'মোহাম্মদ শিফাত',
      recordedBy: 'user_admin_babu',
      isPlanned: true,
      notes: 'সকালে দ্রুত বাজার করা হবে। শিফাতের ডিউটি।',
      timestamp: new Date().toISOString(),
    },
  ],
  setupExpenses: [
    {
      id: 'setup_001',
      itemName: 'ডাবল বার্নার গ্যাসের চুলা ও সিলিন্ডার সেটআপ',
      purchasedBy: 'শাহাদাত হোসেন',
      amount: 4500,
      date: '2026-08-25',
      notes: 'অটো ইগনিশন ২ বার্নার চুলা, রেগুলেটর ও প্রিমিয়াম পাইপ।',
      createdAt: '2026-08-25T10:00:00.000Z',
    },
    {
      id: 'setup_002',
      itemName: 'বিআরবি সিলিং ফ্যান (৫৬ ইঞ্চি)',
      purchasedBy: 'মোহাম্মদ তামিম',
      amount: 2950,
      date: '2026-08-26',
      notes: 'ড্রয়িং/লিভিং রুমের জন্য এনার্জি সেভিং ফ্যান।',
      createdAt: '2026-08-26T12:00:00.000Z',
    },
    {
      id: 'setup_003',
      itemName: 'পানির ফিল্টার ও জার স্ট্যান্ড',
      purchasedBy: 'মোহাম্মদ শিফাত',
      amount: 1650,
      date: '2026-08-27',
      notes: 'খাওয়ার পানির ফিল্টার ও মেটাল স্ট্যান্ড।',
      createdAt: '2026-08-27T15:00:00.000Z',
    },
    {
      id: 'setup_004',
      itemName: 'টিপি-লিংক ডুয়েল ব্যান্ড ওয়াইফাই রাউটার',
      purchasedBy: 'মোহাম্মদ আরাফাত',
      amount: 2400,
      date: '2026-08-28',
      notes: 'মেসের হাইস্পিড ইন্টারнеটের জন্য গিগাবিট রাউটার।',
      createdAt: '2026-08-28T16:30:00.000Z',
    },
    {
      id: 'setup_005',
      itemName: 'বড় রাইস কুকার (২.৮ লিটার) ও রান্নার বড় কড়াই',
      purchasedBy: 'যৌথ তহবিল',
      amount: 3200,
      date: '2026-08-29',
      notes: 'মেসের ৪ জনের নিয়মিত রান্না ও ভাতের জন্য।',
      createdAt: '2026-08-29T18:00:00.000Z',
    },
  ],
  notifications: [
    {
      id: 'notif_001',
      title: '📢 আজকের বাজার আপডেট: খরচ ৳৩৫০',
      body: 'আজকের বাজারের আপডেট: মোহাম্মদ তামিম ১.৫ কেজি মুরগি ও লাল শাক কিনেছেন, মোট খরচ: ৳৩৫০। মেন্যু: মুরগির মাংসের ভুনা ঝোল ও ডাল।',
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
      body: 'আগামীকালের মেন্যু: চালকুমড়া দিয়ে মাছের পাতলা ঝোল ও মসুর ডাল। বাজার ডিউটি: মোহাম্মদ শিফাত।',
      type: 'menu_planned',
      timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
      read: false,
      targetMemberId: 'all',
      priority: 'normal',
      relatedDate: getOffsetDateString(1),
      amount: 300,
    },
  ]
});

// Load database state
const loadState = () => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading database file, loading fallback:", error);
  }
  const initialState = getInitialState();
  saveState(initialState);
  return initialState;
};

// Save database state
const saveState = (state: any) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving database file:", error);
  }
};

// API Endpoint to get the complete real-time application state
app.get("/api/state", (req, res) => {
  const state = loadState();
  res.json(state);
});

// API Endpoint to write/update the complete state (e.g. from any connected client)
app.post("/api/state", (req, res) => {
  const newState = req.body;
  if (!newState) {
    return res.status(400).json({ error: "State body cannot be empty" });
  }

  const currentState = loadState();
  const mergedState = {
    ...currentState,
    ...newState,
  };

  saveState(mergedState);
  res.json(mergedState);
});

// Specific API Endpoint to handle state reset to sample data
app.post("/api/reset", (req, res) => {
  const resetState = getInitialState();
  saveState(resetState);
  res.json(resetState);
});

// Integrate Vite Dev Server in Development
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Bachelor Mess Server] running at http://localhost:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Error starting express-vite server:", err);
});
