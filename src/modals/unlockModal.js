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
import { getPrefix } from "@utils/phae";
import LoadingScreen from "@subcomponents/loadingScreen/loadingScreen"

function UnlockModal(props) {

    const [amount, setAmount] = useState("");
    const [unvoteHeight, setUnvoteHeight] = useState("");
    const [currentHeight, setCurrentHeight] = useState("");
    const [accountPassword, setAccountPassword] = useState("empty");
    const [details, setDetails] = useState([]);
    const [isNewDelegate, setIsNewDelegate] = useState(false);
    const [decryptedData, setDecryptedData] = useState([]);
    const [totalMinFee, setTotalMinFee] = useState("");
    const [delegateAddress, setDelegateAddress] = useState("");
    const [amountWarning, setAmountWarning] = useState(false);
    const [decimalWarning, setDecimalWarning] = useState(false);
    const [txnIDWarning, settxnIDWarning] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rAddressWarning, setRAddressWarning] = useState(false);
    const [heightWarning, setHeightWarning] = useState(false);
    const [defaultState, setDefaultState] = useState(true);
    const [success, setSuccess] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [feeApiData, setFeeApiData] = useState([]);
    const [show, setShow] = useState(false);
    const [getHeightVTID, setGetHeightVTID] = useState(false);
    const [displayTidBox, setdisplayTidBox] = useState(false);
    const [txnID, setTxnID] = useState("");
    const prefix = getPrefix();
    const basePath = exactPath();
    const [isLoading, setIsLoading] = useState(false);

    const handleRAddress = (e) => {
        setDefaultState(true);
        try {
            let x = cryptography.validatePhaeton32Address(e.target.value.toString());
            document.getElementById("AmountID").value = "";
            document.getElementById("unvoteHeightID").value = "";

        } catch {
            setRAddressWarning(true);
            document.getElementById("AmountID").value = "";
            document.getElementById("unvoteHeightID").value = "";
            setDefaultState(true);
            return;
        }
        setRAddressWarning(false);
        setDelegateAddress(e.target.value);
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

    const checkAmount = async (event) => {
        var amounts;
        setDefaultState(true);
        document.getElementById("unvoteHeightID").value = "";
        const numberPattern = /(?<=^| )\d+(\.\d+)?(?=$| )|(?<=^| )\.\d+(?=$| )/;
        if (delegateAddress == "") {
            setRAddressWarning(true);
            return;
        }
        amounts = event.target.value;
        if (amounts == "") {
            setAmountWarning(true);
            return;
        }
        if (!(numberPattern.test(amounts))) {
            setAmountWarning(true);
            return;
        }
        if (!(amounts % 10 == 0)) {
            setAmountWarning(true);
            setDefaultState(true);
            return;
        }
        if (amounts.includes(".")) {
            var splitAmount = amounts?.toString().split(".");
            if (splitAmount.length == 2 && splitAmount[1].length > 8) {
                setDecimalWarning(true);
                return;
            }
        }
        if (amounts == 0) {
            setAmountWarning(true);
            setDefaultState(true);
            return;
        }
        let amountinHelis = transactions.convertPHAEToHelis(amounts);
        setAmount(amountinHelis);
        setAmountWarning(false);
        setDecimalWarning(false);
    };

    const calcProcessingFee = async (heights) => {
        let transactionObject = {
            senderPublicKey: decryptedData?.publicKey,
            nonce: details?.sequence?.nonce,
            fee: "0",
            username: decryptedData.username,
            moduleAssetId: "5:2",
            unlockObjects: [{ amount: BigInt(amount), delegateAddress: delegateAddress, unvoteHeight: parseInt(heights) }]
        };
        const { moduleAssetId, ...rawTransaction } = transactionObject;
        const transaction = createTransactionObject(rawTransaction, moduleAssetId);
        const moduleAssetSchemas = await retrieveSchemas();
        const schema = moduleAssetSchemas["5:2"];
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
                        assetID: 2,
                        baseFee: feeApiData.baseFeeById["5:2"] ? feeApiData.baseFeeById["5:2"] : "0",
                    },
                ],
                minFeePerByte: feeApiData.minFeePerByte,
                numberOfSignatures: 1,
            }
        );
        setTotalMinFee(minFee.toString());
        if ((document.getElementById("AmountID").value == "") || (document.getElementById("unvoteHeightID").value == "") || amountWarning || decimalWarning || rAddressWarning) {
            setDefaultState(true);
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

    const fetchUnvoteHeight = async () => {
        setDefaultState(true);
        setGetHeightVTID(true);
        if (delegateAddress == "") {
            setRAddressWarning(true);
            setDefaultState(true);
            setGetHeightVTID(false);
            return;
        }
        if (amount == "") {
            setAmountWarning(true);
            setDefaultState(true);
            setGetHeightVTID(false);
            return;
        }
        if (txnID == "") {
            setDefaultState(true);
            setGetHeightVTID(false);
            settxnIDWarning(true);
            return;
        }
        settxnIDWarning(false);
        try {
            const response = await http({
                path: `transactions`,
                baseUrl: `${basePath}${apiV2}`,
                params: { transactionId: txnID },
            });
            if (response) {
                let fetchedHeight = response.data[0].height;
                const diffHeight = decryptedData.address === delegateAddress ? 260000 : 2000;
                if ((currentHeight - fetchedHeight) < diffHeight) {
                    setDefaultState(true);
                    setGetHeightVTID(false);
                    document.getElementById("unvoteHeightID").value = fetchedHeight;
                    toastDisplay(`The difference between current height and the entered unvote height should be greater than ${diffHeight} !`, "info");
                    return;
                }
                setHeightWarning(false);
                setUnvoteHeight(fetchedHeight);
                setGetHeightVTID(false);
                document.getElementById("unvoteHeightID").value = fetchedHeight;
                calcProcessingFee(fetchedHeight);
                if (!(rAddressWarning || amountWarning || decimalWarning)) {
                    setDefaultState(false);
                }
            } else {
                setDefaultState(true);
                document.getElementById("unvoteHeightID").value = "";
                toastDisplay("Invalid Transaction ID!", "error");
                return;
            }
        } catch {
            setDefaultState(true);
            document.getElementById("unvoteHeightID").value = "";
            toastDisplay("Error fetching details", "error");
            return;
        }
    };

    const inputUnvoteHeight = async (event) => {
        setDefaultState(true);
        var height;
        height = event.target.value;
        if (delegateAddress == "") {
            setRAddressWarning(true);
            setDefaultState(true);
            return;
        }
        if (amount == "") {
            setAmountWarning(true);
            setDefaultState(true);
            return;
        }
        var integerPattern = /^[0-9]+$/;
        if (!(height.match(integerPattern))) {
            setHeightWarning(true);
            setDefaultState(true);
            return;
        }
        if (height <= 0) {
            setHeightWarning(true);
            setDefaultState(true);
            return;
        }
        if (height.includes(".")) {
            setHeightWarning(true);
            setDefaultState(true);
            return;
        }
        const diffHeight = decryptedData.address === delegateAddress ? 260000 : 2000;
        if ((currentHeight - height) < diffHeight) {
            setHeightWarning(true);
            toastDisplay(`The difference between current height and the entered unvote height should be greater than ${diffHeight} !`, "info");
            return;
        }
        setHeightWarning(false);
        setUnvoteHeight(height);
        calcProcessingFee(height);
        if (!(rAddressWarning || amountWarning || decimalWarning)) {
            setDefaultState(false);
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

    const handleSelect = (e) => {
        setdisplayTidBox(true);
        setDefaultState(true);
        document.getElementById("unvoteHeightID").value = "";
        if (e == "Transaction ID") {
        }
    };

    const create = async (priV) =>
        new Promise(async (resolve, reject) => {
            try {
                let transactionObject = {
                    senderPublicKey: decryptedData?.publicKey,
                    nonce: details?.sequence?.nonce,
                    fee: totalMinFee,
                    username: decryptedData.username,
                    moduleAssetId: "5:2",
                    unlockObjects: [{ amount: BigInt(amount), delegateAddress: delegateAddress, unvoteHeight: parseInt(unvoteHeight) }]
                };
                const { moduleAssetId, ...rawTransaction } = transactionObject;
                setIsLoading(true);
                const transaction = createTransactionObject(
                    rawTransaction,
                    moduleAssetId
                );
                let moduleAssetSchemas = {};
                moduleAssetSchemas = await retrieveSchemas();
                const schema = moduleAssetSchemas["5:2"];
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
        //Get submitted details
        try {
            let url = new URL(document.location.href);
            let hash = url.hash.toString();
            const addressUrl = hash?.split("=", 2);
            let addressSpace = addressUrl[1];
            let address = addressSpace.slice(0, 42);
            if (address == null) {
                setIsNewDelegate(true);
            }
            else {
                document.getElementById("rAddress").value = address;
                setDelegateAddress(address);
            }
        } catch {
            setIsNewDelegate(true);
        }
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
                const heightApi = await http({
                    path: "blocks",
                    baseUrl: `${basePath}${apiV2}`,
                });
                if (response == null || feeApi == null || heightApi == null) {
                    throw 404;
                }
                setDetails(response?.data[0]);
                setFeeApiData(feeApi?.data);
                setCurrentHeight(heightApi.data[0].height);
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
            setDetails(response.data[0]);
        } catch {
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
            >
                <Modal.Header className="modalheader" >
                    <Modal.Title className="receivetext mb-0 pb-0">Unlock
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
                            <label className="heading">Delegate's Address </label>
                            <Input
                                width="100%"
                                margin={
                                    rAddressWarning ? "0px 0px 0px 0px" : "0px 0px 20px 0px"
                                }
                                padding="10px"
                                id="rAddress"
                                placeholder="Enter Delegate’s Address"
                                onChange={handleRAddress}
                                disabled={!isNewDelegate}
                            />
                            <p className={rAddressWarning ? "" : "d-none"}>
                                <small className="text-danger">
                                    ! Enter valid Delegate's Address
                                </small>
                            </p>
                        </div>
                        <div className="col-12 justify-content-start">
                            <label className="heading">
                                Amount
                                <i
                                    title="Refresh Balance"
                                    className="fas fa-sync-alt ml-1"
                                    style={{ cursor: "pointer" }}
                                    onClick={fetchBalance}
                                />
                            </label>
                            <label className="text-danger float-right">
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
                                onChange={checkAmount}
                                padding="10px"
                                placeholder="Enter Amount"
                            />
                            <p className={amountWarning ? "mb-0" : "d-none"}>
                                <small className="text-danger">! Enter a valid Amount</small>
                            </p>
                            <p className={decimalWarning ? "" : "d-none"}>
                                <small className="text-danger">
                                    ! Digits allowed upto 8 decimal places only
                                </small>
                            </p>
                            <div className="col-12 mt-1 ml-0 pl-0">
                                <i className="infoimge fas fa-info-circle ml-0 pl-0" />
                                <p className="info">
                                    Kindly enter amount in multiples of 10 {prefix}
                                </p>
                            </div>
                        </div>
                        <div className="col-12 justify-content-start">
                            <select className="bg-secondary text-white mb-2 w-80" style={{ height: "2.3em", borderRadius: "0.5em" }} onChange={(e) => handleSelect(e.target.value)}>
                                <option disabled selected value>--Get Unvote Height using(Select)--</option><br />
                                <option>Transaction ID</option>
                            </select>
                            <div className={displayTidBox ? "d-block" : "d-none"}>
                                <label className="heading">Transaction ID</label>
                                <Input
                                    width="100%"
                                    id="TransactionID"
                                    margin="0px 0px 5px 0px"
                                    onChange={(e) => setTxnID(e.target.value)}
                                    padding="10px"
                                    placeholder="Enter Transaction ID"
                                />
                                <ColouredButton
                                    content={getHeightVTID ? "Getting Unvote Height" : "Get Unvote Height"}
                                    borderRadius="12px"
                                    height="40px"
                                    width="40%"
                                    classes="my-2 px-0"
                                    onClick={fetchUnvoteHeight}
                                />
                                {getHeightVTID ? <div className="spinner-border spinner-border-sm text-secondary ml-2 align-self-center" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div> : undefined}
                                <p className={txnIDWarning ? "mb-0" : "d-none"}>
                                    <small className="text-danger">! Enter a valid Transaction ID</small>
                                </p>
                            </div>
                            <div className="d-block">
                                <label className="heading">Unvote Height</label>
                                <Input
                                    width="100%"
                                    id="unvoteHeightID"
                                    margin="0px 0px 5px 0px"
                                    onChange={inputUnvoteHeight}
                                    padding="10px"
                                    placeholder="Enter Unvote Height"
                                />
                                <p className={heightWarning ? "mb-0" : "d-none"}>
                                    <small className="text-danger">! Enter a valid Unvote Height</small>
                                </p>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <ColouredButton
                        content="Unlock"
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

export default UnlockModal;

