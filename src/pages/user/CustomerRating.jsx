import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import moment from "moment";
import React, { useEffect } from "react";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import PullToRefresh from "react-simple-pull-to-refresh";
import { Icon, Page, Text, useNavigate, useSnackbar } from "zmp-ui";
import AuthAPI from "../../api/auth.api";
import { useLayout } from "../../layout/LayoutProvider";

const CustomerRating = () => {
  const navigate = useNavigate();
  const { Auth, Ratings, isLoadingRatings } = useLayout();
  const queryClient = useQueryClient();
  let isLoading = isLoadingRatings;

  const { openSnackbar } = useSnackbar();

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      rates: [],
    },
  });

  const { fields } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormProvider)
    name: "rates", // unique name for your Field Array
  });

  useEffect(() => {
    if (Ratings) {
      reset({
        rates: Ratings.map((x) => ({
          ...x,
          ID: x.os.ID,
          Rate: "",
          RateNote: "",
        })),
      });
    }
  }, [Ratings]);

  const updateMutation = useMutation({
    mutationFn: async (body) => {
      let data = await AuthAPI.updateRating(body);
      await queryClient.invalidateQueries(["Rating"]);
      return data;
    },
  });

  const onSubmit = (values) => {
    var bodyFormData = new FormData();
    bodyFormData.append(
      "rates",
      JSON.stringify(values.rates.filter((x) => x.Rate > 0)),
    );
    updateMutation.mutate(
      {
        data: bodyFormData,
        MemberID: Auth?.ID,
      },
      {
        onSuccess: () => {
          openSnackbar({
            text: "Thực hiện đánh giá thành công.",
            type: "success",
            duration: 10000,
          });
        },
      },
    );
  };

  return (
    <Page className="page !pb-safe-bottom" hideScrollbar>
      <div className="navbar fixed top-0 left-0 min-w-[100vw] max-w-[100vw] z-[999] bg-white border-b">
        <div className="w-2/3 relative flex items-center h-full pl-10">
          <div
            className="absolute left-0 w-10 h-full flex justify-center items-center cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <Icon icon="zi-chevron-left-header" className="text-app" />
          </div>
          <Text.Title className="text-app">Đánh giá dịch vụ</Text.Title>
        </div>
      </div>
      <>
        {isLoading && (
          <>
            {Array(4)
              .fill()
              .map((_, index) => (
                <div
                  className="bg-white p-4 border-b animate-pulse"
                  key={index}
                >
                  <div className="flex justify-between mb-3">
                    <div className="h-3 bg-gray-200 w-32 rounded-lg"></div>
                    <div className="h-3 bg-gray-200 w-12 rounded-lg"></div>
                  </div>
                  <div>
                    <div>
                      <div className="h-3 bg-gray-200 w-full mb-2 rounded-lg"></div>
                      <div className="h-3 bg-gray-200 w-32 rounded-lg"></div>
                    </div>
                  </div>
                </div>
              ))}
          </>
        )}
        {!isLoading && (
          <PullToRefresh
            className="ezs-ptr"
            onRefresh={() => queryClient.invalidateQueries(["Rating"])}
          >
            <form
              className="h-full flex flex-col"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="grow overflow-auto no-scrollbar">
                {(!fields || fields.length === 0) && (
                  <div className="flex flex-col items-center px-5 py-12">
                    <svg
                      className="w-16 mb-5"
                      viewBox="0 0 56 60"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g fillRule="evenodd">
                        <path
                          d="M1 14c-.55228475 0-1-.4477153-1-1s.44771525-1 1-1h42c.5522847 0 1 .4477153 1 1s-.4477153 1-1 1H1zM15 22c-.5522847 0-1-.4477153-1-1s.4477153-1 1-1h22c.5522847 0 1 .4477153 1 1s-.4477153 1-1 1H15zM17 6c-.5522847 0-1-.44771525-1-1s.4477153-1 1-1h10c.5522847 0 1 .44771525 1 1s-.4477153 1-1 1H17zM13 10c-.5522847 0-1-.44771525-1-1s.4477153-1 1-1h18c.5522847 0 1 .44771525 1 1s-.4477153 1-1 1H13zM36 8h7c.5522847 0 1 .44771525 1 1s-.4477153 1-1 1h-8c-.5522847 0-1-.44771525-1-1V1c0-.55228475.4477153-1 1-1s1 .44771525 1 1v7zM7 24c-.55228475 0-1-.4477153-1-1v-4c0-.5522847.44771525-1 1-1h4c.5522847 0 1 .4477153 1 1v4c0 .5522847-.4477153 1-1 1H7zm1-2h2v-2H8v2zM15 30c-.5522847 0-1-.4477153-1-1s.4477153-1 1-1h6.052c.5522847 0 1 .4477153 1 1s-.4477153 1-1 1H15zM7 32c-.55228475 0-1-.4477153-1-1v-4c0-.5522847.44771525-1 1-1h4c.5522847 0 1 .4477153 1 1v4c0 .5522847-.4477153 1-1 1H7zm1-2h2v-2H8v2zM15 38c-.5522847 0-1-.4477153-1-1s.4477153-1 1-1h4c.5522847 0 1 .4477153 1 1s-.4477153 1-1 1h-4zM7 40c-.55228475 0-1-.4477153-1-1v-4c0-.5522847.44771525-1 1-1h4c.5522847 0 1 .4477153 1 1v4c0 .5522847-.4477153 1-1 1H7zm1-2h2v-2H8v2zM15 46c-.5522847 0-1-.4477153-1-1s.4477153-1 1-1h7.624c.5522847 0 1 .4477153 1 1s-.4477153 1-1 1H15zM7 48c-.55228475 0-1-.4477153-1-1v-4c0-.5522847.44771525-1 1-1h4c.5522847 0 1 .4477153 1 1v4c0 .5522847-.4477153 1-1 1H7zm1-2h2v-2H8v2zM50.4161068 57.3851932c.8194757.8194757 2.1493107.8194757 2.9690786-.000292.8200861-.819409.8200861-2.1487934-.0003531-2.9685554l-5.8009391-5.801939c-.8194757-.8194757-2.1493107-.8194757-2.9687864 0-.8204757.8204757-.8204757 2.1493107 0 2.9697864l5.801 5.801zm-1.4142136 1.4142136l-5.801-5.801c-1.6015243-1.6015243-1.6015243-4.1966893 0-5.7982136 1.6005243-1.6005243 4.1966893-1.6005243 5.7972745.000061l5.8006469 5.801647c1.6019139 1.600591 1.6019139 4.1972066.0002922 5.7975056-1.6005243 1.6005243-4.1966893 1.6005243-5.7972136 0z"
                          fillRule="nonzero"
                        />
                        <path
                          d="M44.2767682 49.0854427c-.0796855.1431637-.1409432.2915959-.1839798.4449137-.2066214.7360886-1.129285.9774606-1.6698952.4368504l-3.071-3.071c-.4227588-.4227589-.3825419-1.1195578.0860482-1.4908709.7296849-.5782061 1.3890884-1.2376096 1.9672945-1.9672945.3713131-.4685901 1.068112-.508807 1.4908709-.0860482l3.071 3.071c.5409662.5409663.298863 1.4642816-.4379449 1.6702017-.1524408.0426036-.299632.1034181-.4698447.1976596-.0184888.0094983-.0184888.0094983-.0310432.015818-.1740347.1024444-.3053389.2007059-.4131672.3085343-.1052752.1052752-.2029509.2352593-.2975553.3920191-.0189673.0378655-.0189673.0378655-.0407833.0782168zm.7492923-.7780213c-.0150164.0082337-.0150277.0082399-.0041919.0024769a3.21566785 3.21566785 0 0 1 .0041919-.0024769zm-3.4977824-2.0632569l1.3399831 1.3399832c.1030122-.1362829.2127271-.2632496.332632-.3831545.1205479-.1205479.2483304-.2309889.3829023-.3328841l-1.339731-1.3397311c-.2299487.2471101-.4686764.4858378-.7157864.7157865zm.9945169 1.8804997l.0060477-.0112071a4.15519983 4.15519983 0 0 0-.004591.0082705l-.0014567.0029366z"
                          fillRule="nonzero"
                        />
                        <path
                          d="M2 54.0002h39c.5522847 0 1 .4477153 1 1s-.4477153 1-1 1H1c-.55228475 0-1-.4477153-1-1v-54c0-.55228475.44771525-1 1-1h34c.2652165 0 .5195704.10535684.7071068.29289322l8 8C43.8946432 8.4806296 44 8.73498351 44 9.0002v14.094c0 .5522847-.4477153 1-1 1s-1-.4477153-1-1V9.41441356L34.5857864 2.0002H2v52z"
                          fillRule="nonzero"
                        />
                        <path
                          d="M44 36.0005c0-6.6277153-5.3722847-12-12-12s-12 5.3722847-12 12 5.3722847 12 12 12 12-5.3722847 12-12zm2 0c0 7.7322847-6.2677153 14-14 14s-14-6.2677153-14-14 6.2677153-14 14-14 14 6.2677153 14 14zM50.4161068 57.3851932c.8194757.8194757 2.1493107.8194757 2.9690786-.000292.8200861-.819409.8200861-2.1487934-.0003531-2.9685554l-5.8009391-5.801939c-.8194757-.8194757-2.1493107-.8194757-2.9687864 0-.8204757.8204757-.8204757 2.1493107 0 2.9697864l5.801 5.801zm-1.4142136 1.4142136l-5.801-5.801c-1.6015243-1.6015243-1.6015243-4.1966893 0-5.7982136 1.6005243-1.6005243 4.1966893-1.6005243 5.7972745.000061l5.8006469 5.801647c1.6019139 1.600591 1.6019139 4.1972066.0002922 5.7975056-1.6005243 1.6005243-4.1966893 1.6005243-5.7972136 0z"
                          fillRule="nonzero"
                        />
                        <path
                          d="M40 36.0005c0-4.4184153-3.5815847-8-8-8-4.4184153 0-8 3.5815847-8 8 0 4.4184153 3.5815847 8 8 8 4.4184153 0 8-3.5815847 8-8zm2 0c0 5.5229847-4.4770153 10-10 10s-10-4.4770153-10-10 4.4770153-10 10-10 10 4.4770153 10 10z"
                          fillRule="nonzero"
                        />
                        <path d="M33.41421356 36l1.41421356 1.41421356c.39052426.39052426.39052426 1.0236893 0 1.41421356-.39052425.39052426-1.0236893.39052426-1.41421356 0L32 37.41421356l-1.41421356 1.41421356c-.39052426.39052426-1.0236893.39052426-1.41421356 0-.39052426-.39052425-.39052426-1.0236893 0-1.41421356L30.58578644 36l-1.41421356-1.41421356c-.39052426-.39052426-.39052426-1.0236893 0-1.41421356.39052425-.39052426 1.0236893-.39052426 1.41421356 0L32 34.58578644l1.41421356-1.41421356c.39052426-.39052426 1.0236893-.39052426 1.41421356 0 .39052426.39052425.39052426 1.0236893 0 1.41421356L33.41421356 36z" />
                      </g>
                    </svg>
                    <div className="font-bold text-lg mb-px">
                      "Hổng" có dữ liệu nào ?
                    </div>
                    <div className="text-center">
                      Không tìm thấy dữ liệu tích điểm của bạn ...
                    </div>
                  </div>
                )}
                {fields && fields.length > 0 && (
                  <div className="p-4">
                    {fields.map((item, index) => (
                      <div
                        className="bg-white mb-4 last:mb-0 rounded-lg"
                        key={index}
                      >
                        <div className="border-b p-4">
                          <div className="uppercase font-semibold mb-2">
                            {index + 1}. {item.prod.Title}
                          </div>
                        </div>
                        <div className="p-4 flex justify-center flex-col align-center text-center">
                          <div className="text-gray-600">
                            Hoàn thành lúc{" "}
                            {moment(item.os.BookDate).format(
                              "HH:mm DD/MM/YYYY",
                            )}
                          </div>
                          <Controller
                            name={`rates[${index}].Rate`}
                            control={control}
                            render={({
                              field: { ref, ...field },
                              fieldState,
                            }) => (
                              <div className="flex items-center justify-center my-3.5">
                                {Array(5)
                                  .fill()
                                  .map((_, i) => (
                                    <div
                                      className="ms-1.5"
                                      key={i}
                                      onClick={() => {
                                        field.onChange(i + 1);
                                      }}
                                    >
                                      <svg
                                        className={clsx(
                                          "w-6 text-gray-300",
                                          Number(field.value) >= i + 1
                                            ? "text-warning"
                                            : "text-gray-300",
                                        )}
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 22 20"
                                      >
                                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                      </svg>
                                    </div>
                                  ))}
                              </div>
                            )}
                          />

                          <div className="mb-1">
                            Nhân viên :{" "}
                            {item.staff.map((user, i) => (
                              <span key={i}>{user.FullName}</span>
                            ))}
                          </div>

                          {/* <div className="rating">
                              <StarComponent
                                ID={item.os.ID}
                                onClickStar={(star, id) => this.onClickStar(star, id)}
                              />
                            </div> */}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {watch()?.rates.some((x) => x.Rate > 0) && (
                <div className="w-full p-4">
                  <button
                    className="bg-app flex items-center justify-center text-white cursor-pointer w-full h-12 rounded-full disabled:opacity-60"
                    type="submit"
                    disabled={updateMutation.isLoading}
                  >
                    {!updateMutation.isLoading && <>Thực hiện đánh giá</>}
                    {updateMutation.isLoading && (
                      <svg
                        aria-hidden="true"
                        role="status"
                        className="inline w-6 text-gray-200 animate-spin"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          className="fill-white"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              )}
            </form>
          </PullToRefresh>
        )}
      </>
    </Page>
  );
};

export default CustomerRating;
