import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CitizenProvider } from "@/context/CitizenContext";
import { Navbar } from "@/components/Navbar";
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
        <EvaluatorGate>
          <CitizenProvider>
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-28 pb-10">
              {children}
            </main>
            <VoiceAssistant />
            <footer className="bg-sovereign-darkest text-slate-400 text-xs border-t border-sovereign-navy py-6 mt-12">
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
                  <span className="text-emerald-400 font-semibold">Zero-Trust RLS Protected</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-samriddhi-bright font-semibold">80/20 On-Site Sovereign Core</span>
                </div>
              </div>

              {/* Compliance & Legal Disclaimer */}
              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                <p>
                  ⚠️ <strong>Disclaimer:</strong> Jan-EPF AI is an independent, open-source proof-of-concept created by Damik Reddy for the Build What Moves India Hackathon. Not affiliated with or endorsed by EPFO or the Government of India. All data is synthetic.
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
