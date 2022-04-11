import React, { useEffect, useState } from "react";
import { ColouredButton } from "@tools/Button/index";
import { TextArea } from "@tools/Input/index";
import * as cryptography from "@phaeton/phaeton-cryptography-web";
import Nav from "@subcomponents/navigationBars/navBar/Nav";
import { Link } from "react-router-dom";
import { validation } from "@phaeton/phaeton-passphrase";
import styles from './seedphrase.css';

function SeedPhrase() {
  const [passPhrase, setPassPhrase] = useState("");
  const [passInvalid, setpassInvalid] = useState(true);

  useEffect(() => {
    try {
      let logincheck = sessionStorage.getItem("loggedIn");
      if (logincheck == "true") {
        window.location = "#/dashboard";
      }
    } catch { }
  }, []);

  useEffect(() => {
    async function encryptPassPhrase() {
      let encryptedObj = await cryptography.encryptPassphraseWithPassword(
        JSON.stringify(passPhrase),
        "tSalt",
        10
      );
      sessionStorage.setItem("passphrase", JSON.stringify(encryptedObj));
    }
    let x = validation.getPassphraseValidationErrors(passPhrase);
    if (x.length == 0) {
      encryptPassPhrase();
      setpassInvalid(false);
    } else {
      setpassInvalid(true);
    }
  }, [passPhrase]);

  return (
    <>
      <Nav />
      <div className="pt-5">
        <div className={`${styles.seedsign} row m-0 justify-content-center`}>
          <div className="col-10 col-sm-10 col-md-8 col-lg-5 justify-content-start">
            <div className="mb-2">
              <h1 className="text-white">Import Account</h1>
            </div>
            <div>
              <p className={`${styles.subtitle}`}>
                Use your pre-existing seed phrase to import your account
              </p>
            </div>
          </div>
        </div>

        <div className={`${styles.seedsign} row m-0 justify-content-center`}>
          <div className="col-10 col-sm-10 col-md-8 col-lg-5">
            <div className="row m-0">
              <div className="col-6 p-0">
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

        <div className={`${styles.seedsign} px-4 row m-0 justify-content-center`}>
          <div className={`${styles.newcard} d-flex col-10 col-sm-10 col-md-8 col-lg-5`}>
            <div className="col-6 text-left">
              <a
                className={`${styles.backButton}`}
                href="#/getstarted"
                style={{
                  fontSize: "15px",
                  color: "#a1a1a1",
                  textDecoration: "underline",
                }}
              >
                Back
              </a>
            </div>
            <div className="col-6 text-right">
              <Link to="/makeapassword">
                <ColouredButton
                  color="#ffffff"
                  disabled={passInvalid}
                  opacity={passInvalid ? ".5" : "1"}
                  margin="5px 10px 0px"
                  content="Next"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SeedPhrase;
