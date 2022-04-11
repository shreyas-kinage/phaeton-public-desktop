import React, { useState } from "react";
import Nav from "@subcomponents/navigationBars/navBar/Nav";
import { Modal } from "react-bootstrap";
import { ColouredButton, DarkButton } from "@tools/Button";
import toastDisplay from "../../app/toast";
import { Link } from "react-router-dom";

function Logout() {
  const [showModal, setShowModal] = useState(true);

  const handleClick = () => {
    try {
      toastDisplay("Logged out", "success");
      sessionStorage.removeItem("loggedIn");
      window.location = "#/login";
      setShowModal(false);
    } catch { }
  };

  return (
    <>
      <Nav />
      <div className="row m-0 text-center mt-4">
        <div className="col-lg-12">
          <Modal className="modalblack" show={showModal} centered>
            <Modal.Header className="modalheader">
              <Modal.Title className="receivetext h4">Logout?</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modalBody">
              <div className="mx-auto my-auto">
                <p>Are you sure you want to logout?</p>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Link to="/dashboard" style={{ color: "inherit" }}>
                <DarkButton content="Cancel" />
              </Link>
              <ColouredButton content="Confirm" onClick={handleClick} />
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </>
  );
}

export default Logout;
