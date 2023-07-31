import { IRequestStudents } from "../types";
import axiosClient from "./axiosClient";

const studentApi = {
  registerNewStudent: async (params: any) => {
    const url = "/students/";
    const res = await axiosClient.post(url, params, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    return res.data;
  },
  updateStudent: async (params: any) => {
    const url = `/students/update/${params.student_id}`;
    const res = await axiosClient.put(url, params, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    return res.data;
  },
  getAttendances: async (id: number) => {
    const url = `/students/attendances/${id}`;
    const res = await axiosClient.get(url);
    return res.data;
  },
  getAttendanceUnit: async (id: number, start_date: any) => {
    const url = `/students/attendance-unit/${id}?start_date=${start_date}`;
    const res = await axiosClient.get(url);
    return res.data;
  },
  getStudents: async (params: IRequestStudents) => {
    const url = `/students`;
    const res = await axiosClient.get(url, { params });
    return res.data;
  },
  getStudentById: async (id: number) => {
    const url = `/students/${id}`;
    const res = await axiosClient.get(url);
    return res.data;
  },
  deleteStudents: async (params: any) => {
    const url = `/students/delete`;
    const res = await axiosClient.delete(url, { data: params });
    return res.data;
  },
  getStudentByClass: async (class_id: number) => {
    const url = `/students/class?id=${class_id}`;
    const res = await axiosClient.get(url);
    return res.data;
  },
};

export default studentApi;
