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
import { Button, Modal, useSnackbar, useNavigate, Input } from "zmp-ui";
import MemberAPI from "../../api/member.api";
import ZaloAPI from "../../api/zalo.api";
import { useQueryParams } from "../../hook";
import { useLayout } from "../../layout/LayoutProvider";
import { ProcessENV } from "../../utils/process";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthAPI from "../../api/auth.api";

const schemaLogin = yup
  .object({
    USN: yup.string().required("Vui lòng nhập tài khoản."),
    PWD: yup.string().required("Vui lòng nhập mật khẩu."),
  })
  .required();

const SheetRegistration = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sheetVisible, setSheetVisible] = useState(false);

  const { onSaveAuth, AccessToken, CurrentStocks, onOpenActionStocks } =
    useLayout();

  const [loading, setLoading] = useState(false);

  const { openSnackbar } = useSnackbar();

  const queryParams = useQueryParams();

  const { handleSubmit, control, setValue, setError, reset } = useForm({
    defaultValues: {
      USN: "",
      PWD: "",
    },
    resolver: yupResolver(schemaLogin),
  });

  useEffect(() => {
    if (queryParams?.fromProtected && !AccessToken) {
      setSheetVisible(true);
      reset({
        USN: "",
        PWD: "",
      });
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

  const loginMutation = useMutation({
    mutationFn: (body) => AuthAPI.login(body),
  });

  const onChangeReg = async () => {
    if (!CurrentStocks) {
      onOpenActionStocks();
    } else {
      setLoading(true);

      await authorize({
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
                        text: "Đăng nhập thành viên thành công.",
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
    }
  };

  const onSubmit = (values) => {
    loginMutation.mutate(values, {
      onSuccess: ({ data }) => {
        if (data.error || data?.Status === -1) {
          setError("USN", {
            type: "Server",
            message:
              data?.Status === -1
                ? "Tài khoản của bạn đã bị vô hiệu hoá."
                : "Tài khoản & mật khẩu không chính xác.",
          });
        } else {
          openSnackbar({
            text: "Đăng nhập thành viên thành công.",
            type: "success",
          });
          onSaveAuth(data);
          setSheetVisible(false);
          onClose();
          navigate(queryParams?.fromProtected);
        }
      },
    });
  };

  return (
    <>
      {createPortal(
        <Modal
          modalClassName="!w-full !h-full child:!p-4 child:h-full !max-h-full !rounded-none"
          maskClassName="next-zaui-modal-wrapper"
          visible={open || sheetVisible}
          onClose={onHide}
        >
          {(open || sheetVisible) && (
            <>
              <form
                className="flex items-center justify-center h-full"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="absolute top-0 left-0 pt-safe">
                  <div
                    className="w-14 h-14 flex items-center justify-center"
                    onClick={onHide}
                  >
                    <ArrowLeftIcon className="w-6" />
                  </div>
                </div>
                <div className="relative mb-10">
                  <div className="text-center mb-8 leading-6 text-gray-400">
                    Để sử dụng tính năng bạn cần{" "}
                    <span className="text-warning px-1 font-medium">
                      đăng nhập tài khoản
                    </span>{" "}
                    hoặc
                    <span className="text-warning px-1 font-medium">
                      đăng nhập bằn Zalo
                    </span>
                    bằng cách xác nhận số điện thoại.
                    {/* <svg
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
                    </svg> */}
                  </div>
                  <div className="border border-gray-200 p-4 rounded-lg">
                    <div className="mb-4">
                      <div className="text-gray-700 text-sm font-medium">
                        Tài khoản hoặc số điện thoại
                      </div>
                      <Controller
                        name="USN"
                        control={control}
                        render={({ field: { ref, ...field }, fieldState }) => (
                          <Input
                            type="text"
                            //label="Tài khoản"
                            placeholder="Nhập tài khoản"
                            value={field.value}
                            onChange={field.onChange}
                            status={fieldState?.invalid && "error"}
                            errorText={fieldState?.error?.message}
                          />
                        )}
                      />
                    </div>
                    <div className="mb-4">
                      <div className="text-gray-700 text-sm font-medium">
                        Mật khẩu
                      </div>
                      <Controller
                        name="PWD"
                        control={control}
                        render={({ field: { ref, ...field }, fieldState }) => (
                          <Input
                            type="password"
                            //label="Mật khẩu"
                            placeholder="Nhập mật khẩu"
                            value={field.value}
                            onChange={field.onChange}
                            status={fieldState?.invalid && "error"}
                            errorText={fieldState?.error?.message}
                          />
                        )}
                      />
                    </div>
                    <div>
                      <Button
                        loading={loginMutation.isLoading}
                        className={clsx(
                          "!bg-app !rounded-[8px] !h-[50px]",
                          loginMutation.isLoading &&
                            "!opacity-75 pointer-events-none",
                        )}
                        htmlType="submit"
                        fullWidth
                      >
                        Đăng nhập
                      </Button>
                    </div>
                    <div className="my-5 flex items-center space-x-3 text-xs rtl:space-x-reverse">
                      <div className="h-px flex-1 bg-gray-200 dark:bg-dark-500"></div>
                      <div>OR</div>
                      <div className="h-px flex-1 bg-gray-200 dark:bg-dark-500"></div>
                    </div>
                    <Button
                      loading={loading || addMutation.isLoading}
                      htmlType="button"
                      onClick={onChangeReg}
                      className={clsx(
                        "!w-full h-[50px] !rounded-[8px] !bg-primary",
                        loading ||
                          (addMutation.isLoading &&
                            "!opacity-75 pointer-events-none"),
                      )}
                    >
                      Đăng nhập bằng Zalo
                    </Button>
                  </div>
                </div>
              </form>
              <div className="absolute bottom-0 left-0 w-full text-center pb-safe-bottom">
                <div
                  className="inline-block mb-6 text-xs text-center cursor-pointer opacity-80"
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
