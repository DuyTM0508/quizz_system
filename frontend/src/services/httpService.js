import axios from "axios";

class Service {
  constructor() {
    this.axios = axios.create({
      baseURL: 'http://localhost:9999',
    });
  }

  get(url, config) {
    return this.axios.get(url, config);
  }

  post(url, data, config) {
    return this.axios.post(url, data, config);
  }

  put(url, data, config) {
    return this.axios.put(url, data, config);
  }

  delete(url, config) {
    return this.axios.delete(url, config);
  }
}

export default new Service();
