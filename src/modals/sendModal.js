import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Input, TextArea } from "@tools/Input/index";
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
import { getPrefix } from "@utils/phae";
import LoadingScreen from "@subcomponents/loadingScreen/loadingScreen";
import styles from "./sendmodal.css";

function SendModal(props) {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [accountPassword, setAccountPassword] = useState("empty");
  const [details, setDetails] = useState([]);
  const [decryptedData, setDecryptedData] = useState([]);
  const [baseFee, setBaseFee] = useState("");
  const [feeThree, setFeeThree] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [feePerByte, setFeePerByte] = useState("");
  const [totalMinFee, setTotalMinFee] = useState("");
  const [finalFee, setFinalFee] = useState("");
  const [processingFee, setProcessingFee] = useState("");
  const [amountWarning, setAmountWarning] = useState(false);
  const [decimalWarning, setDecimalWarning] = useState(false);
  const [dProcessWarning, setDProcessWarning] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pFeeWarning, setPFeeWarning] = useState(false);
  const [rAddressWarning, setRAddressWarning] = useState(false);
  const [defaultState, setDefaultState] = useState(true);
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [feeApiData, setFeeApiData] = useState([]);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const prefix = getPrefix();

  const handleClose = () => {
    setShow(false);
    window.location = "#/dashboard";
    window.location.reload();
  };

  const basePath = exactPath();

  //Handle Message then calculate processing fee
  const handleMessage = (e) => {
    try {
      let fetchedMessage = e.target.value;
      let xAmount = document.getElementById("AmountID").value;
      const event = new CustomEvent('build', {
        detail: {
          message: fetchedMessage,
          amount: xAmount
        }
      });
      setFinalFee("0");
      setMessage(fetchedMessage);
      calcProcessingFee(event);
    } catch {
      calcProcessingFee();
    }
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


  const calcProcessingFee = async (event) => {
    setDefaultState(true);
    const numberPattern = /(?<=^| )\d+(\.\d+)?(?=$| )|(?<=^| )\.\d+(?=$| )/;
    if (receiverAddress == "") {
      setRAddressWarning(true);
      return;
    }
    var amounts, messages = "";
    try {
      if (event == null) {
        return;
      }
      else {
        amounts = event.target.value;
        document.getElementById("MessageID").value = "";
        document.getElementById("InputID").value = "";
      }
    } catch {
      amounts = event.detail.amount;
      messages = event.detail.message;
    }
    if (!(numberPattern.test(amounts))) {
      setAmountWarning(true);
      setDefaultState(true);
      setBaseFee("0");
      setFeePerByte("0");
      setProcessingFee("0");
      setFeeThree("0");
      setTotalMinFee("0");
      return;
    }
    if (amounts.includes(".")) {
      var splitAmount = amounts?.toString().split(".");
      if (splitAmount.length == 2 && splitAmount[1].length > 8) {
        setDecimalWarning(true);
        setDefaultState(true);
        setBaseFee("0");
        setFeePerByte("0");
        setProcessingFee("0");
        setFeeThree("0");
        setTotalMinFee("0");
        return;
      }
    }

    if (
      amounts > details?.token?.balance / Math.pow(10, 8) ||
      amounts <= 0
    ) {
      setAmountWarning(true);
      setDefaultState(true);
      setBaseFee("0");
      setFeePerByte("0");
      setProcessingFee("0");
      setFeeThree("0");
      setTotalMinFee("0");
      return;
    }
    setAmountWarning(false);
    setDecimalWarning(false);
    let amountinHelis = transactions.convertPHAEToHelis(amounts);
    setAmount(amountinHelis);
    let transactionObject = {
      senderPublicKey: decryptedData?.publicKey,
      nonce: details?.sequence?.nonce,
      fee: "0",
      amount: amountinHelis,
      username: decryptedData.username,
      moduleAssetId: "2:0",
      recipientAddress: receiverAddress,
      data: messages,
    };
    const { moduleAssetId, ...rawTransaction } = transactionObject;
    const transaction = createTransactionObject(rawTransaction, moduleAssetId);
    const moduleAssetSchemas = await retrieveSchemas();
    const schema = moduleAssetSchemas["2:0"];
    const minFee = transactions.computeMinFee(
      schema,
      {
        ...transaction,
        signatures: undefined,
      },
      {
        baseFees: [
          {
            moduleID: 2,
            assetID: 0,
            baseFee: feeApiData.baseFeeById["2:0"],
          },
        ],
        minFeePerByte: feeApiData.minFeePerByte,
        numberOfSignatures: 1,
      }
    );
    let baseFeeInPHAE = transactions.convertHelisToPHAE(
      feeApiData.baseFeeById["2:0"].toString()
    );
    setBaseFee(baseFeeInPHAE);
    let feePerByteInHelis = minFee - BigInt(feeApiData.baseFeeById["2:0"]);
    let feePerByteInPHAE = transactions.convertHelisToPHAE(
      feePerByteInHelis.toString()
    );
    setFeePerByte(feePerByteInPHAE.toString());
    setTotalMinFee(transactions.convertHelisToPHAE(minFee.toString()));
    setProcessingFee(transactions.convertHelisToPHAE(minFee.toString()));
    document.getElementById("InputID").value = "";
    setDefaultState(true);
    setFinalFee("0");
    setFeeThree("0");
    setDProcessWarning(false);
    setPFeeWarning(false);
  };

  const handleRAddress = (e) => {
    try {
      let x = cryptography.validatePhaeton32Address(e.target.value.toString());
      document.getElementById("InputID").value = "";
      document.getElementById("AmountID").value = "";
      document.getElementById("MessageID").value = "";
      setDefaultState(true);
      setBaseFee("0");
      setFeePerByte("0");
      setProcessingFee("0");
      setFeeThree("0");
      setTotalMinFee("0");
    } catch {
      setRAddressWarning(true);
      document.getElementById("InputID").value = "";
      document.getElementById("AmountID").value = "";
      document.getElementById("MessageID").value = "";
      setDefaultState(true);
      setBaseFee("0");
      setFeePerByte("0");
      setProcessingFee("0");
      setFeeThree("0");
      setTotalMinFee("0");
      return;
    }
    if (decryptedData.address === e.target.value) {
      toastDisplay(
        "Recipient Address must be different from Sender's Address!",
        "error"
      );
      setRAddressWarning(true);
      document.getElementById("InputID").value = "";
      document.getElementById("AmountID").value = "";
      document.getElementById("MessageID").value = "";
      setDefaultState(true);
      setBaseFee("0");
      setFeePerByte("0");
      setProcessingFee("0");
      setFeeThree("0");
      setTotalMinFee("0");
      return;
    }
    setRAddressWarning(false);
    setReceiverAddress(e.target.value);
  };



  const handleProcessingFee = (e) => {
    let currentProcessingFee = e.target.value;
    const numberPattern = /(?<=^| )\d+(\.\d+)?(?=$| )|(?<=^| )\.\d+(?=$| )/;
    if (!(numberPattern.test(currentProcessingFee))) {
      setPFeeWarning(true);
      setDefaultState(true);
      setFeeThree("0");
      setProcessingFee(totalMinFee);
      return;
    }
    if (receiverAddress == "") {
      setRAddressWarning(true);
      setDefaultState(true);
      return;
    }
    if (amount == "") {
      setAmountWarning(true);
      setDefaultState(true);
      return;
    }
    if (currentProcessingFee == "") {
      setPFeeWarning(true);
      setDefaultState(true);
      setFeeThree("0");
      setProcessingFee(totalMinFee);
      return;
    }
    if (e.target.value.includes(".")) {
      var splitAmount = e.target.value?.toString().split(".");
      if (splitAmount.length == 2 && splitAmount[1].length > 8) {
        setDProcessWarning(true);
        setFeeThree("0");
        setProcessingFee(totalMinFee);
        setDefaultState(true);
        return;
      }
    }
    let x = transactions.convertPHAEToHelis(currentProcessingFee);
    let y = transactions.convertPHAEToHelis(totalMinFee);
    if (BigInt(x) < BigInt(y)) {
      setPFeeWarning(true);
      setFeeThree("0");
      setProcessingFee(totalMinFee);
      setDefaultState(true);
      return;
    }
    setDProcessWarning(false);
    setPFeeWarning(false);
    setFinalFee(x);
    let z = x - y;
    setFeeThree(transactions.convertHelisToPHAE(z.toString()));
    setProcessingFee(transactions.convertHelisToPHAE(x.toString()));
    if (!(amountWarning || rAddressWarning || decimalWarning)) {
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
          fee: finalFee,
          amount: amount,
          username: decryptedData.username,
          moduleAssetId: "2:0",
          recipientAddress: receiverAddress,
          data: message,
        };

        const { moduleAssetId, ...rawTransaction } = transactionObject;
        const transaction = createTransactionObject(
          rawTransaction,
          moduleAssetId
        );
        setIsLoading(true);

        let moduleAssetSchemas = {};
        moduleAssetSchemas = await retrieveSchemas();
        const schema = moduleAssetSchemas["2:0"];
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
        //fetch base fee for the network
        const feeApi = await http({
          path: endPoints.fees,
          baseUrl: `${basePath}${apiV2}`,
        });
        if (response == null || feeApi == null) {
          throw 404;
        }
        setDetails(response?.data[0]);
        setFeeApiData(feeApi?.data);
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

  async function fetchBalance() {
    try {
      let payload = { address: decryptedData.address };
      const response = await http({
        path: endPoints.accounts,
        baseUrl: `${basePath}${apiV2}`,
        params: payload,
      });
      if (response == null) {
        throw 404;
      }
      setDetails(response.data[0]);
    } catch {
      toastDisplay("Error fetching user details !", "error");
      setDetails([]);
    }
  }

  return (
    <>
      {isLoading && <LoadingScreen />}
      <Modal
        className="modalblack"
        show={props.show}
        onHide={props.modalClosed}
        centered
        size="md"
      >
        <Modal.Header className="modalheader" >
          <Modal.Title className="receivetext mb-0 pb-0">Send
            <i className="far fa-times-circle fa-lg p-2 mr-2 icon" aria-hidden="true"
              title="Close"
              style={{ cursor: "pointer" }}
              onClick={props.modalClosed}></i>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="modalBody pt-0 mt-0">
          <div className={`${styles.headmodal} row m-0 justify-content-center`}>
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
            </div>
            <div className="col-12 justify-content-start">
              <label className={`${styles.heading}`}>Recipient Address </label>
              <Input
                width="100%"
                margin={
                  rAddressWarning ? "0px 0px 0px 0px" : "0px 0px 20px 0px"
                }
                padding="10px"
                placeholder="Enter Recipient’s Address"
                onChange={handleRAddress}
              />
              <p className={rAddressWarning ? "" : "d-none"}>
                <small className="text-danger">
                  ! Enter valid Recipient's Address
                </small>
              </p>
            </div>
            <div className="col-12 justify-content-start">
              <label className={`${styles.heading}`}>
                Amount (in {prefix})
                <i
                  title="Refresh Balance"
                  className="fas fa-sync-alt ml-1"
                  style={{ cursor: "pointer" }}
                  onClick={fetchBalance}
                />
              </label>
              <label className={`${styles.redtext}`}>
                Your current balance:
                <span style={{ fontWeight: 600 }}>
                  {" "}
                  {details?.token?.balance
                    ? details?.token?.balance / Math.pow(10, 8)
                    : "0.000"}
                  &nbsp;{prefix}
                </span>
              </label>
              <Input
                width="100%"
                id="AmountID"
                margin="0px 0px 5px 0px"
                onChange={calcProcessingFee}
                padding="10px"
                placeholder="Enter Amount"
              // disabled={true}
              />
              <p className={amountWarning ? "mb-0" : "d-none"}>
                <small className="text-danger">! Enter a valid Amount</small>
              </p>
              <p className={decimalWarning ? "mb-0" : "d-none"}>
                <small className="text-danger">
                  ! Digits allowed upto 8 decimal places only
                </small>
              </p>
            </div>
            <div className="col-12 justify-content-start my-1">
              <label className={`${styles.heading}`}>Message/Memo</label>
              <TextArea
                width="100%"
                padding="10px"
                placeholder="Enter Message/Memo(Optional)"
                onChange={handleMessage}
                rows={4}
                maxLength={60}
                id="MessageID"
              />
            </div>
            <div className="col-12 justify-content-start">
              <label className={`${styles.heading}`}>Processing Fee</label>
              <Input
                width="100%"
                id="InputID"
                margin={
                  pFeeWarning || dProcessWarning
                    ? "0px 0px 0px 0px"
                    : "0px 0px 20px 0px"
                }
                padding="10px"
                onChange={handleProcessingFee}
                placeholder={`Enter fees ≥ ${totalMinFee} ${prefix}`}
              />
              <p
                className={
                  pFeeWarning && dProcessWarning
                    ? "mb-0"
                    : pFeeWarning
                      ? ""
                      : "d-none"
                }
              >
                <small className="text-danger">
                  ! Enter processing fee ≥ {totalMinFee} {prefix}
                </small>
              </p>
              <p className={dProcessWarning ? "" : "d-none"}>
                <small className="text-danger">
                  ! Digits allowed upto 8 decimal places only
                </small>
              </p>
            </div>
            <div style={{ margin: "-15px 0px" }}>
              <div className="col-12">
                <ul className={`${styles.info}`}>
                  <li>
                    Base Fee: <b className="text-danger">{baseFee} {prefix}</b>
                  </li>
                  <li>
                    Fee per Byte*No. of Bytes:{" "}
                    <b className="text-danger">{feePerByte} {prefix}</b>
                  </li>
                  <li>
                    Priority Fee: <b className="text-danger">{feeThree} {prefix}</b>
                  </li>
                  <li>
                    Total Processing Fee:{" "}
                    <b className="text-danger">{processingFee} {prefix}</b>
                  </li>
                </ul>
              </div>
              <div className="col-12 mt-2">
                <i className={`${styles.infoimge} fas fa-info-circle`} />
                <p className={`${styles.info}`}>
                  It depends on the processing fee that how fast and secure your
                  transaction will be
                </p>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <ColouredButton
            content="Send"
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

export default SendModal;
