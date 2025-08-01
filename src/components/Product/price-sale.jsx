import React from "react";
import { formatString } from "../../utils/formatString";

const PriceSale = ({
  PriceSale,
  Price,
  SaleBegin,
  SaleEnd,
  IsDisplayPrice,
}) => {
  const isSale =
    SaleBegin &&
    SaleEnd &&
    IsDisplayPrice !== 0 &&
    Date.parse(new Date()) < Date.parse(SaleEnd) &&
    Date.parse(SaleBegin) <= Date.parse(new Date()) &&
    PriceSale > 0;

  const percentSale = 100 - (PriceSale / Price) * 100;

  return (
    <>
      <div className="text-danger font-semibold text-sm">
        {IsDisplayPrice !== 0
          ? formatString.formatVND(isSale ? PriceSale : Price)
          : "Liên hệ"}
      </div>
      {isSale && (
        <div>
          <span className="text-muted text-xs line-through">
            {formatString.formatVND(Price)}
          </span>
          {percentSale > 0 && percentSale <= 100 && (
            <span className="text-danger text-xs pl-2 font-semibold">
              -{percentSale}%
            </span>
          )}
        </div>
      )}
    </>
  );
};

export { PriceSale };
