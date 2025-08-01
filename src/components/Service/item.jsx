import React from "react";
import { useLocation } from "react-router";
import { useNavigate } from "zmp-ui";
import { toAbsolutePath } from "../../utils/assetPath";
import { HtmlParser } from "../HtmlParser";
import { ImageLazy } from "../ImagesLazy";
import { CardWrap } from "./card-wrap";
import { ServicePicker } from "./picker";

export const ServiceItem = ({ service }) => {
  let navigate = useNavigate();
  const { pathname, search } = useLocation();
  return (
    <ServicePicker service={service}>
      {({ open }) => (
        <div className="bg-white">
          <div onClick={open}>
            <div className="relative">
              <ImageLazy
                wrapperClassName="aspect-[5/3] !block"
                className="aspect-[5/3] h-full object-cover"
                effect="blur"
                src={toAbsolutePath(service.root.Thumbnail)}
              />
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/booking", {
                    state: {
                      prevState:
                        pathname + search + `&SheetID=${service?.root?.ID}`,
                      formState: {
                        Roots: [
                          {
                            ID: service?.root?.ID,
                            Title: service?.root?.Title,
                          },
                        ],
                      },
                    },
                  });
                }}
                className="bg-app text-white absolute top-4 left-0 py-3 px-4 font-medium rounded-r before:content-[''] before:absolute before:-left-[5px] before:top-0 before:rounded-l before:h-[calc(100%+.438em)] before:w-[.469em] before:bg-app after:content-[''] after:absolute after:w-[.313em] after:h-[.313em] after:-left-[3px] after:-bottom-[.313em] after:bg-[#f5f5fa] after:rounded-l"
              >
                Đặt lịch ngay
              </div>
            </div>
            <div className="p-3">
              <div className="text-app text-[16px] font-semibold leading-6">
                {service.root.Title}
              </div>
              {(service.root.Desc || service.root.Detail) && (
                <div className="line-clamp-3 h-[60px] text-sm mt-2">
                  <HtmlParser>
                    {service.root.Desc}
                    {service.root.Detail}
                  </HtmlParser>
                </div>
              )}
            </div>
          </div>
          <CardWrap service={service} />
        </div>
      )}
    </ServicePicker>
  );
};
