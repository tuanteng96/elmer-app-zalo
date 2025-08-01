import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import PullToRefresh from "react-simple-pull-to-refresh";
import { Icon, Page, Text, useNavigate } from "zmp-ui";
import NewsAPI from "../../api/news.api";
import { ImageLazy } from "../../components/ImagesLazy";
import { toAbsolutePath } from "../../utils/assetPath";
import { useLayout } from "../../layout/LayoutProvider";

const LibraryPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  let { GlobalConfig } = useLayout();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["LibraryList"],
    queryFn: async () => {
      const { data } = await NewsAPI.getListToID("11384");

      return data?.data
        ? data?.data.map((x) => ({
          ...x,
        }))
        : [];
    },
    initialData: state?.dataProps,
    enabled: !state?.dataProps,
  });

  return (
    <Page className="page !pb-0" hideScrollbar>
      <div className="navbar fixed top-0 left-0 min-w-[100vw] max-w-[100vw] z-[999] bg-app shadow-3xl text-white">
        <div className="w-2/3 relative flex items-center h-full pl-10">
          <div
            className="absolute left-0 w-10 h-full flex justify-center items-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            <Icon icon="zi-chevron-left-header" />
          </div>
          <Text.Title>
            Thư hiện hình ảnh
          </Text.Title>
        </div>
      </div>
      <div className="h-full flex flex-col pb-safe-bottom">
        <PullToRefresh className="ezs-ptr ezs-ptr-safe grow" onRefresh={refetch}>
          <div className="h-full overflow-auto no-scrollbar pb-safe-bottom">
            <div className="px-3 py-3.5 grid grid-cols-2 gap-3">
              {isLoading &&
                Array(2)
                  .fill()
                  .map((_, index) => (
                    <div
                      className="bg-white shadow-3xl border-[5px] border-white flex flex-col rounded overflow-hidden"
                      key={index}
                    >
                      <div>
                        <div className="aspect-square rounded">
                          <div className="flex items-center justify-center w-full h-full bg-gray-300 animate-pulse">
                            <svg
                              className="w-12 h-12 text-gray-200"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                              fill="currentColor"
                              viewBox="0 0 640 512"
                            >
                              <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 p-3">
                        <div className="animate-pulse h-3 bg-gray-200 rounded-full w-full mb-2.5"></div>
                        <div className="animate-pulse h-2 bg-gray-200 rounded-full mb-1.5"></div>
                        <div className="animate-pulse h-2 bg-gray-200 rounded-full mb-1.5"></div>
                        <div className="animate-pulse h-2 bg-gray-200 rounded-full w-4/5"></div>
                      </div>
                    </div>
                  ))}
              {!isLoading && (
                <>
                  {data && data.map((item, index) => (
                    <NavLink
                      to={"/library/" + item.id}
                      state={{ dataProps: item }}
                      className="bg-white shadow-3xl flex flex-col rounded overflow-hidden"
                      key={index}
                    >
                      <div className="border-[5px] border-white">
                        <ImageLazy
                          wrapperClassName="aspect-square !block"
                          className="w-full aspect-square object-cover rounded"
                          effect="blur"
                          src={toAbsolutePath(item.source.Thumbnail)}
                        />
                      </div>
                      <div className="line-clamp-4 font-medium text-center p-3 uppercase leading-5">
                        {item.text}
                      </div>
                    </NavLink>
                  ))}
                </>
              )}
            </div>
          </div>
        </PullToRefresh>
        <div className="p-3">
          <button
            disabled={isLoading}
            onClick={() => {
              openChat({
                type: GlobalConfig?.ZALO?.type,
                id: GlobalConfig?.ZALO?.ID,
                message: `Xin chào? Mình cần tư vấn về dịch vụ ?`,
              });
            }}
            type="button"
            className="bg-app py-3.5 min-h-[52px] w-full text-center rounded-3xl text-white font-medium flex justify-center items-center gap-2 cursor-pointer disabled:opacity-60 relative"
          >
            {isLoading && (
              <div className="absolute w-12 h-12 top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 flex items-center justify-center">
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="w-7 text-gray-200 animate-spin fill-primary"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            )}
            {!isLoading && (
              <>
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

                Tư vấn ngay
              </>
            )}
          </button>
        </div>
      </div>
    </Page>
  );
};
export default LibraryPage;
