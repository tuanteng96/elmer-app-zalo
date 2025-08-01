import http from "../utils/http";

const NewsAPI = {
  getInfoToCateID: (cateid) =>
    http.get(`/api/v3/content?cmd=id&id=${cateid}&tb=categories`),
  getListToID: (ID, Key = "") =>
    http.get(`/api/gl/select2?cmd=art&includeSource=1&channels=${ID}&q=${Key}`),
  getDetailID: (ID) => http.get("/api/v3/article?cmd=get&ids=" + ID),
  getCategories: (ID) =>
    http.get("/api/v3/cate25@getPrCh?app=Article&pid=" + ID),
  addPost: (data) => http.post(`/api/v3/Article25@Add`, JSON.stringify(data))
};

export default NewsAPI;
