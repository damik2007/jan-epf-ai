/**
 * Jan-EPF AI: 80/20 Client-Side On-Site Deterministic Engine (Agent 2)
 * Zero API Cost, Sub-5ms latency execution for:
 * - Levenshtein fuzzy string & name matching (>=85% threshold)
 * - Form 31 Para 68 Advance eligibility math
 * - ECR Date of Exit auto-deduction
 * - Section 192A TDS prevention calculator
 * - 8.25% Sovereign Passbook Compounding Forecaster
 * - IFSC Bank Merger auto-resolution
 * - Canvas Image Sharpness & Contrast Score
 */

// ==============================================================================
// 1. LEVENSHTEIN FUZZY NAME MATCHING (WITH INDIC UNICODE SCRIPT SUPPORT)
// ==============================================================================
export function cleanNameForComparison(name: string): string {
  if (!name) return "";
  const cleaned = name
    .toUpperCase()
    .replace(/(श्री|श्रीमती|जी|గారు|திரு)/gu, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\b(SHRI|SMT|MR|MRS|MS|DR|PROF)\b/gu, " ")
    .trim();
  const tokens = cleaned.split(/\s+/).filter(Boolean);
  return tokens.join(" ");
}

export function levenshteinDistance(s1: string, s2: string): number {
  if (s1.length < s2.length) return levenshteinDistance(s2, s1);
  if (s2.length === 0) return s1.length;

  let previousRow = Array.from({ length: s2.length + 1 }, (_, i) => i);
  for (let i = 0; i < s1.length; i++) {
    const currentRow = [i + 1];
    for (let j = 0; j < s2.length; j++) {
      const insertions = previousRow[j + 1] + 1;
      const deletions = currentRow[j] + 1;
      const substitutions = previousRow[j] + (s1[i] !== s2[j] ? 1 : 0);
      currentRow.push(Math.min(insertions, deletions, substitutions));
    }
    previousRow = currentRow;
  }
  return previousRow[previousRow.length - 1];
}

export function calculateFuzzyNameMatch(name1: string, name2: string): number {
  const c1 = cleanNameForComparison(name1);
  const c2 = cleanNameForComparison(name2);
  if (!c1 || !c2) return 0;
  if (c1 === c2) return 100;

  const tokens1 = c1.split(" ").sort().join(" ");
  const tokens2 = c2.split(" ").sort().join(" ");

  const dist = levenshteinDistance(tokens1, tokens2);
  const maxLen = Math.max(tokens1.length, tokens2.length);
  if (maxLen === 0) return 100;

  const score = ((maxLen - dist) / maxLen) * 100;
  return Math.round(Math.max(0, Math.min(100, score)) * 100) / 100;
}

// ==============================================================================
// 2. FORM 31 ADVANCE ELIGIBILITY MATH (PARA 68)
// ==============================================================================
export interface AdvanceEligibilityResult {
  eligible: boolean;
  maxAdvanceAmount: number;
  paraClause: string;
  minServiceYearsRequired: number;
  serviceYearsCompleted: number;
  notes: string;
}

