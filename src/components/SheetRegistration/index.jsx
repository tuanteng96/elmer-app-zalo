import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "react-router-dom";
import {
  authorize,
  getAccessToken,
  getPhoneNumber,
  getUserInfo,
} from "zmp-sdk";
import { Button, Modal, useSnackbar, useNavigate } from "zmp-ui";
import MemberAPI from "../../api/member.api";
import ZaloAPI from "../../api/zalo.api";
import { useQueryParams } from "../../hook";
import { useLayout } from "../../layout/LayoutProvider";
import { ProcessENV } from "../../utils/process";

const SheetRegistration = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sheetVisible, setSheetVisible] = useState(false);

  const { onSaveAuth, AccessToken, CurrentStocks, onOpenActionStocks } =
    useLayout();

  const [loading, setLoading] = useState(false);

  const { openSnackbar } = useSnackbar();

  const queryParams = useQueryParams();

  useEffect(() => {
    if (queryParams?.fromProtected && !AccessToken) {
      setSheetVisible(true);
    }
  }, [queryParams?.fromProtected, AccessToken]);

  const onHide = () => {
    const param = searchParams.get("fromProtected");

    if (param) {
      searchParams.delete("fromProtected");
      setSearchParams(searchParams);
    } else {
      onClose();
    }

    setSheetVisible(false);
  };

  const addMutation = useMutation({
    mutationFn: async (body) => {
      let result = null;
      let { data } = await ZaloAPI.getNumberPhone(body);

      let { userInfo } = await getUserInfo({});

      if (data?.data?.number) {
        let addMember = {
          Member: {
            ZaloID: userInfo?.id || "0000000000",
            FullName: userInfo?.name || "Khách vãng lai",
            MobilePhone: data?.data?.number
              ? data?.data?.number?.replace(/^.{2}/g, "0")
              : "0000000000",
            ByStockID: CurrentStocks?.ID || 0,
            Gender: -1,
          },
        };
        result = await MemberAPI.addZalo(addMember);
      } else {
        result = {
          error: data?.error,
        };
      }
      return result;
    },
  });

  const onChangeReg = async () => {
    if (!CurrentStocks) {
      onOpenActionStocks();
    } else {
      setLoading(true);

      try {
        let rs = await authorize({
          scopes: ["scope.userInfo", "scope.userPhonenumber"],
        });

        getAccessToken({
          success: (accessToken) => {
            getPhoneNumber({
              success: async ({ token }) => {
                addMutation.mutate(
                  {
                    access_token: accessToken,
                    SecretKey: ProcessENV.SecretKey,
                    Code: token,
                  },
                  {
                    onSuccess: (data) => {
                      if (data?.data?.data?.Member) {
                        openSnackbar({
                          text: "Kích hoạt thành viên thành công.",
                          type: "success",
                        });
                        onSaveAuth(data?.data?.data?.Member);
                        setSheetVisible(false);
                        onClose();
                        navigate(queryParams?.fromProtected);
                      } else {
                        openSnackbar({
                          text:
                            data?.data?.error ||
                            data?.error ||
                            "Lỗi không xác định",
                          type: "error",
                        });
                      }
                      setLoading(false);
                    },
                  },
                );
              },
              fail: (error) => {
                setLoading(false);
                console.log(error);
              },
            });
          },
          fail: (error) => {
            setLoading(false);
            console.log(error);
          },
        });

      } catch (error) {
        setLoading(false);
        openSnackbar({
          text: "Không thể kích hoạt thành viên .",
          type: "error",
        });
      }
    }
  };

  return (
    <>
      {createPortal(
        <Modal
          modalClassName="!bg-transparent !w-full !h-full child:h-full !max-h-full"
          maskClassName="next-zaui-modal-wrapper"
          visible={open || sheetVisible}
          onClose={onHide}
        >
          {(open || sheetVisible) && (
            <>
              <div className="flex items-center justify-center h-full">
                <div className="relative text-center mb-10">
                  <div className="mb-5 leading-6 text-white">
                    Để sử dụng tính năng này bạn cần{" "}
                    <span className="text-warning">kích hoạt thành viên</span>{" "}
                    bằng cách xác nhận số điện thoại.
                    <svg
                      viewBox="0 0 512 512"
                      fill="currentColor"
                      className="w-12 h-12 absolute -top-16 right-2 rotate-[25deg]"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={15}
                        d="M259.92 262.91L216.4 149.77a9 9 0 00-16.8 0l-43.52 113.14a9 9 0 01-5.17 5.17L37.77 311.6a9 9 0 000 16.8l113.14 43.52a9 9 0 015.17 5.17l43.52 113.14a9 9 0 0016.8 0l43.52-113.14a9 9 0 015.17-5.17l113.14-43.52a9 9 0 000-16.8l-113.14-43.52a9 9 0 01-5.17-5.17zM108 68L88 16 68 68 16 88l52 20 20 52 20-52 52-20-52-20zM426.67 117.33L400 48l-26.67 69.33L304 144l69.33 26.67L400 240l26.67-69.33L496 144l-69.33-26.67z"
                      />
                    </svg>
                  </div>
                  <div className="relative inline-block" onClick={onChangeReg}>
                    <Button
                      loading={loading || addMutation.isLoading}
                      htmlType="button"
                      className={clsx(
                        "!text-warning !border-solid !border-2 !border-warning !px-5 !py-3 !h-auto !rounded-3xl !font-bold !bg-transparent",
                        loading ||
                        (addMutation.isLoading && "pointer-events-none"),
                      )}
                    >
                      Kích hoạt thành viên ngay
                    </Button>
                    <div className="absolute flex flex-col items-center justify-center text-white top-10 left-2/4 -translate-x-2/4">
                      <div className="relative flex h-3.5 w-3.5">
                        <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-warning"></span>
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-warning border-white"></span>
                      </div>
                      <div className="absolute -top-px -left-[15px] z-10">
                        <svg
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          viewBox="0 0 24 24"
                          className="w-14 h-14 opacity-80 animate-bounceRight"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" />
                          <path d="M8 13V4.5a1.5 1.5 0 013 0V12M11 11.5v-2a1.5 1.5 0 013 0V12M14 10.5a1.5 1.5 0 013 0V12" />
                          <path d="M17 11.5a1.5 1.5 0 013 0V16a6 6 0 01-6 6h-2 .208a6 6 0 01-5.012-2.7L7 19c-.312-.479-1.407-2.388-3.286-5.728a1.5 1.5 0 01.536-2.022 1.867 1.867 0 012.28.28L8 13M5 3L4 2M4 7H3M14 3l1-1M15 6h1" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full text-center pb-safe-bottom">
                {/* <div className="mb-4">
                  <div className="text-white mb-3 text-sm">
                    <span>Bạn đã có tài khoản ?</span>
                  </div>
                  <div>
                    <Button
                      onClick={() => {
                        setSheetVisible(false);
                        navigate("/login");
                      }}
                      htmlType="button"
                      className="!text-warning !border-solid !border-2 !border-warning !px-5 !py-3 !h-auto !rounded-3xl !font-bold !bg-transparent w-[240px]"
                    >
                      Đăng nhập tài khoản
                    </Button>
                  </div>
                </div> */}
                <div
                  className="inline-block mb-6 text-xs text-center text-white cursor-pointer opacity-80"
                  onClick={onHide}
                >
                  Bỏ qua
                </div>
              </div>
            </>
          )}
        </Modal>,
        document.body,
      )}
    </>
  );
};

export { SheetRegistration };
