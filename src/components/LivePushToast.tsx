import React from 'react';
import { useMess } from '../context/MessContext';
import { Bell, X, ArrowRight } from 'lucide-react';

interface LivePushToastProps {
  onOpenDrawer: () => void;
}

export const LivePushToast: React.FC<LivePushToastProps> = ({ onOpenDrawer }) => {
  const { latestToast, dismissToast } = useMess();

  if (!latestToast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 duration-300 font-['Hind_Siliguri',sans-serif]">
      <div
        className={`p-4 rounded-3xl shadow-2xl border flex items-start gap-3 backdrop-blur-xl ${
          latestToast.priority === 'urgent'
            ? 'bg-slate-900/95 border-rose-500/50 text-white shadow-rose-950/40'
            : 'bg-slate-900/95 border-indigo-500/40 text-white shadow-indigo-950/40'
        }`}
      >
        <div
          className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 font-bold ${
            latestToast.priority === 'urgent'
              ? 'bg-rose-500 text-white'
              : 'bg-gradient-to-tr from-indigo-500 to-violet-600 text-white shadow-sm'
          }`}
        >
          <Bell className="w-4 h-4 animate-pulse" />
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs text-white leading-tight">
              {latestToast.title}
            </h4>
            <button
              onClick={dismissToast}
              className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-slate-300 leading-snug">
            {latestToast.body}
          </p>

          <div className="pt-1.5 flex items-center justify-between text-[10px]">
            <span className="text-indigo-400 font-semibold">লাইভ পুশ অ্যালার্ট</span>
            <button
              onClick={() => {
                dismissToast();
                onOpenDrawer();
              }}
              className="text-indigo-300 hover:text-white flex items-center gap-1 font-bold cursor-pointer transition-colors"
            >
              <span>বিস্তারিত দেখুন</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

