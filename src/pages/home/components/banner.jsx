import React from "react";
import { Box } from "zmp-ui";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper";
import { ImageLazy } from "../../../components/ImagesLazy";
import { useQuery } from "@tanstack/react-query";
import AdvAPI from "../../../api/adv.api";
import { toAbsolutePath } from "../../../utils/assetPath";
import { NavLinkAdv } from "../../../components/NavLinkAdv";

const Banner = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["AdvBannerTop"],
    queryFn: async () => {
      const { data } = await AdvAPI.getAdvName("ZALO.TOPBANNER");
      return data?.data || [];
    },
  });

  if (isLoading)
    return (
      <div className="animate-pulse aspect-square">
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
    );

  return (
    <Box className="bg-white border-white border-[5px] rounded-md overflow-hidden aspect-square">
      <Swiper
        className="rounded-md overflow-hidden"
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
          data.slice(0, 4).map((item, index) => (
            <SwiperSlide key={index}>
              <NavLinkAdv
                className="block cursor-pointer"
                data={item}
                to={item.Link}
              >
                <ImageLazy
                  wrapperClassName="!block"
                  className="aspect-square object-cover object-top"
                  effect="blur"
                  src={toAbsolutePath(item.FileName)}
                />
              </NavLinkAdv>
            </SwiperSlide>
          ))}
      </Swiper>
    </Box>
  );
};

export { Banner };
