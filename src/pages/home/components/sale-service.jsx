import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper";
import AdvAPI from "../../../api/adv.api";
import { useQuery } from "@tanstack/react-query";
import { toAbsolutePath, toAbsolutePathAPI } from "../../../utils/assetPath";
import { NavLinkAdv } from "../../../components/NavLinkAdv";
import { useLayout } from "../../../layout/LayoutProvider";

const SalesBanner = () => {
  let { GlobalConfig } = useLayout();

  const getRandomImage = () => {
    const IconsRandom = GlobalConfig?.APP?.IconsRandom;
    let newBgRandom = IconsRandom ? [...IconsRandom] : [];

    return toAbsolutePathAPI(
      newBgRandom[Math.floor(Math.random() * newBgRandom.length)],
    );
  };

  const { data, isLoading } = useQuery({
    queryKey: ["AdvBannerSALE", GlobalConfig],
    queryFn: async () => {
      const { data } = await AdvAPI.getAdvName("APP.SALE");
      return data?.data
        ? data.data.map((x) => ({
            ...x,
            FileName: x.FileName
              ? toAbsolutePath(x.FileName)
              : getRandomImage(),
          }))
        : [];
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

  const getColor = (index, arr) => {
    if (
      GlobalConfig?.APP?.ColorRandom &&
      GlobalConfig?.APP?.ColorRandom.length > 0 &&
      arr
    ) {
      const { ColorRandom } = GlobalConfig?.APP;
      let newColorRandom = [];
      if (arr.length > ColorRandom.length) {
        const addCount = Math.floor(arr.length / ColorRandom.length);
        const surplus = arr.length % ColorRandom.length;
        for (let i = 1; i <= addCount; i++) {
          newColorRandom = [...newColorRandom, ...ColorRandom];
        }

        if (surplus > 0) {
          newColorRandom = [
            ...newColorRandom,
            ...ColorRandom.slice(0, surplus),
          ];
        }
      } else {
        newColorRandom = [...ColorRandom];
      }
      return newColorRandom[index];
    }
    return "transparent";
  };

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
          loop={true}
        >
          {data &&
            data.map((item, index) => (
              <SwiperSlide key={index}>
                <NavLinkAdv
                  className="cursor-pointer block relative rounded overflow-hidden h-[90px]"
                  data={item}
                  to={item.Link}
                >
                  <div
                    className="absolute w-full h-full top-0 right-0"
                    style={{
                      background: getColor(index, data),
                    }}
                  ></div>
                  <div className="flex z-10 relative h-full">
                    <div className="p-4 aspect-square">
                      <img
                        className="w-full h-full object-cover rounded-lg"
                        src={item.FileName}
                        alt=""
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="text-white font-medium text-base">
                        {item.Title}
                      </div>
                      <div
                        className="text-white text-sm opacity-80"
                        dangerouslySetInnerHTML={{
                          __html: item.Desc,
                        }}
                      ></div>
                    </div>
                    <div className="w-12 flex justify-end items-center pr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="#fff"
                        style={{
                          width: "20px",
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
                  {/* <ImageLazy
                  wrapperClassName="aspect-square !block"
                  className="aspect-square w-full object-cover rounded-sm"
                  effect="blur"
                  src={toAbsolutePath(item.FileName)}
                /> */}
                </NavLinkAdv>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
};

const SalesService = () => {
  return <SalesBanner />;
};

export { SalesService };
