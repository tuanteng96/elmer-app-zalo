import { useMutation } from "@tanstack/react-query";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { createSearchParams, useLocation } from "react-router-dom";
import { Icon, Page, Tabs, Text, useNavigate } from "zmp-ui";
import BookingAPI from "../../api/booking.api";
import { useQueryParams } from "../../hook";
import { useLayout } from "../../layout/LayoutProvider";
import BookingFinish from "./BookingFinish";
import BookingService from "./BookingService";
import BookingTime from "./BookingTime";

const initialValue = {
  AtHome: false,
  MemberID: "",
  RootIdS: [],
  BookDate: "",
  Desc: "",
  StockID: "",
  FullName: "",
  Phone: "",
  UserServiceIDs: "",
  AmountPeople: 1,
};

const formatDesc = (Desc) => {
  let AmountPeople = 1;
  let newDesc = Desc;

  let descSplit = Desc?.split("\n");
  if (descSplit) {
    for (let i of descSplit) {
      if (i.includes("Số lượng khách:")) {
        let SL = Number(i.match(/\d+/)[0]);
        AmountPeople = SL ? Number(SL) : 1;
      }
      if (i.includes("Ghi chú:")) {
        newDesc = i.replaceAll("Ghi chú: ", "");
        let indexCut = newDesc && newDesc.indexOf("(Thay đổi từ");
        if (indexCut > -1) {
          newDesc = newDesc.substring(0, indexCut);
        }
      }
    }
  }

  return {
    AmountPeople: AmountPeople,
    Desc: newDesc.replaceAll("</br>", "\n"),
  };
};

