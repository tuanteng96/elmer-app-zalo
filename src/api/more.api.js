import http from "../utils/http";

const MoreAPI = {
  getStocks: () => http.get("/api/v3/web?cmd=getStock"),
};

export default MoreAPI;
