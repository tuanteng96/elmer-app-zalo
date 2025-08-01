import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { DatePicker, Icon, Tabs, useNavigate, useSnackbar } from "zmp-ui";
import ConfigsAPI from "../../api/configs.api";
import { useLayout } from "../../layout/LayoutProvider";
import Carousel from "nuka-carousel";
import clsx from "clsx";
import { createSearchParams, useLocation } from "react-router-dom";
import { SheetProvince } from "../../components/sheet-stocks/SheetProvince";
import { createPortal } from "react-dom";

const GroupByCount = (List, Count) => {
  return List.reduce((acc, x, i) => {
    const idx = Math.floor(i / Count);
    acc[idx] = [...(acc[idx] || []), x];
    return acc;
  }, []);
};

const settings = {
  wrapAround: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 4,
  slideIndex: 0,
  cellSpacing: 10,
  renderBottomCenterControls: () => false,
  renderCenterLeftControls: null,
  renderCenterRightControls: ({ nextDisabled, nextSlide }) => (
    <div className="relative font-medium text-sm" onClick={nextSlide}>
      <div className="pr-9 text-muted">Chọn khung giờ khác</div>
      <div className="absolute right-0 top-2/4 -translate-y-2/4 text-app">
        <div className="animate-bounceRight">
          <Icon icon="zi-arrow-right" />
        </div>
      </div>
    </div>
  ),
};

const formatTimeOpenClose = ({ Text, InitialTime, Date }) => {
  let Times = { ...InitialTime };

  let CommonTime = Array.from(Text.matchAll(/\[([^\][]*)]/g), (x) => x[1]);

  if (CommonTime && CommonTime.length > 0) {
    let CommonTimeJs = CommonTime[0].split(";");
    Times.TimeOpen = CommonTimeJs[0];
    Times.TimeClose = CommonTimeJs[1];
  }

  let PrivateTime = Array.from(Text.matchAll(/{+([^}]+)}+/g), (x) => x[1]);
  PrivateTime = PrivateTime.filter((x) => x.split(";").length > 2).map((x) => ({
    DayName: x.split(";")[0],
    TimeOpen: x.split(";")[1],
    TimeClose: x.split(";")[2],
  }));
  if (Date) {
    let index = PrivateTime.findIndex(
      (x) => x.DayName === moment(Date, "DD/MM/YYYY").format("ddd"),
    );

    if (index > -1) {
      Times.TimeOpen = PrivateTime[index].TimeOpen;
      Times.TimeClose = PrivateTime[index].TimeClose;
    }
  }

  return Times;
};

