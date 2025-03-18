import axios from "axios";
import NProgress from "nprogress";
import { store } from "../redux/store";

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 100,
});

const instance = axios.create({
  baseURL: "http://localhost:9996/",
});

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // try {
    //   setTimeout(() => {
    //     // console.log("check store (trước khi request):", store.getState());
    //     const access_token = store?.getState()?.user?.account?.access_token;
    //     config.headers.authorization = `Bearer ${access_token}`;
    //   }, 100);
    // } catch (error) {
    //   console.error("Lỗi khi lấy Redux state trong interceptor:", error);
    // }

    const access_token = store?.getState()?.user?.account?.access_token;
    config.headers.authorization = `Bearer ${access_token}`;

    NProgress.start();
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    NProgress.done();
    return response && response.data ? response.data : response;
  },
  function (error) {
    NProgress.done();
    console.log("<<<<<<<<<< interceptor error", error.response?.data);
    return error.response?.data || Promise.reject(error);
  }
);

export default instance;
