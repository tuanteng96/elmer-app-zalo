import React from "react";
import { useLocation } from "react-router";
import {
  Button,
  Icon,
  Page,
  Text,
  useNavigate,
  Input,
  useSnackbar,
} from "zmp-ui";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLayout } from "../../layout/LayoutProvider";
import { useConfigs } from "../../layout/MasterLayout";
import { useMutation } from "@tanstack/react-query";
import BookingAPI from "../../api/booking.api";
import { HtmlParser } from "../../components/HtmlParser";

const schemaForm = yup
  .object({
    Fullname: yup.string().required("Vui lòng nhập họ và tên"),
    Phone1: yup.string().required("Vui lòng nhập số điện thoại"),
  })
  .required();

const initialValues = {
  Fullname: "",
  Phone1: "",
  Address: "",
  Email: "",
  Content: "",
};

const ContactPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { Auth, CurrentStocks, onOpenActionStocks } = useLayout();
  const { ZaloInfo } = useConfigs();

  const { openSnackbar } = useSnackbar();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      ...initialValues,
      Fullname: Auth ? Auth?.FullName : ZaloInfo?.name,
      Phone1: Auth ? Auth?.MobilePhone : "",
      Content: state?.formState?.Title
        ? `Cần tư vấn ${state?.formState?.Title}`
        : "Liên hệ tư vấn",
    },
    resolver: yupResolver(schemaForm),
  });

  const postMutation = useMutation({
    mutationFn: (body) => BookingAPI.contact(body),
  });

  const onSubmit = (values) => {
    if (!CurrentStocks?.ID) {
      onOpenActionStocks();
    } else {
      let dataPost = {
        contact: {
          ...values,
          StockID: CurrentStocks?.ID,
        },
      };
      postMutation.mutate(dataPost, {
        onSuccess: (data) => {
          openSnackbar({
            text: "Quân tâm chương trình thành công!",
            type: "success",
          });
          navigate("/");
        },
      });
    }
  };

  return (
    <Page className="page !pb-safe-bottom bg-white" hideScrollbar>
      <div className="navbar fixed top-0 left-0 min-w-[100vw] max-w-[100vw] z-[999] bg-white">
        <div className="relative flex items-center w-2/3 h-full pl-10">
          <div
            className="absolute left-0 flex items-center justify-center w-10 h-full cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <Icon icon="zi-chevron-left-header" className="text-app" />
          </div>
          <Text.Title className="truncate text-app">
            {state?.formState?.Title || "Liên hệ chúng tôi"}
          </Text.Title>
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col h-full border-t"
        autoComplete="off"
      >
        <div className="overflow-auto grow no-scrollbar">
          {state?.formState?.Desc && (
            <div className="p-3">
              <HtmlParser>{state?.formState?.Desc}</HtmlParser>
            </div>
          )}
          <div className="p-3 border-t">
            <div className="mb-3">
              <Controller
                name="FullName"
                control={control}
                render={({ field: { ref, ...field }, fieldState }) => (
                  <Input
                    type="text"
                    label="Họ và tên"
                    placeholder="Nhập họ tên của bạn"
                    value={field.value}
                    onChange={field.onChange}
                    status={fieldState?.invalid && "error"}
                  />
                )}
              />
            </div>
            <div className="mb-3">
              <Controller
                name="Phone1"
                control={control}
                render={({ field: { ref, ...field }, fieldState }) => (
                  <Input
                    type="number"
                    label="Số điện thoại"
                    placeholder="Nhập số điện thoại"
                    value={field.value}
                    onChange={field.onChange}
                    status={fieldState?.invalid && "error"}
                  />
                )}
              />
            </div>
          </div>
        </div>
        <div className="p-3">
          <Button
            loading={postMutation.isLoading}
            fullWidth
            htmlType="submit"
            className="!bg-app font-medium"
          >
            Quan tâm chương trình
          </Button>
        </div>
      </form>
    </Page>
  );
};

export default ContactPage;
