import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postRegister } from "../../service/apiService";
import { toast } from "react-toastify";
import { usePasswordToggle } from "./usePasswordToggle";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { Icon } = usePasswordToggle();

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!email || !password) {
      toast.error("Email and password are required!");
      return;
    }

    setIsLoading(true);
    try {
      const data = await postRegister(email, userName, password);
      if (data && data.EC === 0) {
        toast.success(data.EM);
        navigate("/login");
      }

      if (data && data.EC !== 0) {
        toast.error(data.EM);
      }
    } catch (error) {
      toast.error("An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex flex-column"
      style={{
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      {/* Header */}
      <div
        className="container-fluid py-3"
        style={{ background: "rgba(255, 255, 255, 0.8)" }}
      >
        <div className="row">
          <div className="col-12 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
            </div>
            <div className="d-flex align-items-center">
              <span className="me-3 text-muted">Already have an account?</span>
              <button
                onClick={() => navigate("/login")}
                className="btn btn-outline-primary"
                style={{
                  borderRadius: "50px",
                  padding: "8px 20px",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 8px rgba(13, 110, 253, 0.25)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container flex-grow-1 d-flex align-items-center justify-content-center py-5">
        <div className="row w-100 justify-content-center">
          <div className="col-md-6 col-lg-5 col-xl-4">
            <div
              className="card border-0 shadow-lg"
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary mb-1">Create Account</h2>
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="form-label fw-semibold">
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <div className="input-group mb-3">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-envelope text-muted"></i>
                    </span>
                    <input
                      id="email"
                      type="email"
                      className="form-control border-start-0 ps-0"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{ borderRadius: "0 8px 8px 0" }}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="username" className="form-label fw-semibold">
                    Username
                  </label>
                  <div className="input-group mb-3">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-person text-muted"></i>
                    </span>
                    <input
                      id="username"
                      type="text"
                      className="form-control border-start-0 ps-0"
                      placeholder="Choose a username"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      style={{ borderRadius: "0 8px 8px 0" }}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label fw-semibold">
                    Password <span className="text-danger">*</span>
                  </label>
                  <div className="input-group mb-3">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-lock text-muted"></i>
                    </span>
                    <input
                      id="password"
                      type={isShowPassword ? "text" : "password"}
                      className="form-control border-start-0 border-end-0 ps-0"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <span
                      className="input-group-text bg-light border-start-0 cursor-pointer"
                      onClick={() => setIsShowPassword(!isShowPassword)}
                      style={{
                        cursor: "pointer",
                        borderRadius: "0 8px 8px 0",
                      }}
                    >
                      {isShowPassword ? (
                        <i className="bi bi-eye-slash text-muted"></i>
                      ) : (
                        <i className="bi bi-eye text-muted"></i>
                      )}
                    </span>
                  </div>
                  <div className="form-text small">
                    Password should be at least 8 characters long
                  </div>
                </div>

                <button
                  onClick={handleRegister}
                  disabled={isLoading}
                  className="btn btn-primary w-100 py-2 mt-4"
                  style={{
                    borderRadius: "8px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 8px rgba(13, 110, 253, 0.25)";
                    }
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>

                <div className="text-center mt-4">
                  <span
                    className="text-muted cursor-pointer d-inline-flex align-items-center"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/")}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Back to Homepage
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
