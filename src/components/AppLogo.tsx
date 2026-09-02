import React from 'react';
import { ChefHat } from 'lucide-react';

interface AppLogoProps {
  compact?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({ compact = false }) => {
  return (
    <div className="flex items-center gap-2.5 sm:gap-3.5 select-none shrink-0">
      {/* Brand Icon */}
      <div className="relative shrink-0">
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-violet-600 text-white flex items-center justify-center font-black shadow-lg shadow-indigo-500/25 border border-indigo-400/30 ring-1 ring-indigo-500/20">
          <ChefHat className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
      </div>

      {/* Brand Bengali Title & Tagline */}
      <div className="flex flex-col justify-center min-w-0">
        <span className="font-['Noto_Sans_Bengali','Outfit',sans-serif] font-black text-base sm:text-lg lg:text-xl text-white tracking-tight leading-tight whitespace-nowrap">
          ব্যাচেলর মেস ট্র্যাকার
        </span>

        {!compact && (
          <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium font-['Hind_Siliguri',sans-serif] leading-tight flex items-center gap-1.5 whitespace-nowrap mt-0.5">
            <span>দৈনিক বাজার ও রান্নার মেন্যু</span>
            <span className="text-slate-600">•</span>
            <span className="text-indigo-400 font-semibold">ফ্ল্যাট ৪বি</span>
          </p>
        )}
      </div>
    </div>
  );
};
