import React, { useEffect, useState } from "react";
import { Page, useNavigate } from "zmp-ui";
import Barcode from "react-barcode";
import { useLayout } from "../../layout/LayoutProvider";
import { useQuery } from "@tanstack/react-query";
import AuthAPI from "../../api/auth.api";
import { getUserInfo } from "zmp-sdk";
import { ImageLazy } from "../../components/ImagesLazy";

const CheckInPage = () => {
  const navigate = useNavigate();
  const { Auth } = useLayout();
  const [Avatar, setAvatar] = useState("");

  useEffect(() => {
    getUserInfo({
      success: (data) => {
        const { userInfo } = data;
        setAvatar(userInfo.avatar);
      },
    });
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["Barcode", Auth?.ID],
    queryFn: async () => {
      const { data } = await AuthAPI.barcode(Auth?.ID);
      return data;
    },
    enabled: Number(Auth?.ID) > -1,
  });

  return (
    <Page className="page bg-app" hideScrollbar>
      <div className="px-5 h-full flex flex-col justify-between">
        <div className="text-center text-white">
          <div className="flex justify-center mb-4">
            <ImageLazy
              wrapperClassName="w-24 aspect-square !block"
              className="w-24 aspect-square object-cover"
              effect="blur"
              src={Avatar}
            />
          </div>
          <div className="font-bold text-lg mb-1">Check In của bạn</div>
          <div className="leading-6 opacity-70">
            Vui lòng đưa mã vạch trước quầy thanh toán để thực hiện Check In.
          </div>
        </div>
        <div className="flex justify-center flex-col items-center">
          {isLoading && (
            <div className="bg-white w-[266px] mb-2 p-2 flex animate-pulse h-[142px]"></div>
          )}
          {!isLoading && <Barcode className="w-full" value={data?.code} />}
        </div>
        <div className="h-1/4 flex justify-center items-end">
          <div
            className="bg-white h-12 flex items-center justify-center w-28 rounded-3xl shadow-3xl cursor-pointer font-semibold"
            onClick={() => navigate(-1)}
          >
            Đóng
          </div>
        </div>
      </div>
    </Page>
  );
};

export default CheckInPage;
