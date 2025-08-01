import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import moment from "moment";
import { createPortal } from "react-dom";
import { Sheet } from "zmp-ui";
import AuthAPI from "../../../api/auth.api";
import { formatString } from "../../../utils/formatString";

export const PickerCard = ({ children, item }) => {
  const [visible, setVisible] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["MoneyCardDetail", item],
    queryFn: async () => {
      const { data } = await AuthAPI.moneyCardHistory(item?.id);
      return data?.data || [];
    },
    enabled: visible,
  });

  return (
    <>
      {children({
        open: () => setVisible(true),
        close: () => setVisible(false),
      })}
      {createPortal(
        <Sheet visible={visible} onClose={() => setVisible(false)} autoHeight>
          <div>
            <div className="p-3 uppercase font-bold text-lg border-b border-b-4 text-app">
              {item.ten}
            </div>
            {item.gia_tri_the !== item.gia_tri_chi_tieu && (
              <div className="p-3 border-b">
                <div className="mb-1">
                  <span>Giá trị thẻ tiền : </span>
                  <span className="pl-1 font-bold text-base">
                    {formatString.formatVND(item.gia_tri_the)}
                  </span>
                </div>
                {(item.gioi_han_sp > 0 || item.gioi_han_dv > 0) && (
                  <div>
                    <span>
                      Sản phẩm :
                      <span className="pl-1 font-bold text-base">
                        {formatString.formatVND(item.gioi_han_sp)}
                      </span>
                    </span>
                    <span className="pl-3">
                      Dịch vụ :
                      <span className="pl-1 font-bold text-base">
                        {formatString.formatVND(item.gioi_han_dv)}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            )}
            <div className="p-3 border-b">
              <div className="mb-1">
                <span>Giá trị chi tiêu : </span>
                <span className="pl-1 font-bold text-base">
                  {formatString.formatVND(item.gia_tri_chi_tieu)}
                </span>
              </div>
              {(item.gia_tri_chi_tieu_dv > 0 ||
                item.gia_tri_chi_tieu_sp > 0) && (
                <div>
                  <span>
                    Sản phẩm :
                    <span className="pl-1 font-bold text-base">
                      {formatString.formatVND(item.gia_tri_chi_tieu_sp)}
                    </span>
                  </span>
                  <span className="pl-3">
                    Dịch vụ :
                    <span className="pl-1 font-bold text-base">
                      {formatString.formatVND(item.gia_tri_chi_tieu_dv)}
                    </span>
                  </span>
                </div>
              )}
            </div>
            <div className="p-3 border-b">
              <div className="mb-1">
                <span>Đã chi tiêu : </span>
                <span className="pl-1 font-bold text-base">
                  {formatString.formatVND(item.su_dung)}
                </span>
              </div>
              {(item.su_dung_sp > 0 || item.su_dung_dv > 0) &&
                (item.gioi_han_dv !== 0 ||
                  item.gioi_han_sp !== 0 ||
                  item.gia_tri_chi_tieu_dv !== 0 ||
                  item.gia_tri_chi_tieu_sp !== 0) && (
                  <div>
                    <span>
                      Sản phẩm :
                      <span className="pl-1 font-bold text-base">
                        {formatString.formatVND(item.su_dung_sp)}
                      </span>
                    </span>
                    <span className="pl-3">
                      Dịch vụ :
                      <span className="pl-1 font-bold text-base">
                        {formatString.formatVND(item.su_dung_dv)}
                      </span>
                    </span>
                  </div>
                )}
            </div>
            <div className="p-3 border-b border-b-4">
              <div className="mb-1">
                <span>Còn lại : </span>
                <span className="pl-1 font-bold text-base">
                  {formatString.formatVND(item.gia_tri_chi_tieu - item.su_dung)}
                </span>
              </div>
              {item.gia_tri_chi_tieu_sp - item.su_dung_sp > 0 ||
                (item.gia_tri_chi_tieu_dv - item.su_dung_dv && (
                  <div>
                    <span>
                      Sản phẩm :
                      <span className="pl-1 font-bold text-base">
                        {formatString.formatVND(
                          item.gia_tri_chi_tieu_sp - item.su_dung_sp,
                        )}
                      </span>
                    </span>
                    <span className="pl-3">
                      Dịch vụ :
                      <span className="pl-1 font-bold text-base">
                        {formatString.formatVND(
                          item.gia_tri_chi_tieu_dv - item.su_dung_dv,
                        )}
                      </span>
                    </span>
                  </div>
                ))}
            </div>
            <div className="p-3">
              <div className="uppercase font-bold">Lịch sử sử dụng</div>
              <div className="relative mt-5">
                {isLoading && (
                  <ul className="pl-7 animate-pulse before:border-l before:border-[#cccbcd] before:border-dashed before:content-[''] before:h-full before:left-2 before:absolute">
                    {Array(2)
                      .fill()
                      .map((_, index) => (
                        <li
                          className={clsx(
                            "mb-6 relative before:content-[''] before:rounded-full before:w-[10px] before:h-[10px] before:absolute before:-left-[24px] before:top-[6px]",
                            index > 0
                              ? "before:bg-success"
                              : "before:bg-danger",
                          )}
                          key={index}
                        >
                          <div className="relative">
                            <div
                              className={clsx(
                                "font-bold text-base",
                                index > 0 ? "text-success" : "text-danger",
                              )}
                            >
                              <div className="h-4 bg-gray-200 rounded-full w-24"></div>
                            </div>
                            <div className="mt-2 text-muted">
                              <div className="h-2.5 bg-gray-200 rounded-full w-28"></div>
                            </div>
                          </div>
                          <div className="note absolute bottom-0 right-0 w-7/12 flex flex-col items-end">
                            <div className="h-2.5 bg-gray-200 rounded-full w-36"></div>
                          </div>
                        </li>
                      ))}
                  </ul>
                )}
                {!isLoading && (
                  <>
                    {!data ||
                      (data.length === 0 && (
                        <div className="text-muted text-base">
                          Thẻ tiền "Chưa" được sử dụng.
                        </div>
                      ))}
                    {data && data.length > 0 && (
                      <ul className="pl-7 before:border-l before:border-[#cccbcd] before:border-dashed before:content-[''] before:h-full before:left-2 before:absolute">
                        {data.map((item, index) => (
                          <li
                            className={clsx(
                              "mb-6 relative before:content-[''] before:rounded-full before:w-[10px] before:h-[10px] before:absolute before:-left-[24px] before:top-[6px]",
                              item.gia_tri > 0
                                ? "before:bg-success"
                                : "before:bg-danger",
                            )}
                            key={index}
                          >
                            <div className="relative">
                              <div
                                className={clsx(
                                  "font-bold text-base",
                                  item.gia_tri > 0
                                    ? "text-success"
                                    : "text-danger",
                                )}
                              >
                                <span className="pr-1">
                                  {item.gia_tri > 0 ? "+" : "-"}
                                </span>
                                {formatString.formatVNDPositive(item.gia_tri)}
                              </div>
                              <div className="mt-2 text-muted">
                                {moment(item.ngay).fromNow()}
                              </div>
                            </div>
                            <div className="note absolute bottom-0 right-0 w-7/12 text-end">
                              {item.san_pham}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </Sheet>,
        document.body,
      )}
    </>
  );
};
