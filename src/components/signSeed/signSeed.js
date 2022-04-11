import React, { useEffect, useState } from "react";
import { ColouredButton } from "@tools/Button/index";
import { TextArea } from "@tools/Input/index";
import Nav from "@subcomponents/navigationBars/navBar/Nav";
import * as cryptography from "@phaeton/phaeton-cryptography-web";
import { getFromStorage } from "@utils/localJSONStorage";
import toastDisplay from "../../app/toast";
import styles from "./signseed.css";

function Seed() {
  const [passPhrase, setPassPhrase] = useState("");

  useEffect(() => {
    try {
      let logincheck = sessionStorage.getItem("loggedIn");
      if (logincheck == "true") {
        window.location = "#/dashboard";
      }
    } catch { }
  }, []);

  const handleSubmit = () => {
    let encryptedData = getFromStorage("testing", []);
    let decryptedMsg = cryptography.decryptPassphraseWithPassword(
      encryptedData,
      "testing"
    );
    let data = JSON.parse(decryptedMsg);
    if (data.passphrase == passPhrase) {
      sessionStorage.setItem("loggedIn", "true");
      toastDisplay("Logged in successfully", "success");
      window.location.href = "#/dashboard";
    } else {
      toastDisplay("Invalid Seed Phrase", "error");
    }
  };

  return (
    <>
      <Nav />
      <div className={`${styles.seedsign} row m-0 justify-content-center`}>
        <div className="col-10 col-sm-10 col-md-8 col-lg-5 justify-content-start">
          <div className="mb-2">
            <h1>Sign in</h1>
          </div>
          <div>
            <p className={styles.subtitle}>
              Use the seed phrase you have verified earlier to sign into your
              account
            </p>
          </div>
        </div>
      </div>

      <div className={`${seedsign} row m-0 justify-content-center`}>
        <div className="col-10 col-sm-10 col-md-8 col-lg-5">
          <div className="row m-0">
            <div className="col-6">
              <label className={`${styles.subSubtitle}`}>Seed phrase</label>
            </div>
          </div>
          <div>
            <TextArea
              margin="5px 0px 18px 0px"
              rows={6}
              value={passPhrase}
              onChange={(e) => setPassPhrase(e.target.value)}
              padding="10px"
              width="100%"
              placeholder="Enter your 12 word seed phrase"
            />
          </div>
        </div>
      </div>
      <div className={`${seedsign} row m-0 px-4 justify-content-center`}>
        <div className={`${styles.newcard} d-flex col-10 col-sm-10 col-md-8 col-lg-5`}>
          <div className="col-6 text-left">
            <a href="#/login">Back</a>
          </div>
          <div className="col-6 text-right">
            <ColouredButton
              color="#ffffff"
              // height={40}
              onClick={handleSubmit}
              margin="5px 10px 0px"
              content="Sign in"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Seed;
