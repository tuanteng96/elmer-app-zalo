import React from "react";
import { NavLink } from "react-router-dom";
import { formatString } from "../../utils/formatString";

export const Card = ({ item }) => {
  const { PriceSale, PriceProduct, SaleBegin, SaleEnd, IsDisplayPrice } = item;
  const isSale =
    SaleBegin &&
    SaleEnd &&
    IsDisplayPrice !== 0 &&
    Date.parse(new Date()) < Date.parse(SaleEnd) &&
    Date.parse(SaleBegin) <= Date.parse(new Date()) &&
    PriceSale > 0;

  return (
    <NavLink
      to={`/catalogue/${item.ID}`}
      className="flex border-t border-dashed p-3 text-sm"
    >
      <div className="font-semibold w-7/12">{item.Title}</div>
      <div className="flex-1 flex flex-col items-end">
        <div className="text-danger font-semibold">
          {IsDisplayPrice !== 0
            ? formatString.formatVND(isSale ? PriceSale : PriceProduct)
            : "Liên hệ"}
        </div>
        {isSale && (
          <span className="text-muted line-through">
            {formatString.formatVND(PriceProduct)}
          </span>
        )}
      </div>
    </NavLink>
  );
};
