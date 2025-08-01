import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import ProdsAPI from "../../api/prods.api";
import { useLayout } from "../../layout/LayoutProvider";
import { formatArray } from "../../utils/formatArray";
import InfiniteScroll from "react-infinite-scroll-component";
import { ServiceItem } from "../../components/Service/item";

const SkeletonServices = ({
  total = 2,
  className = "p-3 grid grid-cols-1 gap-3",
}) => {
  return (
    <div className={className}>
      {Array(total)
        .fill()
        .map((_, index) => (
          <div className="bg-white" key={index}>
            <div>
              <div className="aspect-square">
                <div className="flex items-center justify-center w-full h-full bg-gray-300">
                  <svg
                    className="w-8 h-8 text-gray-200"
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
            <div className="p-3">
              <div className="text-danger font-semibold text-sm mb-2">
                <div className="h-3.5 bg-gray-200 rounded-full w-2/4 mb-1.5"></div>
              </div>
              <div className="line-clamp-2 text-xs leading-4 mb-2">
                <div className="h-2 bg-gray-200 rounded-full w-full mb-1.5"></div>
                <div className="h-2 bg-gray-200 rounded-full w-4/5"></div>
              </div>
              <div className="border-t border-dashed py-3 flex justify-between">
                <div className="w-6/12 h-3.5 bg-gray-200 rounded-full"></div>
                <div className="w-1/5 h-3.5 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

const ListServices = ({ queryConfig }) => {
  const elRoot = useRef();
  const { CurrentStocks } = useLayout();

  useEffect(() => {
    if (elRoot?.current) {
      elRoot?.current?.scroll({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [queryConfig.TypeID, queryConfig.CateID]);

  const { data, fetchNextPage, isLoading, hasNextPage, refetch } =
    useInfiniteQuery({
      queryKey: ["ProdServicesNew", { CurrentStocks, ...queryConfig }],
      queryFn: async ({ pageParam = 1 }) => {
        const newQueryParams = {
          pi: pageParam,
          ps: 3,
          stockid: CurrentStocks?.ID || 0,
          cates: queryConfig.CateID || "795",
        };
        const { data } = await ProdsAPI.listServiceRoot(newQueryParams);
        return data || [];
      },
      getNextPageParam: (lastPage) => {
        return lastPage.pi === lastPage.pcount || !lastPage.pcount
          ? undefined
          : lastPage.pi + 1;
      },
    });

  const List = formatArray.useInfiniteQuery(data?.pages, "lst");

  if (isLoading) {
    return <SkeletonServices />;
  }

  return (
    <div
      id="scrollableProducts"
      className="grow no-scrollbar overflow-auto"
      ref={elRoot}
    >
      {List && List.length > 0 && (
        <InfiniteScroll
          dataLength={List.length}
          next={fetchNextPage}
          hasMore={hasNextPage}
          loader={<SkeletonServices total={1} />}
          scrollableTarget="scrollableProducts"
          refreshFunction={refetch}
          releaseToRefreshContent={
            <div className="flex items-center justify-center">
              <div className="lds-ellipsis">
                <div className="!bg-app"></div>
                <div className="!bg-app"></div>
                <div className="!bg-app"></div>
                <div className="!bg-app"></div>
              </div>
            </div>
          }
          pullDownToRefresh
          pullDownToRefreshThreshold={70}
          pullDownToRefreshContent={
            <div className="flex items-center justify-center">
              <div className="lds-ellipsis">
                <div className="!bg-app"></div>
                <div className="!bg-app"></div>
                <div className="!bg-app"></div>
                <div className="!bg-app"></div>
              </div>
            </div>
          }
        >
          <div className="p-3 grid grid-cols-1 gap-3">
            {List &&
              List.map((service, index) => (
                <ServiceItem service={service} key={index} />
              ))}
          </div>
        </InfiniteScroll>
      )}
      {(!List || List.length === 0) && (
        <div className="h-full flex justify-center items-center flex-col">
          <svg
            className="w-16"
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            stroke="currentColor"
          >
            <g fill="none" fillRule="evenodd">
              <path fill="#FBD74C" d="M27 11h16v34H27z" />
              <path
                d="M28.5 4C42.031 4 53 14.969 53 28.5a24.413 24.413 0 01-6.508 16.63c.041.022.082.05.12.08l.095.083 14 14a1 1 0 01-1.32 1.497l-.094-.083-14-14a1 1 0 01-.164-.216A24.404 24.404 0 0128.5 53C14.969 53 4 42.031 4 28.5S14.969 4 28.5 4zm0 2C16.074 6 6 16.074 6 28.5S16.074 51 28.5 51 51 40.926 51 28.5 40.926 6 28.5 6zM39 14a1 1 0 011 1v26a1 1 0 01-1 1H17a1 1 0 01-1-1V15a1 1 0 011-1zm-1 2H18v24h20V16zm-3 16a1 1 0 01.117 1.993L35 34H21a1 1 0 01-.117-1.993L21 32h14zm0-12a1 1 0 011 1v7a1 1 0 01-1 1H21a1 1 0 01-1-1v-7a1 1 0 011-1zm-1 2H22v5h12v-5z"
                fill="#101928"
                fillRule="nonzero"
              />
            </g>
          </svg>
          <div className="font-bold text-lg mb-px mt-3">
            "Hổng" có dữ liệu !
          </div>
          <div>Thử chọn danh mục khác xem có gì mới ? ...</div>
        </div>
      )}
    </div>
  );
};

export default ListServices;
