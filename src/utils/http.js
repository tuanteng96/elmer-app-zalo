import axios from "axios";
import { ProcessENV } from "./process";

class Http {
  constructor() {
    this.accessToken = "";
    this.accessStock = "";

    this.instance = axios.create({
      baseURL: ProcessENV.URL,
      timeout: 50000,
      headers: {
        "content-type": "text/plain",
      },
    });
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.Authorization = "Bearer " + this.accessToken;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );
    // Add response interceptor
    this.instance.interceptors.response.use(
      ({ data, ...response }) => {
        return {
          data,
        };
      },
      (error) => {
        return Promise.reject(error);
      },
    );
  }
}

const http = new Http().instance;
export default http;
