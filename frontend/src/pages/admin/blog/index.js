"use client";

import { useState } from "react";
import { Search, Edit, Trash2, Plus, Eye } from "lucide-react";
import useGetListBlog from "../../../services/modules/blog/hooks/useGetListBlog";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";
import { toast } from "react-toastify";
import blogService from "../../../services/modules/blog/blog.service";

const AdminBlog = () => {
  // State
  const { data: dataBlog, loading, refetch } = useGetListBlog();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const navigate = useNavigate();

  // Functions
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredBlogs = dataBlog?.data?.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const truncateText = (text, maxLength = 100) => {
    const plainText = text.replace(/<[^>]*>/g, "");
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + "...";
  };

  const handleViewBlog = (blog) => {
    setSelectedBlog(blog);
    setShowPreview(true);
  };

  const handleDeleteClick = (blog) => {
    setBlogToDelete(blog);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await blogService.deleteBlog(blogToDelete.id);
      refetch();
      toast.success(response.message);
      setShowDeleteModal(false);
      setBlogToDelete(null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Render
  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Main Card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Blog Management</h1>
              <p className="text-blue-100">
                Manage your blog posts, create new content, and track engagement
              </p>
            </div>
            <button
              className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-full font-semibold shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
              onClick={() => navigate("/admin/admin-blog/addNewBlog")}
            >
              <Plus className="mr-2 h-5 w-5" /> Create New Blog
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search blogs..."
                className="pl-10 w-full border border-gray-300 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium cursor-pointer shadow-md hover:bg-blue-600 transition duration-300">
                All
              </span>
              <span className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium cursor-pointer hover:bg-gray-300 transition duration-300">
                Published
              </span>
              <span className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium cursor-pointer hover:bg-gray-300 transition duration-300">
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
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
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
                        <tr
                          key={blog.id}
                          className="hover:bg-gray-50 transition duration-150"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-16 w-16 rounded-lg overflow-hidden shadow-md">
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
                                className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100 transition duration-300"
                              >
                                <Eye className="h-5 w-5" />
                              </button>
                              <button className="text-green-500 hover:text-green-700 p-1 rounded-full hover:bg-green-100 transition duration-300">
                                <Edit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(blog)}
                                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition duration-300"
                              >
                                <Trash2 className="h-5 w-5" />
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
          <div className="bg-white rounded-lg max-w-3xl max-h-[80vh] overflow-y-auto w-full shadow-xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedBlog.title}
                  </h2>
                  <p className="text-gray-500">Blog Preview</p>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-500 hover:text-gray-700 transition duration-300"
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
                  className="w-full h-64 object-cover rounded-lg mb-4 shadow-md"
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        blogTitle={blogToDelete?.title}
      />
    </div>
  );
};

export default AdminBlog;
