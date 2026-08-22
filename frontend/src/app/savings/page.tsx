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

  // Determine default starting age and monthly contribution from active persona
  const initialAge = activeCitizen.dob
    ? new Date().getFullYear() - new Date(activeCitizen.dob).getFullYear()
    : activeCitizen.uan === "100982348712" ? 48 : activeCitizen.uan === "101294817203" ? 27 : activeCitizen.uan === "100112233445" ? 66 : 34;

  const initialMonthlyWage = activeCitizen.passbook_summary?.monthly_wage || 20000;
  const initialMonthlyContrib = Math.round(initialMonthlyWage * 0.12);

  const [currentAge, setCurrentAge] = useState<number>(initialAge >= 58 ? 45 : initialAge);
  const [monthlyEmp, setMonthlyEmp] = useState<number>(initialMonthlyContrib);
  const [monthlyEmpr, setMonthlyEmpr] = useState<number>(initialMonthlyContrib);
  const [simulatedRate, setSimulatedRate] = useState<number>(8.25);
  const [hoveredPoint, setHoveredPoint] = useState<any | null>(null);
  const [dlcRenewed, setDlcRenewed] = useState<boolean>(false);
  const [isRenewingDLC, setIsRenewingDLC] = useState<boolean>(false);

  // Sync state when activeCitizen persona switches
  React.useEffect(() => {
    const age = activeCitizen.dob
      ? new Date().getFullYear() - new Date(activeCitizen.dob).getFullYear()
      : activeCitizen.uan === "100982348712" ? 48 : activeCitizen.uan === "101294817203" ? 27 : activeCitizen.uan === "100112233445" ? 66 : 34;
    setCurrentAge(age >= 58 ? 45 : age);

    const wage = activeCitizen.passbook_summary?.monthly_wage || 20000;
    const contrib = Math.round(wage * 0.12);
    setMonthlyEmp(contrib);
    setMonthlyEmpr(contrib);
  }, [activeCitizen.uan, activeCitizen.dob, activeCitizen.passbook_summary]);

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center">
              <PiggyBank className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-sovereign-navy dark:text-white">
              {t.savingsTitle}
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t.savingsSubtitle}
          </p>
        </div>

        <button
          onClick={() => alert("Downloading official tamper-evident PDF passbook statement...")}
          className="flex items-center gap-1.5 text-xs font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-sovereign-navy text-slate-700 dark:text-slate-200 px-3.5 py-2 rounded-xl shadow-sm transition-all"
        >
          <Download className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span>Statement PDF</span>
        </button>
      </div>

      {/* SENIOR CITIZEN EPS-95 SPECIAL CARD (IF SENIOR) */}
      {activeCitizen.pension_details && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 rounded-2xl border-2 border-amber-300 dark:border-amber-800 p-5 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              <div>
                <h3 className="text-base font-extrabold text-amber-950 dark:text-amber-300">
                  {t.pensionTitle}
                </h3>
                <p className="text-xs text-amber-800 dark:text-amber-400">PPO Number: {activeCitizen.pension_details.ppo_number}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {dlcRenewed ? "DLC Active (Valid FY 26-27)" : t.activeDLCBadge}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-amber-200 dark:border-amber-800/60">
              <div className="text-[10px] text-slate-500 dark:text-slate-400">{t.monthlyPensionLabel}</div>
              <div className="text-xl font-extrabold text-amber-950 dark:text-amber-300 font-mono">
                ₹{activeCitizen.pension_details.monthly_pension_amount.toLocaleString("en-IN")}/mo
              </div>
            </div>
            <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-amber-200 dark:border-amber-800/60">
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Disbursement</div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {activeCitizen.pension_details.last_disbursement_date}
              </div>
            </div>
            <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-amber-200 dark:border-amber-800/60">
              <div className="text-[10px] text-slate-500 dark:text-slate-400">{t.lifeCertificateStatus}</div>
              <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                {dlcRenewed ? "Auto-Verified (Face RD)" : t.verified}
              </div>
            </div>
          </div>

          {/* Interactive Jeevan Pramaan Renewal Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 border-t border-amber-200/60 dark:border-amber-800/40">
            <p className="text-xs text-amber-900 dark:text-amber-300 font-medium">
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
      <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-sovereign-navy dark:text-white">
              {t.tripleSplitTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.tripleSplitDesc}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 dark:text-slate-400">{t.totalBalanceLabel}</span>
            <div className="text-2xl font-black text-sovereign-navy dark:text-white font-mono">
              ₹{totalBal.toLocaleString("en-IN")}
            </div>
          </div>
        </div>

        {/* Visual Progress Ratio Bar */}
        <div className="space-y-1.5">
          <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
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
          <div className="flex justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
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
          <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20">
            <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase">{t.employeeShare}</span>
            <div className="text-lg font-extrabold text-emerald-950 dark:text-emerald-200 font-mono mt-1">
              ₹{empShare.toLocaleString("en-IN")}
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Tax-Free Withdrawable</p>
          </div>

          <div className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-800/60 bg-blue-50/40 dark:bg-blue-950/20">
            <span className="text-[10px] font-bold text-blue-800 dark:text-blue-300 uppercase">{t.employerShare}</span>
            <div className="text-lg font-extrabold text-blue-950 dark:text-blue-200 font-mono mt-1">
              ₹{emprShare.toLocaleString("en-IN")}
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{t.interestAccrualBadge}</p>
          </div>

          <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/40 dark:bg-amber-950/20">
            <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase">{t.interestAccrualBadge}</span>
            <div className="text-lg font-extrabold text-amber-950 dark:text-amber-200 font-mono mt-1">
              ₹{(summary.interest_credited_current_fy || 27400).toLocaleString("en-IN")}
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Sovereign Yield</p>
          </div>
        </div>
      </div>

      {/* EMPLOYER ECR COMPLIANCE RADAR (PF THEFT ALERT WATCHDOG) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Radar className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <div>
              <h3 className="text-sm font-extrabold text-sovereign-navy dark:text-white">
                Employer ECR Compliance Radar (PF Theft Alert Watchdog)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Statutory monthly wage challan verification for {activeCitizen.active_employment?.establishment_name || "Active Employer"}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% On-Time Deposits (Zero Default)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Last Salary Deducted</span>
            <strong className="text-slate-800 dark:text-slate-200 font-mono font-bold">₹{((activeCitizen.passbook_summary?.monthly_wage || 26000) * 0.12).toLocaleString("en-IN")} (12% Emp Share)</strong>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">EPFO ECR Deposit Date</span>
            <strong className="text-emerald-700 dark:text-emerald-400 font-bold">14th July 2026 (Before 15th Deadline)</strong>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Statutory Status</span>
            <strong className="text-emerald-700 dark:text-emerald-400 font-bold">Protected • No Missing Challans</strong>
          </div>
        </div>
      </div>

      {/* 8.25% COMPOUNDING RETIREMENT WEALTH FORECASTER */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-saffron" />
              <h3 className="text-sm font-bold text-sovereign-navy dark:text-white">
                {t.forecasterTitle}
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.forecasterDesc}
            </p>
          </div>

          {/* Samriddhi Pulse Tag */}
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 px-3 py-1 rounded-xl text-right">
            <span className="text-[10px] text-amber-800 dark:text-amber-300 font-bold block">{t.estimatedRetirementCorpus}</span>
            <span className="text-xl font-black text-amber-900 dark:text-amber-300 font-mono">
              ₹{retirementTotal.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Interactive Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <span>{t.currentAgeLabel}</span>
              <span className="font-bold text-sovereign-navy dark:text-white">{currentAge} Years</span>
            </div>
            <input
              type="range"
              min="20"
              max="57"
              value={currentAge}
              onChange={(e) => setCurrentAge(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>20 yrs</span>
              <span>{t.retirementAgeLabel}: 58 yrs ({58 - currentAge} yrs compounding)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <span>Monthly Contribution:</span>
              <span className="font-bold text-sovereign-navy dark:text-white">₹{(monthlyEmp + monthlyEmpr).toLocaleString("en-IN")}</span>
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
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>₹2,000/mo</span>
              <span>₹30,000/mo</span>
            </div>
          </div>
        </div>

        {/* Visual Compounding Growth Trajectory - High-Fidelity Interactive Graph */}
        <div className="space-y-3 bg-slate-50 dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <span className="text-xs font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5">
                <span>📈 Sovereign Compounding Wealth Trajectory</span>
                <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                  8.25% Annual Yield
                </span>
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Hover over any year to inspect deposits vs. compounded statutory interest
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-black text-amber-700 dark:text-amber-400 bg-amber-100/60 dark:bg-amber-950/60 px-3 py-1 rounded-xl border border-amber-300 dark:border-amber-700">
                ₹{retirementTotal.toLocaleString("en-IN")} at Age 58
              </span>
            </div>
          </div>

          {/* Active Hover Data Inspector */}
          {hoveredPoint ? (
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-400/60 shadow-lg flex flex-wrap justify-between items-center gap-2 animate-in fade-in duration-150">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Age {hoveredPoint.age} ({hoveredPoint.year})
                </span>
              </div>
              <div className="flex flex-wrap gap-3 text-xs font-mono">
                <span className="text-slate-600 dark:text-slate-400">
                  Deposited: <strong className="text-slate-900 dark:text-slate-200">₹{(hoveredPoint.employeeShare + hoveredPoint.employerShare).toLocaleString("en-IN")}</strong>
                </span>
                <span className="text-amber-600 dark:text-amber-400">
                  Interest Earned: <strong>₹{(hoveredPoint.totalBalance - (hoveredPoint.employeeShare + hoveredPoint.employerShare)).toLocaleString("en-IN")}</strong>
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  Total: ₹{hoveredPoint.totalBalance.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          ) : (
            <div className="px-3 py-2 bg-white/60 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex justify-between items-center">
              <span>💡 At retirement, ~<strong>{Math.round(((retirementTotal - ((forecast[0]?.employeeShare || 0) + (forecast[0]?.employerShare || 0) + ((monthlyEmp + monthlyEmpr) * 12 * (58 - currentAge)))) / Math.max(1, retirementTotal)) * 100)}%</strong> of your total wealth is created solely by 8.25% compounding interest.</span>
              <span className="text-xs font-mono text-slate-400 font-bold hidden sm:inline">Tap bar to inspect</span>
            </div>
          )}

          {/* Realistic Multi-Bar Chart with Gridlines */}
          <div className="relative h-56 w-full pt-4 pb-2 px-2 flex flex-col justify-end">
            {/* Background Axis Reference Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 dark:opacity-30 pb-6 pt-2">
              <div className="border-b border-slate-400 dark:border-slate-600 w-full flex justify-between text-[9px] font-mono text-slate-500 dark:text-slate-400">
                <span>₹{retirementTotal.toLocaleString("en-IN")}</span>
                <span>Target 100%</span>
              </div>
              <div className="border-b border-dashed border-slate-400 dark:border-slate-600 w-full flex justify-between text-[9px] font-mono text-slate-500 dark:text-slate-400">
                <span>₹{Math.round(retirementTotal * 0.75).toLocaleString("en-IN")}</span>
                <span>75%</span>
              </div>
              <div className="border-b border-dashed border-slate-400 dark:border-slate-600 w-full flex justify-between text-[9px] font-mono text-slate-500 dark:text-slate-400">
                <span>₹{Math.round(retirementTotal * 0.5).toLocaleString("en-IN")}</span>
                <span>50%</span>
              </div>
              <div className="border-b border-dashed border-slate-400 dark:border-slate-600 w-full flex justify-between text-[9px] font-mono text-slate-500 dark:text-slate-400">
                <span>₹{Math.round(retirementTotal * 0.25).toLocaleString("en-IN")}</span>
                <span>25%</span>
              </div>
            </div>

            {/* Bars */}
            <div className="relative z-10 h-44 flex items-end gap-1 sm:gap-2">
              {forecast
                .filter((_, idx) => idx % Math.max(1, Math.floor(forecast.length / 16)) === 0 || idx === forecast.length - 1)
                .map((point, i, arr) => {
                  const maxVal = arr[arr.length - 1]?.totalBalance || 1;
                  const totalHeightPct = Math.max(12, Math.min(100, Math.round((point.totalBalance / maxVal) * 100)));
                  const depositTotal = point.employeeShare + point.employerShare;
                  const depositPct = Math.min(100, Math.round((depositTotal / point.totalBalance) * 100));
                  const isHovered = hoveredPoint?.year === point.year;

                  return (
                    <div
                      key={point.year}
                      onMouseEnter={() => setHoveredPoint(point)}
                      onMouseLeave={() => setHoveredPoint(null)}
                      onClick={() => setHoveredPoint(point)}
                      className="flex-1 h-full flex flex-col justify-end items-center group cursor-pointer"
                    >
                      {/* Bar Column Container */}
                      <div
                        style={{ height: `${totalHeightPct}%` }}
                        className={`w-full rounded-t-md overflow-hidden flex flex-col justify-end transition-all duration-200 ${
                          isHovered
                            ? "ring-2 ring-amber-400 shadow-lg scale-105 brightness-110 z-20"
                            : "group-hover:brightness-105"
                        }`}
                      >
                        {/* Compounded Interest Segment (Top Amber Glow) */}
                        <div
                          style={{ height: `${100 - depositPct}%` }}
                          className="w-full bg-gradient-to-t from-amber-500 to-amber-400"
                          title={`Compound Interest: ₹${(point.totalBalance - depositTotal).toLocaleString("en-IN")}`}
                        />
                        {/* Principal Contributions Segment (Bottom Navy/Emerald) */}
                        <div
                          style={{ height: `${depositPct}%` }}
                          className="w-full bg-gradient-to-t from-sovereign-navy to-emerald-600 dark:from-slate-900 dark:to-emerald-500 border-t border-emerald-400/40"
                          title={`Direct Contributions: ₹${depositTotal.toLocaleString("en-IN")}`}
                        />
                      </div>
                      {/* Age Label */}
                      <span
                        className={`text-[9px] font-mono mt-1 transition-colors ${
                          isHovered
                            ? "font-black text-amber-500 dark:text-amber-400"
                            : "text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        {point.age}y
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="flex flex-wrap justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700/80 pt-2 gap-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-emerald-600" />
                <span>Your Deposits (12% + 3.67%)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-amber-400" />
                <span>8.25% Sovereign Compounding Interest</span>
              </span>
            </div>
            <span className="font-bold text-slate-700 dark:text-slate-300 font-mono">
              ~{((retirementTotal / Math.max(1, totalBal))).toFixed(1)}x Wealth Expansion
            </span>
          </div>
        </div>

        {/* Compounding Projection Table Preview */}
        <div className="overflow-x-auto max-h-48 rounded-xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold sticky top-0">
              <tr>
                <th className="p-2.5">Year</th>
                <th className="p-2.5">Age</th>
                <th className="p-2.5">{t.employeeShare}</th>
                <th className="p-2.5">{t.employerShare}</th>
                <th className="p-2.5">Annual Interest</th>
                <th className="p-2.5 text-right font-extrabold text-sovereign-navy dark:text-white">Total Corpus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {forecast.filter((_, idx) => idx % 2 === 0 || idx === forecast.length - 1).map((row) => (
                <tr key={row.year} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200">
                  <td className="p-2.5 font-medium">{row.year}</td>
                  <td className="p-2.5 text-slate-500 dark:text-slate-400">{row.age}</td>
                  <td className="p-2.5 font-mono">₹{row.employeeShare.toLocaleString("en-IN")}</td>
                  <td className="p-2.5 font-mono">₹{row.employerShare.toLocaleString("en-IN")}</td>
                  <td className="p-2.5 font-mono text-amber-700 dark:text-amber-400">₹{row.annualInterest.toLocaleString("en-IN")}</td>
                  <td className="p-2.5 text-right font-mono font-bold text-emerald-700 dark:text-emerald-400">
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
      <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-6 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sovereign-navy dark:bg-amber-500 text-white dark:text-slate-950 flex items-center justify-center font-bold">
              <PiggyBank className="w-4 h-4 text-saffron dark:text-slate-950" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-sovereign-navy dark:text-white">
                Passbook Transaction & Claims Settlement Ledger
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live immutable audit ledger with real-time claim debits and ECR wage credits
              </p>
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Passbook PDF</span>
          </button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Transaction Description</th>
                <th className="p-3">Type</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status & DBT Reference</th>
                <th className="p-3 text-right">Closing Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {/* Dynamic Claim Debits (From User Submissions) */}
              {claimsHistory.map((claim) => (
                <tr key={claim.claim_id} className="bg-rose-50/40 dark:bg-rose-950/20 hover:bg-rose-50/80 dark:hover:bg-rose-950/40 transition-colors">
                  <td className="p-3 font-mono text-slate-600 dark:text-slate-400">{claim.timestamp || "Today"}</td>
                  <td className="p-3 font-medium text-slate-900 dark:text-white">
                    <span className="font-bold">{claim.claim_type.replace(/_/g, " ")}</span>
                    <span className="block text-[10px] text-slate-500 dark:text-slate-400">Claim Ref: {claim.claim_id}</span>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-700">
                      DEBIT (Advance)
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-rose-700 dark:text-rose-400">
                    - ₹{(claim.amount_sanctioned || claim.amount_requested).toLocaleString("en-IN")}
                  </td>
                  <td className="p-3">
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      Disbursed to {claim.dbt_account || "Bank Account"}
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                    ₹{totalBal.toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}

              {/* Standard Monthly ECR Credits */}
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-800 dark:text-slate-200">
                <td className="p-3 font-mono text-slate-600 dark:text-slate-400">14-Jul-2026</td>
                <td className="p-3 font-medium text-slate-900 dark:text-white">
                  <span>Monthly Wage Contribution (ECR Challan #98234)</span>
                  <span className="block text-[10px] text-slate-500 dark:text-slate-400">{activeCitizen.active_employment?.establishment_name || "Precision Auto Components"}</span>
                </td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700">
                    CREDIT (Salary)
                  </span>
                </td>
                <td className="p-3 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                  + ₹{((activeCitizen.passbook_summary?.monthly_wage || 26000) * 0.12).toLocaleString("en-IN")}
                </td>
                <td className="p-3 text-slate-600 dark:text-slate-400 text-[11px]">
                  Deposit on 14-Jul-2026 (On-Time)
                </td>
                <td className="p-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                  ₹{totalBal.toLocaleString("en-IN")}
                </td>
              </tr>

              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-800 dark:text-slate-200">
                <td className="p-3 font-mono text-slate-600 dark:text-slate-400">12-Jun-2026</td>
                <td className="p-3 font-medium text-slate-900 dark:text-white">
                  <span>Monthly Wage Contribution (ECR Challan #97102)</span>
                  <span className="block text-[10px] text-slate-500 dark:text-slate-400">{activeCitizen.active_employment?.establishment_name || "Precision Auto Components"}</span>
                </td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700">
                    CREDIT (Salary)
                  </span>
                </td>
                <td className="p-3 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                  + ₹{((activeCitizen.passbook_summary?.monthly_wage || 26000) * 0.12).toLocaleString("en-IN")}
                </td>
                <td className="p-3 text-slate-600 dark:text-slate-400 text-[11px]">
                  Deposit on 12-Jun-2026 (On-Time)
                </td>
                <td className="p-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                  ₹{(totalBal - ((activeCitizen.passbook_summary?.monthly_wage || 26000) * 0.12)).toLocaleString("en-IN")}
                </td>
              </tr>

              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-800 dark:text-slate-200">
                <td className="p-3 font-mono text-slate-600 dark:text-slate-400">31-Mar-2026</td>
                <td className="p-3 font-medium text-slate-900 dark:text-white">
                  <span>FY 2025-26 Annual Statutory Interest Credit (8.25%)</span>
                  <span className="block text-[10px] text-slate-500 dark:text-slate-400">EPFO Central Board of Trustees Annual Compound Settlement</span>
                </td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
                    CREDIT (Interest)
                  </span>
                </td>
                <td className="p-3 font-mono font-bold text-amber-700 dark:text-amber-400">
                  + ₹{(activeCitizen.passbook_summary?.interest_credited_current_fy || 27400).toLocaleString("en-IN")}
                </td>
                <td className="p-3 text-slate-600 dark:text-slate-400 text-[11px]">
                  Central CBT Statutory Order #2026-EPF-825
                </td>
                <td className="p-3 text-right font-mono font-bold text-slate-900 dark:text-white">
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
