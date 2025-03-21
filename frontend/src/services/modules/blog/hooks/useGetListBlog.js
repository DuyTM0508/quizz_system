import { useEffect, useState } from "react";
import blogService from "../blog.service";

const useGetListBlog = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await blogService.getListBlog();
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching blog posts", error);
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, refetch };
};

export default useGetListBlog;
