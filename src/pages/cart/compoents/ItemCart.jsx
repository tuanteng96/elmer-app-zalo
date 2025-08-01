import React from "react";
import { ImageLazy } from "../../../components/ImagesLazy";
import { toAbsolutePath } from "../../../utils/assetPath";
import { formatString } from "../../../utils/formatString";
import { PickerCart } from "./PickerCart";

const ItemCart = ({ item }) => {
  return (
    <PickerCart item={item}>
      {({ open }) => (
        <div
          className="p-3 flex bg-[#f6f6f6] border-b border-white last:border-0"
          onClick={open}
        >
          <div className="w-16">
            <ImageLazy
              wrapperClassName="aspect-square !block"
              className="aspect-square object-cover w-full"
              effect="blur"
              src={toAbsolutePath(item?.ProdThumb)}
            />
          </div>
          <div className="flex-1 pl-3">
            <div className="line-clamp-2 text-gray-700 text-xs">
              {item?.ProdTitle}
            </div>
            <div className="flex justify-between mt-1 text-gray-700 items-end">
              <div className="text-sm">
                {formatString.formatVND(item?.ToPay)}
              </div>
              <div className="text-xs">x{item.Qty}</div>
            </div>
          </div>
        </div>
      )}
    </PickerCart>
  );
};

export { ItemCart };
