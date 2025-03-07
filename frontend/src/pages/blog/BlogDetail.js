import { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Bookmark,
  MessageSquare,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import useGetDetailBlog from "../../services/modules/blog/hooks/useGetDetailBlog";
import "./BlogDetail.css";

const BlogDetail = () => {
  // State
  const params = useParams();
  const navigate = useNavigate();
  const { id } = params;
  const [isBookmarked, setIsBookmarked] = useState(false);

  const { data: dataDetailBlog, loading } = useGetDetailBlog(id, {
    isTrigger: !!id,
  });

  // Functions
  const handleGoBack = () => {
    navigate(-1);
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const estimateReadTime = (content) => {
    if (!content) return "5 min read";
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  // Render
  if (loading) {
    return (
      <div className="blog-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading article...</p>
      </div>
    );
  }

  return (
    <div className="blog-detail">
      <button onClick={handleGoBack} className="back-button">
        <ArrowLeft size={20} />
        <span>Back to blogs</span>
      </button>

      <article className="blog-article">
        <header className="article-header">
          <h1 className="article-title">{dataDetailBlog?.data?.title}</h1>

          <div className="article-meta">
            <div className="meta-item">
              <Calendar size={16} />
              <span>
                {formatDate(dataDetailBlog?.data?.createdAt) ||
                  "March 15, 2023"}
              </span>
            </div>
            <div className="meta-item">
              <Clock size={16} />
              <span>{estimateReadTime(dataDetailBlog?.data?.content)}</span>
            </div>
          </div>
        </header>

        <div className="article-featured-image-container">
          <img
            src={
              dataDetailBlog?.data?.image ||
              "/placeholder.svg?height=600&width=1200"
            }
            alt={dataDetailBlog?.data?.title}
            className="article-featured-image"
          />
        </div>

        <div className="article-content-wrapper">
          <div className="article-actions">
            <button className="action-button" onClick={toggleBookmark}>
              <Bookmark size={20} className={isBookmarked ? "filled" : ""} />
            </button>
            <button className="action-button">
              <Share2 size={20} />
            </button>
            <button className="action-button">
              <MessageSquare size={20} />
            </button>
          </div>

          <div className="article-content">
            {dataDetailBlog?.data?.content ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: dataDetailBlog.data.content,
                }}
              />
            ) : (
              <>
                <p className="article-paragraph">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p className="article-paragraph">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur. Excepteur sint
                  occaecat cupidatat non proident, sunt in culpa qui officia
                  deserunt mollit anim id est laborum.
                </p>
                <h2 className="article-subheading">Key Takeaways</h2>
                <p className="article-paragraph">
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                  accusantium doloremque laudantium, totam rem aperiam, eaque
                  ipsa quae ab illo inventore veritatis et quasi architecto
                  beatae vitae dicta sunt explicabo.
                </p>
                <blockquote className="article-quote">
                  "Design is not just what it looks like and feels like. Design
                  is how it works." - Steve Jobs
                </blockquote>
                <p className="article-paragraph">
                  Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
                  odit aut fugit, sed quia consequuntur magni dolores eos qui
                  ratione voluptatem sequi nesciunt.
                </p>
              </>
            )}
          </div>
        </div>
      </article>

      <section className="related-posts">
        <h2 className="related-posts-title">You might also like</h2>
        <div className="related-posts-grid">
          {[1, 2, 3].map((item) => (
            <div key={item} className="related-post-card">
              <div className="related-image-container">
                <img
                  src={`/placeholder.svg?height=200&width=300`}
                  alt="Related post"
                  className="related-post-image"
                />
              </div>
              <h3 className="related-post-title">
                Related Article Title {item}
              </h3>
              <p className="related-post-excerpt">
                A brief excerpt from the related article to give readers a
                preview...
              </p>
              <button className="read-more-link">
                Read more
                <span className="arrow-icon">→</span>
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BlogDetail;
