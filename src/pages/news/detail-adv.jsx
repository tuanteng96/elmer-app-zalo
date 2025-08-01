import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import React, { useState } from "react";
import { useLocation, useParams } from "react-router";
import PullToRefresh from "react-simple-pull-to-refresh";
import { Icon, Page, Text, useNavigate } from "zmp-ui";
import AdvAPI from "../../api/adv.api";
import { HtmlParser } from "../../components/HtmlParser";
import { ImageLazy } from "../../components/ImagesLazy";
import { toAbsolutePath } from "../../utils/assetPath";

const AdvDetailPage = () => {
  const [scrollTop, setScrollTop] = useState(0);
  const navigate = useNavigate();
  const { state } = useLocation();
  let { id } = useParams();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["AdvDetail"],
    queryFn: async () => {
      const { data } = await AdvAPI.getAdvId(id);
      return data?.data[0] || [];
    },
    initialData: state?.dataProps,
    enabled: !state?.dataProps && Number(id) > -1,
    cacheTime: state?.dataProps ? 0 : 5 * 60 * 1000,
  });

  const handleScroll = (event) => {
    setScrollTop(event.currentTarget.scrollTop);
  };

  if (isLoading) {
    return (
      <Page
        className="page !py-0 bg-white animate-pulse"
        hideScrollbar
        onScroll={handleScroll}
      >
        <div
          className={clsx(
            "navbar fixed top-0 left-0 min-w-[100vw] max-w-[100vw] z-[999] transition px-3",
          )}
        >
          <div className="w-2/3 relative flex items-center h-full pl-12">
            <div
              className="absolute left-0 w-11 rounded-full h-11 flex justify-center items-center cursor-pointer bg-white"
              onClick={() => navigate(-1)}
            >
              <Icon icon="zi-chevron-left-header" className="text-app" />
            </div>
          </div>
        </div>
        <div className="pb-safe">
          <div className="relative">
            <div className="aspect-square">
              <div className="flex items-center justify-center w-full h-full bg-gray-300">
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
            <div className="absolute left-0 bottom-0 w-full h-3/6 bg-pattern"></div>
          </div>
          <div className="-mt-5 relative bg-white rounded-t-3xl p-5 leading-6">
            <div className="h-2.5 bg-gray-200 rounded-full w-full mb-2"></div>
            <div className="h-2.5 bg-gray-200 rounded-full w-2/4 mb-5"></div>
            {Array(5)
              .fill()
              .map((_, index) => (
                <div
                  className="h-2.5 bg-gray-200 rounded-full w-full mb-2"
                  key={index}
                ></div>
              ))}
          </div>
        </div>
      </Page>
    );
  }

  return (
    <Page className="page !py-0 bg-white" hideScrollbar>
      <div
        className={clsx(
          "navbar fixed top-0 left-0 min-w-[100vw] max-w-[100vw] z-[999] transition px-3",
          scrollTop > 50 && "shadow-3xl",
        )}
        style={{
          background: `rgba(255,255,255,${
            scrollTop <= 100 ? scrollTop / 100 : scrollTop
          })`,
        }}
      >
        <div className="w-2/3 relative flex items-center h-full pl-12">
          <div
            className="absolute left-0 w-11 rounded-full h-11 flex justify-center items-center cursor-pointer bg-white"
            onClick={() => navigate(-1)}
          >
            <Icon icon="zi-chevron-left-header" className="text-app" />
          </div>
          <Text.Title
            className={clsx(
              "text-app truncate transition",
              scrollTop > 100 ? "opacity-100" : "opacity-0",
            )}
          >
            {data?.source?.Title || data?.Title}
          </Text.Title>
        </div>
      </div>
      <PullToRefresh className="ezs-ptr ezs-ptr-safe" onRefresh={refetch}>
        <div className="pb-safe h-full">
          <div
            className="h-full overflow-auto no-scrollbar"
            onScroll={handleScroll}
          >
            <div className="relative">
              <ImageLazy
                wrapperClassName="aspect-square !block"
                className="w-full aspect-square object-cover"
                effect="blur"
                src={toAbsolutePath(
                  data?.Thumbnail || data?.source?.Thumbnail || data?.FileName,
                )}
              />
              <div className="absolute left-0 bottom-0 w-full h-3/6 bg-pattern"></div>
              <div className="absolute bottom-5 p-5 text-white text-lg font-bold uppercase">
                {data?.source?.Title || data?.Title}
              </div>
            </div>
            <div className="-mt-5 relative bg-white rounded-t-3xl p-5 leading-6">
              <HtmlParser>
                {data?.source?.Desc || data?.Desc}
                {data?.source?.Content || data?.Content}
              </HtmlParser>
            </div>
          </div>
        </div>
      </PullToRefresh>
    </Page>
  );
};

export default AdvDetailPage;
