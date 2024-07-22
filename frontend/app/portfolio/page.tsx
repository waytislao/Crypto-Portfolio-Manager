"use client";

import { useAPIFetch } from "@/app/lib/hooks/useAPIFetch";
import { useEffect } from "react";
import ImageWithFallback from "@/app/lib/components/imageWithFallback";
import { usePortfolioContext } from "@/app/portfolio/portfolioContext";

export default function Page() {
  const { currencyFormatter, currencyCode } = usePortfolioContext();
  const { request, isLoading, response } = useAPIFetch<any[]>(
    "GET",
    "/portfolio?currencyCode=" + currencyCode,
  );
  useEffect(() => {
    request();
  }, [currencyCode]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid sm:grid-cols-3 sm:flex-row gap-4">
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="grid sm:grid-cols-3 sm:flex-row gap-4">
        {response?.data.map((item) => (
          <article
            className="flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-6"
            key={item.symbol}
          >
            <ImageWithFallback
              src={`/icons/${item.symbol}.svg`}
              alt={item.symbol}
              width={48}
              height={48}
              fallbackSrc={`/icons/generic.svg`}
            />
            <div>
              <p className="text-2xl font-medium text-gray-900">
                {item.quantity} {item.symbol}
              </p>
              <p className="text-sm text-gray-500">
                {currencyFormatter.format(item.value)}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
