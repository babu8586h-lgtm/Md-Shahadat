import React, { useState } from 'react';
import { useMess } from '../context/MessContext';
import { SetupExpense } from '../types';
import {
  X,
  PlusCircle,
  Home,
  Calendar,
  DollarSign,
  User,
  Trash2,
  ListFilter,
  CheckCircle,
  AlertCircle,
  Plus,
  ShoppingBag,
  Pencil,
} from 'lucide-react';

interface SetupExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SetupExpenseModal: React.FC<SetupExpenseModalProps> = ({ isOpen, onClose }) => {
  const {
    setupExpenses,
    addOrUpdateSetupExpense,
    deleteSetupExpense,
    totalSetupExpense,
    members,
    isAdmin,
    formatMoney,
    formatDisplayDate,
  } = useMess();

  // Form States
  const [itemName, setItemName] = useState('');
  const [purchasedBy, setPurchasedBy] = useState('যৌথ তহবিল');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartEdit = (expense: SetupExpense) => {
    setEditingExpenseId(expense.id);
    setItemName(expense.itemName);
    setPurchasedBy(expense.purchasedBy);
    setAmount(String(expense.amount));
    setDate(expense.date);
    setNotes(expense.notes || '');
    setIsAddingNew(true);
  };

  const handleCancel = () => {
    setItemName('');
    setPurchasedBy('যৌথ তহবিল');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setIsAddingNew(false);
    setEditingExpenseId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || !amount.trim() || !date.trim()) return;

    addOrUpdateSetupExpense({
      id: editingExpenseId || undefined,
      itemName: itemName.trim(),
      purchasedBy,
      amount: Number(amount),
      date,
      notes: notes.trim() || undefined,
    });

    // Reset Form & Close adding state
    setItemName('');
    setPurchasedBy('যৌথ তহবিল');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setIsAddingNew(false);
    setEditingExpenseId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        id="setup-expense-modal"
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-950/30 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Home className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white font-['Noto_Sans_Bengali',sans-serif]">
                বাসার মালামাল ও সেটআপ খরচ
              </h3>
              <p className="text-xs text-slate-400 font-['Hind_Siliguri',sans-serif]">
                মেসের যাবতীয় স্থায়ী জিনিসপত্র ক্রয়ের তালিকা ও বিবরণী
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          
          {/* Top Total Summary Banner */}
          <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-2xl p-5 flex items-center justify-between shadow-inner">
            <div className="space-y-1">
              <span className="text-xs font-bold text-indigo-300 font-['Hind_Siliguri',sans-serif]">
                বাসার স্থায়ী মালামাল কেনাবাবদ সর্বমোট খরচ
              </span>
              <h4 className="text-2xl sm:text-3xl font-black text-emerald-400 font-['Outfit','Noto_Sans_Bengali',sans-serif]">
                {formatMoney(totalSetupExpense)}
              </h4>
            </div>
            {isAdmin && !isAddingNew && (
              <button
                onClick={() => setIsAddingNew(true)}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন খরচ যোগ করুন</span>
              </button>
            )}
          </div>

