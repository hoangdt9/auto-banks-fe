import axiosClient from "./axiosClient";

const userApi = {
  register: async (params: any) => {
    const url = "/auth/register/";
    const res = await axiosClient.post(url, params);
    return res.data;
  },

  getUsers: async () => {
    const url = "/user";
    const res = await axiosClient.get(url);
    return res.data;
  },

  getUser: async () => {
    const url = `auth/user`;
    const res = await axiosClient.get(url);
    return res.data;
  },

  updateUser: ({ id, ...updateuser }: { id: Number }) => {
    const url = `/user/${id}`;
    return axiosClient.put(url, updateuser);
  },

  resetEmail: (email: Object) => {
    const url = `/auth/request-reset-email/`;
    return axiosClient.post(url, email);
  },

  resetPassword: (params: Object) => {
    const url = `/auth/password-reset-complete`;
    return axiosClient.patch(url, params);
  },

  logout: (token: Object) => {
    const url = `/auth/logout/`;
    return axiosClient.post(url, token);
  },
};

export default userApi;
