import re

# 1. Update AudienceSegmentReport.tsx
with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/components/AudienceSegmentReport.tsx", "r", encoding="utf-8") as f:
    asr_code = f.read()

# Replace root section
asr_code = re.sub(
    r'<section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">',
    '<section className="w-full bg-gradient-to-br from-slate-900 via-sovereign-darkest to-sovereign-navy border border-slate-700/80 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6 relative overflow-hidden">',
    asr_code
)

# Replace header text colors
asr_code = asr_code.replace('text-sovereign-navy dark:text-white', 'text-white')
asr_code = asr_code.replace('text-slate-600 dark:text-slate-400', 'text-slate-300')
asr_code = asr_code.replace('text-slate-900 dark:text-white', 'text-white')
asr_code = asr_code.replace('bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700', 'bg-white/10 hover:bg-white/20 text-white')
asr_code = asr_code.replace('text-slate-700 dark:text-slate-300', 'text-slate-300')

# Replace tab buttons
asr_code = asr_code.replace(
    'bg-sovereign-navy dark:bg-amber-500 text-white dark:text-slate-950 border-sovereign-navy dark:border-amber-500 shadow-md ring-2 ring-saffron/40',
    'bg-saffron text-sovereign-darkest font-black border-saffron shadow-lg ring-2 ring-saffron/40'
)
asr_code = asr_code.replace(
    'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700',
    'bg-slate-800/70 text-slate-300 border-slate-700/70 hover:bg-slate-700/60 hover:text-white'
)

# Replace detail card and 3 subcards
asr_code = asr_code.replace(
    'p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 shadow-sm space-y-5 transition-all',
    'p-6 rounded-2xl border border-slate-700/80 bg-slate-800/70 shadow-lg space-y-5 transition-all'
)
asr_code = asr_code.replace(
    'border-slate-200 dark:border-slate-700',
    'border-slate-700/60'
)
asr_code = asr_code.replace(
    'bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-rose-200 dark:border-rose-900/40 shadow-xs space-y-2.5',
    'bg-slate-900/60 rounded-2xl p-4 border border-rose-500/30 shadow-md space-y-2.5'
)
asr_code = asr_code.replace(
    'bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-blue-200 dark:border-blue-900/40 shadow-xs space-y-2.5',
    'bg-slate-900/60 rounded-2xl p-4 border border-blue-500/30 shadow-md space-y-2.5'
)
asr_code = asr_code.replace(
    'bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-emerald-200 dark:border-emerald-900/40 shadow-xs space-y-2.5 flex flex-col justify-between',
    'bg-slate-900/60 rounded-2xl p-4 border border-emerald-500/30 shadow-md space-y-2.5 flex flex-col justify-between'
)

with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/components/AudienceSegmentReport.tsx", "w", encoding="utf-8") as f:
    f.write(asr_code)
print("Updated AudienceSegmentReport.tsx with Sovereign Dark luxury finish!")

# 2. Update CitizenFeatureMatrix.tsx
with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/components/CitizenFeatureMatrix.tsx", "r", encoding="utf-8") as f:
    cfm_code = f.read()

cfm_code = re.sub(
    r'<section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">',
    '<section className="w-full bg-gradient-to-br from-slate-900 via-sovereign-darkest to-sovereign-navy border border-slate-700/80 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6 relative overflow-hidden">',
    cfm_code
)
cfm_code = cfm_code.replace('text-sovereign-navy dark:text-white', 'text-white')
cfm_code = cfm_code.replace('text-slate-600 dark:text-slate-400', 'text-slate-300')
cfm_code = cfm_code.replace('text-slate-700 dark:text-slate-300', 'text-slate-300')
cfm_code = cfm_code.replace('border-slate-200 dark:border-slate-800', 'border-slate-700/60')
cfm_code = cfm_code.replace('bg-slate-50 dark:bg-slate-800/60', 'bg-slate-800/60')
cfm_code = cfm_code.replace('bg-slate-100 dark:bg-slate-800', 'bg-slate-800/80 text-white')
cfm_code = cfm_code.replace('hover:bg-slate-50/60 dark:hover:bg-slate-800/40', 'hover:bg-slate-800/40 text-slate-300')

