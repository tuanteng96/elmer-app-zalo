import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper";
import { useQuery } from "@tanstack/react-query";
import { ImageLazy } from "../../../components/ImagesLazy";
import { toAbsolutePath } from "../../../utils/assetPath";
import clsx from "clsx";
import { Link } from "react-router-dom";
import AdvAPI from "../../../api/adv.api";
import { useLayout } from "../../../layout/LayoutProvider";
import { useNavigate } from "zmp-ui";

const StocksLists = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["HomeStocks"],
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
  });

  let { Stocks, onSaveStocks, CurrentStocks } = useLayout()

  if (isLoading)
    return (
      <div className="bg-white px-3 pb-3.5 mb-3">
        <div className="flex justify-between mb-3.5">
          <div className="font-semibold text-gold uppercase">Hệ thống chi nhánh</div>
          <Link to="/user/customer-branch" className="text-gold text-sm">
            Xem thêm
          </Link>
        </div>
        <div className="bg-white px-3 pb-3.5 mb-3 grid grid-cols-2 gap-3">
          {Array(2)
            .fill()
            .map((_, index) => (
              <div
                className="cursor-pointer block relative bg-white border rounded"
                key={index}
              >
                <div className="images bd-rd3">
                  <div className="animate-pulse aspect-[5/7] rounded">
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
                <div className="p-3">
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

  const getActive = (item) => {
    return CurrentStocks?.Title ? CurrentStocks?.Title.toUpperCase() === item.Title.toUpperCase() : CurrentStocks?.Title
  }

  const onSaveStock = (item, i) => {
    let index = Stocks.findIndex(x => x.Title.toUpperCase() === item.Title.toUpperCase())
    if (index > -1) {
      onSaveStocks(Stocks[index])
    }
    navigate(`/user/customer-branch?index=${i}`)
  }

  return (
    <div className="bg-white px-3 pb-3.5 mb-3">
      <div className="flex justify-between mb-3.5">
        <div className="font-semibold text-gold uppercase">Hệ thống chi nhánh</div>
        <Link to="/user/customer-branch" className="text-gold text-sm">
          Xem thêm
        </Link>
      </div>
      <div>
        <Swiper
          modules={[Autoplay]}
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 8000,
            disableOnInteraction: false,
          }}
          slidesPerView={"auto"}
          loop={true}
          spaceBetween={12}
        >
          {data &&
            data.map((item, index) => (
              <SwiperSlide className="w-[65%]" key={index}>
                <div className={
                  clsx("cursor-pointer block relative bg-white border rounded overflow-hidden", getActive(item) ? "border-app" : "border-gray-300")
                } onClick={() => onSaveStock(item, index)}>
                  <div className="images bd-rd3">
                    <ImageLazy
                      wrapperClassName="!block"
                      className="w-full object-cover rounded-sm aspect-[5/7]"
                      effect="blur"
                      src={toAbsolutePath(item.FileName)}
                    />
                  </div>
                  <div className="p-3">
                    <div className="font-medium line-clamp-1 mb-1">
                      {item.Title}
                    </div>
                    <div>
                      <div className="font-light text-muted mb-2 line-clamp-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-5 float-left mr-1"
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

                        <span
                          dangerouslySetInnerHTML={{
                            __html: item.Desc,
                          }}
                        ></span>
                      </div>
                      <div className="flex gap-1.5">
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
                          {item?.TimeOpen}
                        </div>
                        <div>-</div>
                        <div className="bg-app text-white text-sm px-2 py-px rounded">
                          {item?.TimeClose}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
};

const HomeStocks = () => {
  return <StocksLists />;
};

export { HomeStocks };
