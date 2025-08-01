import moment from "moment";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  DatePicker,
  Icon,
  Input,
  Page,
  Select,
  Text,
  useNavigate,
  useSnackbar,
} from "zmp-ui";
import { useLayout } from "../../layout/LayoutProvider";
import { useConfigs } from "../../layout/MasterLayout";
import { toAbsolutePath } from "../../utils/assetPath";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import MemberAPI from "../../api/member.api";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";

const schemaUsers = yup
  .object({
    FullName: yup.string().required("Vui lòng nhập họ và tên"),
    MobilePhone: yup.string().required("Vui lòng nhập số điện thoại"),
  })
  .required();

const initialValues = {
  BirthDate_Web: "",
  MemberGroups: null,
  InputGroups: "",
  GroupNames: "",
  Desc: "",
  IsAnonymous: false,
  CheckIn: null,
  TopTeleJson: "",
  ID: 0,
  UserID: "",
  IdentityID: "",
  BarCodeID: "",
  PastPort: "",
  FullName: "",
  BirthDate: null,
  MobilePhone: "",
  FixedPhone: "",
  Email: "",
  CompanyName: "",
  OrganizeName: "",
  HomeAddress: "",
  WorlAddress: "",
  Street: "",
  Group: "",
  DistrictID: "",
  ProvinceID: "",
  Jobs: "",
  ReceiveInformation: "",
  IsApproval: false,
  Enable: false,
  Type: "",
  GroupUser: "",
  Point: 0,
  Other: "",
  IsAff: 1,
  Gender: "",
  Photo: "",
  ByStockID: 0,
  ByUserID: 0,
  HasFinger: 0,
  HandCardID: "",
  Summary: "",
  Source: "",
  GroupName: "",
  Tags: "",
  Present: null,
  IsOfBrand: false,
  IsKeepGroup: false,
};

