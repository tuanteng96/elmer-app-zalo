import React from "react";
import { formatString } from "../../../utils/formatString";
import moment from "moment";
import BgCard from "../../../static/icons/bg-card.jpg";
import { Icon } from "zmp-ui";
import { PickerCard } from "./PickerCard";
import clsx from "clsx";

export const ItemCard = ({ item }) => {
  return (
    <PickerCard item={item}>
      {({ open }) => (
        <div
          className={clsx(
            "text-white mb-3 last:mb-0 rounded-md px-5 py-6 !bg-cover !bg-no-repeat cursor-pointer",
            item.trang_thai === "Khóa" && "opacity-80",
          )}
          style={{ backgroundImage: `url(${BgCard})` }}
          onClick={open}
        >
          <div className="mb-5 flex justify-between">
            <div>
              <div className="font-semibold">{item.ten}</div>
              <div className="text-lg font-bold flex items-baseline">
                {formatString.formatVND(item.gia_tri_the)}{" "}
                {item.trang_thai === "Khóa" && (
                  <Icon className="ml-2" icon="zi-lock-solid" />
                )}
              </div>
            </div>
            <div>
              <Icon icon="zi-unfold-more" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <div>
              <div className="opacity-80 mb-1 text-sm">Giới hạn</div>
              <div className="font-bold text-sm">
                {formatString.formatVND(item.gia_tri_chi_tieu)}
              </div>
            </div>
            <div>
              <div className="opacity-80 mb-1 text-sm">Còn lại</div>
              <div className="font-bold text-sm">
                {formatString.formatVND(item.gia_tri_chi_tieu - item.su_dung)}
              </div>
            </div>
            <div>
              <div className="opacity-80 mb-1 text-sm">Hạn dùng</div>
              <div className="font-bold text-sm">
                {!item.han_dung ? (
                  "Không giới hạn"
                ) : (
                  <>
                    {moment().diff(item.han_dung, "minutes") < 0
                      ? moment(item.han_dung).format("DD/MM/YYYY")
                      : "Hết hạn"}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </PickerCard>
  );
};
