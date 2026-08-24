import re

# 1. Update money/page.tsx
with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/money/page.tsx", "r", encoding="utf-8") as f:
    money = f.read()

money = money.replace('bg-slate-200 dark:bg-slate-700 text-slate-500', 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300')
money = money.replace(': "text-slate-400"', ': "text-slate-500 dark:text-slate-400"')
money = money.replace('text-slate-300 dark:text-slate-600 hidden md:inline', 'text-slate-400 dark:text-slate-500 hidden md:inline')
money = money.replace('text-[11px] text-slate-400 dark:text-slate-500', 'text-[11px] text-slate-500 dark:text-slate-400')
money = money.replace('text-[10px] text-slate-400 truncate', 'text-[10px] text-slate-500 dark:text-slate-400 truncate')

with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/money/page.tsx", "w", encoding="utf-8") as f:
    f.write(money)
print("Updated money/page.tsx!")

# 2. Update savings/page.tsx
with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/savings/page.tsx", "r", encoding="utf-8") as f:
    savings = f.read()

savings = savings.replace('text-xs font-mono text-slate-400 font-bold hidden sm:inline', 'text-xs font-mono text-slate-500 dark:text-slate-400 font-bold hidden sm:inline')

with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/savings/page.tsx", "w", encoding="utf-8") as f:
    f.write(savings)
print("Updated savings/page.tsx!")

# 3. Update ChequeOCRScanner.tsx
with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/components/ChequeOCRScanner.tsx", "r", encoding="utf-8") as f:
    cheque = f.read()

cheque = cheque.replace('Upload className="w-8 h-8 text-slate-400 dark:text-slate-500 mb-2"', 'Upload className="w-8 h-8 text-slate-500 dark:text-slate-400 mb-2"')
cheque = cheque.replace('<span className="text-slate-400">Ready for check</span>', '<span className="text-slate-500 dark:text-slate-400">Ready for check</span>')
cheque = cheque.replace('<span className="text-slate-400">Pending upload</span>', '<span className="text-slate-500 dark:text-slate-400">Pending upload</span>')

with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/components/ChequeOCRScanner.tsx", "w", encoding="utf-8") as f:
    f.write(cheque)
print("Updated ChequeOCRScanner.tsx!")

# 4. Update EvaluatorTourModal.tsx
with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/components/EvaluatorTourModal.tsx", "r", encoding="utf-8") as f:
    tour = f.read()

tour = tour.replace('backdrop-blur-sm animate-in', 'backdrop-blur-md animate-in')

with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/components/EvaluatorTourModal.tsx", "w", encoding="utf-8") as f:
    f.write(tour)
print("Updated EvaluatorTourModal.tsx!")

# 5. Update login/page.tsx
with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/login/page.tsx", "r", encoding="utf-8") as f:
    login = f.read()

login = login.replace('text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${persona.badgeColor}', 'text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-sm ${persona.badgeColor}')

with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/login/page.tsx", "w", encoding="utf-8") as f:
    f.write(login)
print("Updated login/page.tsx!")

