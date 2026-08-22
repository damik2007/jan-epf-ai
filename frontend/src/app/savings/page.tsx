"use client";

import React, { useState } from "react";
import { useCitizen } from "@/context/CitizenContext";
import { calculatePassbookCompounding } from "@/lib/deterministicEngine";
import { getTranslation } from "@/lib/translations";
import {
  PiggyBank,
  Shield,
  Download,
  Sparkles,
  Award,
  CheckCircle2,
  Radar
} from "lucide-react";

export default function MySavingsHub() {
  const { activeCitizen, claimsHistory, renewDLC, language } = useCitizen();
  const t = getTranslation(language);

  const [currentAge, setCurrentAge] = useState<number>(36);
  const [monthlyEmp, setMonthlyEmp] = useState<number>(2600);
  const [monthlyEmpr, setMonthlyEmpr] = useState<number>(2600);
  const [simulatedRate, setSimulatedRate] = useState<number>(8.25);
  const [dlcRenewed, setDlcRenewed] = useState<boolean>(false);
  const [isRenewingDLC, setIsRenewingDLC] = useState<boolean>(false);

  const handleRenewDLC = () => {
    setIsRenewingDLC(true);
    setTimeout(() => {
      setIsRenewingDLC(false);
      setDlcRenewed(true);
      renewDLC();
    }, 700);
  };

  const summary = activeCitizen.passbook_summary || {
    total_balance: 0,
    employee_share: 0,
    employer_share: 0,
    pension_fund_share: 0,
    interest_credited_current_fy: 0
  };

  const totalBal = summary.total_balance || 0;
  const empShare = summary.employee_share || 0;
  const emprShare = summary.employer_share || 0;
  const epsShare = summary.pension_fund_share || 0;

  // Compounding Forecast Curve
  const forecast = calculatePassbookCompounding(
    totalBal,
    monthlyEmp,
    monthlyEmpr,
    currentAge,
    58,
    simulatedRate
  );

  const retirementTotal = forecast[forecast.length - 1]?.totalBalance || totalBal;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center">
              <PiggyBank className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-sovereign-navy">
              {t.savingsTitle}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {t.savingsSubtitle}
          </p>
        </div>

        <button
          onClick={() => alert("Downloading official tamper-evident PDF passbook statement...")}
          className="flex items-center gap-1.5 text-xs font-bold bg-white border border-slate-300 hover:border-sovereign-navy text-slate-700 px-3.5 py-2 rounded-xl shadow-sm transition-all"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Statement PDF</span>
        </button>
      </div>

      {/* SENIOR CITIZEN EPS-95 SPECIAL CARD (IF SENIOR) */}
      {activeCitizen.pension_details && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-300 p-5 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-600" />
              <div>
                <h3 className="text-base font-extrabold text-amber-950">
                  {t.pensionTitle}
                </h3>
                <p className="text-xs text-amber-800">PPO Number: {activeCitizen.pension_details.ppo_number}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {dlcRenewed ? "DLC Active (Valid FY 26-27)" : t.activeDLCBadge}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-white/80 p-3 rounded-xl border border-amber-200">
              <div className="text-[10px] text-slate-500">{t.monthlyPensionLabel}</div>
              <div className="text-xl font-extrabold text-amber-950 font-mono">
                ₹{activeCitizen.pension_details.monthly_pension_amount.toLocaleString("en-IN")}/mo
              </div>
            </div>
            <div className="bg-white/80 p-3 rounded-xl border border-amber-200">
              <div className="text-[10px] text-slate-500">Disbursement</div>
              <div className="text-sm font-bold text-slate-800">
                {activeCitizen.pension_details.last_disbursement_date}
              </div>
            </div>
            <div className="bg-white/80 p-3 rounded-xl border border-amber-200">
              <div className="text-[10px] text-slate-500">{t.lifeCertificateStatus}</div>
              <div className="text-sm font-bold text-emerald-700">
                {dlcRenewed ? "Auto-Verified (Face RD)" : t.verified}
              </div>
            </div>
          </div>

          {/* Interactive Jeevan Pramaan Renewal Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 border-t border-amber-200/60">
            <p className="text-xs text-amber-900 font-medium">
              💡 Jeevan Pramaan Facial Biometric Authentication is ready.
            </p>
            <button
              type="button"
              onClick={handleRenewDLC}
              disabled={isRenewingDLC}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isRenewingDLC ? "Authenticating Face RD..." : (dlcRenewed ? "DLC Renewed Successfully" : "1-Click Jeevan Pramaan Face DLC")}</span>
            </button>
          </div>
        </div>
      )}

      {/* TRIPLE-SPLIT VISUAL PASSBOOK */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-sovereign-navy">
              {t.tripleSplitTitle}
            </h3>
            <p className="text-xs text-slate-500">
              {t.tripleSplitDesc}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500">{t.totalBalanceLabel}</span>
            <div className="text-2xl font-black text-sovereign-navy font-mono">
              ₹{totalBal.toLocaleString("en-IN")}
            </div>
          </div>
        </div>

        {/* Visual Progress Ratio Bar */}
        <div className="space-y-1.5">
          <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
            <div
              style={{ width: `${totalBal > 0 ? (empShare / totalBal) * 100 : 50}%` }}
              className="bg-emerald-500 h-full hover:opacity-90 transition-all"
              title={t.employeeShare}
            />
            <div
              style={{ width: `${totalBal > 0 ? (emprShare / totalBal) * 100 : 35}%` }}
              className="bg-blue-500 h-full hover:opacity-90 transition-all"
              title={t.employerShare}
            />
            <div
              style={{ width: `${totalBal > 0 ? (epsShare / totalBal) * 100 : 15}%` }}
              className="bg-amber-500 h-full hover:opacity-90 transition-all"
              title={t.pensionFundShare}
            />
          </div>
          <div className="flex justify-between text-[11px] font-semibold text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> {t.employeeShare}: ₹{empShare.toLocaleString("en-IN")}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> {t.employerShare}: ₹{emprShare.toLocaleString("en-IN")}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> {t.pensionFundShare}: ₹{epsShare.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Breakdown Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40">
            <span className="text-[10px] font-bold text-emerald-800 uppercase">{t.employeeShare}</span>
            <div className="text-lg font-extrabold text-emerald-950 font-mono mt-1">
              ₹{empShare.toLocaleString("en-IN")}
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Tax-Free Withdrawable</p>
          </div>

          <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40">
            <span className="text-[10px] font-bold text-blue-800 uppercase">{t.employerShare}</span>
            <div className="text-lg font-extrabold text-blue-950 font-mono mt-1">
              ₹{emprShare.toLocaleString("en-IN")}
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">{t.interestAccrualBadge}</p>
          </div>

          <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40">
            <span className="text-[10px] font-bold text-amber-800 uppercase">{t.interestAccrualBadge}</span>
            <div className="text-lg font-extrabold text-amber-950 font-mono mt-1">
              ₹{(summary.interest_credited_current_fy || 27400).toLocaleString("en-IN")}
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Sovereign Yield</p>
          </div>
        </div>
      </div>

      {/* EMPLOYER ECR COMPLIANCE RADAR (PF THEFT ALERT WATCHDOG) */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Radar className="w-5 h-5 text-emerald-600 animate-pulse" />
            <div>
              <h3 className="text-sm font-extrabold text-sovereign-navy">
                Employer ECR Compliance Radar (PF Theft Alert Watchdog)
              </h3>
              <p className="text-xs text-slate-500">
                Statutory monthly wage challan verification for {activeCitizen.active_employment?.establishment_name || "Active Employer"}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% On-Time Deposits (Zero Default)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 block">Last Salary Deducted</span>
            <strong className="text-slate-800 font-mono font-bold">₹{((activeCitizen.passbook_summary?.monthly_wage || 26000) * 0.12).toLocaleString("en-IN")} (12% Emp Share)</strong>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 block">EPFO ECR Deposit Date</span>
            <strong className="text-emerald-700 font-bold">14th July 2026 (Before 15th Deadline)</strong>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 block">Statutory Status</span>
            <strong className="text-emerald-700 font-bold">Protected • No Missing Challans</strong>
          </div>
        </div>
      </div>

      {/* 8.25% COMPOUNDING RETIREMENT WEALTH FORECASTER */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-saffron" />
              <h3 className="text-sm font-bold text-sovereign-navy">
                {t.forecasterTitle}
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              {t.forecasterDesc}
            </p>
          </div>

          {/* Samriddhi Pulse Tag */}
          <div className="bg-amber-50 border border-amber-300 px-3 py-1 rounded-xl text-right">
            <span className="text-[10px] text-amber-800 font-bold block">{t.estimatedRetirementCorpus}</span>
            <span className="text-xl font-black text-amber-900 font-mono">
              ₹{retirementTotal.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Interactive Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>{t.currentAgeLabel}</span>
              <span className="font-bold text-sovereign-navy">{currentAge} Years</span>
            </div>
            <input
              type="range"
              min="20"
              max="57"
              value={currentAge}
              onChange={(e) => setCurrentAge(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sovereign-navy"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>20 yrs</span>
              <span>{t.retirementAgeLabel}: 58 yrs ({58 - currentAge} yrs compounding)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Monthly Contribution:</span>
              <span className="font-bold text-sovereign-navy">₹{(monthlyEmp + monthlyEmpr).toLocaleString("en-IN")}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="15000"
              step="500"
              value={monthlyEmp}
              onChange={(e) => {
                setMonthlyEmp(Number(e.target.value));
                setMonthlyEmpr(Number(e.target.value));
              }}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sovereign-navy"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>₹2,000/mo</span>
              <span>₹30,000/mo</span>
            </div>
          </div>
        </div>

        {/* Visual Compounding Growth Trajectory Bars */}
        <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex justify-between text-xs font-bold text-slate-700">
            <span>📈 Sovereign Compounding Wealth Trajectory (8.25% Annual Yield)</span>
            <span className="text-amber-800 font-mono">₹{retirementTotal.toLocaleString("en-IN")} at Age 58</span>
          </div>
          <div className="h-28 flex items-end gap-1.5 pt-4 px-2">
            {forecast.filter((_, idx) => idx % Math.max(1, Math.floor(forecast.length / 14)) === 0 || idx === forecast.length - 1).map((point, i, arr) => {
              const maxVal = arr[arr.length - 1]?.totalBalance || 1;
              const heightPct = Math.max(10, Math.round((point.totalBalance / maxVal) * 100));
              return (
                <div key={point.year} className="flex-1 flex flex-col items-center gap-1 group">
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full bg-gradient-to-t from-sovereign-navy via-emerald-600 to-amber-400 rounded-t transition-all group-hover:brightness-110 relative"
                    title={`Age ${point.age} (${point.year}): ₹${point.totalBalance.toLocaleString("en-IN")}`}
                  />
                  <span className="text-[9px] text-slate-500 font-mono hidden sm:inline">{point.age}y</span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 border-t border-slate-200 pt-1">
            <span>Age {currentAge} (Now)</span>
            <span>Compounding Multiplier: ~{((retirementTotal / Math.max(1, totalBal))).toFixed(1)}x Initial Balance</span>
            <span>Age 58 (Retirement Target)</span>
          </div>
        </div>

        {/* Compounding Projection Table Preview */}
        <div className="overflow-x-auto max-h-48 rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 font-bold sticky top-0">
              <tr>
                <th className="p-2.5">Year</th>
                <th className="p-2.5">Age</th>
                <th className="p-2.5">{t.employeeShare}</th>
                <th className="p-2.5">{t.employerShare}</th>
                <th className="p-2.5">Annual Interest</th>
                <th className="p-2.5 text-right font-extrabold text-sovereign-navy">Total Corpus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {forecast.filter((_, idx) => idx % 2 === 0 || idx === forecast.length - 1).map((row) => (
                <tr key={row.year} className="hover:bg-slate-50">
                  <td className="p-2.5 font-medium">{row.year}</td>
                  <td className="p-2.5 text-slate-500">{row.age}</td>
                  <td className="p-2.5 font-mono">₹{row.employeeShare.toLocaleString("en-IN")}</td>
                  <td className="p-2.5 font-mono">₹{row.employerShare.toLocaleString("en-IN")}</td>
                  <td className="p-2.5 font-mono text-amber-700">₹{row.annualInterest.toLocaleString("en-IN")}</td>
                  <td className="p-2.5 text-right font-mono font-bold text-emerald-700">
                    ₹{row.totalBalance.toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDLI ₹7 LAKH LIFE INSURANCE CARD */}
      <div className="bg-gradient-to-r from-teal-900 to-sovereign-navy text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-saffron shrink-0 border border-white/10">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold text-saffron tracking-wider">
                {t.edliTitle}
              </span>
              <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-2 py-0.2 rounded border border-emerald-400/40">
                100% Free
              </span>
            </div>
            <h4 className="text-lg font-bold mt-0.5">{t.edliMaxCover}</h4>
            <p className="text-xs text-slate-300">
              {t.edliDesc}
            </p>
          </div>
        </div>

        <button
          onClick={() => alert("Nominee is registered. EDLI coverage certificate verified.")}
          className="bg-white text-sovereign-darkest hover:bg-slate-100 px-4 py-2 rounded-xl font-bold text-xs shadow transition-all whitespace-nowrap"
        >
          {t.verified}
        </button>
      </div>

      {/* PASSBOOK TRANSACTION & CLAIMS SETTLEMENT LEDGER */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sovereign-navy text-white flex items-center justify-center font-bold">
              <PiggyBank className="w-4 h-4 text-saffron" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-sovereign-navy">
                Passbook Transaction & Claims Settlement Ledger
              </h3>
              <p className="text-xs text-slate-500">
                Live immutable audit ledger with real-time claim debits and ECR wage credits
              </p>
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors border border-slate-200"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Passbook PDF</span>
          </button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Transaction Description</th>
                <th className="p-3">Type</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status & DBT Reference</th>
                <th className="p-3 text-right">Closing Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Dynamic Claim Debits (From User Submissions) */}
              {claimsHistory.map((claim) => (
                <tr key={claim.claim_id} className="bg-rose-50/40 hover:bg-rose-50/80 transition-colors">
                  <td className="p-3 font-mono text-slate-600">{claim.timestamp || "Today"}</td>
                  <td className="p-3 font-medium text-slate-900">
                    <span className="font-bold">{claim.claim_type.replace(/_/g, " ")}</span>
                    <span className="block text-[10px] text-slate-500">Claim Ref: {claim.claim_id}</span>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                      DEBIT (Advance)
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-rose-700">
                    - ₹{(claim.amount_sanctioned || claim.amount_requested).toLocaleString("en-IN")}
                  </td>
                  <td className="p-3">
                    <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Disbursed to {claim.dbt_account || "Bank Account"}
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-slate-900">
                    ₹{totalBal.toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}

              {/* Standard Monthly ECR Credits */}
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-mono text-slate-600">14-Jul-2026</td>
                <td className="p-3 font-medium text-slate-900">
                  <span>Monthly Wage Contribution (ECR Challan #98234)</span>
                  <span className="block text-[10px] text-slate-500">{activeCitizen.active_employment?.establishment_name || "Precision Auto Components"}</span>
                </td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    CREDIT (Salary)
                  </span>
                </td>
                <td className="p-3 font-mono font-bold text-emerald-700">
                  + ₹{((activeCitizen.passbook_summary?.monthly_wage || 26000) * 0.12).toLocaleString("en-IN")}
                </td>
                <td className="p-3 text-slate-600 text-[11px]">
                  Deposit on 14-Jul-2026 (On-Time)
                </td>
                <td className="p-3 text-right font-mono font-bold text-slate-900">
                  ₹{totalBal.toLocaleString("en-IN")}
                </td>
              </tr>

              <tr className="hover:bg-slate-50">
                <td className="p-3 font-mono text-slate-600">12-Jun-2026</td>
                <td className="p-3 font-medium text-slate-900">
                  <span>Monthly Wage Contribution (ECR Challan #97102)</span>
                  <span className="block text-[10px] text-slate-500">{activeCitizen.active_employment?.establishment_name || "Precision Auto Components"}</span>
                </td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    CREDIT (Salary)
                  </span>
                </td>
                <td className="p-3 font-mono font-bold text-emerald-700">
                  + ₹{((activeCitizen.passbook_summary?.monthly_wage || 26000) * 0.12).toLocaleString("en-IN")}
                </td>
                <td className="p-3 text-slate-600 text-[11px]">
                  Deposit on 12-Jun-2026 (On-Time)
                </td>
                <td className="p-3 text-right font-mono font-bold text-slate-900">
                  ₹{(totalBal - ((activeCitizen.passbook_summary?.monthly_wage || 26000) * 0.12)).toLocaleString("en-IN")}
                </td>
              </tr>

              <tr className="hover:bg-slate-50">
                <td className="p-3 font-mono text-slate-600">31-Mar-2026</td>
                <td className="p-3 font-medium text-slate-900">
                  <span>FY 2025-26 Annual Statutory Interest Credit (8.25%)</span>
                  <span className="block text-[10px] text-slate-500">EPFO Central Board of Trustees Annual Compound Settlement</span>
                </td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    CREDIT (Interest)
                  </span>
                </td>
                <td className="p-3 font-mono font-bold text-amber-700">
                  + ₹{(activeCitizen.passbook_summary?.interest_credited_current_fy || 27400).toLocaleString("en-IN")}
                </td>
                <td className="p-3 text-slate-600 text-[11px]">
                  Central CBT Statutory Order #2026-EPF-825
                </td>
                <td className="p-3 text-right font-mono font-bold text-slate-900">
                  ₹{(totalBal - 58000).toLocaleString("en-IN")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
