import re

print("=== 1. Upgrading PreFlightRejectionDiffCard.tsx ===")
pfr_code = '''"use client";

import React, { useState } from "react";
import { AlertCircle, CheckCircle2, ShieldAlert, ShieldCheck, ChevronDown, Sparkles } from "lucide-react";

interface PreFlightRejectionDiffCardProps {
  hubTitle: string;
  legacyFate: string;
  legacyDelay: string;
  sovereignSafeguard: string;
  sovereignLatency: string;
  financialImpact: string;
}

export function PreFlightRejectionDiffCard({
  hubTitle,
  legacyFate,
  legacyDelay,
  sovereignSafeguard,
  sovereignLatency,
  financialImpact
}: PreFlightRejectionDiffCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="w-full rounded-3xl border border-slate-700/80 bg-gradient-to-br from-slate-900 via-sovereign-darkest to-sovereign-navy text-white shadow-2xl overflow-hidden transition-all relative">
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-5 py-4 bg-slate-800/80 border-b border-slate-700/80 flex justify-between items-center cursor-pointer select-none relative z-10 hover:bg-slate-800 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-1.5">
            <span>Pre-Flight Rejection Prevention Diagnostic</span>
            <span className="text-slate-400 font-mono text-xs">({hubTitle})</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-700">
            {financialImpact}
          </span>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
        </div>
      </div>

      {isExpanded && (
        <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs animate-in fade-in duration-200 relative z-10">
          {/* Legacy Broken Fate */}
          <div className="p-4 rounded-2xl border border-rose-900/60 bg-rose-950/30 space-y-2 relative overflow-hidden group">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono font-black uppercase text-rose-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Legacy EPFO Portal Fate</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-rose-300 bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
                {legacyDelay}
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed font-medium">
              {legacyFate}
            </p>
          </div>

          {/* Jan-EPF AI Sovereign Safeguard */}
          <div className="p-4 rounded-2xl border border-emerald-800/60 bg-emerald-950/30 space-y-2 relative overflow-hidden group">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono font-black uppercase text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Jan-EPF AI Pre-Flight Safeguard</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                {sovereignLatency}
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed font-medium">
              {sovereignSafeguard}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
'''
with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/components/PreFlightRejectionDiffCard.tsx", "w", encoding="utf-8") as f:
    f.write(pfr_code)
print("Updated PreFlightRejectionDiffCard.tsx!")

print("=== 2. Upgrading ClaimReadinessScore.tsx ===")
with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/components/ClaimReadinessScore.tsx", "r", encoding="utf-8") as f:
    crs_code = f.read()

crs_code = re.sub(
    r'<section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">',
    '<section className="w-full bg-gradient-to-br from-slate-900 via-sovereign-darkest to-sovereign-navy rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl text-white space-y-6 relative overflow-hidden">',
    crs_code
)
crs_code = crs_code.replace('text-sovereign-navy dark:text-white', 'text-white')
crs_code = crs_code.replace('text-slate-600 dark:text-slate-400', 'text-slate-300')
crs_code = crs_code.replace('text-slate-900 dark:text-white', 'text-white')
crs_code = crs_code.replace('bg-slate-50 dark:bg-slate-800/60', 'bg-slate-800/60')
crs_code = crs_code.replace('border-slate-200 dark:border-slate-800', 'border-slate-700/60')
crs_code = crs_code.replace('border-slate-100 dark:border-slate-800', 'border-slate-700/50')
crs_code = crs_code.replace('bg-slate-50 dark:bg-slate-800', 'bg-slate-800/70')

with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/components/ClaimReadinessScore.tsx", "w", encoding="utf-8") as f:
    f.write(crs_code)
print("Updated ClaimReadinessScore.tsx!")

print("=== 3. Upgrading money/page.tsx ===")
with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/money/page.tsx", "r", encoding="utf-8") as f:
    money_code = f.read()

money_code = money_code.replace('text-sovereign-navy dark:text-white', 'text-white')
money_code = money_code.replace('text-slate-500 dark:text-slate-400', 'text-slate-300')
money_code = money_code.replace('text-slate-600 dark:text-slate-400', 'text-slate-300')
money_code = money_code.replace('text-slate-900 dark:text-white', 'text-white')
money_code = money_code.replace('bg-white dark:bg-slate-900', 'bg-slate-900/90')
money_code = money_code.replace('border-slate-200 dark:border-slate-800', 'border-slate-700/70')
money_code = money_code.replace('bg-slate-50 dark:bg-slate-800/60', 'bg-slate-800/60')
money_code = money_code.replace('bg-slate-50 dark:bg-slate-800', 'bg-slate-800/70')

with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/money/page.tsx", "w", encoding="utf-8") as f:
    f.write(money_code)
print("Updated money/page.tsx!")

print("=== 4. Upgrading career/page.tsx ===")
with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/career/page.tsx", "r", encoding="utf-8") as f:
    career_code = f.read()

career_code = career_code.replace('text-sovereign-navy dark:text-white', 'text-white')
career_code = career_code.replace('text-slate-500 dark:text-slate-400', 'text-slate-300')
career_code = career_code.replace('text-slate-600 dark:text-slate-400', 'text-slate-300')
career_code = career_code.replace('text-slate-900 dark:text-white', 'text-white')
career_code = career_code.replace('bg-white dark:bg-slate-900', 'bg-slate-900/90')
career_code = career_code.replace('border-slate-200 dark:border-slate-800', 'border-slate-700/70')
career_code = career_code.replace('bg-slate-50 dark:bg-slate-800/60', 'bg-slate-800/60')
career_code = career_code.replace('bg-slate-50 dark:bg-slate-800', 'bg-slate-800/70')

