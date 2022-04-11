import React, { useEffect, useState } from "react";
import { ColouredButton } from "@tools/Button";
import * as cryptography from "@phaeton/phaeton-cryptography-web";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Link } from "react-router-dom";
import toastDisplay from "../../app/toast";
import jsPDF from "jspdf";

function Account() {
  const [check, setCheck] = useState(false);
  const [keyWords, setKeyWords] = useState([]);
  const [selected, setSelected] = useState(false);
  const [textCopy, setTextCopy] = useState("");
  const [download, setDownload] = useState(false);

  useEffect(() => {
    try {
      let logincheck = sessionStorage.getItem("loggedIn");
      if (logincheck == "true") {
        window.location = "#/dashboard";
      }

    } catch { }

    async function getPass() {
      let pass = [];
      const sessionPassphrases = sessionStorage.getItem("passphrase");
      const passphrases = await cryptography.decryptPassphraseWithPassword(
        JSON.parse(sessionPassphrases),
        "tSalt",
        10
      );
      let passArray = JSON.parse(passphrases);
      setTextCopy(passArray);
      pass = passArray.split(" ");
      setKeyWords(pass);
    }
    getPass();
  }, []);


  const handleCopy = () => {
    toastDisplay("Seed Phrase Copied", "info");
    setSelected(true);
    setTimeout(() => setSelected(false), 5000);
  };

  const handleCheck = () => {
    setCheck(!check);
  };

  const downloadPDF = () => {

    toastDisplay("Downloading...", "info");
    setDownload(true);
    var doc = new jsPDF("l", "pt", 'a4');
    doc.html(document.querySelector('#content'), {
      callback: function (pdf) {
        pdf.save('seedPhrase.pdf');
      },
      x: 20,
      y: 50,
    })
    setTimeout(() => setDownload(false), 5000);

  }

  return (
    <>
      <div className="pt-5 mt-5">
        <div className="row m-0 justify-content-center">
          <div className="logincards col-11 col-sm-10 col-md-8 col-lg-5">
            <div id="content">
              <div>
                <div className="d-flex">
                  <img alt="logo" src="./assets/images/img/logo.png" height="50" width="50" className="img ml-2" />
                  <h2 className="newtitle pt-2">
                    Your backup secret 12 words seed phrase
                  </h2>

                </div>
                <p className="newsubtitle hide">
                  Just copy this and save it somewhere you will be needing this
                  ahead to complete the registration
                </p>
              </div>
              <div className="cardborder row m-0">
                {keyWords?.map((element, id) => (
                  <div key={id} className="padding10 col-2">
                    {element}
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{ backgroundColor: selected ? "#373c47" : "" }}
              className="bottomborder row m-0 w-50 justify-content-center"
            >
              <CopyToClipboard text={textCopy} onCopy={handleCopy}>
                <div
                  className="btn-group btn-group-toggle col-12 p-0"
                  data-toggle="buttons"
                >
                  <label
                    className="btn text-left"
                    style={{ backgroundColor: "inherit", color: "#fff" }}
                  >
                    <input
                      type="radio"
                      autoComplete="off"
                    />
                    Copy to clipboard
                    <i
                      className={
                        selected
                          ? "far fa-check float-right mt-1"
                          : "far fa-clone float-right mt-1"
                      }
                    />
                  </label>
                </div>
              </CopyToClipboard>
            </div>
            <div
              style={{ backgroundColor: download ? "#373c47" : "" }}
              className="bottomborder row m-0 w-50 "
            >
              <div
                className="btn-group btn-group-toggle col-12 p-0"
                data-toggle="buttons"
              >
                <label
                  className="btn text-left"
                  style={{ backgroundColor: "inherit", color: "#fff" }}
                  onClick={downloadPDF}
                >
                  {/* <input
                      type="radio"
                      autoComplete="off"
                    /> */}
                  Download as pdf
                  <i
                    className={
                      download
                        ? "far fa-check float-right mt-1"
                        : "far fa-file-download float-right mt-1"
                    }
                  />
                </label>
              </div>
            </div>
            <div className="pt-2">
              <input
                type="checkbox"
                className="form-control-input"
                onClick={handleCheck}
                id="exampleCheck1"
              />
              <label className="form-control-label" htmlFor="exampleCheck1">
                I understand that it is my responsibility to store the Seed
                phrase safe
              </label>
            </div>
          </div>
        </div>
        <div className="row m-0 justify-content-center">
          <div className="backcard d-flex col-11 col-sm-10 col-md-8 col-lg-5 justify-content-between">
            <div>
              <Link to="/getstarted" className="backButton">
                Back
              </Link>
            </div>
            <div style={{ marginRight: "8px" }}>
              <Link to="/verifyseed">
                <ColouredButton
                  disabled={check ? "" : "disabled"}
                  color="#ffffff"
                  opacity={check ? "1" : ".5"}
                  padding="10px 26px"
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

export default Account;
