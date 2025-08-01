import { useQuery } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { Icon, Page, Text, useNavigate } from "zmp-ui";
import { Swiper, SwiperSlide } from "swiper/react";
import AdvAPI from "../../api/adv.api";
import clsx from "clsx";
import { openWebview } from "zmp-sdk";
import { ImageLazy } from "../../components/ImagesLazy";
import { toAbsolutePath } from "../../utils/assetPath";
import { useSearchParams } from "react-router-dom";

const CustomerBranch = () => {
  const navigate = useNavigate();
  let [CrStock, setCrStock] = useState(null);
  let [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();

  let CrIndex = searchParams.get("index") ? Number(searchParams.get("index")) : 0

  let swiperRef = useRef(null);

  const { data, isLoading } = useQuery({
    queryKey: ["CustomerBranch", CrIndex],
    queryFn: async () => {
      const { data } = await AdvAPI.getAdvName("ZALO.HETHONGCUAHANG");
      return data?.data && data?.data.length > 0
        ? data?.data.map((item) => {
          let obj = { ...item };
          if (item.FileName2) {
            let TimeSplit = item.FileName2.split("-");
            if (TimeSplit.length > 1) {
              obj.TimeOpen = TimeSplit[0];
              obj.TimeClose = TimeSplit[1];
            }
          }
          return obj;
        })
        : [];
    },
    onSuccess: (rs) => {
      if (rs && rs.length > 0) {
        setCrStock(rs[CrIndex]);
      }
    },
  });

  const openMaps = (item) => {
    openWebview({
      url: `https://www.google.com/maps/dir/?api=1&destination=${item?.Desc.split(
        " ",
      ).join("+")}`,
    });
  };

  return (
    <Page className="page" hideScrollbar>
      <div className="navbar fixed top-0 left-0 min-w-[100vw] max-w-[100vw] z-[999] bg-app text-white">
        <div className="w-2/3 relative flex items-center h-full pl-10">
          <div
            className="absolute left-0 w-10 h-full flex justify-center items-center cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <Icon icon="zi-chevron-left-header" />
          </div>
          <Text.Title>Hệ thống chi nhánh</Text.Title>
        </div>
      </div>
      <div className="h-full relative">
        <div className="h-full">
          <div
            className={clsx(
              "absolute w-full h-full flex items-center justify-center bg-white/60",
              !loading && "opacity-0 invisible",
            )}
          >
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-12 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
          <iframe
            className={clsx(
              "h-full w-full border-0",
              !CrStock?.Link && "opacity-0",
            )}
            src={CrStock?.Link}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={() => {
              setLoading(false);
            }}
          />
        </div>
        <div className="absolute bottom-0 left-0 w-full z-10">
          <div className="py-3">
            {isLoading && (
              <div className="px-4">
                <div className="cursor-pointer flex relative bg-white border rounded-lg overflow-hidden min-h-[100px]">
                  <div className="images bd-rd3 aspect-[5/7] w-[80px]">
                    <div className="animate-pulse aspect-[5/7] rounded-lg overflow-hidden">
                      <div className="flex items-center justify-center w-full h-full bg-gray-300">
                        <svg
                          className="w-10 text-gray-200"
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
                  <div className="p-3 flex-1">
                    <div className="font-medium line-clamp-1 mb-2">
                      <div className="h-3.5 bg-gray-200 rounded-full w-full animate-pulse"></div>
                    </div>
                    <div>
                      <div className="h-2 bg-gray-200 rounded-full w-full mb-1 last:mb-0 animate-pulse"></div>
                      <div className="h-2 bg-gray-200 rounded-full w-2/4 mb-1 last:mb-0 animate-pulse"></div>
                      <div className="h-2 bg-gray-200 rounded-full w-full mb-1 last:mb-0 animate-pulse"></div>
                      <div className="h-2 bg-gray-200 rounded-full w-2/4 mb-1 last:mb-0 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <Swiper
              ref={swiperRef}
              spaceBetween={10}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              onActiveIndexChange={(swiperCore) => {
                if (data) {
                  setCrStock(data[swiperCore.activeIndex]);
                }
                setLoading(true);
              }}
              slidesPerView="auto"
              centeredSlides={true}
              initialSlide={CrIndex}
            >
              {data &&
                data.map((maps, index) => (
                  <SwiperSlide style={{ width: "90%" }} key={index}>
                    <div
                      className="bg-white rounded-lg h-full flex relative overflow-hidden"
                      onClick={() => {
                        setCrStock(maps);
                        swiperRef?.current?.swiper?.slideTo(index);
                      }}
                    >
                      <div className="images bd-rd3 w-[100px]">
                        <ImageLazy
                          wrapperClassName="!block h-full"
                          className="w-full object-cover h-full rounded-lg"
                          effect="blur"
                          src={toAbsolutePath(maps?.FileName)}
                        />
                      </div>
                      <div className="flex-1 p-3">
                        <div className="font-semibold mb-1 flex items-center">
                          {maps?.Title}
                        </div>
                        <div>
                          <div
                            className="text-sm text-muted font-medium"
                            dangerouslySetInnerHTML={{
                              __html: maps?.Desc || "Chưa xác định",
                            }}
                          ></div>
                          <div className="flex gap-1.5 mt-1.5">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-5 text-muted"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                              />
                            </svg>
                            <div className="bg-app text-white text-sm px-2 py-px rounded">
                              {maps?.TimeOpen}
                            </div>
                            <div>-</div>
                            <div className="bg-app text-white text-sm px-2 py-px rounded">
                              {maps?.TimeClose}
                            </div>
                          </div>
                          {/* <div className="flex items-center">
                          <PhoneIcon className="w-3.5 text-muted" />
                          <div
                            className="text-[13px] pl-1.5 flex-1"
                            dangerouslySetInnerHTML={{
                              __html: maps?.LinkSEO || "Chưa xác định",
                            }}
                          ></div>
                        </div> */}
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default CustomerBranch;
