import React, { useState } from 'react';
import { useMess } from '../context/MessContext';
import {
  ShieldAlert,
  X,
  Lock,
  Mail,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose }) => {
  const { loginAdmin, superAdminEmail, isAdminAuthenticated } = useMess();

  const [emailInput, setEmailInput] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleQuickLoginAsSuperAdmin = () => {
    setEmailInput(superAdminEmail);
    setErrorMsg('');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const res = loginAdmin(emailInput.trim(), pinInput.trim());
      setIsLoading(false);

      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          onClose();
          setSuccessMsg('');
          setEmailInput('');
          setPinInput('');
        }, 900);
      } else {
        setErrorMsg(res.message);
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl shadow-indigo-950/60 border border-slate-700/80 animate-in zoom-in-95 duration-150 relative overflow-hidden font-['Hind_Siliguri',sans-serif]">
        {/* Glow ambient accent */}
        <div className="absolute right-0 top-0 w-60 h-60 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-0 bottom-0 w-60 h-60 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/25">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-['Noto_Sans_Bengali','Outfit',sans-serif] font-bold text-lg text-white">
                ম্যানেজার সিকিউরিটি সাইন-ইন
              </h3>
              <p className="text-xs text-slate-400">
                শুধুমাত্র অনুমোদিত অ্যাডমিনের জন্য এডিটিং সুবিধা
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

        {/* Security Rules Notice */}
        <div className="my-4 p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-slate-300 space-y-2 relative z-10">
          <div className="flex items-center gap-2 font-bold text-indigo-300">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>নির্ধারিত অ্যাডমিন ইমেইল:</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 font-bold flex items-center justify-between">
            <span>{superAdminEmail}</span>
            <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
              ভেরিফাইড ওনার
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            সাধারণ সদস্যরা মেসের সকল বাজার ও রান্নার মেন্যু শুধু দেখতে পারবেন। ডেটা যোগ, পরিবর্তন বা মুছতে হলে অনুমোদিত ইমেইল দিয়ে সাইন-ইন করতে হবে।
          </p>
        </div>

        {/* Quick Autofill Button */}
        <button
          type="button"
          onClick={handleQuickLoginAsSuperAdmin}
          className="w-full mb-4 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-amber-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{superAdminEmail} ইমেইলটি বসান</span>
        </button>

        {/* Error / Success Feedback */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-200 flex items-start gap-2.5 animate-in fade-in duration-150">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <p className="leading-snug">{errorMsg}</p>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2 animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <p className="font-bold">{successMsg}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs relative z-10">
          <div>
            <label className="block font-bold text-slate-300 mb-1.5">
              অ্যাডমিন ইমেইল ঠিকানা (Admin Email)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="babu8586h@gmail.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-500 placeholder-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1.5">
              সিকিউরিটি পাসকোড / পিন (ঐচ্ছিক)
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="ম্যানেজার পিন বা পাসওয়ার্ড (বা খালি রাখুন)"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-500 placeholder-slate-500"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-700 font-bold text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              বন্ধ করুন
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>যাচাই করা হচ্ছে...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>অ্যাডমিন হিসেবে সাইন-ইন</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
