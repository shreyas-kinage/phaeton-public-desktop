import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Input } from "@tools/Input/index";
import { DarkButton, ColouredButton } from "@tools/Button/index";
import * as cryptography from "@phaeton/phaeton-cryptography-web";
import { getFromStorage } from "@utils/localJSONStorage";
import http from "@utils/http";
import endPoints from "@constants/endPoints";
import { apiV2 } from "@constants/networks";
import * as transactions from "@phaeton/phaeton-transactions-web";
import { createTransactionObject } from "@utils/transaction";
import toastDisplay from "../app/toast";
import { exactPath } from "@utils/getNetwork";
import { CopyToClipboard } from "react-copy-to-clipboard";
import LoadingScreen from "@subcomponents/loadingScreen/loadingScreen";

function RegisterDelegateModal(props) {
  const [accountPassword, setAccountPassword] = useState("empty");
  const [details, setDetails] = useState([]);
  const [decryptedData, setDecryptedData] = useState([]);
  const [totalMinFee, setTotalMinFee] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [cUsernameWarning, setCUsernameWarning] = useState(false);
  const [cUsername, setCUsername] = useState("");
  const [defaultState, setDefaultState] = useState(true);
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [feeApiData, setFeeApiData] = useState([]);
  const [show, setShow] = useState(false);

  const basePath = exactPath();

  const handleCUsername = (e) => {
    setDefaultState(true);
    var userN;
    const alphanumericPattern = /^[a-z0-9!@$&_.]+$/g;
    userN = e.target.value;
    if (userN.length > 20 || userN.length < 6) {
      setCUsernameWarning(true);
      return;
    }
    if (userN.length == null) {
      setCUsernameWarning(true);
      return;
    }
    const nullCharacter = new RegExp(/\\0|\\u0000|\\x00/);
    if (nullCharacter.test(userN)) {
      setCUsernameWarning(true);
      return;
    }
    if (!alphanumericPattern.test(userN)) {
      setCUsernameWarning(true);
      return;
    }
    setCUsernameWarning(false);
    setCUsername(userN.toString());
    calcProcessingFee(userN);
  };

  const handleClose = () => {
    setShow(false);
    window.location = "#/dashboard";
    window.location.reload();
  };

  const retrieveSchemas = async () => {
    const moduleAssetSchemas = {};
    const response = await http({
      path: endPoints.transactionsSchemas,
      baseUrl: `${basePath}${apiV2}`,
      params: "",
    });
    response.data.forEach((data) => {
      moduleAssetSchemas[data.moduleAssetId] = data.schema;
    });
    return moduleAssetSchemas;
  };

  const calcProcessingFee = async (userName) => {
    let transactionObject = {
      senderPublicKey: decryptedData?.publicKey,
      nonce: details?.sequence?.nonce,
      fee: "0",
      username: userName,
      moduleAssetId: "5:0",
    };
    const { moduleAssetId, ...rawTransaction } = transactionObject;
    const transaction = createTransactionObject(rawTransaction, moduleAssetId);
    const moduleAssetSchemas = await retrieveSchemas();
    const schema = moduleAssetSchemas["5:0"];
    const minFee = transactions.computeMinFee(
      schema,
      {
        ...transaction,
        signatures: undefined,
      },
      {
        baseFees: [
          {
            moduleID: 5,
            assetID: 0,
            baseFee: feeApiData.baseFeeById["5:0"]
              ? feeApiData.baseFeeById["5:0"]
              : "0",
          },
        ],
        minFeePerByte: feeApiData.minFeePerByte,
        numberOfSignatures: 1,
      }
    );
    setTotalMinFee(minFee.toString());
    if (!(document.getElementById("cUsername").value == "")) {
      setDefaultState(false);
    }
  };

  const handleTId = () => {
    toastDisplay("Transaction ID Copied", "info");
  };

  const fetchPassphrase = async (e) => {
    let PrivateObj;
    let entPass = e.target.value;
    if (entPass == "") {
      setAccountPassword("empty");
      return;
    } else {
      try {
        let encryptedMsg = getFromStorage("ENC_OBJ", []);
        PrivateObj = await cryptography.decryptPassphraseWithPassword(
          encryptedMsg,
          entPass
        );
        PrivateObj = JSON.parse(PrivateObj);
        setAccountPassword(PrivateObj);
      } catch {
        setAccountPassword("incorrect");
      }
    }
  };

  const confirmPassword = () => {
    setShowModal(!showModal);
  };

  const handleConfirm = () => {
    if (accountPassword == "empty") {
      toastDisplay("Kindly Enter Password!", "info");
      return;
    }
    if (accountPassword == "incorrect") {
      toastDisplay("Incorrect Password!", "error");
      return;
    }
    create(accountPassword);
    setShowModal(false);
  };

  const create = async (priV) =>
    new Promise(async (resolve, reject) => {
      try {
        let transactionObject = {
          senderPublicKey: decryptedData?.publicKey,
          nonce: details?.sequence?.nonce,
          fee: totalMinFee,
          username: cUsername,
          moduleAssetId: "5:0",
        };
        setIsLoading(true);
        const { moduleAssetId, ...rawTransaction } = transactionObject;
        const transaction = createTransactionObject(
          rawTransaction,
          moduleAssetId
        );
        let moduleAssetSchemas = {};
        moduleAssetSchemas = await retrieveSchemas();
        const schema = moduleAssetSchemas["5:0"];
        let passphrase = priV?.passphrase;

        const networkStatus = await http({
          path: endPoints.networkStatus,
          baseUrl: `${basePath}${apiV2}`,
          params: "",
        });
        const networkIdentifier = networkStatus.data.networkIdentifier;
        const signedTransaction = await transactions.signTransaction(
          schema,
          transaction,
          Buffer.from(networkIdentifier, "hex"),
          passphrase
        );
        const txBytes = await transactions.getBytes(schema, signedTransaction);
        const txHex = txBytes.toString("hex");

        //Send the Transaction

        let payload = { transaction: txHex };
        const sendResponse = await http({
          path: endPoints.transactions,
          baseUrl: `${basePath}${apiV2}`,
          params: {},
          method: "POST",
          body: JSON.stringify(payload),
        });
        if (
          sendResponse.message ==
          "Transaction payload was successfully passed to the network node"
        ) {
          toastDisplay(
            "Transaction payload was successfully passed to the network node",
            "success"
          );
          setIsLoading(false);
          setSuccess(sendResponse.transactionId);
          setShow(true);
          setAccountPassword("empty");
        } else {
          setIsLoading(false);
          toastDisplay("Transaction Failed", "error");
        }
      } catch (error) {
        setIsLoading(false);
        toastDisplay("Transaction Failed", "error");
        reject(error);
      }
    });

  useEffect(() => {
    (async () => {
      const PublicObj = getFromStorage("PUB_OBJ", []);
      let data = JSON.parse(PublicObj);
      setDecryptedData(data);
      try {
        let addresses = data.address;
        let payload = { address: addresses };
        const response = await http({
          path: endPoints.accounts,
          baseUrl: `${basePath}${apiV2}`,
          params: payload,
        });
        setDetails(response?.data[0]);
        //fetch base fee for the network
        const feeApi = await http({
          path: endPoints.fees,
          baseUrl: `${basePath}${apiV2}`,
        });
        setFeeApiData(feeApi?.data);
        if (feeApi == null || response == null) {
          throw 404;
        }

      } catch {
        setDetails([]);
        toastDisplay(
          "Error fetching user details !",
          "error"
        );
        setTimeout(handleClose, 4000);
      }
    })();
  }, []);

  return (
    <>
      {isLoading && <LoadingScreen />}
      <Modal
        className="modalblack"
        show={props.show}
        onHide={props.modalClosed}
        centered
      >
        <Modal.Header className="modalheader" >
          <Modal.Title className="receivetext mb-0 pb-0">
            Register Delegate
            <i className="far fa-times-circle fa-lg p-2 mr-2 icon" aria-hidden="true"
              title="Close"
              style={{ cursor: "pointer" }}
              onClick={props.modalClosed}></i>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="modalBody pt-0 mt-0">
          <div className="headmodal row m-0 justify-content-center">
            <div className="col-12 justify-content-start">
              <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                className="modalblack bg-dark border border-danger"
              >
                <Modal.Header className="modalheader">
                  <Modal.Title>
                    Transaction Processed Successfully{" "}
                    <i className="fas fa-check-circle" />
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body className="modalBody pt-0 mt-0">
                  <span className="h5 col-12 text-left mb-2">
                    Transaction ID{" "}
                  </span>
                  <div
                    className="btn-group btn-group-toggle col-12 mb-1"
                    data-toggle="buttons"
                  >
                    <CopyToClipboard text={success} onCopy={handleTId}>
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
                            {success}
                          </span>
                          <i
                            style={{ color: "#fff" }}
                            className="far fa-clone mt-1"
                          />
                        </div>
                      </label>
                    </CopyToClipboard>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <button
                    type="button"
                    title="Go to Dashboard"
                    className="btn btn-secondary"
                    onClick={handleClose}
                  >
                    Close
                  </button>
                </Modal.Footer>
              </Modal>
              <label className="heading">Username</label>
              <Input
                width="100%"
                padding="10px"
                id="cUsername"
                placeholder="Enter Username"
                onChange={handleCUsername}
              />
              <p className={cUsernameWarning ? "mt-1" : "d-none"}>
                <small className="text-danger">
                  &#8226; Delegate Username should be between 6(Minimum) and 20(Maximum) characters<br />
                </small>
                <small className="text-danger">
                  &#8226; Characters allowed are Lower case letters or Special characters in [<b> !@$&_. </b>] or Digits(0-9) or their combination <br />
                </small>
              </p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <ColouredButton
            content="Register as a Delegate"
            borderRadius="12px"
            height="48px"
            width="100%"
            opacity={defaultState ? "0.5" : "1"}
            disabled={defaultState}
            onClick={confirmPassword}
          />
        </Modal.Footer>
      </Modal>

      <Modal className="modalblack navName" show={showModal} centered>
        <Modal.Header className="modalheader">
          <Modal.Title className="receivetext h4">Confirm Password</Modal.Title>
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
              onChange={fetchPassphrase}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <DarkButton
            content="Cancel"
            onClick={() => setShowModal(!showModal)}
          />
          <ColouredButton content="Confirm" onClick={handleConfirm} />
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default RegisterDelegateModal;
