import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button, Sheet } from "zmp-ui";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { useLayout } from "../../../layout/LayoutProvider";
import CartAPI from "../../../api/cart.api";
import { ImageLazy } from "../../../components/ImagesLazy";
import { toAbsolutePath } from "../../../utils/assetPath";
import { formatString } from "../../../utils/formatString";
import { QuantityPicker } from "../../catalogue/components/QuantityPicker";

export const PickerCart = ({ children, item }) => {
  const { AccessToken, Auth } = useLayout();
  const [visible, setVisible] = useState(false);
  const { handleSubmit, control, watch, reset } = useForm({
    defaultValues: {
      ID: 0,
      Qty: 1,
    },
  });

  useEffect(() => {
    reset({
      ID: item?.ID,
      Qty: item?.Qty,
    });
  }, [reset, visible]);

  const watchQty = watch().Qty;

  const queryClient = useQueryClient();

  const addCartMutation = useMutation({
    mutationFn: (body) => CartAPI.list(body),
  });

  const onSubmit = (values) => {
    const body = {
      order: {
        ID: 0,
        SenderID: Auth?.ID,
      },
      deleteds: [],
      edits: [],
      addProps: "ProdTitle",
    };

    if (values.Qty === 0) {
      body.deleteds = [{ ...values }];
    } else {
      body.edits = [{ ...values }];
    }
    addCartMutation.mutate(
      { token: AccessToken, body: body },
      {
        onSuccess: () => {
          queryClient
            .invalidateQueries({ queryKey: ["ListsCart"] })
            .then(() => {
              setVisible(false);
            });
        },
      },
    );
  };

  return (
    <>
      {children({
        open: () => setVisible(true),
        close: () => setVisible(false),
      })}
      {createPortal(
        <Sheet visible={visible} onClose={() => setVisible(false)} autoHeight>
          {item && (
            <div className="h-full">
              <div className="flex items-end px-3 pt-3 pb-4 border-b">
                <div className="w-32">
                  <ImageLazy
                    wrapperClassName="aspect-square !block"
                    className="aspect-square object-cover w-full"
                    effect="blur"
                    src={toAbsolutePath(item?.ProdThumb)}
                  />
                </div>
                <div className="pl-3">
                  <div className="font-semibold mb-2">{item?.ProdTitle}</div>
                  <div className="text-danger font-semibold">
                    {formatString.formatVND(item.ToPay)}
                  </div>
                </div>
              </div>
              <div className="p-3 flex justify-between items-center">
                <div>Số lượng</div>
                <div className="w-36">
                  <Controller
                    name={`Qty`}
                    control={control}
                    render={({ field: { ref, ...field } }) => (
                      <QuantityPicker
                        value={field.value}
                        onChange={(val) => field.onChange(val)}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="p-3">
                <Button
                  className={clsx(
                    "transition",
                    watchQty > 0 ? "!bg-app" : "!bg-danger",
                    addCartMutation.isLoading && "!bg-opacity-70",
                  )}
                  fullWidth
                  size="large"
                  onClick={handleSubmit(onSubmit)}
                  loading={addCartMutation.isLoading}
                >
                  {watchQty > 0 ? "Cập nhập giỏ hàng" : "Xóa"}
                </Button>
              </div>
            </div>
          )}
        </Sheet>,
        document.body,
      )}
    </>
  );
};
