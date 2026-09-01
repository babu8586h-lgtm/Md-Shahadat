import React, { useState } from 'react';
import { useMess } from '../context/MessContext';
import {
  X,
  Bell,
  CheckCircle2,
  Trash2,
  Volume2,
  Send,
  AlertTriangle,
  Receipt,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface PushNotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBroadcastModal: () => void;
}

export const PushNotificationDrawer: React.FC<PushNotificationDrawerProps> = ({
  isOpen,
  onClose,
  onOpenBroadcastModal,
}) => {
  const {
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsRead,
    clearNotification,
    sendPushNotification,
    viewMode,
  } = useMess();

  const [filter, setFilter] = useState<'all' | 'unread' | 'urgent'>('all');

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'urgent') return n.priority === 'urgent';
    return true;
  });

  const handleTestChime = () => {
    sendPushNotification(
      '🔔 Live Notification Chime Test',
      'This is a real-time simulated push alert received by all flat members.',
      'admin_broadcast',
      'normal',
      'all'
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col font-['Hind_Siliguri',sans-serif]">
          {/* Header */}
          <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/50 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/30">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-['Noto_Sans_Bengali','Outfit',sans-serif] font-bold text-base text-white">
                  পুশ নোটিফিকেশন সেন্টার
                </h3>
                <p className="text-[11px] text-slate-400">
                  {unreadNotificationCount} টি অপঠিত পুশ নোটিফিকেশন
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

          {/* Quick Actions Bar */}
          <div className="p-3 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                  filter === 'all'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                সব ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                  filter === 'unread'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                অপঠিত ({unreadNotificationCount})
              </button>
              <button
                onClick={() => setFilter('urgent')}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                  filter === 'urgent'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                জরুরি
              </button>
            </div>

            <button
              onClick={markAllNotificationsRead}
              className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 cursor-pointer"
            >
              সব পড়া হয়েছে
            </button>
          </div>

          {/* Push Broadcast and Audio Chime Test */}
          <div className="p-3 bg-indigo-950/30 border-b border-indigo-500/20 flex items-center justify-between text-xs">
            <span className="text-indigo-200 text-[11px] font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>ইভেন্ট অনুযায়ী পুশ অ্যালার্ট ও অডিও চিম সচল</span>
            </span>
            <button
              onClick={handleTestChime}
              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
            >
              <Volume2 className="w-3 h-3" />
              <span>চিম পরীক্ষা</span>
            </button>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12 text-slate-500 space-y-2">
                <Bell className="w-8 h-8 mx-auto text-slate-600 stroke-1" />
                <p className="text-xs">কোনো নোটিফিকেশন পাওয়া যায়নি।</p>
              </div>
            ) : (
              filteredNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markNotificationAsRead(n.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                    !n.read
                      ? 'bg-slate-800/90 border-indigo-500/40 shadow-md'
                      : 'bg-slate-950/50 border-slate-800 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-indigo-400 shadow-xs shadow-indigo-400 shrink-0" />
                      )}
                      <h4
                        className={`text-xs font-bold ${
                          n.priority === 'urgent' ? 'text-rose-400' : 'text-white'
                        }`}
                      >
                        {n.title}
                      </h4>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        clearNotification(n.id);
                      }}
                      className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer transition-colors"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    {n.body}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2.5 pt-2 border-t border-slate-800/80">
                    <span>
                      {new Date(n.timestamp).toLocaleTimeString('bn-BD', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span className="uppercase font-bold tracking-wider text-indigo-300">
                      {n.type.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Action */}
          {viewMode === 'admin' && (
            <div className="p-4 border-t border-slate-800 bg-slate-950/70">
              <button
                onClick={() => {
                  onClose();
                  onOpenBroadcastModal();
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-amber-300" />
                <span>সকল মেম্বারকে পুশ নোটিফিকেশন পাঠান</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
