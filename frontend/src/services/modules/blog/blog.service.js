import { BLOG_URL } from "../../../consts/apiUrl";
import httpservice from "../../httpService";
class blogService {
  getListBlog() {
    return httpservice.get(`${BLOG_URL}`);
  }

  getDetailBlog(id) {
    return httpservice.get(`${BLOG_URL}/${id}`);
  }

  putUpdateBlog(id, data) {
    return httpservice.put(`${BLOG_URL}/${id}`, data);
  }

  postCreateBlog(data) {
    return httpservice.post(`${BLOG_URL}`, data);
  }

  deleteBlog(id) {
    return httpservice.delete(`${BLOG_URL}/${id}`);
  }
}

export default new blogService();
