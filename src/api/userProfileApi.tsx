import axios from "axios";
import queryString from "query-string";

const url = "http://localhost:8081";

const axiosClient = axios.create({
  baseURL: url,
  headers: {
    "content-type": "application/json",
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config: any) => {
  return config;
});
const userProfileApi = {
  registerNewUserProfile: async (params: any) => {
    const url = "/userProfile/";
    const res = await axiosClient.post(url, params, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    return res.data;
  },

  updateUserProfile: async (id: number, params: any) => {
    const url = `/userProfile/${id}`;
    const res = await axiosClient.put(url, params, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    return res.data;
  },

  getAllUserProfile: async () => {
    const url = `/userProfile`;
    const res = await axiosClient.get(url);
    return res.data;
  },

  deleteUserProfile: async (params: any) => {
    const url = `/userProfile/delete`;
    const res = await axiosClient.delete(url, { data: params });
    return res.data;
  },
  getUserProfileById: async (id: number | string) => {
    const url = `/user/${id}`;
    const res = await axiosClient.get(url);
    return res.data;
  },
  updateUserProfileById: async (id: number | string, params:any) => {
    const url = `/user/${id}`;
    const res = await axiosClient.put(url, params);
    return res.data;
  },
};

export default userProfileApi;
