import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Button, Icon, Input, Sheet } from "zmp-ui";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { useLayout } from "../../../layout/LayoutProvider";
import CartAPI from "../../../api/cart.api";
import GiftSVG from "../../../static/icons/gift.png";
import { useCart } from "../../../layout/CartProvider";
import { formatString } from "../../../utils/formatString";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { checkDateDiff } from "../../../utils/date";

const schemaVoucher = yup
  .object({
    vcode: yup.string().required(" "),
  })
  .required();

const SearchVoucher = ({ OrderID, onChange }) => {
  const { AccessToken } = useLayout();
  const { handleSubmit, control, setError, reset } = useForm({
    defaultValues: {
      vcode: "",
    },
    resolver: yupResolver(schemaVoucher),
  });

  const addCartMutation = useMutation({
    mutationFn: (body) => CartAPI.preCheckVoucher(body),
  });

  const onSubmit = (event) => {
    if (event) {
      if (typeof event.preventDefault === "function") {
        event.preventDefault();
      }
      if (typeof event.stopPropagation === "function") {
        event.stopPropagation();
      }
    }

    return handleSubmit(({ vcode }) => {
      addCartMutation.mutate(
        {
          token: AccessToken,
          orderid: OrderID,
          vcode: vcode ? vcode.toUpperCase() : "",
        },
        {
          onSuccess: ({ data }) => {
            if (!data?.error) {
              reset();
              onChange(vcode.toUpperCase());
            } else {
              setError("vcode", {
                type: "Server",
                message: data.error,
              });
            }
          },
        },
      );
    })(event);
  };

  return (
    <div className="px-3 pb-3">
      <div className="flex">
        <Controller
          name="vcode"
          control={control}
          render={({ field: { ref, ...field }, fieldState }) => (
            <div className="flex-1">
              <Input
                className="!rounded-sm !m-0"
                type="text"
                placeholder="Nhập mã voucher của bạn"
                value={field.value}
                onChange={field.onChange}
              />
              {fieldState?.invalid && (
                <div className="text-danger mt-1 text-sm">
                  {fieldState?.error?.message}
                </div>
              )}
            </div>
          )}
        />
        <Button
          className="!rounded-sm !ml-2 !bg-app disabled:!text-white disabled:opacity-60"
          onClick={onSubmit}
        >
          Áp dụng
        </Button>
      </div>
    </div>
  );
};

