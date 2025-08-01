import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useSnackbar } from "zmp-ui";

export const BtnAffiliate = ({ code }) => {
  const { openSnackbar } = useSnackbar();
  return (
    <CopyToClipboard
      text={code}
      onCopy={() => {
        console.log("1");
        openSnackbar({
          text: "Đang Copy ...",
          type: "countdown",
          duration: 1000,
          onClose: () => {
            openSnackbar({
              text: "Đã Copy",
              type: "success",
            });
          },
        });
      }}
    >
      <button
        type="button"
        className="border-primary border px-2 py-1 text-sm rounded text-primary"
      >
        Copy mã giới thiệu
      </button>
    </CopyToClipboard>
  );
};
