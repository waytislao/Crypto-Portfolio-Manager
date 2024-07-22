import React, { createContext, useContext } from "react";

export interface PortfolioContextType {
  currencyFormatter: Intl.NumberFormat;
  currencyCode: string;
}

const PortfolioContext = createContext<PortfolioContextType>({
  currencyCode: "THB",
  currencyFormatter: new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "THB",
  }),
});
export const PortfolioProvider = ({
  children,
  currencyCode,
}: {
  children: React.ReactNode;
  currencyCode: string;
}) => {
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  });
  return (
    <PortfolioContext.Provider value={{ currencyFormatter, currencyCode }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolioContext = () => useContext(PortfolioContext);
