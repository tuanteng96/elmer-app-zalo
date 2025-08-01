import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper";
import { useQuery } from "@tanstack/react-query";
import { ImageLazy } from "../../../components/ImagesLazy";
import { toAbsolutePathAPI } from "../../../utils/assetPath";
import { useLayout } from "../../../layout/LayoutProvider";
import ProdsAPI from "../../../api/prods.api";
import { Link } from "react-router-dom";
import { formatString } from "../../../utils/formatString";

const SalesBanner = () => {
  let { CurrentStocks, AccessToken } = useLayout();

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
              item.root.IsRootPublic
            );
          });
        } else {
          newData = result.filter((item) => {
            const arrayStatus = item?.root?.Status
              ? item.root.Status.split(",")
              : [];
            return (
              item.root.OnStocks &&
              item.root.IsRootPublic
            );
          });
        }
      }
      return newData.map((item) => ({
        ...item,
        Position: item.root.Status.indexOf("2") > -1 ? 0 : 1
      })).sort((a, b) => a.Position - b.Position) || [];
    },
  });

  if (isLoading)
    return (
      <div className="bg-white px-3 py-3.5">
        <div className="flex justify-between mb-3.5">
          <div className="font-semibold text-gold">
            <span className="uppercase">Dịch vụ</span> nổi bật
          </div>
          <Link className="text-gold text-sm">Xem thêm</Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {Array(2)
            .fill()
            .map((_, index) => (
              <div
                className="cursor-pointer block relative bg-white border border-gray-300 rounded p-3"
                key={index}
              >
                <div className="images bd-rd3">
                  <div className="animate-pulse aspect-square rounded">
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
                <div className="pt-3">
                  <div className="font-medium line-clamp-1 mb-1.5">
                    <div className="h-3 bg-gray-200 rounded-full w-full animate-pulse"></div>
                  </div>
                  <div>
                    <div className="h-2 bg-gray-200 rounded-full w-full mb-1 animate-pulse"></div>
                    <div className="h-2 bg-gray-200 rounded-full w-2/4 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    );

  if (!data || data.length === 0) return <></>;

  return (
    <div className="bg-white px-3 py-3.5">
      <div className="flex justify-between mb-3.5">
        <div className="font-semibold text-gold uppercase">
          <span>Dịch vụ</span> nổi bật
        </div>
        <Link to="/catalogue?TypeID=795" className="text-gold text-sm">Xem thêm</Link>
      </div>
      <div>
        <Swiper
          modules={[Autoplay]}
          pagination={{
            clickable: true,
          }}
          // autoplay={{
          //   delay: 5000,
          //   disableOnInteraction: false,
          // }}
          slidesPerView={"auto"}
          loop={true}
          spaceBetween={12}
        >
          {data &&
            data.slice(0, 30).map((item, index) => (
              <SwiperSlide className="w-[65%]" key={index}>
                <Link
                  className="cursor-pointer block relative bg-white p-4 border border-gray-300 rounded"
                  data={item}
                  to={`/catalogue/service/${item.root?.ID}`}
                >

                  <div className="images bd-rd3 relative">
                    {
                      item.root.Status.indexOf("2") > -1 && (
                        <div className="bg-app text-xs z-10 text-white absolute top-2 left-0 py-1.5 pl-1.5 pr-2 font-medium rounded-r before:content-[''] before:absolute before:-left-[5px] before:top-0 before:rounded-l before:h-[calc(100%+.438em)] before:w-[.469em] before:bg-app after:content-[''] after:absolute after:w-[.313em] after:h-[.313em] after:-left-[3px] after:-bottom-[.313em] after:bg-black/30 after:rounded-l">
                          Nổi bật
                        </div>
                      )
                    }

                    <ImageLazy
                      wrapperClassName="!block"
                      className="w-full object-cover rounded-sm aspect-square"
                      effect="blur"
                      src={toAbsolutePathAPI(item.root.Thumbnail_web)}
                    />
                  </div>
                  <div className="pt-4">
                    <div className="font-semibold line-clamp-1 mb-1 uppercase">
                      {item.root.Title}
                    </div>
                    <div className="text-danger font-semibold mb-1 text-sm">
                      {item?.root?.PriceBase ? formatString.formatVND(item?.root?.PriceBase) : "Tư vấn thêm"}
                    </div>
                    {/* <div
                      className="line-clamp-2 text-sm font-light text-gray-800"
                      dangerouslySetInnerHTML={{
                        __html: item.root.Desc,
                      }}
                    ></div> */}
                  </div>
                </Link>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
};

const SalesServiceOutstanding = () => {
  return <SalesBanner />;
};

export { SalesServiceOutstanding };
