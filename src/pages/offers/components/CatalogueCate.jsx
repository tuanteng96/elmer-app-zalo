import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import React, { useContext } from "react";
import {
  ScrollMenu,
  VisibilityContext,
  getItemsPos,
  slidingWindow,
} from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";
import { useLocation } from "react-router-dom";
import { useNavigate } from "zmp-ui";
import NewsAPI from "../../../api/news.api";
import { useDrag } from "../../../hook";
import { useLayout } from "../../../layout/LayoutProvider";

function onWheel({ getItemById, items, visibleItems, scrollToItem }, ev) {
  const isThouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15;

  if (isThouchpad) {
    ev.stopPropagation();
    return;
  }

  if (ev.deltaY < 0) {
    // NOTE: for center items
    const nextGroupItems = slidingWindow(
      items.toItemsKeys(),
      visibleItems,
    ).next();
    const { center } = getItemsPos(nextGroupItems);
    scrollToItem(getItemById(center), "smooth", "center");
  } else if (ev.deltaY > 0) {
    const prevGroupItems = slidingWindow(
      items.toItemsKeys(),
      visibleItems,
    ).prev();
    const { center } = getItemsPos(prevGroupItems);
    scrollToItem(getItemById(center), "smooth", "center");
  }
}

const Item = ({ itemId, selected, onClick, item }) => {
  const visibility = useContext(VisibilityContext);
  const visible = visibility.isItemVisible(itemId);

  return (
    <div
      onClick={() => onClick(visibility)}
      className="cursor-pointer h-14 flex items-center"
    >
      <div
        className={clsx(
          "whitespace-nowrap h-9 flex items-center font-medium px-5 rounded-full",
          selected ? "text-app bg-white" : "text-white bg-[#904c3d]",
        )}
      >
        {item.Title}
      </div>
    </div>
  );
};

const CatalogueCate = ({ queryConfig, onChange }) => {
  let { Auth } = useLayout()

  const { data, isLoading } = useQuery({
    queryKey: ["OffersCates", Auth],
    queryFn: async () => {
      const { data } = await NewsAPI.getCategories("11385");
      return data.list && data.list.length > 0
        ? [
          ...data.list
            ?.map((x) => ({ ...x.item, Id: x.item.ID }))
            .filter((x) => x.IsPublic !== 0).filter(x => Auth ? x : x.ID !== 11387),
        ]
        : [];
    },
    onSuccess: (data) => {
      if (data && data.length > 0) {
        onChange(data[0].ID)
      }
    }
  });

  const { dragStart, dragStop, dragMove, dragging } = useDrag();

  const handleDrag =
    ({ scrollContainer }) =>
      (ev) =>
        dragMove(ev, (posDiff) => {
          if (scrollContainer.current) {
            scrollContainer.current.scrollLeft += posDiff;
          }
        });

  const handleItemClick =
    (itemId) =>
      ({ getItemById, scrollToItem }) => {
        if (dragging) {
          return false;
        }
        scrollToItem(getItemById(itemId), "smooth", "center", "nearest");
        onChange && onChange(itemId);
      };

  const onInit = ({ getItemById, scrollToItem }) => {
    if (queryConfig.CateID) {
      scrollToItem(
        getItemById(queryConfig.CateID),
        "smooth",
        "center",
        "nearest",
      );
    }
  };

  if (!queryConfig.CateID) {
    return <></>;
  }

  if (isLoading)
    return (
      <div className="bg-app grid grid-cols-3 gap-4 px-3">
        {Array(3)
          .fill()
          .map((_, index) => (
            <div className="h-12 flex items-center" key={index}>
              <div className="w-full h-3 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          ))}
      </div>
    );

  return (
    <div
      className="bg-app relative z-10 border-b border-app"
      onMouseLeave={dragStop}
    >
      <ScrollMenu
        scrollContainerClassName="no-scrollbar gap-1 px-3"
        onInit={onInit}
        onWheel={onWheel}
        onMouseDown={() => dragStart}
        onMouseUp={({ getItemById, scrollToItem, visibleItems }) =>
          () => {
            dragStop();
            const { center } = getItemsPos(visibleItems);
            scrollToItem(getItemById(center), "smooth", "center");
          }}
        options={{ throttle: 0 }}
        onMouseMove={handleDrag}
      >
        {data &&
          data.map((item) => (
            <Item
              itemID={item.Id}
              key={item.Id}
              onClick={handleItemClick(item.Id)}
              selected={
                item.Id ===
                (queryConfig.CateID
                  ? Number(queryConfig.CateID)
                  : queryConfig.CateID)
              }
              item={item}
            />
          ))}
      </ScrollMenu>
    </div>
  );
};

export { CatalogueCate };
