import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Controller, useForm } from "react-hook-form";
import { Button, useSnackbar, Input, Sheet, Select, Spinner } from "zmp-ui";
import { useLayout } from "../../../layout/LayoutProvider";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import ReactQuill from 'react-quill';
import EditorToolbar, { modules, formats } from "./EditorToolbar";
import NewsAPI from "../../../api/news.api";
import ProdsAPI from "../../../api/prods.api";
import ConfigsAPI from "../../../api/configs.api";

import 'react-quill/dist/quill.snow.css';
import { toAbsolutePath } from "../../../utils/assetPath";
import { chooseImage } from "zmp-sdk";

const schemaForm = yup
  .object({
    Title: yup.string().required("Vui lòng nhập họ và tên"),
    Desc: yup.string().required("Vui lòng chọn dịch vụ"),
  })
  .required();

let ChannelsID = "11366";

export const PickerAddReviews = ({ children }) => {
  const [visible, setVisible] = useState(false);

  const { openSnackbar } = useSnackbar();

  const { Auth, CurrentStocks } = useLayout();

  const quillRef = useRef();

  const { handleSubmit, control, setValue, reset } = useForm({
    defaultValues: {
      ID: 0,
      Title: "",
      Desc: "",
      Content: "",
      Thumbnail: "",
      Channels: ChannelsID
    },
    resolver: yupResolver(schemaForm),
  });

  useEffect(() => {
    reset({
      ID: 0,
      Title: Auth?.FullName || "",
      Desc: "",
      Content: "",
      Thumbnail: "",
      Channels: ChannelsID
    })
  }, [visible])

  const { data, isLoading } = useQuery({
    queryKey: ["SelectServices"],
    queryFn: async () => {
      let { data } = await ProdsAPI.roots({
        Ps: 500,
        StockID: CurrentStocks?.ID || "",
      });
      return data?.lst || [];
    },
    enabled: visible
  });

  const postMutation = useMutation({
    mutationFn: (body) => NewsAPI.addPost(body),
  });

  const uploadMutation = useMutation({
    mutationFn: (body) => ConfigsAPI.upload(body),
  });

  const onSubmit = (values) => {

    let newValues = {
      ID: 0,
      Title: values?.Title || "",
      Desc: values?.Desc || "",
      Content: values?.Content || "",
      PhotoList: values?.Thumbnail ? [values.Thumbnail] : [],
      Channels: ChannelsID
    }
    postMutation.mutate({
      arr: [
        newValues
      ]
    }, {
      onSuccess: (data) => {
        if (data?.data?.error) {
          openSnackbar({
            text: data?.data?.error,
            type: "error",
          });
        }
        else {
          openSnackbar({
            text: "Tạo mới đánh giá thành công !",
            type: "success",
          });
          setVisible(false);
        }

      },
    });
  };

  const onUploadThumbnail = async () => {
    const { filePaths } = await chooseImage({
      sourceType: ["album", "camera"],
      //count: 5,
    });
    if (filePaths && filePaths.length > 0) {

      const [selectedFile] = filePaths;

      const blob = await (await fetch(selectedFile)).blob();

      const myFile = new File([blob], 'image.jpeg', {
        type: blob.type,
      });

      var bodyFormData = new FormData()
      bodyFormData.append('file', myFile)

      let { data } = await uploadMutation.mutateAsync(bodyFormData)

      if (data?.data) {
        setValue("Thumbnail", data?.data)
      }
    }

  }

  return (
    <>
      {children({
        open: () => setVisible(true),
        close: () => setVisible(false),
      })}
      {createPortal(
        <Sheet className="sheet-content-scroll" visible={visible} onClose={() => setVisible(false)}>
          <form className="flex flex-col h-[calc(100%-24px)]" onSubmit={handleSubmit(onSubmit)}>
            <div className="h-12 px-4 flex items-center justify-center">
              <div className="font-semibold text-center text-lg">
                Phản hồi cho chúng tôi
              </div>
            </div>
            <div className="border-t border-4 flex items-center justify-center"></div>
            <div className="grow overflow-auto p-4 bg-white mt-1.5">
              <div>
                <div className="mb-3 last:mb-0">
                  <Controller
                    name="Desc"
                    control={control}
                    render={({ field: { ref, ...field }, fieldState }) => (
                      <Select
                        key={new Date().getTime()}
                        name="Desc"
                        label="Dịch vụ sử dụng"
                        placeholder="Chọn dịch vụ"
                        onChange={field.onChange}
                        value={field.value}
                        clear
                        disabled={isLoading}
                        className="disabled:text-[#141415]"
                        status={fieldState?.invalid && "error"}
                      >
                        {
                          data && data.map((item, index) => (
                            <Option value={item.Title} title={item.Title} key={index} />
                          ))
                        }
                      </Select>
                    )}
                  />
                </div>
                <div className="mb-3 last:mb-0">
                  <Controller
                    name="Title"
                    control={control}
                    render={({ field: { ref, ...field }, fieldState }) => (
                      <Input
                        type="text"
                        label="Họ tên"
                        placeholder="Nhập họ tên"
                        value={field.value}
                        onChange={field.onChange}
                        status={fieldState?.invalid && "error"}
                      />
                    )}
                  />
                </div>
                <div className="mb-3 last:mb-0">
                  <div className="text-[14px] mb-2">Nội dung</div>
                  <Controller
                    name="Content"
                    control={control}
                    render={({ field: { ref, ...field }, fieldState }) => (
                      <>
                        <EditorToolbar quillRef={quillRef} />
                        <ReactQuill
                          className="quills"
                          ref={quillRef}
                          getEditor
                          modules={modules}
                          formats={formats}
                          theme="snow"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </>
                    )}
                  />
                </div>
                <div className="mb-3 last:mb-0">
                  <div className="text-[14px] mb-2">Hình ảnh</div>
                  <Controller
                    name="Thumbnail"
                    control={control}
                    render={({ field: { ref, ...field }, fieldState }) => (
                      <div className="aspect-square w-[130px] cursor-pointer relative">
                        {!field.value && (
                          <div className="bg-[#e2f0ff] w-full h-full rounded-md flex items-center justify-center flex-col" onClick={() => onUploadThumbnail()}>
                            <div>
                              <svg className="w-8" viewBox="0 0 25 23" xmlns="http://www.w3.org/2000/svg">
                                <path
                                  className="fill-primary"
                                  d="M21.072 16.002a.75.75 0 01.75.75v1.842h1.842a.75.75 0 01.743.648l.007.102a.75.75 0 01-.75.75h-1.842v1.842a.75.75 0 01-.648.743l-.102.007a.75.75 0 01-.75-.75v-1.842H18.48a.75.75 0 01-.743-.648l-.007-.102a.75.75 0 01.75-.75h1.842v-1.842a.75.75 0 01.648-.743zM14.102.45a.75.75 0 01.624.334l1.621 2.43h3.285a2.593 2.593 0 012.593 2.594v7.494a.75.75 0 11-1.5 0V5.808c0-.604-.49-1.093-1.093-1.093h-3.686a.75.75 0 01-.624-.334L13.7 1.95H8.974l-1.62 2.43a.75.75 0 01-.624.335H3.043c-.604 0-1.093.49-1.093 1.093v11.98c0 .605.49 1.094 1.093 1.094h11.691a.75.75 0 110 1.5H3.044A2.593 2.593 0 01.45 17.789V5.808a2.593 2.593 0 012.593-2.593h3.285L7.948.784A.75.75 0 018.574.45zm-2.764 5.53a5.358 5.358 0 110 10.716 5.358 5.358 0 010-10.716zm0 1.5a3.858 3.858 0 100 7.716 3.858 3.858 0 000-7.716zM4.08 5.808a1.037 1.037 0 110 2.074 1.037 1.037 0 010-2.074z"
                                  fillRule="evenodd"
                                />
                              </svg>
                            </div>
                            <div className="text-sm text-primary mt-2">Upload ảnh</div>
                          </div>
                        )}
                        {
                          field.value && (
                            <div className="w-full h-full relative">
                              <div className="w-8 h-8 shadow border rounded-full bg-white flex items-center justify-center text-danger absolute -right-4 -top-4">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                  className="w-5"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>

                              </div>
                              <div className="border border-[#e2f0ff] overflow-hidden rounded-md flex justify-center w-full h-full">
                                <img className="max-w-[100%] max-h-[100%]" src={toAbsolutePath(field.value)} />
                              </div>
                            </div>
                          )
                        }
                        <div className={clsx("absolute top-0 bg-white/70 w-full h-full rounded-md flex items-center justify-center", uploadMutation.isLoading ? "" : "hidden")}>
                          <Spinner />
                        </div>
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="p-4 border-t grid grid-cols-1 gap-4">
              <Button
                className={clsx(
                  "!bg-app font-medium",
                  postMutation.isLoading && "!opacity-75 pointer-events-none",
                )}
                loading={postMutation.isLoading}
                fullWidth
                htmlType="submit"
              >
                Gửi phản hồi
              </Button>
            </div>
          </form>
        </Sheet>,
        document.body,
      )}
    </>
  );
};
