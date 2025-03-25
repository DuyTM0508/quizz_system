import React from "react";
import "react-pro-sidebar/dist/css/styles.css";
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

import { FaGem, FaGithub, FaReact, FaRegListAlt } from "react-icons/fa";
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
      >
        {/* Header */}
        <SidebarHeader>
          <div
            style={{
              padding: "24px",
              textTransform: "uppercase",
              fontWeight: "bold",
              fontSize: 14,
              letterSpacing: "1px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            <FaReact size={"3em"} color={"00bfff"} />
            <span>Lê hoàng Giang</span>
          </div>
        </SidebarHeader>

        {/* Content */}
        <SidebarContent>
          <Menu iconShape="circle">
            <MenuItem icon={<MdDashboard />}>
              Dashboard
              <Link to="/admin" />
            </MenuItem>
          </Menu>

          <Menu iconShape="circle">
            <SubMenu icon={<FaGem />} title="Features">
              <MenuItem>
                Quản lý user
                <Link to="/admin/user-manager" />
              </MenuItem>

              <MenuItem icon={<FaRegListAlt />}>
                Quản lý Exam
                <Link to="/admin/examlist" />
              </MenuItem>

              <MenuItem>
                Quản lý bài Quiz
                <Link to="/admin/quiz" />
              </MenuItem>

              <MenuItem>
                Quản lý câu hỏi
                <Link to="/admin/question" />
              </MenuItem>

              <MenuItem>
                Quản lý blog
                <Link to="/admin/admin-blog" />
              </MenuItem>

              <MenuItem>
                Quản lý Flashcard
                <Link to="/admin/flashcards" />
              </MenuItem>
            </SubMenu>
          </Menu>
        </SidebarContent>

        {/* Footer */}
        <SidebarFooter style={{ textAlign: "center" }}>
          <div className="sidebar-btn-wrapper" style={{ padding: "20px 24px" }}>
            <a
              href="https://github.com/Giang-LHG"
              target="_blank"
              className="sidebar-btn"
              rel="noopener noreferrer"
            >
              <FaGithub />
              <span
                style={{
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              >
                Gianglh
              </span>
            </a>
          </div>
        </SidebarFooter>
      </ProSidebar>
    </>
  );
};

export default SideBar;
