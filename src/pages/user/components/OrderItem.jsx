import React from "react";
import { TruckIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import moment from "moment";
import { ImageLazy } from "../../../components/ImagesLazy";
import { toAbsolutePath } from "../../../utils/assetPath";
import { formatString } from "../../../utils/formatString";
import { Icon } from "zmp-ui";
import { PickerOrder } from "./PickerOrder";
import { PickerOrderPayted } from "./PickerOrderPayted";

export const OrderItem = ({ item }) => {
  const checkStatus = (item) => {
    if (item.Status === "finish") {
      return "success";
    }
    if (item.Status === "cancel" && item.IsReturn !== 0) {
      return "primary";
    }
    if (item.Status === "cancel") {
      return "danger";
    }
    return "warning";
  };

  let TotalDebt = Math.abs(
    item.thanhtoan?.tong_gia_tri_dh -
      item.thanhtoan?.thanh_toan_tien -
      item.thanhtoan?.thanh_toan_vi -
      item.thanhtoan?.thanh_toan_ao,
  );

  let TotalProd =
    item?.Items && item?.Items.reduce((sum, { Qty }) => sum + Qty, 0);

  return (
    <div className="bg-white mt-1.5">
      <div className="px-3 py-3 flex justify-between">
        <TruckIcon className="w-6 text-app" />
        <div className="flex items-center">
          <div className="text-sm">
            {moment(item.OrderDate).format("HH:mm DD-MM-YYYY")}
          </div>
          <div className="w-px bg-gray-300 mx-3 h-5"></div>
          <div className={clsx("font-medium text-" + checkStatus(item))}>
            {item.IsReturn !== 0 && item.Status === "cancel"
              ? "Trả lại"
              : item.StatusText}
          </div>
        </div>
      </div>
      <div className="border-t border-b">
        {item.Items &&
          item.Items.map((prod, index) => (
            <div className="p-3 flex" key={index}>
              <div className="w-16">
                <ImageLazy
                  wrapperClassName="aspect-square !block"
                  className="aspect-square object-cover w-full"
                  effect="blur"
                  src={toAbsolutePath(prod?.ProdThumb)}
                />
              </div>
              <div className="flex-1 pl-3">
                <div className="line-clamp-2 text-sm font-medium">
                  {prod?.ProdTitle}
                </div>
                <div className="flex justify-between mt-1 text-gray-700 items-end">
                  <div className="text-sm">
                    {formatString.formatVND(prod?.ToPay)}
                  </div>
                  <div className="text-xs">x{prod.Qty}</div>
                </div>
              </div>
            </div>
          ))}
      </div>
      <PickerOrder item={item} TotalDebt={TotalDebt}>
        {({ open }) => (
          <div
            className="p-3 flex justify-between border-b items-center cursor-pointer"
            onClick={open}
          >
            <div className="text-muted text-sm">{TotalProd} mặt hàng</div>
            <div className="flex items-center text-sm">
              <span>Thành tiền : </span>
              <span className="text-app pl-2 font-semibold">
                {formatString.formatVND(item.ToPay)}
              </span>
              <Icon className="text-muted" icon="zi-chevron-right" />
            </div>
          </div>
        )}
      </PickerOrder>

      <div className="p-3 flex justify-between items-center">
        <div className="text-sm">
          {TotalDebt > 0 ? (
            <>
              Còn nợ
              <span className="text-app pl-2 font-semibold">
                {formatString.formatVND(TotalDebt)}
              </span>
            </>
          ) : (
            <span className="text-muted">Thanh toán thành công</span>
          )}
        </div>
        <PickerOrderPayted item={item} TotalDebt={TotalDebt}>
          {({ open }) => (
            <button
              onClick={open}
              className={clsx(
                "bg-app text-white h-11 px-4 rounded",
                !(item.Status !== "cancel" && TotalDebt > 0) && "opacity-50",
              )}
              type="button"
              disabled={!(item.Status !== "cancel" && TotalDebt > 0)}
            >
              Thanh toán
            </button>
          )}
        </PickerOrderPayted>
      </div>
    </div>
  );
};
