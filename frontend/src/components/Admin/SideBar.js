import React from "react";
import "react-pro-sidebar/dist/css/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Sidebar.scss";

import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from "react-pro-sidebar";

import {
  FaGem,
  FaGithub,
  FaReact,
  FaRegListAlt,
  FaUser,
  FaQuestionCircle,
  FaBlog,
  FaLayerGroup,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import sidebarBg from "../../assests/bg2.jpg";
import { Link } from "react-router-dom";

const SideBar = ({ image, collapsed, toggled, handleToggleSidebar }) => {
  return (
    <>
      <ProSidebar
        image={sidebarBg}
        collapsed={collapsed}
        toggled={toggled}
        breakPoint="md"
        onToggle={handleToggleSidebar}
        className="bootstrap-sidebar"
      >
        {/* Header */}
        <SidebarHeader className="sidebar-header">
          <div className="sidebar-logo-container">
            <div className="sidebar-logo">
              <FaReact size={"2.5em"} className="logo-icon" />
            </div>
            <div className="sidebar-brand">
              <h5 className="mb-0">Lê hoàng Giang</h5>
              <small className="text-muted">Admin Portal</small>
            </div>
          </div>
        </SidebarHeader>

        {/* Content */}
        <SidebarContent className="sidebar-content">
          {/* <Menu iconShape="circle">
            <MenuItem icon={<MdDashboard />} className="menu-item">
              Dashboard
              <Link to="/admin" />
            </MenuItem>
          </Menu> */}

          <div className="menu-category">MANAGEMENT</div>

          <Menu iconShape="circle">
            <MenuItem icon={<FaUser />}>
              Quản lý user
              <Link to="/admin/user-manager" />
            </MenuItem>

            <MenuItem icon={<FaRegListAlt />}>
              Quản lý Exam
              <Link to="/admin/examlist" />
            </MenuItem>

            <MenuItem icon={<FaQuestionCircle />}>
              Quản lý câu hỏi
              <Link to="/admin/question" />
            </MenuItem>

            <MenuItem icon={<FaBlog />}>
              Quản lý blog
              <Link to="/admin/admin-blog" />
            </MenuItem>

            <MenuItem icon={<FaLayerGroup />}>
              Quản lý Flashcard
              <Link to="/admin/flashcards" />
            </MenuItem>
          </Menu>
        </SidebarContent>

        {/* Footer */}
        <SidebarFooter className="sidebar-footer">
          <div className="sidebar-btn-wrapper">
            <a
              href="https://github.com/Giang-LHG"
              target="_blank"
              className="sidebar-btn btn btn-sm btn-outline-light"
              rel="noopener noreferrer"
            >
              <FaGithub className="me-2" />
              <span>Gianglh</span>
            </a>
          </div>
        </SidebarFooter>
      </ProSidebar>
    </>
  );
};

export default SideBar;
