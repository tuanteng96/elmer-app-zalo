import { useQuery } from "@tanstack/react-query";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getUserInfo } from "zmp-sdk";
import ConfigsAPI from "../api/configs.api";
import { SheetRegistration } from "../components/SheetRegistration";
import { useLayout } from "./LayoutProvider";
import { SheetStocks } from "../components/sheet-stocks";

const ConfigContext = createContext();

const useConfigs = () => {
  return useContext(ConfigContext);
};

const MasterLayout = ({ children }) => {
  const [ZaloInfo, setZaloInfo] = useState(null);
  const { splashScreen, Auth } = useLayout();

  const [sheetProtected, setSheetProtected] = useState(false);

  useEffect(() => {
    getUserInfo({
      success: (data) => {
        const { userInfo } = data;
        setZaloInfo(userInfo);
      },
      fail: (error) => {
        // xử lý khi gọi api thất bại
        setZaloInfo(error);
      },
    });
  }, [Auth]);

  const openSheetProtected = () => {
    setSheetProtected(true);
  };

  const closeSheetProtected = () => {
    setSheetProtected(false);
  };

  return (
    <ConfigContext.Provider
      value={{
        ZaloInfo,
        sheetProtected,
        openSheetProtected,
        closeSheetProtected,
      }}
    >
      {children}
      <SheetRegistration open={sheetProtected} onClose={closeSheetProtected} />
      {!splashScreen && <SheetStocks />}
    </ConfigContext.Provider>
  );
};

export { MasterLayout, useConfigs };
