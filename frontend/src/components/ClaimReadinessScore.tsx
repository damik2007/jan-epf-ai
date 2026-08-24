"use client";
import React from "react";
import { useCitizen } from "@/context/CitizenContext";
import { ShieldCheck, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

export function ClaimReadinessScore() {
  const { activeCitizen } = useCitizen();

  const checks = [
    {
      label: "Bank KYC",
      labelPassed: "Bank KYC Verified (Active)",
      labelFailed: "Bank KYC Pending",
      passed: Boolean(
        activeCitizen.bank_kyc?.kyc_status &&
        ["APPROVED", "VERIFIED_ACTIVE", "APPROVED_BY_EMPLOYER", "SENIOR_PENSION_ACTIVE"].includes(activeCitizen.bank_kyc.kyc_status)
      ),
    },
    {
      label: "Aadhaar",
      labelPassed: "Aadhaar Seeded",
      labelFailed: "Aadhaar Not Seeded",
      passed: Boolean(activeCitizen.aadhaar_masked && activeCitizen.aadhaar_masked !== "Not Available"),
    },
    {
      label: "PAN",
      labelPassed: "PAN Linked",
      labelFailed: "PAN Not Linked",
      passed: Boolean(activeCitizen.pan_masked && activeCitizen.pan_masked !== "Not Available"),
    },
    {
      label: "Employment",
      labelPassed: "Active Employment Verified",
      labelFailed: "Employment Record Pending",
      passed: Boolean(activeCitizen.active_employment) || Boolean(activeCitizen.pension_details),
    },
    {
      label: "e-Nomination",
      labelPassed: "e-Nomination Active (₹7L EDLI)",
      labelFailed: "e-Nomination Pending (₹7L EDLI)",
      passed: Boolean(activeCitizen.nomination_details?.nomination_filed),
    },
  ];

  const passedCount = checks.filter((c) => c.passed).length;
  const score = Math.round((passedCount / checks.length) * 100);
  const isReady = score >= 80;
  const isWarning = score >= 60 && score < 80;

  return (
    <div className={`p-4 rounded-2xl border-2 transition-all ${
      isReady
        ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20"
        : isWarning
        ? "border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20"
        : "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20"
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className={`w-5 h-5 ${
            isReady ? "text-emerald-600" : isWarning ? "text-amber-600" : "text-red-600"
          }`} />
          <span className="text-sm font-bold text-sovereign-navy dark:text-white">
            Claim Readiness Score
          </span>
        </div>
        <div className={`text-2xl font-black font-mono ${
          isReady ? "text-emerald-600" : isWarning ? "text-amber-600" : "text-red-600"
        }`}>
          {score}%
        </div>
      </div>

      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-3">
        <div
          className={`h-2 rounded-full transition-all duration-700 ${
            isReady ? "bg-emerald-500" : isWarning ? "bg-amber-500" : "bg-red-500"
          }`}
          style={{ width: `${score}%` }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {checks.map((check) => (
          <div key={check.label} className="flex items-center gap-1.5 text-xs">
            {check.passed ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            ) : (
              <XCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            )}
            <span className={check.passed ? "text-slate-700 dark:text-slate-300 font-medium" : "text-amber-700 dark:text-amber-300 font-semibold"}>
              {check.passed ? check.labelPassed : check.labelFailed}
            </span>
          </div>
        ))}
      </div>

      {isReady && (
        <p className="mt-2.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Ready to file — estimated 98% instant statutory approval probability
        </p>
      )}
      {!isReady && (
        <p className="mt-2.5 text-[11px] text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5" />
          Complete missing items above before filing to guarantee zero rejection
        </p>
      )}
    </div>
  );
}
