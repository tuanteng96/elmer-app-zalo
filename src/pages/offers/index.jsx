import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import PullToRefresh from "react-simple-pull-to-refresh";
import { Icon, Page, Text, useNavigate } from "zmp-ui";
import NewsAPI from "../../api/news.api";
import { ImageLazy } from "../../components/ImagesLazy";
import { toAbsolutePath } from "../../utils/assetPath";
import { CatalogueCate } from "./components/CatalogueCate";

const OffersPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  let [filters, setFilters] = useState({
    CateID: "",
  });

  const Cates = useQuery({
    queryKey: ["OffersCate"],
    queryFn: async () => {
      let rs = await NewsAPI.getInfoToCateID("11385");
      return rs?.data?.data?.length > 0 ? rs?.data?.data[0].Title : "";
    },
    initialData: state?.dataProps,
    enabled: !state?.dataProps,
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["OffersList", filters],
    queryFn: async () => {
      const { data } = await NewsAPI.getListToID(filters.CateID);

      return data?.data
        ? data?.data.map((x) => ({
          ...x,
        }))
        : [];
    },
    initialData: state?.dataProps,
    enabled: !state?.dataProps && Boolean(filters.CateID),
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
        <div className="h-full overflow-auto no-scrollbar pb-safe-bottom">
          <div className="px-3 py-3.5">
            {isLoading &&
              Array(3)
                .fill()
                .map((_, index) => (
                  <div
                    className="bg-white shadow-3xl border-[5px] border-white flex gap-2 mb-3 rounded overflow-hidden last:mb-0"
                    key={index}
                  >
                    <div className="w-[100px]">
                      <div className="aspect-square rounded">
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
                    to={"/offers/" + item.id}
                    state={{ dataProps: item }}
                    className="bg-white shadow-3xl border-[5px] border-white flex gap-3 mb-3 rounded overflow-hidden last:mb-0"
                    key={index}
                  >
                    <div className="w-[120px]">
                      <ImageLazy
                        wrapperClassName="aspect-square !block"
                        className="w-full aspect-square object-cover rounded"
                        effect="blur"
                        src={toAbsolutePath(item.source.Thumbnail)}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="line-clamp-2 !text-sm font-medium">
                        {item.text}
                      </div>
                      <div className="text-muted mt-1.5 [&>p]:!mb-1" dangerouslySetInnerHTML={{ __html: item?.source?.Desc }} />
                    </div>
                  </NavLink>
                ))}
              </>
            )}
          </div>
        </div>
      </PullToRefresh>
    </Page>
  );
};
export default OffersPage;
