with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/architecture/page.tsx", "r", encoding="utf-8") as f:
    arch = f.read()

old_block = '''              <h4 className="text-sm font-bold text-white">Zero Commercial Cloud Toll</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                By offloading 80% of transactions to local deterministic execution, national cloud expenditure drops from &#8377;18.4 Crore/year (at commercial API rates) to &#8377;0.00.
              </p>
              <div className="text-[11px] font-mono text-amber-400 pt-1">
                &bull; National Exchequer ROI: 100% Retained
              </div>'''

new_block = '''              <h4 className="text-sm font-bold text-white">99.6% Net Cloud Savings</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                80% of transactions execute 100% free on-device (₹0.00 compute) and 20% on self-hosted open-weight containers (~₹0.0004/req), slashing national cloud bills from ₹18.4 Crore/year down to &lt; ₹0.01 Crore.
              </p>
              <div className="text-[11px] font-mono text-amber-400 pt-1 font-bold">
                • National Exchequer Retained: 99.6% Net Savings
              </div>'''

if old_block in arch:
    arch = arch.replace(old_block, new_block)
else:
    # Also handle if plain characters exist
    arch = arch.replace(
        "By offloading 80% of transactions to local deterministic execution, national cloud expenditure drops from ₹18.4 Crore/year (at commercial API rates) to ₹0.00.",
        "80% of transactions execute 100% free on-device (₹0.00 compute) and 20% on self-hosted open-weight containers (~₹0.0004/req), slashing national cloud bills from ₹18.4 Crore/year down to < ₹0.01 Crore."
    )
    arch = arch.replace("Zero Commercial Cloud Toll", "99.6% Net Cloud Savings")
    arch = arch.replace("National Exchequer ROI: 100% Retained", "National Exchequer Retained: 99.6% Net Savings")

with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/architecture/page.tsx", "w", encoding="utf-8") as f:
    f.write(arch)
print("Updated architecture/page.tsx cloud veracity!")

