import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import PullToRefresh from "react-simple-pull-to-refresh";
import { Pagination } from "swiper";
import { SwiperSlide, Swiper } from "swiper/react";
import { openPhone } from "zmp-sdk";
import { Icon, Page, useNavigate, Text } from "zmp-ui";
import ProdsAPI from "../../api/prods.api";
import { ImageLazy } from "../../components/ImagesLazy";
import { useLayout } from "../../layout/LayoutProvider";
import { toAbsolutePath } from "../../utils/assetPath";
import { formatArray } from "../../utils/formatArray";
import { formatString } from "../../utils/formatString";

const CataloguePage = () => {
  const navigate = useNavigate();
  let { state } = useLocation();
  const { CurrentStocks, GlobalConfig } = useLayout();

  const [filters, setFilters] = useState({
    Key: "",
  });

  const scrollContainerRef = useRef(null);

  const ServiceHot = useQuery({
    queryKey: ["ServicesHot"],
    queryFn: async () => {
      let { data } = await ProdsAPI.roots({
        Ps: 2,
        StockID: CurrentStocks?.ID || "",
        Status: "2"
      });
      return data?.lst || [];
    },
  });

  const {
    data,
    fetchNextPage,
    isLoading,
    hasNextPage,
    refetch,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["ServicesLists", filters],
    queryFn: async ({ pageParam = 1 }) => {
      const newQueryParams = {
        Pi: pageParam,
        Ps: 10,
        StockID: CurrentStocks?.ID || "",
        Key: filters.Key,
      };
      const { data } = await ProdsAPI.roots(newQueryParams);
      return data || null;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.pi === lastPage.pcount || !lastPage.pcount
        ? undefined
        : lastPage.pi + 1;
    },
  });

  const Lists = formatArray.useInfiniteQuery(data?.pages, "lst");

  const handleScroll = () => {
    if (isFetchingNextPage) return;
    if (scrollContainerRef.current && hasNextPage) {
      const { scrollTop, scrollHeight, clientHeight } =
        scrollContainerRef.current;
      // Add a small tolerance, e.g., 5 pixels
      if (scrollTop + clientHeight >= scrollHeight - 5) {
        fetchNextPage();
        // Trigger load more data or other bottom-reached logic here
      }
    }
  };

  return (
    <Page className="page !h-full !overflow-hidden flex flex-col" hideScrollbar>
      <div className="navbar fixed top-0 left-0 min-w-[100vw] max-w-[100vw] z-[999] bg-app text-white">
        <div className="w-2/3 relative flex items-center h-full pl-10">
          <div
            className="absolute left-0 w-10 h-full flex justify-center items-center cursor-pointer"
            onClick={() =>
              state?.prevState ? navigate(state?.prevState) : navigate("/")
            }
          >
            <Icon icon="zi-chevron-left-header" />
          </div>
          <Text.Title>Dịch vụ</Text.Title>
        </div>
      </div>
      <div className="p-3">
        <div className="relative">
          <input
            className="border border-[#e4eaed] w-full rounded-lg h-12 outline-none pl-12 focus:border-primary"
            type="text"
            name=""
            value={filters.Key}
            placeholder="Tìm kiếm dịch vụ"
            onChange={(e) =>
              setFilters((prevState) => ({
                ...prevState,
                Key: e.target.value,
              }))
            }
          />
          <div className="absolute w-12 h-12 top-0 left-0 flex items-center justify-center pointer-events-none text-muted">
            <Icon icon="zi-search" />
          </div>
          {isLoading && (
            <div className="absolute w-12 h-12 top-0 right-0 flex items-center justify-center">
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="w-6 text-gray-200 animate-spin fill-primary"
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
        </div>
      </div>
      <PullToRefresh
        className="ezs-ptr ezs-ptr-safe grow"
        onRefresh={async () => {
          await ServiceHot.refetch();
          await refetch();
        }}
      >
        <div
          className="h-full overflow-auto no-scrollbar"
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
          <div className="px-3 py-3.5">
            <div className="text-center uppercase mb-3.5 font-bold text-lg text-app">
              Dịch vụ nổi bật
            </div>
            <div className="border-white border-[5px] rounded-md bg-white">
              {ServiceHot.isLoading && (
                <div>
                  <div className="aspect-square rounded-md overflow-hidden">
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
                  <div className="px-3 pt-3.5 text-center flex flex-col justify-center items-center">
                    <div className="animate-pulse h-3 bg-gray-200 rounded-full w-2/4 mb-2.5"></div>
                    <div className="animate-pulse h-2 bg-gray-200 rounded-full mb-1.5 w-full"></div>
                    <div className="animate-pulse h-2 bg-gray-200 rounded-full mb-1.5 w-full"></div>
                  </div>
                </div>
              )}

              <Swiper
                spaceBetween={10}
                autoplay={{
                  delay: 6000,
                  disableOnInteraction: false,
                }}
                pagination={{
                  el: "#containerDots",
                  type: "bullets",
                  bulletClass:
                    "w-2 h-1 rounded-full bg-gray-400 transition-all",
                  bulletActiveClass: "!bg-app !w-5",
                  clickable: true,
                }}
                modules={[Pagination]}
                slidesPerView="auto"
              >
                {ServiceHot.data &&
                  ServiceHot.data.slice(0, 6).map((item, index) => (
                    <SwiperSlide key={index}>
                      <NavLink
                        to={`/catalogue/service/${item.ID}`}
                        className="bg-white block"
                      >
                        <div>
                          <ImageLazy
                            wrapperClassName="!block aspect-square"
                            className="object-cover w-full h-full rounded-md"
                            effect="blur"
                            src={toAbsolutePath(item.Thumbnail)}
                          />
                        </div>
                        <div className="px-3 pt-3.5 text-center">
                          <div className="line-clamp-2 text-sm uppercase font-semibold">
                            {item.Title}
                          </div>
                          <div className="mt-1.5 pb-1.5">
                            <div className="text-danger font-semibold text-sm">
                              {item?.PriceBase ? formatString.formatVND(item?.PriceBase) : "Tư vấn thêm"}
                            </div>
                            <div className="text-muted mt-1 empty:hidden" dangerouslySetInnerHTML={{ __html: item?.Desc }}>
                            </div>
                          </div>
                        </div>
                      </NavLink>
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>
            <div className="flex justify-center mt-3.5">
              <div
                className="bottom-0 flex !w-auto gap-1 rounded-[15px] px-1.5 py-1"
                id="containerDots"
              ></div>
            </div>
          </div>
          <div className="p-3">
            <div className="text-center uppercase mb-3.5 font-bold text-lg text-app">
              Dịch vụ
            </div>
            <div className="grid grid-cols-2 gap-3.5">
              {isLoading && (
                <>
                  {Array(4)
                    .fill()
                    .map((_, index) => (
                      <div
                        className="border-white border-[5px] rounded-md bg-white"
                        key={index}
                      >
                        <div>
                          <div className="aspect-square rounded-md overflow-hidden">
                            <div className="flex items-center justify-center w-full h-full bg-gray-300 animate-pulse">
                              <svg
                                className="w-8 text-gray-200"
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
                        <div className="text-center font-medium pt-2 pb-1 text-sm line-clamp-2 flex justify-center items-center flex-col">
                          <div className="animate-pulse h-3 bg-gray-200 rounded-full w-2/4"></div>
                        </div>
                      </div>
                    ))}
                </>
              )}
              {Lists &&
                Lists.map((item, index) => (
                  <NavLink
                    to={`/catalogue/service/${item.ID}`}
                    className="border-white border-[5px] rounded-md bg-white"
                    key={index}
                  >
                    <div>
                      <ImageLazy
                        wrapperClassName="!block aspect-square"
                        className="object-cover w-full h-full rounded-md"
                        effect="blur"
                        src={toAbsolutePath(item.Thumbnail)}
                      />
                    </div>
                    <div className="text-center font-medium pt-2 pb-1 text-sm line-clamp-2 min-h-[52px] uppercase">
                      {item.Title}
                    </div>
                    <div className="text-danger font-semibold text-center text-sm">
                      {item?.PriceBase ? formatString.formatVND(item?.PriceBase) : "Tư vấn thêm"}
                    </div>
                  </NavLink>
                ))}

              {(!Lists || Lists.length === 0) && (
                <div className="h-full flex justify-center items-center flex-col col-span-2 mt-5">
                  <svg
                    className="w-14"
                    viewBox="0 0 64 64"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="currentColor"
                  >
                    <g fill="none" fillRule="evenodd">
                      <path fill="#FBD74C" d="M27 11h16v34H27z" />
                      <path
                        d="M28.5 4C42.031 4 53 14.969 53 28.5a24.413 24.413 0 01-6.508 16.63c.041.022.082.05.12.08l.095.083 14 14a1 1 0 01-1.32 1.497l-.094-.083-14-14a1 1 0 01-.164-.216A24.404 24.404 0 0128.5 53C14.969 53 4 42.031 4 28.5S14.969 4 28.5 4zm0 2C16.074 6 6 16.074 6 28.5S16.074 51 28.5 51 51 40.926 51 28.5 40.926 6 28.5 6zM39 14a1 1 0 011 1v26a1 1 0 01-1 1H17a1 1 0 01-1-1V15a1 1 0 011-1zm-1 2H18v24h20V16zm-3 16a1 1 0 01.117 1.993L35 34H21a1 1 0 01-.117-1.993L21 32h14zm0-12a1 1 0 011 1v7a1 1 0 01-1 1H21a1 1 0 01-1-1v-7a1 1 0 011-1zm-1 2H22v5h12v-5z"
                        fill="#101928"
                        fillRule="nonzero"
                      />
                    </g>
                  </svg>
                  <div className="font-bold text-lg mb-px mt-3">
                    "Hổng" có dữ liệu !
                  </div>
                  <div>Thử thay đổi từ khoá khác xem có gì mới ? ...</div>
                </div>
              )}

              {isFetchingNextPage && (
                <div className="flex items-center justify-center col-span-2">
                  <div className="lds-ellipsis">
                    <div className="!bg-app"></div>
                    <div className="!bg-app"></div>
                    <div className="!bg-app"></div>
                    <div className="!bg-app"></div>
                  </div>
                </div>
              )}

              {
                !hasNextPage && (
                  <div className="col-span-2 mt-1 bg-white px-3 py-3.5 rounded-lg">
                    <div className="text-center mb-2.5 font-medium">Liên hệ với chúng tôi để nhận tư vấn</div>
                    <button
                      disabled={isLoading}
                      onClick={async () => {
                        await openPhone({
                          phoneNumber: GlobalConfig?.ZALO?.Tel || "0335561368",
                        });
                      }}
                      type="button"
                      className="bg-app py-3.5 h-12 w-full text-center rounded-3xl text-white font-medium flex justify-center items-center gap-2 cursor-pointer disabled:opacity-60 relative"
                    >

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
                          d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                        />
                      </svg>
                      Liên hệ ngay
                    </button>
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </PullToRefresh>
    </Page>
  );
};
export default CataloguePage;
