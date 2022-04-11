import React, { useEffect, useState } from "react";
import { ColouredButton } from "@tools/Button/index";
import { TextArea } from "@tools/Input/index";
import Nav from "@subcomponents/navigationBars/navBar/Nav";
import * as cryptography from "@phaeton/phaeton-cryptography-web";
import { Link } from "react-router-dom";
import toastDisplay from "../../../app/toast";

function PrivateKey() {
  const [privateKey, setPrivateKey] = useState("");
  const [keys, setKeys] = useState([]);
  const [btnName, setBtnName] = useState("Validate");
  const [displayMsg, setDisplayMsg] = useState(
    "Account Validated Successfully"
  );
  const [flag, setFlag] = useState(true);
  const [newFlag, setNewFlag] = useState(false);
  const [error, newError] = useState(false);

  useEffect(() => {
    try {
      let logincheck = sessionStorage.getItem("loggedIn");
      if (logincheck == "true") {
        window.location = "#/dashboard";
      }
    } catch { }
  }, []);

  const onChangeKey = (e) => {
    setFlag(false);
    setPrivateKey(e.target.value);
  };

  async function fetchKeys() {
    try {
      const fetchBinary = await cryptography.getAddressFromPrivateKey(
        Buffer.from(privateKey, "hex")
      );
      const fetchPublicKey = await cryptography.getPublicKeyFromPrivateKey(
        Buffer.from(privateKey, "hex")
      );
      const fetch32Address =
        await cryptography.getPhaeton32AddressFromPublicKey(
          Buffer.from(fetchPublicKey, "hex")
        );

      const Newkeys = {
        binaryAddress: fetchBinary.toString("hex"),
        publicKey: fetchPublicKey.toString("hex"),
        privateKey: privateKey,
        address: fetch32Address,
      };
      setKeys(Newkeys);
      toastDisplay(displayMsg, "success");
      setDisplayMsg("Account Imported Successfully");
      setFlag(false);
      newError(false);
      setNewFlag(true);
      setBtnName("Import");
    } catch {
      newError(true);
      setFlag(true);
    }
  }

  const handleSubmit = () => {
    if (flag == false) fetchKeys();
  };

  return (
    <>
      <Nav />
      <div className="seedsign row m-0 justify-content-center">
        <div className="col-11 col-sm-8 col-md-6 col-lg-4 px-1 justify-content-start">
          <div className="mb-2">
            <h1>Import Account</h1>
          </div>
          <div>
            <p className="subtitle mb-2">
              Use your pre-existing seed phrase to import your account
            </p>
          </div>
        </div>
      </div>
      <div className="row m-0 justify-content-center">
        <div
          className="darkcard col-11 col-sm-8 col-md-6 col-lg-4"
          style={{ borderRadius: "12px 12px 0px 0px" }}
        >
          <h3 className="subtitle">Enter your private key</h3>
          <p className="privatetext">
            Enter the private key here to import your account
          </p>
          <TextArea
            onChange={onChangeKey}
            rows={3}
            padding="10px"
            width="100%"
          />
          <div className={error ? "ml-1" : "d-none"}>
            <p className="text-danger">Invalid Private key</p>
          </div>
        </div>
      </div>
      <div className="row m-0 justify-content-center">
        <div className="backcard d-flex pt-4 col-11 col-sm-8 col-md-6 col-lg-4 justify-content-between">
          <div className="mt-2">
            <a className="backButton" href="#/getstarted">
              Back
            </a>
          </div>
          <div className="mt-2">
            <p className="pageNo">1/1</p>
          </div>
          <div style={{ marginRight: "8px" }}>
            <Link
              to={{
                pathname: newFlag ? "/makeapassword" : "",
                state: { creds: keys, pageNo: 3 },
              }}
            >
              <ColouredButton
                disabled={flag ? "disabled" : ""}
                color="#ffffff"
                onClick={handleSubmit}
                opacity={flag ? ".5" : "1"}
                padding="10px 26px"
                content={btnName}
              />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default PrivateKey;
