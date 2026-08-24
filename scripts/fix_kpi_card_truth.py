with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/benchmarks/page.tsx", "r", encoding="utf-8") as f:
    bp = f.read()

old_kpi_block = '''          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
            <span className="text-[10px] text-slate-300 font-sans block uppercase">{t.cloudBillLabel || "National Cloud Bill"}</span>
            <span className="text-xl font-extrabold text-emerald-300">₹0.00 / Request</span>
            <span className="text-[10px] text-slate-400 block font-sans">80% on-device execution</span>
          </div>'''

new_kpi_block = '''          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
            <span className="text-[10px] text-slate-300 font-sans block uppercase">{t.cloudBillLabel || "Exchequer Cloud Cost"}</span>
            <span className="text-xl font-extrabold text-emerald-300">99.6% SAVED</span>
            <span className="text-[10px] text-slate-400 block font-sans">₹0.00 Core &bull; &lt;₹0.001 AI</span>
          </div>'''

if old_kpi_block in bp:
    bp = bp.replace(old_kpi_block, new_kpi_block)
else:
    # In case of minor whitespace differences
    import re
    bp = re.sub(
        r'<span className="text-xl font-extrabold text-emerald-300">₹0\.00 \/ Request<\/span>\s*<span className="text-\[10px\] text-slate-400 block font-sans">80% on-device execution<\/span>',
        r'<span className="text-xl font-extrabold text-emerald-300">99.6% SAVED</span>\n            <span className="text-[10px] text-slate-400 block font-sans">₹0.00 Core &bull; &lt;₹0.001 AI</span>',
        bp
    )

with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/benchmarks/page.tsx", "w", encoding="utf-8") as f:
    f.write(bp)
print("Updated top KPI card 4 to 100% truth!")