with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/components/CitizenFeatureMatrix.tsx", "w", encoding="utf-8") as f:
    f.write(cfm_code)
print("Updated CitizenFeatureMatrix.tsx with Sovereign Dark luxury finish!")

# 3. Update SreTelemetryPanel.tsx
with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/components/SreTelemetryPanel.tsx", "r", encoding="utf-8") as f:
    sre_code = f.read()

sre_code = re.sub(
    r'<section className="bg-slate-950 text-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-800 space-y-5 relative overflow-hidden">',
    '<section className="w-full bg-gradient-to-br from-slate-900 via-sovereign-darkest to-sovereign-navy border border-slate-700/80 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6 relative overflow-hidden">',
    sre_code
)
with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/components/SreTelemetryPanel.tsx", "w", encoding="utf-8") as f:
    f.write(sre_code)
print("Updated SreTelemetryPanel.tsx with Sovereign Dark luxury finish!")

# 4. Update benchmarks/page.tsx Tabs 2, 3, 4 with Sovereign Dark luxury containers
with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/benchmarks/page.tsx", "r", encoding="utf-8") as f:
    bench_code = f.read()

# Tab 2: Latency Benchmark
bench_code = re.sub(
    r'{\/\* TAB 2: 1,000-RUN LATENCY BENCHMARK \*\/}\s*\{activeTab === "latency" && \(\s*<div className="space-y-6 animate-in fade-in duration-200">\s*<div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">',
    '''{/* TAB 2: 1,000-RUN LATENCY BENCHMARK (SOVEREIGN DARK FINISH) */}
      {activeTab === "latency" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out">
          <div className="w-full bg-gradient-to-br from-slate-900 via-sovereign-darkest to-sovereign-navy rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl text-white space-y-6 relative overflow-hidden">''',
    bench_code
)

# Tab 3: Raw Traces
bench_code = re.sub(
    r'{\/\* TAB 3: RAW TRACE & TOKEN RECEIPTS \*\/}\s*\{activeTab === "traces" && \(\s*<div className="space-y-6 animate-in fade-in duration-200">\s*<div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">',
    '''{/* TAB 3: RAW TRACE & TOKEN RECEIPTS (SOVEREIGN DARK FINISH) */}
      {activeTab === "traces" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out">
          <div className="w-full bg-gradient-to-br from-slate-900 via-sovereign-darkest to-sovereign-navy rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl text-white space-y-6 relative overflow-hidden">''',
    bench_code
)

# Tab 4: National Exchequer ROI
bench_code = re.sub(
    r'{\/\* TAB 4: NATIONAL EXCHEQUER ROI \*\/}\s*\{activeTab === "economics" && \(\s*<div className="space-y-6 animate-in fade-in duration-200">\s*<div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">',
    '''{/* TAB 4: NATIONAL EXCHEQUER ROI (SOVEREIGN DARK FINISH) */}
      {activeTab === "economics" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out">
          <div className="w-full bg-gradient-to-br from-slate-900 via-sovereign-darkest to-sovereign-navy rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl text-white space-y-6 relative overflow-hidden">''',
    bench_code
)

# Replace light/dark text classes in benchmarks tabs
bench_code = bench_code.replace('text-sovereign-navy dark:text-white', 'text-white')
bench_code = bench_code.replace('text-slate-600 dark:text-slate-400', 'text-slate-300')
bench_code = bench_code.replace('border-slate-200 dark:border-slate-800', 'border-slate-700/60')
bench_code = bench_code.replace('bg-slate-50 dark:bg-slate-800/60', 'bg-slate-800/60')
bench_code = bench_code.replace('bg-slate-100 dark:bg-slate-800', 'bg-slate-800/80')

with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/benchmarks/page.tsx", "w", encoding="utf-8") as f:
    f.write(bench_code)
print("Updated benchmarks/page.tsx with Sovereign Dark containers on all 5 tabs!")

