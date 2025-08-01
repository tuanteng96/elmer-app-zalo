import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Icon, Page, Text, Modal, useSnackbar } from "zmp-ui";
import { useLayout } from "../../layout/LayoutProvider";
import { useConfigs } from "../../layout/MasterLayout";
import { toAbsolutePath } from "../../utils/assetPath";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { formatString } from "../../utils/formatString";
import Logo from "../../static/images/logo.png";

const UserPage = () => {
  const { Auth, onLogout } = useLayout();
  const { ZaloInfo } = useConfigs();
  const navigate = useNavigate();

  const { openSnackbar } = useSnackbar();

  const [dialogVisible, setDialogVisible] = useState(false);

  const { pathname } = useLocation();

  const getColorGroups = (MemberGroups) => {
    if (MemberGroups && MemberGroups.length > 0 && MemberGroups[0].Color) {
      return MemberGroups[0].Color
    }
    return "#848484"
  }

  return (
    <Page className="page" hideScrollbar>
      <div className="navbar fixed top-0 left-0 min-w-[100vw] max-w-[100vw] z-[999] transition px-3 bg-app">
        <div className="w-2/3 relative flex items-center h-full">
          <Text.Title className="text-white truncate transition">
            Hồ sơ
          </Text.Title>
        </div>
      </div>

      {!Auth?.ID && (
        <div
          className="px-3 pt-3 pb-1"
          onClick={() => navigate(`${pathname}?fromProtected=${pathname}`)}
        >
          <div className="bg-app/90 text-white p-4 rounded-lg relative z-[1]">
            <div className="text-[16px] font-semibold">Đăng nhập thành viên</div>
            <div className="text-[13px] mt-1">
              Quản lý thẻ thành viên, khoá học, mã giảm giá ...{" "}
            </div>
            <div className="absolute right-[20px] top-2/4 rounded-full bg-app flex justify-center w-12 h-12 -z-[1] -translate-y-2/4 skew-y-[20deg]">
              <CurrencyDollarIcon className="w-8 text-white opacity-40" />
            </div>
            <div className="absolute right-[80px] top-2/4 rounded-full bg-app flex justify-center w-6 h-6 -z-[1] -translate-y-2/4 skew-y-[10deg]">
              <CurrencyDollarIcon className="w-6 text-white opacity-40" />
            </div>
          </div>
        </div>
      )}

      {Auth?.ID && (
        <>
          <NavLink to="/user/profile" className="bg-white p-3 flex items-center mb-3">
            <div className="w-12">
              <img
                className="shadow-3xl rounded-full w-full"
                src={
                  Auth?.Photo || Auth?.Avatar
                    ? toAbsolutePath(Auth?.Photo || Auth?.Avatar)
                    : ZaloInfo?.avatar
                }
              />
            </div>
            <div className="pl-3 flex-1">
              <div className="text-[16px] font-medium leading-6">
                {Auth?.FullName}
              </div>
              <div className="text-gray-700 text-[14px]">
                Thông tin cá nhân
              </div>
            </div>
            <div className="w-12 h-12 flex items-center justify-center text-app">
              <Icon icon="zi-edit-text" />
            </div>
          </NavLink>
          <div className="px-3">
            <div className="relative flex flex-col overflow-hidden rounded-md bg-app p-5 h-[200px]" style={{
              background: getColorGroups(Auth?.MemberGroups)
            }}>
              <div className="grow">
                <div className="uppercase text-white font-medium tracking-[2px] text-base">Thành viên</div>
                <div className="text-white mt-4 font-semibold">{formatString.getGroupsName(Auth, "")}</div>
              </div>
              <div className="text-white">
                <div className="text-xs font-medium uppercase mb-2">Tên đăng nhập</div>
                <div className="text-[17px] font-semibold tracking-wide">{Auth?.FullName}</div>
              </div>
              <div className="absolute right-0 top-0 -m-3 size-24 rounded-full bg-white/20" />
              <div className="absolute bottom-5 right-5">
                <img className="w-[70px]" src={Logo} />
              </div>
            </div>
          </div>
        </>
      )}


      <div className="px-3 mt-3 mb-3">
        <div className="bg-white rounded-md overflow-hidden">

          <NavLink className="block group" to="/cooperate" state={{ prevState: "/user" }}>
            <div
              className="px-3 py-4 flex items-center cursor-pointer"
            >
              <div className="w-7">
                <img
                  className="w-7"
                  src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBVcGxvYWRlZCB0bzogU1ZHIFJlcG8sIHd3dy5zdmdyZXBvLmNvbSwgR2VuZXJhdG9yOiBTVkcgUmVwbyBNaXhlciBUb29scyAtLT4NCjxzdmcgaGVpZ2h0PSI4MDBweCIgd2lkdGg9IjgwMHB4IiB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiANCgkgdmlld0JveD0iMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPGNpcmNsZSBzdHlsZT0iZmlsbDojQzJENUQ4OyIgY3g9IjI1NiIgY3k9IjI1NiIgcj0iMjU2Ii8+DQoJPGNpcmNsZSBzdHlsZT0iZmlsbDojQzJENUQ4OyIgY3g9IjI1NiIgY3k9IjI1NiIgcj0iMjU2Ii8+DQo8L2c+DQo8cGF0aCBzdHlsZT0iZmlsbDojNDU5OThCOyIgZD0iTTE2MC44MTIsMzM1LjE3MmMtMjAuOTIsMC0xMDUuOTY4LTUuMTg0LTEyNy42NCw0Ni40NzZDNTYuNjc2LDQyMy4xMjQsOTEuMzc2LDQ1NiwxMzMuMjI4LDQ4MA0KCWgyNy41ODRoODAuMDU2YzAsMCw2NC4wNDgtMjIuMDU2LDUxLjI0NC04Ni40MDhDMjc5LjI5MiwzMjkuMjQ0LDE4My4yMjgsMzM1LjE3MiwxNjAuODEyLDMzNS4xNzJ6Ii8+DQo8cGF0aCBzdHlsZT0iZmlsbDojM0Y4QzdGOyIgZD0iTTI5Mi4xLDM5My45MjhjLTExLjkwOC01OS44MzYtOTUuNzUyLTU5LjItMTI1LjUtNTguODJjMzYuNTE2LDAuNjQ4LDk5LjgwNCw3LjQyNCwxMTAuMDMyLDU4LjgyDQoJYzEyLjgwNCw2NC4zNTItNTEuMjM2LDg2Ljc0LTUxLjIzNiw4Ni43NGgxNS40NjRDMjQwLjg2OCw0ODAuNjY4LDMwNC45MTYsNDU4LjI4LDI5Mi4xLDM5My45Mjh6Ii8+DQo8ZWxsaXBzZSBzdHlsZT0iZmlsbDojRjVGNUY1OyIgY3g9IjE2MC44IiBjeT0iMzM5LjM2IiByeD0iMzkuMTcyIiByeT0iMTUuMzg4Ii8+DQo8cGF0aCBzdHlsZT0iZmlsbDojRTZDQkMzOyIgZD0iTTE5NS41NTYsMzMxLjE1MmgwLjAxNmwtOS41OC0yOS43OTJsLTI1LjE4LTEuODY0bC0yNS4xODQsMS44NjRsLTkuNTg0LDI5Ljc5MmgwLjAxNg0KCWMtMC4xNCwwLjQxMi0wLjIzMiwwLjgyNC0wLjIzMiwxLjI0YzAsNi4xNzIsMTUuNjYsMTEuMTcyLDM0Ljk3NiwxMS4xNzJjMTkuMzA4LDAsMzQuOTcyLTUsMzQuOTcyLTExLjE3Mg0KCUMxOTUuNzgsMzMxLjk3NiwxOTUuNywzMzEuNTY0LDE5NS41NTYsMzMxLjE1MnoiLz4NCjxwYXRoIHN0eWxlPSJmaWxsOiNEOUJGQjg7IiBkPSJNMTk1LjU1NiwzMzEuMTUyaDAuMDE2bC05LjU4LTI5Ljc5MmwtMjUuMTgtMS44NjRsLTQuOSwwLjM2bDIwLjI4LDEuNTA0bDkuNTgsMjkuNzkyaC0wLjAwOA0KCWMwLjE0LDAuNDEyLDAuMjI4LDAuODI0LDAuMjI4LDEuMjRjMCw1LjYzNi0xMy4wODQsMTAuMjg4LTMwLjA4LDExLjA1NmMxLjYsMC4wNzIsMy4yMzIsMC4xMTYsNC45LDAuMTE2DQoJYzE5LjMxMiwwLDM0Ljk3Mi01LDM0Ljk3Mi0xMS4xNzJDMTk1Ljc4LDMzMS45NzYsMTk1LjcsMzMxLjU2NCwxOTUuNTU2LDMzMS4xNTJ6Ii8+DQo8cGF0aCBzdHlsZT0iZmlsbDojRkZFMUQ5OyIgZD0iTTIzMy41NjQsMTgxLjI4di0yOS4xMDRjMC0yMi43LTE2LjE0OC00MC44NDQtNzIuNzUyLTQwLjg0NFM4OC4wNiwxMjkuNDc2LDg4LjA2LDE1Mi4xNzZ2MjkuMTA0DQoJYzAsMC0xMS4xOTYsMC44MjgtMTEuMTk2LDguMzk2djMwLjk3MmMwLDcuNTY4LDIuNzk2LDEzLjc5NiwxMS4xOTYsMTMuNzk2YzAsMzcuODM2LDMzLjYzNiw4MS4xNDQsNzIuNzUyLDgxLjE0NA0KCWMzOS4xLDAsNzIuNzUyLTQzLjMwNCw3Mi43NTItODEuMTQ0YzguMzk2LDAsMTEuMTg4LTYuMjI4LDExLjE4OC0xMy43OTZ2LTMwLjk3MkMyNDQuNzUyLDE4Mi4xMDgsMjMzLjU2NCwxODEuMjgsMjMzLjU2NCwxODEuMjh6Ig0KCS8+DQo8cGF0aCBzdHlsZT0iZmlsbDojRjJENkNFOyIgZD0iTTE2MC44MTIsMTExLjMzMmMtMS40MjgsMC0yLjgyLDAuMDItNC4yMDQsMC4wNDRjNTMuMiwwLjg4NCw2OC41NTYsMTguNjcyLDY4LjU1Niw0MC44djI5LjEwNA0KCXY1My4xNjRjMCwzNi40NzItMzEuMjY0LDc4LjAxNi02OC41NTYsODAuOTY0YzEuNCwwLjEwOCwyLjc4OCwwLjE4LDQuMjA0LDAuMThjMzkuMSwwLDcyLjc1Mi00My4zMDQsNzIuNzUyLTgxLjE0NFYxODEuMjh2LTI5LjEwNA0KCUMyMzMuNTY0LDEyOS40NzYsMjE3LjQxNiwxMTEuMzMyLDE2MC44MTIsMTExLjMzMnoiLz4NCjxwYXRoIHN0eWxlPSJmaWxsOiM5OTYwMkU7IiBkPSJNMTYwLjgxMiwxMTEuMzMyYy01Ni42LDAtNzIuNzUyLDE4LjE0NC03Mi43NTIsNDAuODQ0djI5LjEwNHYzMC43OA0KCWMyLjU4NC0xMi45NTYsOS45OTItNDkuODkyLDI2LjYyLTYxLjk0OGMxMy4yNCwzLjc4NCwyOS4wODQsNS45ODgsNDYuMTI0LDUuOTg4czMyLjg4OC0yLjIwNCw0Ni4xMi01Ljk4OA0KCWMxNi42MzIsMTIuMDYsMjQuMDM2LDQ4Ljk5MiwyNi42MjQsNjEuOTQ4di0zMC43OHYtMjkuMTA0QzIzMy41NjQsMTI5LjQ3NiwyMTcuNDE2LDExMS4zMzIsMTYwLjgxMiwxMTEuMzMyeiIvPg0KPHBhdGggc3R5bGU9ImZpbGw6IzhDNTgyQTsiIGQ9Ik0xNjAuODEyLDExMS4zMzJjLTEuNDI4LDAtMi44MTIsMC4wMi00LjE5NiwwLjA0NGM1My4xOTIsMC44ODgsNjguNTQ4LDE4LjY3Miw2OC41NDgsNDAuOHYyNy42MTYNCgljNC40NTIsMTIuNjY4LDcuMDcyLDI1LjYyNCw4LjQsMzIuMjY4di0zMC43OHYtMjkuMTA0QzIzMy41NjQsMTI5LjQ3NiwyMTcuNDE2LDExMS4zMzIsMTYwLjgxMiwxMTEuMzMyeiIvPg0KPGVsbGlwc2Ugc3R5bGU9ImZpbGw6I0Y1RjVGNTsiIGN4PSIxMzguNTY0IiBjeT0iMjAzLjY2OCIgcng9IjExLjE4OCIgcnk9IjguMzk2Ii8+DQo8Y2lyY2xlIHN0eWxlPSJmaWxsOiM3MzQ4MjI7IiBjeD0iMTM4LjU2NCIgY3k9IjIwMy42NjgiIHI9IjUuNTk2Ii8+DQo8ZWxsaXBzZSBzdHlsZT0iZmlsbDojRjVGNUY1OyIgY3g9IjE4OC45MiIgY3k9IjIwMy42NjgiIHJ4PSIxMS4xODgiIHJ5PSI4LjM5NiIvPg0KPGNpcmNsZSBzdHlsZT0iZmlsbDojNzM0ODIyOyIgY3g9IjE4OC45MiIgY3k9IjIwMy42NjgiIHI9IjUuNTk2Ii8+DQo8Zz4NCgk8cGF0aCBzdHlsZT0iZmlsbDojNDU5OThCOyIgZD0iTTQ3OC44MjgsMzgxLjY0OGMtMjEuNjcyLTUxLjY2NC0xMDYuNzItNDYuNjQ0LTEyNy42NC00Ni42NDQNCgkJYy0yMi40MTYsMC0xMTguNDgtNS44NDQtMTMxLjI4OCw1OC41MDhDMjA3LjA4NCw0NTcuODY0LDI3MS4xMzYsNDgwLDI3MS4xMzYsNDgwaDgwLjA1NmgyNy41ODgNCgkJQzQyMC42MjQsNDU2LDQ1NS4zMjQsNDIzLjEyNCw0NzguODI4LDM4MS42NDh6Ii8+DQoJPHBhdGggc3R5bGU9ImZpbGw6IzQ1OTk4QjsiIGQ9Ik0yNzAuNjgsNTExLjU1NmMzLjczNi0wLjIxNiw3LjQ0NC0wLjQ4NCwxMS4xMjgtMC44NTJjMC4xNDgtMC4wMTIsMC4yOTItMC4wMiwwLjQ0LTAuMDM2DQoJCWMzLjc3Ni0wLjM4OCw3LjUyNC0wLjg4OCwxMS4yNTItMS40MjRjMS4wMjQtMC4xNTYsMi4wNDQtMC4zMTIsMy4wNjgtMC40NzZjMy4zODQtMC41NCw2Ljc0OC0xLjEyOCwxMC4wODQtMS43OTYNCgkJYzAuMzg0LTAuMDgsMC43NjgtMC4xNCwxLjE2LTAuMjJjMy41Ni0wLjczNiw3LjA4NC0xLjU2OCwxMC41ODQtMi40NDRjMS4xMTItMC4yOCwyLjIzMi0wLjU3MiwzLjM0NC0wLjg2OA0KCQljMi45MzItMC43NzYsNS44NTItMS42LDguNzUyLTIuNDg0YzAuNzU2LTAuMjM2LDEuNTI4LTAuNDQ0LDIuMjgtMC42ODhjMy4yLTEsNi4zNTYtMi4wODQsOS40OTItMy4yMDQNCgkJYzEuMjY0LTAuNDYsMi41MzItMC45MiwzLjc4OC0xLjRjMi40MDgtMC45MDgsNC43ODQtMS44NDgsNy4xNTYtMi44MjRjMS40LTAuNTc2LDIuNzg0LTEuMTQ4LDQuMTcyLTEuNzQ4DQoJCWMyLjU3Ni0xLjEwOCw1LjExNi0yLjI2NCw3LjY0OC0zLjQ1NmMxLjQ0NC0wLjY4NCwyLjg4NC0xLjM4OCw0LjMxMi0yLjA5MmMxLjg0NC0wLjkxNiwzLjY3Mi0xLjg1Niw1LjQ5Mi0yLjgxNg0KCQljMi4xNC0xLjEyNCw0LjI1Ni0yLjI3Miw2LjM2OC0zLjQ2YzEuODA0LTEuMDE2LDMuNjA0LTIuMDQsNS4zODQtMy4wOTJjMS42MzItMC45NzIsMy4yNTItMS45NjgsNC44NjgtMi45NzYNCgkJYzEuMjgtMC44MDQsMi41Ni0xLjYyNCwzLjgyOC0yLjQ1MmMyLjk2OC0xLjkzNiw1LjkwNC0zLjkyOCw4Ljc4OC01Ljk4NGMwLjkyNC0wLjY1NiwxLjg2LTEuMzA0LDIuNzc2LTEuOTc2DQoJCWMxLjc5Ni0xLjMxMiwzLjU3Ni0yLjY1Niw1LjMyOC00LjAxNmMwLjc4OC0wLjYwNCwxLjU2OC0xLjIyOCwyLjM0NC0xLjgzNmMzLjc3Mi0yLjk4NCw3LjQ3Ni02LjA2LDExLjA3Ni05LjI0OA0KCQljMC4wNDgtMC4wNCwwLjA4OC0wLjA4NCwwLjEzMi0wLjExMmMxLjkwNC0xLjY4OCwzLjc2NC0zLjQwNCw1LjYwOC01LjE0YzAuMzkyLTAuMzYsMC43NjQtMC43MzIsMS4xNDgtMS4wOTINCgkJYzUuNjcyLTUuNDA4LDExLjEtMTEuMDcyLDE2LjI1Ni0xNi45NjhjMC4xMTItMC4xMjQsMC4yMjgtMC4yNTYsMC4zMzYtMC4zODRjMTAuNzQ4LTEyLjM0OCwyMC4zMjgtMjUuNzI4LDI4LjU4LTM5Ljk4NEgzNC4zMzYNCgkJYzguMjUyLDE0LjI1MiwxNy44MzIsMjcuNjM2LDI4LjU4LDM5Ljk4NGMwLjEwOCwwLjEyNCwwLjIyNCwwLjI1NiwwLjMzNiwwLjM4NGM1LjE1Niw1LjkwOCwxMC41ODQsMTEuNTY0LDE2LjI1NiwxNi45NjgNCgkJYzAuMzg0LDAuMzY0LDAuNzU2LDAuNzM2LDEuMTQ4LDEuMDkyYzEuODQ0LDEuNzQsMy43MTIsMy40NTIsNS42MDgsNS4xNGMwLjA0NCwwLjA0LDAuMDg0LDAuMDc2LDAuMTMyLDAuMTEyDQoJCWMzLjU5MiwzLjE4OCw3LjI5Niw2LjI2LDExLjA3Niw5LjI0OGMwLjc3NiwwLjYxMiwxLjU1NiwxLjIzNiwyLjM0NCwxLjgzNmMxLjc1MiwxLjM2NCwzLjUzMiwyLjcwNCw1LjMyOCw0LjAxNg0KCQljMC45MTYsMC42NzIsMS44NTIsMS4zMiwyLjc3NiwxLjk3NmMyLjg5MiwyLjA1Niw1LjgyLDQuMDQ4LDguNzg4LDUuOTg0YzEuMjY4LDAuODI4LDIuNTQ4LDEuNjQ4LDMuODI4LDIuNDUyDQoJCWMxLjYwOCwxLjAwOCwzLjIzNiwyLjAwNCw0Ljg2OCwyLjk3NmMxLjc3MiwxLjA2NCwzLjU4LDIuMDg0LDUuMzg0LDMuMDkyYzIuMSwxLjE4LDQuMjI4LDIuMzM2LDYuMzY4LDMuNDYNCgkJYzEuODIsMC45NTYsMy42NDgsMS45MDQsNS40OTIsMi44MTZjMS40MjgsMC43MDgsMi44NjgsMS40MTIsNC4zMTIsMi4wOTJjMi41MzYsMS4xOTIsNS4wODQsMi4zNTIsNy42NjgsMy40NjQNCgkJYzEuMzc2LDAuNTg4LDIuNzYsMS4xNjQsNC4xNDQsMS43MzZjMi4zNzYsMC45NzYsNC43NTYsMS45Miw3LjE2NCwyLjgyNGMxLjI1NiwwLjQ3NiwyLjUyNCwwLjk0LDMuNzg4LDEuMzk2DQoJCWMzLjEzNiwxLjEyNCw2LjI5MiwyLjIxMiw5LjQ4OCwzLjIxMmMwLjc1NiwwLjI0LDEuNTI4LDAuNDUyLDIuMjg4LDAuNjg4YzIuODk2LDAuODgsNS44MTIsMS43MDQsOC43NTIsMi40ODQNCgkJYzEuMTA4LDAuMjk2LDIuMjI4LDAuNTg0LDMuMzQ0LDAuODY0YzMuNSwwLjg4LDcuMDI0LDEuNzEyLDEwLjU4NCwyLjQ0YzAuMzg4LDAuMDg0LDAuNzc2LDAuMTQ4LDEuMTYsMC4yMjQNCgkJYzMuMzM2LDAuNjY4LDYuNywxLjI2LDEwLjA4NCwxLjhjMS4wMTYsMC4xNjQsMi4wNCwwLjMyLDMuMDY0LDAuNDY4YzMuNzM2LDAuNTQ4LDcuNDc2LDEuMDQ4LDExLjI1NiwxLjQyOA0KCQljMC4xNCwwLjAxNiwwLjI4OCwwLjAyNCwwLjQzNiwwLjAzNmMzLjY4NCwwLjM3Miw3LjQsMC42MzYsMTEuMTI4LDAuODQ4YzAuOTkyLDAuMDU2LDEuOTgsMC4xMDgsMi45NzIsMC4xNTINCgkJYzMuOSwwLjE4LDcuOCwwLjMsMTEuNzIsMC4zYzMuOTIsMCw3LjgyLTAuMTIsMTEuNzA0LTAuMjk2QzI2OC42OTYsNTExLjY2LDI2OS42ODgsNTExLjYwOCwyNzAuNjgsNTExLjU1NnoiLz4NCjwvZz4NCjxwYXRoIHN0eWxlPSJmaWxsOiMzRjhDN0Y7IiBkPSJNMzU2Ljk4NCwzMzUuMTE2YzM2LjUxMiwwLjY0OCw5OS43OTYsNy40MiwxMTAuMDI4LDU4LjgxMmMwLjM4OCwxLjkyNCwwLjY5MiwzLjgxMiwwLjkzMiw1LjY2NA0KCWMzLjg3Mi01LjY5Niw3LjQ2LTExLjU4NCwxMC44NzItMTcuNTg4QzQ1OC43OCwzMzQuMjIsMzg0LjU5MiwzMzQuNzU2LDM1Ni45ODQsMzM1LjExNnoiLz4NCjxlbGxpcHNlIHN0eWxlPSJmaWxsOiNGNUY1RjU7IiBjeD0iMzUxLjIiIGN5PSIzMzkuMzYiIHJ4PSIzOS4xNzIiIHJ5PSIxNS4zODgiLz4NCjxwYXRoIHN0eWxlPSJmaWxsOiNFNkNCQzM7IiBkPSJNMzg1LjkyOCwzMzEuMTUyaDAuMDE2bC05LjU4LTI5Ljc5MmwtMjUuMTg0LTEuODY0TDMyNiwzMDEuMzZsLTkuNTg0LDI5Ljc5MmgwLjAxNg0KCWMtMC4xNCwwLjQxMi0wLjIzMiwwLjgyNC0wLjIzMiwxLjI0YzAsNi4xNzIsMTUuNjYsMTEuMTcyLDM0Ljk3MiwxMS4xNzJjMTkuMzE2LDAsMzQuOTc2LTUsMzQuOTc2LTExLjE3Mg0KCUMzODYuMTY0LDMzMS45NzYsMzg2LjA4LDMzMS41NjQsMzg1LjkyOCwzMzEuMTUyeiIvPg0KPHBhdGggc3R5bGU9ImZpbGw6I0Q5QkZCODsiIGQ9Ik0zODUuOTI4LDMzMS4xNTJoMC4wMTZsLTkuNTgtMjkuNzkybC0yNS4xODQtMS44NjRsLTQuODk2LDAuMzZsMjAuMjgsMS41MDRsOS41ODQsMjkuNzkyaC0wLjAxNg0KCWMwLjE0NCwwLjQxMiwwLjIzMiwwLjgyNCwwLjIzMiwxLjI0YzAsNS42MzYtMTMuMDg0LDEwLjI4OC0zMC4wOCwxMS4wNTZjMS42LDAuMDcyLDMuMjMyLDAuMTE2LDQuODk2LDAuMTE2DQoJYzE5LjMxNiwwLDM0Ljk3Ni01LDM0Ljk3Ni0xMS4xNzJDMzg2LjE2NCwzMzEuOTc2LDM4Ni4wOCwzMzEuNTY0LDM4NS45MjgsMzMxLjE1MnoiLz4NCjxwYXRoIHN0eWxlPSJmaWxsOiNGRkUxRDk7IiBkPSJNNDIzLjkzNiwxODEuMjh2LTI5LjEwNGMwLTIyLjctMTYuMTQ4LTQwLjg0NC03Mi43NTItNDAuODQ0cy03Mi43NDgsMTguMTQ0LTcyLjc0OCw0MC44NDR2MjkuMTA0DQoJYzAsMC0xMS4xOTYsMC44MjgtMTEuMTk2LDguMzk2djMwLjk3MmMwLDcuNTY4LDIuNzk2LDEzLjc5NiwxMS4xOTYsMTMuNzk2YzAsMzcuODM2LDMzLjY0LDgxLjE0NCw3Mi43NDgsODEuMTQ0DQoJczcyLjc1Mi00My4zMDQsNzIuNzUyLTgxLjE0NGM4LjM5NiwwLDExLjE5Mi02LjIyOCwxMS4xOTItMTMuNzk2di0zMC45NzJDNDM1LjEyOCwxODIuMTA4LDQyMy45MzYsMTgxLjI4LDQyMy45MzYsMTgxLjI4eiIvPg0KPHBhdGggc3R5bGU9ImZpbGw6I0YyRDZDRTsiIGQ9Ik0zNTEuMTg4LDExMS4zMzJjLTEuNDI4LDAtMi44MTYsMC4wMi00LjE5NiwwLjA0NGM1My4xOTYsMC44ODQsNjguNTUyLDE4LjY3Miw2OC41NTIsNDAuOHYyOS4xMDQNCgl2NTMuMTY0YzAsMzYuNDcyLTMxLjI2LDc4LjAxNi02OC41NTIsODAuOTY0YzEuNCwwLjEwOCwyLjc4OCwwLjE4LDQuMTk2LDAuMThjMzkuMTA4LDAsNzIuNzUyLTQzLjMwNCw3Mi43NTItODEuMTQ0VjE4MS4yOHYtMjkuMTA0DQoJQzQyMy45MzYsMTI5LjQ3Niw0MDcuNzg4LDExMS4zMzIsMzUxLjE4OCwxMTEuMzMyeiIvPg0KPHBhdGggc3R5bGU9ImZpbGw6Izk5NjAyRTsiIGQ9Ik0zNTEuMTg4LDExMS4zMzJjLTU2LjYsMC03Mi43NTIsMTguMTQ0LTcyLjc1Miw0MC44NDR2MjkuMTA0djMwLjc4DQoJYzIuNTg4LTEyLjk1Niw5Ljk5Mi00OS44OTIsMjYuNjI0LTYxLjk0OGMxMy4yNCwzLjc4NCwyOS4wODQsNS45ODgsNDYuMTIsNS45ODhzMzIuODk2LTIuMjA0LDQ2LjEyNC01Ljk4OA0KCWMxNi42MjgsMTIuMDYsMjQuMDM2LDQ4Ljk5MiwyNi42Miw2MS45NDh2LTMwLjc4di0yOS4xMDRDNDIzLjkzNiwxMjkuNDc2LDQwNy43ODgsMTExLjMzMiwzNTEuMTg4LDExMS4zMzJ6Ii8+DQo8cGF0aCBzdHlsZT0iZmlsbDojOEM1ODJBOyIgZD0iTTM1MS4xODgsMTExLjMzMmMtMS40MiwwLTIuODA0LDAuMDItNC4xODgsMC4wNDRjNTMuMTg4LDAuODg4LDY4LjU0NCwxOC42NzIsNjguNTQ0LDQwLjh2MjcuNjE2DQoJYzQuNDU2LDEyLjY2OCw3LjA2OCwyNS42MjQsOC4zOTYsMzIuMjY4di0zMC43OHYtMjkuMTA0QzQyMy45MzYsMTI5LjQ3Niw0MDcuNzg4LDExMS4zMzIsMzUxLjE4OCwxMTEuMzMyeiIvPg0KPGVsbGlwc2Ugc3R5bGU9ImZpbGw6I0Y1RjVGNTsiIGN4PSIzMjguOTIiIGN5PSIyMDMuNjY4IiByeD0iMTEuMTkyIiByeT0iOC4zOTYiLz4NCjxjaXJjbGUgc3R5bGU9ImZpbGw6IzczNDgyMjsiIGN4PSIzMjguOTIiIGN5PSIyMDMuNjY4IiByPSI1LjU5NiIvPg0KPGVsbGlwc2Ugc3R5bGU9ImZpbGw6I0Y1RjVGNTsiIGN4PSIzNzkuMzIiIGN5PSIyMDMuNjY4IiByeD0iMTEuMTkyIiByeT0iOC4zOTYiLz4NCjxjaXJjbGUgc3R5bGU9ImZpbGw6IzczNDgyMjsiIGN4PSIzNzkuMzIiIGN5PSIyMDMuNjY4IiByPSI1LjU5NiIvPg0KPHBhdGggc3R5bGU9ImZpbGw6I0Y1RjVGNTsiIGQ9Ik0zMzYsMzY4aC01NmMtMTMuMjM2LDAtMjQsMTAuNzY0LTI0LDI0YzAtMTMuMjM2LTEwLjc2NC0yNC0yNC0yNGgtNTZjLTEzLjIzNiwwLTI0LDEwLjc2NC0yNCwyNHY1Ng0KCWMwLDEzLjIzNiwxMC43NjQsMjQsMjQsMjRoNTZjMTMuMjM2LDAsMjQtMTAuNzY0LDI0LTI0YzAsMTMuMjM2LDEwLjc2NCwyNCwyNCwyNGg1NmMxMy4yMzYsMCwyNC0xMC43NjQsMjQtMjR2LTU2DQoJQzM2MCwzNzguNzY0LDM0OS4yMzYsMzY4LDMzNiwzNjh6Ii8+DQo8cGF0aCBzdHlsZT0iZmlsbDojRkZENDY0OyIgZD0iTTMwMCw0MjhoLTg4Yy00LjQxNiwwLTgtMy41ODQtOC04czMuNTg0LTgsOC04aDg4YzQuNDE2LDAsOCwzLjU4NCw4LDhTMzA0LjQxNiw0MjgsMzAwLDQyOHoiLz4NCjxnPg0KCTxwYXRoIHN0eWxlPSJmaWxsOiNFMTZCNUE7IiBkPSJNMzM2LDM3NmgtNTZjLTguODI0LDAtMTYsNy4xNzYtMTYsMTZ2MTJoMTZ2LTEyaDU2bC0wLjAyNCw1NkgyODB2LTEyaC0xNnYxMg0KCQljMCw4LjgyNCw3LjE3NiwxNiwxNiwxNmg1NmM4LjgyNCwwLDE2LTcuMTc2LDE2LTE2di01NkMzNTIsMzgzLjE3NiwzNDQuODI0LDM3NiwzMzYsMzc2eiIvPg0KCTxwYXRoIHN0eWxlPSJmaWxsOiNFMTZCNUE7IiBkPSJNMjMyLDQzNnYxMmgtNTZ2LTU2aDU2bC0wLjAwNCwxMkgyNDh2LTEyYzAtOC44MjQtNy4xNzYtMTYtMTYtMTZoLTU2Yy04LjgyNCwwLTE2LDcuMTc2LTE2LDE2djU2DQoJCWMwLDguODI0LDcuMTc2LDE2LDE2LDE2aDU2YzguODI0LDAsMTYtNy4xNzYsMTYtMTZ2LTEySDIzMnoiLz4NCjwvZz4NCjwvc3ZnPg=="
                />
              </div>
              <div className="flex-1 pl-3">
                <div className="flex items-center justify-between relative before:content-[''] before:absolute before:w-full before:h-[1px] before:bg-[#f5f5fa] before:-bottom-4">
                  <div>
                    <div className="font-medium">Hợp tác</div>
                    <div className="text-muted text-[14px]">
                      Tham gia hợp tác cùng Elmer
                    </div>
                  </div>
                  <div className="text-muted">
                    <Icon icon="zi-chevron-right" />
                  </div>
                </div>
              </div>
            </div>
          </NavLink>

          <div className="block group" onClick={() => {
            if (Auth?.ID) {
              navigate("/reviews/add", {
                state: {
                  prevState: "/user"
                }
              })
            }
            else {
              navigate(`${pathname}?fromProtected=${pathname}`)
            }
          }}>
            <div
              className="px-3 py-4 flex items-center cursor-pointer"
            >
              <div className="w-7">
                <img
                  className="w-7"
                  src="data:image/svg+xml;base64,PHN2ZyBpZD0iQ2FwYV8xIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA1MTIgNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHdpZHRoPSI1MTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGc+PHBhdGggZD0ibTM0NiAxODFjLTkxLjEyNiAwLTE2NSA3My44NzItMTY1IDE2NSAwIDkxLjEyNiA3My44NzQgMTY2IDE2NSAxNjZzMTY2LTc0Ljg3NCAxNjYtMTY2YzAtOTEuMTI4LTc0Ljg3NC0xNjUtMTY2LTE2NXoiIGZpbGw9IiNmZjY2NzMiLz48cGF0aCBkPSJtNTEyIDM0NmMwLTkxLjEyOC03NC44NzQtMTY1LTE2Ni0xNjV2MzMxYzkxLjEyNiAwIDE2Ni03NC44NzQgMTY2LTE2NnoiIGZpbGw9IiNlNjJlMmUiLz48cGF0aCBkPSJtMTY2IDBjLTkwLjk4MSAwLTE2NiA3NS4wMTktMTY2IDE2NnM3NS4wMTkgMTY1IDE2NiAxNjUgMTY1LTc0LjAxOSAxNjUtMTY1LTc0LjAxOS0xNjYtMTY1LTE2NnoiIGZpbGw9IiNmZmRmNDAiLz48cGF0aCBkPSJtMzMxIDE2NmMwLTkwLjk4MS03NC4wMTktMTY2LTE2NS0xNjZ2MzMxYzkwLjk4MSAwIDE2NS03NC4wMTkgMTY1LTE2NXoiIGZpbGw9IiNmZmJlNDAiLz48cGF0aCBkPSJtMTM2IDEyMWgtMzBjLTguMjkxIDAtMTUtNi43MDktMTUtMTVzNi43MDktMTUgMTUtMTVoMzBjOC4yOTEgMCAxNSA2LjcwOSAxNSAxNXMtNi43MDkgMTUtMTUgMTV6IiBmaWxsPSIjNGQ2Njk5Ii8+PHBhdGggZD0ibTIyNiAxMjFoLTMwYy04LjI5MSAwLTE1LTYuNzA5LTE1LTE1czYuNzA5LTE1IDE1LTE1aDMwYzguMjkxIDAgMTUgNi43MDkgMTUgMTVzLTYuNzA5IDE1LTE1IDE1eiIgZmlsbD0iIzQwNGI4MCIvPjxwYXRoIGQ9Im0zMTYgMzMxaC0zMGMtOC4yOTEgMC0xNS02LjcwOS0xNS0xNXM2LjcwOS0xNSAxNS0xNWgzMGM4LjI5MSAwIDE1IDYuNzA5IDE1IDE1cy02LjcwOSAxNS0xNSAxNXoiIGZpbGw9IiM0ZDY2OTkiLz48cGF0aCBkPSJtNDA2IDMzMWgtMzBjLTguMjkxIDAtMTUtNi43MDktMTUtMTVzNi43MDktMTUgMTUtMTVoMzBjOC4yOTEgMCAxNSA2LjcwOSAxNSAxNXMtNi43MDkgMTUtMTUgMTV6IiBmaWxsPSIjNDA0YjgwIi8+PHBhdGggZD0ibTIyNS41MjYgMTY2aC01OS41MjYtNjkuMDc4bC0zNC40MDYgMTVjNy4zNTcgNTAuNzUgNTAuNzI5IDkwIDEwMy40ODQgOTBzOTYuMTI3LTM5LjI1IDEwMy40ODQtOTB6IiBmaWxsPSIjZmY2NjczIi8+PHBhdGggZD0ibTI2OS40ODQgMTgxLTQzLjk1OC0xNWgtNTkuNTI2djEwNWM1Mi43NTUgMCA5Ni4xMjctMzkuMjUgMTAzLjQ4NC05MHoiIGZpbGw9IiNlNjJlMmUiLz48cGF0aCBkPSJtMjU2IDE1MWgtOTAtOTBjLTguMjkxIDAtMTUgNi43MDktMTUgMTUgMCA1LjEzNi44IDEwLjA1OCAxLjUxNiAxNWgxMDMuNDg0IDEwMy40ODRjLjcxNi00Ljk0MiAxLjUxNi05Ljg2NCAxLjUxNi0xNSAwLTguMjkxLTYuNzA5LTE1LTE1LTE1eiIgZmlsbD0iI2Y5ZjRmMyIvPjxwYXRoIGQ9Im0yNzEgMTY2YzAtOC4yOTEtNi43MDktMTUtMTUtMTVoLTkwdjMwaDEwMy40ODRjLjcxNi00Ljk0MiAxLjUxNi05Ljg2NCAxLjUxNi0xNXoiIGZpbGw9IiNmMGU2ZTEiLz48cGF0aCBkPSJtNDI0LjE5MyAzOTUuOThjLTE5LjkyMi0yMi4yMjEtNDguNDI3LTM0Ljk4LTc4LjE5My0zNC45OHMtNTguMjcxIDEyLjc1OS03OC4xOTMgMzQuOThjLTUuNTM3IDYuMTgyLTUuMDI0IDE1LjY1OSAxLjE0MyAyMS4xODIgNi4xOTYgNS41NjYgMTUuNjQ1IDUuMDI0IDIxLjE4Mi0xLjE0MyAxNC4yNTMtMTUuOTA4IDM1LjA2MS0yMy44NjIgNTUuODY5LTIzLjg2MnM0MS42MTYgNy45NTQgNTUuODY5IDIzLjg2MmM1LjUzOSA2LjE2OSAxNS4wMiA2LjY3NCAyMS4xODIgMS4xNDMgNi4xNjYtNS41MjIgNi42NzgtMTUgMS4xNDEtMjEuMTgyeiIgZmlsbD0iIzRkNjY5OSIvPjxwYXRoIGQ9Im00MjMuMDUxIDQxNy4xNjJjNi4xNjctNS41MjIgNi42OC0xNSAxLjE0My0yMS4xODItMTkuOTIzLTIyLjIyMS00OC40MjgtMzQuOTgtNzguMTk0LTM0Ljk4djMxLjE1N2MyMC44MDggMCA0MS42MTYgNy45NTQgNTUuODY5IDIzLjg2MiA1LjUzOSA2LjE2OSAxNS4wMiA2LjY3NSAyMS4xODIgMS4xNDN6IiBmaWxsPSIjNDA0YjgwIi8+PC9nPjwvc3ZnPg=="
                />
              </div>
              <div className="flex-1 pl-3">
                <div className="flex items-center justify-between relative before:content-[''] before:absolute before:w-full before:h-[1px] before:bg-[#f5f5fa] before:-bottom-4">
                  <div>
                    <div className="font-medium">Đánh giá dịch vụ</div>
                    <div className="text-muted text-[14px]">
                      Thực hiện đánh giá dịch vụ
                    </div>
                  </div>
                  <div className="text-muted">
                    <Icon icon="zi-chevron-right" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <NavLink className="block group" to="/courses" state={{ prevState: "/user" }}>
            <div
              className="px-3 py-4 flex items-center cursor-pointer"
            >
              <div className="w-7">
                <img
                  className="w-7"
                  src="data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjUxMnB0IiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgd2lkdGg9IjUxMnB0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Im0zMiAxNmgzNTJjMTcuNjcxODc1IDAgMzIgMTQuMzI4MTI1IDMyIDMydjQzMmMwIDE3LjY3MTg3NS0xNC4zMjgxMjUgMzItMzIgMzJoLTM1MmMtMTcuNjcxODc1IDAtMzItMTQuMzI4MTI1LTMyLTMydi00MzJjMC0xNy42NzE4NzUgMTQuMzI4MTI1LTMyIDMyLTMyem0wIDAiIGZpbGw9IiNlY2NlOTMiLz48cGF0aCBkPSJtMzIgMzc0LjYyNXYtMzI2LjYyNWgzNTJ2NDMyaC0yNDYuNjI1em0wIDAiIGZpbGw9IiNlZmVmZWYiLz48cGF0aCBkPSJtMTM3LjM3NSAzNzQuNjI1djEwNS4zNzVsLTEwNS4zNzUtMTA1LjM3NXptMCAwIiBmaWxsPSIjZTc2ZTU0Ii8+PHBhdGggZD0ibTEyOCA2NHYtNjRoMTYwdjY0YzAgMTcuNjcxODc1LTE0LjMyODEyNSAzMi0zMiAzMmgtOTZjLTE3LjY3MTg3NSAwLTMyLTE0LjMyODEyNS0zMi0zMnptMCAwIiBmaWxsPSIjZTc2ZTU0Ii8+PHBhdGggZD0ibTUxMiAzNjhjMCA3OS41MjczNDQtNjQuNDcyNjU2IDE0NC0xNDQgMTQ0cy0xNDQtNjQuNDcyNjU2LTE0NC0xNDQgNjQuNDcyNjU2LTE0NCAxNDQtMTQ0IDE0NCA2NC40NzI2NTYgMTQ0IDE0NHptMCAwIiBmaWxsPSIjNDhjOGVmIi8+PHBhdGggZD0ibTMzNS4wMDc4MTIgNDI5LjY0ODQzOC0zMS4wMDc4MTItMzEuMDIzNDM4Yy02LjI0NjA5NC02LjI1LTYuMjQ2MDk0LTE2LjM3ODkwNiAwLTIyLjYyNXMxNi4zNzUtNi4yNDYwOTQgMjIuNjI1IDBsMTAuMzY3MTg4IDEwLjM1MTU2MiA3Mi40NjQ4NDMtNjAuMzk4NDM3YzYuNzg5MDYzLTUuNjY0MDYzIDE2Ljg4NjcxOS00Ljc0NjA5NCAyMi41NDI5NjkgMi4wNDY4NzUgNS42NjQwNjIgNi43ODkwNjIgNC43NDYwOTQgMTYuODg2NzE5LTIuMDQ2ODc1IDIyLjU0Mjk2OXptMCAwIiBmaWxsPSIjZmZmIi8+PGcgZmlsbD0iIzc3OTU5ZSI+PHBhdGggZD0ibTE3NiAxMjhoMTI4YzguODM1OTM4IDAgMTYgNy4xNjQwNjIgMTYgMTZzLTcuMTY0MDYyIDE2LTE2IDE2aC0xMjhjLTguODM1OTM4IDAtMTYtNy4xNjQwNjItMTYtMTZzNy4xNjQwNjItMTYgMTYtMTZ6bTAgMCIvPjxwYXRoIGQ9Im05NiAxMjhoMzJ2MzJoLTMyem0wIDAiLz48cGF0aCBkPSJtOTYgMTkyaDMydjMyaC0zMnptMCAwIi8+PHBhdGggZD0ibTk2IDI1NmgzMnYzMmgtMzJ6bTAgMCIvPjxwYXRoIGQ9Im05NiAzMjBoMzJ2MzJoLTMyem0wIDAiLz48cGF0aCBkPSJtMTc2IDE5Mmg5NmM4LjgzNTkzOCAwIDE2IDcuMTY0MDYyIDE2IDE2cy03LjE2NDA2MiAxNi0xNiAxNmgtOTZjLTguODM1OTM4IDAtMTYtNy4xNjQwNjItMTYtMTZzNy4xNjQwNjItMTYgMTYtMTZ6bTAgMCIvPjxwYXRoIGQ9Im0xNzYgMjU2aDMyYzguODM1OTM4IDAgMTYgNy4xNjQwNjIgMTYgMTZzLTcuMTY0MDYyIDE2LTE2IDE2aC0zMmMtOC44MzU5MzggMC0xNi03LjE2NDA2Mi0xNi0xNnM3LjE2NDA2Mi0xNiAxNi0xNnptMCAwIi8+PC9nPjwvc3ZnPg=="
                />
              </div>
              <div className="flex-1 pl-3">
                <div className="flex items-center justify-between relative before:content-[''] before:absolute before:w-full before:h-[1px] before:bg-[#f5f5fa] before:-bottom-4">
                  <div>
                    <div className="font-medium">Khoá học</div>
                    <div className="text-muted text-[14px]">
                      Các khoá học bạn có thể tham gia
                    </div>
                  </div>
                  <div className="text-muted">
                    <Icon icon="zi-chevron-right" />
                  </div>
                </div>
              </div>
            </div>
          </NavLink>

          <NavLink className="block group" to="/offers" state={{ prevState: "/user" }}>

            <div
              className="px-3 py-4 flex items-center cursor-pointer"
            >
              <div className="w-7">
                <img
                  className="w-7"
                  src="data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgNTEyIDUxMiIgaGVpZ2h0PSI1MTIiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB3aWR0aD0iNTEyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnPjxnPjxwYXRoIGQ9Im00NjQgNDMyaC0zNTJjMC0xNy42NzMtMTQuMzI3LTMyLTMyLTMydi0yMjRjMTcuNjczIDAgMzItMTQuMzI3IDMyLTMyaDM1MmMwIDE3LjY3MyAxNC4zMjcgMzIgMzIgMzJ2MjI0Yy0xNy42NzMgMC0zMiAxNC4zMjctMzIgMzJ6IiBmaWxsPSIjMzIyODNjIi8+PC9nPjxnPjxwYXRoIGQ9Im00MDAgMzY4aC0zNTJjMC0xNy42NzMtMTQuMzI3LTMyLTMyLTMydi0yMjRjMTcuNjczIDAgMzItMTQuMzI3IDMyLTMyaDM1MmMwIDE3LjY3MyAxNC4zMjcgMzIgMzIgMzJ2MjI0Yy0xNy42NzMgMC0zMiAxNC4zMjctMzIgMzJ6IiBmaWxsPSIjZmY0NjQ2Ii8+PC9nPjxnPjxnPjxwYXRoIGQ9Im0yMDAgMzI4aC0xMTJjLTguODM3IDAtMTYtNy4xNjMtMTYtMTZ2LTExMmgxNDR2MTEyYzAgOC44MzctNy4xNjMgMTYtMTYgMTZ6IiBmaWxsPSIjYTVjM2RjIi8+PC9nPjxnPjxwYXRoIGQ9Im0xMjAgMzI4aC00OGMtOC44MzcgMC0xNi03LjE2My0xNi0xNnYtMTEyaDgwdjExMmMwIDguODM3LTcuMTYzIDE2LTE2IDE2eiIgZmlsbD0iI2U2ZTZlYiIvPjwvZz48Zz48cGF0aCBkPSJtNTYgMjAwaDgwdjE2aC04MHoiIGZpbGw9IiNhNWMzZGMiLz48L2c+PGc+PHBhdGggZD0ibTQ4IDE2MGgxNzZjNC40MTggMCA4IDMuNTgyIDggOHYyNGMwIDQuNDE4LTMuNTgyIDgtOCA4aC0xNzZjLTQuNDE4IDAtOC0zLjU4Mi04LTh2LTI0YzAtNC40MTggMy41ODItOCA4LTh6IiBmaWxsPSIjYTVjM2RjIi8+PC9nPjxnPjxwYXRoIGQ9Im00OCAxNjBoODhjNC40MTggMCA4IDMuNTgyIDggOHYyNGMwIDQuNDE4LTMuNTgyIDgtOCA4aC04OGMtNC40MTggMC04LTMuNTgyLTgtOHYtMjRjMC00LjQxOCAzLjU4Mi04IDgtOHoiIGZpbGw9IiNlNmU2ZWIiLz48L2c+PGc+PHBhdGggZD0ibTg4IDIwMGgxNnYxMjhoLTE2eiIgZmlsbD0iIzQ2M2M0YiIvPjwvZz48Zz48cGF0aCBkPSJtODggMjAwaDE2djE2aC0xNnoiIGZpbGw9IiMzMjI4M2MiLz48L2c+PGc+PHBhdGggZD0ibTgwIDE2MGgxNnY0MGgtMTZ6IiBmaWxsPSIjNDYzYzRiIi8+PC9nPjxnPjxwYXRoIGQ9Im0xNzYgMTYwaDE2djQwaC0xNnoiIGZpbGw9IiMzMjI4M2MiLz48L2c+PGc+PHBhdGggZD0ibTE2OCAyMDBoMTZ2MTI4aC0xNnoiIGZpbGw9IiMzMjI4M2MiLz48L2c+PHBhdGggZD0ibTE5NiAxMDRjLTE1LjAzMyAwLTI5LjE2OCA1Ljg1NC0zOS44IDE2LjQ4NWwtMjAuMiAyMC4yMDEtMjAuMjAxLTIwLjIwMWMtMTAuNjMxLTEwLjYzMS0yNC43NjYtMTYuNDg1LTM5Ljc5OS0xNi40ODUtMTUuNDM5IDAtMjggMTIuNTYxLTI4IDI4czEyLjU2MSAyOCAyOCAyOGgxMjBjMTUuNDM5IDAgMjgtMTIuNTYxIDI4LTI4cy0xMi41NjEtMjgtMjgtMjh6bS0xMjAgNDBjLTYuNjE3IDAtMTItNS4zODMtMTItMTJzNS4zODMtMTIgMTItMTJjMTAuNzYgMCAyMC44NzcgNC4xOSAyOC40ODUgMTEuNzk5bDEyLjIwMiAxMi4yMDF6bTEyMCAwaC00MC42ODdsMTIuMi0xMi4yMDFjNy42MS03LjYwOSAxNy43MjctMTEuNzk5IDI4LjQ4Ny0xMS43OTkgNi42MTcgMCAxMiA1LjM4MyAxMiAxMnMtNS4zODMgMTItMTIgMTJ6IiBmaWxsPSIjMzIyODNjIi8+PC9nPjxnPjxnPjxwYXRoIGQ9Im0yNTYgMTEyaDE2djMyaC0xNnoiIGZpbGw9IiNlNmU2ZWIiLz48L2c+PGc+PHBhdGggZD0ibTI1NiA4MGgxNnYxNmgtMTZ6IiBmaWxsPSIjZTZlNmViIi8+PC9nPjxnPjxwYXRoIGQ9Im0yNTYgMzUyaDE2djE2aC0xNnoiIGZpbGw9IiNlNmU2ZWIiLz48L2c+PGc+PHBhdGggZD0ibTI1NiAxNjBoMTZ2MzJoLTE2eiIgZmlsbD0iI2U2ZTZlYiIvPjwvZz48Zz48cGF0aCBkPSJtMjU2IDIwOGgxNnYzMmgtMTZ6IiBmaWxsPSIjZTZlNmViIi8+PC9nPjxnPjxwYXRoIGQ9Im0yNTYgMjU2aDE2djMyaC0xNnoiIGZpbGw9IiNlNmU2ZWIiLz48L2c+PGc+PHBhdGggZD0ibTI1NiAzMDRoMTZ2MzJoLTE2eiIgZmlsbD0iI2U2ZTZlYiIvPjwvZz48L2c+PGc+PHBhdGggZD0ibTMyMCAyMDBjLTEzLjIzMyAwLTI0LTEwLjc2Ni0yNC0yNHMxMC43NjctMjQgMjQtMjQgMjQgMTAuNzY2IDI0IDI0LTEwLjc2NyAyNC0yNCAyNHptMC0zMmMtNC40MTEgMC04IDMuNTg5LTggOHMzLjU4OSA4IDggOCA4LTMuNTg5IDgtOC0zLjU4OS04LTgtOHoiIGZpbGw9IiNlNmU2ZWIiLz48L2c+PGc+PHBhdGggZD0ibTM4NCAyOTZjLTEzLjIzMyAwLTI0LTEwLjc2Ni0yNC0yNHMxMC43NjctMjQgMjQtMjQgMjQgMTAuNzY2IDI0IDI0LTEwLjc2NyAyNC0yNCAyNHptMC0zMmMtNC40MTEgMC04IDMuNTg5LTggOHMzLjU4OSA4IDggOCA4LTMuNTg5IDgtOC0zLjU4OS04LTgtOHoiIGZpbGw9IiNlNmU2ZWIiLz48L2c+PGc+PHBhdGggZD0ibTMxOS45OTQgMjk2LjAwMmMtMS4yMDMgMC0yLjQyMy0uMjcyLTMuNTcyLS44NDYtMy45NTEtMS45NzYtNS41NTMtNi43ODEtMy41NzctMTAuNzMzbDY0LTEyOGMxLjk3Ny0zLjk1MiA2Ljc4LTUuNTUyIDEwLjczMy0zLjU3OCAzLjk1MSAxLjk3NiA1LjU1MyA2Ljc4MSAzLjU3NyAxMC43MzNsLTY0IDEyOGMtMS40MDEgMi44MDMtNC4yMjYgNC40MjQtNy4xNjEgNC40MjR6IiBmaWxsPSIjZTZlNmViIi8+PC9nPjwvZz48L3N2Zz4="
                />
              </div>
              <div className="flex-1 pl-3">
                <div className="flex items-center justify-between relative before:content-[''] before:absolute before:w-full before:h-[1px] before:bg-[#f5f5fa] before:-bottom-4 group-last:before:hidden">
                  <div>
                    <div className="font-medium">Mã ưu đãi</div>
                    <div className="text-muted text-[14px]">
                      Kho mã ưu đãi bạn có thể sử dụng
                    </div>
                  </div>
                  <div className="text-muted">
                    <Icon icon="zi-chevron-right" />
                  </div>
                </div>
              </div>
            </div>

          </NavLink>

        </div>
      </div>
      {Auth?.ID && (
        <div className="mt-2 mb-3 px-3">
          <div className="bg-white rounded-md">
            <div
              className="flex px-3 py-4 items-center border-b cursor-pointer"
              onClick={() => {
                setDialogVisible(true);
                //onLogout()
              }}
            >
              <div className="text-app">
                <Icon icon="zi-leave" />
              </div>
              <div className="font-medium flex-1 pl-3 text-danger">
                Đăng xuất tài khoản
              </div>
              <div className="text-muted">
                <Icon icon="zi-chevron-right" />
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal
        visible={dialogVisible}
        title="Thông báo"
        onClose={() => {
          setDialogVisible(false);
        }}
        actions={[
          {
            text: "Đóng",
            close: true,
          },
          {
            text: "Đăng xuất",
            //close: true,
            highLight: true,
            onClick: () => {
              onLogout(() => {
                openSnackbar({
                  text: "Đăng xuất thành công.",
                  type: "success",
                });
                setDialogVisible(false);
              });
            },
          },
        ]}
        description="Bạn muốn thực hiện đang xuất tài khoản ?"
      />
    </Page>
  );
};
export default UserPage;
