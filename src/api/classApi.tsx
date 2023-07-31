import axiosClient from "./axiosClient";

const classApi = {
  registerNewClass: async (params: any) => {
    const url = "/classes/";
    const res = await axiosClient.post(url, params);
    return res.data;
  },
  updateClass: async (id: number, params: any) => {
    const url = `/classes/update/${id}`;
    const res = await axiosClient.put(url, params);
    return res.data;
  },
  getClasses: async (
    type?: string,
    location?: string,
    dow?: number | string
  ) => {
    const url = `/classes?type=${type}&location=${location}&dow=${dow}`;
    const res = await axiosClient.get(url);
    return res.data;
  },
  getClassesByLocation: async (location?: string) => {
    const url = `/classes/location=${location}`;
    const res = await axiosClient.get(url);
    return res.data;
  },
  getClassesByStudent: async (student_id?: number) => {
    const url = `/classes/student=${student_id}`;
    const res = await axiosClient.get(url);
    return res.data;
  },
  deleteClass: async (id: number) => {
    const url = `/classes/delete/${id}`;
    const res = await axiosClient.delete(url);
    return res.data;
  },
  getUsedUnit: async (id: number) => {
    const url = `/classes/used-unit/${id}`;
    const res = await axiosClient.get(url);
    return res.data;
  },
};

export default classApi;
