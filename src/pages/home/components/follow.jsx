import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { followOA, getStorage, getUserInfo, setStorage } from "zmp-sdk";
import { useSnackbar } from "zmp-ui";
import { useLayout } from "../../../layout/LayoutProvider";
import { toAbsolutePathAPI } from "../../../utils/assetPath";

const Follow = () => {
  const { openSnackbar } = useSnackbar();
  let { GlobalConfig } = useLayout();

  const [isFollowOA, setIsFollowOA] = useState(false);

  useEffect(() => {
    getUserInfo().then(({ userInfo }) => {
      setIsFollowOA(userInfo.followedOA);
    });
  }, []);

  const follow = () => {
    followOA({
      id: GlobalConfig?.ZALO?.ID,
      success: (res) => {
        openSnackbar({
          text: "Đăng ký thành công !",
          type: "success",
        });
      },
    });
  };

  if (GlobalConfig?.ZALO?.type !== "oa" || isFollowOA) return <></>;

  return (
    <div className="px-3 mb-3.5">
      <div className="text-center relative after:w-full after:h-[1px] after:bg-[#e4eaed] after:top-2.5 after:left-0 after:absolute">
        <span className="z-10 font-medium bg-[#f5f5fa] px-2 relative">
          Theo dõi chúng tôi
        </span>
      </div>
      <div className="bg-white mt-3 p-3 rounded-lg">
        <div className="border-b pb-3 mb-3 text-muted text-sm">
          Nhận thông báo khuyến mãi mới nhất từ SPA.
        </div>
        <div className="flex justify-between">
          <div className="flex items-center gap-2.5">
            <div>
              <img
                className="w-12 rounded-full"
                src={toAbsolutePathAPI("/brand/images/zalo-icon-oa.jpg?" + new Date().getTime())}
              />
            </div>
            <div>
              <div className="font-semibold mb-px">Elmer Quyên Nguyễn</div>
              <div className="text-sm font-light text-[#33485c]">
                Mỹ phẩm & Làm đẹp
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={follow}
              className={clsx(
                "bg-app text-white rounded text-sm px-2.5 py-2 font-medium",
                isFollowOA && "opacity-50",
              )}
              type="button"
              disabled={isFollowOA}
            >
              {isFollowOA ? "Đã quan tâm" : "Quan tâm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Follow };
