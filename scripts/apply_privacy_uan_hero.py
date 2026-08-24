with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/page.tsx", "r", encoding="utf-8") as f:
    page = f.read()

# Add Eye, EyeOff, Copy to lucide-react imports if not present
if "Eye," not in page:
    page = page.replace(
        '  ChevronDown,\n  Activity\n} from "lucide-react";',
        '  ChevronDown,\n  Activity,\n  Eye,\n  EyeOff,\n  Copy\n} from "lucide-react";'
    )

# Add states inside CitizenLandingPage
old_state = '  const [chaosSimulatorOpen, setChaosSimulatorOpen] = useState(false);'
new_state = '''  const [chaosSimulatorOpen, setChaosSimulatorOpen] = useState(false);
  const [isUanMasked, setIsUanMasked] = useState<boolean>(true);
  const [uanCopied, setUanCopied] = useState<boolean>(false);

  const handleCopyUan = () => {
    navigator.clipboard.writeText(activeCitizen.uan);
    setUanCopied(true);
    setTimeout(() => setUanCopied(false), 2000);
  };'''

if old_state in page and "isUanMasked" not in page:
    page = page.replace(old_state, new_state)

start_marker = '{/* 1. CITIZEN WELCOME HERO BANNER */}'
end_marker = '{/* 2. CLAIM READINESS SCORE CARD */}'

start_pos = page.find(start_marker)
end_pos = page.find(end_marker)

if start_pos != -1 and end_pos != -1:
    new_hero = """{/* 1. CITIZEN WELCOME HERO BANNER */}
      <section className="bg-gradient-to-br from-[#001738] via-[#0A2540] to-[#001f3f] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-blue-900/60 relative overflow-hidden mt-2 sm:mt-3 card-hover-lift">
        <div className="absolute top-0 right-0 w-96 h-96 bg-saffron/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-samriddhi-gold/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-saffron text-sovereign-darkest">
                CITIZEN REDESIGN PROTOTYPE
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800/50 flex items-center gap-1.5 shadow-sm">
                🛡️ DPDP Protected Account ID
              </span>
            </div>

            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2 w-fit backdrop-blur-sm">
              <span className="text-xs text-slate-400 font-medium tracking-wide">
                UAN:
              </span>
              <strong className="font-mono text-white text-base sm:text-lg tracking-wider min-w-[140px]">
                {isUanMasked 
                  ? `${activeCitizen.uan.substring(0, 4)} •••• ${activeCitizen.uan.substring(8)}` 
                  : `${activeCitizen.uan.substring(0, 4)} ${activeCitizen.uan.substring(4, 8)} ${activeCitizen.uan.substring(8)}`}
              </strong>
              <div className="flex items-center gap-1 border-l border-white/10 pl-2.5 ml-1">
                <button
                  type="button"
                  onClick={() => setIsUanMasked(!isUanMasked)}
                  className="p-1.5 rounded-md hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                  title={isUanMasked ? "Show full UAN" : "Mask UAN"}
                >
                  {isUanMasked ? <Eye className="w-4 h-4 text-slate-300" /> : <EyeOff className="w-4 h-4 text-saffron" />}
                </button>
                <div className="relative">
                  <button
                    type="button"
                    onClick={handleCopyUan}
                    className="p-1.5 rounded-md hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                    title="Copy UAN to clipboard"
                  >
                    {uanCopied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
                  </button>
                  {uanCopied && (
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded shadow-lg whitespace-nowrap animate-in fade-in">
                      Copied!
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                {activeCitizen.full_name}
              </h1>
              <button
                type="button"
                onClick={logout}
                className="text-[11px] px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-300 flex items-center gap-1.5 transition-colors h-fit"
                title="Switch persona or logout"
              >
                <LogOut className="w-3 h-3 text-saffron" />
                <span>Switch Profile</span>
              </button>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {activeCitizen.active_employment
                ? `${t.activeEstablishmentLabel}: ${activeCitizen.active_employment.establishment_name} (${activeCitizen.active_employment.total_service_years} years)`
                : activeCitizen.pension_details
                ? `Senior Pensioner • PPO: ${activeCitizen.pension_details.ppo_number} • ${activeCitizen.pension_details.scheme}`
                : "Gig Platform / Unorganized Contributor"}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 text-xs bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm border border-white/10 text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t.verifiedKYCLabel}: {activeCitizen.bank_kyc.bank_name} ({t.verified})</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm border border-white/10 text-amber-300 font-bold">
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>8.25% Sovereign Rate Active</span>
              </div>
            </div>
          </div>

          {/* Quick Balance Card */}
          <div className="bg-white/5 backdrop-blur-md border border-white/15 p-5 rounded-2xl w-full lg:w-80 shadow-2xl space-y-3 shrink-0">
            <div className="flex justify-between items-center text-xs text-slate-300">
              <span>{t.totalBalanceLabel}</span>
              <span className="text-emerald-400 font-bold">● {t.verified}</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black tracking-tight font-mono text-white">
              ₹{displayBalance.toLocaleString("en-IN")}
            </div>
            <div className="space-y-2 pt-2 border-t border-white/10 text-xs text-slate-200 font-mono">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Employee Share (12%):</span>
                <span className="font-bold text-white">₹{employeeShare.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">FY Interest (8.25%):</span>
                <span className="font-bold text-amber-300">₹{interestEarned.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      """
    page = page[:start_pos] + new_hero + page[end_pos:]

with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/page.tsx", "w", encoding="utf-8") as f:
    f.write(page)
print("Applied Privacy-First UAN Hero card successfully!")

