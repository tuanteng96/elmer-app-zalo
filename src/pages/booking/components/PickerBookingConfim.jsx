import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button, Input, Sheet, Switch, Select } from "zmp-ui";
import { Controller, useFormContext } from "react-hook-form";
import clsx from "clsx";
import { EzsSelectUserDV } from "../../../partials/select";
import { useLocation } from "react-router";
import { useLayout } from "../../../layout/LayoutProvider";

export const PickerBookingConfim = ({ children, addBookingMutation }) => {
  const { search } = useLocation();
  const [visible, setVisible] = useState(false);

  const { control, watch } = useFormContext();
  const { GlobalConfig } = useLayout();

  const inputElement = useRef();
  let { StockID } = watch();

  useEffect(() => {
    visible && setVisible(false);
  }, [search]);

  return (
    <>
      {children({
        open: () => setVisible(true),
        close: () => setVisible(false),
      })}
      {createPortal(
        <Sheet visible={visible} onClose={() => setVisible(false)} autoHeight>
          <div className="h-full">
            <div>
              {GlobalConfig?.APP?.Booking?.AtHome && (
                <Controller
                  name="AtHome"
                  control={control}
                  render={({ field: { ref, ...field }, fieldState }) => (
                    <div className="flex justify-between p-3 border-b">
                      <div className="text-[14px]">Sử dụng dịch vụ tại nhà</div>
                      <Switch
                        size="small"
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </div>
                  )}
                />
              )}

              <div className="p-3 border-b">
                {GlobalConfig?.Admin?.dat_lich_nhan_vien === 1 && (
                  <Controller
                    name="UserServiceIDs"
                    control={control}
                    render={({ field: { ref, ...field }, fieldState }) => (
                      <EzsSelectUserDV
                        value={field.value}
                        onChange={field.onChange}
                        StockID={StockID}
                        type="text"
                        className="cursor-pointer"
                        label="Nhân viên thực hiện"
                        placeholder="Chọn nhân viên"
                      />
                    )}
                  />
                )}
                {GlobalConfig?.APP?.SL_khach && (
                  <Controller
                    name="AmountPeople"
                    control={control}
                    render={({ field: { ref, ...field }, fieldState }) => (
                      <div className="mb-2">
                        <Select
                          placeholder="Chọn số lượng khách"
                          onChange={field.onChange}
                          value={field.value}
                        >
                          {Array(10)
                            .fill()
                            .map((_, x) => (
                              <Select.Option
                                key={x}
                                value={x + 1}
                                title={x + 1 + " khách"}
                              />
                            ))}
                        </Select>
                      </div>
                    )}
                  />
                )}

                <Controller
                  name="Desc"
                  control={control}
                  render={({ field: { ref, ...field }, fieldState }) => (
                    <Input.TextArea
                      onChange={field.onChange}
                      value={field.value}
                      className="!mb-0"
                      showCount
                      placeholder="Nhập ghi chú của bạn?"
                    />
                  )}
                />
              </div>
            </div>
            <div className="p-3">
              <Button
                onClick={() =>
                  inputElement?.current && inputElement?.current?.click()
                }
                htmlType="submit"
                className={clsx(
                  "transition uppercase font-medium !bg-app",
                  addBookingMutation.isLoading && "!bg-opacity-70",
                )}
                fullWidth
                size="large"
                loading={addBookingMutation.isLoading}
              >
                Đặt lịch ngay
              </Button>
            </div>
          </div>
        </Sheet>,
        document.body,
      )}
      <button ref={inputElement} type="submit" className="hidden" />
    </>
  );
};
