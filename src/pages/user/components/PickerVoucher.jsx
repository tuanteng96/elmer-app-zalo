import React, { useState } from "react";
import moment from "moment";
import { createPortal } from "react-dom";
import { Sheet } from "zmp-ui";
import { formatString } from "../../../utils/formatString";
import { BtnAffiliate } from "./BtnAffiliate";

export const PickerVoucher = ({ children, item }) => {
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
            <div className="text-lg font-bold p-3 border-b-4">
              Mã Code <span className="text-app pl-1">{item.ma}</span>
            </div>
            <div className="relative">
              <div className="border-b p-3 last:border-0">
                <div className="text-muted mb-1">
                  Ngày bắt đầu - Hạn sử dụng
                </div>
                <div className="font-medium">
                  {item.ngay === null
                    ? "Không giới hạn"
                    : `${moment(item?.ngay?.From).format(
                        "HH:mm DD/MM/YYYY",
                      )} - ${moment(item?.ngay?.To).format(
                        "HH:mm DD/MM/YYYY",
                      )}`}
                </div>
              </div>
              <div className="border-b p-3 last:border-0">
                <div className="text-muted mb-1">Giá trị giảm giá</div>
                <div className="font-medium text-primary">
                  {item?.gia_tri?.Phan_tram > 0
                    ? `${item?.gia_tri.Phan_tram}%`
                    : `${formatString.formatVND(item?.gia_tri?.Tien)}`}
                </div>
              </div>
              <div className="border-b p-3 last:border-0">
                <div className="text-muted mb-1">
                  Giới hạn SL trên mỗi SP-DV / Giới hạn SL SP-DV trên cả đơn
                  hàng
                </div>
                <div className="font-medium">
                  {item?.so_luong_mua_tung_san_pham || "Không giới hạn"}
                  <span className="px-1">/</span>
                  {item?.so_luong_mua_tung_don || "Không giới hạn"}
                </div>
              </div>
              <div className="border-b p-3 last:border-0">
                <div className="text-muted mb-1">
                  Số lần sử dụng / Tổng số lần
                </div>
                <div className="font-medium">
                  {item?.gioi_han_so_lan_su_dung === -1 ? (
                    `${item?.so_lan_su_dung} / Không giới hạn`
                  ) : (
                    <>
                      {Number(item?.gioi_han_so_lan_su_dung) <=
                      Number(item?.so_lan_su_dung)
                        ? "Hết lượt sử dụng"
                        : `${item?.so_lan_su_dung} / ${item?.gioi_han_so_lan_su_dung} lần`}
                    </>
                  )}
                </div>
              </div>
              {item?.so_luong_mua_tung_don > 0 && (
                <div className="border-b p-3 last:border-0">
                  <div className="text-muted mb-1">
                    Giới hạn số lượng SP / DV trên cả đơn hàng
                  </div>
                  <div className="font-medium">
                    {item.so_luong_mua_tung_don}
                  </div>
                </div>
              )}
              {item?.so_luong_mua_tung_san_pham > 0 && (
                <div className="border-b p-3 last:border-0">
                  <div className="text-muted mb-1">
                    Giới hạn số lượng trên từng SP / DV
                  </div>
                  <div className="font-medium">
                    {item.so_luong_mua_tung_san_pham}
                  </div>
                </div>
              )}
              {item?.aff && (
                <div className="border-b p-3 last:border-0">
                  <div className="text-muted mb-1">
                    Mã dùng chia sẻ cho bạn bè
                  </div>
                  <div className="font-medium">
                    <BtnAffiliate code={item.ma_chia_se} />
                  </div>
                </div>
              )}
              {
                <div className="border-b p-3 last:border-0">
                  <div className="text-muted mb-1">Điều kiện áp dụng</div>
                  <div className="font-medium">
                    <div>
                      {item?.dieu_Kien?.ap_dung === "NG"
                        ? "Không áp dụng kèm chương trình ưu đãi."
                        : "Áp dụng kèm chương trình ưu đãi."}
                    </div>
                    {item?.dieu_Kien?.danh_muc &&
                      item?.dieu_Kien?.danh_muc.length > 0 && (
                        <>
                          Nhóm :
                          <span className="pl-1">
                            {item.dieu_Kien.danh_muc.length > 0
                              ? item.dieu_Kien.danh_muc
                                  .map((item) => item.Title)
                                  .join(", ")
                              : "Tất cả"}
                          </span>
                        </>
                      )}
                    {item?.dieu_Kien?.san_pham &&
                      item?.dieu_Kien.san_pham.length > 0 && (
                        <div className="pl-1">
                          Sản phẩm lẻ :
                          <span>
                            {item.dieu_Kien.san_pham &&
                            item.dieu_Kien.san_pham.length > 0
                              ? item.dieu_Kien.san_pham
                                  .map((item) => item.Title)
                                  .join(", ")
                              : "Tất cả"}
                          </span>
                        </div>
                      )}
                    {item?.nhom && (
                      <div className="pl-1">
                        Nhóm khách hàng :<span>{item.nhom.Title}</span>
                      </div>
                    )}
                  </div>
                </div>
              }
              {item?.aff && item?.Voucher?.VoucherMeta?.Perc > 0 && (
                <div className="border-b p-3 last:border-0">
                  <div className="text-muted mb-1">Hoa hồng giới thiệu</div>
                  <div className="font-medium text-primary">
                    {item.Voucher.VoucherMeta?.Perc > 100
                      ? `${formatString.formatVND(
                          item.Voucher.VoucherMeta?.Perc,
                        )}`
                      : `${item.Voucher.VoucherMeta?.Perc}%`}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Sheet>,
        document.body,
      )}
    </>
  );
};
