import React, { useEffect } from "react";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FcPlus } from "react-icons/fc";

import _ from "lodash";
const ModalViewUser = (props) => {
  const { show, setShow, dataUpdate, resetDataUpdate } = props;

  const handleClose = () => {
    setShow(false);
    setEmail("");
    setPassword("");
    setRole("");
    setUsername("");
    setImage("");
    setImagePreview("");
    resetDataUpdate();
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [username, setUsername] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (!_.isEmpty(dataUpdate)) {
      setEmail(dataUpdate.email);
      setRole(dataUpdate.role);
      setUsername(dataUpdate.username);
      setImage("");
      if (dataUpdate.image) {
        setImagePreview("data:image/jpeg;base64," + dataUpdate.image);
      }
    }
  }, [dataUpdate]);

  const handleUploadImage = (e) => {
    if (e.target && e.target.files && e.target.files[0]) {
      setImagePreview(URL.createObjectURL(e.target.files[0]));
      setImage(e.target.files[0]);
    }
  };

  return (
    <>
      {/* <Button variant="primary" onClick={handleShow}>
        Add new user
      </Button> */}

      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
        backdrop="static"
        className="model-create-user"
      >
        <Modal.Header closeButton>
          <Modal.Title>Update a user</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                disabled
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                disabled
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                onChange={(e) => setRole(e.target.value)}
                value={role}
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <div className="col-12">
              <label className="form-label lable-upload" htmlFor="lableUpload">
                <FcPlus />
                Upload File Image
              </label>
              <input
                type="file"
                id="lableUpload"
                onChange={(e) => handleUploadImage(e)}
                hidden
              />
            </div>
            <div className="col-12 img-preview">
              {imagePreview ? (
                <img src={imagePreview} alt="img" />
              ) : (
                <span>image preview</span>
              )}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalViewUser;
