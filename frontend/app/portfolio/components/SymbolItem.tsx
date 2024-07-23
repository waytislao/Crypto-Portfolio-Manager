import ImageWithFallback from "@/app/lib/components/imageWithFallback";
import { useState } from "react";
import { DeleteSymbolDialog } from "@/app/portfolio/components/DeleteSymbolDialog";
import { useAPIFetch } from "@/app/lib/hooks/useAPIFetch";
import { UpdateSymbolDialog } from "@/app/portfolio/components/UpdateSymbolDialog";

export interface SymbolItemType {
  symbol: string;
  quantity: number;
  value: number;
}

interface SymbolItemProps {
  item: SymbolItemType;
  currencyFormatter: Intl.NumberFormat;
  onChange: () => void;
}

export const SymbolItem = ({
  item,
  currencyFormatter,
  onChange,
}: SymbolItemProps) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const { request: reqDelete } = useAPIFetch<SymbolItemType[]>(
    "DELETE",
    "/portfolio/" + item.symbol,
  );
  const { request: reqEdit } = useAPIFetch<SymbolItemType[]>(
    "PUT",
    "/portfolio/" + item.symbol,
  );

  return (
    <>
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
        <button
          className="inline-block rounded border px-2 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring active:bg-indigo-500 ml-auto"
          onClick={() => {
            setOpenEditDialog(true);
          }}
        >
          Edit
        </button>
        <button
          className="inline-block rounded border px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-600 hover:text-white focus:outline-none focus:ring active:bg-red-500"
          onClick={() => setOpenDeleteDialog(true)}
        >
          Delete
        </button>
      </article>
      <DeleteSymbolDialog
        data={item}
        onClose={() => {
          setOpenDeleteDialog(false);
        }}
        open={openDeleteDialog}
        onConfirm={async () => {
          await reqDelete();
          onChange();
        }}
      />
      <UpdateSymbolDialog
        data={item}
        onClose={() => {
          setOpenEditDialog(false);
        }}
        open={openEditDialog}
        onConfirm={async (quantity) => {
          await reqEdit({ quantity });
          onChange();
        }}
      />
    </>
  );
};
