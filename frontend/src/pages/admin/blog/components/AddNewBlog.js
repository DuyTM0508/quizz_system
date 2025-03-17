import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AddNewBlog.css"; // Custom styles
import blogService from "../../../../services/modules/blog/blog.service";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import useGetDetailBlog from "../../../../services/modules/blog/hooks/useGetDetailBlog";

const AddNewBlog = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;
  const [file, setFile] = useState();

  const { data: dataDetail } = useGetDetailBlog(id, {
    isTrigger: !!id,
  });

  const blogCategories = [
    "Technology",
    "Travel",
    "Food",
    "Lifestyle",
    "Health",
    "Business",
    "Education",
    "Entertainment",
    "Study",
  ];

  const formik = useFormik({
    initialValues: {
      title: dataDetail?.title || "",
      description: dataDetail?.description || "",
      image: dataDetail?.image || "",
      category: dataDetail?.category || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      title: Yup.string()
        .required("Title is required")
        .min(5, "Title must be at least 5 characters"),
      description: Yup.string().required("Description is required"),
      image: Yup.string().required("Image is required"),
      category: Yup.string().required("Category is required"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      setIsSubmitting(true);

      try {
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("category", values.category);

        // Nếu có ảnh mới thì dùng ảnh mới, nếu không thì tải ảnh cũ dưới dạng binary
        if (file) {
          formData.append("image", file); // Ảnh mới chọn
        } else if (values.image && typeof values.image === "string") {
          const response = await fetch(values.image);
          const blob = await response.blob();
          const fileName = values.image.split("/").pop(); // Lấy tên file từ URL
          const fileType = blob.type; // Loại file từ blob
          formData.append(
            "image",
            new File([blob], fileName, { type: fileType })
          );
        }

        if (id) {
          await blogService.putUpdateBlog(id, formData);
          toast.success("Blog updated successfully");
          navigate(-1);
          return;
        }

        await blogService.postCreateBlog(formData);
        toast.success("Blog created successfully");
        formik.resetForm();
        setImagePreview(null);
        setFile(null);
        navigate(-1);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (dataDetail) {
      formik.setValues({
        title: dataDetail?.data?.title || "",
        description: dataDetail?.data?.description || "",
        image: dataDetail?.data?.image || "",
        category: dataDetail?.data?.category || "",
      });
    }
  }, [dataDetail]);

  useEffect(() => {
    if (dataDetail?.data?.image) {
      setImagePreview(dataDetail.data.image);
    }
  }, [dataDetail]);

  return (
    <div className="container py-5">
      <div className="card shadow-lg border-0 rounded-lg">
        <div className="card-header bg-primary text-white py-4">
          <h3 className="card-title mb-0 fw-bold">
            {id ? "Update Blog" : "Add New Blog"}
          </h3>
          <p className="card-text mb-0">Share your thoughts with the world</p>
        </div>
        <div className="card-body p-5">
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="form-label fw-bold">
                Blog Title
              </label>
              <input
                type="text"
                className={`form-control form-control-lg ${
                  formik.touched.title && formik.errors.title
                    ? "is-invalid"
                    : ""
                }`}
                id="title"
                name="title"
                placeholder="Enter a catchy title"
                {...formik.getFieldProps("title")}
              />
              {formik.touched.title && formik.errors.title && (
                <div className="invalid-feedback">{formik.errors.title}</div>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="category" className="form-label fw-bold">
                Category
              </label>
              <select
                className={`form-select form-select-lg ${
                  formik.touched.category && formik.errors.category
                    ? "is-invalid"
                    : ""
                }`}
                id="category"
                name="category"
                {...formik.getFieldProps("category")}
              >
                <option value="">Select a category</option>
                {blogCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {formik.touched.category && formik.errors.category && (
                <div className="invalid-feedback">{formik.errors.category}</div>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="form-label fw-bold">
                Description
              </label>
              <ReactQuill
                theme="snow"
                value={formik.values.description}
                onChange={(content) =>
                  formik.setFieldValue("description", content)
                }
              />
              {formik.touched.description && formik.errors.description && (
                <div className="text-danger mt-2">
                  {formik.errors.description}
                </div>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="image" className="form-label fw-bold">
                Featured Image
              </label>
              <div className="row g-3">
                <div className="col-md-6">
                  <div
                    className={`image-upload-area ${
                      formik.touched.image && formik.errors.image
                        ? "is-invalid"
                        : ""
                    }`}
                    onClick={() =>
                      document.getElementById("image-upload").click()
                    }
                  >
                    <i className="bi bi-image fs-1 text-primary mb-3"></i>
                    <p className="mb-1">Click to upload image</p>
                    <p className="text-muted small">PNG, JPG, GIF up to 10MB</p>
                    <input
                      id="image-upload"
                      name="image"
                      type="file"
                      accept="image/*"
                      className="d-none"
                      onChange={(e) => {
                        const selectedFile = e.target.files?.[0];
                        if (selectedFile) {
                          setImagePreview(URL.createObjectURL(selectedFile));
                          setFile(selectedFile);
                          formik.setFieldValue("image", selectedFile); // Luôn giữ giá trị file
                        }
                      }}
                    />
                  </div>
                  {formik.touched.image && formik.errors.image && (
                    <div className="invalid-feedback d-block">
                      {formik.errors.image}
                    </div>
                  )}
                </div>
                {imagePreview && (
                  <div className="col-md-6">
                    <div className="position-relative">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="img-fluid rounded"
                        style={{ maxHeight: "200px", objectFit: "cover" }}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                        onClick={() => {
                          setImagePreview(null);
                          formik.setFieldValue("image", "");
                        }}
                      >
                        <i className="bi bi-x-lg"></i>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="d-flex justify-content-between border-top pt-4 mt-5">
              <button
                type="button"
                className="btn btn-outline-secondary btn-lg"
                onClick={() => {
                  if (id) {
                    navigate(-1);
                    return;
                  }
                  formik.resetForm();
                  setImagePreview(null);
                }}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Publishing...
                  </>
                ) : (
                  "Publish Blog"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNewBlog;
