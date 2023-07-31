import axiosClient from "./axiosClient";

const attendanceApi = {
  registerNewAttendance: async (params: any) => {
    const url = "/attendances/";
    const res = await axiosClient.post(url, params);
    return res.data;
  },
  getAttendance: async (classes?: number, date?: string) => {
    const url = `/attendances?classes=${classes}&date=${date}`;
    const res = await axiosClient.get(url);
    return res.data;
  },
  updateAttendance: async (id: number, params: any) => {
    const url = `/attendances/${id}`;
    const res = await axiosClient.put(url, params);
    return res.data;
  },
};

export default attendanceApi;
