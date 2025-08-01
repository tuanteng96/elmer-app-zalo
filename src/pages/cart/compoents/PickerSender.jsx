import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Controller, useForm } from "react-hook-form";
import { Button, Icon, Input, Sheet } from "zmp-ui";

export const PickerSender = ({ children, value = "", onChange }) => {
  const [visible, setVisible] = useState(false);

  const { handleSubmit, control, setValue } = useForm({
    defaultValues: {
      SenderAddress: "",
    },
  });

  useEffect(() => {
    setValue("SenderAddress", value);
  }, [visible]);

  const onSubmit = ({ SenderAddress }) => {
    onChange(SenderAddress);
    setVisible(false);
  };

  return (
    <>
      {children({
        open: () => setVisible(true),
        close: () => setVisible(false),
      })}
      {createPortal(
        <Sheet visible={visible} onClose={() => setVisible(false)} autoHeight>
          <form
            className="flex flex-col"
            //onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <div className="flex h-12 items-center">
                <div
                  className="px-3 h-full flex items-center justify-center"
                  onClick={() => setVisible(false)}
                >
                  <Icon className="text-app" icon="zi-arrow-left" />
                </div>
                <div className="font-semibold">Địa chỉ của tôi</div>
              </div>
              <div className="border-t border-4"></div>
              <div className="p-3 bg-white mt-1.5">
                <Controller
                  name="SenderAddress"
                  control={control}
                  render={({ field: { ref, ...field }, fieldState }) => (
                    <Input.TextArea
                      label="Địa chỉ"
                      placeholder="Nhập địa chỉ"
                      showCount
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>
            <div className="p-3 border-t">
              <Button
                fullWidth
                className="!rounded-sm !bg-app disabled:!text-white disabled:opacity-60"
                onClick={handleSubmit(onSubmit)}
              >
                Cập nhập thay đổi
              </Button>
            </div>
          </form>
        </Sheet>,
        document.body,
      )}
    </>
  );
};
