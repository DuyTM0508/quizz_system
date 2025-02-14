import { delay } from "lodash";
import axios from "../utils/axiosCustomize";
const postCreatedNewUser = (email, password, username, role, image) => {
  // data submit form
  const data = new FormData();
  data.append("email", email);
  data.append("password", password);
  data.append("username", username);
  data.append("role", role);
  data.append("userImage", image);
  return axios.post("api/v1/participant", data);
};

const PutUpdateUser = (id, username, role, image) => {
  // data submit form
  const data = new FormData();
  data.append("id", id);
  data.append("username", username);
  data.append("role", role);
  data.append("userImage", image);
  return axios.put("api/v1/participant", data);
};

const getAllUser = () => {
  return axios.get("api/v1/participant/all");
};

const DeleteUser = (userId) => {
  return axios.delete("api/v1/participant", { data: { id: userId } });
};

const getUserWithPaginate = (page, limit) => {
  return axios.get(`api/v1/participant?page=${page}&limit=${limit}`);
};

const postLogin = (email, password) => {
  return axios.post(`api/v1/login`, { email, password, delay: 5000 });
};

const postRegister = (email, username, password) => {
  return axios.post(`api/v1/register`, { email, username, password });
};

export {
  postCreatedNewUser,
  getAllUser,
  PutUpdateUser,
  DeleteUser,
  getUserWithPaginate,
  postLogin,
  postRegister,
};
