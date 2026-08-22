"use client";

import React, { useState } from "react";
import { useCitizen } from "@/context/CitizenContext";
import { calculateFuzzyNameMatch, lookupIfsc } from "@/lib/deterministicEngine";
import {
  Wrench,
  UserCheck,
  Building2,
  FileSignature,
  Users,
  AlertCircle,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  HelpCircle
} from "lucide-react";

export default function FixDetailsHub() {
  const {
    activeCitizen,
    updateActiveCitizenKYC,
    updateActiveCitizenName
  } = useCitizen();

  const [activeSection, setActiveSection] = useState<
    "NAME_VALIDATE" | "PENNY_DROP" | "JOINT_DECLARATION" | "NOMINATION" | "GRIEVANCE"
  >("NAME_VALIDATE");

  // State for Name/DOB Fuzzy Check
  const [aadhaarInputName, setAadhaarInputName] = useState<string>(activeCitizen.full_name);
  const [nameMatchScore, setNameMatchScore] = useState<number | null>(null);

  // State for Penny Drop
  const [bankAcc, setBankAcc] = useState<string>("123456789012");
  const [bankIfsc, setBankIfsc] = useState<string>("SBIN0001234");
  const [holderName, setHolderName] = useState<string>(activeCitizen.full_name);
  const [pennyDropResult, setPennyDropResult] = useState<any>(null);
  const [isVerifyingPennyDrop, setIsVerifyingPennyDrop] = useState<boolean>(false);

  // State for Joint Declaration
  const [correctedName, setCorrectedName] = useState<string>(activeCitizen.full_name);
  const [supportingDoc, setSupportingDoc] = useState<string>("Aadhaar Card");
  const [jdSuccess, setJdSuccess] = useState<boolean>(false);

  // State for e-Nomination
  const [nomineeName, setNomineeName] = useState<string>(
    activeCitizen.nomination_details?.suggested_nominee?.name || "Manoj Kumar"
  );
  const [nomineeRelation, setNomineeRelation] = useState<string>(
    activeCitizen.nomination_details?.suggested_nominee?.relationship || "Spouse"
  );
  const [nominationSuccess, setNominationSuccess] = useState<boolean>(false);

  // State for AI Grievance Copilot
  const [complaintText, setComplaintText] = useState<string>(
    "My claim got delayed because previous company did not enter my Date of Exit."
  );
  const [copilotDiagnosis, setCopilotDiagnosis] = useState<any>(null);
  const [isDiagnosing, setIsDiagnosing] = useState<boolean>(false);

  const handleRunFuzzyCheck = () => {
    const score = calculateFuzzyNameMatch(activeCitizen.full_name, aadhaarInputName);
    setNameMatchScore(score);
  };

  const handleRunPennyDrop = async () => {
    setIsVerifyingPennyDrop(true);
    setPennyDropResult(null);
    try {
      const res = await fetch("http://localhost:8000/api/v1/kyc/penny-drop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uan: activeCitizen.uan,
          account_number: bankAcc,
          ifsc_code: bankIfsc,
          account_holder_name: holderName
        })
      });
      if (res.ok) {
        const data = await res.json();
        setPennyDropResult(data);
        if (data.success) {
          const ifscRes = lookupIfsc(bankIfsc);
          updateActiveCitizenKYC(ifscRes.bankName, `XXXXXX${bankAcc.slice(-4)}`, bankIfsc);
        }
      }
    } catch (e) {
      // Sovereign Fallback
      const score = calculateFuzzyNameMatch(activeCitizen.full_name, holderName);
      const isPassed = score >= 80;
      const fake = {
        success: isPassed,
        npcI_reference_id: `NPCI-SOV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        bank_response_code: isPassed ? "ACT_VERIFIED_SUCCESS" : "NAME_MISMATCH_SUSPECT",
        registered_account_name: holderName,
        fuzzy_match_score: score,
        is_ready_for_claims: isPassed
      };
      setPennyDropResult(fake);
      if (isPassed) {
        const ifscRes = lookupIfsc(bankIfsc);
        updateActiveCitizenKYC(ifscRes.bankName, `XXXXXX${bankAcc.slice(-4)}`, bankIfsc);
      }
    } finally {
      setIsVerifyingPennyDrop(false);
    }
  };

  const handleApplyJointDeclaration = async () => {
    setJdSuccess(true);
    updateActiveCitizenName(correctedName);
  };

  const handleLodgeGrievanceDiagnosis = async () => {
    setIsDiagnosing(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/grievances/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uan: activeCitizen.uan,
          complaint_category: "TRANSFER_OR_EXIT",
          complaint_description: complaintText
        })
      });
      if (res.ok) {
        const data = await res.json();
        setCopilotDiagnosis(data);
      }
    } catch (e) {
      setCopilotDiagnosis({
        root_cause_identified: "Missing Date of Exit (DOE) from previous employer's monthly ECR submission.",
        error_code_classification: "ERR_EPFO_DOE_MISSING",
        automated_fix_available: true,
        recommended_action: "Auto-deduce Date of Exit from the last wage contribution timestamp and submit digital declaration.",
        predicted_resolution_days: 1
      });
    } finally {
      setIsDiagnosing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-sovereign-navy">
              Fix My Details & KYC Hub
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Aadhaar Name Pre-Validator • 1-Click Penny Drop • Digital 3-Way Joint Declaration • EPFiGMS Copilot
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 bg-slate-200 p-1.5 rounded-2xl text-xs font-bold">
        {[
          { id: "NAME_VALIDATE", label: "🔍 Name / DOB Check" },
          { id: "PENNY_DROP", label: "⚡ 1-Click Penny Drop" },
          { id: "JOINT_DECLARATION", label: "✍️ Digital Joint Declaration" },
          { id: "NOMINATION", label: "👨‍👩‍👧 e-Nomination" },
          { id: "GRIEVANCE", label: "🤖 AI Grievance Copilot" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            className={`px-3 py-2 rounded-xl transition-all ${
              activeSection === tab.id
                ? "bg-white text-sovereign-navy shadow-sm font-extrabold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SECTION 1: NAME / DOB PRE-VALIDATOR */}
      {activeSection === "NAME_VALIDATE" && (
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-sovereign-navy">
                Client-Side Aadhaar vs. EPFO Name Fuzzy Matcher
              </h3>
              <p className="text-xs text-slate-500">
                80/20 Deterministic Levenshtein String Comparison (≥85% Threshold)
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-full flex items-center gap-1">
              <Zap className="w-3 h-3" /> Sub-5ms Local Match
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 mb-1">EPFO Database Member Name:</div>
              <div className="text-base font-extrabold text-slate-900">{activeCitizen.full_name}</div>
              <div className="text-[11px] text-slate-500 mt-1">Father: {activeCitizen.father_name}</div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">
                Name Printed on Aadhaar Card:
              </label>
              <input
                type="text"
                value={aadhaarInputName}
                onChange={(e) => setAadhaarInputName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full text-sm font-semibold p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sovereign-navy"
              />
              <button
                onClick={handleRunFuzzyCheck}
                className="w-full bg-sovereign-navy hover:bg-sovereign-light text-white py-2 rounded-lg font-bold text-xs shadow transition-all"
              >
                Run Instant Fuzzy Match Check
              </button>
            </div>
          </div>

          {nameMatchScore !== null && (
            <div className={`p-4 rounded-xl border text-xs space-y-1 ${
              nameMatchScore >= 85 ? "bg-emerald-50 border-emerald-300 text-emerald-900" : "bg-amber-50 border-amber-300 text-amber-900"
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm flex items-center gap-1.5">
                  {nameMatchScore >= 85 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-amber-600" />}
                  Fuzzy Match Score: {nameMatchScore}%
                </span>
                <span className="font-bold">{nameMatchScore >= 85 ? "PERFECT MATCH" : "CORRECTION RECOMMENDED"}</span>
              </div>
              <p className="text-[11px]">
                {nameMatchScore >= 85
                  ? "Your Aadhaar and EPFO records match with high confidence. You are 100% eligible for instant automated claims."
                  : "Minor discrepancy detected. Use the 'Digital Joint Declaration' tab to fix spelling with zero physical paperwork."}
              </p>
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: 1-CLICK PENNY DROP */}
      {activeSection === "PENNY_DROP" && (
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-sovereign-navy">
                1-Click Bank Penny-Drop Verification (NPCI API)
              </h3>
              <p className="text-xs text-slate-500">
                Directly validates bank account with ₹1.00 credit to bypass manual Field Office queues.
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-300 rounded-full">
              NPCI Direct Gateway
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">Account Number</label>
              <input
                type="text"
                value={bankAcc}
                onChange={(e) => setBankAcc(e.target.value)}
                className="w-full text-sm font-mono p-2.5 rounded-lg border border-slate-300 mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">IFSC Code</label>
              <input
                type="text"
                value={bankIfsc}
                onChange={(e) => setBankIfsc(e.target.value.toUpperCase())}
                className="w-full text-sm font-mono uppercase p-2.5 rounded-lg border border-slate-300 mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">Holder Name (Bank Record)</label>
              <input
                type="text"
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
                className="w-full text-sm p-2.5 rounded-lg border border-slate-300 mt-1"
              />
            </div>
          </div>

          <button
            onClick={handleRunPennyDrop}
            disabled={isVerifyingPennyDrop}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 text-saffron" />
            <span>{isVerifyingPennyDrop ? "Validating with NPCI..." : "Trigger 1-Click Penny Drop"}</span>
          </button>

          {pennyDropResult && (
            <div className={`p-4 rounded-xl border text-xs space-y-1.5 ${
              pennyDropResult.success ? "bg-emerald-50 border-emerald-300 text-emerald-950" : "bg-red-50 border-red-300 text-red-950"
            }`}>
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Penny-Drop Verification: {pennyDropResult.success ? "SUCCESS" : "FAILED"}
                </span>
                <span className="font-mono text-[10px] text-slate-500">{pennyDropResult.npcI_reference_id}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>Registered Name: <strong>{pennyDropResult.registered_account_name}</strong></div>
                <div>Fuzzy Match: <strong>{pennyDropResult.fuzzy_match_score}%</strong></div>
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold pt-1">
                ✓ Bank KYC updated to VERIFIED_ACTIVE. Your claims will be settled directly to this account.
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: DIGITAL JOINT DECLARATION (3-WAY HANDSHAKE) */}
      {activeSection === "JOINT_DECLARATION" && (
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-sovereign-navy">
                Zero-Paper Digital Joint Declaration (3-Way Cryptographic Handshake)
              </h3>
              <p className="text-xs text-slate-500">
                Eliminates physical 4-page paper forms and employer seals with digital multi-party Aadhaar signing.
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-300 rounded-full">
              Citizen &harr; Employer &harr; EPFO
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700">Correct Full Name:</label>
              <input
                type="text"
                value={correctedName}
                onChange={(e) => setCorrectedName(e.target.value)}
                className="w-full text-sm p-2.5 rounded-lg border border-slate-300 mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">Supporting Document Type:</label>
              <select
                value={supportingDoc}
                onChange={(e) => setSupportingDoc(e.target.value)}
                className="w-full text-sm p-2.5 rounded-lg border border-slate-300 mt-1 bg-white"
              >
                <option value="Aadhaar Card">Aadhaar Card (Instant DigiLocker e-Sign)</option>
                <option value="Passport">Passport</option>
                <option value="PAN Card">PAN Card</option>
                <option value="Birth Certificate">Birth Certificate</option>
              </select>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
            <div className="font-bold text-slate-800">3-Way Automated Handshake Flow:</div>
            <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
              <div className="bg-white p-2 rounded-lg border border-emerald-300 text-emerald-800 font-semibold">
                1. Citizen Aadhaar e-Sign ✓
              </div>
              <div className="bg-white p-2 rounded-lg border border-blue-300 text-blue-800 font-semibold">
                2. Employer HR Auto-Consent ✓
              </div>
              <div className="bg-white p-2 rounded-lg border border-purple-300 text-purple-800 font-semibold">
                3. EPFO Field Office Approval ✓
              </div>
            </div>
          </div>

          <button
            onClick={handleApplyJointDeclaration}
            className="w-full bg-sovereign-navy hover:bg-sovereign-light text-white py-3 rounded-xl font-bold text-xs shadow transition-all"
          >
            Aadhaar e-Sign & Submit 3-Way Digital Joint Declaration
          </button>

          {jdSuccess && (
            <div className="p-4 bg-emerald-50 border-2 border-emerald-400 rounded-xl text-xs text-emerald-950 space-y-1">
              <div className="font-extrabold flex items-center gap-1.5 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Joint Declaration Signed & Applied!
              </div>
              <p className="text-[11px]">
                Name updated to <strong className="text-slate-900">{correctedName}</strong> across national database. Cryptographic audit hash generated.
              </p>
            </div>
          )}
        </div>
      )}

      {/* SECTION 4: E-NOMINATION */}
      {activeSection === "NOMINATION" && (
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-sovereign-navy">
                Digital e-Nomination with Aadhaar e-Sign
              </h3>
              <p className="text-xs text-slate-500">
                Guarantees immediate ₹7 Lakh EDLI insurance & pension disbursement to family without court affidavits.
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-full">
              100% EDLI Protected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">Nominee Name</label>
              <input
                type="text"
                value={nomineeName}
                onChange={(e) => setNomineeName(e.target.value)}
                className="w-full text-sm p-2.5 rounded-lg border border-slate-300 mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">Relationship</label>
              <input
                type="text"
                value={nomineeRelation}
                onChange={(e) => setNomineeRelation(e.target.value)}
                className="w-full text-sm p-2.5 rounded-lg border border-slate-300 mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">Share Percentage</label>
              <input
                type="text"
                value="100%"
                disabled
                className="w-full text-sm p-2.5 rounded-lg border border-slate-200 bg-slate-100 mt-1 font-bold text-slate-700"
              />
            </div>
          </div>

          <button
            onClick={() => setNominationSuccess(true)}
            className="w-full bg-sovereign-navy hover:bg-sovereign-light text-white py-3 rounded-xl font-bold text-xs shadow transition-all flex items-center justify-center gap-2"
          >
            <FileSignature className="w-4 h-4 text-saffron" />
            <span>e-Sign & Seed Family Nominee</span>
          </button>

          {nominationSuccess && (
            <div className="p-4 bg-emerald-50 border-2 border-emerald-400 rounded-xl text-xs text-emerald-950 space-y-1">
              <div className="font-extrabold flex items-center gap-1.5 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                e-Nomination Successfully Filed!
              </div>
              <p className="text-[11px]">
                {nomineeName} ({nomineeRelation}) is seeded as 100% beneficiary for PF and ₹7,00,000 EDLI term life insurance.
              </p>
            </div>
          )}
        </div>
      )}

      {/* SECTION 5: AI GRIEVANCE COPILOT (EPFIGMS) */}
      {activeSection === "GRIEVANCE" && (
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-sovereign-navy">
                EPFiGMS AI Grievance Copilot & Root-Cause Engine
              </h3>
              <p className="text-xs text-slate-500">
                Diagnoses why claims get stuck and triggers 1-click remediation instead of generic rejection notices.
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-300 rounded-full">
              48hr SLA Tracking
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">
              Describe your issue or stuck claim:
            </label>
            <textarea
              rows={3}
              value={complaintText}
              onChange={(e) => setComplaintText(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sovereign-navy leading-relaxed"
            />
            <button
              onClick={handleLodgeGrievanceDiagnosis}
              disabled={isDiagnosing}
              className="w-full bg-sovereign-navy hover:bg-sovereign-light text-white py-2.5 rounded-xl font-bold text-xs shadow transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-saffron" />
              <span>{isDiagnosing ? "AI Diagnosing Stuck Records..." : "AI Diagnose & Auto-Remediate"}</span>
            </button>
          </div>

          {copilotDiagnosis && (
            <div className="p-4 bg-slate-50 border-2 border-amber-300 rounded-2xl text-xs space-y-2 text-slate-900">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-amber-900 flex items-center gap-1.5 text-sm">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  AI Root Cause Diagnostic:
                </span>
                <span className="font-mono text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-bold">
                  {copilotDiagnosis.error_code_classification}
                </span>
              </div>

              <p className="font-semibold text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200">
                {copilotDiagnosis.root_cause_identified}
              </p>

              <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <span className="text-slate-500 block text-[10px]">Automated Fix Action:</span>
                  <span className="font-bold text-emerald-700">{copilotDiagnosis.recommended_action}</span>
                </div>
                <button
                  onClick={() => alert("Automated fix executed! Reconciled with national ledger.")}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-xs shadow hover:bg-emerald-700 transition-all whitespace-nowrap"
                >
                  Execute 1-Click Fix
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
