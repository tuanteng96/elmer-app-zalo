import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Controller, useForm } from "react-hook-form";
import { Button, useSnackbar, Input, Sheet } from "zmp-ui";
import { HtmlParser } from "../../components/HtmlParser";
import { useLayout } from "../../layout/LayoutProvider";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useConfigs } from "../../layout/MasterLayout";
import { useMutation } from "@tanstack/react-query";
import BookingAPI from "../../api/booking.api";
import clsx from "clsx";

const schemaForm = yup
  .object({
    Fullname: yup.string().required("Vui lòng nhập họ và tên"),
    Phone1: yup.string().required("Vui lòng nhập số điện thoại"),
  })
  .required();

export const PickerContact = ({ children, initialValues }) => {
  const [visible, setVisible] = useState(false);

  const { openSnackbar } = useSnackbar();

  const { Auth, CurrentStocks, onOpenActionStocks } = useLayout();
  const { ZaloInfo } = useConfigs();

  const { handleSubmit, control, reset, watch } = useForm({
    defaultValues: {
      Fullname: "",
      Phone1: "",
      Address: "",
      Email: "",
      Content: "Liên hệ tư vấn",
    },
    resolver: yupResolver(schemaForm),
  });
  useEffect(() => {
    if (Auth?.ID) {
      reset({
        Email: "",
        Fullname: Auth ? Auth?.FullName : ZaloInfo?.name,
        Phone1: Auth ? Auth?.MobilePhone : "",
        Content: `Cần tư vấn ${initialValues?.Title}`,
      });
    }
  }, [visible]);

  const postMutation = useMutation({
    mutationFn: (body) => BookingAPI.contact(body),
  });

  const onSubmit = (values) => {
    if (!CurrentStocks?.ID) {
      onOpenActionStocks();
    } else {
      let dataPost = {
        contact: {
          ...values,
          StockID: CurrentStocks?.ID,
        },
      };
      postMutation.mutate(dataPost, {
        onSuccess: (data) => {
          openSnackbar({
            text: "Quân tâm chương trình thành công!",
            type: "success",
          });
          setVisible(false);
        },
      });
    }
  };

  return (
    <>
      {children({
        open: () => setVisible(true),
        close: () => setVisible(false),
      })}
      {createPortal(
        <Sheet visible={visible} onClose={() => setVisible(false)} autoHeight>
          <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <div className="h-12 px-4">
                <div className="font-semibold text-center">
                  {initialValues?.Title}
                </div>
              </div>
              <div className="border-t border-4"></div>
              {initialValues?.Desc && (
                <div className="p-4 text-center">
                  <HtmlParser>{initialValues?.Desc}</HtmlParser>
                </div>
              )}
              {!Auth?.ID && (
                <div className="p-4 bg-white mt-1.5">
                  <div className="mb-3">
                    <Controller
                      name="Fullname"
                      control={control}
                      render={({ field: { ref, ...field }, fieldState }) => (
                        <Input
                          type="text"
                          label="Họ và tên"
                          placeholder="Nhập họ tên của bạn"
                          value={field.value}
                          onChange={field.onChange}
                          status={fieldState?.invalid && "error"}
                        />
                      )}
                    />
                  </div>
                  <div className="mb-3">
                    <Controller
                      name="Phone1"
                      control={control}
                      render={({ field: { ref, ...field }, fieldState }) => (
                        <Input
                          type="number"
                          label="Số điện thoại"
                          placeholder="Nhập số điện thoại"
                          value={field.value}
                          onChange={field.onChange}
                          status={fieldState?.invalid && "error"}
                        />
                      )}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t grid grid-cols-2 gap-4">
              <Button
                onClick={() => setVisible(false)}
                fullWidth
                htmlType="submit"
                className="!bg-gray-500 font-medium"
              >
                Đóng
              </Button>
              <Button
                className={clsx(
                  "!bg-app font-medium",
                  postMutation.isLoading && "!opacity-75 pointer-events-none",
                )}
                loading={postMutation.isLoading}
                fullWidth
                htmlType="submit"
              >
                Quan tâm
              </Button>
            </div>
          </form>
        </Sheet>,
        document.body,
      )}
    </>
  );
};
