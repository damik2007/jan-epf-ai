"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import mockData from "@/data/MOCK_CITIZEN_ACCOUNTS.json";

export interface Citizen {
  uan: string;
  full_name: string;
  phone: string;
  dob: string;
  gender: string;
  father_name: string;
  aadhaar_masked: string;
  pan_masked: string;
  bank_kyc: {
    bank_name: string;
    account_number_masked: string;
    ifsc_code: string;
    kyc_status: string;
    penny_drop_verified?: boolean;
    verified_holder_name?: string;
  };
  active_employment?: {
    member_id: string;
    establishment_name: string;
    date_of_joining: string;
    date_of_exit: string | null;
    total_service_years: number;
  } | null;
  employment_history?: Array<{
    member_id: string;
    establishment_name: string;
    date_of_joining: string;
    date_of_exit: string | null;
    balance: number;
    transfer_status: string;
    last_ecr_wage_month?: string;
    exit_date_deduced?: string;
  }>;
  passbook_summary: {
    total_balance: number;
    employee_share: number;
    employer_share: number;
    pension_fund_share: number;
    interest_credited_current_fy?: number;
    last_contribution_date?: string;
    monthly_wage?: number;
    interest_rate?: number;
    settled_at_retirement?: boolean;
  };
  pension_details?: {
    ppo_number: string;
    scheme: string;
    monthly_pension_amount: number;
    pension_start_date: string;
    last_disbursement_date: string;
    life_certificate_status: string;
    life_certificate_expiry?: string;
  } | null;
  nomination_details?: {
    nomination_filed: boolean;
    suggested_nominee?: {
      name: string;
      relationship: string;
      dob?: string;
      share_percent: number;
      aadhaar_masked?: string;
    };
  } | null;
  eligible_claims?: Record<string, any>;
  insurance_details?: {
    edli_coverage_amount: number;
    status: string;
  };
}

interface SubmittedClaim {
  claim_id: string;
  uan: string;
  claim_type: string;
  amount_requested: number;
  amount_sanctioned: number;
  status: string;
  tds_deducted: number;
  dbt_account: string;
  timestamp: string;
}

interface CitizenContextType {
  citizens: Citizen[];
  activeCitizen: Citizen;
  isAuthenticated: boolean;
  login: (uan: string) => void;
  logout: () => void;
  switchCitizen: (uan: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
  seniorMode: boolean;
  setSeniorMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  claimsHistory: SubmittedClaim[];
  addClaim: (claim: SubmittedClaim) => void;
  updateActiveCitizenKYC: (bankName: string, accountMasked: string, ifsc: string) => void;
  updateActiveCitizenName: (newName: string) => void;
  apiUrl: string;
}

const CitizenContext = createContext<CitizenContextType | undefined>(undefined);

export const CitizenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [citizens, setCitizens] = useState<Citizen[]>(mockData.citizens as Citizen[]);
  const [activeCitizen, setActiveCitizen] = useState<Citizen>(mockData.citizens[0] as Citizen);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("en-IN");
  const [seniorMode, setSeniorMode] = useState<boolean>(false);
  const [claimsHistory, setClaimsHistory] = useState<SubmittedClaim[]>([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Check saved session on mount
  useEffect(() => {
    try {
      const savedAuth = sessionStorage.getItem("jan_epf_auth");
      const savedUan = sessionStorage.getItem("jan_epf_uan");
      if (savedAuth === "true" && savedUan) {
        const found = citizens.find((c) => c.uan === savedUan);
        if (found) {
          setActiveCitizen(found);
          setIsAuthenticated(true);
        }
      }
    } catch {
      // Storage unavailable
    }
  }, [citizens]);

  // Check if activeCitizen is Gurmeet Singh (Senior) and suggest Senior Mode
  useEffect(() => {
    if (activeCitizen.uan === "100112233445") {
      setSeniorMode(true);
    }
  }, [activeCitizen.uan]);

  const login = (uan: string) => {
    const found = citizens.find((c) => c.uan === uan);
    if (found) {
      setActiveCitizen(found);
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem("jan_epf_auth", "true");
        sessionStorage.setItem("jan_epf_uan", uan);
      } catch {}
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem("jan_epf_auth");
      sessionStorage.removeItem("jan_epf_uan");
    } catch {}
  };

  const switchCitizen = (uan: string) => {
    const found = citizens.find((c) => c.uan === uan);
    if (found) {
      setActiveCitizen(found);
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem("jan_epf_auth", "true");
        sessionStorage.setItem("jan_epf_uan", uan);
      } catch {}
    }
  };

  const addClaim = (claim: SubmittedClaim) => {
    setClaimsHistory((prev) => [claim, ...prev]);
  };

  const updateActiveCitizenKYC = (bankName: string, accountMasked: string, ifsc: string) => {
    setActiveCitizen((prev) => {
      const updated = {
        ...prev,
        bank_kyc: {
          ...prev.bank_kyc,
          bank_name: bankName,
          account_number_masked: accountMasked,
          ifsc_code: ifsc,
          kyc_status: "VERIFIED_ACTIVE",
          penny_drop_verified: true
        }
      };
      setCitizens((all) => all.map((c) => (c.uan === updated.uan ? updated : c)));
      return updated;
    });
  };

  const updateActiveCitizenName = (newName: string) => {
    setActiveCitizen((prev) => {
      const updated = { ...prev, full_name: newName };
      setCitizens((all) => all.map((c) => (c.uan === updated.uan ? updated : c)));
      return updated;
    });
  };

  return (
    <CitizenContext.Provider
      value={{
        citizens,
        activeCitizen,
        isAuthenticated,
        login,
        logout,
        switchCitizen,
        language,
        setLanguage,
        seniorMode,
        setSeniorMode,
        claimsHistory,
        addClaim,
        updateActiveCitizenKYC,
        updateActiveCitizenName,
        apiUrl
      }}
    >
      <div className={seniorMode ? "senior-mode transition-all duration-200" : "transition-all duration-200"}>
        {children}
      </div>
    </CitizenContext.Provider>
  );
};

export const useCitizen = () => {
  const context = useContext(CitizenContext);
  if (!context) {
    throw new Error("useCitizen must be used within a CitizenProvider");
  }
  return context;
};