          {/* Admin Form: Add New Setup Expense */}
          {isAddingNew && isAdmin && (
            <form onSubmit={handleSubmit} className="bg-slate-950/60 border border-indigo-500/20 rounded-2xl p-5 space-y-4 animate-in slide-in-from-top-4 duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                  <PlusCircle className="w-4 h-4 text-indigo-400" />
                  <span>{editingExpenseId ? 'মালামাল এন্ট্রি সংশোধন ফর্ম' : 'নতুন মালামাল ও সেটআপ এন্ট্রি ফর্ম'}</span>
                </h4>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                >
                  বাতিল করুন
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Item Name */}
                <div className="space-y-1.5 col-span-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                    <ShoppingBag className="w-3.5 h-3.5 text-indigo-400" />
                    <span>জিনিসের নাম (Item Name):</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="যেমন: সিলিং ফ্যান, গ্যাসের চুলা, পানির ফিল্টার ইত্যাদি..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-xs font-semibold text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Purchased By */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    <span>ক্রয়কারী মেম্বার (Purchased By):</span>
                  </label>
                  <select
                    value={purchasedBy}
                    onChange={(e) => setPurchasedBy(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-xs font-semibold text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.nameBangla || m.name}>
                        👤 {m.nameBangla || m.name}
                      </option>
                    ))}
                    <option value="যৌথ তহবিল">🤝 যৌথ তহবিল</option>
                  </select>
                </div>

                {/* Amount */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-indigo-400" />
                    <span>মূল্য / খরচ (Amount):</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="টাকার পরিমাণ (যেমন: ২৫০০)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-xs font-semibold text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <span>ক্রয়ের তারিখ (Date):</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-xs font-semibold text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  />
                </div>

                {/* Short Note */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">নোট (ঐচ্ছিক বিবরণ):</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="ব্র্যান্ড বা ওয়ারেন্টি তথ্য (যেমন: ৫ বছর ওয়ারেন্টি)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-xs font-semibold text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  {editingExpenseId ? 'পরিবর্তন সংরক্ষণ করুন' : 'সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          )}

          {/* Setup Expenses List / Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ListFilter className="w-4 h-4 text-indigo-400" />
              <span>ক্রয়কৃত মালামালের তালিকা ({setupExpenses.length} টি আইটেম)</span>
            </h4>

            {setupExpenses.length === 0 ? (
              <div className="p-8 text-center border border-slate-800 rounded-2xl bg-slate-950/20">
                <AlertCircle className="w-8 h-8 mx-auto text-slate-500 stroke-1 mb-2" />
                <p className="text-xs text-slate-400 font-['Hind_Siliguri',sans-serif]">
                  এখনও কোনো মালামালের খরচ এন্ট্রি করা হয়নি।
                </p>
              </div>
            ) : (
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/30">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800">
                      <tr>
                        <th className="p-4">জিনিসের নাম</th>
                        <th className="p-4">ক্রয়কারী</th>
                        <th className="p-4">তারিখ</th>
                        <th className="p-4 text-right">মূল্য / খরচ</th>
                        {isAdmin && <th className="p-4 text-center">অ্যাকশন</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {setupExpenses.map((expense) => {
                        const dateInfo = formatDisplayDate(expense.date);
                        return (
                          <tr key={expense.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="p-4">
                              <div className="font-bold text-white">{expense.itemName}</div>
                              {expense.notes && (
                                <div className="text-[10px] text-slate-400 mt-0.5 font-['Hind_Siliguri',sans-serif]">
                                  {expense.notes}
                                </div>
                              )}
                            </td>
                            <td className="p-4">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-800 text-indigo-300 border border-indigo-500/20">
                                {expense.purchasedBy === 'যৌথ তহবিল' ? '🤝' : '👤'} {expense.purchasedBy}
                              </span>
                            </td>
                            <td className="p-4 font-semibold text-slate-300">
                              {dateInfo.fullBangla}
                            </td>
                            <td className="p-4 text-right font-black text-emerald-400 font-['Outfit','Noto_Sans_Bengali',sans-serif]">
                              {formatMoney(expense.amount)}
                            </td>
                            {isAdmin && (
                              <td className="p-4 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={() => handleStartEdit(expense)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-950/40 border border-slate-800 transition-colors cursor-pointer"
                                    title="সংশোধন করুন"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => deleteSetupExpense(expense.id)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 border border-slate-800 transition-colors cursor-pointer"
                                    title="মুছে ফেলুন"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Member Disclaimer */}
          {!isAdmin && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5 text-[11px] text-amber-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <p className="font-['Hind_Siliguri',sans-serif]">
                শুধুমাত্র মেস অ্যাডমিন (শাহাদাত হোসেন) নতুন মালামাল এন্ট্রি বা ডিলিট করতে পারবেন। সাধারণ মেম্বাররা শুধুমাত্র তালিকাটি পর্যবেক্ষণ করতে পারবেন।
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-slate-800 bg-slate-900/90 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
