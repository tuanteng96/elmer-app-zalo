import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper";
import AdvAPI from "../../../api/adv.api";
import { useQuery } from "@tanstack/react-query";
import { ImageLazy } from "../../../components/ImagesLazy";
import { toAbsolutePath } from "../../../utils/assetPath";
import { NavLinkAdv } from "../../../components/NavLinkAdv";

const SalesBanner = ({ data }) => {
  return (
    <div className="pb-3">
      <Swiper
        className="aspect-square"
        modules={[Pagination, Autoplay]}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
      >
        {data &&
          data.map((item, index) => (
            <SwiperSlide key={index}>
              <NavLinkAdv
                className="cursor-pointer block h-full"
                data={item}
                to={item.Link}
              >
                <ImageLazy
                  wrapperClassName="aspect-square !block"
                  className="aspect-square w-full object-cover rounded-sm"
                  effect="blur"
                  src={toAbsolutePath(item.FileName)}
                />
              </NavLinkAdv>
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

const Sales = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["AdvBannerMain"],
    queryFn: async () => {
      const { data } = await AdvAPI.getAdvName("APP.MAIN");
      return data?.data || [];
    },
  });

  if (isLoading)
    return (
      <div className="bg-white">
        <div className="px-3 pt-3">
          <div className="animate-pulse aspect-[1.9]">
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
        <SalesBanner data={data} />
      </div>
    </div>
  );
};

export { Sales };
