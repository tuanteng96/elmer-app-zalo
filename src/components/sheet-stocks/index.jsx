import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { removeStorage } from "zmp-sdk";
import { Icon, Sheet } from "zmp-ui";
import MoreAPI from "../../api/more.api";
import { useLayout } from "../../layout/LayoutProvider";
import { SheetProvince } from "./SheetProvince";

const SheetStocks = () => {
  const {
    CurrentStocks,
    onSaveStocks,
    actionStocksVisible,
    onOpenActionStocks,
    onHideActionStocks,
    setStocks,
    Stocks,
    GlobalConfig,
  } = useLayout();

  useQuery({
    queryKey: ["ListStocks", GlobalConfig],
    queryFn: async () => {
      const { data } = await MoreAPI.getStocks();

      return data?.data?.all
        ? data?.data?.all.filter((x) => x.ParentID !== 0)
        : [];
    },
    onSuccess: (data) => {
      setStocks(
        data
          ? data.map((x) => {
            let obj = { ...x };
            let newDesc = x.DescSEO ? JSON.parse(x.DescSEO) : null;

            if (newDesc && newDesc.place && newDesc.place.length > 0) {
              obj.Province = newDesc.place.filter((o) => o.Parentid > 0)[0];
              obj.District = newDesc.place.filter((o) => !o.Parentid)[0];
            }
            return obj;
          })
          : [],
      );
    },
  });

  useEffect(() => {
    if (Stocks && Stocks.length > 0) {
      if (!CurrentStocks) {
        if (Stocks.length > 1) {
          //onOpenActionStocks();
        } else {
          onSaveStocks(Stocks[0]);
        }
      } else {
        let index = Stocks.findIndex((x) => x.ID === CurrentStocks?.ID);
        if (index === -1) {
          removeStorage({ keys: ["CurrentStocks"] });
          if (Stocks.length > 1) {
            //onOpenActionStocks();
          } else {
            onSaveStocks(Stocks[0]);
          }
        }
      }
    }
  }, [Stocks, CurrentStocks]);

  if (GlobalConfig?.APP?.ByProvince) {
    return <SheetProvince />;
  }
  return createPortal(
    <Sheet
      className="bg-white"
      mask
      autoHeight
      visible={actionStocksVisible}
      onClose={onHideActionStocks}
      swipeToClose
    >
      <div className="h-[80vh] flex flex-col">
        <div className="px-4 min-h-[48px] h-12 flex items-center justify-center">
          Chọn cơ sở gần bạn ?
        </div>
        <div className="grow overflow-auto">
          {Stocks &&
            Stocks.map((item, index) => (
              <div
                className={clsx(
                  "px-12 h-12 border-t border-separator flex items-center justify-center font-semibold capitalize cursor-pointer relative",
                  item.ID === CurrentStocks?.ID && "text-app",
                )}
                key={index}
                onClick={() => onSaveStocks(item)}
              >
                <div className="truncate">{item.Title}</div>
                {item.ID === CurrentStocks?.ID && (
                  <div className="absolute right-4">
                    <Icon icon="zi-check" />
                  </div>
                )}
              </div>
            ))}
        </div>
        <div
          className="px-4 min-h-[48px] h-12 text-center border-t border-separator flex items-center justify-center text-danger font-semibold cursor-pointer"
          onClick={onHideActionStocks}
        >
          Đóng
        </div>
      </div>
    </Sheet>,
    document.body,
  );
};

export { SheetStocks };