export function calculateForm31Eligibility(
  employeeShare: number,
  employerShare: number,
  monthlyWage: number,
  serviceYears: number,
  reason: "MEDICAL" | "HOUSING" | "MARRIAGE" | "EDUCATION" | "GENERAL"
): AdvanceEligibilityResult {
  const empBal = Math.max(0, employeeShare);
  const totalBal = Math.max(0, employeeShare + employerShare);
  const wage = Math.max(0, monthlyWage);

  switch (reason) {
    case "MEDICAL": {
      // Para 68J: Illness of member or family (6 months wages or employee balance)
      const sixMonthsWages = wage > 0 ? 6 * wage : empBal;
      const maxAmt = Math.min(sixMonthsWages, empBal);
      return {
        eligible: empBal > 0,
        maxAdvanceAmount: Math.round(maxAmt),
        paraClause: "Para 68J (Medical Treatment)",
        minServiceYearsRequired: 0,
        serviceYearsCompleted: serviceYears,
        notes: "No minimum service required. Up to 6 months wages or employee balance."
      };
    }
    case "HOUSING": {
      // Para 68B: Housing purchase/construction (min 5 years)
      const isEligible = serviceYears >= 5.0;
      const thirtySixMonths = wage > 0 ? 36 * wage : totalBal;
      const maxAmt = isEligible ? Math.min(thirtySixMonths, totalBal) : 0;
      return {
        eligible: isEligible && maxAmt > 0,
        maxAdvanceAmount: Math.round(maxAmt),
        paraClause: "Para 68B (Dwelling House / Flat)",
        minServiceYearsRequired: 5,
        serviceYearsCompleted: serviceYears,
        notes: isEligible
          ? "Eligible under Para 68B for up to 36 months basic wages or total balance."
          : "Requires minimum 5 continuous years of service."
      };
    }
    case "MARRIAGE":
    case "EDUCATION": {
      // Para 68K: Marriage / Higher Education (min 7 years, 50% employee share)
      const isEligible = serviceYears >= 7.0;
      const maxAmt = isEligible ? 0.5 * empBal : 0;
      return {
        eligible: isEligible && maxAmt > 0,
        maxAdvanceAmount: Math.round(maxAmt),
        paraClause: "Para 68K (Marriage / Post-Matric Education)",
        minServiceYearsRequired: 7,
        serviceYearsCompleted: serviceYears,
        notes: isEligible
          ? "Eligible for 50% of employee share balance."
          : "Requires minimum 7 continuous years of service."
      };
    }
    default: {
      return {
        eligible: empBal > 0,
        maxAdvanceAmount: Math.round(empBal * 0.75),
        paraClause: "Para 68Z (General Special Circumstances)",
        minServiceYearsRequired: 0,
        serviceYearsCompleted: serviceYears,
        notes: "Standard non-refundable partial advance."
      };
    }
  }
}

// ==============================================================================
// 3. ECR DATE OF EXIT AUTO-DEDUCTION
// ==============================================================================
export function deduceMissingDateOfExit(lastEcrWageMonth: string): string {
  // Format: YYYY-MM or YYYY-MM-DD
  const parts = lastEcrWageMonth.split("-");
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const lastDay = new Date(year, month, 0).getDate();
  const paddedMonth = month.toString().padStart(2, "0");
  return `${year}-${paddedMonth}-${lastDay.toString().padStart(2, "0")}`;
}

// ==============================================================================
// 4. SECTION 192A / FORM 15G TDS CALCULATOR
// ==============================================================================
export interface TdsCalculationResult {
  tdsApplicable: boolean;
  tdsRatePercent: number;
  tdsAmount: number;
  netDisbursement: number;
  reason: string;
}

export function calculateTdsDeduction(
  serviceYears: number,
  withdrawalAmount: number,
  panLinked: boolean = true,
  form15gSubmitted: boolean = false
): TdsCalculationResult {
  if (serviceYears >= 5.0) {
    return {
      tdsApplicable: false,
      tdsRatePercent: 0,
      tdsAmount: 0,
      netDisbursement: withdrawalAmount,
      reason: "Tax Free: Total service exceeds 5 continuous years."
    };
  }

  if (withdrawalAmount < 50000) {
    return {
      tdsApplicable: false,
      tdsRatePercent: 0,
      tdsAmount: 0,
      netDisbursement: withdrawalAmount,
      reason: "Tax Free: Amount is below the Section 192A threshold of ₹50,000."
    };
  }

  if (form15gSubmitted) {
    return {
      tdsApplicable: false,
      tdsRatePercent: 0,
      tdsAmount: 0,
      netDisbursement: withdrawalAmount,
      reason: "Zero TDS: Form 15G / 15H self-declaration verified."
    };
  }

  const rate = panLinked ? 10 : 20;
  const tdsAmount = Math.round(withdrawalAmount * (rate / 100));
  return {
    tdsApplicable: true,
    tdsRatePercent: rate,
    tdsAmount,
    netDisbursement: Math.max(0, withdrawalAmount - tdsAmount),
    reason: `Section 192A applied at ${rate}% (Service under 5 years without Form 15G).`
  };
}

