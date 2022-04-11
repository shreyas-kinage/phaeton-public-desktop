import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Input } from "@tools/Input";
import { ColouredButton, DarkButton } from "@tools/Button";
import Nav from "@subcomponents/navigationBars/navBar/Nav";
import toastDisplay from "../../app/toast";
import { Link } from "react-router-dom";
import * as cryptography from "@phaeton/phaeton-cryptography-web";
import { getFromStorage } from "@utils/localJSONStorage";

function Remove() {
  const [showPassword, setShowPassword] = useState(false);
  const [accountPassword, setAccountPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEnter = (event) => {
    var key = event.which || event.keyCode;
    if (key == 13) {
      handleDelete();
    }
  };

  const handleDelete = () => {
    try {
      async function decrypt() {
        if (!accountPassword) {
          toastDisplay("Kindly Enter Password!", "info");
          return;
        }
        const encryptedMsg = getFromStorage("ENC_OBJ", []);
        let decryptedMsg;
        try {
          decryptedMsg = await cryptography.decryptPassphraseWithPassword(
            encryptedMsg,
            accountPassword
          );
          setLoading(true);
          sessionStorage.removeItem("loggedIn");
          localStorage.removeItem("PUB_OBJ");
          localStorage.removeItem("ENC_OBJ");
          localStorage.removeItem("currentNetwork");
          localStorage.removeItem("networkDetails");
          toastDisplay("Successfully Removed Account", "success");
          setAccountPassword("");
          window.location = "#/getstarted";
          window.location.reload();
          return;
        } catch {
          toastDisplay("Incorrect Password!", "error");
          return;
        }
      }
      decrypt();
    } catch { }
  };

  return (
    <>
      <Nav />
      <Modal className="modalblack" show={true} centered>
        <Modal.Header className="modalheader">
          <Modal.Title className="receivetext h4">Remove Account ?</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modalBody">
          <div className="mx-auto my-auto">
            <p>
              This will remove your <span className="text-danger align-self-center">PHAETON </span>
              account from this device.
            </p>
            <p>
              Please type your <span className="text-danger">password </span> to
              confirm.
              <i
                className={
                  showPassword
                    ? "far float-right fa-eye p-0"
                    : "far float-right fa-eye-slash p-0"
                }
                style={{ cursor: "pointer", fontSize: "18px" }}
                onClick={() => setShowPassword(!showPassword)}
              />
            </p>
            <Input
              width="100%"
              height="40px"
              padding="10px"
              type={showPassword ? "text" : "password"}
              onKeyPress={(e) => handleEnter(e)}
              onChange={(e) => setAccountPassword(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Link to="/dashboard" style={{ color: "inherit" }}>
            <DarkButton content="Cancel" />
          </Link>
          <ColouredButton content="Remove" onClick={handleDelete} />
        </Modal.Footer>
      </Modal>
      {loading ? (
        <div className="row m-0 text-center mt-4">
          <div className="col-lg-12">
            <div
              className="spinner-grow text-danger mr-1"
              style={{ width: "12rem", height: "12rem", paddingTop: "75px" }}
            >
              <span className="text-white h4">...</span>
            </div>
            <div
              className="spinner-grow text-danger"
              style={{ width: "12rem", height: "12rem", paddingTop: "75px" }}
            >
              <span className="text-white h4">Removing Account</span>
            </div>
            <div
              className="spinner-grow text-danger ml-1"
              style={{ width: "12rem", height: "12rem", paddingTop: "75px" }}
            >
              <span className="text-white h4">...</span>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default Remove;
