import React, { useEffect, useState } from "react";
import { ColouredButton } from "@tools/Button";
import Nav from "@subcomponents/navigationBars/navBar/Nav";
import styles from './importaccount.css';

function AccountImport() {
  const [typeKey, setTypeKey] = useState("");
  const onChange = (event) => {
    setTypeKey(event.target.value);
  };

  useEffect(() => {
    try {
      let logincheck = sessionStorage.getItem("loggedIn");
      if (logincheck == "true") {
        window.location = "#/dashboard";
      }
    } catch { }
  }, []);

  return (
    <>
      <Nav />
      <div className="row m-0 justify-content-center">
        <div className="p-4 center col-12 col-sm-8 col-md-6 col-lg-4">
          <span className={`${styles.title} h1`}>Import account</span>
          <div className={`${styles.darkcard}`}>
            <h3 className={`${styles.subtitle}`}>Import your wallet</h3>
            <select
              defaultValue="default"
              className={`${styles.selectStyle}`}
              onChange={onChange}
            >
              <option disabled value="default">
                Select option
              </option>
              <option value="SP">Seed Phrase</option>
              {/* <option value="PK">Private Key </option> */}
            </select>
            <div className="d-flex flex-row justify-content-between">
              <div className="d-flex align-items-center">
                <a
                  href="#/getstarted"
                  className={`${styles.backButton} pt-3`}
                  style={{
                    fontSize: "15px",
                    color: "#a1a1a1",
                    textDecoration: "underline",
                  }}
                >
                  Back
                </a>
              </div>
              <ColouredButton
                height="45px"
                width="30%"
                disabled={!typeKey}
                opacity={typeKey ? "1" : ".8"}
                margin="20px 0px 0px"
                onClick={() =>
                  (window.location.href = "#/importaccount/via-seed-phrase")
                }
                content="Import"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AccountImport;