export const PickerVoucher = ({ children }) => {
  const { AccessToken, Auth } = useLayout();
  const { Orders } = useCart();
  const [visible, setVisible] = useState(false);
  const { handleSubmit, control } = useForm({
    defaultValues: {
      order: {
        ID: 0,
        SenderID: Auth?.ID,
        VCode: Orders?.order?.VCode,
      },
      addProps: "ProdTitle",
      deleteds: [],
      edits: [],
    },
  });

  const queryClient = useQueryClient();

  const voucherCartMutation = useMutation({
    mutationFn: (body) => CartAPI.list(body),
  });

  const onSubmit = (values) => {
    voucherCartMutation.mutate(
      {
        token: AccessToken,
        body: values,
      },
      {
        onSuccess: () => {
          queryClient
            .invalidateQueries({ queryKey: ["ListsCart"] })
            .then(() => {
              setVisible(false);
            });
        },
      },
    );
  };

  return (
    <>
      {children({
        open: () => setVisible(true),
        close: () => setVisible(false),
      })}
      {createPortal(
        <Sheet height="85%" visible={visible} onClose={() => setVisible(false)}>
          <div className="h-[calc(100%-24px)] flex flex-col">
            <div>
              <div className="flex h-12 items-center">
                <div
                  className="px-3 h-full flex items-center justify-center"
                  onClick={() => setVisible(false)}
                >
                  <Icon className="text-app" icon="zi-arrow-left" />
                </div>
                <div className="font-semibold">Chọn Voucher</div>
              </div>
              <Controller
                name="order.VCode"
                control={control}
                render={({ field: { ref, ...field }, fieldState }) => (
                  <SearchVoucher
                    OrderID={Orders?.order?.ID}
                    onChange={(vcode) => {
                      field.onChange(vcode);
                      handleSubmit(onSubmit)();
                    }}
                  />
                )}
              />
            </div>
            <div className="border-t border-4"></div>
            <div className="grow overflow-auto no-scrollbar p-3">
              <Controller
                name="order.VCode"
                control={control}
                render={({ field: { ref, ...field }, fieldState }) => (
                  <>
                    {!Orders?.vouchers ||
                      (Orders?.vouchers.length === 0 && (
                        <div className="flex flex-col items-center px-5 py-12">
                          <svg
                            className="w-16 mb-5"
                            viewBox="0 0 56 60"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g fillRule="evenodd">
                              <path
                                d="M1 14c-.55228475 0-1-.4477153-1-1s.44771525-1 1-1h42c.5522847 0 1 .4477153 1 1s-.4477153 1-1 1H1zM15 22c-.5522847 0-1-.4477153-1-1s.4477153-1 1-1h22c.5522847 0 1 .4477153 1 1s-.4477153 1-1 1H15zM17 6c-.5522847 0-1-.44771525-1-1s.4477153-1 1-1h10c.5522847 0 1 .44771525 1 1s-.4477153 1-1 1H17zM13 10c-.5522847 0-1-.44771525-1-1s.4477153-1 1-1h18c.5522847 0 1 .44771525 1 1s-.4477153 1-1 1H13zM36 8h7c.5522847 0 1 .44771525 1 1s-.4477153 1-1 1h-8c-.5522847 0-1-.44771525-1-1V1c0-.55228475.4477153-1 1-1s1 .44771525 1 1v7zM7 24c-.55228475 0-1-.4477153-1-1v-4c0-.5522847.44771525-1 1-1h4c.5522847 0 1 .4477153 1 1v4c0 .5522847-.4477153 1-1 1H7zm1-2h2v-2H8v2zM15 30c-.5522847 0-1-.4477153-1-1s.4477153-1 1-1h6.052c.5522847 0 1 .4477153 1 1s-.4477153 1-1 1H15zM7 32c-.55228475 0-1-.4477153-1-1v-4c0-.5522847.44771525-1 1-1h4c.5522847 0 1 .4477153 1 1v4c0 .5522847-.4477153 1-1 1H7zm1-2h2v-2H8v2zM15 38c-.5522847 0-1-.4477153-1-1s.4477153-1 1-1h4c.5522847 0 1 .4477153 1 1s-.4477153 1-1 1h-4zM7 40c-.55228475 0-1-.4477153-1-1v-4c0-.5522847.44771525-1 1-1h4c.5522847 0 1 .4477153 1 1v4c0 .5522847-.4477153 1-1 1H7zm1-2h2v-2H8v2zM15 46c-.5522847 0-1-.4477153-1-1s.4477153-1 1-1h7.624c.5522847 0 1 .4477153 1 1s-.4477153 1-1 1H15zM7 48c-.55228475 0-1-.4477153-1-1v-4c0-.5522847.44771525-1 1-1h4c.5522847 0 1 .4477153 1 1v4c0 .5522847-.4477153 1-1 1H7zm1-2h2v-2H8v2zM50.4161068 57.3851932c.8194757.8194757 2.1493107.8194757 2.9690786-.000292.8200861-.819409.8200861-2.1487934-.0003531-2.9685554l-5.8009391-5.801939c-.8194757-.8194757-2.1493107-.8194757-2.9687864 0-.8204757.8204757-.8204757 2.1493107 0 2.9697864l5.801 5.801zm-1.4142136 1.4142136l-5.801-5.801c-1.6015243-1.6015243-1.6015243-4.1966893 0-5.7982136 1.6005243-1.6005243 4.1966893-1.6005243 5.7972745.000061l5.8006469 5.801647c1.6019139 1.600591 1.6019139 4.1972066.0002922 5.7975056-1.6005243 1.6005243-4.1966893 1.6005243-5.7972136 0z"
                                fillRule="nonzero"
                              />
                              <path
                                d="M44.2767682 49.0854427c-.0796855.1431637-.1409432.2915959-.1839798.4449137-.2066214.7360886-1.129285.9774606-1.6698952.4368504l-3.071-3.071c-.4227588-.4227589-.3825419-1.1195578.0860482-1.4908709.7296849-.5782061 1.3890884-1.2376096 1.9672945-1.9672945.3713131-.4685901 1.068112-.508807 1.4908709-.0860482l3.071 3.071c.5409662.5409663.298863 1.4642816-.4379449 1.6702017-.1524408.0426036-.299632.1034181-.4698447.1976596-.0184888.0094983-.0184888.0094983-.0310432.015818-.1740347.1024444-.3053389.2007059-.4131672.3085343-.1052752.1052752-.2029509.2352593-.2975553.3920191-.0189673.0378655-.0189673.0378655-.0407833.0782168zm.7492923-.7780213c-.0150164.0082337-.0150277.0082399-.0041919.0024769a3.21566785 3.21566785 0 0 1 .0041919-.0024769zm-3.4977824-2.0632569l1.3399831 1.3399832c.1030122-.1362829.2127271-.2632496.332632-.3831545.1205479-.1205479.2483304-.2309889.3829023-.3328841l-1.339731-1.3397311c-.2299487.2471101-.4686764.4858378-.7157864.7157865zm.9945169 1.8804997l.0060477-.0112071a4.15519983 4.15519983 0 0 0-.004591.0082705l-.0014567.0029366z"
                                fillRule="nonzero"
                              />
                              <path
                                d="M2 54.0002h39c.5522847 0 1 .4477153 1 1s-.4477153 1-1 1H1c-.55228475 0-1-.4477153-1-1v-54c0-.55228475.44771525-1 1-1h34c.2652165 0 .5195704.10535684.7071068.29289322l8 8C43.8946432 8.4806296 44 8.73498351 44 9.0002v14.094c0 .5522847-.4477153 1-1 1s-1-.4477153-1-1V9.41441356L34.5857864 2.0002H2v52z"
                                fillRule="nonzero"
                              />
                              <path
                                d="M44 36.0005c0-6.6277153-5.3722847-12-12-12s-12 5.3722847-12 12 5.3722847 12 12 12 12-5.3722847 12-12zm2 0c0 7.7322847-6.2677153 14-14 14s-14-6.2677153-14-14 6.2677153-14 14-14 14 6.2677153 14 14zM50.4161068 57.3851932c.8194757.8194757 2.1493107.8194757 2.9690786-.000292.8200861-.819409.8200861-2.1487934-.0003531-2.9685554l-5.8009391-5.801939c-.8194757-.8194757-2.1493107-.8194757-2.9687864 0-.8204757.8204757-.8204757 2.1493107 0 2.9697864l5.801 5.801zm-1.4142136 1.4142136l-5.801-5.801c-1.6015243-1.6015243-1.6015243-4.1966893 0-5.7982136 1.6005243-1.6005243 4.1966893-1.6005243 5.7972745.000061l5.8006469 5.801647c1.6019139 1.600591 1.6019139 4.1972066.0002922 5.7975056-1.6005243 1.6005243-4.1966893 1.6005243-5.7972136 0z"
                                fillRule="nonzero"
                              />
                              <path
                                d="M40 36.0005c0-4.4184153-3.5815847-8-8-8-4.4184153 0-8 3.5815847-8 8 0 4.4184153 3.5815847 8 8 8 4.4184153 0 8-3.5815847 8-8zm2 0c0 5.5229847-4.4770153 10-10 10s-10-4.4770153-10-10 4.4770153-10 10-10 10 4.4770153 10 10z"
                                fillRule="nonzero"
                              />
                              <path d="M33.41421356 36l1.41421356 1.41421356c.39052426.39052426.39052426 1.0236893 0 1.41421356-.39052425.39052426-1.0236893.39052426-1.41421356 0L32 37.41421356l-1.41421356 1.41421356c-.39052426.39052426-1.0236893.39052426-1.41421356 0-.39052426-.39052425-.39052426-1.0236893 0-1.41421356L30.58578644 36l-1.41421356-1.41421356c-.39052426-.39052426-.39052426-1.0236893 0-1.41421356.39052425-.39052426 1.0236893-.39052426 1.41421356 0L32 34.58578644l1.41421356-1.41421356c.39052426-.39052426 1.0236893-.39052426 1.41421356 0 .39052426.39052425.39052426 1.0236893 0 1.41421356L33.41421356 36z" />
                            </g>
                          </svg>
                          <div className="font-bold text-lg mb-px">
                            "Hổng" có mã giảm giá nào ?
                          </div>
                          <div className="text-center">
                            Hãy bắt đầu săn mã giảm giảm giá từ các chương trình
                            ...
                          </div>
                        </div>
                      ))}
                    {Orders?.vouchers &&
                      Orders.vouchers.map((item, index) => (
                        <div
                          className="border shadow-3xl border-l-0 rounded-sm overflow-hidden flex mb-3 last:mb-0"
                          key={index}
                          onClick={() =>
                            field.onChange(
                              field.value === item.Code ? "" : item.Code,
                            )
                          }
                        >
                          <div className="w-[6.625rem] h-[6.625rem] relative">
                            <div
                              style={{
                                background:
                                  "linear-gradient(180deg,#70000A 0.25rem,transparent 0,transparent calc(100% - 0.25rem),#70000A calc(100% - 0.25rem)) 0 0 /0.0625rem 100% no-repeat,linear-gradient(180deg,#70000A 0.25rem,transparent 0,transparent calc(100% - var(--vc-card-sawtooth-margin, .25rem)),#70000A calc(100% - 0.25rem)) 0 0/100% 100% no-repeat",
                                borderBottom:
                                  "0.0625rem solid var(--vc-card-left-border-color,#e8e8e8)",
                                borderBottomLeftRadius: "0.125rem",
                                borderTop: "0.0625rem solid #70000A",
                                borderTopLeftRadius: "0.125rem",
                                height: "100%",
                                left: 0,
                                overflow: "hidden",
                                position: "absolute",
                                top: 0,
                                width: "100%",
                              }}
                            >
                              <div
                                className="flex items-center justify-center"
                                style={{
                                  background:
                                    "linear-gradient(180deg,transparent calc(0.1875rem*2),#70000A 0) 0 0.0625rem /0.0625rem calc(0.1875rem*2 + 0.0625rem) repeat-y,radial-gradient(circle at 0 0.1875rem,transparent 0,transparent calc(0.1875rem - 0.0625rem),#70000A 0,#70000A 0.1875rem,#70000A 0) 0 0.0625rem /100% calc(0.1875rem*2 + 0.0625rem) repeat-y",
                                  bottom: "calc(0.25rem - 0.0625rem)",
                                  position: "absolute",
                                  top: "calc(0.25rem - 0.0625rem)",
                                  width: "100%",
                                }}
                              >
                                <img
                                  className="aspect-square w-14"
                                  src={GiftSVG}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="px-4 py-3 flex-1">
                            <div className="text-lg font-bold mb-2 text-app">
                              Mã {item.Code}
                            </div>
                            <div className="font-semibold">
                              Ưu đãi
                              <span className="pl-1">
                                {item.Discount > 100
                                  ? formatString.formatVND(item.Discount)
                                  : item.Discount + "%"}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              {item.EndDate === null
                                ? "Hạn sử dụng vĩnh viễn"
                                : `Hạn sử dụng còn ${checkDateDiff(
                                    item.EndDate,
                                  )} ngày`}
                            </div>
                          </div>
                          <div className="pr-4 flex items-center">
                            <div
                              className={clsx(
                                "w-5 h-5 rounded-full border shadow-3xl relative transition",
                                field.value === item.Code
                                  ? "border-app bg-app"
                                  : "border-gray-500",
                              )}
                            >
                              <Icon
                                className={clsx(
                                  "text-white !absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 !text-[16px]",
                                  field.value === item.Code
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                                icon="zi-check"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                  </>
                )}
              />
            </div>
            <div className="p-3 border-t">
              <Button
                fullWidth
                className="!rounded-sm !bg-app disabled:!text-white disabled:opacity-60"
                loading={voucherCartMutation.isLoading}
                onClick={() => handleSubmit(onSubmit)()}
              >
                Đồng ý
              </Button>
            </div>
          </div>
        </Sheet>,
        document.body,
      )}
    </>
  );
};
