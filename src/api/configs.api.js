import http from "../utils/http";

const ConfigsAPI = {
  global: () => http.get(`/brand/global/global.json?${new Date().getTime()}`),
  getNames: (names) => http.get(`/api/v3/config?cmd=getnames&names=${names}`),
  upload: (data) => http.post('/api/v3/file?cmd=upload', data, {
    headers: {
      'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBdXRoMlR5cGUiOiJVc2VyRW50IiwiSUQiOiIxIiwiVG9rZW5JZCI6IjE5ODExMjA0MzMiLCJuYmYiOjE3NTMyODA1NzIsImV4cCI6MTgzOTY4MDU3MiwiaWF0IjoxNzUzMjgwNTcyfQ.LatmqB-VqaI8_t_dF8vHtZ5swZp69SFXrLM3lYhEpCs`
    }
  })
};

export default ConfigsAPI;
