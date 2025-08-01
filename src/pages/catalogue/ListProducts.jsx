import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import ProdsAPI from "../../api/prods.api";
import { ProductItem } from "../../components/Product/item";
import { useLayout } from "../../layout/LayoutProvider";
import { formatArray } from "../../utils/formatArray";
import InfiniteScroll from "react-infinite-scroll-component";
import { SkeletonProducts } from "./components/SkeletonProducts";

const ListProducts = ({ queryConfig }) => {
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
      queryKey: ["ProdProductsNew", { CurrentStocks, ...queryConfig }],
      queryFn: async ({ pageParam = 1 }) => {
        const newQueryParams = {
          pi: pageParam,
          ps: 6,
          stockid: CurrentStocks?.ID || 0,
          cates: queryConfig.CateID || queryConfig.TypeID,
          status: queryConfig.TypeID === "hot" ? 3 : "",
        };
        const { data } = await ProdsAPI.search(newQueryParams);
        return data?.data || [];
      },
      getNextPageParam: (lastPage) => {
        return lastPage.pi === lastPage.pcount || !lastPage.pcount
          ? undefined
          : lastPage.pi + 1;
      },
    });

  const List = formatArray.useInfiniteQuery(data?.pages, "lst");

  if (isLoading) {
    return <SkeletonProducts />;
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
          loader={
            <SkeletonProducts
              className="px-3 pb-3 grid grid-cols-2 gap-1.5"
              total={2}
            />
          }
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
          <div className="p-3 grid grid-cols-2 gap-1.5">
            {List.map((product, index) => (
              <ProductItem product={product} key={index} />
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

export default ListProducts;
