import http from "../utils/http";

const AdvAPI = {
  getAdvName: (name) => http.get("/app/index.aspx?cmd=adv&pos=" + name),
  getAdvId: (id) => http.get(`/api/v3/adv?cmd=getid&id=${id}`),
};

export default AdvAPI;
