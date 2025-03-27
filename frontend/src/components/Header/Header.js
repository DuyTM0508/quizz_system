import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { NavDropdown } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { doLogout } from "../../redux/action/userAction";

const Header = () => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const account = useSelector((state) => state.user.account);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function handleLoginClick() {
    navigate("/login");
  }

  const handleRegisterClick = () => {
    navigate("/register");
  };

  // Get first letter of username for avatar
  const getInitials = () => {
    if (account && account.username) {
      return account.username.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <Navbar
      expand="lg"
      fixed="top"
      className={`py-3 transition-all ${scrolled ? "shadow-sm" : ""}`}
      style={{
        backgroundColor: scrolled
          ? "rgba(255, 255, 255, 0.95)"
          : "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(10px)",
        transition: "all 0.3s ease",
      }}
    >
      <Container>
        <NavLink
          to="/"
          className="navbar-brand d-flex align-items-center"
          style={{
            fontWeight: 700,
            fontSize: "1.5rem",
            color: "#0d6efd",
          }}
        >
          <span
            className="me-2 d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: "#0d6efd",
              color: "white",
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              fontSize: "18px",
            }}
          >
            M
          </span>
          Mage
        </NavLink>

        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          style={{
            border: "none",
            boxShadow: "none",
            padding: "0.5rem",
          }}
        />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `nav-link mx-1 px-3 py-2 ${isActive ? "active" : ""}`
              }
              style={({ isActive }) => ({
                fontWeight: isActive ? "600" : "500",
                color: isActive ? "#0d6efd" : "#495057",
                borderRadius: "8px",
                transition: "all 0.2s ease",
                position: "relative",
              })}
            >
              <i className="bi bi-house-door me-1"></i> Home
            </NavLink>

            {account.role === true && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `nav-link mx-1 px-3 py-2 ${isActive ? "active" : ""}`
                }
                style={({ isActive }) => ({
                  fontWeight: isActive ? "600" : "500",
                  color: isActive ? "#0d6efd" : "#495057",
                  borderRadius: "8px",
                  transition: "all 0.2s ease",
                })}
              >
                <i className="bi bi-shield-lock me-1"></i> Admin
              </NavLink>
            )}

            <NavLink
              to="/blog"
              className={({ isActive }) =>
                `nav-link mx-1 px-3 py-2 ${isActive ? "active" : ""}`
              }
              style={({ isActive }) => ({
                fontWeight: isActive ? "600" : "500",
                color: isActive ? "#0d6efd" : "#495057",
                borderRadius: "8px",
                transition: "all 0.2s ease",
              })}
            >
              <i className="bi bi-journal-text me-1"></i> Blog
            </NavLink>

            <NavLink
              to="/flashcards"
              className={({ isActive }) =>
                `nav-link mx-1 px-3 py-2 ${isActive ? "active" : ""}`
              }
              style={({ isActive }) => ({
                fontWeight: isActive ? "600" : "500",
                color: isActive ? "#0d6efd" : "#495057",
                borderRadius: "8px",
                transition: "all 0.2s ease",
              })}
            >
              <i className="bi bi-card-text me-1"></i> FlashCards
            </NavLink>
          </Nav>

          <div className="d-flex align-items-center">
            {isAuthenticated === false ? (
              <>
                <button
                  className="btn btn-outline-primary me-2"
                  onClick={() => handleLoginClick()}
                  style={{
                    borderRadius: "8px",
                    padding: "8px 16px",
                    fontWeight: "500",
                    transition: "all 0.2s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 8px rgba(13, 110, 253, 0.15)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <i className="bi bi-box-arrow-in-right me-1"></i> Log in
                </button>

                <button
                  className="btn btn-primary"
                  onClick={() => handleRegisterClick()}
                  style={{
                    borderRadius: "8px",
                    padding: "8px 16px",
                    fontWeight: "500",
                    transition: "all 0.2s ease",
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
                  <i className="bi bi-person-plus me-1"></i> Sign up
                </button>
              </>
            ) : (
              <div className="d-flex align-items-center">
                <NavDropdown
                  title={
                    <div className="d-flex align-items-center">
                      <div
                        className="d-flex align-items-center justify-content-center me-2"
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          backgroundColor: "#0d6efd",
                          color: "white",
                          fontWeight: "600",
                        }}
                      >
                        {getInitials()}
                      </div>
                      <span className="d-none d-md-inline">
                        {account.username || "User"}
                      </span>
                    </div>
                  }
                  id="basic-nav-dropdown"
                  align="end"
                  style={{
                    marginLeft: "10px",
                  }}
                >
                  <NavDropdown.Item
                    className="d-flex align-items-center"
                    onClick={() => navigate("/profile")}
                  >
                    <i className="bi bi-person me-2"></i> Your Profile
                  </NavDropdown.Item>

                  <NavDropdown.Item
                    className="d-flex align-items-center"
                    onClick={() => navigate("/settings")}
                  >
                    <i className="bi bi-gear me-2"></i> Settings
                  </NavDropdown.Item>

                  <NavDropdown.Divider />

                  <NavDropdown.Item
                    className="d-flex align-items-center text-danger"
                    onClick={() => dispatch(doLogout())}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i> Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </div>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
