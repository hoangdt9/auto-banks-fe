import axios from "axios";
import queryString from "query-string";

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "content-type": "application/json",
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config: any) => {
  return config;
});

const tokenApi = {
  refresh: async (params: object) => {
    const url = "/auth/token/refresh/";
    const res = await axiosClient.post(url, params);
    return res.data;
  },
};

export const userApi = {
  login: async (params: any) => {
    const url = "/auth/login/";
    const res = await axiosClient.post(url, params);
    return res.data;
  },

  loginFacebook: (token: Object) => {
    const url = `/social_auth/facebook/`;
    return axiosClient.post(url, token);
  },

  loginGoogle: (token: Object) => {
    const url = `/social_auth/google/`;
    return axiosClient.post(url, token);
  },
};

export default tokenApi;
