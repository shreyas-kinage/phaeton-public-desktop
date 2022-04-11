import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import QRCode from "qrcode.react";
import { Modal } from "react-bootstrap";
import { getPrefix } from "@utils/phae";
import toastDisplay from "../app/toast";
import styles from "./receivemodal.css";

function ReceiveModal(props) {
  const [selected, setSelected] = useState(false);
  const prefix = getPrefix();
  const publicKey = props?.data?.address;
  const handleCopy = () => {
    toastDisplay("Address copied", "info");
    setSelected(true);
    setTimeout(() => setSelected(false), 5000);
  };

  return (
    <>
      <Modal
        className="modalblack"
        show={props.show}
        onHide={props.modalClosed}
        centered
      >
        <Modal.Header className="modalheader" >
          <Modal.Title className="receivetext">Receive
            <i className="far fa-times-circle fa-lg p-2 mr-2 icon" aria-hidden="true"
              title="Close"
              style={{ cursor: "pointer" }}
              onClick={props.modalClosed}></i>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modalBody">
          <div className="row m-0 mx-auto my-auto justify-content-center">
            <div className="p-5">
              <QRCode
                size={250}
                renderAs="svg"
                value={publicKey ? publicKey : ""}
              />
            </div>
            <span className="d-block col-12 ml-2 font-weight-bold">
              Address
            </span>
            <div
              className="btn-group btn-group-toggle col-12"
              data-toggle="buttons"
            >
              <CopyToClipboard text={publicKey ? publicKey : "--"} onCopy={handleCopy}>
                <label
                  className="btn btn-secondary text-light"
                  style={{
                    backgroundColor: "#3C404B",
                    border: "1px solid #3C404B",
                    color: "#ff8f8f",
                    width: "100%",
                  }}
                >
                  <input type="radio" autoComplete="off" />
                  <div className="d-flex justify-content-between">
                    <span
                      style={{
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        display: "block",
                        textOverflow: "ellipsis",
                        color: "#FF8F8F",
                      }}
                    >
                      {publicKey}
                    </span>
                    <i
                      className={
                        selected ? "far fa-check pt-1" : "far fa-clone pt-1"
                      }
                    />
                  </div>
                </label>
              </CopyToClipboard>
            </div>
            <div className="col-12" style={{ paddingTop: "20px" }}>
              <div>
                <i className={`${styles.infoimge} fas fa-info-circle`} />
                <p className={`${styles.info}`}>
                  You can use this above address to make transactions like
                  sending or receiving {prefix}
                </p>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ReceiveModal;
