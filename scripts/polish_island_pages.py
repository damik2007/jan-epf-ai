import re

# 1. Update benchmarks/page.tsx
bench_path = "/Users/damikreddy/Desktop/Hackaton/frontend/src/app/benchmarks/page.tsx"
with open(bench_path, "r", encoding="utf-8") as f:
    bench_code = f.read()

# Ensure benchmarks only has the 5 pure benchmark tabs in its pill capsule
bench_tabs_def = """      {/* Island Tab Switcher Capsule */}
      <div className="flex overflow-x-auto p-1.5 bg-slate-200/80 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl border border-slate-300/80 dark:border-slate-700/80 text-xs font-bold shadow-sm scrollbar-none gap-1.5">
        {[
          { id: "evals", label: t.tab3WayEvals || "🧪 3-Way Evals Matrix" },
          { id: "latency", label: t.tab1000RunLatency || "⚡ 1,000-Run Latency Benchmark" },
          { id: "traces", label: t.tabRawTraces || "📜 Raw Trace & Token Receipts" },
          { id: "economics", label: t.tabExchequerRoi || "💰 National Exchequer ROI" },
          { id: "security", label: t.tabSecurityAudit || "🛡️ Security & SRE Audit" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-white dark:bg-amber-500 text-sovereign-navy dark:text-slate-950 shadow-sm font-black border border-slate-200 dark:border-amber-400 scale-100"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-slate-700/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>"""

# Replace the nav tabs block in benchmarks/page.tsx
bench_code = re.sub(r'{\/\* Navigation Tabs \*\/}[\s\S]*?<\/div>', bench_tabs_def, bench_code)

# Remove extra tabs from benchmarks/page.tsx so it stays pure to benchmarks
bench_code = re.sub(r'{\/\* TAB 6: DEMOGRAPHIC PERSONAS \*\/}[\s\S]*?{\/\* Formal Statutory & Legal Disclaimers Card \*\/}', '{/* Formal Statutory & Legal Disclaimers Card */}', bench_code)

with open(bench_path, "w", encoding="utf-8") as f:
    f.write(bench_code)
print("benchmarks/page.tsx polished with pure benchmark Island Tabs!")

# 2. Update architecture/page.tsx
arch_path = "/Users/damikreddy/Desktop/Hackaton/frontend/src/app/architecture/page.tsx"
with open(arch_path, "r", encoding="utf-8") as f:
    arch_code = f.read()

# Ensure architecture has matching Island Hero with 4 Metric Ticker Boxes & Island Tab Capsule
arch_tabs_def = """      {/* Island Tab Switcher Capsule */}
      <div className="flex overflow-x-auto p-1.5 bg-slate-200/80 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl border border-slate-300/80 dark:border-slate-700/80 text-xs font-bold shadow-sm scrollbar-none gap-1.5">
        {[
          { id: "personas", label: "👥 Demographic Personas (70M Workers)" },
          { id: "forms", label: "🏛️ 18 Archaic Forms vs 4 Hubs" },
          { id: "pillars", label: "🇮🇳 80/20 Sovereign Core Blueprint" },
          { id: "sre", label: "⚡ SRE Resilience & Circuit Breakers" },
          { id: "grievances", label: "📊 1.98M Grievance Root Causes" },
          { id: "legal", label: "⚖️ DPDP Act 2023 & Aadhaar Sec 29" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-white dark:bg-amber-500 text-sovereign-navy dark:text-slate-950 shadow-sm font-black border border-slate-200 dark:border-amber-400 scale-100"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-slate-700/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>"""

arch_code = re.sub(r'{\/\* Navigation Subsystem Tabs \*\/}[\s\S]*?<\/div>', arch_tabs_def, arch_code)

# Add 4 metric ticker cards inside the Hero Island of architecture/page.tsx
hero_metrics = """          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 text-xs font-mono">
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
              <span className="text-[10px] text-slate-300 font-sans block uppercase">CPGRAMS Dataset</span>
              <span className="text-xl font-extrabold text-emerald-300">1.98M AUDITED</span>
              <span className="text-[10px] text-slate-400 block font-sans">Parliamentary committee records</span>
            </div>
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
              <span className="text-[10px] text-slate-300 font-sans block uppercase">Worker Cohorts</span>
              <span className="text-xl font-extrabold text-amber-300">4 DEMOGRAPHICS</span>
              <span className="text-[10px] text-slate-400 block font-sans">70 Million EPFO workers</span>
            </div>
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
              <span className="text-[10px] text-slate-300 font-sans block uppercase">Form Elimination</span>
              <span className="text-xl font-extrabold text-blue-300">18 FORMS ➔ 0</span>
              <span className="text-[10px] text-slate-400 block font-sans">4 Life-Event Portals</span>
            </div>
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
              <span className="text-[10px] text-slate-300 font-sans block uppercase">Statutory Shield</span>
              <span className="text-xl font-extrabold text-purple-300">DPDP 2023</span>
              <span className="text-[10px] text-slate-400 block font-sans">Zero-Trust Presidio Vault</span>
            </div>
          </div>"""

arch_code = re.sub(r'<div className="flex flex-wrap items-center gap-3 pt-2">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>', hero_metrics + '\n        </div>\n      </div>', arch_code)

with open(arch_path, "w", encoding="utf-8") as f:
    f.write(arch_code)

print("architecture/page.tsx polished with matching Island Hero & Tab Switcher!")
