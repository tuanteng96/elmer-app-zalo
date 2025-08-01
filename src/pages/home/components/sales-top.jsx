import { useQuery } from "@tanstack/react-query";
import React from "react";
import { NavLink } from "react-router-dom";
import AdvAPI from "../../../api/adv.api";
import { ImageLazy } from "../../../components/ImagesLazy";
import { toAbsolutePath } from "../../../utils/assetPath";
import { clsx } from "clsx";
import { NavLinkAdv } from "../../../components/NavLinkAdv";

const SalesTop = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["AdvBannerSalesTop"],
    queryFn: async () => {
      const { data } = await AdvAPI.getAdvName("APP.MAINSALE");
      return data?.data || [];
    },
  });

  if (isLoading)
    return (
      <div className="px-2 bg-white pb-2 flex">
        {Array(3)
          .fill()
          .map((_, index) => (
            <div
              key={index}
              className={clsx(
                "px-1 animate-pulse",
                index === 1 ? "aspect-5/3 w-[43%]" : "flex-1",
              )}
            >
              <div className="flex items-center justify-center w-full h-full bg-gray-300 rounded">
                <svg
                  className="w-6 h-6 text-gray-200"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 640 512"
                >
                  <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
                </svg>
              </div>
            </div>
          ))}
      </div>
    );

  if (!data || data.length === 0) return <></>;

  return (
    <>
      <div className="px-2 bg-white pb-2 flex">
        {data.slice(0, 3).map((item, index) => (
          <NavLinkAdv
            data={item}
            to={item.Link}
            className={clsx(
              "px-1 cursor-pointer",
              index === 1 ? "aspect-5/3 w-[43%]" : "flex-1",
            )}
            key={index}
          >
            <ImageLazy
              className="object-cover !block"
              effect="blur"
              src={toAbsolutePath(item.FileName)}
            />
          </NavLinkAdv>
        ))}
      </div>
    </>
  );
};

export { SalesTop };
