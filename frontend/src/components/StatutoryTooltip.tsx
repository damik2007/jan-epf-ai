"use client";

import React, { useState } from "react";
import { Info, HelpCircle } from "lucide-react";

export type StatutoryTermKey =
  | "para68j"
  | "para68b"
  | "para68k"
  | "ecr"
  | "section192a"
  | "form15g"
  | "edli"
  | "pennydrop"
  | "eps95"
  | "jeevanpramaan"
  | "doe"
  | "fuzzy";

interface StatutoryDefinition {
  title: string;
  clause: string;
  plainText: string;
  rupeeImpact: string;
}

const STATUTORY_DEFINITIONS: Record<StatutoryTermKey, StatutoryDefinition> = {
  para68j: {
    title: "Para 68J (Medical Emergency Advance)",
    clause: "Employees' Provident Fund Scheme, 1952 — Paragraph 68J",
    plainText:
      "Allows non-refundable withdrawal of up to 6 months of basic wages + DA or your total employee share for hospitalization or major medical treatment. Zero employer attestation required.",
    rupeeImpact: "Sub-24h Direct Bank Transfer without paperwork delays."
  },
  para68b: {
    title: "Para 68B (Housing & Construction Advance)",
    clause: "Employees' Provident Fund Scheme, 1952 — Paragraph 68B",
    plainText:
      "Permits withdrawal after 5 continuous years of contributory service to purchase, build, or renovate a house/flat. Up to 36 months basic wages or total balance.",
    rupeeImpact: "0% interest loan against your own sovereign retirement savings."
  },
  para68k: {
    title: "Para 68K (Marriage & Higher Education)",
    clause: "Employees' Provident Fund Scheme, 1952 — Paragraph 68K",
    plainText:
      "Allows withdrawal of up to 50% of employee share after 7 continuous years of service for post-matric education or marriage of self, children, or siblings.",
    rupeeImpact: "Zero loan debt for family milestones."
  },
  ecr: {
    title: "ECR (Electronic Challan cum Return)",
    clause: "EPFO Statutory Payroll Filing Protocol",
    plainText:
      "The mandatory monthly electronic payroll statement submitted by your employer to EPFO, proving your salary deductions and EPF credits.",
    rupeeImpact: "Jan-EPF AI auto-deduces missing Date of Exit from your last ECR timestamp."
  },
  section192a: {
    title: "Section 192A (TDS on PF Withdrawals)",
    clause: "Income Tax Act, 1961 — Section 192A",
    plainText:
      "A 20% tax deduction applied on PF withdrawals under ₹50,000 before 5 continuous years of service if PAN or Form 15G is missing.",
    rupeeImpact: "Jan-EPF AI auto-attaches Form 15G to save ₹20,000 on every ₹1 Lakh withdrawn."
  },
  form15g: {
    title: "Form 15G / 15H (Zero-TDS Declaration)",
    clause: "Income Tax Act, 1961 — Section 197A",
    plainText:
      "A statutory self-declaration submitted by citizens whose estimated total annual income is below the taxable threshold, legally exempting them from TDS.",
    rupeeImpact: "100% full payout credited with ₹0 tax deducted."
  },
  edli: {
    title: "EDLI (Deposit Linked Insurance Scheme)",
    clause: "Employees' Deposit-Linked Insurance Scheme, 1976",
    plainText:
      "Free statutory life insurance cover up to ₹7,00,000 provided automatically to all active EPF contributors at zero premium cost to the worker.",
    rupeeImpact: "₹7,00,000 financial security automatically linked to your nominee."
  },
  pennydrop: {
    title: "NPCI Bank Penny Drop Verification",
    clause: "NPCI Immediate Payment Service (IMPS) Protocol",
    plainText:
      "A real-time sub-second banking handshake that deposits ₹1.00 into your account to verify the registered account holder name matches your Aadhaar before releasing claim funds.",
    rupeeImpact: "Eliminates claim rejection due to wrong account numbers."
  },
  eps95: {
    title: "EPS-95 (Employees' Pension Scheme)",
    clause: "Employees' Pension Scheme, 1995",
    plainText:
      "Statutory pension scheme funded by 8.33% employer contribution, providing guaranteed lifelong monthly pension after age 58 and 10 years of service.",
    rupeeImpact: "Guaranteed monthly income in retirement."
  },
  jeevanpramaan: {
    title: "Jeevan Pramaan (Digital Life Certificate)",
    clause: "Government of India Biometric Pensioner Verification",
    plainText:
      "Facial/biometric authentication submitted annually from your smartphone to prove pensioner liveness and prevent monthly pension stoppage.",
    rupeeImpact: "Zero need to visit bank branches or EPFO offices in person."
  },
  doe: {
    title: "Date of Exit (DOE)",
    clause: "EPFO Member Profile Statutory Record",
    plainText:
      "Your official last working day at a previous company. If an employer forgets to mark it, Jan-EPF AI deduces it from your last monthly ECR contribution timestamp.",
    rupeeImpact: "Unlocks trapped funds from previous jobs in 1 click."
  },
  fuzzy: {
    title: "Levenshtein Fuzzy Name Matcher",
    clause: "Token-Sort Metric Distance (≥85% Threshold)",
    plainText:
      "Deterministic mathematical distance algorithm that detects minor typos between Aadhaar, PAN, and EPFO records (e.g. 'Ramesh Kumar' vs 'Ramesh Kumaar') and auto-accepts genuine matches.",
    rupeeImpact: "Eliminates 35% of all EPFO claim rejections instantly."
  }
};

interface StatutoryTooltipProps {
  termKey: StatutoryTermKey;
  children?: React.ReactNode;
  inline?: boolean;
}

export function StatutoryTooltip({ termKey, children, inline = true }: StatutoryTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const def = STATUTORY_DEFINITIONS[termKey];

  if (!def) return <>{children}</>;

  return (
    <span className="relative inline-flex items-center gap-1 group">
      {children && <span className="font-semibold">{children}</span>}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="text-amber-500 hover:text-amber-600 dark:text-amber-400 p-0.5 rounded-full hover:bg-amber-100/50 dark:hover:bg-amber-950/40 transition-colors focus:outline-none"
        title={`Click for statutory explanation: ${def.title}`}
        aria-label={`Learn about ${def.title}`}
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 sm:w-80 p-4 backdrop-blur-2xl bg-gradient-to-br from-slate-900/95 via-sovereign-darkest/95 to-sovereign-navy/95 text-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] border border-white/20 ring-1 ring-white/10 z-50 text-left animate-in fade-in zoom-in-95 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-2 border-b border-white/15 pb-2 mb-2.5">
            <div>
              <h4 className="text-xs font-black text-saffron">{def.title}</h4>
              <p className="text-[10px] text-slate-300 font-mono mt-0.5">{def.clause}</p>
            </div>
            <span className="text-[9px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full font-bold uppercase tracking-wider shrink-0">
              Legal Shield
            </span>
          </div>

          <p className="text-[11px] text-slate-200 leading-relaxed mb-2.5 font-normal">
            {def.plainText}
          </p>

          <div className="p-2.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-[10px] text-emerald-300 flex items-start gap-1.5 shadow-inner">
            <span className="font-bold text-amber-300 shrink-0">💡 Citizen Impact:</span>
            <span className="text-slate-200">{def.rupeeImpact}</span>
          </div>
        </div>
      )}
    </span>
  );
}
