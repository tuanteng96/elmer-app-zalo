import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper";
import { useQuery } from "@tanstack/react-query";
import { ImageLazy } from "../../../components/ImagesLazy";
import { toAbsolutePathAPI } from "../../../utils/assetPath";
import { NavLinkAdv } from "../../../components/NavLinkAdv";
import { useLayout } from "../../../layout/LayoutProvider";
import ProdsAPI from "../../../api/prods.api";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const SalesBanner = () => {
  let { GlobalConfig, CurrentStocks, AccessToken } = useLayout();

  const { data, isLoading } = useQuery({
    queryKey: ["AdvServiceHot", { CurrentStocks, AccessToken }],
    queryFn: async () => {
      const { data } = await ProdsAPI.getServiceOriginal({
        Token: AccessToken,
        StockID: CurrentStocks?.ID,
      });
      let result = data.data;
      let stockid = CurrentStocks?.ID || 0;
      let newData = [];

      if (result) {
        if (stockid > 0) {
          newData = result.filter((item) => {
            const arrayStatus = item?.root?.Status
              ? item.root.Status.split(",")
              : [];
            return (
              (item.root.OnStocks.indexOf("*") > -1 ||
                item.root.OnStocks.indexOf(stockid) > -1) &&
              item.root.IsRootPublic &&
              arrayStatus.indexOf("2") > -1
            );
          });
        } else {
          newData = result.filter((item) => {
            const arrayStatus = item?.root?.Status
              ? item.root.Status.split(",")
              : [];
            return (
              item.root.OnStocks &&
              item.root.IsRootPublic &&
              arrayStatus.indexOf("2") > -1
            );
          });
        }
      }
      return newData || [];
    },
  });

  if (isLoading)
    return (
      <div className="bg-white">
        <div className="px-3 pt-3">
          <div className="animate-pulse h-[90px] rounded">
            <div className="flex items-center justify-center w-full h-full bg-gray-300">
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
      </div>
    );

  if (!data || data.length === 0) return <></>;

  return (
    <div className="bg-white">
      <div className="px-3 pt-3">
        <Swiper
          modules={[Autoplay]}
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          slidesPerView={"auto"}
          loop={true}
          spaceBetween={16}
        >
          {data &&
            data.map((item, index) => (
              <SwiperSlide className="w-[75%]" key={index}>
                <Link
                  className="cursor-pointer block relative bg-white p-4 border rounded"
                  data={item}
                  to={`/catalogue/service/${item.root?.ID}`}
                >
                  <div className="images bd-rd3">
                    <ImageLazy
                      wrapperClassName="!block"
                      className="w-full object-cover rounded-sm"
                      effect="blur"
                      src={toAbsolutePathAPI(item.root.Thumbnail_web)}
                    />
                  </div>
                  <div className="pt-4">
                    <div className="font-medium text-base line-clamp-1 mb-1">
                      {item.root.Title}
                    </div>
                    <div
                      className="line-clamp-2 text-sm text-gray-800"
                      dangerouslySetInnerHTML={{
                        __html: item.root.Desc,
                      }}
                    ></div>
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center">
                        <CalendarDaysIcon className="w-5 text-warning" />

                        <span className="text-sm text-gray-700 pl-2">
                          Xem chi tiết
                        </span>
                      </div>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="#999"
                        style={{
                          width: "18px",
                        }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
};

const SalesServiceHot = () => {
  return <SalesBanner />;
};

export { SalesServiceHot };
