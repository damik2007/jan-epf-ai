with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/page.tsx", "r", encoding="utf-8") as f:
    page = f.read()

# Add isPrivacyMode state
old_state_block = '''  const [chaosSimulatorOpen, setChaosSimulatorOpen] = useState(false);
  const [isUanMasked, setIsUanMasked] = useState<boolean>(true);
  const [uanCopied, setUanCopied] = useState<boolean>(false);'''

new_state_block = '''  const [chaosSimulatorOpen, setChaosSimulatorOpen] = useState(false);
  const [isUanMasked, setIsUanMasked] = useState<boolean>(true);
  const [isPrivacyMode, setIsPrivacyMode] = useState<boolean>(false);
  const [uanCopied, setUanCopied] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("jan_epf_privacy_mode");
      if (saved === "true") setIsPrivacyMode(true);
    }
  }, []);'''

if old_state_block in page:
    page = page.replace(old_state_block, new_state_block)

# Replace the Quick Balance Card with the Privacy Mode toggle and masked balances
old_balance_card = '''          {/* Quick Balance Card */}
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
          </div>'''

new_balance_card = '''          {/* Quick Balance Card with Discreet Privacy Mode */}
          <div className="bg-white/5 backdrop-blur-md border border-white/15 p-5 rounded-2xl w-full lg:w-80 shadow-2xl space-y-3 shrink-0">
            <div className="flex justify-between items-center text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <span>{t.totalBalanceLabel}</span>
                <button
                  type="button"
                  onClick={() => {
                    const next = !isPrivacyMode;
                    setIsPrivacyMode(next);
                    if (typeof window !== "undefined") {
                      localStorage.setItem("jan_epf_privacy_mode", String(next));
                    }
                  }}
                  className="p-1 rounded-md hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                  title={isPrivacyMode ? "Show balances (Discreet Mode Active)" : "Hide balances (Privacy Mode)"}
                >
                  {isPrivacyMode ? <EyeOff className="w-3.5 h-3.5 text-saffron" /> : <Eye className="w-3.5 h-3.5 text-slate-300" />}
                </button>
              </div>
              <span className="text-emerald-400 font-bold">● {t.verified}</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black tracking-tight font-mono text-white flex items-center">
              {isPrivacyMode ? (
                <span className="tracking-widest text-slate-300 font-sans select-none">₹ ••••••••</span>
              ) : (
                <span>₹{displayBalance.toLocaleString("en-IN")}</span>
              )}
            </div>
            <div className="space-y-2 pt-2 border-t border-white/10 text-xs text-slate-200 font-mono">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Employee Share (12%):</span>
                <span className="font-bold text-white">
                  {isPrivacyMode ? "₹ ••••••" : `₹${employeeShare.toLocaleString("en-IN")}`}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">FY Interest (8.25%):</span>
                <span className="font-bold text-amber-300">
                  {isPrivacyMode ? "₹ •••••" : `₹${interestEarned.toLocaleString("en-IN")}`}
                </span>
              </div>
            </div>
          </div>'''

if old_balance_card in page:
    page = page.replace(old_balance_card, new_balance_card)

with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/page.tsx", "w", encoding="utf-8") as f:
    f.write(page)
print("Updated page.tsx with Discreet Privacy Mode for Quick Balance Card!")

