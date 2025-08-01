import clsx from "clsx";
import React, { useState } from "react";
import { Icon } from "zmp-ui";
import { Card } from "./card";

export const CardWrap = ({ service, noMore }) => {
  const [Count, setCount] = useState(3);

  return (
    <div>
      {service?.items &&
        service.items
          .slice(0, noMore ? service?.items?.length : Count)
          .map((item, index) => <Card key={index} item={item} />)}
      {!noMore && service?.items?.length > 3 && (
        <div
          className="border-t border-dashed flex items-center justify-center text-primary py-3 font-medium cursor-pointer"
          onClick={() => setCount(Count > 3 ? 3 : service?.items?.length)}
        >
          {Count > 3 ? "Thu gọn" : "Xem thêm"}{" "}
          <div className={clsx("transition", Count > 3 && "rotate-180")}>
            <Icon icon="zi-chevron-down" />
          </div>
        </div>
      )}
    </div>
  );
};
