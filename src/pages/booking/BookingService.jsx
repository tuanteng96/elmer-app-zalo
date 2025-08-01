import { TagIcon } from "@heroicons/react/24/outline";
import { useInfiniteQuery } from "@tanstack/react-query";
import clsx from "clsx";
import React, { useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import InfiniteScroll from "react-infinite-scroll-component";
import { Icon, Input } from "zmp-ui";
import ProdsAPI from "../../api/prods.api";
import { useDebounce } from "../../hook";
import { useLayout } from "../../layout/LayoutProvider";
import { formatArray } from "../../utils/formatArray";
import { PickerBookingConfim } from "./components/PickerBookingConfim";

const BookingServiceItem = ({ item }) => {
  const { control } = useFormContext();

  const isCard =
    item.OsBook > 0 || item.OsDoing > 0 || item.OsNew > 0 || item.OsBH > 0;
  const isHot = item?.Status?.search("2") > -1;

  return (
    <Controller
      name="RootIdS"
      control={control}
      render={({ field: { ref, ...field }, fieldState }) => (
        <div
          className="flex justify-between items-center px-3 py-3.5 rounded-sm cursor-pointer bg-white border-b"
          onClick={() => {
            let index =
              field.value &&
              field.value.findIndex((x) => Number(x.ID) === item.ID);
            if (index > -1) {
              field.onChange(
                field.value.filter((x) => Number(x.ID) !== item.ID),
              );
            } else {
              field.onChange([...field.value, item]);
            }
          }}
        >
          <div className="flex-1 pr-8">
            <div className="font-semibold">
              {item.Title} {isHot && "(HOT)"}
            </div>
            <div className="text-muted text-sm">
              {item.ProdItems &&
                item.ProdItems.map((prod) => prod.Title).join(", ")}
            </div>
            {isCard && (
              <div className="text-sm flex items-center text-danger">
                <TagIcon className="w-4 mr-2" />
                {item.OsBH > 0
                  ? "Đang có thẻ bảo hành"
                  : "Đang có thẻ liệu trình"}
              </div>
            )}
            {item.SaleDecs && (
              <div
                className="border border-primary rounded-sm text-primary inline-block text-xs px-2 py-1 mt-1"
                dangerouslySetInnerHTML={{
                  __html: item.SaleDecs || "Khuyến mãi 50% Khi sử dụng",
                }}
              ></div>
            )}
          </div>
          <div
            className={clsx(
              "border-2 w-6 h-6 rounded-full flex items-center justify-center",
              field.value &&
                field.value.some((x) => x.ID === item.ID) &&
                "bg-app text-white",
            )}
          >
            <Icon
              icon="zi-check"
              className={clsx(
                "!w-[16px] !h-[18px] !text-[17px] transition",
                field.value && field.value.some((x) => x.ID === item.ID)
                  ? "opacity-100"
                  : "opacity-0",
              )}
            />
          </div>
        </div>
      )}
    />
  );
};

const BookingService = ({ addBookingMutation }) => {
  const { CurrentStocks, Auth } = useLayout();
  const [Key, setKey] = useState("");

  const elRoot = useRef();

  const searchQuery = useDebounce(Key, 500);

  const { data, fetchNextPage, isLoading, hasNextPage, isFetching, refetch } =
    useInfiniteQuery({
      queryKey: ["ProdProductsNew", { CurrentStocks, searchQuery }],
      queryFn: async ({ pageParam = 1 }) => {
        const newQueryParams = {
          Pi: pageParam,
          Ps: 15,
          MemberID: Auth?.ID,
          stockid: CurrentStocks?.ID || 0,
          Key: searchQuery,
        };
        const { data } = await ProdsAPI.roots(newQueryParams);
        return data || [];
      },
      getNextPageParam: (lastPage) => {
        return lastPage.pi === lastPage.pcount || !lastPage.pcount
          ? undefined
          : lastPage.pi + 1;
      },
    });

  const List = formatArray.useInfiniteQuery(data?.pages, "lst");

  return (
    <>
      <div className="h-full flex flex-col pb-2">
        <div className="p-3 bg-white shadow-3xl mb-1">
          <Input.Search
            className="!m-0"
            placeholder="Nhập tên dịch vụ"
            clearable
            value={Key}
            onChange={(e) => setKey(e.target.value)}
            loading={isFetching}
          />
        </div>
        <div
          id="scrollableProducts"
          className="cursor-textgrow no-scrollbar overflow-auto"
          ref={elRoot}
        >
          {isLoading && (
            <>
              {Array(5)
                .fill()
                .map((_, index) => (
                  <div
                    className="px-3 py-3.5 rounded-sm cursor-pointer bg-white border-b"
                    key={index}
                  >
                    <div className="h-3.5 bg-gray-200 rounded-full w-full animate-pulse"></div>
                    <div className="h-2.5 mt-2 bg-gray-200 rounded-full w-2/4 animate-pulse"></div>
                  </div>
                ))}
            </>
          )}

          {!isLoading && (
            <>
              {List && List.length > 0 && (
                <InfiniteScroll
                  dataLength={List.length}
                  next={fetchNextPage}
                  hasMore={hasNextPage}
                  loader={
                    <div className="px-3 py-3.5 rounded-sm cursor-pointer bg-white border-b">
                      <div className="h-3.5 bg-gray-200 rounded-full w-full animate-pulse"></div>
                      <div className="h-2.5 mt-2 bg-gray-200 rounded-full w-2/4 animate-pulse"></div>
                    </div>
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
                  <div className="grid grid-cols-1">
                    {List.map((item, index) => (
                      <BookingServiceItem item={item} key={index} />
                    ))}
                  </div>
                </InfiniteScroll>
              )}

              {(!List || List.length === 0) && (
                <div className="h-full flex justify-center items-center flex-col pt-10">
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
                  <div>Hiện tại chưa có dữ liệu dịch vụ nào ? ...</div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-full pb-safe-bottom bg-white">
        <div className="h-12">
          <PickerBookingConfim addBookingMutation={addBookingMutation}>
            {({ open }) => (
              <button
                onClick={open}
                type="button"
                className="w-full h-full text-white uppercase font-semibold text-sm bg-app"
              >
                Xác nhận đặt lịch
              </button>
            )}
          </PickerBookingConfim>
        </div>
      </div>
    </>
  );
};

export default BookingService;
