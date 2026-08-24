"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCitizen } from "@/context/CitizenContext";
import {
  Search,
  User,
  Wallet,
  Briefcase,
  PiggyBank,
  Wrench,
  Sun,
  Moon,
  Eye,
  Languages,
  Sparkles,
  Command,
  X,
  ArrowRight,
  Zap,
  Download,
  Landmark
} from "lucide-react";

interface CommandCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChaosSimulator?: () => void;
}

export function CommandCenter({ isOpen, onClose, onOpenChaosSimulator }: CommandCenterProps) {
  const router = useRouter();
  const {
    citizens,
    activeCitizen,
    isAuthenticated,
    switchCitizen,
    seniorMode,
    setSeniorMode,
    theme,
    toggleTheme,
    language,
    setLanguage
  } = useCitizen();

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Dynamic values based on active citizen
  const activeName = activeCitizen?.full_name || "Active Citizen";
  const actionsCategory = `⚡ Active Citizen Actions (${activeName})`;
  const maxSanction = activeCitizen?.passbook_summary?.employee_share?.toLocaleString("en-IN") || "0";
  const establishmentName = activeCitizen?.active_employment?.establishment_name || "Current Employer";
  const totalBalance = activeCitizen?.passbook_summary?.total_balance?.toLocaleString("en-IN") || "0";
  const bankName = activeCitizen?.bank_kyc?.bank_name || "Bank";
  const bankAccount = activeCitizen?.bank_kyc?.account_number_masked || "XX0000";

  // Define searchable action items dynamically prioritizing ACTIVE citizen actions
  const items = [
    // ⚡ Deep, personalized actions for the ACTIVE citizen
    {
      id: "action-advance",
      category: actionsCategory,
      title: `💰 Apply for Emergency Advance (Form 31) - Up to ₹${maxSanction}`,
      subtitle: `Instant pre-flight check & direct DBT transfer for ${activeName}`,
      icon: Wallet,
      action: () => {
        router.push("/money");
        onClose();
      }
    },
    {
      id: "action-job-switch",
      category: actionsCategory,
      title: `💼 Job Switch & Date of Exit Auto-Fix (${establishmentName})`,
      subtitle: "1-Click Multi-Job Consolidation & Section 192A TDS Shield",
      icon: Briefcase,
      action: () => {
        router.push("/career");
        onClose();
      }
    },
    {
      id: "action-passbook",
      category: actionsCategory,
      title: `📈 Inspect Passbook & Compound Growth (Current Balance: ₹${totalBalance})`,
      subtitle: "Visual Passbook Triple-Split & 8.25% Sovereign Retirement Forecast",
      icon: PiggyBank,
      action: () => {
        router.push("/savings");
        onClose();
      }
    },
    {
      id: "action-kyc",
      category: actionsCategory,
      title: `🛠️ Reconcile Name & Bank KYC (${bankName} - ${bankAccount})`,
      subtitle: "Levenshtein Fuzzy Match, NPCI Penny Drop & Joint Declaration",
      icon: Wrench,
      action: () => {
        router.push("/fix");
        onClose();
      }
    },
    {
      id: "action-enom",
      category: actionsCategory,
      title: "📋 Update e-Nomination & Claim ₹7 Lakh EDLI Insurance",
      subtitle: `Digital Nominee registration for ${activeName}'s family`,
      icon: User,
      action: () => {
        router.push("/fix");
        onClose();
      }
    },
    {
      id: "action-download-passbook",
      category: actionsCategory,
      title: "📄 Download Official Passbook Statement PDF",
      subtitle: `Generate verified PF statement receipt for UAN ${activeCitizen?.uan}`,
      icon: Download,
      action: () => {
        router.push("/savings");
        onClose();
      }
    },
    {
      id: "action-chaos",
      category: actionsCategory,
      title: `⚡ Run Zero-Rejection Chaos Test on ${activeName}'s Record`,
      subtitle: "Inject mismatch traps & watch real-time deterministic self-healing",
      icon: Zap,
      action: () => {
        onClose();
        if (onOpenChaosSimulator) onOpenChaosSimulator();
      }
    },
    {
      id: "action-benchmarks",
      category: actionsCategory,
      title: "📊 View Sovereign 80/20 Benchmarks & Audit Logs",
      subtitle: "Dedicated proof repository, microsecond runner & 3-way evals",
      icon: Sparkles,
      action: () => {
        router.push("/benchmarks");
        onClose();
      }
    },

    // 🏛️ Human Life-Event Hubs Navigation
    {
      id: "hub-money",
      category: "🏛️ Human Life-Event Hubs",
      title: "I Need Money (Advance Withdrawal)",
      subtitle: "Statutory Form 31 Advance with Instant Pre-Flight Check",
      icon: Wallet,
      action: () => {
        router.push("/money");
        onClose();
      }
    },
    {
      id: "hub-career",
      category: "🏛️ Human Life-Event Hubs",
      title: "I Changed Jobs (PF Transfer & DOE)",
      subtitle: "1-Click Multi-Job Consolidation & Section 192A TDS Shield",
      icon: Briefcase,
      action: () => {
        router.push("/career");
        onClose();
      }
    },
    {
      id: "hub-savings",
      category: "🏛️ Human Life-Event Hubs",
      title: "My Savings & 8.25% Compounding",
      subtitle: "Visual Passbook Triple-Split & Retirement Wealth Curve",
      icon: PiggyBank,
      action: () => {
        router.push("/savings");
        onClose();
      }
    },
    {
      id: "hub-fix",
      category: "🏛️ Human Life-Event Hubs",
      title: "Fix My Details (Self-Healing KYC)",
      subtitle: "Levenshtein Fuzzy Match, NPCI Penny Drop & Joint Declaration",
      icon: Wrench,
      action: () => {
        router.push("/fix");
        onClose();
      }
    },
    {
      id: "hub-architecture",
      category: "🏛️ Human Life-Event Hubs",
      title: "🏛️ Architecture & Citizen Research Lab",
      subtitle: "1.98M Grievance Analysis, Demographic Personas & 80/20 Sovereign Core",
      icon: Landmark,
      action: () => {
        router.push("/architecture");
        onClose();
      }
    },

    // System Controls
    {
      id: "action-senior-mode",
      category: "System Toggles",
      title: seniorMode ? "Disable Senior Mode (100% Scale)" : "Enable Senior Mode (125% Scale + WCAG AAA)",
      subtitle: "Large touch targets and high contrast for senior pensioners",
      icon: Eye,
      action: () => {
        setSeniorMode(!seniorMode);
        onClose();
      }
    },
    {
      id: "action-theme-toggle",
      category: "System Toggles",
      title: theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode",
      subtitle: "Toggle between high-contrast Dark and Sovereign Light themes",
      icon: theme === "dark" ? Sun : Moon,
      action: () => {
        toggleTheme();
        onClose();
      }
    },

    // Personas (Sandbox) - Grouped at the bottom for testing
    {
      id: "persona-ramesh",
      category: "👥 Switch Sandbox Persona (Testing)",
      title: "Ramesh Kumar (Factory Worker)",
      subtitle: "UAN: 100982348712 • Tests Medical Advance (Para 68J)",
      icon: User,
      action: () => {
        switchCitizen("100982348712");
        onClose();
      }
    },
    {
      id: "persona-priya",
      category: "👥 Switch Sandbox Persona (Testing)",
      title: "Priya Sharma (Tech Worker)",
      subtitle: "UAN: 101294817203 • Tests Job Switch & Missing Exit Date",
      icon: User,
      action: () => {
        switchCitizen("101294817203");
        onClose();
      }
    },
    {
      id: "persona-gurmeet",
      category: "👥 Switch Sandbox Persona (Testing)",
      title: "Gurmeet Singh (Senior Pensioner)",
      subtitle: "UAN: 100112233445 • Tests Senior Mode & EPS-95 Face DLC",
      icon: User,
      action: () => {
        switchCitizen("100112233445");
        onClose();
      }
    },
    {
      id: "persona-sunita",
      category: "👥 Switch Sandbox Persona (Testing)",
      title: "Sunita Devi (Gig Economy)",
      subtitle: "UAN: 101889977665 • Tests e-Nomination & ₹7L EDLI",
      icon: User,
      action: () => {
        switchCitizen("101889977665");
        onClose();
      }
    }
  ];

  // Filter items based on user query
  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  // Keyboard navigation inside modal
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
        }
      }
    },
    [isOpen, filteredItems, selectedIndex, onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-3 sm:px-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl backdrop-blur-2xl bg-gradient-to-br from-slate-900/90 via-sovereign-darkest/95 to-sovereign-navy/90 text-white border border-white/20 dark:border-white/15 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] ring-1 ring-white/10 overflow-hidden relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Ambient Glows */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-saffron/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-samriddhi-gold/10 rounded-full blur-2xl pointer-events-none" />

        {/* Search Input Bar */}
        <div className="relative z-10 flex items-center gap-3 px-5 py-4 border-b border-white/15 backdrop-blur-md bg-white/5">
          <Search className="w-5 h-5 text-saffron shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder={`Search actions for ${activeName}... (e.g. Advance, Passbook, Transfer, KYC)`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm font-semibold text-white placeholder:text-slate-400 focus:outline-none"
          />
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-0.5 text-[10px] font-mono font-bold bg-white/10 text-slate-300 rounded border border-white/20 shadow-xs">
              ESC
            </kbd>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="relative z-10 max-h-96 overflow-y-auto p-3 sm:p-4 space-y-1.5 scroll-touch">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-400">
              No actions found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between p-3 sm:p-3.5 rounded-2xl cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? "backdrop-blur-md bg-gradient-to-r from-saffron/25 via-amber-500/20 to-emerald-500/10 border-2 border-saffron text-white shadow-lg ring-1 ring-saffron/40 scale-[1.01]"
                      : "backdrop-blur-sm bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "bg-saffron text-sovereign-darkest font-black shadow-md"
                          : "bg-white/10 text-saffron border border-white/15"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2 flex-wrap">
                        <span>{item.title}</span>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-amber-300 border border-white/15">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-300 mt-0.5">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <ArrowRight className="w-4 h-4 text-saffron shrink-0" />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Quick Tips */}
        <div className="relative z-10 px-5 py-2.5 bg-white/5 backdrop-blur-md border-t border-white/10 flex justify-between items-center text-[11px] text-slate-400">
          <div className="flex items-center gap-3 font-mono">
            <span>Navigation: <kbd className="px-1.5 py-0.5 bg-white/10 rounded border border-white/15 font-bold text-slate-200">↑</kbd> <kbd className="px-1.5 py-0.5 bg-white/10 rounded border border-white/15 font-bold text-slate-200">↓</kbd></span>
            <span>Select: <kbd className="px-1.5 py-0.5 bg-white/10 rounded border border-white/15 font-bold text-slate-200">↵</kbd></span>
            <span>Close: <kbd className="px-1.5 py-0.5 bg-white/10 rounded border border-white/15 font-bold text-slate-200">esc</kbd></span>
          </div>
          <span className="font-bold text-saffron flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Jan-EPF AI • {activeName}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
