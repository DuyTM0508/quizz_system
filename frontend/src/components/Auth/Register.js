import React, { useState } from "react";
import "./Register.scss";
import { useNavigate } from "react-router-dom";
import { postRegister } from "../../service/apiService";
import { toast } from "react-toastify";
import { usePasswordToggle } from "./usePasswordToggle";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("user");

  const [isShowPassword, setIsShowPassword] = useState(false);

  const { Icon } = usePasswordToggle(); // Gọi hook đúng cách

  const navigate = useNavigate();
  const handleRegister = async () => {
    const data = await postRegister(email, userName, password, role);
    if (data && data.EC === 0) {
      toast.success(data.EM);
      navigate("/login");
    }

    if (data && data.EC !== 0) {
      toast.error(data.EM);
    }
  };
  return (
    <div className="register-container">
      <div className="header">
        <span>Are you ready have an Account?</span>
        <button onClick={() => navigate("/login")}>Login</button>
      </div>
      <div className="title col-4 mx-auto">Le Hoang Giang</div>
      <div className="welcome col-4 mx-auto">Start your jouney?</div>
      <div className="content-form col-4 mx-auto">
        <div className="form-group ">
          <label>Email (*)</label>
          <input
            value={email}
            type="email"
            className="form-control"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>UserName</label>
          <input
            value={userName}
            type="text"
            className="form-control"
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div className="form-group password">
          <label>Password (*)</label>
          <input
            value={password}
            type={isShowPassword ? "text" : "password"}
            className="form-control"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="eye-icon">
            <span
              className="password-toggle-icon"
              onClick={() => setIsShowPassword(!isShowPassword)}
            >
              {Icon}
            </span>
          </div>
        </div>

        <div className="btn-submit">
          <button onClick={() => handleRegister()}>Register to gianglh</button>
        </div>
        <div className="text-center">
          <span
            className="back"
            onClick={() => {
              navigate("/");
            }}
          >
            {" "}
            &#60; &#60; Go to Homepage
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;
