import React, { useState } from 'react';
import { useMess } from '../context/MessContext';
import { X, Send, Bell, Sparkles } from 'lucide-react';

interface BroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BroadcastModal: React.FC<BroadcastModalProps> = ({ isOpen, onClose }) => {
  const { sendPushNotification, members } = useMess();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal');
  const [targetMemberId, setTargetMemberId] = useState<string>('all');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    sendPushNotification(
      title.trim(),
      body.trim(),
      'admin_broadcast',
      priority,
      targetMemberId
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl shadow-indigo-950/50 border border-slate-700/80 animate-in zoom-in-95 duration-150 relative overflow-hidden font-['Hind_Siliguri',sans-serif]">
        {/* Ambient glow */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/30">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-['Noto_Sans_Bengali','Outfit',sans-serif] font-bold text-base text-white">
                পুশ নোটিফিকেশন ব্রডকাস্ট
              </h3>
              <p className="text-xs text-slate-400">
                সকল মেম্বারের স্ক্রিনে লাইভ টোস্ট ও অডিও চিম অ্যালার্ট পৌঁছাবে
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

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
          <div>
            <label className="block font-bold text-slate-300 mb-1">নোটিফিকেশন শিরোনাম (Title)</label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="যেমন: 📢 জরুরি মেস মিটিং রাত ১০টায়"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500 placeholder-slate-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">বার্তার বিস্তারিত (Message)</label>
            <textarea
              required
              rows={3}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="সকল মেম্বারদের জন্য বার্তা লিখুন..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 placeholder-slate-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1">প্রাপক (Recipients)</label>
              <select
                value={targetMemberId}
                onChange={(e) => setTargetMemberId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs font-semibold cursor-pointer"
              >
                <option value="all">👥 সকল মেম্বার (Broadcast)</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.avatar} {m.nameBangla || m.name} ({m.roomBangla || m.room})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">অগ্রাধিকার লেভেল</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs font-semibold cursor-pointer"
              >
                <option value="normal">সাধারণ (Normal Chime)</option>
                <option value="urgent">🚨 জরুরি (Urgent Priority)</option>
              </select>
            </div>
          </div>

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
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>ব্রডকাস্ট পাঠান</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
