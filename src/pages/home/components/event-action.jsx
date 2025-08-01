import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import React, { useState } from "react";
import { createSearchParams, NavLink } from "react-router-dom";
import { Icon, useNavigate } from "zmp-ui";
import AdvAPI from "../../../api/adv.api";
import { toAbsolutePath } from "../../../utils/assetPath";

const EventAction = () => {
  const navigate = useNavigate();

  let [key, setKey] = useState("")

  const { data, isLoading } = useQuery({
    queryKey: ["EventAction"],
    queryFn: async () => {
      const { data } = await AdvAPI.getAdvName("ZALO.ICON");
      return data?.data || [];
    },
  });

  return (
    <div className="px-3 py-3.5">
      <div className="relative">
        <input
          className="border border-[#e4eaed] w-full rounded-lg h-12 outline-none pl-12 focus:border-primary"
          type="text"
          name=""
          placeholder="Nhập tên dịch vụ, tin tức bạn cần ?"
          value={key}
          onChange={e => setKey(e.target.value)}
        />
        <div className="absolute w-12 h-12 top-0 left-0 flex items-center justify-center pointer-events-none text-muted">
          <Icon icon="zi-search" />
        </div>
        <div className="absolute w-12 h-12 top-0 right-0 flex items-center justify-center" onClick={() => {
          navigate({
            pathname: "/search",
            search: createSearchParams({
              key,
            }).toString(),
          });
        }}>
          <Icon icon="zi-arrow-right" />
        </div>
      </div>
      <div className="mt-3 grid grid-cols-5 gap-1.5">
        {isLoading && (
          <>
            {Array(5)
              .fill()
              .map((_, index) => (
                <div
                  className={clsx("animate-pulse bg-gray-300 rounded-lg")}
                  key={index}
                ></div>
              ))}
          </>
        )}
        {!isLoading && (
          <>
            {data &&
              data.map((item, index) => (
                <NavLink
                  to={item.Link}
                  className={clsx("bg-white cursor-pointer border border-[#e4eaed] rounded-lg text-center px-1 py-2 w-[calc(100% / 3)]")}
                  key={index}
                >
                  <div className="flex flex-col items-center justify-center mb-2 text-[#8950FC]">
                    <img className="w-7" src={toAbsolutePath(item.FileName)} />
                  </div>
                  <div className="text-[12px] font-semibold leading-4">
                    {item.Title}
                  </div>
                </NavLink>
              ))}
          </>
        )}
      </div>
    </div>
  );
};

export { EventAction };
