import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import PullToRefresh from "react-simple-pull-to-refresh";
import { SwiperSlide, Swiper } from "swiper/react";
import { Pagination } from "swiper";
import { Icon, Page, Text, useNavigate } from "zmp-ui";
import NewsAPI from "../../api/news.api";
import { ImageLazy } from "../../components/ImagesLazy";
import { toAbsolutePath } from "../../utils/assetPath";
import { CatalogueCate } from "./components/CatalogueCate";
import { HtmlParser } from "../../components/HtmlParser";
import moment from "moment";

const CoursesPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  let [filters, setFilters] = useState({
    CateID: 11374,
  });

  const Cates = useQuery({
    queryKey: ["CoursesCate"],
    queryFn: async () => {
      let rs = await NewsAPI.getInfoToCateID("11367");
      return rs?.data?.data?.length > 0 ? rs?.data?.data[0].Title : "";
    },
    initialData: state?.dataProps,
    enabled: !state?.dataProps,
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["CoursesList", filters],
    queryFn: async () => {
      const { data } = await NewsAPI.getListToID(filters.CateID);

      return data?.data
        ? data?.data.map((x) => ({
          ...x,
        }))
        : [];
    },
    initialData: state?.dataProps,
    enabled: !state?.dataProps,
  });

  const CoursesOutstanding = useQuery({
    queryKey: ["CoursesOutstanding"],
    queryFn: async () => {
      const { data } = await NewsAPI.getListToID("11371");

      return data?.data
        ? data?.data.map((x) => ({
          ...x,
        }))
        : [];
    }
  });

  return (
    <Page className="page !overflow-hidden flex flex-col !pb-0" hideScrollbar>
      <div className="navbar fixed top-0 left-0 min-w-[100vw] max-w-[100vw] z-[999] bg-app shadow-3xl text-white">
        <div className="w-2/3 relative flex items-center h-full pl-10">
          <div
            className="absolute left-0 w-10 h-full flex justify-center items-center cursor-pointer"
            onClick={() => navigate(state?.prevState || -1)}
          >
            <Icon icon="zi-chevron-left-header" />
          </div>
          <Text.Title>
            {Cates.isLoading ? "Đang tải ..." : Cates.data}
          </Text.Title>
        </div>
      </div>
      <CatalogueCate
        queryConfig={{ CateID: filters?.CateID }}
        onChange={(id) =>
          setFilters((prevState) => ({
            ...prevState,
            CateID: id,
          }))
        }
      />
      <PullToRefresh className="ezs-ptr ezs-ptr-safe grow" onRefresh={refetch}>
        <div className="h-full">
          <div className="h-full overflow-auto no-scrollbar pb-safe-bottom">
            <div className="px-3 py-3.5 bg-app">
              <div className="mb-3.5 font-semibold text-white flex justify-between items-center uppercase">
                {CoursesOutstanding.isLoading ? (
                  <div className="h-4 bg-gray-200 rounded-full w-2/5"></div>
                ) : (
                  <>
                    {
                      CoursesOutstanding.data && CoursesOutstanding.data.length > 0 ? <>{CoursesOutstanding.data[0].source.CateTitle}</> : <></>
                    }
                  </>
                )}

              </div>
              <div className="border-white border-[5px] rounded-md bg-white">
                {CoursesOutstanding.isLoading && (
                  <div>
                    <div className="flex items-center justify-center w-full h-full bg-gray-300 rounded aspect-[5/3]">
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
                    <div className="p-3">
                      <div className="h-3 bg-gray-200 rounded-full w-full mb-2.5"></div>
                      <div className="h-3 bg-gray-200 rounded-full w-2/4"></div>
                    </div>
                  </div>
                )}
                {!CoursesOutstanding.isLoading && (
                  <Swiper
                    spaceBetween={10}
                    autoplay={{
                      delay: 6000,
                      disableOnInteraction: false,
                    }}
                    pagination={{
                      el: "#containerForBulletsCourses",
                      type: "bullets",
                      bulletClass: "w-1.5 h-1.5 rounded-full bg-white/50",
                      bulletActiveClass: "!bg-white",
                      clickable: true,
                    }}
                    modules={[Pagination]}
                    slidesPerView="auto"
                  >
                    {CoursesOutstanding.data &&
                      CoursesOutstanding.data.slice(0, 2).map((item, index) => (
                        <SwiperSlide key={index}>
                          <NavLink
                            to={"/courses-sale/" + item.id}
                            state={{ dataProps: item }}
                            className="bg-white block"
                          >
                            <div>
                              <ImageLazy
                                wrapperClassName="!block aspect-[5/3]"
                                className="object-cover w-full h-full rounded-md"
                                effect="blur"
                                src={toAbsolutePath(item.source.Thumbnail)}
                              />
                            </div>
                            <div className="pt-3 pb-1.5 px-3">
                              <div className="line-clamp-2 uppercase font-medium">{item.text}</div>
                              <div className="text-danger font-semibold mt-1 text-sm">
                                <HtmlParser>{item.source?.Desc}</HtmlParser>
                              </div>
                            </div>
                          </NavLink>
                        </SwiperSlide>
                      ))}
                  </Swiper>
                )}
              </div>
              <div className="flex justify-center mt-3.5">
                <div
                  className="bg-black/20 bottom-0 flex !w-auto gap-1 rounded-[15px] px-1.5 py-1"
                  id="containerForBulletsCourses"
                ></div>
              </div>
            </div>
            <div className="px-3 py-3.5">
              <div className="uppercase font-semibold text-gold mb-3.5">Tất cả bài viết</div>
              {isLoading &&
                Array(1)
                  .fill()
                  .map((_, index) => (
                    <div
                      className="bg-white shadow-3xl border-[5px] border-white flex gap-2 mb-3 rounded overflow-hidden last:mb-0"
                      key={index}
                    >
                      <div className="w-2/4">
                        <div className="aspect-[5/3] rounded">
                          <div className="flex items-center justify-center w-full h-full bg-gray-300 animate-pulse">
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
                      <div className="flex-1 p-3">
                        <div className="animate-pulse h-3 bg-gray-200 rounded-full w-full mb-2.5"></div>
                        <div className="animate-pulse h-2 bg-gray-200 rounded-full mb-1.5"></div>
                        <div className="animate-pulse h-2 bg-gray-200 rounded-full mb-1.5"></div>
                        <div className="animate-pulse h-2 bg-gray-200 rounded-full w-4/5"></div>
                      </div>
                    </div>
                  ))}
              {!isLoading && (
                <>
                  {data && data.map((item, index) => (
                    <NavLink
                      to={"/courses/" + item.id}
                      state={{ dataProps: item }}
                      className="bg-white shadow-3xl border-[5px] border-white flex gap-2 mb-3 rounded overflow-hidden last:mb-0"
                      key={index}
                    >
                      <div className="w-2/4">
                        <ImageLazy
                          wrapperClassName="aspect-[5/3] !block"
                          className="w-full aspect-[5/3] object-cover rounded"
                          effect="blur"
                          src={toAbsolutePath(item.source.Thumbnail)}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="line-clamp-4 !text-sm font-medium">
                          {item.text}
                        </div>
                        <div className="flex items-end gap-1 text-muted mt-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="{1.5}"
                            stroke="currentColor"
                            className="w-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                            />
                          </svg>
                          <span className="text-sm">{moment(item?.source?.CreateDate).format("ll")}</span>
                        </div>
                      </div>
                    </NavLink>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </PullToRefresh>
    </Page>
  );
};
export default CoursesPage;
