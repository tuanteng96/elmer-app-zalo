import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Icon, Input, Sheet } from "zmp-ui";
import MemberAPI from "../../api/member.api";
import { useLayout } from "../../layout/LayoutProvider";

const Stars = ({ value }) => {
  return (
    <div className="flex items-center mt-1.5">
      {Array(5)
        .fill()
        .map((_, index) => (
          <svg
            className={clsx(
              "w-4 h-4 mr-1",
              index + 1 <= value ? "text-yellow-300" : "text-gray-300",
            )}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 22 20"
            key={index}
          >
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
          </svg>
        ))}
      <p className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
        <span className="pr-2">-</span> {value} đánh giá
      </p>
    </div>
  );
};

const UserItem = ({ user, onChange, checked }) => {
  const { GlobalConfig } = useLayout();
  return (
    <div
      className="py-4 pl-4 pr-8 border-b cursor-pointer relative"
      onClick={() => onChange(checked ? "" : user.id)}
    >
      <div
        className={clsx(
          checked && "text-app",
          "text-[16px] transition truncate pr-10",
        )}
      >
        {user.text}
      </div>
      {GlobalConfig.Admin.dat_lich_nhan_vien_sao ? (
        <Stars
          value={
            user.source.AverRate > 5
              ? 5
              : Math.round(user.source.AverRate * 2) / 2
          }
        />
      ) : (
        <></>
      )}

      <div
        className={clsx(
          "absolute right-4 top-2/4 -translate-y-2/4 text-app transition",
          checked ? "opacity-100" : "opacity-0",
        )}
      >
        <Icon icon="zi-check" />
      </div>
    </div>
  );
};

const EzsSelectUserDV = ({ label, StockID, onChange, value, ...props }) => {
  const [visible, setVisible] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["MembersDV", { StockID }],
    queryFn: async () => {
      const { data } = await MemberAPI.listDV({ StockID });
      return data?.data || [];
    },
  });

  const getValue = () => {
    let index = data && data.findIndex((x) => x.id === value);
    if (index > -1) {
      return data[index].text;
    }
    return "";
  };

  return (
    <>
      {label && <div className="text-[14px] leading-6">{label}</div>}
      <div className="relative" onClick={() => setVisible(true)}>
        <Input {...props} value={getValue(value)} readOnly />
        <div className="absolute top-2/4 -translate-y-2/4 right-2.5">
          <Icon icon="zi-chevron-down" />
        </div>
      </div>
      {createPortal(
        <Sheet
          className="child:!z-[1001] sheet-select"
          visible={visible}
          onClose={() => setVisible(false)}
          autoHeight
        >
          <div className="flex pt-3 justify-between min-h-[60px] px-4">
            <div className="text-xl font-medium">{label}</div>
            <div onClick={() => setVisible(false)}>
              <Icon className="!w-8 !h-8 !text-[32px]" icon="zi-close" />
            </div>
          </div>

          <div className="grow overflow-auto no-scrollbar">
            {data &&
              data.map((user, idx) => (
                <UserItem
                  user={user}
                  key={idx}
                  onChange={onChange}
                  checked={user.id === value}
                />
              ))}
          </div>
        </Sheet>,
        document.body,
      )}
    </>
  );
};

export { EzsSelectUserDV };
