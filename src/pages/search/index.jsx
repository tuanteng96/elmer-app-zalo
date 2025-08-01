import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { createSearchParams, NavLink } from "react-router-dom";
import { Icon, Input, Page, Text, useNavigate } from "zmp-ui";
import NewsAPI from "../../api/news.api";
import ProdsAPI from "../../api/prods.api";
import { ImageLazy } from "../../components/ImagesLazy";
import { useDebounce, useQueryParams } from "../../hook";
import { useLayout } from "../../layout/LayoutProvider";
import { toAbsolutePath } from "../../utils/assetPath";
import { formatArray } from "../../utils/formatArray";
import { formatString } from "../../utils/formatString";
import { SkeletonProducts } from "../catalogue/components/SkeletonProducts";

const SearchPage = () => {
  const navigate = useNavigate();
  const elRoot = useRef();
  const { CurrentStocks } = useLayout();
  const [loading, setLoading] = useState(false);

  const queryParams = useQueryParams();

  const queryConfig = {
    key: queryParams?.key || "",
  };

  let keyValue = useDebounce(queryConfig?.key, 600);

  const inputRef = useRef();

  useEffect(() => {
    if (inputRef?.current) inputRef?.current?.focus();
  }, [inputRef]);

  useEffect(() => {
    if (elRoot?.current) {
      elRoot?.current?.scroll({
        top: 0,
        behavior: "smooth",
      });
    }
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["ProdNewsSearch", { CurrentStocks, keyValue }],
    queryFn: async () => {
      const newQueryParams = {
        Pi: 1,
        Ps: 500,
        StockID: CurrentStocks?.ID || 0,
        Key: keyValue,
      };
      let newLists = []
      const { data } = await ProdsAPI.roots(newQueryParams);
      const { data: News } = await NewsAPI.getListToID(11360, keyValue)

      if (data && data.lst && data.lst.length > 0) {
        for (let item of data.lst) {
          newLists.push({
            ...item,
            path: `/catalogue/service/${item.ID}`,
            PriceText: item.PriceBase ? formatString.formatVND(item.PriceBase) : "Tư vấn thêm"
          })
        }
      }
      if (News.data && News.data.length > 0) {
        for (let item of News.data) {

          if ([11371, 11379].includes(item.source.CateID2)) {
            newLists.push({
              ...item,
              Title: item.source.Title,
              Thumbnail: item.source.Thumbnail,
              path: `/courses-sale/${item.id}`,
              PriceText: item.source.Desc
            })
          }
          else if (item.source.CateID2 === 11361) {
            newLists.push({
              ...item,
              Title: item.source.Title,
              Thumbnail: item.source.Thumbnail,
              path: `/news/${item.id}`
            })
          }
          else if (item.source.CateID2 === 11384) {
            newLists.push({
              ...item,
              Title: item.source.Title,
              Thumbnail: item.source.Thumbnail,
              path: `/library/${item.id}`
            })
          }
          else if (item.source.CateID2 === 11386) {
            newLists.push({
              ...item,
              Title: item.source.Title,
              Thumbnail: item.source.Thumbnail,
              path: `/offers/${item.id}`
            })
          }
          else {
            newLists.push({
              ...item,
              Title: item.source.Title,
              Thumbnail: item.source.Thumbnail,
              path: `/courses/${item.id}`,
            })
          }
        }
      }

      return newLists
    },
    onSuccess: () => {
      setLoading(false);
    }
  })

  // const { data, fetchNextPage, isLoading, hasNextPage, refetch } =
  //   useInfiniteQuery({
  //     queryKey: ["ProdSearch", { CurrentStocks, keyValue }],
  //     queryFn: async ({ pageParam = 1 }) => {
  //       const newQueryParams = {
  //         Pi: pageParam,
  //         Ps: 500,
  //         StockID: CurrentStocks?.ID || 0,
  //         Key: keyValue,
  //       };
  //       const { data } = await ProdsAPI.roots(newQueryParams);
  //       return data || null;
  //     },
  //     getNextPageParam: (lastPage) => {
  //       return lastPage.pi === lastPage.pcount || !lastPage.pcount
  //         ? undefined
  //         : lastPage.pi + 1;
  //     },
  //     onSuccess: () => {
  //       setLoading(false);
  //     },
  //   });

  // const List = formatArray.useInfiniteQuery(data?.pages, "lst");

  return (
    <Page className="page !pb-0" hideScrollbar>
      <div className="navbar fixed top-0 left-0 min-w-[100vw] max-w-[100vw] z-[999] bg-app text-white">
        <div className="relative flex items-center w-2/3 h-full pl-10">
          <div
            className="absolute left-0 flex items-center justify-center w-10 h-full cursor-pointer"
            onClick={() => navigate("/")}
          >
            <Icon icon="zi-chevron-left-header" />
          </div>
          <Text.Title>Tìm kiếm</Text.Title>
        </div>
      </div>
      <div className="flex flex-col h-full border-t">
        <div className="bg-white p-3 min-h-[82px]">
          <Input.Search
            value={queryConfig.key}
            placeholder="Bạn cần tìm gì ?"
            ref={inputRef}
            loading={loading}
            onChange={(e) => {
              navigate({
                pathname: "/search",
                search: createSearchParams({
                  key: e.target.value,
                }).toString(),
              });
              if (!loading) setLoading(true);
            }}
          />
        </div>
        <div
          id="scrollableProducts"
          className="overflow-auto grow no-scrollbar !pb-safe-bottom"
          ref={elRoot}
        >
          {isLoading && <SkeletonProducts className="p-3 grid grid-cols-2 gap-3.5" />}
          {!isLoading && (
            <>
              {/* {List && List.length > 0 && (
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
                  <div className="grid grid-cols-2 gap-3.5 p-3">
                    {List.map((item, index) => (
                      <NavLink
                        to={`/catalogue/service/${item.ID}`}
                        className="border-white border-[5px] rounded-md bg-white"
                        key={index}
                      >
                        <div>
                          <ImageLazy
                            wrapperClassName="!block aspect-[5/3]"
                            className="object-cover w-full h-full rounded-md"
                            effect="blur"
                            src={toAbsolutePath(item.Thumbnail)}
                          />
                        </div>
                        <div className="text-center font-medium pt-2 pb-1 text-sm line-clamp-2">
                          {item.Title}
                        </div>
                      </NavLink>
                    ))}
                  </div>
                </InfiniteScroll>
              )} */}

              <div className="grid grid-cols-2 gap-3.5 p-3">
                {data && data.map((item, index) => (
                  <NavLink
                    to={item.path}
                    className="border-white border-[5px] rounded-md bg-white"
                    key={index}
                  >
                    <div>
                      <ImageLazy
                        wrapperClassName="!block aspect-[5/3]"
                        className="object-cover w-full h-full rounded-md"
                        effect="blur"
                        src={toAbsolutePath(item.Thumbnail)}
                      />
                    </div>
                    <div className="pt-2 pb-1">
                      <div className="text-center font-medium text-sm line-clamp-2 min-h-[40px]">
                        {item.Title}
                      </div>
                      <div className="text-center text-danger font-semibold text-sm mt-1 empty:hidden" dangerouslySetInnerHTML={{ __html: item?.PriceText }}></div>
                    </div>
                  </NavLink>
                ))}
              </div>

              {(!data || data.length === 0) && (
                <div className="flex flex-col items-center justify-center h-full">
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
                  <div className="mt-3 mb-px text-lg font-bold">
                    "Hổng" có dữ liệu !
                  </div>
                  <div>Thử chọn danh mục khác xem có gì mới ? ...</div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Page>
  );
};

export default SearchPage;
