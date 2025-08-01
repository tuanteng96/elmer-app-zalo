import http from "../utils/http";

const ZaloAPI = {
  getNumberPhone: ({ access_token = "", SecretKey = "", Code = "" }) =>
    http.get(
      `https://graph.zalo.me/v2.0/me/info?access_token=${access_token}&code=${Code}&secret_key=${SecretKey}`,
    ),
};

export default ZaloAPI;
