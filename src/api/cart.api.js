import http from "../utils/http";

const CartAPI = {
  list: ({ token = "", body }) =>
    http.post(
      `/api/v3/orderclient?cmd=get&token=${token}`,
      JSON.stringify(body),
    ),
  preCheckVoucher: ({ token, orderid, vcode }) =>
    http.get(
      `/api/v3/VoucherClient?cmd=precheck&token=${token}&orderid=${orderid}&vcode=${vcode}`,
    ),
};

export default CartAPI;