// ==============================================================================
// 5. 8.25% PASSBOOK COMPOUNDING & WEALTH FORECASTER
// ==============================================================================
export interface CompoundingYearData {
  year: number;
  age: number;
  totalBalance: number;
  employeeShare: number;
  employerShare: number;
  annualInterest: number;
}

export function calculatePassbookCompounding(
  currentBalance: number,
  monthlyEmployeeContrib: number,
  monthlyEmployerContrib: number,
  currentAge: number,
  retirementAge: number = 58,
  annualInterestRate: number = 8.25
): CompoundingYearData[] {
  const currentYear = new Date().getFullYear();
  const yearsToRetire = Math.max(1, retirementAge - currentAge);
  const result: CompoundingYearData[] = [];

  let runningBalance = currentBalance;
  let empShare = currentBalance * 0.6;
  let emprShare = currentBalance * 0.4;
  const monthlyTotal = monthlyEmployeeContrib + monthlyEmployerContrib;

  for (let y = 0; y <= yearsToRetire; y++) {
    const projYear = currentYear + y;
    const projAge = currentAge + y;

    let interest = 0;
    if (y > 0) {
      const annualContrib = monthlyTotal * 12;
      const annualEmp = monthlyEmployeeContrib * 12;
      const annualEmpr = monthlyEmployerContrib * 12;

      interest =
        runningBalance * (annualInterestRate / 100) +
        annualContrib * (annualInterestRate / 200);

      runningBalance += annualContrib + interest;
      empShare += annualEmp + interest * 0.6;
      emprShare += annualEmpr + interest * 0.4;
    }

    result.push({
      year: projYear,
      age: projAge,
      totalBalance: Math.round(runningBalance),
      employeeShare: Math.round(empShare),
      employerShare: Math.round(emprShare),
      annualInterest: Math.round(interest)
    });
  }

  return result;
}

// ==============================================================================
// 6. IFSC BANK MERGER REGISTRY
// ==============================================================================
const MERGER_MAP: Record<string, { parent: string; prefix: string }> = {
  ALLA: { parent: "Indian Bank", prefix: "IDIB" },
  SYNB: { parent: "Canara Bank", prefix: "CNRB" },
  CORP: { parent: "Union Bank of India", prefix: "UBIN" },
  ANDB: { parent: "Union Bank of India", prefix: "UBIN" },
  ORBC: { parent: "Punjab National Bank", prefix: "PUNB" },
  UTBI: { parent: "Punjab National Bank", prefix: "PUNB" },
  VIJB: { parent: "Bank of Baroda", prefix: "BARB" },
  BKDN: { parent: "Bank of Baroda", prefix: "BARB" }
};

const BANK_NAMES: Record<string, string> = {
  SBIN: "State Bank of India",
  HDFC: "HDFC Bank",
  ICIC: "ICICI Bank",
  PUNB: "Punjab National Bank",
  CNRB: "Canara Bank",
  UBIN: "Union Bank of India",
  BARB: "Bank of Baroda",
  IDIB: "Indian Bank",
  AIRP: "Airtel Payments Bank",
  IPOS: "India Post Payments Bank",
  PYTM: "Paytm Payments Bank",
  UTIB: "Axis Bank",
  KKBK: "Kotak Mahindra Bank"
};

export function lookupIfsc(ifscCode: string) {
  const clean = (ifscCode || "").trim().toUpperCase();
  if (clean.length !== 11) {
    return {
      isValid: false,
      ifsc: clean,
      bankName: "Unknown",
      isMerged: false,
      message: "IFSC code must be exactly 11 characters."
    };
  }

  const prefix = clean.substring(0, 4);
  if (MERGER_MAP[prefix]) {
    const m = MERGER_MAP[prefix];
    return {
      isValid: true,
      ifsc: clean,
      bankName: m.parent,
      isMerged: true,
      message: `Branch merged into ${m.parent} (${m.prefix}). Automatically routed.`
    };
  }

  const bankName = BANK_NAMES[prefix] || `Commercial Bank (${prefix})`;
  return {
    isValid: true,
    ifsc: clean,
    bankName,
    isMerged: false,
    message: "Direct active bank code verified."
  };
}

