import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import { configAppView, openChat } from "zmp-sdk";
import { BottomNavigation, Icon, useNavigate } from "zmp-ui";
import { useVirtualKeyboardVisible } from "../../hook";
import { useCart } from "../../layout/CartProvider";
import { useLayout } from "../../layout/LayoutProvider";
import { CartIcon } from "./CartIcon";

export const NO_BOTTOM_NAVIGATION_PAGES = [
  "/catalogue/",
  "/cart",
  "/checkin",
  "/user/profile",
  "/user/customer-diary",
  "/user/customer-orders",
  "/user/customer-voucher",
  "/user/customer-wallet-card",
  "/user/customer-service",
  "/user/customer-points",
  "/user/customer-affs",
  "/user/customer-rating",
  "/user/customer-booking-manage",
  "/booking",
  "/search",
  "/contact",
  "/news",
  "/reviews",
  "/library",
  "/courses",
  "/offers",
  "/cooperate"
];

export const BOTTOM_NAVIGATION_SEARCH_PAGE = ["Type=Finish"];

export const BOTTOM_NAVIGATION_PAGES = ["/news"];

export const HEADER_DARK = [];

export const Navigation = () => {
  const { Orders } = useCart();
  const { pathname, search } = useLocation();
  const [active, setActive] = useState("/");
  const keyboardVisible = useVirtualKeyboardVisible();
  let { GlobalConfig } = useLayout();

  let navigate = useNavigate();

  useEffect(() => {
    setActive(pathname);
  }, [pathname]);

  const darkHeader = useMemo(() => {
    return HEADER_DARK.includes(pathname);
  }, [pathname]);

  useEffect(() => {
    configAppView({
      headerTextColor: darkHeader ? "black" : "white",
    });
  }, [darkHeader]);

  const noBottomNav = useMemo(() => {
    return (
      NO_BOTTOM_NAVIGATION_PAGES.some((x) => pathname.indexOf(x) > -1) &&
      BOTTOM_NAVIGATION_SEARCH_PAGE.some((x) => search.indexOf(x) === -1) &&
      BOTTOM_NAVIGATION_PAGES.some((x) => x !== pathname)
    );
  }, [pathname, search]);

  const OrdersCount = useMemo(() => {
    return (Orders && Orders?.items?.length) || 0;
  }, [Orders]);

  const onChangePath = ({ Key, Path }) => {
    if (Key === pathname) {
      navigate(0);
    } else {
      navigate(Path ? Path : Key, {
        state: {
          prevState: pathname + search,
        },
      });
    }
  };

  const openChatScreen = () => {
    openChat({
      type: GlobalConfig?.ZALO?.type,
      id: GlobalConfig?.ZALO?.ID,
      message: "Xin chào? Mình cần tư vấn ?",
    });
  };

  if (noBottomNav || keyboardVisible) {
    return <></>;
  }

  return (
    <BottomNavigation
      key={pathname}
      fixed
      activeKey={active}
      onChange={(key) => {
        if (key !== "contact") setActive(key);
      }}
    >
      <BottomNavigation.Item
        key="/"
        label="Trang chủ"
        icon={<Icon icon="zi-home" />}
        activeIcon={<Icon icon="zi-home" />}
        //linkTo="/"
        onClick={() =>
          onChangePath({
            Key: "/",
          })
        }
      />
      <BottomNavigation.Item
        label="Dịch vụ"
        key="/catalogue"
        icon={<Icon icon="zi-more-grid" />}
        activeIcon={<Icon icon="zi-more-grid-solid" />}
        //linkTo="/catalogue?TypeID=795"
        onClick={() =>
          onChangePath({
            Key: "/catalogue",
            Path: "/catalogue?TypeID=795",
          })
        }
      />
      {/* <BottomNavigation.Item
        label="Đặt lịch"
        key="/booking"
        icon={<Icon icon="zi-calendar" />}
        activeIcon={<Icon icon="zi-calendar-solid" />}
        onClick={() =>
          onChangePath({
            Key: "/booking",
          })
        }
      //linkTo="/booking"
      /> */}
      <BottomNavigation.Item
        key="/chat"
        label="Nhắn tin"
        icon={<Icon className="animate-tada" icon="zi-chat" />}
        activeIcon={<Icon className="animate-tada" icon="zi-chat" />}
        //linkTo="/cart"
        onClick={openChatScreen}
      />
      <BottomNavigation.Item
        key="/news"
        label="Tin tức"
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
            />
          </svg>
        }
        activeIcon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
            />
          </svg>
        }
        linkTo="/news"
      />
      <BottomNavigation.Item
        key="/user/customer-branch"
        label="Hệ thống"
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m6.115 5.19.319 1.913A6 6 0 0 0 8.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 0 0 2.288-4.042 1.087 1.087 0 0 0-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 0 1-.98-.314l-.295-.295a1.125 1.125 0 0 1 0-1.591l.13-.132a1.125 1.125 0 0 1 1.3-.21l.603.302a.809.809 0 0 0 1.086-1.086L14.25 7.5l1.256-.837a4.5 4.5 0 0 0 1.528-1.732l.146-.292M6.115 5.19A9 9 0 1 0 17.18 4.64M6.115 5.19A8.965 8.965 0 0 1 12 3c1.929 0 3.716.607 5.18 1.64"
            />
          </svg>
        }
        activeIcon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m6.115 5.19.319 1.913A6 6 0 0 0 8.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 0 0 2.288-4.042 1.087 1.087 0 0 0-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 0 1-.98-.314l-.295-.295a1.125 1.125 0 0 1 0-1.591l.13-.132a1.125 1.125 0 0 1 1.3-.21l.603.302a.809.809 0 0 0 1.086-1.086L14.25 7.5l1.256-.837a4.5 4.5 0 0 0 1.528-1.732l.146-.292M6.115 5.19A9 9 0 1 0 17.18 4.64M6.115 5.19A8.965 8.965 0 0 1 12 3c1.929 0 3.716.607 5.18 1.64"
            />
          </svg>
        }
        linkTo="/user/customer-branch"
      />
      <BottomNavigation.Item
        key="/user"
        label="Tài khoản"
        icon={<Icon icon="zi-user" />}
        activeIcon={<Icon icon="zi-user-solid" />}
        //linkTo="/user"
        onClick={() =>
          onChangePath({
            Key: "/user",
          })
        }
      />
    </BottomNavigation>
  );
};
