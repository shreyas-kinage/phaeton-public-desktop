/* eslint-disable */
import React, { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Modal } from "react-bootstrap";
import { Input } from "@tools/Input";
import { ColouredButton, DarkButton } from "@tools/Button";
import * as cryptography from "@phaeton/phaeton-cryptography-web";
import { getFromStorage } from "@utils/localJSONStorage";
import { Link } from "react-router-dom";
import Nav from "@subcomponents/navigationBars/navBar/Nav";
import toastDisplay from "../../app/toast";
import styles from '../../modals/sendmodal.css';

function ExAccount() {
  const [accountPassword, setAccountPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [publicKey, setPrivateKey] = useState(false);
  const [passphrase, setPassphrase] = useState(false);
  const [decryptedData, setDecryptedData] = useState([]);
  const [showModal, setShowModal] = useState(true);
  const [exportModal, setExportModal] = useState(false);

  useEffect(() => {
    try {
      let logincheck = sessionStorage.getItem("loggedIn");
      if (logincheck == "true") {
      } else {
        window.location = "#/login";
      }
    } catch {
      window.location = "#/login";
    }
  }, []);

  const handleEnter = (event) => {
    var key = event.which || event.keyCode;
    if (key == 13) {
      handleClick();
    }
  };

  const handlePrivatekey = () => {
    toastDisplay("Private Key Copied", "info");
    setPrivateKey(true);
    setTimeout(() => setPrivateKey(false), 5000);
  };

  const handlePassphrase = () => {
    toastDisplay("Passphrase Copied", "info");
    setPassphrase(true);
    setTimeout(() => setPassphrase(false), 5000);
  };

  const handleClick = () => {
    try {
      let data;
      if (accountPassword == "") {
        toastDisplay("Kindly Enter Password!", "info");
        setAccountPassword("");
        return;
      }
      async function decrypt() {
        const encryptedMsg = getFromStorage("ENC_OBJ", []);
        let decryptedMsg;
        try {
          decryptedMsg = await cryptography.decryptPassphraseWithPassword(
            encryptedMsg,
            accountPassword
          );
          setDecryptedData(JSON.parse(decryptedMsg));
          setExportModal(true);
          setShowModal(false);
          setAccountPassword("");
        } catch {
          toastDisplay("Incorrect Password!", "error");
        }
        data = JSON.parse(decryptedMsg);
      }
      decrypt();
    } catch { }
  };

  return (
    <>
      <Nav />
      <div className="row m-0 text-center">
        <div className="col-lg-12 h1 text-white">Export Account</div>
      </div>
      <div className="row m-0 text-center">
        <div className="col-lg-12 h1">
          <button
            type="button"
            className="btn btn-danger mr-3"
            onClick={() => setShowModal(!showModal)}
          >
            Export
          </button>
          <Link to="/dashboard">
            <button type="button" className="btn btn-danger">
              Go to Dashboard
            </button>
          </Link>
        </div>
      </div>
      <Modal className="modalblack" show={showModal} centered>
        <Modal.Header className="modalheader">
          <Modal.Title className="receivetext h4">Export Account ?</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modalBody">
          <div className="mx-auto my-auto">
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
          <ColouredButton content="Confirm" onClick={handleClick} />
        </Modal.Footer>
      </Modal>
      <Modal className="modalblack" show={exportModal} centered>
        <Modal.Header className="modalheader">
          <Modal.Title className="receivetext">Export Account</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modalBody pt-0">
          <div className="ml-3">
            <i className={`${styles.infoimge} fas fa-info-circle`} />
            <p className={`${styles.info}`}>
              You can export your passphrase and private key by copying
            </p>
          </div>
          <div className="qrcode row m-0 mx-auto my-auto justify-content-center">
            {decryptedData.passphrase ? (
              <>
                <span className="h4 col-12 text-left">Passphrase</span>
                <div
                  className="btn-group btn-group-toggle col-12 mb-4"
                  data-toggle="buttons"
                  title="Copy Passphase"
                >
                  <CopyToClipboard text={decryptedData.passphrase} onCopy={handlePassphrase}>
                    <label
                      className="btn btn-secondary"
                      style={{
                        backgroundColor: "#3C404B",
                        border: "1px solid #3C404B",
                        color: "#ff8f8f",
                        width: "100%",
                      }}
                    >
                      <input
                        type="radio"
                        autoComplete="off"
                      />
                      <div className="d-flex justify-content-between">
                        <span
                          style={{
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            display: "block",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {decryptedData.passphrase}
                        </span>
                        <i
                          style={{ color: "#fff" }}
                          className={
                            passphrase
                              ? "far fa-check mt-1"
                              : "far fa-clone mt-1"
                          }
                        />
                      </div>
                    </label>
                  </CopyToClipboard>
                </div>
              </>
            ) : (
              ""
            )}
            <span className="h4 col-12 text-left">Private key</span>
            <div
              className="btn-group btn-group-toggle col-12 mb-4"
              data-toggle="buttons"
              title="Copy Private key"
            >
              <CopyToClipboard text={decryptedData.privateKey} onCopy={handlePrivatekey}>
                <label
                  className="btn btn-secondary"
                  style={{
                    backgroundColor: "#3C404B",
                    border: "1px solid #3C404B",
                    color: "#ff8f8f",
                    width: "100%",
                  }}
                >
                  <input
                    type="radio"
                    autoComplete="off"
                  />
                  <div className="d-flex justify-content-between">
                    <span
                      style={{
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        display: "block",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {decryptedData.privateKey}
                    </span>
                    <i
                      style={{ color: "#fff" }}
                      className={
                        publicKey ? "far fa-check mt-1" : "far fa-clone mt-1"
                      }
                    />
                  </div>
                </label>
              </CopyToClipboard>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => {
              setExportModal(false);
              setDecryptedData([]);
            }}
          >
            Close
          </button>
          <Link to="/dashboard">
            <button type="button" className="btn btn-danger">
              Go to Dashboard
            </button>
          </Link>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ExAccount;
