import axiosClient from "./axiosClient";

const locationApi = {
  registerNewLocation: async (params: any) => {
    const url = "/locations/";
    const res = await axiosClient.post(url, params);
    return res.data;
  },

  getLocations: async () => {
    const url = "/locations/";
    const res = await axiosClient.get(url);
    return res.data;
  },

  updateLocation: async (params: any) => {
    const url = `/locations/update/${params.location_id}`;
    const res = await axiosClient.put(url, params);
    return res.data;
  },

  deleteLocation: async (location_id: string) => {
    const url = `/locations/delete/${location_id}`;
    const res = await axiosClient.delete(url);
    return res.data;
  },

  getLocationStatus: async () => {
    const url = "/locations/status/";
    const res = await axiosClient.get(url);
    return res.data;
  },

  getPayment: async () => {
    const url = "/locations/payment";
    const res = await axiosClient.get(url);
    return res.data;
  },
};

export default locationApi;
