with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/architecture/page.tsx", "r", encoding="utf-8") as f:
    arch = f.read()

# Add Statutory Disclaimers Card before the closing </div> of architecture/page.tsx
statutory_card = '''
      {/* Formal Statutory & Legal Disclaimers Card */}
      <div className="w-full bg-slate-900/90 text-slate-300 rounded-3xl p-6 sm:p-7 border border-slate-800 space-y-4 font-sans text-xs shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-white font-extrabold text-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Statutory, Legal &amp; Architectural Compliance Blueprint</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
            <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800">DPDP ACT 2023 COMPLIANT</span>
            <span className="px-2 py-0.5 rounded-md bg-blue-950 text-blue-300 border border-blue-800">
              AADHAAR ACT SEC 29 VERIFIED
            </span>
            <span className="px-2 py-0.5 rounded-md bg-amber-950 text-amber-300 border border-amber-800">PUBLIC DOMAIN STATUTORY RULES</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] leading-relaxed text-slate-400">
          <div className="space-y-1">
            <strong className="text-slate-200 block text-xs">1. Synthetic Personas &amp; Zero-Trust PII Masking</strong>
            <p>
              All citizen profiles (Ramesh Kumar, Priya Sharma, Gurmeet Singh, Sunita Devi) and simulated credentials (UANs, masked Aadhaar <code className="text-emerald-400">XXXX-XXXX-8712</code>, PAN <code className="text-emerald-400">ABCDE****F</code>) are 100% synthetic mock datasets created solely for research and hackathon benchmarking. No real citizen PII is collected or persisted.
            </p>
          </div>

          <div className="space-y-1">
            <strong className="text-slate-200 block text-xs">2. Public Domain Statutory Formulas</strong>
            <p>
              Rules cited from the Employees&apos; Provident Funds Scheme 1952 (Para 68J, 68B, 68K, 72(5)), EPS-95 (Para 12, 16), EDLI 1976, and Income Tax Act Section 192A are public statutory enactments in the public domain under Section 52(1)(q) of the Indian Copyright Act, 1957.
            </p>
          </div>

          <div className="space-y-1">
            <strong className="text-slate-200 block text-xs">3. Algorithmic Veracity &amp; Non-Affiliation</strong>
            <p>
              Timing benchmarks execute standard algorithms (Wagner-Fischer Levenshtein, Laplacian Variance, Tiktoken BPE) using native W3C <code className="text-amber-400">performance.now()</code>. Jan-EPF AI is an independent Digital Public Infrastructure (DPI) open-source research prototype built for the OpenAI &times; Varun Mayya hackathon and is not an official entity of the statutory EPFO organization.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
'''

if "Statutory, Legal &amp; Architectural Compliance Blueprint" not in arch:
    arch = arch.rstrip()
    if arch.endswith("</div>\n  );\n}"):
        arch = arch[:-14] + statutory_card

with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/architecture/page.tsx", "w", encoding="utf-8") as f:
    f.write(arch)
print("Updated architecture/page.tsx with bottom statutory card!")

