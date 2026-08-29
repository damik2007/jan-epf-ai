import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CitizenProvider } from "@/context/CitizenContext";
import { Navbar } from "@/components/Navbar";
import { RouteProgressBar } from "@/components/RouteProgressBar";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import { EvaluatorGate } from "@/components/EvaluatorGate";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#002147",
};

export const metadata: Metadata = {
  title: "Jan-EPF AI • Rebuilding India's Provident Fund (EPFO)",
  description:
    "Topic-Centric, Sovereign Digital Public Infrastructure for 70 Million Indian Citizens. Rebuilt for Build What Moves India.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#060d17] text-slate-900 dark:text-slate-100 antialiased selection:bg-saffron selection:text-sovereign-darkest">
        <ServiceWorkerRegister />
        <RouteProgressBar />
        <EvaluatorGate>
          <CitizenProvider>
            <Navbar />
            {/* 
              pt-18 (72px) on mobile clears the 56px single-row header with generous headroom.
              lg:pt-36 (144px) on desktop clears the 3-tier enterprise header.
              pb-28 (112px) on mobile ensures full scrolling clearance above the 64px bottom nav & floating AI Agent.
              lg:pb-16 on desktop.
            */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 pt-18 sm:pt-20 lg:pt-36 pb-28 sm:pb-28 lg:pb-16">
              {children}
            </main>
            <VoiceAssistant />
            <footer className="bg-sovereign-darkest text-slate-400 text-xs border-t border-sovereign-navy py-6 mt-12 mb-16 md:mb-0">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                    <p className="font-bold text-white">
                      Jan-EPF AI • Digital Public Infrastructure Prototype
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">Zero-Rejection PF Claims for 70 Crore Indian Workers</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Built for <span className="text-saffron font-medium">Build What Moves India</span> (Varun Mayya × OpenAI Hackathon 2026)
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-[11px]">
                    <span>Created by <strong className="text-slate-200">Damik Reddy</strong></span>
                    <span className="text-slate-600">|</span>
                    <a href="mailto:damikreddy2007@gmail.com" className="text-slate-300 hover:text-saffron transition-colors">
                      damikreddy2007@gmail.com
                    </a>
                    <span className="text-slate-600">•</span>
                    <a href="https://github.com/damik2007/jan-epf-ai" target="_blank" rel="noreferrer" className="text-slate-300 hover:text-saffron transition-colors font-medium">
                      GitHub Repo
                    </a>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex flex-col sm:flex-row justify-between gap-2">
                  <p>
                    ⚖️ <strong>Statutory Disclaimer:</strong> Jan-EPF AI is an independent, open-source technology demonstrator built on synthetic mock data. Not officially endorsed by EPFO or Ministry of Labour.
                  </p>
                  <p className="font-mono">
                    AES-256-GCM • DPDP Act 2023 • Presidio Zero-Trust
                  </p>
                </div>
              </div>
            </footer>
          </CitizenProvider>
        </EvaluatorGate>
      </body>
    </html>
  );
}
