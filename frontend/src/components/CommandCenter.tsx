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
  ArrowRight
} from "lucide-react";

interface CommandCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandCenter({ isOpen, onClose }: CommandCenterProps) {
  const router = useRouter();
  const {
    citizens,
    activeCitizen,
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

  // Define searchable action items
  const items = [
    // Personas
    {
      id: "persona-ramesh",
      category: "Demographic Personas",
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
      category: "Demographic Personas",
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
      category: "Demographic Personas",
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
      category: "Demographic Personas",
      title: "Sunita Devi (Gig Economy)",
      subtitle: "UAN: 101889977665 • Tests e-Nomination & ₹7L EDLI",
      icon: User,
      action: () => {
        switchCitizen("101889977665");
        onClose();
      }
    },
    // Navigation Hubs
    {
      id: "nav-money",
      category: "Life-Event Hubs",
      title: "I Need Money (Advance Withdrawal)",
      subtitle: "Statutory Form 31 Advance with Instant Pre-Flight Check",
      icon: Wallet,
      action: () => {
        router.push("/money");
        onClose();
      }
    },
    {
      id: "nav-career",
      category: "Life-Event Hubs",
      title: "I Changed Jobs (PF Transfer & DOE)",
      subtitle: "1-Click Multi-Job Consolidation & Section 192A TDS Shield",
      icon: Briefcase,
      action: () => {
        router.push("/career");
        onClose();
      }
    },
    {
      id: "nav-savings",
      category: "Life-Event Hubs",
      title: "My Savings & 8.25% Compounding",
      subtitle: "Visual Passbook Triple-Split & Retirement Wealth Curve",
      icon: PiggyBank,
      action: () => {
        router.push("/savings");
        onClose();
      }
    },
    {
      id: "nav-fix",
      category: "Life-Event Hubs",
      title: "Fix My Details (Self-Correction)",
      subtitle: "Levenshtein Fuzzy Match, NPCI Penny Drop & Joint Declaration",
      icon: Wrench,
      action: () => {
        router.push("/fix");
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

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command, citizen persona, or hub... (e.g. 'Priya', 'Money', 'Senior')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          <div className="flex items-center gap-1.5">
            <kbd className="px-2 py-0.5 text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 rounded border border-slate-200 dark:border-slate-700">
              ESC
            </kbd>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
              No results found for &ldquo;{query}&rdquo;
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
                  className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                    isSelected
                      ? "bg-saffron/10 dark:bg-amber-500/10 text-sovereign-navy dark:text-white border border-saffron/30 dark:border-amber-500/30"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isSelected
                          ? "bg-saffron text-sovereign-darkest font-bold"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold flex items-center gap-2">
                        <span>{item.title}</span>
                        <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <ArrowRight className="w-4 h-4 text-saffron dark:text-amber-400 shrink-0" />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Quick Tips */}
        <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span>Navigation: <kbd className="font-mono font-bold">↑</kbd> <kbd className="font-mono font-bold">↓</kbd></span>
            <span>Select: <kbd className="font-mono font-bold">↵</kbd></span>
            <span>Close: <kbd className="font-mono font-bold">esc</kbd></span>
          </div>
          <span className="font-semibold text-saffron">Jan-EPF AI Command Center</span>
        </div>
      </div>
    </div>
  );
}
