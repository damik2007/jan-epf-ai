"use client";

import React, { useState } from "react";
import { useCitizen } from "@/context/CitizenContext";
import { calculatePassbookCompounding } from "@/lib/deterministicEngine";
import {
  PiggyBank,
  TrendingUp,
  Shield,
  HeartHandshake,
  Download,
  Calendar,
  Sparkles,
  Award,
  CheckCircle2,
  Clock,
  Zap
} from "lucide-react";

export default function MySavingsHub() {
  const { activeCitizen } = useCitizen();

  const [currentAge, setCurrentAge] = useState<number>(36);
  const [monthlyEmp, setMonthlyEmp] = useState<number>(2600);
  const [monthlyEmpr, setMonthlyEmpr] = useState<number>(2600);
  const [simulatedRate, setSimulatedRate] = useState<number>(8.25);

  const summary = activeCitizen.passbook_summary || {
    total_balance: 342500,
    employee_share: 182000,
    employer_share: 115500,
    pension_fund_share: 45000,
    interest_credited_current_fy: 27400
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
              My Savings & Pension Forecaster
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Visual Triple-Split Passbook • 8.25% Sovereign Compounding Wealth Curve • ₹7L EDLI Insurance
          </p>
        </div>

        <button
          onClick={() => alert("Downloading official tamper-evident PDF passbook statement...")}
          className="flex items-center gap-1.5 text-xs font-bold bg-white border border-slate-300 hover:border-sovereign-navy text-slate-700 px-3.5 py-2 rounded-xl shadow-sm transition-all"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Download Statement</span>
        </button>
      </div>

      {/* SENIOR CITIZEN EPS-95 SPECIAL CARD (IF SENIOR) */}
      {activeCitizen.pension_details && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-300 p-5 shadow-sm space-y-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-600" />
              <div>
                <h3 className="text-base font-extrabold text-amber-950">
                  EPS-95 Senior Citizen Monthly Pension Card
                </h3>
                <p className="text-xs text-amber-800">PPO Number: {activeCitizen.pension_details.ppo_number}</p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Life Certificate Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-white/80 p-3 rounded-xl border border-amber-200">
              <div className="text-[10px] text-slate-500">Monthly Pension</div>
              <div className="text-xl font-extrabold text-amber-950 font-mono">
                ₹{activeCitizen.pension_details.monthly_pension_amount.toLocaleString("en-IN")}/mo
              </div>
            </div>
            <div className="bg-white/80 p-3 rounded-xl border border-amber-200">
              <div className="text-[10px] text-slate-500">Last Disbursed Date</div>
              <div className="text-sm font-bold text-slate-800">
                {activeCitizen.pension_details.last_disbursement_date}
              </div>
            </div>
            <div className="bg-white/80 p-3 rounded-xl border border-amber-200">
              <div className="text-[10px] text-slate-500">Next DLC Renewal Window</div>
              <div className="text-sm font-bold text-emerald-700">
                November 2026
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TRIPLE-SPLIT VISUAL PASSBOOK */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-sovereign-navy">
              Interactive Triple-Split Passbook Architecture
            </h3>
            <p className="text-xs text-slate-500">
              Statutory 12% Employee + 3.67% Employer PF + 8.33% EPS Pension Fund
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500">Total Accumulation</span>
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
              title="Employee Share (12%)"
            />
            <div
              style={{ width: `${totalBal > 0 ? (emprShare / totalBal) * 100 : 35}%` }}
              className="bg-blue-500 h-full hover:opacity-90 transition-all"
              title="Employer Share (3.67%)"
            />
            <div
              style={{ width: `${totalBal > 0 ? (epsShare / totalBal) * 100 : 15}%` }}
              className="bg-amber-500 h-full hover:opacity-90 transition-all"
              title="Pension Fund (8.33%)"
            />
          </div>
          <div className="flex justify-between text-[11px] font-semibold text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Employee (12%): ₹{empShare.toLocaleString("en-IN")}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Employer (3.67%): ₹{emprShare.toLocaleString("en-IN")}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> EPS Pension: ₹{epsShare.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Breakdown Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40">
            <span className="text-[10px] font-bold text-emerald-800 uppercase">Employee Share (12%)</span>
            <div className="text-lg font-extrabold text-emerald-950 font-mono mt-1">
              ₹{empShare.toLocaleString("en-IN")}
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">100% Tax-Free Withdrawable</p>
          </div>

          <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40">
            <span className="text-[10px] font-bold text-blue-800 uppercase">Employer Share (3.67%)</span>
            <div className="text-lg font-extrabold text-blue-950 font-mono mt-1">
              ₹{emprShare.toLocaleString("en-IN")}
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Compounding at 8.25% Sovereign Rate</p>
          </div>

          <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40">
            <span className="text-[10px] font-bold text-amber-800 uppercase">FY Interest Credited</span>
            <div className="text-lg font-extrabold text-amber-950 font-mono mt-1">
              ₹{(summary.interest_credited_current_fy || 27400).toLocaleString("en-IN")}
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Guaranteed Government Yield</p>
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
                8.25% Sovereign Compounding Wealth Forecaster (Age 58)
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Tax-free compounding growth simulator backed by Ministry of Labour & Employment.
            </p>
          </div>

          {/* Samriddhi Pulse Tag */}
          <div className="bg-amber-50 border border-amber-300 px-3 py-1 rounded-xl text-right">
            <span className="text-[10px] text-amber-800 font-bold block">Projected Corpus at Age 58</span>
            <span className="text-xl font-black text-amber-900 font-mono">
              ₹{retirementTotal.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Interactive Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Your Current Age:</span>
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
              <span>Retirement Target: 58 yrs ({58 - currentAge} years compounding)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Monthly PF Contribution:</span>
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

        {/* Compounding Projection Table Preview */}
        <div className="overflow-x-auto max-h-48 rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 font-bold sticky top-0">
              <tr>
                <th className="p-2.5">Year</th>
                <th className="p-2.5">Age</th>
                <th className="p-2.5">Employee Share</th>
                <th className="p-2.5">Employer Share</th>
                <th className="p-2.5">Annual Interest</th>
                <th className="p-2.5 text-right font-extrabold text-sovereign-navy">Total PF Wealth</th>
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
                Employees' Deposit-Linked Insurance (EDLI)
              </span>
              <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-2 py-0.2 rounded border border-emerald-400/40">
                100% Free Statutory
              </span>
            </div>
            <h4 className="text-lg font-bold mt-0.5">₹7,00,000 Term Life Cover Active</h4>
            <p className="text-xs text-slate-300">
              Guaranteed financial protection for your registered family nominees with zero premium deduction.
            </p>
          </div>
        </div>

        <button
          onClick={() => alert("Nominee is registered. EDLI coverage certificate verified.")}
          className="bg-white text-sovereign-darkest hover:bg-slate-100 px-4 py-2 rounded-xl font-bold text-xs shadow transition-all whitespace-nowrap"
        >
          View Insurance Certificate
        </button>
      </div>
    </div>
  );
}
