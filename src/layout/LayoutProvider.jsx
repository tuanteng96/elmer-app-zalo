import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { createContext, useContext, useState } from "react";

import {
  getStorage,
  getSystemInfo,
  getUserInfo,
  removeStorage,
  setStorage,
} from "zmp-sdk";
import { useSnackbar } from "zmp-ui";
import AuthAPI from "../api/auth.api";
import ConfigsAPI from "../api/configs.api";

if (getSystemInfo().platform === "android") {
  const androidSafeTop = Math.round(
    window.ZaloJavaScriptInterface.getStatusBarHeight() /
    window.devicePixelRatio,
  );
  document.body.style.setProperty(
    "--zaui-safe-area-inset-top",
    `${androidSafeTop}px`,
  );
}

const LayoutContext = createContext();

const useLayout = () => {
  return useContext(LayoutContext);
};

const LayoutProvider = ({ children }) => {
  const [splashScreen, setSplashScreen] = useState(true);
  const [AccessToken, setAccessToken] = useState(null);
  const [GlobalConfig, setGlobalConfig] = useState(null);
  const [Auth, setAuth] = useState(null);
  const [Stocks, setStocks] = useState([]);
  const [Ratings, setRatings] = useState([]);
  const [CurrentStocks, setCurrentStocks] = useState(null);
  const [actionStocksVisible, setActionStocksVisible] = useState(false);

  const { openSnackbar } = useSnackbar();

  useEffect(() => {
    AuthAPI.authen({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBdXRoMlR5cGUiOiJNZW1iZXJFbnQiLCJJRCI6IjQwODQ1IiwiVG9rZW5JZCI6IjIiLCJuYmYiOjE3NTM0NjA0ODEsImV4cCI6MTgzOTg2MDQ4MSwiaWF0IjoxNzUzNDYwNDgxfQ.4qjWFxBkb-uQ_KpyJ7GGvTVPAhns419V6dxlOlRbQLc" })
      .then(({ data }) => {
        if (!data?.error) {
          onSaveAuth(data);
        } else {
          onLogout();
        }
      })
      .catch((error) => console.log(error));
    // getStorage({
    //   keys: ["AccessToken"],
    //   success: (data) => {
    //     // xử lý khi gọi api thành công
    //     let { AccessToken } = data;
    //     if (AccessToken) {
    //       // Lấy Lại Info Token
    //       AuthAPI.authen({ token: AccessToken })
    //         .then(({ data }) => {
    //           if (!data?.error && data.ZaloID) {
    //             onSaveAuth(data);
    //           } else {
    //             onLogout();
    //           }
    //         })
    //         .catch((error) => console.log(error));
    //     } else {
    //       // Check Zalo ID get Token & Info
    //       getUserInfo({
    //         success: (data) => {
    //           const { userInfo } = data;
    //           AuthAPI.authen({ ZaloID: userInfo.id })
    //             .then(({ data }) => {
    //               if (!data?.error) {
    //                 onSaveAuth(data);
    //               } else {
    //                 onLogout();
    //               }
    //             })
    //             .catch((error) => console.log(error));
    //         },
    //         fail: (error) => {
    //           console.log(error);
    //         },
    //       });
    //     }
    //   },
    //   fail: (error) => {
    //     // xử lý khi gọi api thất bại
    //     console.log(error);
    //   },
    // });
  }, []);

  useEffect(() => {
    getStorage({
      keys: ["CurrentStocks"],
      success: (data) => {
        // xử lý khi gọi api thành công
        const { CurrentStocks } = data;
        setCurrentStocks(CurrentStocks);
        setSplashScreen(false);
      },
      fail: (error) => {
        // xử lý khi gọi api thất bại
        console.log(error);
      },
    });
  }, []);

  const { isLoading: isLoadingRatings } = useQuery({
    queryKey: ["Rating", Auth],
    queryFn: async () => {
      const { data } = await AuthAPI.rating(Auth?.ID);
      return data?.data || [];
    },
    onSuccess: (data) => {
      setRatings(data);
    },
    enabled: Number(Auth?.ID) > -1,
  });

  useQuery({
    queryKey: ["GlobalConfig"],
    queryFn: () => ConfigsAPI.global(),
    onSuccess: ({ data }) => {
      setGlobalConfig(data);
    },
  });

  const onOpenActionStocks = () => {
    setActionStocksVisible(true);
  };

  const onHideActionStocks = () => {
    setActionStocksVisible(false);
  };

  const onSaveStocks = (value) => {
    setCurrentStocks(value);
    setStorage({
      data: {
        CurrentStocks: value,
      },
      success: (data) => {
        onHideActionStocks();
        openSnackbar({
          text: "Cập nhập cơ sở thành công.",
          type: "success",
          duration: 1500,
        });
      },
      fail: (error) => {
        // xử lý khi gọi api thất bại
        console.log(error);
      },
    });
  };

  const onSaveAuth = (value) => {
    setCurrentStocks(
      value?.ByStockID
        ? {
          ID: value?.ByStockID,
          Title: value?.StockName,
        }
        : null,
    );
    setAccessToken(value?.token);
    setAuth(value);
    setStorage({
      data: {
        AccessToken: value?.token,
        Auth: value,
      },
    });
  };

  const onLogout = (callback) => {
    setAccessToken(null);
    setAuth(null);
    removeStorage({ keys: ["AccessToken", "Auth"] }).then(
      () => callback && callback(),
    );
  };

  return (
    <LayoutContext.Provider
      value={{
        CurrentStocks,
        actionStocksVisible,
        AccessToken,
        Auth,
        onSaveAuth,
        onOpenActionStocks,
        onHideActionStocks,
        onSaveStocks,
        Stocks,
        setStocks,
        Ratings,
        isLoadingRatings,
        onLogout,
        splashScreen,
        GlobalConfig,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export { LayoutProvider, useLayout };
