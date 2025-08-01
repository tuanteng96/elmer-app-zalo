import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { Sheet, Text, useNavigate } from "zmp-ui";
import { useQueryParams } from "../../hook";

export const ServicePicker = ({ children, service }) => {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const queryParams = useQueryParams();

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!visible && Number(queryParams?.SheetID) === service?.root?.ID) {
      setVisible(true);
    }
  }, [queryParams?.SheetID]);

  return (
    <>
      {children({
        open: () => setVisible(true),
        close: () => setVisible(false),
      })}
      {createPortal(
        <Sheet height="85%" visible={visible} onClose={() => setVisible(false)}>
          {service && (
            <div className="h-[calc(100%-24px)] flex flex-col relative">
              <Text.Title className="flex mb-2 text-app !leading-7 px-3">
                {service.root.Title}
              </Text.Title>
              <div className="overflow-auto grow no-scrollbar p-3">
                <div
                  className="leading-6 text-justify"
                  dangerouslySetInnerHTML={{ __html: service.root.Desc }}
                />
                <div
                  className="leading-6 text-justify"
                  dangerouslySetInnerHTML={{ __html: service.root.Detail }}
                />
              </div>
              <div className="px-3 pt-3">
                <div
                  onClick={() => {
                    setVisible(false);
                    navigate("/booking", {
                      state: {
                        prevState:
                          pathname + search + `&SheetID=${service?.root?.ID}`,
                        formState: {
                          Roots: [
                            {
                              ID: service?.root?.ID,
                              Title: service?.root?.Title,
                            },
                          ],
                        },
                      },
                    });
                  }}
                  className="bg-app py-3.5 text-center rounded-3xl text-white font-bold mb-3 block cursor-pointer"
                >
                  Đặt lịch ngay
                </div>
              </div>
            </div>
          )}
        </Sheet>,
        document.body,
      )}
    </>
  );
};
