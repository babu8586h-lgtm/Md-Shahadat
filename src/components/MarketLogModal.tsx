import React, { useState, useEffect } from 'react';
import { useMess } from '../context/MessContext';
import { MarketLog } from '../types';
import {
  X,
  PlusCircle,
  ShoppingBag,
  UtensilsCrossed,
  Calendar,
  DollarSign,
  User,
  Sparkles,
  FileText,
  Clock,
} from 'lucide-react';

interface MarketLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLog?: MarketLog | null;
  targetDate?: string;
}

export const MarketLogModal: React.FC<MarketLogModalProps> = ({
  isOpen,
  onClose,
  initialLog,
  targetDate,
}) => {
  const { addOrUpdateMarketLog, members, formatMoney, formatDisplayDate } = useMess();

  const [date, setDate] = useState(
    targetDate || (initialLog ? initialLog.date : new Date().toISOString().split('T')[0])
  );
  const [itemsBought, setItemsBought] = useState(initialLog?.itemsBought || '');
  const [menuCooked, setMenuCooked] = useState(initialLog?.menuCooked || '');
  const [amount, setAmount] = useState(initialLog ? String(initialLog.amount) : '');
  const [shopperName, setShopperName] = useState(initialLog?.shopperName || 'Rahim Khan');
  const [isPlanned, setIsPlanned] = useState(initialLog?.isPlanned || false);
  const [notes, setNotes] = useState(initialLog?.notes || '');

  useEffect(() => {
    if (initialLog) {
      setDate(initialLog.date);
      setItemsBought(initialLog.itemsBought);
      setMenuCooked(initialLog.menuCooked);
      setAmount(String(initialLog.amount));
      setShopperName(initialLog.shopperName);
      setIsPlanned(!!initialLog.isPlanned);
      setNotes(initialLog.notes || '');
    } else if (targetDate) {
      setDate(targetDate);
    }
  }, [initialLog, targetDate]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!date || !itemsBought.trim() || !menuCooked.trim() || isNaN(numAmount) || numAmount < 0) {
      return;
    }

    addOrUpdateMarketLog({
      id: initialLog?.id,
      date,
      itemsBought: itemsBought.trim(),
      menuCooked: menuCooked.trim(),
      amount: numAmount,
      shopperName: shopperName.trim(),
      isPlanned,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  const parsedDateInfo = formatDisplayDate(date);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl shadow-indigo-950/50 border border-slate-700/80 animate-in zoom-in-95 duration-150 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-white flex items-center justify-center font-extrabold shadow-md shadow-indigo-500/30">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-['Noto_Sans_Bengali','Outfit',sans-serif] font-bold text-base text-white">
                {initialLog ? 'বাজার ও মেন্যু রেকর্ড আপডেট' : 'দৈনিক বাজার ও মেন্যু এন্ট্রি'}
              </h3>
              <p className="text-xs text-slate-400 font-['Hind_Siliguri',sans-serif]">
                {parsedDateInfo.fullBangla} • {parsedDateInfo.dayBangla}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs font-['Hind_Siliguri',sans-serif]">
          {/* Date Picker & Planned Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>বাজারের তারিখ (Market Date)</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  // Auto suggest planned if date is in the future
                  const selectedObj = new Date(e.target.value);
                  const todayObj = new Date();
                  todayObj.setHours(0, 0, 0, 0);
                  if (selectedObj > todayObj) {
                    setIsPlanned(true);
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>এন্ট্রি স্ট্যাটাস</span>
              </label>
              <div className="flex items-center gap-2 pt-2">
                <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                  <input
                    type="checkbox"
                    checked={isPlanned}
                    onChange={(e) => setIsPlanned(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-700 bg-slate-950 cursor-pointer"
                  />
                  <span>অগ্রিম মেন্যু (Planned / Upcoming)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Items Bought Input */}
          <div>
            <label className="block font-bold text-slate-300 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-indigo-400" />
                <span>বাজারের দ্রব্যাদির তালিকা (Items Bought)</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/30">
                বাংলা ও English সমর্থিত
              </span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={itemsBought}
              onChange={(e) => setItemsBought(e.target.value)}
              placeholder="যেমন: শাক ও মুরগি, আলু ২ কেজি, কাঁচা মরিচ, তেল ১ লিটার"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500 placeholder-slate-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              মেসের জন্য কেনা বাজারের তালিকা বাংলায় লিখুন (যেমন: "শাক ও মুরগি")।
            </p>
          </div>

          {/* Cooked Menu Input */}
          <div>
            <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1.5">
              <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400" />
              <span>আজকের রান্নার মেন্যু (Cooked Meal Menu)</span>
            </label>
            <input
              type="text"
              required
              value={menuCooked}
              onChange={(e) => setMenuCooked(e.target.value)}
              placeholder="যেমন: মুরগির মাংসের ঝোল, লাল শাক ভাজি, ডাল ও ভাত"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500 placeholder-slate-500"
            />
          </div>

          {/* Amount & Shopper */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>মোট খরচ (৳ Amount)</span>
              </label>
              <input
                type="number"
                step="any"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 350"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-indigo-500 placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>বাজার করেছেন যিনি (Buyer)</span>
              </label>
              <select
                value={shopperName}
                onChange={(e) => setShopperName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs font-semibold cursor-pointer"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.avatar} {m.name}
                  </option>
                ))}
                <option value="Common Pool">🤝 যৌথ তহবিল / সরাসরি বাবুর্চি</option>
              </select>
            </div>
          </div>

          {/* Notes / Receipt Description */}
          <div>
            <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>অতিরিক্ত নোট / দোকান (ঐচ্ছিক)</span>
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="যেমন: কারওয়ান বাজার পাইকারি আড়ত থেকে কেনা"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs font-medium placeholder-slate-500"
            />
          </div>

          {/* Instant Push Notification Notice */}
          <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-[11px] text-indigo-200 flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>
              সংরক্ষণ করার সাথে সাথেই সকল মেম্বারের ডিভাইসে <strong>লাইভ পুশ নোটিফিকেশন অ্যালার্ট ও অডিও চিম</strong> পৌঁছে যাবে!
            </span>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-700 font-bold text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              বাতিল
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 text-white font-extrabold shadow-md shadow-indigo-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{initialLog ? 'আপডেট ও মেম্বারদের নোটিফাই করুন' : 'সংরক্ষণ ও পুশ অ্যালার্ট পাঠান'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
