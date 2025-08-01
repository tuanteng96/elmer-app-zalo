import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useLocation, useParams } from "react-router";
import { NavLink } from "react-router-dom";
import PullToRefresh from "react-simple-pull-to-refresh";
import { Icon, Page, Text, useNavigate } from "zmp-ui";
import NewsAPI from "../../api/news.api";
import { HtmlParser } from "../../components/HtmlParser";
import { toAbsolutePath, toAbsolutePathAPI } from "../../utils/assetPath";
import { openChat } from "zmp-sdk";
import { useLayout } from "../../layout/LayoutProvider";
import HTMLEllipsis from "react-lines-ellipsis/lib/html";
import { Swiper, SwiperSlide } from "swiper/react";
import { formatString } from "../../utils/formatString";

const ReviewsDetailPage = () => {
  const navigate = useNavigate();
  const { state, pathname } = useLocation();
  let isSame = pathname.indexOf("/same/") > -1
  let { id } = useParams();

  let { GlobalConfig } = useLayout();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["NewsDetail"],
    queryFn: async () => {
      const { data } = await NewsAPI.getDetailID(id);
      return data?.data[0] || [];
    },
    initialData: state?.dataProps,
    enabled: !state?.dataProps && Number(id) > -1,
    cacheTime: state?.dataProps ? 0 : 5 * 60 * 1000,
  });

  const ReviewsRelate = useQuery({
    queryKey: ["ReviewsRelate"],
    queryFn: async () => {
      const { data } = await NewsAPI.getListToID("11366");
      return data?.data && data?.data.length > 0 ? data.data.filter(x => x.id !== Number(id)) : [];
    },
  });

  return (
    <Page className="page !pb-0 bg-app" hideScrollbar>
      <div className="navbar fixed top-0 left-0 min-w-[100vw] max-w-[100vw] z-[999] bg-app shadow-3xl text-white">
        <div className="w-2/3 relative flex items-center h-full pl-10">
          <div
            className="absolute left-0 w-10 h-full flex justify-center items-center cursor-pointer"
            onClick={() => navigate("/reviews", {
              state: {
                prevState: state?.prevState || null
              }
            })}
          >
            <Icon icon="zi-chevron-left-header" />
          </div>
          <Text.Title className="w-full">
            <div className="truncate">
              {isLoading ? "Đang tải ..." : data?.source?.Title || data?.Title}
            </div>
          </Text.Title>
        </div>
      </div>
      <PullToRefresh className="ezs-ptr ezs-ptr-safe" onRefresh={refetch}>
        <div className="h-full overflow-auto pb-safe-bottom">
          {
            isLoading && (
              <>
                <div className="px-3 bg-white">
                  <div className="text-sm font-light py-3.5">
                    <div className="mb-1.5">
                      <div className="animate-pulse h-2 bg-gray-200 rounded-full w-full mb-1.5 last:mb-0"></div>
                      <div className="animate-pulse h-2 bg-gray-200 rounded-full mb-1.5 last:mb-0"></div>
                      <div className="animate-pulse h-2 bg-gray-200 rounded-full mb-1.5 last:mb-0"></div>
                      <div className="animate-pulse h-2 bg-gray-200 rounded-full w-4/5 mb-1.5 last:mb-0"></div>
                    </div>
                    <div>
                      <div className="animate-pulse h-2 bg-gray-200 rounded-full w-full mb-1.5 last:mb-0"></div>
                      <div className="animate-pulse h-2 bg-gray-200 rounded-full mb-1.5 last:mb-0"></div>
                      <div className="animate-pulse h-2 bg-gray-200 rounded-full mb-1.5 last:mb-0"></div>
                      <div className="animate-pulse h-2 bg-gray-200 rounded-full w-4/5 mb-1.5 last:mb-0"></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border-t bg-white">
                  <div>
                    <div className="flex items-center justify-center w-16 bg-gray-300 overflow-hidden aspect-square rounded-full animate-pulse">
                      <svg
                        className="w-6 text-gray-200"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 640 512"
                      >
                        <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium mb-1">
                      <div className="animate-pulse h-3 bg-gray-200 rounded-full w-2/4"></div>
                    </div>
                    <div className="flex justify-between">
                      <div className="font-light text-xs text-muted flex-1">
                        <div className="w-6/12 animate-pulse h-2 bg-gray-200 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )
          }
          {
            !isLoading && (
              <>
                <div className="py-3.5 bg-white">
                  <div className="relative bg-white px-3 leading-6 content-full">
                    <HtmlParser>{data?.source?.Content || data?.Content}</HtmlParser>
                  </div>
                  <div className="px-3 mt-3.5">
                    <button
                      className="bg-gradient-to-r bg-app text-white h-12 text-center rounded-full w-full font-medium flex items-center justify-center gap-2"
                      type="button"
                      onClick={() => {
                        openChat({
                          type: GlobalConfig?.ZALO?.type,
                          id: GlobalConfig?.ZALO?.ID,
                          message: "Xin chào? Mình cần tư vấn ?",
                        });
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="{1.5}"
                        stroke="currentColor"
                        className="w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                        />
                      </svg>
                      Gửi tin nhắn qua Zalo
                    </button>
                  </div>
                </div>
                <div className="p-3 border-t bg-white">
                  <div className="mb-3 uppercase font-semibold text-gold">Người đăng</div>
                  <div className="flex items-center gap-3">
                    <div>
                      <img
                        className="w-16 aspect-square object-cover rounded-full"
                        src={toAbsolutePath(data?.Thumbnail)}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium mb-1.5">{data?.Title}</div>
                      <div className="text-xs text-gray-800">
                        <div className="flex items-end gap-1 mb-[2px]">
                          <svg
                            className="w-4"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            x="0px"
                            y="0px"
                            viewBox="0 0 256 256"
                            enableBackground="new 0 0 256 256"
                            xmlSpace="preserve"
                          >

                            <g>
                              <g>
                                <g>
                                  <g>
                                    <path
                                      fill="#000000"
                                      d="M126.3,192.1c1.7,0,6.1-1.7,10.9-1.7c6,0,12.3,1.7,12.3,1.7s-10.5-8.9-14.2-8.9c-3.7,0-9.1,3.5-9.1,3.5s-4.3-3.3-7.3-3.5c-3.1-0.2-15.9,8.9-15.9,8.9s7.7-2,14.4-2C121.2,190.2,124.9,192.1,126.3,192.1z"
                                    />
                                    <path
                                      fill="#000000"
                                      d="M126.3,204.2c14.5,0,23.3-12.1,23.3-12.1s-5.2,3.1-12.8,3.5c-3.2,0.2-6.7-0.4-10.5-0.4c-3.1,0-6.3,0.8-9,0.7c-8.5-0.4-14.3-3.8-14.3-3.8S111.7,204.2,126.3,204.2z"
                                    />
                                    <path
                                      fill="#000000"
                                      d="M50.4,108.2c0.5-15.6,5.7-30.1,14.3-42c18-5.5,41.6-6.7,64.7-1.2c-13.2,2.9-25.5,9.3-35.8,19c-10,9.4-17.3,21.2-20.8,32.9l0,0.1c1.9,1,4.1,2.2,6.5,3.3c9.3-16.6,26.9-27.9,47.2-27.9c10,0,19.4,2.8,27.4,7.6c-0.8,3.4-1,7.1-0.3,10.6l0.7,3.3l-0.6,1.1c-1.9,4.6-1.9,9.7-0.4,14.5c0.7-0.8,1.8-1.4,3.2-2c-0.9-3.4-0.8-7.3,0.7-11.1c3.1-7.5,20.5,0.8,20.5,0.8s-16.5-14.3-20.4-7.4c-2.2-11.9,6.2-25.7,19-22.9c-10.2,9.4,4.9,26.7,4.9,26.7s-5.6-18.9-1.4-23.5c6.2-6.9,20.3,3.7,20.4,13.9c-4.9-0.4-9.5,6-12.1,10.3l0.1-0.1c5.3-2.9,9.9-4,13.6-5c1.4-0.3,2.6-0.7,3.7-1c1.3-0.5,2.9-1.7,4.6-3.6c-3-43.6-39.3-78.2-83.7-78.2c-43,0-78.5,32.5-83.3,74.2C45.8,104.9,48.4,107.4,50.4,108.2z M202.1,108.1l0,0.4l-0.3-0.5L202.1,108.1z M158.6,89.8c-0.7,0.8-1.2,1.8-1.7,2.6c-9-4.7-19.4-7-30.6-7c-10.5,0-20.4,2-29,6.2c0.6-0.6,1.1-1.2,1.7-1.8c13.7-12.9,31.4-19.5,49.7-18.4c7.3,3.1,14.3,7.2,20.8,12C165.3,84.3,161.5,86.4,158.6,89.8z M126.3,34.6c36.1,0,66.4,25.4,74,59.3c-3.7-5.5-9.8-9.7-15.7-9.7l-1.6,0.2c-30.8-28.7-76-34.9-109.4-28.5C87.3,42.7,105.8,34.6,126.3,34.6z"
                                    />
                                    <path
                                      fill="#000000"
                                      d="M169.2,141.9L169.2,141.9c-2.2,0-4.8-0.5-7.3-1.2c1.4,0.9,2.9,1.6,4.5,2.1l4.6,0.9c0.1,1.3,0.4,2.5,0.9,3.5c1.3,2.7,3.7,4.6,6.5,5.8c0.5-1.1,1-2.2,1.5-3.4c-2.1-0.9-3.8-2.2-4.6-3.9c-0.6-1.3-0.7-3.1-0.6-4.9C172.8,141.4,170.9,141.9,169.2,141.9z"
                                    />
                                    <path
                                      fill="#000000"
                                      d="M165.5,198.6c-0.9,0-2.2-0.2-3.4-1.2c-11.2,15.5-25.3,26.6-35.9,26.6c-10.3,0-24-10.6-35.1-25.6l-0.7,0.1c-2.2,0-4.3-1.2-6.4-3.3c2,3.5,3.6,6.6,4.6,9.5c13,15.1,28.6,24.6,37.5,24.6c10.4,0,29.7-12.7,43.6-32.3C168.4,198,167,198.6,165.5,198.6z"
                                    />
                                    <path
                                      fill="#000000"
                                      d="M65.8,164.5c2.8-1.6,5.9,4.3,9.2,10.3c5.3,9.7,12.9,24.4,17.5,19.5c4.4-4.8-10.3-23.6-16.9-37.7c-2.5-5.3-6.7-14-5.8-19.3c1-5.3,11.9,1.1,17,1.2c5.2,0.1,13.8-3.1,13.7-6.5c-0.1-1.8-9.4-3.6-18.1-6.8c-7.3-2.7-14.1-7-16.1-8.1c-6.9-3.8-12.9-4.4-16.8-5.8c-3.3-1.2-6.9-5-10.6-10.5L10,117.7c3.9,7,6.9,13.7,7.7,18.9c2.6,16.8,9.8,24.6,12.1,31.8c2.6,8.2,14,35,20.1,35.9c6.9,1-11.9-27.6-7-29.5c1.7-0.7,5,7.2,8.7,15.1c5,10.7,12,26.4,15.8,24.7c9.8-4.4-20.8-42.1-14.2-43.1c2.3-0.4,8.5,9.4,13.8,19.3c6,11.1,14.6,26.1,18.8,21.6c3.5-3.8-5.8-17.3-12-27.7C68.2,175.2,63.5,165.8,65.8,164.5z"
                                    />
                                    <path
                                      fill="#000000"
                                      d="M217.1,100.9c-3.8,5.6-7.3,9.4-10.6,10.5c-3.9,1.3-9.8,2-16.8,5.8c-2.1,1.1-8.8,5.4-16.1,8.1c-8.7,3.2-18,5-18.1,6.8c-0.1,3.4,8.5,6.6,13.7,6.5c5.1-0.1,16.1-6.5,17.1-1.2s-3.3,13.9-5.8,19.2c-6.6,14-21.3,32.8-16.9,37.7c4.6,5,12.1-9.8,17.5-19.5c3.3-6,6.4-11.8,9.2-10.3c2.3,1.3-2.4,10.6-7.9,19.9c-6.2,10.5-15.5,23.9-12,27.7c4.1,4.5,12.8-10.5,18.8-21.6c5.3-9.8,11.5-19.6,13.8-19.3c6.5,1-24,38.7-14.2,43.1c3.8,1.7,10.8-14,15.8-24.7c3.7-7.9,7-15.7,8.7-15.1c5,1.9-13.9,30.5-7,29.5c6.1-0.8,17.4-27.7,20-35.9c2.3-7.2,9.5-15,12.1-31.8c0.8-5.2,3.8-11.9,7.7-18.9L217.1,100.9z"
                                    />
                                    <path
                                      fill="#000000"
                                      d="M144.9,144.3c-4.2,2-5.3,6.5-5.5,8.3c-0.3,1.8,3.5,0.7,3.6-0.5c0.1-0.8-0.2-2,1.7-3.8l0.1,1.1c1.5,2.6,4.8,3.5,7.3,2c2.6-1.5,3.4-4.8,2-7.3c4-0.6,8.3-0.7,8.3-0.7S150.5,141.6,144.9,144.3z"
                                    />
                                    <path
                                      fill="#000000"
                                      d="M160.8,150.3c0,0-3.8,1.8-7.1,2.4c-3,0.6-10.5,1-10.5,1s6.4,0.9,9.8,0.9C156.4,154.6,160.8,150.3,160.8,150.3z"
                                    />
                                    <path
                                      fill="#000000"
                                      d="M100.4,151.4c2.6,1.5,5.9,0.6,7.4-2l0-1.1c2,1.8,1.6,3.1,1.7,3.8c0.1,1.1,3.9,2.2,3.6,0.5s-1.3-6.3-5.5-8.3c-5.6-2.7-17.5-1-17.5-1s4.3,0.1,8.3,0.7C96.9,146.6,97.8,149.9,100.4,151.4z"
                                    />
                                    <path
                                      fill="#000000"
                                      d="M109.2,153.7c0,0-7.5-0.3-10.5-1c-3.3-0.7-7.1-2.4-7.1-2.4s4.4,4.3,7.8,4.3C102.9,154.6,109.2,153.7,109.2,153.7z"
                                    />
                                  </g>
                                </g>
                                <g />
                                <g />
                                <g />
                                <g />
                                <g />
                                <g />
                                <g />
                                <g />
                                <g />
                                <g />
                                <g />
                                <g />
                                <g />
                                <g />
                                <g />
                              </g>
                            </g>
                          </svg>
                          <div className="leading-4 flex-1">
                            {formatString.getServiceStockStr(data?.Desc).Service}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="{1.5}"
                            stroke="currentColor"
                            className="w-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                            />
                          </svg>
                          <span className="leading-4 truncate w-[calc(100%-25px)]">{formatString.getServiceStockStr(data?.Desc).Stock}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )
          }

          <div className="px-3 py-3.5 border-t-[10px] bg-gradient-to-b from-white to-app from-10% to-90%">
            <div className="flex justify-between">
              <div className="mb-3.5 font-semibold flex justify-between items-center uppercase text-gold">
                Đánh giá tương tự
              </div>
            </div>
            <div>
              {ReviewsRelate.isLoading && (
                <div className="grid grid-cols-1 gap-3">
                  {
                    Array(1).fill().map((_, index) => (
                      <div className="bg-white border rounded-md p-3 last:mb-0" key={index}>
                        <div className="flex items-center mb-3 gap-3">
                          <div>
                            <div className="flex items-center justify-center w-16 bg-gray-300 overflow-hidden aspect-square rounded-full animate-pulse">
                              <svg
                                className="w-6 text-gray-200"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                                fill="currentColor"
                                viewBox="0 0 640 512"
                              >
                                <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
                              </svg>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="font-medium mb-1">
                              <div className="animate-pulse h-3 bg-gray-200 rounded-full w-2/4"></div>
                            </div>
                            <div className="flex justify-between">
                              <div className="font-light text-xs text-muted flex-1">
                                <div className="w-6/12 animate-pulse h-2 bg-gray-200 rounded-full"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-sm font-light">
                          <div className="animate-pulse h-2 bg-gray-200 rounded-full w-full mb-1.5"></div>
                          <div className="animate-pulse h-2 bg-gray-200 rounded-full mb-1.5"></div>
                          <div className="animate-pulse h-2 bg-gray-200 rounded-full mb-1.5"></div>
                          <div className="animate-pulse h-2 bg-gray-200 rounded-full mb-1.5"></div>
                          <div className="animate-pulse h-2 bg-gray-200 rounded-full mb-1.5"></div>
                          <div className="animate-pulse h-2 bg-gray-200 rounded-full w-4/5"></div>
                        </div>
                      </div>
                    ))
                  }

                </div>
              )}
              {
                !ReviewsRelate.isLoading && (
                  <div className="grid grid-cols-1 gap-3">
                    {ReviewsRelate.data &&
                      ReviewsRelate.data.slice(0, 3).map((item, index) => (

                        <NavLink to={isSame ? `/reviews/${item.id}` : `/reviews/same/${item.id}`} key={index} state={{
                          prevState: state?.prevState || ""
                        }} className="bg-white border p-3 block">

                          <div className="flex items-center mb-3 gap-3">
                            <div className="w-16">
                              <img
                                className="w-16 aspect-square object-cover rounded-full"
                                src={toAbsolutePathAPI(item.photo)}
                              />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium mb-1.5">{item.text}</div>
                              <div className="text-xs text-gray-800">
                                <div className="flex items-end gap-1 mb-[2px]">
                                  <svg
                                    className="w-4"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                    x="0px"
                                    y="0px"
                                    viewBox="0 0 256 256"
                                    enableBackground="new 0 0 256 256"
                                    xmlSpace="preserve"
                                  >

                                    <g>
                                      <g>
                                        <g>
                                          <g>
                                            <path
                                              fill="#000000"
                                              d="M126.3,192.1c1.7,0,6.1-1.7,10.9-1.7c6,0,12.3,1.7,12.3,1.7s-10.5-8.9-14.2-8.9c-3.7,0-9.1,3.5-9.1,3.5s-4.3-3.3-7.3-3.5c-3.1-0.2-15.9,8.9-15.9,8.9s7.7-2,14.4-2C121.2,190.2,124.9,192.1,126.3,192.1z"
                                            />
                                            <path
                                              fill="#000000"
                                              d="M126.3,204.2c14.5,0,23.3-12.1,23.3-12.1s-5.2,3.1-12.8,3.5c-3.2,0.2-6.7-0.4-10.5-0.4c-3.1,0-6.3,0.8-9,0.7c-8.5-0.4-14.3-3.8-14.3-3.8S111.7,204.2,126.3,204.2z"
                                            />
                                            <path
                                              fill="#000000"
                                              d="M50.4,108.2c0.5-15.6,5.7-30.1,14.3-42c18-5.5,41.6-6.7,64.7-1.2c-13.2,2.9-25.5,9.3-35.8,19c-10,9.4-17.3,21.2-20.8,32.9l0,0.1c1.9,1,4.1,2.2,6.5,3.3c9.3-16.6,26.9-27.9,47.2-27.9c10,0,19.4,2.8,27.4,7.6c-0.8,3.4-1,7.1-0.3,10.6l0.7,3.3l-0.6,1.1c-1.9,4.6-1.9,9.7-0.4,14.5c0.7-0.8,1.8-1.4,3.2-2c-0.9-3.4-0.8-7.3,0.7-11.1c3.1-7.5,20.5,0.8,20.5,0.8s-16.5-14.3-20.4-7.4c-2.2-11.9,6.2-25.7,19-22.9c-10.2,9.4,4.9,26.7,4.9,26.7s-5.6-18.9-1.4-23.5c6.2-6.9,20.3,3.7,20.4,13.9c-4.9-0.4-9.5,6-12.1,10.3l0.1-0.1c5.3-2.9,9.9-4,13.6-5c1.4-0.3,2.6-0.7,3.7-1c1.3-0.5,2.9-1.7,4.6-3.6c-3-43.6-39.3-78.2-83.7-78.2c-43,0-78.5,32.5-83.3,74.2C45.8,104.9,48.4,107.4,50.4,108.2z M202.1,108.1l0,0.4l-0.3-0.5L202.1,108.1z M158.6,89.8c-0.7,0.8-1.2,1.8-1.7,2.6c-9-4.7-19.4-7-30.6-7c-10.5,0-20.4,2-29,6.2c0.6-0.6,1.1-1.2,1.7-1.8c13.7-12.9,31.4-19.5,49.7-18.4c7.3,3.1,14.3,7.2,20.8,12C165.3,84.3,161.5,86.4,158.6,89.8z M126.3,34.6c36.1,0,66.4,25.4,74,59.3c-3.7-5.5-9.8-9.7-15.7-9.7l-1.6,0.2c-30.8-28.7-76-34.9-109.4-28.5C87.3,42.7,105.8,34.6,126.3,34.6z"
                                            />
                                            <path
                                              fill="#000000"
                                              d="M169.2,141.9L169.2,141.9c-2.2,0-4.8-0.5-7.3-1.2c1.4,0.9,2.9,1.6,4.5,2.1l4.6,0.9c0.1,1.3,0.4,2.5,0.9,3.5c1.3,2.7,3.7,4.6,6.5,5.8c0.5-1.1,1-2.2,1.5-3.4c-2.1-0.9-3.8-2.2-4.6-3.9c-0.6-1.3-0.7-3.1-0.6-4.9C172.8,141.4,170.9,141.9,169.2,141.9z"
                                            />
                                            <path
                                              fill="#000000"
                                              d="M165.5,198.6c-0.9,0-2.2-0.2-3.4-1.2c-11.2,15.5-25.3,26.6-35.9,26.6c-10.3,0-24-10.6-35.1-25.6l-0.7,0.1c-2.2,0-4.3-1.2-6.4-3.3c2,3.5,3.6,6.6,4.6,9.5c13,15.1,28.6,24.6,37.5,24.6c10.4,0,29.7-12.7,43.6-32.3C168.4,198,167,198.6,165.5,198.6z"
                                            />
                                            <path
                                              fill="#000000"
                                              d="M65.8,164.5c2.8-1.6,5.9,4.3,9.2,10.3c5.3,9.7,12.9,24.4,17.5,19.5c4.4-4.8-10.3-23.6-16.9-37.7c-2.5-5.3-6.7-14-5.8-19.3c1-5.3,11.9,1.1,17,1.2c5.2,0.1,13.8-3.1,13.7-6.5c-0.1-1.8-9.4-3.6-18.1-6.8c-7.3-2.7-14.1-7-16.1-8.1c-6.9-3.8-12.9-4.4-16.8-5.8c-3.3-1.2-6.9-5-10.6-10.5L10,117.7c3.9,7,6.9,13.7,7.7,18.9c2.6,16.8,9.8,24.6,12.1,31.8c2.6,8.2,14,35,20.1,35.9c6.9,1-11.9-27.6-7-29.5c1.7-0.7,5,7.2,8.7,15.1c5,10.7,12,26.4,15.8,24.7c9.8-4.4-20.8-42.1-14.2-43.1c2.3-0.4,8.5,9.4,13.8,19.3c6,11.1,14.6,26.1,18.8,21.6c3.5-3.8-5.8-17.3-12-27.7C68.2,175.2,63.5,165.8,65.8,164.5z"
                                            />
                                            <path
                                              fill="#000000"
                                              d="M217.1,100.9c-3.8,5.6-7.3,9.4-10.6,10.5c-3.9,1.3-9.8,2-16.8,5.8c-2.1,1.1-8.8,5.4-16.1,8.1c-8.7,3.2-18,5-18.1,6.8c-0.1,3.4,8.5,6.6,13.7,6.5c5.1-0.1,16.1-6.5,17.1-1.2s-3.3,13.9-5.8,19.2c-6.6,14-21.3,32.8-16.9,37.7c4.6,5,12.1-9.8,17.5-19.5c3.3-6,6.4-11.8,9.2-10.3c2.3,1.3-2.4,10.6-7.9,19.9c-6.2,10.5-15.5,23.9-12,27.7c4.1,4.5,12.8-10.5,18.8-21.6c5.3-9.8,11.5-19.6,13.8-19.3c6.5,1-24,38.7-14.2,43.1c3.8,1.7,10.8-14,15.8-24.7c3.7-7.9,7-15.7,8.7-15.1c5,1.9-13.9,30.5-7,29.5c6.1-0.8,17.4-27.7,20-35.9c2.3-7.2,9.5-15,12.1-31.8c0.8-5.2,3.8-11.9,7.7-18.9L217.1,100.9z"
                                            />
                                            <path
                                              fill="#000000"
                                              d="M144.9,144.3c-4.2,2-5.3,6.5-5.5,8.3c-0.3,1.8,3.5,0.7,3.6-0.5c0.1-0.8-0.2-2,1.7-3.8l0.1,1.1c1.5,2.6,4.8,3.5,7.3,2c2.6-1.5,3.4-4.8,2-7.3c4-0.6,8.3-0.7,8.3-0.7S150.5,141.6,144.9,144.3z"
                                            />
                                            <path
                                              fill="#000000"
                                              d="M160.8,150.3c0,0-3.8,1.8-7.1,2.4c-3,0.6-10.5,1-10.5,1s6.4,0.9,9.8,0.9C156.4,154.6,160.8,150.3,160.8,150.3z"
                                            />
                                            <path
                                              fill="#000000"
                                              d="M100.4,151.4c2.6,1.5,5.9,0.6,7.4-2l0-1.1c2,1.8,1.6,3.1,1.7,3.8c0.1,1.1,3.9,2.2,3.6,0.5s-1.3-6.3-5.5-8.3c-5.6-2.7-17.5-1-17.5-1s4.3,0.1,8.3,0.7C96.9,146.6,97.8,149.9,100.4,151.4z"
                                            />
                                            <path
                                              fill="#000000"
                                              d="M109.2,153.7c0,0-7.5-0.3-10.5-1c-3.3-0.7-7.1-2.4-7.1-2.4s4.4,4.3,7.8,4.3C102.9,154.6,109.2,153.7,109.2,153.7z"
                                            />
                                          </g>
                                        </g>
                                        <g />
                                        <g />
                                        <g />
                                        <g />
                                        <g />
                                        <g />
                                        <g />
                                        <g />
                                        <g />
                                        <g />
                                        <g />
                                        <g />
                                        <g />
                                        <g />
                                        <g />
                                      </g>
                                    </g>
                                  </svg>
                                  <div className="leading-4 flex-1">
                                    {formatString.getServiceStockStr(item?.source?.Desc).Service}
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="{1.5}"
                                    stroke="currentColor"
                                    className="w-4"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                                    />
                                  </svg>
                                  <span className="leading-4 truncate w-[calc(100%-25px)]">{formatString.getServiceStockStr(item?.source?.Desc).Stock}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <HTMLEllipsis
                            className="text-sm font-light min-h-[140px]"
                            unsafeHTML={item.source.Content || "Đang cập nhập"}
                            maxLine="7"
                            ellipsis="..."
                            ellipsisHTML="<i class='text-primary'>... xem thêm</i>"
                            basedOn="letters"
                          />
                        </NavLink>
                      ))}
                  </div>
                )
              }

            </div>
          </div>
        </div>
      </PullToRefresh>
    </Page >
  );
};

export default ReviewsDetailPage;
