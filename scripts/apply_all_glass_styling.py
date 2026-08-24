import re

# 1. PreFlightRejectionDiffCard.tsx
with open("frontend/src/components/PreFlightRejectionDiffCard.tsx", "r") as f:
    c = f.read()

c = c.replace(
    'className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-all"',
    'className="rounded-2xl border border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl shadow-xl overflow-hidden transition-all duration-300"'
)
c = c.replace(
    'className="px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center cursor-pointer select-none"',
    'className="px-4 py-3 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 flex justify-between items-center cursor-pointer select-none"'
)

with open("frontend/src/components/PreFlightRejectionDiffCard.tsx", "w") as f:
    f.write(c)
print("Updated PreFlightRejectionDiffCard.tsx")

# 2. SovereignDpiPillars.tsx
with open("frontend/src/components/SovereignDpiPillars.tsx", "r") as f:
    c = f.read()

c = c.replace(
    'className="w-full bg-gradient-to-br from-slate-900 via-sovereign-darkest to-sovereign-navy rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl text-white space-y-6 relative overflow-hidden"',
    'className="w-full bg-slate-900/80 backdrop-blur-2xl bg-gradient-to-br from-slate-900/90 via-sovereign-darkest/90 to-sovereign-navy/90 rounded-3xl p-6 sm:p-8 border border-slate-700/50 shadow-2xl text-white space-y-6 relative overflow-hidden"'
)

with open("frontend/src/components/SovereignDpiPillars.tsx", "w") as f:
    f.write(c)
print("Updated SovereignDpiPillars.tsx")

# 3. SreTelemetryPanel.tsx
with open("frontend/src/components/SreTelemetryPanel.tsx", "r") as f:
    c = f.read()

c = c.replace(
    'className="w-full bg-gradient-to-br from-slate-900 via-sovereign-darkest to-sovereign-navy rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl text-white space-y-6 relative overflow-hidden"',
    'className="w-full backdrop-blur-2xl bg-gradient-to-br from-slate-900/95 via-sovereign-darkest/95 to-sovereign-navy/90 rounded-3xl p-6 sm:p-8 border border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.5)] text-white space-y-6 relative overflow-hidden"'
)

with open("frontend/src/components/SreTelemetryPanel.tsx", "w") as f:
    f.write(c)
print("Updated SreTelemetryPanel.tsx")

# 4. ChequeOCRScanner.tsx
with open("frontend/src/components/ChequeOCRScanner.tsx", "r") as f:
    c = f.read()

c = c.replace(
    'className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 p-5 shadow-sm"',
    'className="backdrop-blur-2xl bg-gradient-to-br from-slate-900/95 via-sovereign-darkest/95 to-sovereign-navy/90 text-white rounded-3xl border border-white/20 p-5 shadow-2xl"'
)
c = c.replace(
    'className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-sovereign-navy dark:hover:border-amber-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[160px]"',
    'className="border-2 border-dashed border-white/30 hover:border-white/60 hover:bg-white/10 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all bg-white/5 backdrop-blur-xl min-h-[160px]"'
)

with open("frontend/src/components/ChequeOCRScanner.tsx", "w") as f:
    f.write(c)
print("Updated ChequeOCRScanner.tsx")

# 5. SettlementReceiptModal.tsx
with open("frontend/src/components/SettlementReceiptModal.tsx", "r") as f:
    c = f.read()

c = c.replace(
    'className="w-full max-w-2xl bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]"',
    'className="w-full max-w-2xl backdrop-blur-2xl bg-gradient-to-br from-slate-900/95 via-sovereign-darkest/95 to-sovereign-navy/95 text-white border border-white/20 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] ring-1 ring-white/10 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]"'
)

with open("frontend/src/components/SettlementReceiptModal.tsx", "w") as f:
    f.write(c)
print("Updated SettlementReceiptModal.tsx")

print("All components upgraded to Ultra-Luxury Frosted Glassmorphism!")
