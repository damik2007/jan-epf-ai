import re

# 1. Update ChaosSimulatorModal.tsx
with open("frontend/src/components/ChaosSimulatorModal.tsx", "r") as f:
    content = f.read()

content = content.replace(
    'className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"',
    'className="w-full max-w-4xl backdrop-blur-2xl bg-gradient-to-br from-slate-900/95 via-sovereign-darkest/95 to-sovereign-navy/95 text-white border border-white/20 dark:border-white/15 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] ring-1 ring-white/10 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"'
)

with open("frontend/src/components/ChaosSimulatorModal.tsx", "w") as f:
    f.write(content)
print("Updated ChaosSimulatorModal.tsx")

# 2. Update ExplainRupeeModal.tsx
with open("frontend/src/components/ExplainRupeeModal.tsx", "r") as f:
    content = f.read()

content = content.replace(
    'className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"',
    'className="backdrop-blur-2xl bg-gradient-to-br from-slate-900/95 via-sovereign-darkest/95 to-sovereign-navy/95 text-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-[0_25px_70px_rgba(0,0,0,0.85)] border border-white/20 ring-1 ring-white/10 space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto relative"'
)

with open("frontend/src/components/ExplainRupeeModal.tsx", "w") as f:
    f.write(content)
print("Updated ExplainRupeeModal.tsx")

# 3. Update GrievanceLegalLetterModal.tsx
with open("frontend/src/components/GrievanceLegalLetterModal.tsx", "r") as f:
    content = f.read()

content = content.replace(
    'className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"',
    'className="w-full max-w-3xl backdrop-blur-2xl bg-gradient-to-br from-slate-900/95 via-sovereign-darkest/95 to-sovereign-navy/95 text-white border border-white/20 dark:border-white/15 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] ring-1 ring-white/10 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"'
)

with open("frontend/src/components/GrievanceLegalLetterModal.tsx", "w") as f:
    f.write(content)
print("Updated GrievanceLegalLetterModal.tsx")

# 4. Update ArchitectureInspectorModal.tsx
with open("frontend/src/components/ArchitectureInspectorModal.tsx", "r") as f:
    content = f.read()

content = content.replace(
    'className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"',
    'className="w-full max-w-4xl backdrop-blur-2xl bg-gradient-to-br from-slate-900/95 via-sovereign-darkest/95 to-sovereign-navy/95 text-white border border-white/20 dark:border-white/15 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] ring-1 ring-white/10 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"'
)

with open("frontend/src/components/ArchitectureInspectorModal.tsx", "w") as f:
    f.write(content)
print("Updated ArchitectureInspectorModal.tsx")

