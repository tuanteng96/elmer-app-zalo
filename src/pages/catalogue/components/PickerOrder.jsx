import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button, Sheet, useNavigate, useSnackbar } from "zmp-ui";
import { useFieldArray, useFormContext, Controller } from "react-hook-form";
import { ImageLazy } from "../../../components/ImagesLazy";
import { toAbsolutePath } from "../../../utils/assetPath";
import { PriceSaleDetail } from "./PriceSaleDetail";
import { QuantityPicker } from "./QuantityPicker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CartAPI from "../../../api/cart.api";
import { useLayout } from "../../../layout/LayoutProvider";
import clsx from "clsx";
import { useLocation } from "react-router";

export const PickerOrder = ({ children, item, options, buttonText }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { AccessToken, Auth } = useLayout();
  const { handleSubmit, control, watch } = useFormContext();
  const { openSnackbar } = useSnackbar();

  let watchForm = watch();

  const [visible, setVisible] = useState(false);
  const [CrProduct, setCrProduct] = useState(item);

  const { fields } = useFieldArray({
    control,
    name: "adds",
  });

  useEffect(() => {
    if (options && options.length > 0) {
      let watchAdds = watchForm.adds;
      let index = options.findIndex(
        (x) => x.ID === Number(watchAdds[0].ProdID),
      );
      if (index > -1) {
        setCrProduct(options[index]);
      } else {
        setCrProduct(item);
      }
    } else {
      setCrProduct(item);
    }
  }, [watchForm, options]);

  const queryClient = useQueryClient();

  const addCartMutation = useMutation({
    mutationFn: async (body) => {
      let data = await CartAPI.list(body);
      await queryClient.invalidateQueries({ queryKey: ["ListsCart"] });
      return data;
    },
  });

  const onSubmit = (values) => {
    if (!AccessToken && !Auth) {
      setVisible(false);
      navigate(`/?fromProtected=${pathname}`);
    } else {
      addCartMutation.mutate(
        { token: AccessToken, body: values },
        {
          onSuccess: () => {
            setVisible(false);
            if (buttonText === "Mua ngay") {
              navigate("/cart");
            } else {
              openSnackbar({
                text: "Đã thêm vào giỏ !",
                type: "success",
                duration: 2000,
              });
              navigate(-1);
            }
          },
        },
      );
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
          {CrProduct && (
            <div className="h-full">
              <div className="flex items-end px-3 pt-3 pb-4 border-b">
                <div className="w-32">
                  <ImageLazy
                    wrapperClassName="aspect-square !block"
                    className="aspect-square object-cover w-full"
                    effect="blur"
                    src={toAbsolutePath(CrProduct?.Thumbnail)}
                  />
                </div>
                <div className="pl-3">
                  <div className="font-semibold mb-2">{CrProduct?.Title}</div>
                  <PriceSaleDetail product={CrProduct} />
                </div>
              </div>
              {options && options.length > 0 && (
                <>
                  <div className="border-b p-3">
                    <div className="mb-2">Loại</div>
                    <div className="grid grid-cols-2 gap-3">
                      {fields &&
                        fields.map((item, index) => (
                          <Controller
                            key={item.id}
                            name={`adds[${index}].ProdID`}
                            control={control}
                            render={({ field: { ref, ...field } }) => (
                              <>
                                {options.map((otp, i) => (
                                  <div
                                    className={clsx(
                                      "flex items-center px-3 py-2 rounded-sm cursor-pointer border",
                                      Number(field.value) === otp.ID
                                        ? "border-app bg-white"
                                        : "border-light bg-light",
                                    )}
                                    onClick={() => {
                                      field.onChange(otp.ID);
                                    }}
                                    key={i}
                                  >
                                    <div className="w-8">
                                      <ImageLazy
                                        wrapperClassName="aspect-square !block border border-white"
                                        className="aspect-square object-cover w-full rounded-sm"
                                        effect="blur"
                                        src={toAbsolutePath(otp?.Thumbnail)}
                                      />
                                    </div>
                                    <div className="flex-1 pl-3 truncate">
                                      {otp.Opt1}
                                    </div>
                                  </div>
                                ))}
                              </>
                            )}
                          />
                        ))}
                    </div>
                  </div>
                </>
              )}
              <div></div>
              <div className="p-3 flex justify-between items-center">
                <div>Số lượng</div>
                <div className="w-36">
                  {fields &&
                    fields.map((item, index) => (
                      <Controller
                        key={item.id}
                        name={`adds[${index}].Qty`}
                        control={control}
                        render={({ field: { ref, ...field } }) => (
                          <QuantityPicker
                            value={field.value}
                            onChange={(val) => field.onChange(val)}
                          />
                        )}
                      />
                    ))}
                </div>
              </div>
              <div className="p-3">
                <Button
                  className={clsx(
                    "!bg-app",
                    addCartMutation.isLoading && "!bg-opacity-70",
                  )}
                  fullWidth
                  size="large"
                  onClick={handleSubmit(onSubmit)}
                  loading={addCartMutation.isLoading}
                >
                  {buttonText}
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
