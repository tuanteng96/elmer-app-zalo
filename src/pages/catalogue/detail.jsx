import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import React, { useState } from "react";
import { useParams, useLocation } from "react-router";
import { Icon, Page, useNavigate, Text, ImageViewer } from "zmp-ui";
import { useForm, FormProvider } from "react-hook-form";
import ProdsAPI from "../../api/prods.api";
import { ImageLazy } from "../../components/ImagesLazy";
import { toAbsolutePath } from "../../utils/assetPath";
import { NavigationOrder } from "./components/NavigationOrder";
import { PriceSaleDetail } from "./components/PriceSaleDetail";
import { useLayout } from "../../layout/LayoutProvider";
import { HtmlParser } from "../../components/HtmlParser";
import { Swiper, SwiperSlide } from "swiper/react";
import PullToRefresh from "react-simple-pull-to-refresh";
import { NavLink } from "react-router-dom";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";

const CatalogueDetailPage = () => {
  const { Auth, CurrentStocks } = useLayout();
  const navigate = useNavigate();
  let { id } = useParams();
  let { pathname, search, state } = useLocation();
  const [scrollTop, setScrollTop] = useState(0);
  const [images, setImages] = useState(null);
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const methods = useForm({
    defaultValues: {
      order: {
        ID: 0,
        SenderID: Auth?.ID,
        Tinh: 5,
        Huyen: 37,
        MethodPayID: 1,
      },
      adds: [
        {
          ProdID: id,
          Qty: 1,
        },
      ],
      forceStockID: CurrentStocks?.ID || "",
    },
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["CatalogueDetail", { id }],
    queryFn: async () => {
      const { data } = await ProdsAPI.prodId({ id });
      return data?.data;
    },
    onSuccess: (data) => {
      if (data?.images && data?.images?.length > 0) {
        setImages(
          data?.images.map((x, index) => ({
            ...x,
            src: toAbsolutePath(x.Value),
            alt: "",
            key: index,
          })),
        );
      }
    },
    enabled: Number(id) > -1,
  });

  const handleScroll = (event) => {
    setScrollTop(event.currentTarget.scrollTop);
  };

  if (isLoading) {
    return (
      <>
        <Page className="page !pt-0 animate-pulse bg-white" hideScrollbar>
          <div>
            <div className="aspect-square">
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
            <div className="px-3">
              <div className="h-3.5 bg-gray-200 rounded-full w-full mt-4"></div>
              <div className="h-3.5 bg-gray-200 rounded-full w-2/4 mt-2"></div>
            </div>
            <div className="p-3">
              <div className="h-3 bg-gray-200 rounded-full w-9/12 mt-2"></div>
              <div className="h-3 bg-gray-200 rounded-full w-full mt-2"></div>
              <div className="h-3 bg-gray-200 rounded-full w-10/12 mt-2"></div>
              <div className="h-3 bg-gray-200 rounded-full w-full mt-2"></div>
            </div>
          </div>
        </Page>
      </>
    );
  }

  if (!data) return <></>;

  return (
    <Page className="page !pt-0" hideScrollbar>
      <FormProvider {...methods}>
        <PullToRefresh className="ezs-ptr ezs-ptr-safe" onRefresh={refetch}>
          <form
            className="h-full overflow-auto no-scrollbar"
            onScroll={handleScroll}
          >
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
              <div className="w-2/3 relative flex items-center h-full pl-12">
                <div
                  className="absolute left-0 w-11 rounded-full h-11 flex justify-center items-center cursor-pointer bg-white"
                  onClick={() =>
                    navigate(state?.prevState || "/catalogue?TypeID=795")
                  }
                >
                  <Icon icon="zi-chevron-left-header" className="text-app" />
                </div>
                <Text.Title
                  className={clsx(
                    "text-app truncate transition",
                    scrollTop > 100 ? "opacity-100" : "opacity-0",
                  )}
                >
                  {data?.product?.Title}
                </Text.Title>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white mb-2">
                <ImageLazy
                  wrapperClassName="aspect-square !block"
                  className="aspect-square object-cover w-full"
                  effect="blur"
                  src={
                    images && images.length > 0
                      ? images[activeIndex].src
                      : toAbsolutePath(data?.product?.Thumbnail)
                  }
                  onClick={() => setVisible(true)}
                />
                {images && images.length > 1 && (
                  <div className="p-3">
                    <Swiper
                      spaceBetween={10}
                      autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                      }}
                      slidesPerView="auto"
                    >
                      {images.map((item, index) => (
                        <SwiperSlide
                          className="w-1/5 cursor-pointer"
                          key={index}
                        >
                          <div
                            className={clsx(
                              "border rounded-sm",
                              Number(activeIndex) === index && "border-app",
                            )}
                            onClick={() => setActiveIndex(index)}
                          >
                            <ImageLazy
                              wrapperClassName="aspect-square !block"
                              className="aspect-square object-cover w-full rounded-sm"
                              effect="blur"
                              src={item.src}
                            />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                )}
              </div>
              {!Auth?.ID && (
                <div
                  className="px-3 mb-3 mt-2.5"
                  onClick={() =>
                    navigate(`${pathname}?fromProtected=${pathname}`)
                  }
                >
                  <div className="bg-app/90 text-white p-4 rounded relative z-[1]">
                    <div className="text-[16px] font-semibold">
                      Đăng nhập thành viên
                    </div>
                    <div className="text-[13px] mt-1">
                      Trở thành thành viên để tiếp tục mua hàng ...{" "}
                    </div>
                    <div className="absolute right-[20px] top-2/4 rounded-full bg-app flex justify-center w-12 h-12 -z-[1] -translate-y-2/4 skew-y-[20deg]">
                      <CurrencyDollarIcon className="w-8 text-white opacity-40" />
                    </div>
                    <div className="absolute right-[80px] top-2/4 rounded-full bg-app flex justify-center w-6 h-6 -z-[1] -translate-y-2/4 skew-y-[10deg]">
                      <CurrencyDollarIcon className="w-6 text-white opacity-40" />
                    </div>
                  </div>
                </div>
              )}
              <div className="bg-white mb-2 p-3">
                <div className="text-[17px] leading-5 mb-3 font-semibold">
                  {data?.product?.Title}
                </div>
                <PriceSaleDetail product={data?.product} />
              </div>
              {data.combos && data.combos.length > 1 && (
                <div className="bg-white mb-2 p-3">
                  <div className="mb-2 font-semibold">Combo</div>
                  <div className="grid grid-cols-4 gap-3">
                    {data.combos.map((combo, i) => (
                      <NavLink
                        to={`/catalogue/${combo.Product.ID}`}
                        state={{
                          prevState: pathname + search,
                        }}
                        className="block"
                        key={i}
                      >
                        <div className="relative">
                          <ImageLazy
                            wrapperClassName="aspect-square !block"
                            className="aspect-square object-cover w-full rounded-sm"
                            effect="blur"
                            src={toAbsolutePath(combo.Product.Thumbnail)}
                          />
                          <span className="absolute w-5 h-5 top-1 right-1 bg-primary text-white text-xs text-center rounded-full flex items-center justify-center">
                            {combo.qty}
                          </span>
                        </div>
                        <div className="text-xs mt-1.5 truncate">
                          {combo.Product.Title}
                        </div>
                      </NavLink>
                    ))}
                  </div>
                </div>
              )}
              <div></div>
              {(data?.product?.Desc ||
                (data.combos &&
                  data.combos.length > 0 &&
                  data.combos[0].Product?.Desc)) && (
                <div className="bg-white mb-2">
                  <div className="border-b p-3 font-semibold">Mô tả</div>
                  <div className="p-3">
                    <HtmlParser>
                      {data?.product?.Desc || data.combos[0].Product?.Desc}
                    </HtmlParser>
                  </div>
                </div>
              )}
              {(data?.product?.Detail ||
                (data.combos &&
                  data.combos.length > 0 &&
                  data.combos[0].Product?.Detail)) && (
                <div className="bg-white mb-2">
                  <div className="border-b p-3 font-semibold">Chi tiết</div>
                  <div className="p-3">
                    <HtmlParser>
                      {data?.product?.Detail || data.combos[0].Product?.Detail}
                    </HtmlParser>
                  </div>
                </div>
              )}
            </div>
          </form>
        </PullToRefresh>
        <NavigationOrder
          item={data?.product}
          options={data?.options}
          combo={data?.combos}
        />
      </FormProvider>
      <ImageViewer
        onClose={() => setVisible(false)}
        activeIndex={activeIndex}
        images={images}
        visible={visible}
      />
    </Page>
  );
};

export default CatalogueDetailPage;