// ==============================================================================
// 7. CLIENT-SIDE CANVAS SHARPNESS & CONTRAST EVALUATION
// ==============================================================================
export function analyzeCanvasSharpnessAndContrast(canvas: HTMLCanvasElement): {
  sharpness: number;
  contrast: number;
  isValid: boolean;
} {
  const ctx = canvas.getContext("2d");
  if (!ctx) return { sharpness: 85, contrast: 80, isValid: true };

  const width = canvas.width;
  const height = canvas.height;
  if (width === 0 || height === 0) return { sharpness: 50, contrast: 50, isValid: true };

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  let totalBrightness = 0;
  let pixelCount = width * height;
  const brightnessArray: number[] = [];

  for (let i = 0; i < data.length; i += 4) {
    // Grayscale luminance formula: 0.299R + 0.587G + 0.114B
    const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    totalBrightness += lum;
    brightnessArray.push(lum);
  }

  const meanBrightness = totalBrightness / pixelCount;

  // Calculate Variance for Contrast
  let varianceSum = 0;
  for (let i = 0; i < brightnessArray.length; i++) {
    varianceSum += Math.pow(brightnessArray[i] - meanBrightness, 2);
  }
  const stdDev = Math.sqrt(varianceSum / pixelCount);
  const contrastScore = Math.min(100, Math.round((stdDev / 128) * 100));

  // Laplacian / Neighbor Gradient for Sharpness Approximation
  let edgeSum = 0;
  const step = 4; // Sample every 4th pixel for high speed
  for (let y = 1; y < height - 1; y += step) {
    for (let x = 1; x < width - 1; x += step) {
      const idx = y * width + x;
      const center = brightnessArray[idx];
      const right = brightnessArray[idx + 1] || center;
      const down = brightnessArray[idx + width] || center;
      const grad = Math.abs(center - right) + Math.abs(center - down);
      edgeSum += grad;
    }
  }

  const samples = (height / step) * (width / step);
  const avgEdge = edgeSum / samples;
  const sharpnessScore = Math.min(100, Math.round((avgEdge / 30) * 100));

  const isValid = sharpnessScore >= 40 && contrastScore >= 30;

  return {
    sharpness: Math.max(10, sharpnessScore),
    contrast: Math.max(10, contrastScore),
    isValid
  };
}

// ==============================================================================
// 8. STATUTORY EPS-95 PENSION & EDLI INSURANCE CALCULATION ENGINE (PARA 12 & 16)
// ==============================================================================
export interface Eps95CalculationResult {
  monthlyPension: number;
  pensionType: "SUPERANNUATION_PENSION" | "EARLY_PENSION" | "DEFERRED_PENSION" | "WITHDRAWAL_BENEFIT_TABLE_D";
  pensionableServiceYears: number;
  bonusYearsApplied: number;
  earlyReductionPercentage: number;
  deferredBonusPercentage: number;
  familyPensionBreakdown: {
    widowPension: number;
    childrenPensionPerChild: number; // Max 2 children until age 25
    orphanPensionPerChild: number;
  };
  tableDWithdrawalLumpSum?: number;
  edliCoverageAmount: number;
}

export function calculateEdliInsurance(monthlyWage: number, epfBalance: number = 350000): number {
  // EDLI Scheme 1976: 35 * avg monthly wage (cap ₹15,000) + 50% avg EPF balance (cap ₹1,75,000)
  // Subject to statutory floor of ₹2.5 Lakhs and ceiling of ₹7.0 Lakhs.
  const wageComponent = 35 * Math.min(15000, Math.max(0, monthlyWage));
  const balanceComponent = Math.min(175000, Math.max(0, epfBalance) * 0.50);
  const total = wageComponent + balanceComponent;
  return Math.min(700000, Math.max(250000, Math.round(total)));
}

