import React, { useState, useEffect } from "react";
import SendModal from "@modals/sendModal";
import ReceiveModal from "@modals/receiveModal";
import { getFromStorage } from "@utils/localJSONStorage";
import Nav from "@subcomponents/navigationBars/navBar/Nav";
import styles from "./../../modals/transactionmodal.css";

function TransactionPage() {
  const [sendModal, setSendModal] = useState(false);
  const [receiveModal, setReceiveModal] = useState(false);
  const [decryptedData, setDecryptedData] = useState([]);

  const sendOpenClose = () => {
    setSendModal(!sendModal);
  };

  const receiveOpenClose = () => {
    setReceiveModal(!receiveModal);
  };

  async function decrypt() {
    const PublicObj = getFromStorage("PUB_OBJ", []);
    const data = JSON.parse(PublicObj);
    setDecryptedData(data);
  }

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
    decrypt();
  }, []);

  return (
    <>
      <Nav />
      <div
        className="row m-0 d-flex pt-4 justify-content-center"
        style={{ color: "#fff", backgroundColor: "inherit!important" }}
      >
        <span className="h3 p-0">What do you want to do?</span>
      </div>
      <div className="row m-0 d-flex justify-content-center">
        <div className="modalblack justify-content-center">
          <div className="modalBody" style={{ borderRadius: "12px" }}>
            <div className={`${styles.modaltransaction} row m-0 m-0 mx-auto my-auto justify-content-center`}>
              <div
                className="d-flex col-12"
                style={{ margin: "30px 0px 30px" }}
              >
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
          </div>
        </div>
        {sendModal ? (
          <SendModal show={sendModal} modalClosed={sendOpenClose} />
        ) : (
          ""
        )}
        {receiveModal ? (
          <ReceiveModal
            data={decryptedData}
            show={receiveModal}
            modalClosed={receiveOpenClose}
          />
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default TransactionPage;
