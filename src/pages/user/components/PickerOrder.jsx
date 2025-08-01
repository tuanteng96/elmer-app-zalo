import React, { useState } from "react";
import clsx from "clsx";
import { createPortal } from "react-dom";
import { Sheet } from "zmp-ui";
import { formatString } from "../../../utils/formatString";

export const PickerOrder = ({ children, item, TotalDebt }) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      {children({
        open: () => setVisible(true),
        close: () => setVisible(false),
      })}
      {createPortal(
        <Sheet visible={visible} onClose={() => setVisible(false)} autoHeight>
          <div>
            <div className="p-3 flex justify-between border-b">
              <span>Tổng đơn hàng</span>
              <span className="font-semibold">
                {formatString.formatVND(item.ToPay)}
              </span>
            </div>
            {item.Status !== "cancel" && (
              <>
                {item.Status === "finish" && (
                  <>
                    {item.thanhtoan.thanh_toan_tien > 0 && (
                      <div className="p-3 flex justify-between items-center border-b">
                        <span>Thanh toán thực tế</span>
                        <span className="font-semibold">
                          {formatString.formatVND(
                            Math.abs(item.thanhtoan.thanh_toan_tien),
                          )}
                        </span>
                      </div>
                    )}
                    {item.thanhtoan.thanh_toan_vi > 0 && (
                      <div className="p-3 flex justify-between items-center border-b">
                        <span>Thanh toán ví</span>
                        <span className="font-semibold">
                          {formatString.formatVND(
                            Math.abs(item.thanhtoan.thanh_toan_vi),
                          )}
                        </span>
                      </div>
                    )}
                    {item.thanhtoan.hoan_vi_tra_hang > 0 && (
                      <div className="p-3 flex justify-between items-center border-b">
                        <span>Hoàn ví khi trả hàng</span>
                        <span className="font-semibold">
                          {formatString.formatVND(
                            Math.abs(item.thanhtoan.hoan_vi_tra_hang),
                          )}
                        </span>
                      </div>
                    )}
                    {item.thanhtoan.hoan_vi_ket_thuc_the > 0 && (
                      <div className="p-3 flex justify-between items-center border-b">
                        <span>Hoàn ví khi kết thúc thẻ</span>
                        <span className="font-semibold">
                          {formatString.formatVND(
                            Math.abs(item.thanhtoan.hoan_vi_ket_thuc_the),
                          )}
                        </span>
                      </div>
                    )}
                    {item.thanhtoan.ket_thuc_the_hoan_tien > 0 && (
                      <div className="p-3 flex justify-between items-center border-b">
                        <span>Kết thúc thẻ hoàn tiền</span>
                        <span className="font-semibold">
                          {formatString.formatVND(
                            Math.abs(item.thanhtoan.ket_thuc_the_hoan_tien),
                          )}
                        </span>
                      </div>
                    )}
                    {item.thanhtoan.ket_thuc_the_hoan_vi > 0 && (
                      <div className="p-3 flex justify-between items-center border-b">
                        <span>Kết thúc thẻ hoàn ví</span>
                        <span className="font-semibold">
                          {formatString.formatVND(
                            Math.abs(item.thanhtoan.ket_thuc_the_hoan_vi),
                          )}
                        </span>
                      </div>
                    )}
                    {item.thanhtoan.tra_hang_hoan_tien > 0 && (
                      <div className="p-3 flex justify-between items-center border-b">
                        <span>Trả hàng hoàn tiền</span>
                        <span className="font-semibold">
                          {formatString.formatVND(
                            Math.abs(item.thanhtoan.tra_hang_hoan_tien),
                          )}
                        </span>
                      </div>
                    )}
                    {item.thanhtoan.tra_hang_hoan_vi > 0 && (
                      <div className="p-3 flex justify-between items-center border-b">
                        <span>Trả hàng ví</span>
                        <span className="font-semibold">
                          {formatString.formatVND(
                            Math.abs(item.thanhtoan.tra_hang_hoan_vi),
                          )}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
            {TotalDebt > 0 && (
              <div className="p-3 flex justify-between items-center border-b">
                <span>Còn nợ</span>
                <span className="font-semibold">
                  {formatString.formatVND(TotalDebt)}
                </span>
              </div>
            )}
          </div>
        </Sheet>,
        document.body,
      )}
    </>
  );
};
