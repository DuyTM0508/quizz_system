import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";
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

  function handleLoginClick() {
    navigate("/login");
  }
  const handleRegisterClick = () => {
    navigate("/register");
  };
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <NavLink to="/" className="navbar-brand">
          Mage
        </NavLink>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavLink to="/" className="nav-link">
              Home
            </NavLink>
            <NavLink to="/user" className="nav-link">
              User
            </NavLink>
            <NavLink to="/admin" className="nav-link">
              Admin
            </NavLink>
            {/* <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="/user">User</Nav.Link>
            <Nav.Link href="/admin">Admin</Nav.Link> */}
          </Nav>
          {isAuthenticated === false ? (
            <>
              <button className="btn-login" onClick={() => handleLoginClick()}>
                Log in
              </button>
              <button
                className="btn-signup"
                onClick={() => handleRegisterClick()}
              >
                Sign up
              </button>
            </>
          ) : (
            <NavDropdown
              title="Setting"
              id="basic-nav-dropdown"
              className="me-5"
            >
              <NavDropdown.Item>Your profile</NavDropdown.Item>
              <NavDropdown.Item onClick={() => dispatch(doLogout())}>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          )}

          <Nav></Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
