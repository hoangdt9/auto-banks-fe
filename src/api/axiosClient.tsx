import axios from "axios";
import queryString from "query-string";
import { createStorage } from "../utils/LocalStorage";
import tokenApi from "./tokenApi";

// Set up default config for http requests here
// Please have a look at here `https://github.com/axios/axios#request- config` for the full list of configs
const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "content-type": "application/json",
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(
  async (config: any) => {
    const storage = createStorage("citysports");
    const currentUser = storage.getAccount();
    const access_token = currentUser?.tokens?.access;

    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle errors
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const storage = createStorage("citysports");
      const currentUser = storage.getAccount();
      const refresh_token = currentUser?.tokens?.refresh;

      if (!refresh_token) return Promise.reject(error);

      const param = { refresh: refresh_token };
      const tokens = await tokenApi.refresh(param);
      const access_token = tokens.access;
      currentUser.tokens.access = access_token;
    
      axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
      storage.set("account", currentUser);
      return axiosClient(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
