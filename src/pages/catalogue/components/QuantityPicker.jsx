import React, { FC } from "react";
import { Box, Button, Icon, Input, Text } from "zmp-ui";

export const QuantityPicker = ({ value, onChange }) => {
  return (
    <Box flex className="border border-[#e9ebed] p-[6px]">
      <Button
        className="!rounded-none !h-9 disabled:!bg-[#f9f9f9] disabled:opacity-30"
        disabled={value < 1}
        onClick={() => onChange(value - 1)}
        variant="tertiary"
        type="neutral"
        icon={
          <div className="py-3 px-1 flex justify-center">
            <div className="w-9/12 h-[1px] bg-black" />
          </div>
        }
      />
      <Input
        className="!m-0 !rounded-none !border-t-0 !border-b-0 text-center !h-9 !border-[#e9ebed]"
        type="text"
        placeholder="SL"
        onChange={(evt) => onChange(evt.target.value)}
        value={value}
      />
      <Button
        className="!rounded-none !h-9 disabled:!bg-[#f9f9f9] disabled:opacity-30"
        onClick={() => onChange(value + 1)}
        variant="tertiary"
        type="neutral"
        icon={<Icon className="!text-[18px] mt-[3px]" icon="zi-plus" />}
      />
    </Box>
  );
};
