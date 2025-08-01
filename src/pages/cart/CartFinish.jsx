import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Icon, Page, Text, useNavigate } from "zmp-ui";
import ConfigsAPI from "../../api/configs.api";
import { formatString } from "../../utils/formatString";
import { PickerBanks } from "../../pages/user/components/PickerOrderPayted";
import { useLocation } from "react-router";
import clsx from "clsx";

const CartFinish = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [Banks, setBanks] = useState(null);

  const { data } = useQuery({
    queryKey: ["InfoQrCode"],
    queryFn: async () => {
      const { data } = await ConfigsAPI.getNames(
        "App.thanhtoan,MA_QRCODE_NGAN_HANG",
      );
      return data?.data || [];
    },
  });

  useEffect(() => {
    if (data && data.length > 1) {
      setBanks(JSON.parse(data[1].Value));
    }
  }, [data]);

  return (
    <Page
      className="page !h-full !overflow-hidden flex flex-col bg-white !pb-safe"
      hideScrollbar
    >
      <div className="navbar fixed top-0 left-0 min-w-[100vw] max-w-[100vw] z-[999] bg-white shadow-3xl">
        <div className="w-2/3 relative flex items-center h-full pl-10">
          <div
            className="absolute left-0 w-10 h-full flex justify-center items-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            <Icon icon="zi-chevron-left-header" className="text-app" />
          </div>
          <Text.Title className="text-app">Đặt hàng thành công</Text.Title>
        </div>
      </div>
      <div className="h-full border-top overflow-auto no-scrollbar flex flex-col justify-center">
        <div className="px-5 text-center">
          <div className="mb-6">
            <div className="flex items-center justify-center mb-4">
              <svg
                className="checkmark"
                width={85}
                height={85}
                viewBox="0 0 108 108"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx={54}
                  cy={54}
                  r={50}
                  className="stroke-light"
                  strokeWidth={8}
                />
                <path
                  d="M24 51.6739C25.8629 51.6739 35.5417 62.1638 40.8583 68.0867C42.7759 70.223 46.0818 70.3683 48.1455 68.3727C57.6301 59.2012 81.8373 36 84 36"
                  className="stroke-success"
                  strokeWidth={10}
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="text-center px-5">
              <div className="font-bold text-lg mb-2">
                "Đặt hàng" thành công rồi nhé.
              </div>
            </div>
          </div>
          <div
            className="mb-3"
            dangerouslySetInnerHTML={{
              __html:
                data &&
                data.length > 1 &&
                data[0].Value.replaceAll(
                  "ID_ĐH",
                  `<b class="text-app">#${state?.formState?.ID}</b>`,
                )
                  .replaceAll(
                    "MONEY",
                    `<b class="text-app">${formatString.formatVND(
                      Math.abs(state?.formState?.ToPay),
                    )}</b>`,
                  )
                  .replaceAll(
                    "ID_DH",
                    `<b class="text-app">${state?.formState?.ID}</b>`,
                  ),
            }}
          />
        </div>
        <div className="text-center mt-5">
          Chọn ngân hàng để lấy mã QR thanh toán
        </div>
        <div
          className={clsx(
            "grid gap-3 mt-2 px-5",
            Banks &&
              Banks.ngan_hang &&
              Banks.ngan_hang.filter((x) => x.ma_nh !== "DealToday").length > 1
              ? "grid-cols-2"
              : "grid-cols-1",
          )}
        >
          {Banks &&
            Banks.ngan_hang &&
            Banks.ngan_hang
              .filter((x) => x.ma_nh !== "DealToday")
              .map((bank, index) => (
                <PickerBanks
                  key={index}
                  Bank={bank}
                  item={{
                    ID: state?.formState?.ID,
                  }}
                  TotalDebt={state?.formState?.ToPay}
                  Banks={Banks}
                >
                  {({ open }) => (
                    <div
                      className="text-center bg-[#E1F0FF] text-primary font-semibold py-3.5 rounded cursor-pointer"
                      onClick={open}
                    >
                      {formatString.getNameBank(bank)}
                    </div>
                  )}
                </PickerBanks>
              ))}
        </div>
      </div>
    </Page>
  );
};

export default CartFinish;
