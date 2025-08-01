import http from "../utils/http";

const AuthAPI = {
  login: ({ USN = "", PWD = "" }) =>
    http.get(
      `/app/index.aspx?cmd=authen&USN=${USN}&PWD=${encodeURIComponent(
        PWD,
      )}&deviceid=&v=2`,
    ),
  authen: ({ ZaloID = "", token = "" }) =>
    http.get(`/app/index.aspx?cmd=authen&token=${token}&zaloid=${ZaloID}`),
  barcode: (MemberID) =>
    http.get(`/services/preview.aspx?cmd=Barcode&mid=${MemberID}`),
  wallet: (data) => http.post(`/services/preview.aspx?cmd=list_money`, data),
  moneyCard: (MemberID) =>
    http.get(`/api/v3/moneycard?cmd=get&memberid=${MemberID}`),
  moneyCardHistory: (ID) =>
    http.get(`/api/v3/moneycard?cmd=detail&id_the_tien=${ID}`),
  diary: (token) => http.post(`/app/index.aspx?cmd=noti&token=${token}`),
  vouchers: (MemberID) =>
    http.post(`/app/index.aspx?cmd=voucherandaff&mid=${MemberID}`),
  orders: (token = "") =>
    http.get(`/app/index.aspx?cmd=orders&token=${token}&IsUser=0`),
  serviceCard: ({ Token = "", MemberID = "" }) =>
    http.get(
      `/services/preview.aspx?a=1&token=${Token}&cmd=loadOrderService&MemberID=${MemberID}&IsMember=1&fromOrderAdd=0`,
    ),
  points: ({ data, Token }) =>
    http.post(`/api/v3/MemberPoint27@Get`, JSON.stringify(data), {
      headers: {
        Authorization: `Bearer ${Token}`,
      },
    }),
  getAffs({ data, Token = "" }) {
    return http.post(
      `/api/v3/member23@MemberByAffMemberID`,
      JSON.stringify(data),
      {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      },
    );
  },
  rating: (MemberID = "") =>
    http.get(`/api/v3/OrderService?cmd=get_service_unrate&mid=${MemberID}`),
  updateRating: ({ MemberID, data }) =>
    http.post(
      `/api/v3/OrderService?cmd=get_service_unrate&mid=${MemberID}`,
      data,
    ),
};

export default AuthAPI;
