"use client";

import React from "react";
import Link from "next/link";
import { useCitizen } from "@/context/CitizenContext";
import { getTranslation } from "@/lib/translations";
import {
  Wallet,
  Briefcase,
  PiggyBank,
  Wrench,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  CheckCircle2
} from "lucide-react";

export default function CitizenLandingPage() {
  const { activeCitizen, language } = useCitizen();
  const t = getTranslation(language);

  const totalBalance = activeCitizen.passbook_summary?.total_balance || 0;
  const employeeShare = activeCitizen.passbook_summary?.employee_share || 0;
  const interestEarned = activeCitizen.passbook_summary?.interest_credited_current_fy || 0;

  const topicHubs = [
    {
      title: t.navMoney,
      desc: t.homeMoneyDesc,
      href: "/money",
      icon: Wallet,
      tag: "Para 68",
      tagColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
      accent: "from-emerald-600 to-teal-700",
      stat: "Instant DBT"
    },
    {
      title: t.navCareer,
      desc: t.homeCareerDesc,
      href: "/career",
      icon: Briefcase,
      tag: "Form 13",
      tagColor: "bg-blue-100 text-blue-800 border-blue-300",
      accent: "from-blue-600 to-indigo-800",
      stat: "Auto-Exit Deducer"
    },
    {
      title: t.navSavings,
      desc: t.homeSavingsDesc,
      href: "/savings",
      icon: PiggyBank,
      tag: "8.25%",
      tagColor: "bg-amber-100 text-amber-900 border-amber-300",
      accent: "from-amber-500 to-yellow-600",
      stat: "₹7 Lakh EDLI"
    },
    {
      title: t.navFix,
      desc: t.homeFixDesc,
      href: "/fix",
      icon: Wrench,
      tag: "Penny Drop",
      tagColor: "bg-purple-100 text-purple-800 border-purple-300",
      accent: "from-purple-600 to-indigo-700",
      stat: "3-Way Digital"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Citizen Welcome Banner & Balance Overview */}
      <section className="bg-gradient-to-br from-sovereign-darkest via-sovereign-navy to-sovereign-light text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-sovereign-accent relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-saffron/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-samriddhi-gold/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-saffron text-sovereign-darkest">
                CITIZEN REDESIGN PROTOTYPE
              </span>
              <span className="text-xs text-slate-300">
                SIMULATED UAN: <strong className="font-mono text-white">{activeCitizen.uan}</strong>
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {activeCitizen.full_name}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              {activeCitizen.active_employment
                ? `${t.activeEstablishmentLabel}: ${activeCitizen.active_employment.establishment_name} (${activeCitizen.active_employment.total_service_years} years)`
                : activeCitizen.pension_details
                ? `Senior Pensioner • PPO: ${activeCitizen.pension_details.ppo_number} • ${activeCitizen.pension_details.scheme}`
                : "Gig Platform / Unorganized Contributor"}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 text-xs bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm border border-white/10 text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t.verifiedKYCLabel}: {activeCitizen.bank_kyc.bank_name} ({t.verified})</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm border border-white/10 text-amber-300">
                <Zap className="w-3.5 h-3.5" />
                <span>8.25% Sovereign Rate Active</span>
              </div>
            </div>
          </div>

          {/* Quick Balance Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl w-full lg:w-80 shadow-2xl space-y-3">
            <div className="flex justify-between items-center text-xs text-slate-300">
              <span>{t.totalBalanceLabel}</span>
              <span className="text-emerald-400 font-bold">● {t.verified}</span>
            </div>
            <div className="text-3xl font-black font-mono text-white tracking-tight">
              ₹{totalBalance.toLocaleString("en-IN")}
            </div>
            <div className="text-xs text-slate-300 flex justify-between border-t border-white/10 pt-2">
              <span>{t.employeeShare}:</span>
              <span className="font-semibold text-white">₹{employeeShare.toLocaleString("en-IN")}</span>
            </div>
            <div className="text-xs text-slate-300 flex justify-between">
              <span>FY Interest:</span>
              <span className="font-semibold text-samriddhi-bright">₹{interestEarned.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Topic-Centric Life Event Hubs */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-sovereign-navy">
              {t.quickActionsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {t.homeSubtitle}
            </p>
          </div>
          <span className="hidden sm:inline-block text-xs font-semibold text-saffron-dark bg-saffron/10 px-3 py-1 rounded-full border border-saffron/30">
            {t.sovereignBadge}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {topicHubs.map((hub) => {
            const Icon = hub.icon;
            return (
              <Link
                key={hub.href}
                href={hub.href}
                className="group bg-white rounded-2xl border-2 border-slate-200 hover:border-sovereign-navy p-5 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${hub.accent} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${hub.tagColor}`}>
                      {hub.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-sovereign-navy group-hover:text-saffron-dark transition-colors">
                      {hub.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {hub.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sovereign-navy group-hover:text-saffron transition-colors">
                  <span>{hub.stat}</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 80/20 On-Site Architectural Guarantees */}
      <section className="bg-slate-100 rounded-2xl p-6 border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">{t.sovereignBadge}</h4>
              <p className="text-[11px] text-slate-600 mt-0.5">
                {t.homeSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">{t.securityPillarTitle}</h4>
              <p className="text-[11px] text-slate-600 mt-0.5">
                {t.securityPillarDesc}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">{t.resiliencePillarTitle}</h4>
              <p className="text-[11px] text-slate-600 mt-0.5">
                {t.resiliencePillarDesc}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
