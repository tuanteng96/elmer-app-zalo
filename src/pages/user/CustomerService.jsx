import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { createSearchParams } from "react-router-dom";
import {
  Avatar,
  Icon,
  Page,
  Tabs,
  Text,
  useNavigate,
  useSnackbar,
} from "zmp-ui";
import AuthAPI from "../../api/auth.api";
import { useQueryParams } from "../../hook";
import { useLayout } from "../../layout/LayoutProvider";

import moment from "moment";
import { ImageLazy } from "../../components/ImagesLazy";
import { toAbsolutePath, toAbsolutePathAPI } from "../../utils/assetPath";
import clsx from "clsx";
import { GiftIcon } from "@heroicons/react/24/outline";
import { formatString } from "../../utils/formatString";
import PullToRefresh from "react-simple-pull-to-refresh";

const CustomerService = () => {
  const queryClient = useQueryClient();
  const queryParams = useQueryParams();
  const queryConfig = {
    Type: queryParams?.Type || "Service",
  };

  const navigate = useNavigate();
  const { AccessToken, Auth } = useLayout();

  const { openSnackbar } = useSnackbar();

  const [isPullRefresh, setIsPullRefresh] = useState(false);

  const formatCard = (arr) => {
    let newArr = arr.map((x) => {
      let obj = {
        ...x,
        ServicesNew: x.Services.filter((x) => x.Status === "done").sort(
          (a, b) => new Date(b.BookDate) - new Date(a.BookDate),
        ),
      };
      return {
        ...obj,
        BookDate:
          obj.ServicesNew && obj.ServicesNew.length > 0
            ? obj.ServicesNew[0].BookDate
            : null,
      };
    });
    newArr = newArr.sort((a, b) => new Date(b.BookDate) - new Date(a.BookDate));
    return newArr;
  };

  const { data, isFetching } = useQuery({
    queryKey: ["ServiceCardList", { Token: AccessToken, MemberID: Auth?.ID }],
    queryFn: async () => {
      const { data } = await AuthAPI.serviceCard({
        Token: AccessToken,
        MemberID: Auth?.ID,
      });
      let result = data || [];

      return {
        Total: result.length,
        data: [
          {
            Key: "Service",
            Title: "Thẻ dịch vụ",
            Items: result.filter((item) => item.TabIndex === 0),
          },
          {
            Key: "Insurance",
            Title: "Thẻ bảo hành",
            Items: formatCard(result.filter((item) => item.TabIndex === 1)),
          },
          {
            Key: "Excessive",
            Title: "Thẻ hết hạn",
            Items: formatCard(result.filter((item) => item.TabIndex === 2)),
          },
        ],
      };
    },
    enabled: Number(Auth?.ID) > -1,
    initialData: {
      Total: 0,
      data: [
        {
          Key: "Service",
          Title: "Thẻ dịch vụ",
          Items: [],
        },
        {
          Key: "Insurance",
          Title: "Thẻ bảo hành",
          Items: [],
        },
        {
          Key: "Excessive",
          Title: "Thẻ hết hạn",
          Items: [],
        },
      ],
    },
  });

  const onChangeTabs = (evt) => {
    navigate({
      pathname: "/user/customer-service",
      search: createSearchParams({
        Type: evt,
      }).toString(),
    });
  };

  const clsStatus = (status) => {
    switch (status) {
      case "done":
        return "bg-[#6c757d]";
      default:
        return "bg-primary";
    }
  };

  const handleRefresh = () => {
    setIsPullRefresh(true);
    return Promise.all([
      queryClient.invalidateQueries({ queryKey: ["ServiceCardList"] }),
    ]).then(() => setIsPullRefresh(false));
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
          <Text.Title className="text-app">
            Quản lý thẻ dịch vụ
            {data?.Total > 0 && <span className="pl-1">({data.Total})</span>}
          </Text.Title>
        </div>
      </div>
      <div className="h-full border-t">
        <Tabs
          className="tab-scrollbar zaui-cols-3"
          activeKey={queryConfig.Type}
          onChange={onChangeTabs}
        >
          {data?.data.map((item) => (
            <Tabs.Tab key={item.Key} label={item.Title}>
              {!isPullRefresh && isFetching && (
                <div className="h-full flex flex-col overflow-auto no-scrollbar pb-safe-bottom">
                  <div className="p-3">
                    {Array(1)
                      .fill()
                      .map((_, index) => (
                        <div
                          className="bg-white mb-3 last:mb-0 animate-pulse"
                          key={index}
                        >
                          <div className="w-full">
                            <div className="flex items-center justify-center w-full aspect-[1.5] bg-gray-300">
                              <svg
                                className="w-16 h-16 text-gray-200"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                                fill="currentColor"
                                viewBox="0 0 640 512"
                              >
                                <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
                              </svg>
                            </div>
                          </div>
                          <div className="grid grid-cols-4 gap-3 p-3">
                            {Array(4)
                              .fill()
                              .map((_, idx) => (
                                <div
                                  className="aspect-square rounded flex items-center justify-center relative bg-primary"
                                  key={idx}
                                ></div>
                              ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
              {!(!isPullRefresh && isFetching) && (
                <PullToRefresh className="ezs-ptr" onRefresh={handleRefresh}>
                  <div className="h-full flex flex-col overflow-auto no-scrollbar pb-safe-bottom">
                    <div className="p-3">
                      {(!item.Items || item.Items.length === 0) && (
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
                            "Hổng" có dữ liệu ?
                          </div>
                          <div>Hãy bắt đầu sử dụng thẻ dịch vụ của bạn ?</div>
                        </div>
                      )}
                      {item.Items.map((service, idx) => (
                        <div className="bg-white mb-3 last:mb-0" key={idx}>
                          <div className="relative">
                            <ImageLazy
                              wrapperClassName="aspect-[1.5] !block"
                              className="aspect-[1.5] object-cover w-full"
                              effect="blur"
                              src={toAbsolutePath(service?.Thumbnail)}
                            />
                            <div className="absolute left-0 bottom-0 w-full h-4/6 bg-pattern"></div>
                            <div className="absolute w-full bottom-0 left-0 p-3 text-white">
                              <div className="uppercase font-semibold mb-2">
                                {service.OrderItem.ProdTitle}
                                <span className="pl-1.5">
                                  ({service.Title})
                                </span>
                              </div>
                              <div className="text-sm">
                                <div>
                                  <span>Giá trị : </span>
                                  <span>
                                    {formatString.formatVND(
                                      service.OrderItem.ToPay,
                                    )}
                                  </span>
                                </div>
                                <div>
                                  <span>Dùng lần cuối : </span>
                                  <span>
                                    {moment(item.Services).format(
                                      "HH:mm DD-MM-YYYY",
                                    )}
                                  </span>
                                </div>
                                <div>
                                  <span>Hạn sử dụng : </span>
                                  <span>
                                    {moment(item.EndDate).format("DD-MM-YYYY")}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-4 gap-3 p-3">
                            {service.Services.map((card, i) => (
                              <div
                                className={clsx(
                                  "aspect-square rounded flex items-center justify-center relative",
                                  clsStatus(card.Status),
                                )}
                                key={i}
                              >
                                {card.BookDate && (
                                  <span className="absolute top-2 left-1.5 text-[10px] text-white opacity-80 leading-3">
                                    {moment(card.BookDate).format("DD-MM")}
                                  </span>
                                )}
                                <span className="text-xl text-white font-semibold">
                                  {i + 1}
                                </span>
                                <span className="italic bg-[rgba(0,0,0,.5)] text-[10px] leading-3 text-white px-1 py-px rounded-sm absolute top-1.5 right-1.5">
                                  {card.Minutes}p
                                </span>
                                {card.Meta && card.Meta.search("gift") > -1 && (
                                  <span className="text-white absolute bottom-1 right-2">
                                    <GiftIcon className="w-4 text-white opacity-90" />
                                  </span>
                                )}
                                {card.Status === "done" && (
                                  <span className="!text-white absolute bottom-1 right-2 z-[10]">
                                    ✔
                                  </span>
                                )}
                                {card.Staffs && card.Staffs.length > 0 && (
                                  <Avatar.Group
                                    className="absolute bottom-px left-px"
                                    maxCounter={1}
                                  >
                                    {card.Staffs.map((staff, k) => (
                                      <Avatar
                                        className="border !w-5 !h-5"
                                        size={16}
                                        src={toAbsolutePathAPI(
                                          "/app2021/images/avatar-null2.png",
                                        )}
                                        key={k}
                                        onClick={() =>
                                          openSnackbar({
                                            text: staff.FullName,
                                          })
                                        }
                                      ></Avatar>
                                    ))}
                                  </Avatar.Group>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </PullToRefresh>
              )}
            </Tabs.Tab>
          ))}
        </Tabs>
      </div>
    </Page>
  );
};

export default CustomerService;