const BookingTime = ({ invisible }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { Stocks, AccessToken, GlobalConfig } = useLayout();

  const [key, setKey] = useState("0");
  const [ListChoose, setListChoose] = useState([]);
  const [DateChoose, setDateChoose] = useState();

  const [open, setOpen] = useState(false);

  const { watch, control, setValue } = useFormContext();
  const { StockID, BookDate } = watch();

  const myRefDate = useRef();

  const { openSnackbar } = useSnackbar();

  useEffect(() => {
    if (BookDate) {
      if (
        moment(BookDate).format("DD-MM-YYYY") === moment().format("DD-MM-YYYY")
      ) {
        setKey("0");
        setDateChoose("");
      } else if (
        moment(BookDate).format("DD-MM-YYYY") ===
        moment().add(1, "days").format("DD-MM-YYYY")
      ) {
        setKey("1");
        setDateChoose("");
      } else {
        setKey("2");
        setDateChoose(moment(BookDate).toDate());
      }
    }
  }, []);

  const { data: ListLock } = useQuery({
    queryKey: ["ListDisable"],
    queryFn: async () => {
      const { data } = await ConfigsAPI.getNames("giocam");
      let result;
      if (data && data.data && data?.data.length > 0) {
        result = data?.data[0].Value ? JSON.parse(data.data[0].Value) : null;
      }
      return result || [];
    },
  });

  useEffect(() => {
    getListChoose(DateChoose);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DateChoose, ListLock, StockID, GlobalConfig]);

  const getListChoose = (DateChoose) => {
    const { TimeOpenG, TimeCloseG, TimeNext, ScheduledMinutes } = {
      TimeOpenG: GlobalConfig?.APP?.Booking?.TimeOpen || {
        hour: "10",
        minute: "00",
        second: "00",
      },
      TimeCloseG: GlobalConfig?.APP?.Booking?.TimeClose || {
        hour: "21",
        minute: "00",
        second: "00",
      },
      TimeNext: GlobalConfig?.APP?.Booking?.TimeNext || 15,
      ScheduledMinutes: GlobalConfig?.APP?.ScheduledMinutes || 0,
      AtHome: true,
      hideNoteTime: true,
    };

    let TimeOpen = TimeOpenG;
    let TimeClose = TimeCloseG;

    let indexStock = Stocks?.findIndex((x) => x.ID === StockID);

    if (indexStock > -1) {
      let StockI = Stocks[indexStock].KeySEO;
      if (StockI) {
        let bookDate = moment().format("DD/MM/YYYY");
        if (key === "1") {
          bookDate = moment().add(1, "day").format("DD/MM/YYYY");
        }
        if (DateChoose) {
          bookDate = moment(DateChoose).format("DD/MM/YYYY");
        }
        let TimesObj = formatTimeOpenClose({
          Text: StockI,
          InitialTime: {
            TimeOpen: TimeOpen
              ? moment().set(TimeOpen).format("HH:mm:ss")
              : "06:00:00",
            TimeClose: TimeClose
              ? moment().set(TimeClose).format("HH:mm:ss")
              : "18:00:00",
          },
          Date: bookDate,
        });
        TimeOpen.hour = TimesObj.TimeOpen.split(":")[0];
        TimeOpen.minute = TimesObj.TimeOpen.split(":")[1];
        TimeClose.hour = TimesObj.TimeClose.split(":")[0];
        TimeClose.minute = TimesObj.TimeClose.split(":")[1];
      } else {
        TimeOpen = TimeOpenG;
        TimeClose = TimeCloseG;
      }
    }
    const newListChoose = [];
    let ListDisable = [];
    if (ListLock && ListLock.length > 0) {
      const indexLock = ListLock.findIndex(
        (item) => Number(item.StockID) === Number(StockID),
      );

      if (indexLock > -1) {
        ListDisable = ListLock[indexLock].ListDisable;
      }
    }
    for (let index = 0; index < 3; index++) {
      let day = moment().add(index, "days").toDate();
      if (DateChoose && index === 2) {
        day = DateChoose;
      }
      let startDate = moment(day).set(TimeOpen);
      let closeDate = moment(day)
        .set(TimeClose)
        .subtract(ScheduledMinutes || 0, "minutes");
      var duration = moment.duration(closeDate.diff(startDate));
      var MinutesTotal = duration.asMinutes();
      let newListTime = [];
      for (let minute = 0; minute <= MinutesTotal; minute += TimeNext) {
        const datetime = moment(startDate).add(minute, "minute").toDate();
        let isDayOff = false;
        if (ListDisable && ListDisable.length > 0) {
          const indexDayOf = ListDisable.findIndex(
            (x) =>
              moment(x.Date, "DD/MM/YYYY").format("DD/MM/YYYY") ===
              moment(datetime).format("DD/MM/YYYY"),
          );
          if (indexDayOf > -1) {
            if (
              ListDisable[indexDayOf].TimeClose &&
              ListDisable[indexDayOf].TimeClose.length > 0
            ) {
              isDayOff = ListDisable[indexDayOf].TimeClose.some((time) => {
                const DateStartDayOf = moment(
                  ListDisable[indexDayOf].Date + time.Start,
                  "DD/MM/YYYY HH:mm",
                );
                const DateEndDayOf = moment(
                  ListDisable[indexDayOf].Date + time.End,
                  "DD/MM/YYYY HH:mm",
                );
                let isStart =
                  moment(datetime, "HH:mm").isSameOrAfter(
                    moment(DateStartDayOf, "HH:mm"),
                  ) ||
                  moment(datetime).format("HH:mm") ===
                    moment(DateStartDayOf).format("HH:mm");
                let isEnd =
                  moment(datetime, "HH:mm").isSameOrBefore(
                    moment(DateEndDayOf, "HH:mm"),
                  ) ||
                  moment(datetime).format("HH:mm") ===
                    moment(DateEndDayOf).format("HH:mm");
                return isStart && isEnd;
              });
            } else {
              isDayOff = true;
            }
          }
        }
        newListTime.push({
          Time: datetime,
          Disable:
            moment()
              .add(ScheduledMinutes, "minutes")
              .diff(datetime, "minutes") > 0 || isDayOff,
        });
      }

      const TotalDisable = newListTime.filter((o) => o.Disable);
      const slideIndex =
        TotalDisable.length > 0 ? Math.floor((TotalDisable.length - 1) / 4) : 0;

      let newObj = {
        day: day,
        children: newListTime,
        childrenGroup: GroupByCount(newListTime, 4),
        slideIndex: slideIndex,
      };
      newListChoose.push(newObj);
    }
    setListChoose(newListChoose);
  };

  const onNext = () => {
    if (!AccessToken) {
      navigate(`${pathname}?fromProtected=${pathname}`);
    } else {
      if (!StockID) {
        openSnackbar({
          text: "Bạn vui lòng chọn cơ sở muốn đặt lịch?",
          type: "error",
        });
      } else if (!BookDate) {
        openSnackbar({
          text: "Bạn vui lòng chọn thời gian đặt lịch?",
          type: "error",
        });
      } else {
        navigate({
          pathname: "/booking",
          search: createSearchParams({
            Type: "Service",
          }).toString(),
        });
      }
    }
  };

  let StocksBooking = GlobalConfig?.StocksNotBook
    ? Stocks &&
      Stocks.filter((o) => !GlobalConfig?.StocksNotBook?.includes(o.ID))
    : Stocks;

  const getBookName = (val, StocksBooking) => {
    if (!StocksBooking || StocksBooking.length === 0) {
      return "Đang tải ...";
    }
    let index =
      StocksBooking && StocksBooking.findIndex((x) => x.ID === Number(val));
    if (index > -1) {
      return StocksBooking[index].Title;
    }
  };

  return (
    <div className="overflow-auto h-full no-scrollbar">
      <div className="bg-white p-3 mt-1.5">
        <div className="mb-3 uppercase font-semibold text-sm">
          1. Chọn cơ sở gần bạn
        </div>
        <div
          className={clsx(
            !GlobalConfig?.APP?.ByProvince && "grid gap-3",
            Stocks.length > 1 && "grid-cols-2",
          )}
        >
          <Controller
            name="StockID"
            control={control}
            render={({ field: { ref, ...field }, fieldState }) => (
              <>
                {GlobalConfig?.APP?.ByProvince ? (
                  <>
                    <div>
                      {field.value
                        ? "Bạn đang đặt lịch tại"
                        : "Bạn chưa chọn cơ sở đặt lịch."}
                      <span className="text-app pl-1.5 font-medium">
                        {getBookName(field.value, StocksBooking)}
                      </span>
                      <div
                        className="text-primary mt-1.5 underline"
                        onClick={() => setOpen(true)}
                      >
                        {field.value ? "Thay đổi cơ sở ?" : "Chọn cơ sở ?"}
                      </div>
                      <SheetProvince
                        active={Number(field.value)}
                        open={open}
                        onHide={() => setOpen(false)}
                        onChange={(val) => {
                          field.onChange(val.ID);
                          setValue("BookDate", "");
                          setOpen(false);
                        }}
                        StocksHide={GlobalConfig?.StocksNotBook || []}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {StocksBooking &&
                      StocksBooking.map((stock, index) => (
                        <div
                          className={clsx(
                            "flex items-center justify-center p-3 rounded-sm cursor-pointer transition",
                            Number(field.value) === stock.ID
                              ? "bg-app text-white"
                              : "bg-light",
                          )}
                          key={index}
                          onClick={() => {
                            field.onChange(stock.ID);
                            setValue("BookDate", "");
                          }}
                        >
                          <div className="font-medium truncate">
                            {stock.Title}
                          </div>
                        </div>
                      ))}
                  </>
                )}
              </>
            )}
          />
        </div>
      </div>
      <div className="bg-white p-3 border-t">
        <div className="mb-3 uppercase font-semibold text-sm">
          2. Chọn thời gian
        </div>
        <div className="hidden">
          <DatePicker
            value={DateChoose || new Date()}
            mask
            maskClosable
            dateFormat="dd/mm/yyyy"
            title="Chọn ngày đặt lịch"
            suffix={<div ref={myRefDate} />}
            onChange={(value) => {
              setKey("2");
              setDateChoose(value);
              setValue("BookDate", "");
            }}
            startDate={new Date()}
          />
        </div>
        <Controller
          name="BookDate"
          control={control}
          render={({ field: { ref, ...field }, fieldState }) => (
            <>
              <Tabs
                className="tabs-time-booking"
                activeKey={key}
                onTabClick={(e) => {
                  if (Number(e) < 2) {
                    setKey(e);
                    setDateChoose("");
                    setValue("BookDate", "");
                  } else {
                    myRefDate?.current?.click();
                  }
                }}
              >
                {ListChoose &&
                  ListChoose.map((item, index) => (
                    <Tabs.Tab
                      key={index}
                      label={
                        index === 2
                          ? DateChoose
                            ? moment(DateChoose).format("DD/MM/YYYY")
                            : "Ngày khác"
                          : moment(item.day).calendar({
                              sameDay: (now) => `[Hôm nay]`,
                              nextDay: (now) => `[Ngày mai]`,
                            })
                      }
                    >
                      <div className="pb-10 slider-booking-time -mx-[5px]">
                        <Carousel
                          key={key}
                          {...{ ...settings, slideIndex: item.slideIndex }}
                        >
                          {item.childrenGroup &&
                            item.childrenGroup.map((group, groupIndex) => (
                              <div key={groupIndex}>
                                {group &&
                                  group.map((time, timeIndex) => (
                                    <div
                                      className="position-relative mb-2.5 last:mb-0"
                                      key={timeIndex}
                                    >
                                      <div
                                        className={clsx(
                                          "h-10 rounded-sm border flex items-center justify-center text-[13px] font-semibold cursor-pointer transition",
                                          time.Disable &&
                                            "disabled bg-stripes text-muted",
                                          field.value &&
                                            moment(field.value).diff(
                                              time.Time,
                                              "minutes",
                                            ) === 0 &&
                                            "bg-app text-white !border-app",
                                        )}
                                        onClick={() =>
                                          !time.Disable &&
                                          field.onChange(time.Time)
                                        }
                                      >
                                        {moment(time.Time).format("HH:mm A")}
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            ))}
                        </Carousel>
                      </div>
                    </Tabs.Tab>
                  ))}
              </Tabs>
            </>
          )}
        />
      </div>
      <div className="bg-white text-danger p-3 text-sm border-t mb-2">
        (*) Nếu khung giờ bạn chọn đã kín lịch, chúng tôi sẽ liên hệ trực tiếp
        để thông báo.
      </div>
      {!invisible &&
        createPortal(
          <div className="fixed z-50 bottom-0 left-0 w-full pb-safe-bottom bg-white">
            <div className="h-12">
              <button
                onClick={onNext}
                type="button"
                className="w-full h-full text-white uppercase font-semibold text-sm bg-app disabled:opacity-60"
              >
                Chọn dịch vụ
              </button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default BookingTime;
