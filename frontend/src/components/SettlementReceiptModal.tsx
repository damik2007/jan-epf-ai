"use client";

import React, { useState } from "react";
import { useCitizen } from "@/context/CitizenContext";
import {
  ShieldCheck,
  Printer,
  Download,
  CheckCircle2,
  X,
  QrCode,
  FileCheck,
  Building2,
  Calendar,
  CreditCard
} from "lucide-react";

interface SettlementReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  claimType?: string;
  claimAmount?: number;
  trackingId?: string;
}

export function SettlementReceiptModal({
  isOpen,
  onClose,
  claimType = "Form 31 Advance (Para 68J)",
  claimAmount = 156000,
  trackingId = "CLM-EPF-2026-89412"
}: SettlementReceiptModalProps) {
  const { activeCitizen } = useCitizen();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const shaToken = `SHA256:7f8a9b2c${activeCitizen.uan.slice(0, 4)}e5d14006affa3bab42c95275${Date.now().toString().slice(-6)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Action Bar */}
        <div className="bg-sovereign-navy text-white px-6 py-4 flex justify-between items-center print:hidden">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-saffron" />
            <span className="font-bold text-sm">Official Statutory Settlement Certificate</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-saffron text-sovereign-darkest font-bold text-xs hover:bg-amber-400 transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Body */}
        <div className="p-8 overflow-y-auto space-y-6 bg-white text-slate-900 print:p-0 print:space-y-4">
          {/* Institutional Watermark / Header */}
          <div className="border-b-2 border-sovereign-navy pb-4 flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-sovereign-navy" />
                <span className="text-xl font-black tracking-tight text-sovereign-navy uppercase">
                  Jan-EPF AI Sovereign Gateway
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-600">
                Digital Public Infrastructure • Zero-Rejection Statutory Protocol
              </p>
              <p className="text-[10px] text-slate-500 font-mono">
                Statutory Compliance: Employees&apos; Provident Funds &amp; Miscellaneous Provisions Act, 1952
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block px-2.5 py-1 rounded-md bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                Sanctioned • 100% Pre-Flight Verified
              </span>
              <p className="text-xs font-mono font-bold text-slate-800 mt-1">
                Ref: {trackingId}
              </p>
            </div>
          </div>

          {/* Citizen & Establishment Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Member Name</span>
              <strong className="text-sm text-sovereign-navy">{activeCitizen.full_name}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Universal Account Number (UAN)</span>
              <strong className="text-sm font-mono text-sovereign-navy">{activeCitizen.uan}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Aadhaar (Masked)</span>
              <span className="font-mono font-semibold">{activeCitizen.aadhaar_masked || "XXXX-XXXX-4819"}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">PAN (Masked)</span>
              <span className="font-mono font-semibold">{activeCitizen.pan_masked || "ABCDE1234F"}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Establishment Name</span>
              <span className="font-medium truncate block">
                {activeCitizen.active_employment?.establishment_name || "Precision Auto Components Pvt Ltd"}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Disbursement Bank &amp; IFSC</span>
              <span className="font-mono font-semibold">
                {activeCitizen.bank_kyc?.bank_name} ({activeCitizen.bank_kyc?.ifsc_code})
              </span>
            </div>
          </div>

          {/* Statutory Settlement Summary Card */}
          <div className="border-2 border-emerald-300 bg-emerald-50/50 p-4 rounded-2xl space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                  Sanctioned Payout Amount
                </span>
                <div className="text-2xl font-black font-mono text-emerald-700">
                  ₹{claimAmount.toLocaleString("en-IN")}
                </div>
              </div>
              <div className="text-right text-xs">
                <span className="text-[10px] font-bold text-emerald-900 uppercase block">Settlement SLA</span>
                <span className="font-bold text-emerald-700">Sub-24 Hours Direct DBT</span>
              </div>
            </div>

            <div className="pt-2 border-t border-emerald-200 text-[11px] text-emerald-900 space-y-1">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span><strong>Statutory Clause:</strong> Non-refundable advance sanctioned under {claimType}.</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span><strong>Section 192A TDS Shield:</strong> Form 15G automatically attached — 0% tax deducted (Saved ₹24,000 TDS).</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span><strong>NPCI Bank Verification:</strong> Account holder match verified in 30ms via ₹1.00 Penny Drop handshake.</span>
              </div>
            </div>
          </div>

          {/* Cryptographic Audit Token & QR Code */}
          <div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-2xl text-xs">
            <div className="space-y-1 max-w-[80%]">
              <span className="text-[10px] font-mono text-saffron uppercase font-bold block">
                Cryptographic SHA-256 Audit Seal
              </span>
              <p className="font-mono text-[10px] text-slate-300 break-all">
                {shaToken}
              </p>
              <p className="text-[10px] text-slate-400">
                Timestamp: {currentDate} • Verified on Sovereign 80/20 Deterministic Engine
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white text-slate-950 flex items-center justify-center shrink-0">
              <QrCode className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 text-[10px] text-slate-500 flex justify-between items-center print:border-none">
          <span>Official Proof-of-Concept Document • Build What Moves India (2026)</span>
          <span className="font-semibold text-sovereign-navy">Jan-EPF AI</span>
        </div>
      </div>
    </div>
  );
}