const CustomerProfile = () => {
  const navigate = useNavigate();
  const { Auth, onSaveAuth } = useLayout();
  const { ZaloInfo } = useConfigs();

  const { openSnackbar } = useSnackbar();

  const { control, handleSubmit, reset, setError } = useForm({
    defaultValues: {
      ...initialValues,
    },
    resolver: yupResolver(schemaUsers),
  });

  useEffect(() => {
    reset({
      ...Auth,
      Birth: Auth?.BirthDate
        ? moment(Auth?.BirthDate, "YYYY-MM-DD").toDate()
        : "",
      Email:
        Auth.Email && !Auth.Email.includes("@nomail.com") ? Auth.Email : "",
    });
  }, [Auth]);

  const addUpdateMutation = useMutation({
    mutationFn: (body) => MemberAPI.addUpdate(body),
    onSuccess: (data) => {
      if (data?.error) {
        openSnackbar({
          text: data?.error,
          type: "error",
        });
      } else {
        if (data?.data?.Member) {
          onSaveAuth(data?.data?.Member);
        }
      }
    },
  });

  const onSubmit = (values) => {
    const dataUser = {
      member: {
        ...values,
        Birth: values.Birth
          ? moment(values.Birth).format("DD/MM/YYYY HH:mm")
          : "",
      },
    };
    addUpdateMutation.mutate(dataUser, {
      onSuccess: ({ data }) => {
        if (data.error) {
          if (
            data.error ===
            "Email đã được sử dụng. Xin vui lòng sử dụng email khác"
          ) {
            setError("Email", {
              type: "Server",
              message: data.error,
            });
          }
          if (
            data.error ===
            "Số điện thoại đã được sử dụng. Xin vui lòng sử dụng Số điện thoại khác"
          ) {
            setError("MobilePhone", {
              type: "Server",
              message: data.error,
            });
          }
        } else {
          openSnackbar({
            text: "Cập nhập thành công.",
            type: "success",
          });
        }
      },
      onError: (error) => {
        console.log(error);
      },
    });
  };

  return (
    <Page className="page !pb-safe-bottom bg-white" hideScrollbar>
      <div className="navbar fixed top-0 left-0 min-w-[100vw] max-w-[100vw] z-[999]">
        <div className="w-2/3 relative flex items-center h-full pl-10">
          <div
            className="absolute left-0 w-10 h-full flex justify-center items-center cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <Icon icon="zi-chevron-left-header" className="text-app" />
          </div>
          <Text.Title className="text-app">Thông tin cá nhân</Text.Title>
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="h-full flex flex-col"
        autoComplete="off"
      >
        <div className="grow overflow-auto no-scrollbar border-t p-3">
          <div className="mb-3 flex items-center justify-center">
            <div className="bg-gray-200 w-36 aspect-square rounded-full flex items-center justify-center cursor-pointer">
              {/* <svg
                className="w-11 text-app"
                viewBox="0 0 25 23"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.072 16.002a.75.75 0 01.75.75v1.842h1.842a.75.75 0 01.743.648l.007.102a.75.75 0 01-.75.75h-1.842v1.842a.75.75 0 01-.648.743l-.102.007a.75.75 0 01-.75-.75v-1.842H18.48a.75.75 0 01-.743-.648l-.007-.102a.75.75 0 01.75-.75h1.842v-1.842a.75.75 0 01.648-.743zM14.102.45a.75.75 0 01.624.334l1.621 2.43h3.285a2.593 2.593 0 012.593 2.594v7.494a.75.75 0 11-1.5 0V5.808c0-.604-.49-1.093-1.093-1.093h-3.686a.75.75 0 01-.624-.334L13.7 1.95H8.974l-1.62 2.43a.75.75 0 01-.624.335H3.043c-.604 0-1.093.49-1.093 1.093v11.98c0 .605.49 1.094 1.093 1.094h11.691a.75.75 0 110 1.5H3.044A2.593 2.593 0 01.45 17.789V5.808a2.593 2.593 0 012.593-2.593h3.285L7.948.784A.75.75 0 018.574.45zm-2.764 5.53a5.358 5.358 0 110 10.716 5.358 5.358 0 010-10.716zm0 1.5a3.858 3.858 0 100 7.716 3.858 3.858 0 000-7.716zM4.08 5.808a1.037 1.037 0 110 2.074 1.037 1.037 0 010-2.074z"
                  fill="currentColor"
                  fillRule="evenodd"
                />
              </svg> */}
              <img
                className="shadow-3xl rounded-full w-full"
                src={
                  Auth?.Photo || Auth?.Avatar
                    ? toAbsolutePath(Auth?.Photo || Auth?.Avatar)
                    : ZaloInfo?.avatar
                }
              />
            </div>
          </div>
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
              name="MobilePhone"
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
          <div className="mb-3">
            <Controller
              name="Gender"
              control={control}
              render={({ field: { ref, ...field }, fieldState }) => (
                <Select
                  label="Giới tính"
                  placeholder="Chọn giới tính"
                  onChange={field.onChange}
                  value={field.value ? Number(field.value) : ""}
                  //disabled={Auth?.Gender !== -1}
                  className="disabled:text-[#141415]"
                >
                  <Option value={1} title="Nam" />
                  <Option value={0} title="Nữ" />
                </Select>
              )}
            />
          </div>
          <div className="mb-3">
            <div className="relative">
              <Controller
                name="Birth"
                control={control}
                render={({ field: { ref, ...field }, fieldState }) => (
                  <DatePicker
                    label="Ngày sinh"
                    mask
                    maskClosable
                    dateFormat="dd/mm/yyyy"
                    title="Chọn ngày sinh"
                    placeholder="Chọn ngày sinh"
                    onChange={field.onChange}
                    value={field.value}
                    //disabled={Auth?.BirthDate}
                    inputClass="disabled:text-[#141415]"
                  />
                )}
              />
              {Auth?.BirthDate && (
                <div className="absolute w-full h-full top-0 left-0" />
              )}
            </div>
          </div>
          <div className="mb-3">
            <Controller
              name="Email"
              control={control}
              render={({ field: { ref, ...field }, fieldState }) => (
                <Input
                  type="text"
                  label="Email"
                  placeholder="Nhập Email"
                  onChange={field.onChange}
                  value={field.value}
                />
              )}
            />
          </div>
          <div className="mb-3">
            <Controller
              name="HomeAddress"
              control={control}
              render={({ field: { ref, ...field }, fieldState }) => (
                <Input.TextArea
                  label="Địa chỉ"
                  placeholder="Nhập địa chỉ"
                  onChange={field.onChange}
                  value={field.value}
                  showCount
                />
              )}
            />
          </div>
          <div className="mb-3">
            <Controller
              name="Desc"
              control={control}
              render={({ field: { ref, ...field }, fieldState }) => (
                <Input.TextArea
                  label="Thông tin thêm"
                  placeholder="Nhập thông tin thêm"
                  onChange={field.onChange}
                  value={field.value}
                  showCount
                />
              )}
            />
          </div>
        </div>
        <div className="p-3 border-t">
          <Button
            loading={addUpdateMutation.isLoading}
            className={clsx(
              "!bg-app",
              addUpdateMutation.isLoading && "!opacity-75",
            )}
            htmlType="submit"
            fullWidth
          >
            Cập nhập thông tin
          </Button>
        </div>
      </form>
    </Page>
  );
};

export default CustomerProfile;
