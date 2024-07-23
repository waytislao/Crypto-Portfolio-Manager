"use client";

import React, { ReactNode, useState } from "react";
import { PortfolioProvider } from "@/app/portfolio/portfolioContext";
import { CurrencySelector } from "@/app/portfolio/components/currencySelector";
import { AddSymbolDialog } from "@/app/portfolio/components/AddSymbolDialog";
import { useAPIFetch } from "@/app/lib/hooks/useAPIFetch";
import { SymbolItemType } from "@/app/portfolio/components/SymbolItem";
import { getCookie, setCookie } from "cookies-next";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const { request: reqAddSymbol } = useAPIFetch<SymbolItemType[]>(
    "POST",
    "/portfolio",
  );

  const [currencyCode, setCurrencyCode] = React.useState(
    getCookie("currencyCode") || "THB",
  );
  const handleCurrencyChange = (newCurrencyCode: string) => {
    setCurrencyCode(newCurrencyCode);
    setCookie("currencyCode", newCurrencyCode);
    window.location.reload();
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
                {"Let's see how your investments are doing"}
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
              <button
                className="block rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring"
                type="button"
                onClick={() => {
                  setOpenAddDialog(true);
                }}
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

        <AddSymbolDialog
          onClose={() => {
            setOpenAddDialog(false);
          }}
          open={openAddDialog}
          onConfirm={async (symbol, quantity) => {
            const res = await reqAddSymbol({ cryptoSymbol: symbol, quantity });
            if (res.status === "fail") {
              alert(res.message);
            } else {
              window.location.reload();
            }
          }}
        />
      </main>
    </PortfolioProvider>
  );
}
