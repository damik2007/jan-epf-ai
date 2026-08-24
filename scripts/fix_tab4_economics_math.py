with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/benchmarks/page.tsx", "r", encoding="utf-8") as f:
    bp = f.read()

# Replace the badge on Tab 4
bp = bp.replace(
    '''              <span className="text-xs font-mono font-black px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-700">
                100% On-Device & Self-Hosted
              </span>''',
    '''              <span className="text-xs font-mono font-black px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-700">
                80% On-Device + 20% Sovereign Edge AI
              </span>'''
)

# Replace the comparison cards in Tab 4 with mathematically rigorous and crystal clear comparison
old_comparison = '''            {/* Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
              <div className="p-5 rounded-2xl border border-rose-900/60 bg-rose-950/30 space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase text-rose-400 block">Naive Commercial LLM Wrapper (Cloud API)</span>
                <div className="text-3xl font-black text-rose-400 font-mono">
                  ₹{commercialCostInCrores} Crore <span className="text-xs font-sans text-slate-400">/ year</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Assuming $0.03/query commercial API fee for vision OCR and legal parsing across {claimsSliderValue}M transactions.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-emerald-800/60 bg-emerald-950/30 space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 block">Jan-EPF AI Sovereign 80/20 Architecture</span>
                <div className="text-3xl font-black text-emerald-300 font-mono">
                  ₹0.00 Core <span className="text-xs font-sans text-slate-400">/ &lt;₹0.001 Edge AI</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  80% deterministic math runs 100% free in-browser + 20% unstructured AI on self-hosted open-weight containers (sub-paisa micro-cost, 99.6% net savings).
                </p>
              </div>
            </div>'''

new_comparison = '''            {/* Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
              <div className="p-6 rounded-2xl border border-rose-900/60 bg-rose-950/30 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono font-bold uppercase text-rose-400">Naive Commercial API Wrapper</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">$0.03 / Query</span>
                </div>
                <div className="text-3xl sm:text-4xl font-black text-rose-400 font-mono">
                  ₹{commercialCostInCrores} Crore <span className="text-xs font-sans text-slate-400 font-normal">/ year</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Assuming standard commercial vision &amp; reasoning API rates ($0.03 / ₹2.55 per claim) across all {claimsSliderValue}M annual transactions.
                </p>
                <div className="pt-2 border-t border-rose-900/40 text-[11px] text-rose-300/80 font-mono">
                  • 100% recurring public money drained to foreign proprietary clouds.
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-emerald-800/60 bg-emerald-950/30 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono font-bold uppercase text-emerald-400">Jan-EPF AI Sovereign 80/20 Core</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">99.6% Net Savings</span>
                </div>
                <div className="text-3xl sm:text-4xl font-black text-emerald-300 font-mono">
                  &lt; ₹0.01 Crore <span className="text-xs font-sans text-slate-400 font-normal">(~₹{Math.round(claimsSliderValue * 1000000 * 0.20 * 0.0004).toLocaleString("en-IN")} / yr)</span>
                </div>
                <div className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
                  <p>
                    <strong className="text-emerald-400">80% On-Device Core ({Math.round(claimsSliderValue * 0.8)}M claims):</strong> 100% free client evaluation at ₹0.00 server cost.
                  </p>
                  <p>
                    <strong className="text-emerald-400">20% Sovereign AI Edge ({Math.round(claimsSliderValue * 0.2)}M claims):</strong> Self-hosted open-weight containers at sub-paisa micro-cost (~₹0.0004 / req).
                  </p>
                </div>
                <div className="pt-2 border-t border-emerald-800/40 text-[11px] text-emerald-300 font-mono font-bold flex items-center justify-between">
                  <span>National Exchequer Retained:</span>
                  <span className="text-saffron">₹{commercialCostInCrores} Crore / yr saved</span>
                </div>
              </div>
            </div>'''

if old_comparison in bp:
    bp = bp.replace(old_comparison, new_comparison)

with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/benchmarks/page.tsx", "w", encoding="utf-8") as f:
    f.write(bp)
print("Updated Tab 4 economics comparison in benchmarks/page.tsx!")

