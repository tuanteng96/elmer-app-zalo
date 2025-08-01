import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { createSearchParams } from "react-router-dom";
import { Icon, Page, Tabs, Text, useNavigate } from "zmp-ui";
import AuthAPI from "../../api/auth.api";
import { useQueryParams } from "../../hook";
import { useLayout } from "../../layout/LayoutProvider";
import { formatString } from "../../utils/formatString";
import WalletMM from "../../utils/WalletMM";
import clsx from "clsx";
import { ItemCard } from "./components/ItemCard";
import BgCard from "../../static/icons/bg-card.jpg";

import moment from "moment";
import PullToRefresh from "react-simple-pull-to-refresh";

const CustomerWalletCard = () => {
  const queryParams = useQueryParams();
  const queryConfig = {
    Type: queryParams?.Type || "Wallet",
  };
  const [WalletCard, setWalletCard] = useState({
    Wallet: null,
    Card: null,
  });

  const navigate = useNavigate();
  const { Auth } = useLayout();

  const { isLoading: isLoadingWallet, refetch: refetchWallet } = useQuery({
    queryKey: ["WalletList", Auth?.ID],
    queryFn: async () => {
      var bodyFormData = new FormData();
      bodyFormData.append("cmd", "list_money");
      bodyFormData.append("MemberID", Auth?.ID);
      const { data } = await AuthAPI.wallet(bodyFormData);
      return data;
    },
    onSuccess: (data) => {
      var MM = new WalletMM(data);
      setWalletCard((prevState) => ({
        ...prevState,
        Wallet: {
          HistoryUse: MM?.data?.Items || [],
          TotalWallet: MM.totalWallet(), // Tổng Ví
          DemonsWallet: MM.availableWallet(), // Ví khả dụng
        },
      }));
    },
    enabled: Number(Auth?.ID) > -1,
  });

  const {
    data,
    isLoading,
    refetch: refetchCard,
  } = useQuery({
    queryKey: ["MoneyCardList", Auth?.ID],
    queryFn: async () => {
      const { data } = await AuthAPI.moneyCard(Auth?.ID);
      return data?.data || [];
    },
    enabled: Number(Auth?.ID) > -1,
  });

  const onChangeTabs = (evt) => {
    navigate({
      pathname: "/user/customer-wallet-card",
      search: createSearchParams({
        Type: evt,
      }).toString(),
    });
  };

  const VietnamesType = (item) => {
    switch (true) {
      case item.Type === "NAP_QUY" && item.Source === "" && item.Value >= 0:
        return "Nạp ví";
      case item.Type === "NAP_QUY" && item.Value < 0 && item.Source === "":
        return "Trừ ví";
      case item.Source === "CHINH_SUA_SO_BUOI_DV":
        return "Hoàn tiền khi hoàn buổi dịch vụ";
      case item.Type === "MUA_HANG" &&
        item?.Desc.indexOf("KHAU_TRU_TRA_HANG") === -1:
        return "Tích lũy mua hàng";
      case item.Type === "MUA_HANG" &&
        item?.Desc.indexOf("KHAU_TRU_TRA_HANG") > -1:
        return "Giảm bớt tích lũy do trả hàng";
      case item.SumType === "TRA_HANG_HOAN_VI":
        return "Hoàn tiền khi trả hàng";
      case item.SumType === "TRA_HANG_PHI_VI":
        return "Phí dịch vụ trả hàng";
      case item.Type === "GIOI_THIEU" &&
        item?.Desc.indexOf("KHAU_TRU_TRA_HANG") === -1:
        return "Hoa hồng giới thiệu";
      case item.Type === "GIOI_THIEU" &&
        item?.Desc.indexOf("KHAU_TRU_TRA_HANG") > -1:
        return "Giảm bớt hoa hồng do trả hàng";
      case item.Type === "CHIA_SE_MAGIAMGIA":
        return "Hoa hồng giới thiệu ( Chia sẻ voucher )";
      case item.SumType === "KET_THUC_THE_HOAN_VI":
        return "Hoàn tiền khi kết thúc thẻ";
      case item.SumType === "KET_THUC_THE_PHI_VI":
        return "Phí dịch vụ kết thúc thẻ";
      case item.SumType === "DANG_KY_THANH_VIEN":
        return "Ưu đãi đăng ký tài khoản";
      case item.SumType === "DANG_NHAP_LAN_DAU":
        return "Ưu đãi khi đăng nhập lần đầu";
      case item.SumType === "CHUC_MUNG_SN":
        return "Ưu đãi mừng sinh nhật";
      case item.SumType === "CHUC_MUNG_SN_THANG":
        return "Ưu đãi tháng sinh nhật";
      case item.Type === "THANH_TOAN_DH":
        return "Thanh toán đơn hàng";
      case item.Type === "PHI" && item.SumType === "":
        return "Phí dịch vụ";
      default:
        return "Chưa xác định";
    }
  };

  return (
    <Page className="page !pb-0 !h-full !overflow-hidden" hideScrollbar>
      <div className="navbar fixed top-0 left-0 min-w-[100vw] max-w-[100vw] z-[999] bg-white">
        <div className="w-2/3 relative flex items-center h-full pl-10">
          <div
            className="absolute left-0 w-10 h-full flex justify-center items-center cursor-pointer"
            onClick={() => navigate("/user")}
          >
            <Icon icon="zi-chevron-left-header" className="text-app" />
          </div>
          <Text.Title className="text-app">Ví & thẻ tiền</Text.Title>
        </div>
      </div>
      <div className="h-full border-t">
        <Tabs
          className="tab-scrollbar"
          activeKey={queryConfig.Type}
          onChange={onChangeTabs}
        >
          <Tabs.Tab key="Wallet" label="Ví điện thử">
            <PullToRefresh className="ezs-ptr" onRefresh={refetchWallet}>
              <div className="h-full flex flex-col">
                <div className="bg-white min-h-[150px] pt-7 flex flex-col flex-column items-center relative">
                  <div className="text-danger text-2xl font-bold">
                    {isLoadingWallet ? (
                      <div className="h-5 bg-gray-200 animate-pulse rounded-lg w-40"></div>
                    ) : (
                      formatString.formatVNDPositive(
                        WalletCard?.Wallet?.TotalWallet,
                      )
                    )}
                  </div>
                  <div className="text-base font-medium mt-px text-[#929292]">
                    Tổng Ví
                  </div>
                  <div className="px-5 absolute -bottom-[40px] w-full">
                    <div className="z-10 relative before:absolute before:content-[''] before:h-full before:w-[85%] before:left-2/4 before:-translate-x-2/4 before:bg-white before:-z-[1] before:right-0 before:rounded-[.375rem] before:-bottom-4 before:shadow-3xl">
                      <div className="grid grid-cols-2 shadow-5xl bg-white rounded-md p-3">
                        <div className="text-center py-1">
                          <div className="font-bold text-base text-success flex flex-col items-center">
                            {isLoadingWallet ? (
                              <div className="h-3 bg-gray-200 rounded-lg w-28 animate-pulse"></div>
                            ) : (
                              formatString.formatVNDPositive(
                                WalletCard?.Wallet?.DemonsWallet,
                              )
                            )}
                          </div>
                          <div className="text-[#929292] mt-px text-sm">
                            Ví khả dụng
                          </div>
                        </div>
                        <div className="text-center py-1">
                          <div className="font-bold text-base text-warning flex flex-col items-center">
                            {isLoadingWallet ? (
                              <div className="h-3 bg-gray-200 rounded-lg w-28 animate-pulse"></div>
                            ) : (
                              formatString.formatVNDPositive(
                                WalletCard?.Wallet?.TotalWallet -
                                  WalletCard?.Wallet?.DemonsWallet,
                              )
                            )}
                          </div>
                          <div className="text-[#929292] mt-px text-sm">
                            Chờ xử lý
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-3 grow overflow-auto no-scrollbar pt-20 pb-safe-bottom">
                  <div className="relative">
                    {isLoadingWallet && (
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
                                  <div className="h-4 bg-white rounded-full w-24"></div>
                                </div>
                                <div className="mt-2 text-muted">
                                  <div className="h-2.5 bg-white rounded-full w-28"></div>
                                </div>
                              </div>
                              <div className="note absolute bottom-0 right-0 w-7/12 flex flex-col items-end">
                                <div className="h-2.5 bg-white rounded-full w-36"></div>
                              </div>
                            </li>
                          ))}
                      </ul>
                    )}
                    {!isLoadingWallet && (
                      <>
                        {!WalletCard?.Wallet?.HistoryUse ||
                          (WalletCard?.Wallet?.HistoryUse.length === 0 && (
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
                                "Hổng" có lịch sử sử dụng ví !
                              </div>
                              <div>Hãy bắt đầu nạp ví & sử dụng ...</div>
                            </div>
                          ))}
                        {WalletCard?.Wallet?.HistoryUse &&
                          WalletCard?.Wallet?.HistoryUse.length > 0 && (
                            <ul className="pl-7 before:border-l before:border-[#cccbcd] before:border-dashed before:content-[''] before:h-full before:left-2 before:absolute">
                              {WalletCard?.Wallet?.HistoryUse.map(
                                (item, index) => (
                                  <li
                                    className={clsx(
                                      "mb-6 last:mb-0 relative before:content-[''] before:rounded-full before:w-[10px] before:h-[10px] before:absolute before:-left-[24px] before:top-[6px]",
                                      item.Value > 0
                                        ? "before:bg-success"
                                        : "before:bg-danger",
                                    )}
                                    key={index}
                                  >
                                    <div className="relative">
                                      <div
                                        className={clsx(
                                          "font-bold text-base",
                                          item.Value > 0
                                            ? "text-success"
                                            : "text-danger",
                                        )}
                                      >
                                        <span className="pr-1">
                                          {item.Value > 0 ? "+" : "-"}
                                        </span>
                                        {formatString.formatVNDPositive(
                                          item.Value,
                                        )}
                                      </div>
                                      <div className="mt-2 text-muted">
                                        {moment(item.CreateDate).fromNow()}
                                      </div>
                                    </div>
                                    <div className="note absolute bottom-0 right-0">
                                      <div>{VietnamesType(item)}</div>
                                      {item.canh_bao_thanh_toan ? (
                                        <div className="text-danger text-sm">
                                          ( Chưa thanh toán hết )
                                        </div>
                                      ) : (
                                        <></>
                                      )}
                                    </div>
                                  </li>
                                ),
                              )}
                            </ul>
                          )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </PullToRefresh>
          </Tabs.Tab>
          <Tabs.Tab key="Card" label="Thẻ tiền của bạn">
            <PullToRefresh className="ezs-ptr" onRefresh={refetchCard}>
              <div className="h-full flex flex-col overflow-auto no-scrollbar pb-safe-bottom">
                {isLoading && (
                  <>
                    {Array(2)
                      .fill()
                      .map((_, index) => (
                        <div className="p-3" key={index}>
                          <div
                            className="text-white mb-3 last:mb-0 rounded-md px-5 py-6 !bg-cover !bg-no-repeat cursor-pointer"
                            style={{ backgroundImage: `url(${BgCard})` }}
                          >
                            <div className="mb-10 flex justify-between">
                              <div>
                                <div className="font-semibold">
                                  <div className="h-2.5 bg-gray-200 rounded-md w-48 animate-pulse"></div>
                                </div>
                                <div className="text-lg font-bold">
                                  <div className="h-4 bg-gray-200 rounded-full w-32 animate-pulse mt-2"></div>
                                </div>
                              </div>
                              <div>
                                <Icon icon="zi-unfold-more" />
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-1">
                              <div>
                                <div className="opacity-80 mb-1 text-sm">
                                  Giới hạn
                                </div>
                                <div className="font-bold text-sm">
                                  <div className="h-2.5 bg-gray-200 rounded-md w-16 animate-pulse mt-2"></div>
                                </div>
                              </div>
                              <div>
                                <div className="opacity-80 mb-1 text-sm">
                                  Còn lại
                                </div>
                                <div className="font-bold text-sm">
                                  <div className="h-2.5 bg-gray-200 rounded-md w-16 animate-pulse mt-2"></div>
                                </div>
                              </div>
                              <div>
                                <div className="opacity-80 mb-1 text-sm">
                                  Hạn dùng
                                </div>
                                <div className="font-bold text-sm">
                                  <div className="h-2.5 bg-gray-200 rounded-md w-16 animate-pulse mt-2"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </>
                )}
                {!isLoading && (
                  <>
                    {!data ||
                      (data.length === 0 && (
                        <div className="flex flex-col items-center px-5 h-5/6 justify-center">
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
                            "Hổng" có thẻ tiền nào ?
                          </div>
                          <div>Hãy bắt đầu mua thẻ tiền & sử dụng ...</div>
                        </div>
                      ))}
                    {data && data.length > 0 && (
                      <div className="p-3">
                        {data.map((item, index) => (
                          <ItemCard item={item} key={index} />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </PullToRefresh>
          </Tabs.Tab>
        </Tabs>
      </div>
    </Page>
  );
};

export default CustomerWalletCard;
