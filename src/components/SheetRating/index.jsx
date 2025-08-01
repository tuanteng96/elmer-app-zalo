import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
  Button,
  Checkbox,
  Input,
  Sheet,
  useNavigate,
  useSnackbar,
} from "zmp-ui";
import { useLayout } from "../../layout/LayoutProvider";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import AuthAPI from "../../api/auth.api";

const SheetRating = ({ data }) => {
  const queryClient = useQueryClient();

  const [visible, setVisible] = useState(true);
  const [Selected, setSelected] = useState(null);
  const { GlobalConfig, Auth } = useLayout();

  const navigate = useNavigate();

  const { openSnackbar } = useSnackbar();

  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      Rate: "",
      RateNote: "",
      Feedbacks: [],
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (body) => {
      let data = await AuthAPI.updateRating(body);
      await queryClient.invalidateQueries(["Rating"]);
      return data;
    },
  });

  const onSubmit = (values) => {
    var bodyFormData = new FormData();
    bodyFormData.append(
      "rates",
      JSON.stringify(
        data.map((x) => ({
          ID: x.os.ID,
          Rate: values.Rate,
          RateNote: [values.RateNote, ...values.Feedbacks]
            .filter((x) => x)
            .toString(),
        })),
      ),
    );

    updateMutation.mutate(
      {
        data: bodyFormData,
        MemberID: Auth?.ID,
      },
      {
        onSuccess: () => {
          openSnackbar({
            text: "Thực hiện đánh giá thành công.",
            type: "success",
            duration: 10000,
          });
          setVisible(false);
        },
      },
    );
  };

  return createPortal(
    <Sheet
      mask
      autoHeight
      visible={visible}
      onClose={() => setVisible(false)}
      swipeToClose
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col h-full"
        autoComplete="off"
      >
        <div className="px-4 h-12 flex items-center justify-center uppercase text-lg font-semibold">
          Đánh giá dịch vụ
        </div>
        <div className="grow overflow-auto max-h-[60vh]">
          <div className="p-4 text-center border-b">
            <div>{data.map((x) => x.prod.Title).join(", ")}</div>
            <div
              className="text-primary mt-3 block"
              onClick={() => {
                setVisible(false);
                navigate("/user/customer-rating");
              }}
            >
              Đánh giá theo từng dịch vụ?
            </div>
          </div>
          <div className="p-4">
            <Controller
              name="Rate"
              control={control}
              render={({ field: { ref, ...field }, fieldState }) => (
                <div className="flex items-center justify-center">
                  {Array(5)
                    .fill()
                    .map((_, i) => (
                      <div
                        className="ms-1.5"
                        key={i}
                        onClick={() => {
                          field.onChange(i + 1);
                          let index = GlobalConfig?.IPAD?.Items.findIndex(
                            (x) => x.value === i + 1,
                          );
                          if (index > -1) {
                            setSelected(GlobalConfig?.IPAD?.Items[index]);
                          }
                        }}
                      >
                        <svg
                          className={clsx(
                            "w-6 text-gray-300",
                            Number(field.value) >= i + 1
                              ? "text-warning"
                              : "text-gray-300",
                          )}
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 22 20"
                        >
                          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                        </svg>
                      </div>
                    ))}
                </div>
              )}
            />
            {Selected && (
              <Controller
                name="Feedbacks"
                control={control}
                render={({ field: { ref, ...field }, fieldState }) => (
                  <div className="mt-4">
                    {Selected.feedbacks.map((x, index) => (
                      <Checkbox
                        className="mb-2 last:mb-0 w-full"
                        key={index}
                        label={x}
                        value={x}
                        onChange={(e) => {
                          let index = field.value.findIndex((o) => o === x);
                          if (index > -1) {
                            field.onChange(field.value.filter((o) => o !== x));
                          } else {
                            field.onChange([...field.value, x]);
                          }
                        }}
                        checked={field.value.some((o) => o === x)}
                      />
                    ))}
                  </div>
                )}
              />
            )}
          </div>

          <div className="p-4">
            <Controller
              name="RateNote"
              control={control}
              render={({ field: { ref, ...field }, fieldState }) => (
                <Input.TextArea
                  placeholder="Chia sẻ đánh giá của bạn. Đánh giá của bạn sẽ được giữ dưới chế độ ẩn danh."
                  showCount
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </div>
        <div className="p-4 border-t">
          <Button
            className={clsx(
              "!bg-app !font-semibold disabled:!text-white disabled:opacity-60 rounded-full",
              updateMutation.isLoading && "!bg-opacity-70",
            )}
            fullWidth
            size="large"
            disabled={updateMutation.isLoading}
            loading={updateMutation.isLoading}
            onClick={handleSubmit(onSubmit)}
          >
            Thực hiện đánh giá
          </Button>
        </div>
        <div
          className="px-4 h-12 text-center border-t border-separator flex items-center justify-center text-danger font-semibold"
          onClick={() => setVisible(false)}
        >
          Đóng
        </div>
      </form>
    </Sheet>,
    document.body,
  );
};

export { SheetRating };
