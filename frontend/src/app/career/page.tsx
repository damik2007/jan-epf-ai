"use client";

import React, { useState } from "react";
import { useCitizen } from "@/context/CitizenContext";
import { deduceMissingDateOfExit, calculateTdsDeduction } from "@/lib/deterministicEngine";
import { getTranslation } from "@/lib/translations";
import {
  Briefcase,
  ArrowRightLeft,
  CalendarCheck,
  CheckCircle2,
  FileCheck2
} from "lucide-react";

export default function ChangedJobsHub() {
  const { activeCitizen, addClaim, mergeEmployment, language } = useCitizen();
  const t = getTranslation(language);

  const [transferSuccess, setTransferSuccess] = useState<boolean>(false);
  const [isTransferring, setIsTransferring] = useState<boolean>(false);
  const [form15gAccepted, setForm15gAccepted] = useState<boolean>(true);
  const [settlementSuccess, setSettlementSuccess] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"TRANSFER" | "SETTLEMENT">("TRANSFER");

  const history = activeCitizen.employment_history || [
    {
      member_id: "TSHYD00543210000012345",
      establishment_name: "Previous Company Ltd",
      date_of_joining: "2021-07-01",
      date_of_exit: null,
      balance: 185000.0,
      transfer_status: "PENDING_MERGE",
      last_ecr_wage_month: "2023-08-01"
    },
    {
      member_id: "TSHYD00987650000045678",
      establishment_name: activeCitizen.active_employment?.establishment_name || "Current Active Company",
      date_of_joining: "2023-09-01",
      date_of_exit: null,
      balance: 290000.0,
      transfer_status: "CURRENT_ACTIVE"
    }
  ];

  const previousJob = history[0];
  const currentJob = history[1] || history[0];

  // Auto-deduce exit date
  const deducedExitDate = previousJob.last_ecr_wage_month
    ? deduceMissingDateOfExit(previousJob.last_ecr_wage_month)
    : "2023-08-31";

  // Section 192A TDS calculation
  const tdsCalc = calculateTdsDeduction(
    activeCitizen.active_employment?.total_service_years || 3.0,
    activeCitizen.passbook_summary?.total_balance || 150000,
    Boolean(activeCitizen.pan_masked),
    form15gAccepted
  );

  const handle1ClickTransfer = async () => {
    setIsTransferring(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/claims/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uan: activeCitizen.uan,
          claim_type: "FORM_13_TRANSFER",
          amount_requested: previousJob.balance || 185000,
          reason_code: "FORM_13_MERGE",
          source_member_id: previousJob.member_id,
          target_member_id: currentJob.member_id
        }),
        signal: AbortSignal.timeout(600)
      });
      if (res.ok) {
        const data = await res.json();
        addClaim({
          claim_id: data.claim_id,
          uan: data.uan,
          claim_type: "FORM_13_TRANSFER",
          amount_requested: previousJob.balance,
          amount_sanctioned: data.amount_sanctioned,
          status: "AUTO_APPROVED",
          tds_deducted: 0,
          dbt_account: `Unified Single Ledger (${currentJob.establishment_name})`,
          timestamp: new Date().toLocaleTimeString()
        });
      }
    } catch (e) {
      console.warn("Transferring locally in sovereign mode");
    } finally {
      if (previousJob?.member_id) {
        mergeEmployment(previousJob.member_id);
      }
      setIsTransferring(false);
      setTransferSuccess(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-sovereign-navy">
              {t.careerTitle}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {t.careerSubtitle}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-slate-200 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab("TRANSFER")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "TRANSFER"
                ? "bg-white text-sovereign-navy shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🔄 {t.mergeTransferButton}
          </button>
          <button
            onClick={() => setActiveTab("SETTLEMENT")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "SETTLEMENT"
                ? "bg-white text-sovereign-navy shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            📋 {t.finalSettlementTitle}
          </button>
        </div>
      </div>

      {/* TAB 1: 1-CLICK PF TRANSFER */}
      {activeTab === "TRANSFER" && (
        <div className="space-y-6">
          {/* Member ID Timeline */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-sovereign-navy">
                {t.jobTimelineTitle}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
                2 Establishments
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Previous Employer Card */}
              <div className="p-4 rounded-xl border-2 border-amber-200 bg-amber-50/50 space-y-2 relative">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-amber-200 text-amber-900 rounded">
                    {t.previousCompany} ({t.pendingTransferBadge})
                  </span>
                  <span className="font-mono text-xs font-bold text-amber-900">
                    ₹{(previousJob.balance || 185000).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="font-bold text-sm text-slate-800">
                  {previousJob.establishment_name}
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  Member ID: {previousJob.member_id}
                </div>

                {/* Automated Exit Date Badge */}
                <div className="pt-2 border-t border-amber-200/60 flex items-center gap-1.5 text-xs text-amber-800">
                  <CalendarCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <span className="font-semibold">{t.autoExitDateBadge}: </span>
                    <strong className="text-slate-900">{deducedExitDate}</strong>
                    <span className="text-[10px] text-amber-700 block">
                      ({t.autoExitDateDesc})
                    </span>
                  </div>
                </div>
              </div>

              {/* Current Active Employer Card */}
              <div className="p-4 rounded-xl border-2 border-emerald-200 bg-emerald-50/50 space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded">
                    {t.currentCompany}
                  </span>
                  <span className="font-mono text-xs font-bold text-emerald-900">
                    ₹{(currentJob.balance || 290000).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="font-bold text-sm text-slate-800">
                  {currentJob.establishment_name}
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  Member ID: {currentJob.member_id}
                </div>
                <div className="pt-2 border-t border-emerald-200/60 flex items-center gap-1.5 text-xs text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">{t.verified}</span>
                </div>
              </div>
            </div>

            {/* Transfer Action Bar */}
            {!transferSuccess ? (
              <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-600">
                  {t.jobTimelineDesc} (₹{(previousJob.balance || 185000).toLocaleString("en-IN")})
                </div>
                <button
                  onClick={handle1ClickTransfer}
                  disabled={isTransferring}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-sovereign-navy hover:bg-sovereign-light text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all whitespace-nowrap"
                >
                  <ArrowRightLeft className="w-4 h-4 text-saffron" />
                  <span>{isTransferring ? t.mergingTransfer : t.mergeTransferButton}</span>
                </button>
              </div>
            ) : (
              <div className="p-4 bg-emerald-50 border-2 border-emerald-400 rounded-xl flex items-center gap-3 text-xs text-emerald-900">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-extrabold text-sm text-emerald-900">
                    {t.transferSuccessTitle}
                  </h4>
                  <p className="text-emerald-700 mt-0.5">
                    {t.transferSuccessDesc}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: FULL & FINAL SETTLEMENT (FORM 19/10C + FORM 15G ZERO-TDS) */}
      {activeTab === "SETTLEMENT" && (
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-sovereign-navy">
                {t.finalSettlementTitle}
              </h3>
              <p className="text-xs text-slate-500">
                {t.finalSettlementDesc}
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-full">
              Form 15G Protected
            </span>
          </div>

          {/* Section 192A Tax Protection Card */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">{t.finalSettlementTitle}:</span>
              <span className="font-mono font-extrabold text-slate-900">
                ₹{(activeCitizen.passbook_summary?.total_balance || 150000).toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">{t.serviceDuration}</span>
              <span className="font-semibold text-slate-800">
                {activeCitizen.active_employment?.total_service_years || 3.0} Years
              </span>
            </div>

            {/* Form 15G Auto-Check Toggle */}
            <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-start gap-3">
              <input
                type="checkbox"
                id="form15g"
                checked={form15gAccepted}
                onChange={(e) => setForm15gAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 accent-sovereign-navy rounded cursor-pointer"
              />
              <label htmlFor="form15g" className="text-xs cursor-pointer">
                <strong className="text-slate-900 block font-semibold">
                  {t.zeroTdsShieldTitle}
                </strong>
                <span className="text-slate-500 text-[11px]">
                  {t.zeroTdsShieldDesc}
                </span>
              </label>
            </div>

            {/* TDS Result Calculation */}
            <div className={`p-3 rounded-lg border text-xs flex justify-between items-center ${
              tdsCalc.tdsAmount === 0 ? "bg-emerald-50 border-emerald-300 text-emerald-900" : "bg-amber-50 border-amber-300 text-amber-900"
            }`}>
              <div>
                <span className="font-bold block">TDS: ₹{tdsCalc.tdsAmount} ({tdsCalc.tdsRatePercent}%)</span>
                <span className="text-[10px]">{tdsCalc.reason}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">{t.amountSanctionedLabel}</span>
                <span className="font-mono font-extrabold text-base text-slate-900">
                  ₹{tdsCalc.netDisbursement.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setSettlementSuccess(true)}
              className="flex items-center gap-2 bg-sovereign-navy hover:bg-sovereign-light text-white px-7 py-3 rounded-xl font-bold text-sm shadow-md transition-all"
            >
              <FileCheck2 className="w-4 h-4 text-saffron" />
              <span>{t.claimSettlementButton}</span>
            </button>
          </div>

          {settlementSuccess && (
            <div className="p-4 bg-emerald-50 border-2 border-emerald-400 rounded-xl flex items-center gap-3 text-xs text-emerald-900">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <h4 className="font-extrabold text-sm">{t.sanctionConfirmedTitle}</h4>
                <p className="text-emerald-700 mt-0.5">
                  ₹{tdsCalc.netDisbursement.toLocaleString("en-IN")} {t.disbursedToLabel} {activeCitizen.bank_kyc.bank_name}.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
