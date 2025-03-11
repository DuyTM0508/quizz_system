import useGetListBlog from "../../services/modules/blog/hooks/useGetListBlog";
import "./BlogPage.css";
import { useNavigate } from "react-router-dom";

const BlogPage = () => {
  //!State
  const navigate = useNavigate();
  const { data: dataBlog, loading } = useGetListBlog();

  //!Function
  const handleReadMore = (id) => {
    navigate(`/blog/${id}`);
  };

  //!Render
  if (loading) return <div>Loading...</div>;
  return (
    <div className="blog-page">
      <header className="blog-header">
        <h1>
          Our <span className="highlight">Blog</span>
        </h1>
        <p className="subtitle">
          Insights, thoughts, and stories about design, technology, and
          development.
        </p>
      </header>

      <section className="featured-post">
        <div className="featured-post-card">
          <div className="featured-image-container">
            <img
              src={dataBlog?.data?.[0].image || "/placeholder.svg"}
              alt={dataBlog?.data?.[0].title}
              className="featured-image"
            />
          </div>
          <div className="featured-content">
            <div className="post-meta"></div>
            <h2 className="featured-title">{dataBlog?.data?.[0].title}</h2>
            <p
              className="featured-description"
              dangerouslySetInnerHTML={{
                __html: dataBlog?.data?.[0].description,
              }}
            ></p>
            <button
              className="read-more-btn"
              onClick={() => handleReadMore(dataBlog?.data?.[0].id)}
            >
              Read more
              <span className="arrow-icon">→</span>
            </button>
          </div>
        </div>
      </section>

      <section className="blog-posts-grid">
        {dataBlog?.data
          ?.filter((item) => item?.id !== dataBlog?.data?.[0]?.id)
          .map((post) => (
            <article key={post?.id} className="blog-card">
              <div className="image-container">
                <img
                  src={post?.image || "/placeholder.svg"}
                  alt={post?.title}
                  className="post-image"
                />
              </div>
              <div className="post-content">
                <h3 className="post-title">{post?.title}</h3>
                <p
                  className="post-description"
                  dangerouslySetInnerHTML={{
                    __html: post?.description,
                  }}
                ></p>
                <button
                  className="read-more-link"
                  onClick={() => handleReadMore(post?.id)}
                >
                  Read more
                  <span className="arrow-icon">→</span>
                </button>
              </div>
            </article>
          ))}
      </section>

      {/* <div className="pagination">
        <button className="pagination-btn active">1</button>
        <button className="pagination-btn">2</button>
        <button className="pagination-btn">3</button>
        <button className="pagination-btn">Next →</button>
      </div> */}
    </div>
  );
};

export default BlogPage;
