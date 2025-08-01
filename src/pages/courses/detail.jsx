import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import React from "react";
import { useLocation, useParams } from "react-router";
import PullToRefresh from "react-simple-pull-to-refresh";
import { openShareSheet } from "zmp-sdk";
import { Icon, Page, Text, useNavigate } from "zmp-ui";
import NewsAPI from "../../api/news.api";
import { HtmlParser } from "../../components/HtmlParser";
import { ImageLazy } from "../../components/ImagesLazy";
import { toAbsolutePath } from "../../utils/assetPath";

const CoursesDetailPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  let { id } = useParams();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["CoursesDetail"],
    queryFn: async () => {
      const { data } = await NewsAPI.getDetailID(id);
      return data?.data[0] || [];
    },
    initialData: state?.dataProps,
    enabled: !state?.dataProps && Number(id) > -1,
    cacheTime: state?.dataProps ? 0 : 5 * 60 * 1000,
  });

  return (
    <Page className="page !pb-0 bg-white" hideScrollbar>
      <div className="navbar fixed top-0 left-0 min-w-[100vw] max-w-[100vw] z-[999] bg-app shadow-3xl text-white">
        <div className="w-2/3 relative flex items-center h-full pl-10">
          <div
            className="absolute left-0 w-10 h-full flex justify-center items-center cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <Icon icon="zi-chevron-left-header" />
          </div>
          <Text.Title className="w-full">
            <div className="truncate">
              {isLoading ? "Đang tải ..." : data?.source?.Title || data?.Title}
            </div>
          </Text.Title>
        </div>
      </div>
      <PullToRefresh className="ezs-ptr ezs-ptr-safe" onRefresh={refetch}>
        <div className="h-full overflow-auto pb-safe-bottom">
          <div className="relative">
            <ImageLazy
              wrapperClassName="aspect-[5/3] !block"
              className="w-full aspect-[5/3] object-cover"
              effect="blur"
              src={toAbsolutePath(data?.Thumbnail || data?.source?.Thumbnail)}
            />

            <button
              type="button"
              className="w-12 h-12 absolute rounded-full bg-white flex items-center justify-center -bottom-5 right-4 text-primary disabled:opacity-60 shadow-lg"
              disabled={isLoading}
              onClick={() => {
                openShareSheet({
                  type: "zmp_deep_link",
                  data: {
                    title: data?.source?.Title || data?.Title,
                    description: data?.source?.Desc || data?.Desc,
                    thumbnail: toAbsolutePath(data?.Thumbnail || data?.source?.Thumbnail),
                  },
                });
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                />
              </svg>
            </button>
          </div>
          <div className="py-3.5">
            <div className="mb-3 px-3">
              <div className="text-[#777777] flex items-end gap-1 mb-1.5">
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

                {moment(data?.source?.CreateDate).format("ll")}
              </div>
              <div className="text-lg font-bold uppercase">
                {data?.source?.Title || data?.Title}
              </div>

            </div>
            <div className="relative bg-white px-3 leading-6 content-full">
              <HtmlParser>
                {data?.source?.Desc || data?.Desc}
                {data?.source?.Content || data?.Content}
              </HtmlParser>
            </div>
          </div>
        </div>
      </PullToRefresh>
    </Page>
  );
};

export default CoursesDetailPage;
