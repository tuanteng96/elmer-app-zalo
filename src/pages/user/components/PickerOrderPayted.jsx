import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createPortal } from "react-dom";
import { Modal, Sheet } from "zmp-ui";
import ConfigsAPI from "../../../api/configs.api";
import { formatString } from "../../../utils/formatString";
import { ImageLazy } from "../../../components/ImagesLazy";
import { QRCodeSVG } from "qrcode.react";
import LogoEZS from "../../../static/images/logo-ezs.jpg";
import clsx from "clsx";

const QrCodeRender = ({ item, Banks, Bank, TotalDebt }) => {
  if (Bank.ma_nh === "MoMoPay" || Bank.ma_nh === "ZaloPay") {
    return (
      <div className="relative overflow-hidden p-10 pb-6">
        <div className="border-[2px] border-[#334e86] p-1.5">
          <QRCodeSVG
            className="w-full h-full"
            value={
              Banks.ngan_hang === "MoMoPay"
                ? `2|99|${Bank.stk}|||0|0|${TotalDebt}|${Banks.ma_nhan_dien}${item.ID}|transfer_myqr`
                : `https://social.zalopay.vn/mt-gateway/v1/private-qr?amount=${TotalDebt}&note=${Banks.ma_nhan_dien}${item.ID}&receiver_id=${Bank.stk}`
            }
            size={220}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"L"}
            includeMargin={false}
            imageSettings={{
              src: LogoEZS,
              x: undefined,
              y: undefined,
              height: 30,
              width: 30,
              excavate: true,
            }}
          />
        </div>
        <div className="text-center mt-5">
          <div className="uppercase text-sm font-bold mb-1">{Bank.ten}</div>
          <div className="text-xs mb-px font-medium opacity-75">{Bank.stk}</div>
          <div className="text-xs font-medium opacity-75">
            {formatString.formatVND(TotalDebt)} - {Banks.ma_nhan_dien}#{item.ID}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="relative overflow-hidden">
      <div className="absolute w-full h-[12%] top-0 left-0 bg-white z-10" />
      <ImageLazy
        wrapperClassName="aspect-[27/32] !block"
        className="aspect-[27/32] object-cover w-full"
        effect="blur"
        src={`https://img.vietqr.io/image/${Bank.ma_nh}-${Bank.stk}-compact2.jpg?amount=${TotalDebt}&addInfo=${Banks.ma_nhan_dien}${item.ID}&accountName=${Bank.ten}`}
        alt="Mã QR Thanh toán"
      />
    </div>
  );
};

export const PickerBanks = ({ children, Banks, Bank, item, TotalDebt }) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      {children({
        open: () => setVisible(true),
        close: () => setVisible(false),
      })}
      {createPortal(
        <Modal
          modalClassName="child:!p-0"
          visible={visible}
          onClose={() => {
            setVisible(false);
          }}
          verticalActions
        >
          <QrCodeRender
            Banks={Banks}
            Bank={Bank}
            item={item}
            TotalDebt={TotalDebt}
          />
        </Modal>,
        document.body,
      )}
    </>
  );
};

export const PickerOrderPayted = ({ children, item, TotalDebt }) => {
  const [visible, setVisible] = useState(false);
  const [Banks, setBanks] = useState(null);

  const { data } = useQuery({
    queryKey: ["InfoQrCode"],
    queryFn: async () => {
      const { data } = await ConfigsAPI.getNames(
        "App.thanhtoan,MA_QRCODE_NGAN_HANG",
      );
      return data?.data || [];
    },
    enabled: visible,
  });

  useEffect(() => {
    if (data && data.length > 1) {
      setBanks(JSON.parse(data[1].Value));
    }
  }, [data]);

  return (
    <>
      {children({
        open: () => setVisible(true),
        close: () => setVisible(false),
      })}
      {createPortal(
        <Sheet visible={visible} onClose={() => setVisible(false)} autoHeight>
          <div className="py-3 px-5">
            <div
              dangerouslySetInnerHTML={{
                __html:
                  data &&
                  data.length > 1 &&
                  data[0].Value.replaceAll(
                    "ID_ĐH",
                    `<b class="text-app">#${item.ID}</b>`,
                  )
                    .replaceAll(
                      "MONEY",
                      `<b class="text-app">${formatString.formatVND(
                        Math.abs(item.ToPay),
                      )}</b>`,
                    )
                    .replaceAll("ID_DH", `<b class="text-app">${item.ID}</b>`),
              }}
            />
            <div className="text-center mt-5">
              Chọn ngân hàng để lấy mã QR thanh toán
            </div>
            <div
              className={clsx(
                "grid gap-3 mt-5",
                Banks &&
                  Banks.ngan_hang &&
                  Banks.ngan_hang.filter((x) => x.ma_nh !== "DealToday")
                    .length > 1
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
                      item={item}
                      Banks={Banks}
                      TotalDebt={TotalDebt}
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
        </Sheet>,
        document.body,
      )}
    </>
  );
};
