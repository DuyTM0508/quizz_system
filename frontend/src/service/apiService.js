import { delay } from "lodash";
import axios from "../utils/axiosCustomize";
// const postCreatedNewUser = (email, password, username, role, image) => {
//   // data submit form
//   const data = new FormData();
//   data.append("email", email);
//   data.append("password", password);
//   data.append("username", username);
//   data.append("role", role);
//   data.append("userImage", image);
//   return axios.post("api/v1/participant", data);
// };

const postCreatedNewUser = (email, password, username, admin) => {
  const data = {
    email,
    password,
    username,
    admin,
    // userImage: image, // Nếu image là URL hoặc Base64, có thể gửi trực tiếp
  };

  return axios.post("v1/user/create", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const PutUpdateUser = (email, password, username, admin, userId) => {
  const data = {
    email,
    password,
    username,
    admin,
    // userImage: image, // Nếu image là URL hoặc Base64, có thể gửi trực tiếp
  };

  return axios.put(`v1/user/update/${userId}`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// const PutUpdateUser = (id, username, role, image) => {
//   // data submit form
//   const data = new FormData();
//   data.append("id", id);
//   data.append("username", username);
//   data.append("role", role);
//   data.append("userImage", image);
//   return axios.put("api/v1/participant", data);
// };

const getAllUser = () => {
  return axios.get("api/v1/participant/all");
};

const DeleteUser = (userId) => {
  return axios.delete(`v1/user/delete/${userId}`);
};

const getUserWithPaginate = (page, limit) => {
  return axios.get(`v1/user/all/?page=${page}&limit=${limit}`);
};

const postLogin = (username, password) => {
  return axios.post(`v1/auth/Login`, { username, password });
};

const postRegister = (email, username, password, role) => {
  return axios.post(`v1/auth/register`, { email, username, password, role });
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
