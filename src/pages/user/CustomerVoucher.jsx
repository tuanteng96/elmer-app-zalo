import { useQuery } from "@tanstack/react-query";
import React from "react";
import PullToRefresh from "react-simple-pull-to-refresh";
import { Icon, Page, Text, useNavigate } from "zmp-ui";
import AuthAPI from "../../api/auth.api";
import { useLayout } from "../../layout/LayoutProvider";
import GiftSVG from "../../static/icons/gift.png";
import { checkDateDiff } from "../../utils/date";
import { formatString } from "../../utils/formatString";
import { PickerVoucher } from "./components/PickerVoucher";

const CustomerVoucher = () => {
  const navigate = useNavigate();
  const { Auth, AccessToken } = useLayout();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["VouchersList", AccessToken],
    queryFn: async () => {
      const { data } = await AuthAPI.vouchers(Auth?.ID);
      return data?.data?.danh_sach ? data?.data?.danh_sach.reverse() : [];
    },
    enabled: Number(Auth?.ID) > -1,
  });

  return (
    <Page className="page !pb-safe-bottom" hideScrollbar>
      <div className="navbar fixed top-0 left-0 min-w-[100vw] max-w-[100vw] z-[999] bg-white">
        <div className="w-2/3 relative flex items-center h-full pl-10">
          <div
            className="absolute left-0 w-10 h-full flex justify-center items-center cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <Icon icon="zi-chevron-left-header" className="text-app" />
          </div>
          <Text.Title className="text-app">Mã giảm giá</Text.Title>
        </div>
      </div>
      <PullToRefresh className="ezs-ptr" onRefresh={refetch}>
        <div className="h-full no-scrollbar overflow-auto">
          <div className="p-3">
            {isLoading &&
              Array(3)
                .fill(3)
                .map((_, index) => (
                  <div
                    className="border shadow-3xl border-l-0 rounded-sm overflow-hidden flex mb-3 last:mb-0 bg-white cursor-pointer"
                    key={index}
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
                          <img className="aspect-square w-14" src={GiftSVG} />
                        </div>
                      </div>
                    </div>
                    <div className="px-3 py-2.5 flex-1">
                      <div className="text-[17px] font-bold mb-3">
                        <div className="h-4 rounded bg-gray-200 w-24 animate-pulse"></div>
                      </div>
                      <div className="font-medium text-[13px] border border-primary inline-block px-2 py-px text-primary rounded">
                        <span className="pr-1">Giảm tối đa</span>
                        ...
                      </div>
                      <div className="flex mt-3 justify-between">
                        <div className="h-3 rounded bg-gray-200 w-11/12 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}

            {!isLoading && (
              <>
                {(!data || data.length === 0) && (
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
                      Hãy bắt đầu săn mã giảm giảm giá từ các chương trình ...
                    </div>
                  </div>
                )}
                {data &&
                  data.map((item, index) => (
                    <PickerVoucher item={item} key={index}>
                      {({ open }) => (
                        <div
                          className="border shadow-3xl border-l-0 rounded-sm overflow-hidden flex mb-3 last:mb-0 bg-white cursor-pointer"
                          onClick={open}
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
                                  className="aspect-square w-12"
                                  src={GiftSVG}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="px-3 py-2.5 flex-1">
                            <div className="text-[17px] font-bold mb-3">
                              Code <span className="text-app">{item.ma}</span>
                            </div>
                            <div className="font-medium text-[13px] border border-primary inline-block px-2 py-px text-primary rounded">
                              <span className="pr-1">Giảm tối đa</span>
                              {item?.gia_tri?.Phan_tram > 0
                                ? item.gia_tri.Phan_tram + "%"
                                : formatString.formatVND(item?.gia_tri?.Tien)}
                            </div>
                            <div className="flex mt-2 justify-between">
                              <div className="text-sm">
                                <span className="pr-1">HSD :</span>
                                {item?.ngay === null ? (
                                  "Không giới hạn"
                                ) : (
                                  <>
                                    Còn <b>{checkDateDiff(item?.ngay?.To)}</b>{" "}
                                    ngày
                                  </>
                                )}
                              </div>
                              <div className="uppercase font-bold text-[13px] text-primary">
                                Chi tiết
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </PickerVoucher>
                  ))}
              </>
            )}
          </div>
        </div>
      </PullToRefresh>
    </Page>
  );
};

export default CustomerVoucher;
