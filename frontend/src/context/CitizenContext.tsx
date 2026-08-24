"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import mockData from "@/data/MOCK_CITIZEN_ACCOUNTS.json";
import { playNeuralSpeech } from "@/lib/edgeTtsPlayer";

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

export interface SubmittedClaim {
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
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
  claimsHistory: SubmittedClaim[];
  addClaim: (claim: SubmittedClaim) => void;
  mergeEmployment: (memberId: string) => void;
  renewDLC: () => void;
  updateActiveCitizenKYC: (bankName: string, accountMasked: string, ifsc: string) => void;
  updateActiveCitizenName: (newName: string) => void;
  apiUrl: string;
}

const STORAGE_KEY_CITIZENS = "jan_epf_citizens_data_v2";
const STORAGE_KEY_CLAIMS = "jan_epf_claims_data_v2";
const STORAGE_KEY_ACTIVE_UAN = "jan_epf_active_uan_v2";

const CitizenContext = createContext<CitizenContextType | undefined>(undefined);

export const CitizenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initial State Loaders (with localStorage persistence)
  const [citizens, setCitizens] = useState<Citizen[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_CITIZENS);
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return mockData.citizens as Citizen[];
  });

  const [activeCitizen, setActiveCitizen] = useState<Citizen>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedUan = sessionStorage.getItem("jan_epf_uan") || localStorage.getItem(STORAGE_KEY_ACTIVE_UAN);
        if (savedUan) {
          const found = (mockData.citizens as Citizen[]).find((c) => c.uan === savedUan);
          if (found) return found;
        }
      } catch {}
    }
    return mockData.citizens[0] as Citizen;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedAuth = sessionStorage.getItem("jan_epf_auth");
        if (savedAuth === "true") return true;
      } catch {}
    }
    return false;
  });

  const [language, setLanguage] = useState<string>("en-IN");
  const [seniorMode, setSeniorMode] = useState<boolean>(false);
  const [theme, setThemeState] = useState<"light" | "dark">("light");
  const [claimsHistory, setClaimsHistory] = useState<SubmittedClaim[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_CLAIMS);
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return [];
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // 2. Cross-Tab State Synchronization via BroadcastChannel
  useEffect(() => {
    if (typeof window === "undefined") return;
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel("jan_epf_state_sync");
      channel.onmessage = (event) => {
        if (event.data?.type === "STATE_UPDATED") {
          if (event.data.citizens) setCitizens(event.data.citizens);
          if (event.data.activeCitizen) setActiveCitizen(event.data.activeCitizen);
          if (event.data.claimsHistory) setClaimsHistory(event.data.claimsHistory);
        }
      };
    } catch {}

    return () => {
      channel?.close();
    };
  }, []);

  // 3. Check saved theme & auto-hydrate on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("jan_epf_theme") as "light" | "dark" | null;
      if (savedTheme === "dark") {
        setThemeState("dark");
        document.documentElement.classList.add("dark");
      } else {
        setThemeState("light");
        document.documentElement.classList.remove("dark");
      }

      const savedAuth = sessionStorage.getItem("jan_epf_auth");
      const savedUan = sessionStorage.getItem("jan_epf_uan") || localStorage.getItem(STORAGE_KEY_ACTIVE_UAN);
      if (savedAuth === "true" && savedUan) {
        const found = citizens.find((c) => c.uan === savedUan);
        if (found) {
          setActiveCitizen(found);
          setIsAuthenticated(true);
        }
      }
    } catch {}
  }, [citizens]);

  const broadcastStateChange = (newCitizens: Citizen[], newActive: Citizen, newClaims?: SubmittedClaim[]) => {
    try {
      localStorage.setItem(STORAGE_KEY_CITIZENS, JSON.stringify(newCitizens));
      localStorage.setItem(STORAGE_KEY_ACTIVE_UAN, newActive.uan);
      if (newClaims) localStorage.setItem(STORAGE_KEY_CLAIMS, JSON.stringify(newClaims));

      const channel = new BroadcastChannel("jan_epf_state_sync");
      channel.postMessage({
        type: "STATE_UPDATED",
        citizens: newCitizens,
        activeCitizen: newActive,
        claimsHistory: newClaims || claimsHistory
      });
      channel.close();
    } catch {}
  };

  const setTheme = (newTheme: "light" | "dark") => {
    setThemeState(newTheme);
    try {
      localStorage.setItem("jan_epf_theme", newTheme);
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch {}
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Senior Mode is OFF by default on page load.
  // Sync Dark Theme when Senior Mode is Activated/Deactivated
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (seniorMode) {
        document.documentElement.classList.add("dark");
      } else {
        const savedTheme = localStorage.getItem("jan_epf_theme") as "light" | "dark" | null;
        if (savedTheme !== "dark") {
          document.documentElement.classList.remove("dark");
        }
      }
    }
  }, [seniorMode]);

  // Audio Cue when Senior Mode is Activated
  useEffect(() => {
    if (typeof window !== "undefined" && seniorMode) {
      playNeuralSpeech(
        "Senior Citizen Mode activated. High-contrast typography and digital pension assistance enabled.",
        language || "en-IN"
      ).catch(() => {});
    }
  }, [seniorMode, language]);

  const login = useCallback((uan: string) => {
    const found = citizens.find((c) => c.uan === uan);
    if (found) {
      setActiveCitizen(found);
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem("jan_epf_auth", "true");
        sessionStorage.setItem("jan_epf_uan", uan);
        localStorage.setItem(STORAGE_KEY_ACTIVE_UAN, uan);
      } catch {}
    }
  }, [citizens]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem("jan_epf_auth");
      sessionStorage.removeItem("jan_epf_uan");
      localStorage.removeItem(STORAGE_KEY_ACTIVE_UAN);
    } catch {}
  }, []);

  const switchCitizen = useCallback((uan: string) => {
    const found = citizens.find((c) => c.uan === uan);
    if (found) {
      setActiveCitizen(found);
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem("jan_epf_auth", "true");
        sessionStorage.setItem("jan_epf_uan", uan);
        localStorage.setItem(STORAGE_KEY_ACTIVE_UAN, uan);
      } catch {}
    }
  }, [citizens]);

  const addClaim = useCallback((claim: SubmittedClaim) => {
    setClaimsHistory((prev) => {
      const updatedClaims = [claim, ...prev];
      setActiveCitizen((currentActive) => {
        const deduction = claim.amount_sanctioned || claim.amount_requested || 0;
        const newTotal = Math.max(0, (currentActive.passbook_summary?.total_balance || 0) - deduction);
        const newEmpShare = Math.max(0, (currentActive.passbook_summary?.employee_share || 0) - deduction);
        const updated = {
          ...currentActive,
          passbook_summary: {
            ...currentActive.passbook_summary,
            total_balance: newTotal,
            employee_share: newEmpShare
          }
        };
        setCitizens((all) => {
          const newAll = all.map((c) => (c.uan === updated.uan ? updated : c));
          broadcastStateChange(newAll, updated, updatedClaims);
          return newAll;
        });
        return updated;
      });
      return updatedClaims;
    });
  }, []);

  const mergeEmployment = useCallback((memberId: string) => {
    setActiveCitizen((prev) => {
      const targetEmp = prev.employment_history?.find((e) => e.member_id === memberId);
      if (!targetEmp || targetEmp.transfer_status === "TRANSFERRED_AND_MERGED" || !targetEmp.balance) {
        return prev;
      }
      const transferAmount = targetEmp.balance;
      const updatedHistory = (prev.employment_history || []).map((e) =>
        e.member_id === memberId ? { ...e, transfer_status: "TRANSFERRED_AND_MERGED", balance: 0 } : e
      );
      const newTotal = (prev.passbook_summary?.total_balance || 0) + transferAmount;
      const newEmpShare = (prev.passbook_summary?.employee_share || 0) + transferAmount;

      const updated = {
        ...prev,
        employment_history: updatedHistory,
        passbook_summary: {
          ...prev.passbook_summary,
          total_balance: newTotal,
          employee_share: newEmpShare
        }
      };
      setCitizens((all) => {
        const newAll = all.map((c) => (c.uan === updated.uan ? updated : c));
        broadcastStateChange(newAll, updated);
        return newAll;
      });
      return updated;
    });
  }, []);

  const renewDLC = useCallback(() => {
    setActiveCitizen((prev) => {
      if (!prev.pension_details) return prev;
      const updated = {
        ...prev,
        pension_details: {
          ...prev.pension_details,
          life_certificate_status: "VERIFIED_UNTIL_NOV_2027",
          last_disbursement_date: "2026-08-01 (Current FY Active)"
        }
      };
      setCitizens((all) => {
        const newAll = all.map((c) => (c.uan === updated.uan ? updated : c));
        broadcastStateChange(newAll, updated);
        return newAll;
      });
      return updated;
    });
  }, []);

  const updateActiveCitizenKYC = useCallback((bankName: string, accountMasked: string, ifsc: string) => {
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
      setCitizens((all) => {
        const newAll = all.map((c) => (c.uan === updated.uan ? updated : c));
        broadcastStateChange(newAll, updated);
        return newAll;
      });
      return updated;
    });
  }, []);

  const updateActiveCitizenName = useCallback((newName: string) => {
    setActiveCitizen((prev) => {
      const updated = { ...prev, full_name: newName };
      setCitizens((all) => {
        const newAll = all.map((c) => (c.uan === updated.uan ? updated : c));
        broadcastStateChange(newAll, updated);
        return newAll;
      });
      return updated;
    });
  }, []);

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
        theme,
        toggleTheme,
        setTheme,
        claimsHistory,
        addClaim,
        mergeEmployment,
        renewDLC,
        updateActiveCitizenKYC,
        updateActiveCitizenName,
        apiUrl
      }}
    >
      <div className={`min-h-screen flex flex-col ${seniorMode ? "senior-mode" : ""}`}>
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
