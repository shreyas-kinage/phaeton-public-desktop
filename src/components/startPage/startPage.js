import React, { useEffect } from "react";
import { DarkButton, ColouredButton } from "@tools/Button/index";
import { generatePassphrase } from "@utils/passphrase";
import { Link } from "react-router-dom";
import Nav from "@subcomponents/navigationBars/navBar/Nav";
import * as cryptography from "@phaeton/phaeton-cryptography-web";
import { getFromStorage } from "@utils/localJSONStorage";
import styles from "./startpage.css";

function Start() {
  useEffect(() => {
    try {
      let logincheck = sessionStorage.getItem("loggedIn");
      let encryptedMsg = getFromStorage("PUB_OBJ", []);
      if (encryptedMsg) {
        window.location = "#/login";
      }
      if (logincheck == "true") {
        window.location = "#/dashboard";
      }
    } catch { }
    try {
      sessionStorage.removeItem("passphrase");
    } catch { }
  }, []);

  const encryptPassPhrase = async () => {
    const passphrase = [...Array(1)].map(generatePassphrase);
    let encryptedObj = await cryptography.encryptPassphraseWithPassword(
      JSON.stringify(passphrase[0]),
      "tSalt",
      10
    );
    sessionStorage.setItem("passphrase", JSON.stringify(encryptedObj));
    window.location.assign("#/newaccount");
  };

  return (
    <>
      <Nav />
      <div className="row m-0 justify-content-center">
        <div className="justify-content-start col-11 col-sm-10 col-md-8 col-lg-4">
          <div className={`${styles.title} h1`}>Let&apos;s get started</div>
          <div className={`text-start ${styles.subtitle}`}>
            <p>
              We just made it so simple, You can import or create your account
            </p>
          </div>
        </div>
      </div>
      <div className="row m-0 justify-content-center mb-4">
        <div className={`${styles.logincards} col-11 col-sm-10 col-md-8 col-lg-4`}>
          <div className={`${styles.darkbg} mb-2`}>
            <i className="far fa-arrow-to-bottom ml-1" />
          </div>
          <div>
            <h2>Use existing account</h2>
            <p>
              Import your pre-existing account with 12 word seed phrase or
              private key
            </p>
          </div>
          <div>
            <Link
              style={{ textDecoration: "none", color: "#fff" }}
              to="/importaccount"
              replace
            >
              <DarkButton
                style={{
                  padding: "16px 80px 16px 80px",
                  width: "100%",
                }}
                content="Import Account"
              />
            </Link>
          </div>
        </div>
      </div>
      <div className="row m-0 justify-content-center">
        <div className={`${styles.logincards} col-11 col-sm-10 col-md-8 col-lg-4`}>
          <div className={`${styles.darkbg} mb-2`}>
            <i className="far fa-user-plus" />
          </div>
          <div>
            <h2>New to this</h2>
            <p>
              You can create a new account with just 3 simple steps by
              generating 12 words
            </p>
          </div>
          <div>
            <ColouredButton
              padding="15px 75px 15px 75px"
              width="100%"
              content="Create an Account"
              onClick={encryptPassPhrase}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Start;
