import http from "../utils/http";

const MemberAPI = {
  listDV: ({ StockID = "" }) =>
    http.get(
      `/api/gl/select2?cmd=user&includeRoles=1&includeSource=1&crstockid=${StockID}&roles=DV`,
    ),
  addUpdate: (body) =>
    http.post("/api/v3/member23@AddMember", JSON.stringify(body)),
  addZalo: (data) =>
    http.post(`/api/v3/zaloapp@addorupdate`, JSON.stringify(data)),
};

export default MemberAPI;
