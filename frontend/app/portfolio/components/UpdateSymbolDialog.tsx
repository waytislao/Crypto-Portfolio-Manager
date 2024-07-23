import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import React, { useEffect } from "react";
import { SymbolItemType } from "@/app/portfolio/components/SymbolItem";
import ImageWithFallback from "@/app/lib/components/imageWithFallback";
import { usePortfolioContext } from "@/app/portfolio/portfolioContext";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

export interface SymbolFormDialogProps {
  open: boolean;
  onClose: () => void;
  data: SymbolItemType;
  onConfirm: (quantity: number) => Promise<void>;
}

export const UpdateSymbolDialog = ({
  open,
  onClose,
  data,
  onConfirm,
}: SymbolFormDialogProps) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [quantity, setQuantity] = React.useState(data.quantity);
  const rate = data.quantity === 0 ? undefined : data.value / data.quantity;
  const { currencyFormatter } = usePortfolioContext();

  const handleSubmit = async () => {
    setIsLoading(true);
    await onConfirm(quantity);
    setIsLoading(false);
    onClose();
  };

  const handleCancel = () => {
    if (!isLoading) {
      onClose();
    }
  };

  useEffect(() => {
    if (open) {
      setQuantity(data.quantity);
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={handleCancel} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10">
                  <ImageWithFallback
                    src={`/icons/${data.symbol}.svg`}
                    alt={data.symbol}
                    width={48}
                    height={48}
                    fallbackSrc={`/icons/generic.svg`}
                  />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold leading-6 text-gray-900"
                  >
                    Edit {data.symbol}
                  </DialogTitle>
                  <div className="mt-2">
                    <div>
                      <label className="sr-only">Quantity</label>

                      <div className="relative">
                        <input
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSubmit();
                            }
                          }}
                          min={0}
                          value={quantity}
                          onChange={(e) => setQuantity(+e.target.value)}
                          type="number"
                          className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                          placeholder="Enter quantity"
                        />
                        <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                          {data.symbol}
                        </span>
                      </div>

                      {!!rate && (
                        <span className="text-sm text-gray-700">
                          Approx. value:{" "}
                          {currencyFormatter.format(quantity * rate)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                disabled={isLoading}
                type="button"
                onClick={handleSubmit}
                className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
              >
                {isLoading ? (
                  <ArrowPathIcon
                    aria-hidden="true"
                    className="h-5 w-5 text-white animate-spin"
                  />
                ) : (
                  "Edit"
                )}
              </button>
              <button
                disabled={isLoading}
                type="button"
                data-autofocus
                onClick={() => handleCancel()}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};
