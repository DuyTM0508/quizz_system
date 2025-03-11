import { useState } from "react";
import { Search, Edit, Trash2, Plus, Eye } from "lucide-react";
import useGetListBlog from "../../../services/modules/blog/hooks/useGetListBlog";
import { useNavigate } from "react-router-dom";

const AdminBlog = () => {
  // State
  const { data: dataBlog, loading } = useGetListBlog();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();

  // Functions
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredBlogs = dataBlog?.data?.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const truncateText = (text, maxLength = 100) => {
    // Remove HTML tags for preview
    const plainText = text.replace(/<[^>]*>/g, "");
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + "...";
  };

  const handleViewBlog = (blog) => {
    setSelectedBlog(blog);
    setShowPreview(true);
  };

  // Render
  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Main Card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 p-6 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Blog Management
              </h1>
              <p className="text-gray-500">
                Manage your blog posts, create new content, and track engagement
              </p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center">
              <Plus
                className="mr-2 h-4 w-4"
                onClick={() => navigate("admin-blog/addNewBlog")}
              />{" "}
              Create New Blog
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search blogs..."
                className="pl-8 w-full border border-gray-300 rounded-md p-2"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium cursor-pointer">
                All
              </span>
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:bg-gray-200">
                Published
              </span>
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:bg-gray-200">
                Draft
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="rounded-md border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[80px]"
                      >
                        Image
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[300px]"
                      >
                        Title
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                      >
                        Description
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[150px]"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBlogs && filteredBlogs.length > 0 ? (
                      filteredBlogs.map((blog) => (
                        <tr key={blog.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-12 w-12 rounded-md overflow-hidden">
                              <img
                                src={
                                  blog.image ||
                                  "https://via.placeholder.com/150"
                                }
                                alt={blog.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900 line-clamp-2">
                              {blog.title}
                            </div>
                          </td>
                          <td className="px-6 py-4 hidden md:table-cell">
                            <div className="text-sm text-gray-500 line-clamp-2">
                              {truncateText(blog.description)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleViewBlog(blog)}
                                className="text-gray-500 hover:text-gray-700 p-1"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="text-gray-500 hover:text-gray-700 p-1">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button className="text-red-500 hover:text-red-700 p-1">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-4 text-center text-sm text-gray-500"
                        >
                          No blogs found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Blog Preview Modal */}
      {showPreview && selectedBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl max-h-[80vh] overflow-y-auto w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold">{selectedBlog.title}</h2>
                  <p className="text-gray-500">Blog Preview</p>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="mt-4">
                <img
                  src={selectedBlog.image || "https://via.placeholder.com/150"}
                  alt={selectedBlog.title}
                  className="w-full h-64 object-cover rounded-md mb-4"
                />
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedBlog.description }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlog;