with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/career/page.tsx", "w", encoding="utf-8") as f:
    f.write(career_code)
print("Updated career/page.tsx!")

print("=== 5. Upgrading savings/page.tsx ===")
with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/savings/page.tsx", "r", encoding="utf-8") as f:
    savings_code = f.read()

savings_code = savings_code.replace('text-sovereign-navy dark:text-white', 'text-white')
savings_code = savings_code.replace('text-slate-500 dark:text-slate-400', 'text-slate-300')
savings_code = savings_code.replace('text-slate-600 dark:text-slate-400', 'text-slate-300')
savings_code = savings_code.replace('text-slate-900 dark:text-white', 'text-white')
savings_code = savings_code.replace('bg-white dark:bg-slate-900', 'bg-slate-900/90')
savings_code = savings_code.replace('border-slate-200 dark:border-slate-800', 'border-slate-700/70')
savings_code = savings_code.replace('bg-slate-50 dark:bg-slate-800/60', 'bg-slate-800/60')
savings_code = savings_code.replace('bg-slate-50 dark:bg-slate-800', 'bg-slate-800/70')

with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/savings/page.tsx", "w", encoding="utf-8") as f:
    f.write(savings_code)
print("Updated savings/page.tsx!")

print("=== 6. Upgrading fix/page.tsx ===")
with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/fix/page.tsx", "r", encoding="utf-8") as f:
    fix_code = f.read()

fix_code = fix_code.replace('text-sovereign-navy dark:text-white', 'text-white')
fix_code = fix_code.replace('text-slate-500 dark:text-slate-400', 'text-slate-300')
fix_code = fix_code.replace('text-slate-600 dark:text-slate-400', 'text-slate-300')
fix_code = fix_code.replace('text-slate-900 dark:text-white', 'text-white')
fix_code = fix_code.replace('bg-white dark:bg-slate-900', 'bg-slate-900/90')
fix_code = fix_code.replace('border-slate-200 dark:border-slate-800', 'border-slate-700/70')
fix_code = fix_code.replace('bg-slate-50 dark:bg-slate-800/60', 'bg-slate-800/60')
fix_code = fix_code.replace('bg-slate-50 dark:bg-slate-800', 'bg-slate-800/70')

with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/fix/page.tsx", "w", encoding="utf-8") as f:
    f.write(fix_code)
print("Updated fix/page.tsx!")

print("=== 7. Upgrading login/page.tsx ===")
with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/login/page.tsx", "r", encoding="utf-8") as f:
    login_code = f.read()

login_code = login_code.replace('text-sovereign-navy dark:text-white', 'text-white')
login_code = login_code.replace('text-slate-500 dark:text-slate-400', 'text-slate-300')
login_code = login_code.replace('text-slate-600 dark:text-slate-400', 'text-slate-300')
login_code = login_code.replace('text-slate-900 dark:text-white', 'text-white')
login_code = login_code.replace('bg-white dark:bg-slate-900', 'bg-slate-900/90')
login_code = login_code.replace('border-slate-200 dark:border-slate-800', 'border-slate-700/70')
login_code = login_code.replace('bg-slate-50 dark:bg-slate-800/60', 'bg-slate-800/60')
login_code = login_code.replace('bg-slate-50 dark:bg-slate-800', 'bg-slate-800/70')

with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/login/page.tsx", "w", encoding="utf-8") as f:
    f.write(login_code)
print("Updated login/page.tsx!")

print("=== 8. Upgrading page.tsx (Citizen Home) ===")
with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/page.tsx", "r", encoding="utf-8") as f:
    home_code = f.read()

home_code = home_code.replace('text-sovereign-navy dark:text-white', 'text-white')
home_code = home_code.replace('text-slate-500 dark:text-slate-400', 'text-slate-300')
home_code = home_code.replace('text-slate-600 dark:text-slate-400', 'text-slate-300')
home_code = home_code.replace('text-slate-900 dark:text-white', 'text-white')
home_code = home_code.replace('bg-white dark:bg-slate-900', 'bg-slate-900/90')
home_code = home_code.replace('border-slate-200 dark:border-slate-800', 'border-slate-700/70')
home_code = home_code.replace('bg-slate-50 dark:bg-slate-800/60', 'bg-slate-800/60')
home_code = home_code.replace('bg-slate-50 dark:bg-slate-800', 'bg-slate-800/70')

# Hub portal cards luxury hover & shadow
home_code = home_code.replace(
    'p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:border-saffron/50 transition-all flex flex-col justify-between group relative overflow-hidden',
    'p-6 rounded-3xl border border-slate-700/80 bg-gradient-to-br from-slate-900 via-sovereign-darkest to-sovereign-navy text-white shadow-xl hover:shadow-2xl hover:border-saffron/60 transition-all flex flex-col justify-between group relative overflow-hidden hover:scale-[1.01]'
)

with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/page.tsx", "w", encoding="utf-8") as f:
    f.write(home_code)
print("Updated page.tsx!")

