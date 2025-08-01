import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import PullToRefresh from "react-simple-pull-to-refresh";
import { Payment } from "zmp-sdk";
import {
  Button,
  Icon,
  Input,
  Page,
  Text,
  useNavigate,
  useSnackbar,
} from "zmp-ui";
import CartAPI from "../../api/cart.api";
import { useCart } from "../../layout/CartProvider";
import { useLayout } from "../../layout/LayoutProvider";
import { useConfigs } from "../../layout/MasterLayout";
import { formatString } from "../../utils/formatString";
import { ItemCart } from "./compoents/ItemCart";
import { PickerSender } from "./compoents/PickerSender";
import { PickerVoucher } from "./compoents/PickerVoucher";
import { ProcessENV } from "../../utils/process";
import CryptoJS from "crypto-js";

const CartPage = () => {
  const {
    Auth,
    CurrentStocks,
    onOpenActionStocks,
    AccessToken,
    GlobalConfig,
    Stocks,
  } = useLayout();
  const { Orders, isLoading } = useCart();
  const { openSheetProtected } = useConfigs();
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();

  const queryClient = useQueryClient();

  const { handleSubmit, control, setValue } = useForm({
    defaultValues: {
      SenderOther: "",
      SenderAddress: "",
    },
  });

  useEffect(() => {
    setValue("SenderAddress", Auth?.HomeAddress || "");
  }, [Auth]);

  const submitCartMutation = useMutation({
    mutationFn: (body) => CartAPI.list(body),
  });

  const onSubmit = ({ SenderOther, SenderAddress }) => {
    if (!CurrentStocks || !Stocks.some((x) => x.ID === CurrentStocks?.ID)) {
      onOpenActionStocks();
    } else {
      const dataPost = {
        order: {
          ID: Orders?.order?.ID,
          SenderID: Auth?.ID,
          Status: "user_sent",
          SenderOther: SenderOther,
          SenderAddress: SenderAddress,
        },
        forceStockID: CurrentStocks?.ID,
        cmd: "GUI_DON_HANG",
      };
      let params = {
        desc: "Thanh toán đơn hàng #" + Orders?.order?.ID,
        item: Orders?.items?.map((x) => ({ id: x.ID, amount: x.Price })),
        amount: Orders?.order?.ToPay,
        extradata: {
          storeName: CurrentStocks?.Title,
          storeId: CurrentStocks?.ID,
          orderGroupId: Orders?.order?.ID,
          myTransactionId: Orders?.order?.ID,
          notes: SenderOther,
        },
        method: {
          id: "COD",
          isCustom: false,
        },
      };
      const dataMac = Object.keys(params)
        .sort()
        .map(
          (key) =>
            `${key}=${
              typeof params[key] === "object"
                ? JSON.stringify(params[key])
                : params[key]
            }`,
        )
        .join("&");

      let mac = CryptoJS.HmacSHA256(dataMac, ProcessENV.PrivateKey).toString();
      if (!GlobalConfig?.ZALO?.VisibleCheckOutSDK) {
        Payment.createOrder({
          ...params,
          extradata: JSON.stringify(params.extradata),
          method: JSON.stringify(params.method),
          mac: mac,
          success: (data) => {
            console.log(data);
            // Tạo đơn hàng thành công
            // Hệ thống tự động chuyển sang trang thanh toán.
            submitCartMutation.mutate(
              { token: AccessToken, body: dataPost },
              {
                onSuccess: ({ data }) => {
                  queryClient
                    .invalidateQueries({ queryKey: ["ListsCart"] })
                    .then(() => {
                      navigate("/cart/finish", {
                        state: {
                          formState: data?.data?.order,
                        },
                      });
                    });
                },
              },
            );
          },
          fail: (err) => {
            // Tạo đơn hàng lỗi
            console.log(err);
          },
        });
      } else {
        submitCartMutation.mutate(
          { token: AccessToken, body: dataPost },
          {
            onSuccess: ({ data }) => {
              queryClient
                .invalidateQueries({ queryKey: ["ListsCart"] })
                .then(() => {
                  navigate("/cart/finish", {
                    state: {
                      formState: data?.data?.order,
                    },
                  });
                });
            },
          },
        );
      }
    }
  };

  const handleRefresh = () =>
    Promise.all([queryClient.invalidateQueries({ queryKey: ["ListsCart"] })]);

  return (
    <Page className="page !h-full !overflow-hidden flex flex-col" hideScrollbar>
      <div className="navbar fixed top-0 left-0 min-w-[100vw] max-w-[100vw] z-[999] bg-white shadow-3xl">
        <div className="w-2/3 relative flex items-center h-full pl-10">
          <div
            className="absolute left-0 w-10 h-full flex justify-center items-center cursor-pointer"
            onClick={() => {
              navigate(-1);
            }}
          >
            <Icon icon="zi-chevron-left-header" className="text-app" />
          </div>
          <Text.Title className="text-app">
            Giỏ hàng
            <span className="pl-1">
              {Orders?.items?.length > 0 && <>({Orders?.items?.length})</>}
            </span>
          </Text.Title>
        </div>
      </div>
      <div className="h-[calc(100%-56px)]">
        <PullToRefresh
          className="ezs-ptr ezs-ptr-safe"
          onRefresh={handleRefresh}
        >
          <div className="h-full overflow-auto no-scrollbar">
            <Controller
              name="SenderAddress"
              control={control}
              render={({ field: { ref, ...field }, fieldState }) => (
                <PickerSender
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                >
                  {({ open }) => (
                    <div
                      className="bg-white mt-1 px-3 pt-3 pb-4 flex relative"
                      onClick={() => {
                        if (!AccessToken) {
                          openSheetProtected();
                        } else {
                          open();
                        }
                      }}
                    >
                      <div className="text-app">
                        <svg
                          className="w-4 h-4 fill-danger"
                          viewBox="0 0 12 16"
                        >
                          <g stroke="none" fillRule="evenodd">
                            <path d="M7.63636364,5.86666667 C7.63636364,4.98293333 6.90327273,4.26666667 6,4.26666667 C5.09618182,4.26666667 4.36363636,4.98293333 4.36363636,5.86666667 C4.36363636,6.7504 5.09618182,7.46666667 6,7.46666667 C6.90327273,7.46666667 7.63636364,6.7504 7.63636364,5.86666667 M3.27272727,5.86666667 C3.27272727,4.39466667 4.49345455,3.2 6,3.2 C7.506,3.2 8.72727273,4.39466667 8.72727273,5.86666667 C8.72727273,7.33973333 7.506,8.53333333 6,8.53333333 C4.49345455,8.53333333 3.27272727,7.33973333 3.27272727,5.86666667 M6,1.06613333 C3.28854545,1.06613333 1.09090909,3.30453333 1.09090909,6.06666667 C1.09090909,8.8272 6,14.3989333 6,14.3989333 C6,14.3989333 10.9085455,8.8272 10.9085455,6.06666667 C10.9085455,3.30453333 8.71090909,1.06613333 6,1.06613333 M6.912,14.9328 L9.27272727,14.9328 C9.57381818,14.9328 9.81818182,15.1717333 9.81818182,15.4661333 C9.81818182,15.7610667 9.57381818,15.9994667 9.27272727,15.9994667 L2.72727273,15.9994667 C2.42563636,15.9994667 2.18181818,15.7610667 2.18181818,15.4661333 C2.18181818,15.1717333 2.42563636,14.9328 2.72727273,14.9328 L5.08745455,14.9328 C3.40909091,12.9114667 0,8.49813333 0,5.99946667 C0,2.68533333 2.68636364,0 6,0 C9.31363636,0 12,2.68533333 12,5.99946667 C12,8.49813333 8.58981818,12.9114667 6.912,14.9328" />
                          </g>
                        </svg>
                      </div>
                      <div className="flex-1 pl-3">
                        <div className="mb-1.5">Địa chỉ nhận hàng</div>
                        {AccessToken && (
                          <div className="flex items-center mb-1">
                            {Auth?.FullName}
                            <span className="px-2 text-muted">|</span>
                            {Auth?.MobilePhone}
                          </div>
                        )}

                        <div
                          className={clsx(
                            "leading-5 mt-px",
                            !field.value && "text-danger",
                          )}
                        >
                          {field.value ? field.value : "Thêm địa chỉ của bạn"}
                        </div>
                      </div>
                      <div className="flex items-center text-muted">
                        <Icon size={30} icon="zi-chevron-right" />
                      </div>
                      <div
                        className="w-full h-1 absolute bottom-0 left-0"
                        style={{
                          backgroundImage:
                            "repeating-linear-gradient(45deg,#6fa6d6,#6fa6d6 16px,transparent 0,transparent 21px,#f18d9b 0,#f18d9b 37px,transparent 0,transparent 42px)",
                        }}
                      ></div>
                    </div>
                  )}
                </PickerSender>
              )}
            />
            {isLoading && (
              <div className="bg-white mt-2">
                <div className="p-3 font-semibold">Thông tin đơn hàng</div>
                {Array(2)
                  .fill()
                  .map((_, index) => (
                    <div className="p-3 flex bg-[#f6f6f6]" key={index}>
                      <div className="w-16 aspect-square">
                        <div className="flex items-center justify-center w-full bg-gray-300 aspect-square rounded-sm animate-pulse">
                          <svg
                            className="w-7 text-gray-200 dark:text-gray-600"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 18"
                          >
                            <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 pl-3">
                        <div className="line-clamp-2 text-gray-700 text-xs">
                          <div className="mt-2 h-2.5 bg-gray-300 rounded-full w-8/12 animate-pulse"></div>
                        </div>
                        <div className="flex justify-between mt-1 text-gray-700 items-end">
                          <div className="text-sm">
                            <div className="mt-px h-2.5 bg-gray-300 rounded-full w-[80px] animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                <div className="px-3 h-12 border-t flex justify-between items-center">
                  <div className="font-medium text-sm">Thành tiền</div>
                  <div className="font-bold text-app">
                    <div className="mt-px h-3.5 bg-gray-200 rounded-full w-[80px] animate-pulse"></div>
                  </div>
                </div>
              </div>
            )}
            {!isLoading && (
              <>
                {Orders?.items && Orders?.items.length > 0 ? (
                  <>
                    <div className="bg-white mt-2">
                      <div className="p-3 font-semibold">
                        Thông tin đơn hàng
                      </div>
                      <div>
                        {Orders?.items.map((item, index) => (
                          <ItemCart item={item} key={index} />
                        ))}
                      </div>
                      <div className="px-3 h-12 border-t flex justify-between items-center">
                        <div className="font-medium text-sm">Thành tiền</div>
                        <div className="font-bold text-app">
                          {formatString.formatVND(Orders?.order?.ToPay)}
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-white my-1.5">
                      <Controller
                        name="SenderOther"
                        control={control}
                        render={({ field: { ref, ...field }, fieldState }) => (
                          <Input.TextArea
                            label="Ghi chú đơn hàng"
                            placeholder="Nhập ghi chú"
                            showCount
                            value={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex justify-center items-center flex-col py-10">
                    <svg
                      width={120}
                      height={120}
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0)">
                        <path
                          d="M18.4 56.6l12.3-.9c.8 0 1.1.2 1.5.9l16 27.9 5.4 9.4c.5 1 1 1 2 .6L92.3 79c2-1 3.3-.8 3.8.5.6 1.4 0 2.3-2.1 3.2L65.2 95c-3.7 1.6-7.4 3-11 4.7-1.2.6-1.8.6-2.5-.7L32.4 65l-2.2-3.9c-.5-1-1.3-1.5-2.4-1.3-3.2.6-6.5.4-9.8.9-2 .2-3.2-.4-3.3-1.8 0-1.3.8-2.1 2.8-2.4h.9z"
                          fill="#F79420"
                        />
                        <path
                          d="M66.6 102.7c5-.1 10.2.3 15.3.7 3.1.2 6.3.5 9.3 1.6.6.2 1.6.3 1.6 1 0 .8-1 1-1.5 1.1-2.1.8-4.3 1-6.5 1.3-9.1 1-18.3 1.3-27.4 1-6.2-.3-12.4-.5-18.5-2-.6 0-1.2-.3-1.8-.5-.4-.2-1-.3-1-.9 0-.5.7-.6 1.1-.8 2.1-1 4.5-1.2 6.8-1.5l13.6-1h9z"
                          fill="#E8E7E7"
                        />
                        <path
                          d="M88.8 85.8a5 5 0 015.5 4.1 5 5 0 01-4 5.5 5 5 0 01-5.6-4 5 5 0 014.1-5.6zM64.3 103c-.5 2.8-2.4 4.6-4.8 4.6s-4.4-1.7-4.9-4.4c-.4-2.5 2.4-5.2 4.8-5.3 2.3 0 5.3 2.5 5 5.2z"
                          fill="#EF4F2C"
                        />
                        <path
                          d="M77.9 28.7c1-3.7 2-7.3 2.8-11 .3-1.4.7-2.2 2.5-2 2.1.3 4.3.2 7 .2L78.3 29.2l-.4-.5zM67 29.6l-5.3-8.3c-.5-.8-.4-1.3.2-1.8l4.5-4.5 1 14.5a7 7 0 01-.4 0zM99.4 30.4l-12.8 4.1-.2-.3 7.2-6.6c.6-.6 1-.4 1.5 0l4.3 2.8z"
                          fill="#F79420"
                        />
                        <path
                          d="M77 76.6c1.8.3 3.6-1 4-2.7l.1-.3 6-25.9c.1-.5-.2-.9-.6-1l-8.3-1.4c.7-5.5-2.4-10.5-7.2-11.3-4.7-.9-9.4 2.7-10.6 8l-8.3-1.4c-.4 0-.8.2-1 .6l-3.4 26.4v.3c-.2 1.8.9 3.5 2.7 4l26.5 4.7h.1zm-6.4-40.3c3.5.6 5.7 4.4 5.1 8.5l-12.9-2.3c1-4 4.3-6.8 7.8-6.2zm1.7"
                          fill="#EF4F2C"
                        />
                        <path
                          d="M87 79L55.7 91.3l-14-26.2 42.9-5.3L87 79zM45.7 72.6l39.6-4.9M57.2 90.7L54 63.5M67.7 86.5l-3-24.3M77 82.7L74.1 61M50.2 80.5L86.3 76"
                          stroke="#F7941D"
                          strokeMiterlimit={10}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M23.3 90.8L5.5 97.3c-.5.2-1-.1-1.2-.6L4 96a1 1 0 01.5-1.3l17.8-6.4c.6-.2 1.1 0 1.3.6l.2.6c.2.5 0 1-.6 1.2zM31.4 94.2l-14.9 5.4a1 1 0 01-1.3-.7l-.2-.4a1 1 0 01.6-1.3l15-5.5a1 1 0 011.3.7l.1.4a1 1 0 01-.6 1.4zM34.9 100.3l-21.4 7.8c-.4.2-1-.1-1.2-.6l-.2-.6a1 1 0 01.6-1.2L34 97.9c.5-.1 1 .1 1.2.6l.2.6c.2.5 0 1-.5 1.3z"
                          fill="#E6E7E8"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0">
                          <path fill="#fff" d="M4 15h95.4v94.5H4z" />
                        </clipPath>
                      </defs>
                    </svg>
                    <div className="mt-4 font-bold">
                      "Hổng" có gì trong giỏ hết
                    </div>
                    <div className="mt-2">Lướt danh mục, lựa hàng ngay đi!</div>
                    <NavLink
                      to="/catalogue"
                      className="border border-app mt-4 py-3 px-4 rounded-sm text-app font-semibold"
                    >
                      Mua sắm ngay!
                    </NavLink>
                  </div>
                )}
              </>
            )}
          </div>
        </PullToRefresh>
      </div>
      <PickerVoucher>
        {({ open }) => (
          <div className="shadow-4xl bg-white border-b px-3 h-14 flex justify-between items-center z-10">
            <div className="flex items-center text-sm">
              <svg
                className="fill-danger w-6 h-6 mr-1"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -2 23 22"
              >
                <g filter="url(#voucher-filter0_d)">
                  <mask id="voucher-mask0_d" fill="#fff">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1 2h18v2.32a1.5 1.5 0 000 2.75v.65a1.5 1.5 0 000 2.75v.65a1.5 1.5 0 000 2.75V16H1v-2.12a1.5 1.5 0 000-2.75v-.65a1.5 1.5 0 000-2.75v-.65a1.5 1.5 0 000-2.75V2z"
                    />
                  </mask>
                  <path
                    d="M19 2h1V1h-1v1zM1 2V1H0v1h1zm18 2.32l.4.92.6-.26v-.66h-1zm0 2.75h1v-.65l-.6-.26-.4.91zm0 .65l.4.92.6-.26v-.66h-1zm0 2.75h1v-.65l-.6-.26-.4.91zm0 .65l.4.92.6-.26v-.66h-1zm0 2.75h1v-.65l-.6-.26-.4.91zM19 16v1h1v-1h-1zM1 16H0v1h1v-1zm0-2.12l-.4-.92-.6.26v.66h1zm0-2.75H0v.65l.6.26.4-.91zm0-.65l-.4-.92-.6.26v.66h1zm0-2.75H0v.65l.6.26.4-.91zm0-.65l-.4-.92-.6.26v.66h1zm0-2.75H0v.65l.6.26.4-.91zM19 1H1v2h18V1zm1 3.32V2h-2v2.32h2zm-.9 1.38c0-.2.12-.38.3-.46l-.8-1.83a2.5 2.5 0 00-1.5 2.29h2zm.3.46a.5.5 0 01-.3-.46h-2c0 1.03.62 1.9 1.5 2.3l.8-1.84zm.6 1.56v-.65h-2v.65h2zm-.9 1.38c0-.2.12-.38.3-.46l-.8-1.83a2.5 2.5 0 00-1.5 2.29h2zm.3.46a.5.5 0 01-.3-.46h-2c0 1.03.62 1.9 1.5 2.3l.8-1.84zm.6 1.56v-.65h-2v.65h2zm-.9 1.38c0-.2.12-.38.3-.46l-.8-1.83a2.5 2.5 0 00-1.5 2.29h2zm.3.46a.5.5 0 01-.3-.46h-2c0 1.03.62 1.9 1.5 2.3l.8-1.84zM20 16v-2.13h-2V16h2zM1 17h18v-2H1v2zm-1-3.12V16h2v-2.12H0zm1.4.91a2.5 2.5 0 001.5-2.29h-2a.5.5 0 01-.3.46l.8 1.83zm1.5-2.29a2.5 2.5 0 00-1.5-2.3l-.8 1.84c.18.08.3.26.3.46h2zM0 10.48v.65h2v-.65H0zM.9 9.1a.5.5 0 01-.3.46l.8 1.83A2.5 2.5 0 002.9 9.1h-2zm-.3-.46c.18.08.3.26.3.46h2a2.5 2.5 0 00-1.5-2.3L.6 8.65zM0 7.08v.65h2v-.65H0zM.9 5.7a.5.5 0 01-.3.46l.8 1.83A2.5 2.5 0 002.9 5.7h-2zm-.3-.46c.18.08.3.26.3.46h2a2.5 2.5 0 00-1.5-2.3L.6 5.25zM0 2v2.33h2V2H0z"
                    mask="url(#voucher-mask0_d)"
                  />
                </g>
                <path
                  clipRule="evenodd"
                  d="M6.49 14.18h.86v-1.6h-.86v1.6zM6.49 11.18h.86v-1.6h-.86v1.6zM6.49 8.18h.86v-1.6h-.86v1.6zM6.49 5.18h.86v-1.6h-.86v1.6z"
                />
                <defs>
                  <filter
                    id="voucher-filter0_d"
                    x={0}
                    y={1}
                    width={20}
                    height={16}
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity={0} result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    />
                    <feOffset />
                    <feGaussianBlur stdDeviation=".5" />
                    <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.09 0" />
                    <feBlend
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow"
                    />
                    <feBlend
                      in="SourceGraphic"
                      in2="effect1_dropShadow"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
              Voucher
            </div>
            <div
              onClick={() => {
                if (Orders?.items && Orders?.items.length > 0) {
                  open();
                } else {
                  openSnackbar({
                    text: `"Hổng" có gì trong giỏ hết. Mua sắm ngay!`,
                    type: "warning",
                    duration: 1000,
                  });
                }
              }}
            >
              {Orders?.order?.VoucherCode ? (
                <div className="flex items-center">
                  <div className="border border-success px-5 bg-success text-white py-px mr-1 text-[12px] mask-wave uppercase">
                    {Orders.order.VoucherCode}
                  </div>
                  <Icon className="text-muted" icon="zi-chevron-right" />
                </div>
              ) : (
                <div className="flex items-center text-muted text-sm">
                  Chọn hoặc nhập mã
                  <Icon icon="zi-chevron-right" />
                </div>
              )}
            </div>
          </div>
        )}
      </PickerVoucher>
      <div className="fixed bottom-0 left-0 w-full pb-safe-bottom bg-white z-20">
        <div className="grid grid-cols-2 h-12">
          <div className="flex flex-col justify-center px-3">
            <div className="text-xs">Tổng thanh toán</div>
            <div className="font-bold text-app text-lg leading-5">
              {formatString.formatVNDPositive(Orders?.order?.RemainPay)}
            </div>
          </div>
          <div>
            <Button
              className={clsx(
                "!bg-app !rounded-none !font-bold disabled:!text-white disabled:opacity-60",
                false && "!bg-opacity-70",
              )}
              fullWidth
              size="large"
              disabled={!Orders?.items || Orders?.items.length === 0}
              loading={submitCartMutation.isLoading}
              onClick={handleSubmit(onSubmit)}
            >
              Đặt mua
            </Button>
          </div>
        </div>
      </div>
    </Page>
  );
};
export default CartPage;
