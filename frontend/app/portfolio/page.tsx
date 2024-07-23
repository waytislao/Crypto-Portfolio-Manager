"use client";

import { useAPIFetch } from "@/app/lib/hooks/useAPIFetch";
import { useEffect, useState } from "react";
import { usePortfolioContext } from "@/app/portfolio/portfolioContext";
import {
  SymbolItem,
  SymbolItemType,
} from "@/app/portfolio/components/SymbolItem";

export default function Page() {
  const { currencyFormatter, currencyCode } = usePortfolioContext();
  const [reload, setReload] = useState(0);
  const { request, isLoading, response } = useAPIFetch<SymbolItemType[]>(
    "GET",
    "/portfolio?currencyCode=" + currencyCode,
  );
  useEffect(() => {
    request();
  }, [currencyCode, reload]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid sm:grid-cols-3 sm:flex-row gap-4">
      {response?.data.map((item) => (
        <SymbolItem
          key={item.symbol}
          item={item}
          currencyFormatter={currencyFormatter}
          onChange={() => setReload(reload + 1)}
        />
      ))}

      {response?.data.length === 0 && (
        <>
          <div className="col-span-3 text-center">
            <p className="text-gray-500">
              There's no coin in your portfolio. Add a coin to get started.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
