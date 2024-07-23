"use client";

import React from "react";

interface CurrencySelectorProps {
  currencyCode: string;
  setCurrencyCode: (currencyCode: string) => void;
}

export const CurrencySelector = ({
  setCurrencyCode,
  currencyCode,
}: CurrencySelectorProps) => {
  return (
    <div>
      <select
        value={currencyCode}
        onChange={(e) => setCurrencyCode(e.target.value)}
        name="CurrencySelector"
        id="CurrencySelector"
        className="w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm h-11"
      >
        {[`THB`, `USD`, `EUR`].map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
};
