import ModalCreateUser from "./ModalCreateUser";
import "./ManagerUser.scss";
import { FcPlus } from "react-icons/fc";
import TableUser from "./TableUser";
import React, { useEffect, useState } from "react";
import { getAllUser, getUserWithPaginate } from "../../../service/apiService";
import ModalUpdateUser from "./ModalUpdateUser";
import ModalViewUser from "./ModalViewUser";
import ModalDeleteUser from "./ModalDeleteUser";
import TableUserPaginate from "./TableUserPaginate";
const ManagerUser = () => {
  const LIMIT_USER = 6;
  const [showCreateUser, setshowCreateUser] = useState(false);
  const [showUpdateUser, setshowUpdateUser] = useState(false);
  const [showViewUser, setshowViewUser] = useState(false);
  const [showDeleteUser, setshowDeleteUser] = useState(false);
  const [listUser, setListUser] = useState([]);
  const [dataUpdate, setDataUpdate] = useState({});
  const [dataDelete, setdataDelete] = useState({});

  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    // fetchUserData();
    fetchUserDataWithPaginate(1);
  }, []);

  const fetchUserData = async () => {
    let res = await getAllUser();
    setListUser(res.DT);
  };

  const fetchUserDataWithPaginate = async (page) => {
    let res = await getUserWithPaginate(page, LIMIT_USER);
    console.log(res.DT);
    setListUser(res.DT.users);
    setPageCount(res.DT.totalPages);
  };

  const handleClickBtnUpdate = (user) => {
    setshowUpdateUser(true);
    setDataUpdate(user);
  };

  const handleClickBtnView = (user) => {
    setshowViewUser(true);
    setDataUpdate(user);
  };

  const resetDataUpdate = () => {
    setDataUpdate({});
  };

  const handleClickBtnDelete = (user) => {
    setshowDeleteUser(true);
    setdataDelete(user);
  };
  return (
    <div className="manager-user-container">
      <div className="title">Manager User</div>
      <div className="user-content">
        <div className="btn-add-new">
          <button
            onClick={() => setshowCreateUser(true)}
            className="btn btn-primary"
          >
            <FcPlus /> Add new User
          </button>
        </div>
        <div className="table-user-container">
          {/* <TableUser
            listUser={listUser}
            handleClickBtnUpdate={handleClickBtnUpdate}
            handleClickBtnView={handleClickBtnView}
            handleClickBtnDelete={handleClickBtnDelete}
          /> */}

          <TableUserPaginate
            listUser={listUser}
            handleClickBtnUpdate={handleClickBtnUpdate}
            handleClickBtnView={handleClickBtnView}
            handleClickBtnDelete={handleClickBtnDelete}
            fetchUserDataWithPaginate={fetchUserDataWithPaginate}
            pageCount={pageCount}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
          <ModalCreateUser
            show={showCreateUser}
            setShow={setshowCreateUser}
            fetchUserData={fetchUserData}
            // setShow={handleShowHide}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            fetchUserDataWithPaginate={fetchUserDataWithPaginate}
          />
          <ModalUpdateUser
            show={showUpdateUser}
            setShow={setshowUpdateUser}
            dataUpdate={dataUpdate}
            fetchUserData={fetchUserData}
            resetDataUpdate={resetDataUpdate}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            fetchUserDataWithPaginate={fetchUserDataWithPaginate}
          />

          <ModalViewUser
            show={showViewUser}
            setShow={setshowViewUser}
            dataUpdate={dataUpdate}
            resetDataUpdate={resetDataUpdate}
          />
          <ModalDeleteUser
            show={showDeleteUser}
            setShow={setshowDeleteUser}
            dataDelete={dataDelete}
            fetchUserData={fetchUserData}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            fetchUserDataWithPaginate={fetchUserDataWithPaginate}
          />
        </div>
      </div>
    </div>
  );
};

export default ManagerUser;
