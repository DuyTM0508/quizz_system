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
            {dataDetailBlog?.data?.description && (
              <div
                dangerouslySetInnerHTML={{
                  __html: dataDetailBlog?.data?.description,
                }}
              />
            )}
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;
