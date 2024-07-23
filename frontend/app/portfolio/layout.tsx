"use client";

import React, { ReactNode } from "react";
import { PortfolioProvider } from "@/app/portfolio/portfolioContext";
import { CurrencySelector } from "@/app/portfolio/components/currencySelector";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const [currencyCode, setCurrencyCode] = React.useState(
    localStorage.getItem("currencyCode") || "THB",
  );
  const handleCurrencyChange = (newCurrencyCode: string) => {
    setCurrencyCode(newCurrencyCode);
    localStorage.setItem("currencyCode", newCurrencyCode);
  };
  return (
    <PortfolioProvider currencyCode={currencyCode}>
      <header className="bg-gray-50">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Your Portfolio
              </h1>

              <p className="mt-1.5 text-sm text-gray-500">
                Let's see how your investments are doing
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
              <button
                className="block rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring"
                type="button"
              >
                Add Investment
              </button>
              <CurrencySelector
                currencyCode={currencyCode}
                setCurrencyCode={handleCurrencyChange}
              />
            </div>
          </div>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          {children}
        </div>
      </main>
    </PortfolioProvider>
  );
}
