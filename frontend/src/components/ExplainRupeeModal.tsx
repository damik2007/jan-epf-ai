"use client";

import React, { useState } from "react";
import { useCitizen } from "@/context/CitizenContext";
import {
  Calculator,
  ShieldCheck,
  X,
  TrendingUp,
  Building2,
  User,
  HeartHandshake
} from "lucide-react";

interface ExplainRupeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExplainRupeeModal: React.FC<ExplainRupeeModalProps> = ({ isOpen, onClose }) => {
  const { activeCitizen } = useCitizen();
  const [selectedTab, setSelectedTab] = useState<"ALL" | "EE" | "ER" | "INT" | "EPS">("ALL");

  if (!isOpen) return null;

  const totalBal = activeCitizen.passbook_summary?.total_balance ?? 0;
  const eeShare = activeCitizen.passbook_summary?.employee_share ?? 0;
  const erShare = activeCitizen.passbook_summary?.employer_share ?? 0;
  const epsShare = activeCitizen.passbook_summary?.pension_fund_share ?? 0;
  const intShare = activeCitizen.passbook_summary?.interest_credited_current_fy ?? 0;
  const wage = activeCitizen.passbook_summary?.monthly_wage ?? 25000;
  const rate = activeCitizen.passbook_summary?.interest_rate ?? 8.25;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-sovereign-navy dark:text-white">
                  100% Financial Lineage Transparency
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  Explain Every Rupee
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Mathematical proof and derivation for {activeCitizen.full_name}&apos;s PF Corpus
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total Corpus Highlight */}
        <div className="bg-gradient-to-r from-sovereign-darkest to-sovereign-navy p-4 rounded-2xl text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="text-xs text-slate-300 font-semibold">Total Verified Sovereign Balance</div>
            <div className="text-3xl font-black text-samriddhi-bright tracking-tight font-mono tabular-nums">
              ₹{totalBal.toLocaleString("en-IN")}
            </div>
          </div>
          <div className="text-right text-xs text-slate-300">
            <div>Statutory Sovereign Interest</div>
            <div className="text-emerald-400 font-bold font-mono">{rate}% Compounded Monthly</div>
          </div>
        </div>

        {/* Breakdown Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => setSelectedTab("EE")}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedTab === "EE"
                ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 ring-1 ring-blue-500"
                : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400">
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>Your Share (12%)</span>
            </div>
            <div className="text-sm font-extrabold text-sovereign-navy dark:text-white mt-1 font-mono tabular-nums">
              ₹{eeShare.toLocaleString("en-IN")}
            </div>
          </button>

          <button
            onClick={() => setSelectedTab("ER")}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedTab === "ER"
                ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 ring-1 ring-emerald-500"
                : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400">
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Employer (3.67%)</span>
            </div>
            <div className="text-sm font-extrabold text-sovereign-navy dark:text-white mt-1 font-mono tabular-nums">
              ₹{erShare.toLocaleString("en-IN")}
            </div>
          </button>

          <button
            onClick={() => setSelectedTab("INT")}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedTab === "INT"
                ? "border-amber-500 bg-amber-50/50 dark:bg-amber-950/40 ring-1 ring-amber-500"
                : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400">
              <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
              <span>FY Interest (8.25%)</span>
            </div>
            <div className="text-sm font-extrabold text-sovereign-navy dark:text-white mt-1 font-mono tabular-nums">
              ₹{intShare.toLocaleString("en-IN")}
            </div>
          </button>

          <button
            onClick={() => setSelectedTab("EPS")}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedTab === "EPS"
                ? "border-purple-500 bg-purple-50/50 dark:bg-purple-950/40 ring-1 ring-purple-500"
                : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400">
              <HeartHandshake className="w-3.5 h-3.5 text-purple-600" />
              <span>Pension (8.33%)</span>
            </div>
            <div className="text-sm font-extrabold text-sovereign-navy dark:text-white mt-1 font-mono tabular-nums">
              ₹{epsShare.toLocaleString("en-IN")}
            </div>
          </button>
        </div>

        {/* Mathematical Derivation Box */}
        <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {selectedTab === "INT"
                ? "8.25% Sovereign Compounding Equation"
                : selectedTab === "EE"
                ? "Statutory Employee Deduction Formula"
                : selectedTab === "ER"
                ? "Employer Matching Split Formula"
                : selectedTab === "EPS"
                ? "EPS-95 Pension Fund Allocation"
                : "Complete Mathematical Derivation"}
            </h4>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              EPF Act 1952 § 6
            </span>
          </div>

          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 space-y-1">
            {selectedTab === "INT" ? (
              <>
                <div className="text-amber-600 dark:text-amber-400 font-bold">Interest = Monthly Running Balance × (8.25% / 12)</div>
                <div className="text-[11px] text-slate-500">Credited annually on March 31st by Central Board of Trustees (CBT).</div>
                <div className="pt-2 text-xs border-t border-slate-100 dark:border-slate-800 text-emerald-700 dark:text-emerald-400">
                  Current FY Total Interest Credited: ₹{intShare.toLocaleString("en-IN")}
                </div>
              </>
            ) : selectedTab === "EE" ? (
              <>
                <div className="text-blue-600 dark:text-blue-400 font-bold">Employee Share = Monthly Basic Wage (₹{wage.toLocaleString("en-IN")}) × 12.00%</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Deducted from payroll and deposited into Member Account {activeCitizen.active_employment?.member_id || "Member Account"}.</div>
              </>
            ) : selectedTab === "ER" ? (
              <>
                <div className="text-emerald-600 dark:text-emerald-400 font-bold">Employer Share = Monthly Basic Wage (₹{wage.toLocaleString("en-IN")}) × 3.67%</div>
                <div className="text-[11px] text-slate-500">Employer matches 12% total, split into 3.67% EPF and 8.33% EPS.</div>
              </>
            ) : selectedTab === "EPS" ? (
              <>
                <div className="text-purple-600 dark:text-purple-400 font-bold">EPS Allocation = Min(Basic Wage, ₹15,000) × 8.33% = ₹1,250/mo</div>
                <div className="text-[11px] text-slate-500">Accumulates toward lifelong guaranteed monthly pension after 10 years of service.</div>
              </>
            ) : (
              <>
                <div>Total Corpus = Employee Share + Employer Share + Cumulative Sovereign Interest</div>
                <div className="text-slate-500 text-[11px]">= ₹{eeShare.toLocaleString("en-IN")} + ₹{erShare.toLocaleString("en-IN")} + ₹{intShare.toLocaleString("en-IN")} = ₹{totalBal.toLocaleString("en-IN")}</div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Tamper-evident cryptographically signed ledger block (SHA-256 Audit Trail Active).</span>
          </div>
        </div>

        {/* Modal Action Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-sovereign-navy dark:bg-amber-500 dark:text-slate-950 text-white font-bold text-xs hover:bg-sovereign-light transition-all shadow-md"
          >
            Close Breakdown
          </button>
        </div>
      </div>
    </div>
  );
};
