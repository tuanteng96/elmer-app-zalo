import http from "../utils/http";

const ProdsAPI = {
  search: ({
    key = "",
    cates = "",
    pi = 1,
    ps = 10,
    token = "",
    stockid = 0,
    status = "",
  }) =>
    http.get(
      `/app/index.aspx?cmd=search_prods&token=${token}&key=${key}&cates=${cates}&pi=${pi}&ps=${ps}&stockid=${stockid}&status=${status}`,
    ),
  listServiceRoot: ({
    cates = "",
    token = "",
    stockid = "",
    rootIds = "",
    pi = 1,
    ps = 10,
  }) =>
    http.get(
      `/api/v3/app2?get=sv&cid=${cates}&token=${token}&stockid=${stockid}&takes=Detail,Desc&pi=${pi}&ps=${ps}&ignorepublic=1&rootIds=${rootIds}`,
    ),
  cateParentID: ({ id = "", token = "", stockid = "" }) =>
    http.get(
      `/app/index.aspx?cmd=cate_parentid&id=${id}&stockid=${stockid}&token=${token}`,
    ),
  prodId: ({ id, token = "" }) =>
    http.get(`/api/v3/prod?cmd=getid&id=${id}&mid=&token=${token}`),
  roots: ({ MemberID = "", Pi = 1, Ps = 15, StockID = "", Key = "", Status = "" }) =>
    http.get(
      `/api/v3/mbook?cmd=getroot&memberid=${MemberID}&ps=${Ps}&pi=${Pi}&key=${Key}&stockid=${StockID}&status=${Status}`,
    ),
  getServiceOriginal: ({ StockID = "", Token = "" }) =>
    http.get(`/api/v3/prod?cmd=roots&stockid=${StockID}&token=${Token}`),
};

export default ProdsAPI;
