import React, { useState } from "react";
import { Icon, Page } from "zmp-ui";
import PullToRefresh from "react-simple-pull-to-refresh";
import { Banner } from "./components/banner";
import { News } from "./components/news";
import { useQueryClient } from "@tanstack/react-query";
import { SalesServiceOutstanding } from "./components/sale-service-outstanding";
import { CustomerReviews } from "./components/customer-reviews";
import { HomeStocks } from "./components/home-stocks";
import Logo from "../../static/images/logo.png";
import { Follow } from "./components/follow";
import { EventAction } from "./components/event-action";
import { favoriteApp, openPhone } from "zmp-sdk";
import Draggable from "react-draggable";
import { useLayout } from "../../layout/LayoutProvider";

const HomePage = () => {
  const queryClient = useQueryClient();

  let { GlobalConfig } = useLayout();

  const handleRefresh = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["AdvBannerTop"] }),
      queryClient.invalidateQueries({ queryKey: ["EventAction"] }),
      queryClient.invalidateQueries({ queryKey: ["AdvServiceHot"] }),
      queryClient.invalidateQueries({ queryKey: ["HomeStocks"] }),
      queryClient.invalidateQueries({ queryKey: ["CustomerReviewsSliders"] }),
      queryClient.invalidateQueries({ queryKey: ["NewsHot"] }),
    ]);

  return (
    <Page className="page !pt-0" hideScrollbar>
      <PullToRefresh className="ezs-ptr ezs-ptr-safe" onRefresh={handleRefresh}>
        <div className="h-full overflow-auto no-scrollbar">
          <div className="pt-safe bg-[#f5f5fa] relative after:content-[''] after:absolute after:h-[100%] after:w-full after:top-0 after:left-0 after:-z-[1] after:bg-gradient-to-b z-10 from-app from-50%">
            <div className="px-3 mb-2">
              <img className="w-14" src={Logo} />
            </div>
            <div className="px-3">
              <Banner />
            </div>
          </div>
          <EventAction />
          <Follow />
          <SalesServiceOutstanding />
          <HomeStocks />
          <div className="bg-gradient-to-b from-white to-app from-10% to-90%">
            <CustomerReviews />
            <News />
          </div>
          <Draggable handle=".handle">
            <div className="fixed bottom-[60px] z-50 right-3 pb-safe-bottom">
              <div className="flex flex-col w-11 rounded-[25px] h-[120px] bg-white border-gold border-[2px] shadow-2xl overflow-hidden">
                <div className="grow flex items-center justify-center text-gray-700 handle">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.05 4.575a1.575 1.575 0 1 0-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 0 1 3.15 0v1.5m-3.15 0 .075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 0 1 3.15 0V15M6.9 7.575a1.575 1.575 0 1 0-3.15 0v8.175a6.75 6.75 0 0 0 6.75 6.75h2.018a5.25 5.25 0 0 0 3.712-1.538l1.732-1.732a5.25 5.25 0 0 0 1.538-3.712l.003-2.024a.668.668 0 0 1 .198-.471 1.575 1.575 0 1 0-2.228-2.228 3.818 3.818 0 0 0-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0 1 16.35 15m.002 0h-.002"
                    />
                  </svg>

                </div>
                <div className="grow flex items-center justify-center text-app after:content-[''] after:absolute after:w-[25px] after:h-[1px] after:bg-gray-400 after:top-0 relative" onClick={async () => {
                  await openPhone({
                    phoneNumber: GlobalConfig?.ZALO?.Tel || "0335561368",
                  });
                }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15 3.75a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0V5.56l-4.72 4.72a.75.75 0 1 1-1.06-1.06l4.72-4.72h-2.69a.75.75 0 0 1-.75-.75Z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
                      clipRule="evenodd"
                    />
                  </svg>

                </div>
                <div className="grow flex items-center justify-center after:content-[''] after:absolute after:w-[25px] after:h-[1px] after:bg-gray-400 after:top-0 relative text-warning" onClick={async () => {
                  await favoriteApp();
                }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="{1.5}"
                    stroke="currentColor"
                    className="w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                    />
                  </svg>

                </div>
              </div>
            </div>
          </Draggable>
        </div>
      </PullToRefresh>
    </Page >
  );
};

export default HomePage;