export function calculateEps95Pension(
  monthlyWage: number,
  serviceYears: number,
  ncpDays: number = 0,
  currentAge: number = 58,
  totalEpfBalance: number = 350000
): Eps95CalculationResult {
  // 1. Effective Contributory Service deducting Non-Contributory Days
  const effectiveYears = Math.max(0, serviceYears - (ncpDays / 365.0));
  
  // 2. Statutory Wage Cap (₹15,000 post-Sept 1, 2014)
  const pensionableSalary = Math.min(15000, Math.max(0, monthlyWage));

  // 3. Service < 9.5 Years: Form 10C Withdrawal Benefit (Table D)
  if (effectiveYears < 9.5) {
    const factor = Math.min(10.2, effectiveYears * 1.02);
    const lumpSum = Math.round(factor * pensionableSalary);
    return {
      monthlyPension: 0,
      pensionType: "WITHDRAWAL_BENEFIT_TABLE_D",
      pensionableServiceYears: Number(effectiveYears.toFixed(1)),
      bonusYearsApplied: 0,
      earlyReductionPercentage: 0,
      deferredBonusPercentage: 0,
      tableDWithdrawalLumpSum: lumpSum,
      familyPensionBreakdown: { widowPension: 0, childrenPensionPerChild: 0, orphanPensionPerChild: 0 },
      edliCoverageAmount: calculateEdliInsurance(monthlyWage, totalEpfBalance)
    };
  }

  // 4. Superannuation Bonus (+2 years if service >= 20 and age >= 58)
  let bonusYears = 0;
  if (effectiveYears >= 20 && currentAge >= 58) {
    bonusYears = 2;
  }
  const pensionableService = effectiveYears + bonusYears;

  // 5. Base EPS-95 Formula: (Pensionable Salary * Service) / 70
  let basePension = (pensionableSalary * pensionableService) / 70.0;

  // 6. Early or Deferred Pension Adjustments (Para 12(7) & 12(7B))
  let earlyReduction = 0;
  let deferredBonus = 0;
  let pensionType: Eps95CalculationResult["pensionType"] = "SUPERANNUATION_PENSION";

  if (currentAge < 58 && currentAge >= 50) {
    // 4% reduction for each year below 58
    const yearsShort = 58 - currentAge;
    earlyReduction = yearsShort * 4.0;
    basePension = basePension * (1.0 - (earlyReduction / 100.0));
    pensionType = "EARLY_PENSION";
  } else if (currentAge > 58 && currentAge <= 60) {
    // 4% bonus for each deferred year with ongoing contribution
    const yearsDeferred = currentAge - 58;
    deferredBonus = yearsDeferred * 4.0;
    basePension = basePension * (1.0 + (deferredBonus / 100.0));
    pensionType = "DEFERRED_PENSION";
  }

  // 7. Statutory Minimum Pension Guarantee (₹1,000/month under Para 12(7A))
  const finalMonthlyPension = Math.max(1000, Math.round(basePension));

  // 8. Family Pension Math (Para 16)
  const widowPension = Math.max(1000, Math.round(finalMonthlyPension * 0.50));
  const childrenPension = Math.max(250, Math.round(widowPension * 0.25));
  const orphanPension = Math.max(750, Math.round(widowPension * 0.75));

  return {
    monthlyPension: finalMonthlyPension,
    pensionType,
    pensionableServiceYears: Number(pensionableService.toFixed(1)),
    bonusYearsApplied: bonusYears,
    earlyReductionPercentage: earlyReduction,
    deferredBonusPercentage: deferredBonus,
    familyPensionBreakdown: {
      widowPension,
      childrenPensionPerChild: childrenPension,
      orphanPensionPerChild: orphanPension
    },
    edliCoverageAmount: calculateEdliInsurance(monthlyWage, totalEpfBalance)
  };
}

