import axiosClient from "./axiosClient";

const teacherApi = {
  registerNewTeacher: async (params: any) => {
    const url = "/teachers/";
    const res = await axiosClient.post(url, params, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    return res.data;
  },

  updateTeacher: async (params: any) => {
    const url = `/teachers/update/${params.id}`;
    const res = await axiosClient.put(url, params, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    return res.data;
  },

  getTeacherByClass: async (classes: number[] | string) => {
    const url = `/teachers/?classes=[${classes}]`;
    const res = await axiosClient.get(url);
    return res.data;
  },

  getTeacherById: async (id: number[] | string) => {
    const url = `/teachers/${id}`;
    const res = await axiosClient.get(url);
    return res.data;
  },

  getAllTeachers: async () => {
    const url = `/teachers`;
    const res = await axiosClient.get(url);
    return res.data;
  },

  deleteTeachers: async (params: any) => {
    const url = `/teachers/delete`;
    const res = await axiosClient.delete(url, { data: params });
    return res.data;
  },
};

export default teacherApi;
