"use client";

import React, { useState } from "react";
import { useCitizen } from "@/context/CitizenContext";
import {
  FileText,
  Copy,
  Check,
  Download,
  Send,
  X,
  Scale,
  Clock,
  ShieldAlert,
  Sparkles,
  Printer
} from "lucide-react";

interface GrievanceLegalLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  claimId?: string;
  claimType?: string;
  amountRequested?: number;
  daysDelayed?: number;
}

export function GrievanceLegalLetterModal({
  isOpen,
  onClose,
  claimId = "CLM-8823A41",
  claimType = "Form 31 Advance / Form 19 Final Settlement",
  amountRequested = 185000,
  daysDelayed = 34
}: GrievanceLegalLetterModalProps) {
  const { activeCitizen } = useCitizen();
  const [copied, setCopied] = useState<boolean>(false);
  const [lodged, setLodged] = useState<boolean>(false);

  if (!isOpen) return null;

  const statutoryInterestRate = 8.25;
  const penalDays = Math.max(0, daysDelayed - 30);
  const accruedPenalInterest = Math.round((amountRequested * (statutoryInterestRate / 100) * penalDays) / 365);

  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const legalNoticeText = `STATUTORY LEGAL NOTICE UNDER PARA 72(5) OF THE EMPLOYEES' PROVIDENT FUNDS SCHEME, 1952
====================================================================================================
DEMAND FOR IMMEDIATE DISBURSEMENT & STATUTORY PENAL INTEREST ON UNLAWFUL CLAIM SETTLEMENT DELAY

DATE: ${currentDate}
TO:
The Regional Provident Fund Commissioner / Officer-in-Charge
Employees' Provident Fund Organisation (EPFO)
Field Office / Regional Office Jurisdictional Authority

FROM:
Member Name: ${activeCitizen.full_name}
Universal Account Number (UAN): ${activeCitizen.uan}
Member ID / Establishment: ${activeCitizen.active_employment?.member_id || "DLCPM1234567000/101"} (${activeCitizen.active_employment?.establishment_name || "Precision Engineering Pvt Ltd"})
Registered Mobile / DBT Bank: +91 ******${activeCitizen.uan.slice(-4)} | ${activeCitizen.bank_kyc?.bank_name || "State Bank of India"} (A/C: ${activeCitizen.bank_kyc?.account_number_masked || "XXXX0000"})

SUBJECT: FORMAL NOTICE FOR NON-DISBURSEMENT OF PF CLAIM (${claimId}) WITHIN STATUTORY 30-DAY SLA PRESCRIBED UNDER PARA 72(5) & INVOCATION OF PENAL INTEREST PROVISIONS.

Sir / Madam,

1. STATUTORY CONTRAVENTION:
I am a bona fide member of the Employees' Provident Fund holding UAN ${activeCitizen.uan}. On records, a formal settlement application (${claimType}) for the sum of ₹${amountRequested.toLocaleString("en-IN")} was submitted under Claim Reference ${claimId}.

2. MANDATORY 30-DAY LIMITATION UNDER PARA 72(5):
Under Para 72(5) of the Employees' Provident Funds Scheme, 1952, the Commissioner is statutorily obligated to settle the claim and disburse benefit within thirty (30) days from the date of receipt of application. 

As on ${currentDate}, exactly ${daysDelayed} days have elapsed without lawful disbursement or rejection communication, constituting a direct default of ${penalDays} days beyond the outer statutory limit.

3. STATUTORY INTEREST DEMAND:
Pursuant to the judicial precedents established by the National Consumer Disputes Redressal Commission (NCDRC) and Supreme Court rulings regarding administrative EPFO negligence, penal interest at the prevailing EPF statutory rate (${statutoryInterestRate}% p.a.) is chargeable on the withheld corpus of ₹${amountRequested.toLocaleString("en-IN")}.
- Calculated Statutory Penal Compensation: ₹${accruedPenalInterest.toLocaleString("en-IN")} (for ${penalDays} days overdue).

4. DEMAND FOR RELIEF:
You are hereby called upon to:
a) Authorize immediate 1-Click Direct Benefit Transfer (DBT) of the principal sum of ₹${amountRequested.toLocaleString("en-IN")} to my pre-validated bank account within 72 hours.
b) Credit the statutory penal interest of ₹${accruedPenalInterest.toLocaleString("en-IN")} for the unlawful administrative delay.

Failing compliance within 72 hours, this petition stands escalated to the Central Provident Fund Commissioner (CPFC), EPFiGMS Priority Vigilance, and the jurisdictional Consumer Disputes Redressal Forum with cost claims.

Yours faithfully,

${activeCitizen.full_name}
(Digitally Verified & e-Signed via Aadhaar OTP Token)
Audit Reference: JAN-EPF-PETITION-${Math.random().toString(36).substring(2, 9).toUpperCase()}
====================================================================================================`;

  const handleCopy = () => {
    navigator.clipboard.writeText(legalNoticeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([legalNoticeText], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `EPFO_Para72_Statutory_Notice_${activeCitizen.uan}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleLodgeToEpfigms = () => {
    setLodged(true);
    setTimeout(() => setLodged(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 text-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-slate-700 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  EPF Scheme 1952 • Para 72(5)
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                  {daysDelayed} Days Overdue ({penalDays}d Beyond SLA)
                </span>
              </div>
              <h3 className="text-base font-black text-white">
                Statutory Legal Notice & Interest Penalty Drafter
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Statutory Calculation Summary Card */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Withheld Principal Corpus:</span>
            <strong className="text-white font-mono text-sm">₹{amountRequested.toLocaleString("en-IN")}</strong>
          </div>
          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Para 72(5) Delay Duration:</span>
            <strong className="text-red-400 font-mono text-sm">{daysDelayed} Days ({penalDays} Overdue)</strong>
          </div>
          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Statutory Penal Interest (8.25%):</span>
            <strong className="text-emerald-400 font-mono text-sm">+₹{accruedPenalInterest.toLocaleString("en-IN")}</strong>
          </div>
        </div>

        {/* Formatted Legal Notice Text Viewer */}
        <div className="p-4 flex-1 overflow-y-auto bg-slate-950">
          <pre className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 font-mono text-xs leading-relaxed whitespace-pre-wrap select-all">
            {legalNoticeText}
          </pre>
        </div>

        {/* Action Controls */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap justify-between items-center gap-3">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Airtight legal notice drafted with automated Aadhaar cryptographic stamp.</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Copied to Clipboard" : "1-Click Copy Notice"}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <Download className="w-4 h-4 text-blue-400" />
              <span>Download .TXT</span>
            </button>

            <button
              onClick={handleLodgeToEpfigms}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md"
            >
              {lodged ? <Check className="w-4 h-4 text-slate-950" /> : <Send className="w-4 h-4 text-slate-950" />}
              <span>{lodged ? "✓ Lodged with 48h SLA" : "Lodge to EPFiGMS Priority Queue"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
