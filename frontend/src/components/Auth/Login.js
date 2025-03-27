import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postLogin } from "../../service/apiService";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { doLogin } from "../../redux/action/userAction";
import { ImSpinner10 } from "react-icons/im";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    setIsLoading(true);
    const data = await postLogin(email, password);
    if (data && data.EC === 0) {
      dispatch(doLogin(data));
      toast.success(data.EM);
      setIsLoading(false);
      navigate("/");
    }

    if (data && data.EC !== 0) {
      toast.error(data.EM);
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
              <span className="me-3 text-muted">
                Don't have an account yet?
              </span>
              <button
                onClick={() => navigate("/register")}
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
                Register
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
                  <h2 className="fw-bold text-primary mb-1">Welcome Back</h2>
                  <p className="text-muted">Sign in to continue</p>
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="form-label fw-semibold">
                    Email Address
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
                      style={{ borderRadius: "0 8px 8px 0" }}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label
                      htmlFor="password"
                      className="form-label fw-semibold mb-0"
                    >
                      Password
                    </label>
                    <span
                      className="text-primary fw-semibold small cursor-pointer"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        toast.info("Password reset functionality coming soon!")
                      }
                    >
                      Forgot password?
                    </span>
                  </div>
                  <div className="input-group mb-3">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-lock text-muted"></i>
                    </span>
                    <input
                      id="password"
                      type="password"
                      className="form-control border-start-0 ps-0"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ borderRadius: "0 8px 8px 0" }}
                    />
                  </div>
                </div>

                <button
                  onClick={handleLogin}
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
                      <ImSpinner10
                        className="me-2"
                        style={{
                          animation: "spin 1s infinite linear",
                          display: "inline-block",
                        }}
                      />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
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

export default Login;
