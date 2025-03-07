import { useEffect, useState } from "react";
import blogService from "../blog.service";

const useGetDetailBlog = (id, { isTrigger = false }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!isTrigger) return;
    setLoading(true);
    try {
      const response = await blogService.getDetailBlog(id);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching blog post", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return { data, loading, fetchData };
};

export default useGetDetailBlog;
