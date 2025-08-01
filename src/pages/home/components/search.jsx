import React from "react";
import { Icon, Text } from "zmp-ui";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper";
import clsx from "clsx";
import { useLayout } from "../../../layout/LayoutProvider";
import { NavLink } from "react-router-dom";

const Search = ({ scrollTop }) => {
  const { onOpenActionStocks } = useLayout();
  return (
    <div
      className={clsx(
        "navbar fixed top-0 left-0 min-w-[100vw] max-w-[100vw] z-[999] transition px-3",
        scrollTop > 50 && "shadow-3xl",
      )}
      style={{
        background: `rgba(255,255,255,${
          scrollTop <= 100 ? scrollTop / 100 : scrollTop
        })`,
      }}
    >
      <div className="bg-separator h-10 rounded-sm w-2/3 relative flex items-center">
        <NavLink
          to="/search"
          className="w-10 h-full flex items-center justify-center cursor-pointer"
        >
          <Icon className="text-muted" icon="zi-search" />
        </NavLink>
        <NavLink to="/search" className="h-full pl-1 flex-1">
          <Swiper
            className="h-full"
            direction="vertical"
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            modules={[Autoplay]}
          >
            <SwiperSlide className="flex items-center">
              <Text className="text-app" size="small">
                Chăm sóc da cơ bản
              </Text>
            </SwiperSlide>
            <SwiperSlide className="flex items-center">
              <Text className="text-app" size="small">
                Triệt lông toàn thân
              </Text>
            </SwiperSlide>
          </Swiper>
        </NavLink>
        <div className="w-10 text-center" onClick={onOpenActionStocks}>
          <Icon
            className="text-muted !text-lg !h-auto"
            icon="zi-location-solid"
          />
        </div>
      </div>
    </div>
  );
};

export { Search };
