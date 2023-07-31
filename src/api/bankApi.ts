import { IRequestBank, IVietcomBank } from "../types";
import axiosClient from "./axiosClient";

const bankApi = {
  getBanks: async (params: IRequestBank) => {
    const url = "/bank";
    const res = await axiosClient.get(url, { params });
    return res.data;
  },
  syncVietcombank: async (params: IVietcomBank) => {
    const url = "/bank/vietcombank";
    const res = await axiosClient.post(url, params);
    return res.data;
  },
};

export default bankApi;
