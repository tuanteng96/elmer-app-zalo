import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Icon, Select, Sheet } from "zmp-ui";
import { useLayout } from "../../layout/LayoutProvider";

const SheetProvince = ({ onChange, active, open, onHide, StocksHide }) => {
  const {
    CurrentStocks,
    onSaveStocks,
    actionStocksVisible,
    onHideActionStocks,
    Stocks,
  } = useLayout();

  let [StocksList, setStocksList] = useState([]);
  let [ProvincesList, setProvincesList] = useState([]);

  let [ActiveProvinces, setActiveProvinces] = useState(null);
  let [ActiveDistricts, setActiveDistricts] = useState(null);

  useEffect(() => {
    let newStocks = [];
    let Provinces = [];

    for (let x of Stocks) {
      let obj = {
        ...x,
      };
      let newDesc = x.DescSEO ? JSON.parse(x.DescSEO) : null;

      if (newDesc && newDesc.place && newDesc.place.length > 0) {
        obj.Province = newDesc.place.filter((o) => o.Parentid > 0)[0];
        obj.District = newDesc.place.filter((o) => !o.Parentid)[0];
      }
      newStocks.push(obj);
    }

    for (let province of newStocks) {
      let index = Provinces.findIndex(
        (x) =>
          province?.Province?.Parentid &&
          Number(province?.Province?.Parentid) === Number(x.Parentid),
      );
      if (index > -1) {
        let indexDistr = Provinces[index].Districts.findIndex(
          (o) => Number(o.ID) === Number(province?.District?.ID),
        );
        if (indexDistr === -1) {
          Provinces[index].Districts.push({
            ...province?.District,
            label: province?.District?.Title || null,
            value: province?.District?.ID || null,
          });
        }
      } else {
        Provinces.push({
          ...province?.Province,
          label: province?.Province?.Title || null,
          value: province?.Province?.Parentid || null,
          Districts: [
            {
              ...province?.District,
              label: province?.District?.Title || null,
              value: province?.District?.ID || null,
            },
          ],
        });
      }
    }

    if (StocksHide && StocksHide.length > 0) {
      newStocks = newStocks.filter((o) => !StocksHide.includes(o.ID));
    }

    newStocks = newStocks?.sort(
      (a, b) =>
        Number(a?.Province?.Parentid || 0) - Number(b?.Province?.Parentid || 0),
    );

    setStocksList(newStocks);
    setProvincesList(Provinces && Provinces.filter((x) => x.value));
  }, [Stocks, StocksHide]);

  useEffect(() => {
    if (Stocks) {
      let newValues = [...Stocks];

      if (ActiveProvinces) {
        let newActiveProvinces = JSON.parse(ActiveProvinces);
        newValues = newValues.filter(
          (x) =>
            Number(x?.Province?.Parentid) === Number(newActiveProvinces?.value),
        );
      }
      if (ActiveDistricts) {
        let newActiveDistricts = JSON.parse(ActiveDistricts);
        newValues = newValues.filter(
          (x) => Number(x?.District?.ID) === Number(newActiveDistricts?.value),
        );
      }

      newValues = newValues?.sort(
        (a, b) =>
          Number(a?.Province?.Parentid || 0) -
          Number(b?.Province?.Parentid || 0),
      );

      if (StocksHide && StocksHide.length > 0) {
        newValues = newValues.filter((o) => !StocksHide.includes(o.ID));
      }
      setStocksList(newValues);
    }
  }, [ActiveProvinces, ActiveDistricts, StocksHide]);

  return createPortal(
    <Sheet
      className="bg-white"
      mask
      autoHeight
      visible={open || actionStocksVisible}
      onClose={onHide || onHideActionStocks}
      swipeToClose
    >
      <div className="h-full flex flex-col max-h-[60vh]">
        <div className="flex items-center justify-center h-12 px-4">
          Chọn cơ sở gần bạn ?
        </div>
        <div className="grid grid-cols-2 gap-4 px-4 pb-4 mt-3">
          <div>
            <Select
              placeholder="Chọn tỉnh / thành phố"
              label="Tỉnh / Thành phố"
              onChange={(val) => setActiveProvinces(val)}
              value={ActiveProvinces}
              closeOnSelect
              className="select-not-label"
            >
              {ProvincesList &&
                ProvincesList.map((item, index) => (
                  <Option
                    value={JSON.stringify(item)}
                    title={item.label}
                    key={index}
                  />
                ))}
            </Select>
          </div>
          <div>
            <Select
              placeholder="Chọn quận / huyện"
              label="Quận / Huyện"
              onChange={(val) => setActiveDistricts(val)}
              value={ActiveDistricts}
              closeOnSelect
              className="select-not-label"
              disabled={!ActiveDistricts}
            >
              {ActiveProvinces &&
                JSON.parse(ActiveProvinces).Districts &&
                JSON.parse(ActiveProvinces).Districts.map((item, index) => (
                  <Option
                    value={JSON.stringify(item.value)}
                    title={item.label}
                    key={index}
                  />
                ))}
            </Select>
          </div>
        </div>
        <div className="px-4 overflow-auto grow">
          {StocksList &&
            StocksList.map((item, index) => (
              <div
                className={clsx(
                  "border capitalize cursor-pointer relative rounded-lg mb-4",
                  active
                    ? Number(item.ID) === Number(active)
                      ? "border-app text-app py-4 pl-4 pr-14"
                      : "border-[#b9bdc1] p-4"
                    : item.ID === CurrentStocks?.ID
                      ? "border-app text-app py-4 pl-4 pr-14"
                      : "border-[#b9bdc1] p-4",
                )}
                key={index}
                onClick={() => {
                  onChange ? onChange(item) : onSaveStocks(item);
                }}
              >
                <div className="truncate mb-1 font-semibold text-[16px]">
                  {item.Title}
                </div>
                <div className="font-light text-muted">
                  {item.Desc || "Đang cập nhập"}
                </div>
                {Number(item.ID) === Number(CurrentStocks?.ID) && (
                  <div className="absolute right-4 top-2/4 -translate-y-2/4">
                    <Icon icon="zi-check" />
                  </div>
                )}
              </div>
            ))}
        </div>
        <div
          className="px-4 h-14 min-h-[56px] text-center border-t border-separator flex items-center justify-center text-danger font-semibold"
          onClick={onHideActionStocks}
        >
          Đóng
        </div>
      </div>
    </Sheet>,
    document.body,
  );
};

export { SheetProvince };
