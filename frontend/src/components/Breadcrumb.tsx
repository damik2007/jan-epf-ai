"use client";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbProps {
  currentPage: string;
}

export function Breadcrumb({ currentPage }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4">
      <Link href="/" className="flex items-center gap-1 hover:text-saffron transition-colors">
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>
      <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" />
      <span className="font-semibold text-sovereign-navy dark:text-white">{currentPage}</span>
    </nav>
  );
}
