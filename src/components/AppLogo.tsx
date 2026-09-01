import React from 'react';
import { ShoppingBag, Sparkles, ChefHat } from 'lucide-react';

interface AppLogoProps {
  compact?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({ compact = false }) => {
  return (
    <div className="flex items-center gap-3 select-none">
      {/* Modern Food Badge SVG Icon */}
      <div className="relative group">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-violet-500 text-white flex items-center justify-center font-black shadow-lg shadow-indigo-500/30 border border-indigo-400/40 ring-2 ring-indigo-500/20 transform transition-transform group-hover:scale-105 duration-200">
          <svg
            className="w-6 h-6 text-white drop-shadow-md"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Steaming Food Bowl / Cooking Pot SVG */}
            <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
            <line x1="6" y1="1" x2="6" y2="4" />
            <line x1="10" y1="1" x2="10" y2="4" />
            <line x1="14" y1="1" x2="14" y2="4" />
          </svg>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-950 border-2 border-indigo-400 flex items-center justify-center shadow-md">
            <ChefHat className="w-2.5 h-2.5 text-indigo-300" />
          </div>
        </div>
      </div>

      {/* Title & Bengali Branding */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="font-['Noto_Sans_Bengali','Outfit',sans-serif] font-black text-lg sm:text-xl text-white tracking-tight leading-none bg-gradient-to-r from-blue-200 via-indigo-100 to-violet-200 bg-clip-text text-transparent">
            ব্যাচেলর মেস ট্র্যাকার
          </h1>
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Sparkles className="w-2.5 h-2.5" />
            <span>লাইভ সিঙ্ক</span>
          </span>
        </div>

        {!compact && (
          <p className="text-[11px] text-slate-400 font-medium font-['Hind_Siliguri',sans-serif] mt-0.5 flex items-center gap-1.5">
            <span>দৈনিক বাজার ও রান্নার মেন্যু</span>
            <span className="text-slate-600">•</span>
            <span className="text-indigo-400 font-semibold">ফ্ল্যাট ৪বি</span>
          </p>
        )}
      </div>
    </div>
  );
};
