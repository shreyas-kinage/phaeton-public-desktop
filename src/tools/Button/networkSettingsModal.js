import React, { useEffect, useState } from "react";
import config from "@utils/config.json";
import { Modal } from 'react-bootstrap';
import { Input } from "@tools/Input/index";
import { DarkButton, ColouredButton } from "@tools/Button/index";
import { setInStorage, getFromStorage } from "@utils/localJSONStorage";
import * as cryptography from "@phaeton/phaeton-cryptography-web";
import toastDisplay from "../../app/toast";
import endPoints from "@constants/endPoints";
import { apiV2 } from "@constants/networks";
import http from "@utils/http";
import { exactPath } from "@utils/getNetwork";

function NetworkSettingsModal(props) {
    //Add Network
    const { isLoading, setIsLoading } = props;
    const [targetNetNameObj, setTargetNetNameObj] = useState({});
    const [networksDetails, setNetworksDetails] = useState([]);
    const [netNameWarning, setnetNameWarning] = useState(false);
    const [urlWarning, setUrlWarning] = useState(false);
    const [prefixWarning, setPrefixWarning] = useState(false);
    const [netIDWarning, setNetIDWarning] = useState(false);
    const [explorerUrlWarning, setExplorerUrlWarning] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordDelete, setShowPasswordDelete] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showPasswordModalDelete, setShowPasswordModalDelete] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [showResultModalDelete, setShowResultModalDelete] = useState(false);
    const [accountPassword, setAccountPassword] = useState("empty");
    const [addNet, setAddNet] = useState("");
    const [addServiceURL, setAddServiceURL] = useState("");
    const [addPrefix, setAddPrefix] = useState("");
    const [addNetID, setAddNetID] = useState("");
    const [addExplorerURL, setAddExplorerURL] = useState("");
    const [defaultState, setDefaultState] = useState(true);
    const [deleteState, setDeleteState] = useState(true);


    const basePath = exactPath();

    const handlePasswordModal = () => setShowPasswordModal(!showPasswordModal);

    const handlePasswordModalDelete = () => setShowPasswordModalDelete(!showPasswordModalDelete);


    const handleResultModal = () => {
        setShowResultModal(!showResultModal);
        window.location = "#/dashboard";
        window.location.reload();
    }

    const handleResultModalDelete = () => {
        setShowResultModalDelete(!showResultModalDelete);
        window.location = "#/dashboard";
        window.location.reload();
    }

    const handleNetName = (e) => {
        setDefaultState(true);
        let NetName = e.target.value;
        const specialCharacterPattern = /^(?=.*[`~!@#$%^&*()])/;
        if (NetName.length > 70 || NetName.length < 1) {
            setDefaultState(true);
            setnetNameWarning(true);
            return;
        }
        if (specialCharacterPattern.test(NetName)) {
            setDefaultState(true);
            setnetNameWarning(true);
            return;
        }
        setAddNet(NetName);
        setnetNameWarning(false);
        activate(false, undefined, undefined, undefined, undefined);
    };

    const handleServiceURL = (e) => {
        setDefaultState(true);
        let serviceUrl = e.target.value;
        if ((serviceUrl.slice(-1)) == "/") {
            let trimmedURL = serviceUrl.slice(0, -1);
            setAddServiceURL(trimmedURL);
        }
        else {
            setAddServiceURL(serviceUrl);
        }
        activate(undefined, false, undefined, undefined, undefined);
    };

    const handleNetworkIdentifier = async (e) => {
        setDefaultState(true);
        let NetIdentifier = e.target.value;
        const specialCharacterPattern = /^(?=.*[`~!@#$%^&*()])/;
        if (specialCharacterPattern.test(NetIdentifier)) {
            setDefaultState(true);
            setNetIDWarning(true);
            return;
        }
        setAddNetID(NetIdentifier);
        setNetIDWarning(false);
        activate(undefined, undefined, false, undefined, undefined);
    };

    const handleExplorerURL = (e) => {
        setDefaultState(true);
        let explorerUrl = e.target.value;
        if ((explorerUrl.slice(-1)) == "/") {
            let trimmedURL = explorerUrl.slice(0, -1);
            setAddExplorerURL(trimmedURL);
        }
        else {
            setAddExplorerURL(explorerUrl);
        }
        activate(undefined, undefined, undefined, false, undefined);
    };

    const handleprefix = (e) => {
        setDefaultState(true);
        let prefixName = e.target.value;
        if (prefixName.length > 4 || prefixName.length < 1) {
            setPrefixWarning(true);
            setDefaultState(true);
            return;
        }
        let lettersRegex = /^[A-Za-z]+$/;
        if (!(lettersRegex.test(prefixName))) {
            setPrefixWarning(true);
            setDefaultState(true);
            return;
        }
        setAddPrefix(prefixName);
        setPrefixWarning(false);
        activate(undefined, undefined, undefined, undefined, false);
    };

    const activate = (nmW = netNameWarning, uW = urlWarning, nIDW = netIDWarning, exW = explorerUrlWarning, pW = prefixWarning) => {
        if ((document.getElementById("netNameID").value == "") || (document.getElementById("serviceURLID").value == "") || (document.getElementById("prefixID").value == "") || (document.getElementById("networkIdentifierID").value == "")) {
            setDefaultState(true);
            return;
        }
        if ((nmW || uW || pW || nIDW || exW)) {
            setDefaultState(true);
            return;
        }
        setDefaultState(false);

    };

    const editNetwork = async () => {
        setIsLoading(true);
        try {
            const response = await http({
                path: `${endPoints.networkStatus}`,
                baseUrl: `${addServiceURL}${apiV2}`,
            });
            if (!(response.data.networkIdentifier == addNetID)) {
                toastDisplay("Invalid Network Identifier", "error");
                setIsLoading(false);
                return;
            }
        } catch {
            toastDisplay("Error getting Network Identifier from Service URL", "error");
            setIsLoading(false);
            return;
        }
        const nwDetails = getFromStorage("networkDetails", []);
        let nwDetailsObject = JSON.parse(nwDetails);
        let bubbleObj = {
            "Name": `${addNet}`, "serviceUrl": `${addServiceURL}`, "prefix": `${addPrefix}`, "networkIdentifier": `${addNetID}`, "explorerURL": `${addExplorerURL}`
        };
        let obj = nwDetailsObject.networks.find((o, i) => {
            if (o.Name == addNet) {
                nwDetailsObject.networks[i] = bubbleObj;
                setInStorage("networkDetails", JSON.stringify(nwDetailsObject));
                const currentNetwork = getFromStorage("currentNetwork", []);
                let currentNetworkObject = JSON.parse(currentNetwork);
                if (currentNetworkObject.Name == addNet) {
                    let modifyNetObj = nwDetailsObject.networks.find(oled => oled.Name === addNet);
                    setInStorage("currentNetwork", JSON.stringify(modifyNetObj));
                }
                setIsLoading(false);
                return true;
            }
        });
        setShowResultModal(!showResultModal);
        toastDisplay("Network Details Edited Successfully", "success");
        setIsLoading(false);
    };

    const deleteNetwork = () => {
        const nwDetails = getFromStorage("networkDetails", []);
        let nwDetailsObject = JSON.parse(nwDetails);
        const newNwDetailsArray = nwDetailsObject.networks.filter((item) => item.Name !== targetNetNameObj.Name);
        nwDetailsObject.networks = newNwDetailsArray;
        setInStorage("networkDetails", JSON.stringify(nwDetailsObject));
        const currentNetwork = getFromStorage("currentNetwork", []);
        let currentNetworkObject = JSON.parse(currentNetwork);
        if (currentNetworkObject.Name == targetNetNameObj.Name) {
            setInStorage("currentNetwork", JSON.stringify(nwDetailsObject.networks[0]));
        }
        setShowResultModalDelete(!showResultModalDelete);
        toastDisplay("Network Deleted Successfully", "success");
    };

    const fetchPassphrase = async (e) => {
        let entPass = e.target.value;
        if (entPass == "") {
            setAccountPassword("empty");
            return;
        } else {
            try {
                let encryptedMsg = getFromStorage("ENC_OBJ", []);
                let PrivateObj = await cryptography.decryptPassphraseWithPassword(
                    encryptedMsg,
                    entPass
                );
                setAccountPassword("correct");
            } catch {
                setAccountPassword("incorrect");
            }
        }
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
        editNetwork();
        handlePasswordModal();
    };

    const fetchPassphraseDelete = async (e) => {
        let entPass = e.target.value;
        if (entPass == "") {
            setAccountPassword("empty");
            return;
        } else {
            try {
                let encryptedMsg = getFromStorage("ENC_OBJ", []);
                let PrivateObj = await cryptography.decryptPassphraseWithPassword(
                    encryptedMsg,
                    entPass
                );
                setAccountPassword("correct");
            } catch {
                setAccountPassword("incorrect");
            }
        }
    };

    const handleConfirmDelete = () => {
        if (accountPassword == "empty") {
            toastDisplay("Kindly Enter Password!", "info");
            return;
        }
        if (accountPassword == "incorrect") {
            toastDisplay("Incorrect Password!", "error");
            return;
        }
        deleteNetwork();
        handlePasswordModalDelete();
    };

    const handleSelect = (e) => {
        const nwDetails = getFromStorage("networkDetails", []);
        let nwDetailsObject = JSON.parse(nwDetails);
        let obj = nwDetailsObject.networks.find((o, i) => {
            if (o.Name === e) {
                return o;
            }
        });
        setTargetNetNameObj(obj);
        document.getElementById("netNameID").value = obj.Name;
        document.getElementById("serviceURLID").value = obj.serviceUrl;
        document.getElementById("prefixID").value = obj.prefix;
        document.getElementById("networkIdentifierID").value = obj.networkIdentifier;
        document.getElementById("explorerURLID").value = obj.explorerURL;
        setAddNet(obj.Name);
        setAddServiceURL(obj.serviceUrl);
        setAddPrefix(obj.prefix);
        setAddNetID(obj.networkIdentifier);
        setAddExplorerURL(obj.explorerURL);
        setDefaultState(false);
        setDeleteState(false);
    };

    useEffect(() => {
        try {
            setDefaultState(true);
            setDeleteState(true);
            setTargetNetNameObj({});
            setnetNameWarning(false);
            setUrlWarning(false);
            setPrefixWarning(false);
            setNetIDWarning(false);
            setExplorerUrlWarning(false);
            setAccountPassword("empty");
            setAddNet("");
            setAddServiceURL("");
            setAddPrefix("");
            setAddNetID("");
            setAddExplorerURL("");
            const networkDetails = getFromStorage("networkDetails", []);
            let networkDetailsObject = JSON.parse(networkDetails);
            setNetworksDetails(networkDetailsObject.networks);
        } catch {
            setInStorage("networkDetails", JSON.stringify(config));
        }
    }, [props.show]);

    return (
        <>
            <Modal
                className="modalblack"
                centered
                backdrop="static"
                size="lg"
                show={props.show}
                onHide={props.modalClosed}
            >
                <Modal.Header className="modalheader" >
                    <Modal.Title>Network Settings
                        <i className="far fa-times-circle fa-lg p-2 mr-2 icon" aria-hidden="true"
                            title="Close"
                            style={{ cursor: "pointer" }}
                            onClick={props.modalClosed}></i>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="modalBody rpc-bg pt-0 mt-0">
                    <div className="headmodal row m-0 justify-content-center">
                        <div className="col-12 justify-content-start">
                            <label className="heading">Select Network</label><br />
                            <select className="bg-secondary text-white mb-2 w-100" style={{ height: "2.5em", borderRadius: "0.5em" }} onChange={(e) => handleSelect(e.target.value)}>
                                <option disabled selected value>--Select a Network--</option>
                                {networksDetails.map((nets, index) => (
                                    (index > 1) ? <option>{nets.Name}</option> : undefined
                                ))}
                            </select><br />
                            <label className="heading">Network Name</label>
                            <Input
                                width="100%"
                                margin="0px 0px 0px 0px"
                                padding="10px"
                                id="netNameID"
                                placeholder="Enter Network Name"
                                // onChange={handleNetName}
                                disabled
                                opacity="0.5"
                            />
                            <p className={netNameWarning ? "mb-0" : "d-none"}>
                                <small className="text-danger">
                                    ! Enter a valid Network Name(Alphanumeric,length[1-70])
                                </small>
                            </p>
                        </div>
                        <div className="col-12 justify-content-start mt-2">
                            <label className="heading">New Service URL</label>
                            <Input
                                width="100%"
                                id="serviceURLID"
                                margin="0px 0px 0px 0px"
                                onChange={handleServiceURL}
                                padding="10px"
                                placeholder="Enter New Service URL"
                            />
                            <p className={urlWarning ? "mb-0" : "d-none"}>
                                <small className="text-danger">! Enter a valid Service URL</small>
                            </p>
                        </div>
                        <div className="col-12 justify-content-start my-2">
                            <label className="heading">Enter Network Identifier</label>
                            <Input
                                width="100%"
                                padding="10px"
                                placeholder="Enter Network Identifier"
                                onChange={handleNetworkIdentifier}
                                id="networkIdentifierID"
                            />
                            <p className={netIDWarning ? "" : "d-none"}>
                                <small className="text-danger">! Enter a valid Network Identifier</small>
                            </p>
                        </div>
                        <div className="col-12 justify-content-start my-2">
                            <label className="heading">Enter Explorer URL(Optional)</label>
                            <Input
                                width="100%"
                                padding="10px"
                                placeholder="Enter Explorer URL(Optional)"
                                onChange={handleExplorerURL}
                                id="explorerURLID"
                            />
                            <p className={explorerUrlWarning ? "" : "d-none"}>
                                <small className="text-danger">! Enter a valid Explorer URL</small>
                            </p>
                        </div>
                        <div className="col-12 justify-content-start my-2">
                            <label className="heading">Enter Address Prefix</label>
                            <Input
                                width="100%"
                                padding="10px"
                                placeholder="Enter Address Prefix"
                                onChange={handleprefix}
                                id="prefixID"
                            />
                            <p className={prefixWarning ? "" : "d-none"}>
                                <small className="text-danger">! Enter a valid Prefix(Alphabets only,Length[1-4])</small>
                            </p>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <ColouredButton
                        content="Save Network"
                        borderRadius="12px"
                        height="48px"
                        width="100%"
                        opacity={defaultState ? "0.5" : "1"}
                        disabled={defaultState}
                        onClick={handlePasswordModal}
                    />
                    <ColouredButton
                        content="Delete Network"
                        borderRadius="12px"
                        height="48px"
                        width="100%"
                        onClick={handlePasswordModalDelete}
                        opacity={deleteState ? "0.5" : "1"}
                        disabled={deleteState}
                    />
                </Modal.Footer>
            </Modal>
            {/* Password Confirmation Modal Edit*/}
            <Modal className="modalblack navName" show={showPasswordModal} centered>
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
                        onClick={() => setShowPasswordModal(!showPasswordModal)}
                    />
                    <ColouredButton content="Confirm" onClick={handleConfirm} />
                </Modal.Footer>
            </Modal>

            {/* Password Confirmation Modal Delete*/}
            <Modal className="modalblack navName" show={showPasswordModalDelete} centered>
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
                                    showPasswordDelete
                                        ? "far float-right fa-eye p-0"
                                        : "far float-right fa-eye-slash p-0"
                                }
                                style={{ cursor: "pointer", fontSize: "18px" }}
                                onClick={() => setShowPasswordDelete(!showPasswordDelete)}
                            />
                        </p>
                        <Input
                            width="100%"
                            height="40px"
                            padding="10px"
                            type={showPasswordDelete ? "text" : "password"}
                            onChange={fetchPassphraseDelete}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <DarkButton
                        content="Cancel"
                        onClick={() => setShowPasswordModalDelete(!showPasswordModalDelete)}
                    />
                    <ColouredButton content="Confirm" onClick={handleConfirmDelete} />
                </Modal.Footer>
            </Modal>
            <Modal
                size="md"
                show={showResultModal}
                onHide={handleResultModal}
                className="modalblack navName"
            >
                <Modal.Header className="modalheader mb-0" >
                    <Modal.Title>
                        Operation Successful <i className="ml-2 fas fa-check-circle mb-0" /><br />
                        <span style={{ fontSize: "0.8em" }}>{addNet} - Network Details Edited Successfully</span>
                        <i className="far fa-times-circle fa-lg p-2 mr-2 icon" aria-hidden="true"
                            title="Close"
                            style={{ cursor: "pointer" }}
                            onClick={handleResultModal}></i>
                    </Modal.Title>
                </Modal.Header>
            </Modal>
            <Modal
                size="md"
                show={showResultModalDelete}
                onHide={handleResultModalDelete}
                className="modalblack navName"
            >
                <Modal.Header className="modalheader mb-0">
                    <Modal.Title>
                        Operation Successful <i className="ml-2 fas fa-check-circle mb-0" /><br />
                        <span style={{ fontSize: "0.8em" }}>{targetNetNameObj.Name} - Network Deleted Successfully</span>
                        <i className="far fa-times-circle fa-lg p-2 mr-2 icon" aria-hidden="true"
                            title="Close"
                            style={{ cursor: "pointer" }}
                            onClick={handleResultModalDelete}></i>
                    </Modal.Title>
                </Modal.Header>
            </Modal>
        </>
    );
};

export default NetworkSettingsModal;
