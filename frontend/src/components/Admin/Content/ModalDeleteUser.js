import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { DeleteUser } from "../../../service/apiService";
import { toast } from "react-toastify";
function ModalDeleteUser(props) {
  const {
    show,
    setShow,
    dataDelete,
    fetchUserData,
    fetchUserDataWithPaginate,
    setCurrentPage,
  } = props;
  const handleClose = () => setShow(false);

  const handleDeleteUser = async () => {
    let data = await DeleteUser(dataDelete._id);
    console.log("check data delete thuy", data);
    // console.log("component: >>>>>", res);
    if (data && data.EC === 0) {
      toast.success(data.EM);
      handleClose();
      // await fetchUserData();
      setCurrentPage(1);
      await fetchUserDataWithPaginate(1);
    }

    if (data && data.EC !== 0) {
      toast.error(data.EM);
      handleClose();
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm delete user</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure to delete this user. Email={" "}
          <b>{dataDelete && dataDelete.email ? dataDelete.email : ""}</b>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancle
          </Button>
          <Button variant="primary" onClick={() => handleDeleteUser()}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalDeleteUser;