const BookingPage = () => {
  const navigate = useNavigate();
  const { Auth, CurrentStocks, GlobalConfig, Stocks } = useLayout();
  const { state } = useLocation();

  const queryParams = useQueryParams();
  let queryKey = queryParams?.Type || "Time";

  const methods = useForm({
    defaultValues: !state?.formState
      ? {
          ...initialValue,
          StockID:
            CurrentStocks?.ID && Stocks.some((x) => x.ID === CurrentStocks?.ID)
              ? CurrentStocks?.ID
              : "",
          MemberID: Auth?.ID || "",
        }
      : {
          ...initialValue,
          BookDate: state?.formState?.BookDate
            ? moment(state?.formState?.BookDate, "YYYY-MM-DD HH:mm:ss").toDate()
            : "",
          ID: state?.formState?.ID || 0,
          AtHome: state?.formState?.AtHome || false,
          MemberID: state?.formState?.MemberID || Auth?.ID,
          RootIdS: state?.formState?.Roots ? state?.formState?.Roots : [],
          Desc: state?.formState?.Desc
            ? formatDesc(state?.formState?.Desc).Desc
            : "",
          AmountPeople: state?.formState?.Desc
            ? formatDesc(state?.formState?.Desc).AmountPeople
            : 1,
          StockID:
            state?.formState?.StockID ||
            (CurrentStocks?.ID && Stocks.some((x) => x.ID === CurrentStocks?.ID)
              ? CurrentStocks?.ID
              : ""),
          FullName: state?.formState?.Member?.FullName || "",
          Phone: state?.formState?.Member?.MobilePhone || "",
          UserServiceIDs:
            state?.formState?.UserServices &&
            state?.formState?.UserServices.length > 0
              ? state?.formState.UserServices[0].ID
              : "",
          PrevBook: state?.formState,
        },
  });
  const { handleSubmit, setValue, reset, watch } = methods;

  let watchForm = watch();

  useEffect(() => {
    if (!state?.formState && !watchForm.ID)
      setValue(
        "StockID",
        CurrentStocks?.ID && Stocks.some((x) => x.ID === CurrentStocks?.ID)
          ? CurrentStocks?.ID
          : "",
      );
  }, [CurrentStocks, state?.formState]);

  useEffect(() => {
    if (!state?.formState && !watchForm.ID)
      setValue("MemberID", Auth?.ID || "");
  }, [Auth, state?.formState]);

  useEffect(() => {
    if (queryParams.initialValues) {
      let initialValues = JSON.parse(queryParams.initialValues);
      setValue("RootIdS", initialValues.RootIdS);
    }
  }, [queryParams.initialValues]);

  const addBookingMutation = useMutation({
    mutationFn: (body) => BookingAPI.add(body),
    mutationKey: ["addBooking"],
  });

  const onSubmit = (values) => {
    let Tags = [];

    if (values.RootIdS && values.RootIdS.length > 0) {
      if (
        values.RootIdS.some(
          (item) =>
            item.OsBook > 0 ||
            item.OsDoing > 0 ||
            item.OsNew > 0 ||
            item.OsBH > 0,
        )
      ) {
        Tags.push("Có thẻ");
      }
      if (
        values.RootIdS.some(
          (item) =>
            item.OsBook === 0 &&
            item.OsDoing === 0 &&
            item.OsNew === 0 &&
            item.OsBH === 0,
        )
      ) {
        Tags.push("Không thẻ");
      }
    }

    let newDesc =
      GlobalConfig?.APP?.SL_khach && values?.AmountPeople
        ? `Số lượng khách: ${
            values?.AmountPeople
          }. \nTags: ${Tags.toString()} \nGhi chú: ${
            (values.Desc ? values.Desc.replaceAll("\n", "</br>") : "") +
            (values?.PrevBook
              ? ` (Thay đổi từ ${values?.PrevBook?.RootTitles} - ${moment(
                  values?.PrevBook?.BookDate,
                ).format("HH:mm DD-MM-YYYY")})`
              : "")
          }`
        : (values.Desc ? values.Desc.replaceAll("\n", "</br>") : "") +
          (values?.PrevBook
            ? ` (Thay đổi từ ${values?.PrevBook?.RootTitles} - ${moment(
                values?.PrevBook?.BookDate,
              ).format("HH:mm DD-MM-YYYY")})`
            : "");

    const dataSubmit = {
      booking: [
        {
          ...values,
          RootIdS: values?.RootIdS
            ? values?.RootIdS.map((x) => x.ID).toString()
            : "",
          BookDate: values?.BookDate
            ? moment(values?.BookDate).format("YYYY-MM-DD HH:mm")
            : "",
          StockID: values?.StockID || 0,
          Desc: newDesc,
        },
      ],
    };

    if (values?.ID) {
      dataSubmit.deletes = [{ ID: values?.ID }];
    }

    addBookingMutation.mutate(dataSubmit, {
      onSuccess: () => {
        reset();
        navigate({
          pathname: "/booking",
          search: createSearchParams({
            Type: "Finish",
          }).toString(),
        });
      },
    });
  };

  const onChangeTabs = (e) => {
    if (queryKey === "Time" || queryKey === "Finish") return;
    if (queryKey == "Service" && e === "Finish") return;
    navigate({
      pathname: "/booking",
      search: createSearchParams({
        Type: e,
      }).toString(),
    });
  };

  return (
    <Page className="page" hideScrollbar>
      <div className="navbar fixed top-0 left-0 min-w-[100vw] max-w-[100vw] z-[999] bg-white">
        <div className="w-2/3 relative flex items-center h-full pl-10">
          <div
            className="absolute left-0 w-10 h-full flex justify-center items-center cursor-pointer"
            onClick={() => {
              if (queryKey === "Time" || queryKey === "Finish") {
                navigate(state?.prevState || queryParams?.prevState || "/");
              } else {
                navigate(-1);
              }
            }}
          >
            <Icon icon="zi-chevron-left-header" className="text-app" />
          </div>
          <Text.Title className="text-app">Đặt lịch dịch vụ</Text.Title>
        </div>
      </div>
      <FormProvider {...methods}>
        <form className="h-full border-t" onSubmit={handleSubmit(onSubmit)}>
          <Tabs
            activeKey={queryKey}
            className="tab-scrollbar zaui-cols-3 tab-booking"
            onChange={onChangeTabs}
          >
            <Tabs.Tab key="Time" label="Thời gian">
              <BookingTime invisible={queryKey !== "Time"} />
            </Tabs.Tab>
            <Tabs.Tab key="Service" label="Dịch vụ">
              <BookingService addBookingMutation={addBookingMutation} />
            </Tabs.Tab>
            <Tabs.Tab key="Finish" label="Hoàn tất">
              <BookingFinish />
            </Tabs.Tab>
          </Tabs>
        </form>
      </FormProvider>
    </Page>
  );
};

export default BookingPage;
