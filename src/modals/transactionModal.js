import { Modal } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import SendModal from "./sendModal";
import ReceiveModal from "./receiveModal";
import modalBg from "../assets/css/modal.css";
import styles from "./transactionmodal.css";

function TransactionModal(props) {
  const [sendModal, setSendModal] = useState(false);
  const [receiveModal, setReceiveModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);
  const [details, setDetails] = useState([]);

  const sendOpenClose = () => {
    setIsLoaded(true);
    setSendModal(!sendModal);
  };

  const receiveOpenClose = () => {
    setReceiveModal(!receiveModal);
  };

  useEffect(() => {
    setData(props?.data);
    setDetails(props?.details);
  }, []);

  return (
    <>
      <Modal
        className="modalblack"
        show={props.show}
        onHide={props.modalClosed}
        centered
      >
        <Modal.Header className="modalheader" >
          <Modal.Title>What do you want to do?
            <i className="far fa-times-circle fa-lg p-2 mr-2 icon" 
              title="Close"
              style={{ cursor: "pointer" }}
              onClick={props.modalClosed}></i>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={`modalBody ${modalBg.sendReceiveBg}`}>
          <div className={`${styles.modaltransaction} row m-0 mx-auto my-auto justify-content-center`}>
            <div className="d-flex col-12" style={{ margin: "30px 0px 30px" }}>
              <div className="col-6">
                <div onClick={sendOpenClose} className={`${styles.hoverbutton}`}>
                  <div className={`${styles.send}`}>
                    <i className="fad fa-chevron-double-up fa-3x" />
                  </div>
                  <div className={`${styles.receivesendtext}`}>Send</div>
                </div>
              </div>
              <div className="col-6">
                <div onClick={receiveOpenClose} className={`${styles.hoverbutton}`}>
                  <div className={`${styles.receive}`}>
                    <i className="fad fa-chevron-double-down fa-3x" />
                  </div>
                  <div className={`${styles.receivesendtext}`}>Receive</div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {sendModal ? (
        <SendModal
          show={sendModal}
          modalClosed={sendOpenClose}
        />
      ) : (
        ""
      )}
      {receiveModal ? (
        <ReceiveModal
          data={props.data}
          show={receiveModal}
          modalClosed={receiveOpenClose}
        />
      ) : (
        ""
      )}
    </>
  );
}

export default TransactionModal;
