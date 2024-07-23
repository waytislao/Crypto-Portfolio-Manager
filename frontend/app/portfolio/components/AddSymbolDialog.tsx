import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import React, { useEffect } from "react";
import ImageWithFallback from "@/app/lib/components/imageWithFallback";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";

export interface AddSymbolDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (symbol: string, quantity: number) => Promise<void>;
}

export const AddSymbolDialog = ({
  open,
  onClose,
  onConfirm,
}: AddSymbolDialogProps) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [quantity, setQuantity] = React.useState(0);
  const [symbol, setSymbol] = React.useState("");
  const [showRequired, setShowRequired] = React.useState(false);

  const handleSubmit = async () => {
    if (symbol) {
      setIsLoading(true);
      await onConfirm(symbol, quantity);
      setIsLoading(false);
      onClose();
    } else {
      setShowRequired(true);
    }
  };

  const handleCancel = () => {
    if (!isLoading) {
      onClose();
    }
  };

  useEffect(() => {
    if (open) {
      setQuantity(0);
      setSymbol("");
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
                    src={symbol ? `/icons/${symbol}.svg` : "/icons/generic.svg"}
                    alt={symbol}
                    width={48}
                    height={48}
                    fallbackSrc={`/icons/generic.svg`}
                  />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <div>
                    <label className="sr-only">Symbol</label>
                    <div className="relative">
                      <input
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSubmit();
                          }
                        }}
                        value={symbol}
                        onChange={(e) => {
                          const val = e.target.value.toUpperCase();
                          setSymbol(val);
                          if (val) {
                            setShowRequired(false);
                          }
                        }}
                        type="text"
                        className={clsx(
                          "w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm",
                          showRequired && !quantity && "border-red-500",
                        )}
                        placeholder="Enter Coin"
                      />
                    </div>
                  </div>
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
                          className={clsx(
                            "w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm",
                          )}
                          placeholder="Enter quantity"
                        />
                        <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                          {symbol}
                        </span>
                      </div>
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
