import React, { useEffect, useState } from "react";
import { ColouredButton } from "@tools/Button";
import { Link } from "react-router-dom";
import * as cryptography from "@phaeton/phaeton-cryptography-web";
import "react-toastify/dist/ReactToastify.css";
import styles from "./newaccount.css";

function VerifySeed() {
  const [incorrect, setIncorrect] = useState(false);
  const [suggestion, setSuggestion] = useState([]);
  const [shuffledArray, setShuffledArray] = useState([]);
  const [localPhrase, setLocalPhrase] = useState([]);
  const [verifyPhrase, setVerifyPhrase] = useState([]);
  const [phraseOne, setPhraseOne] = useState(false);
  const [phraseTwo, setPhraseTwo] = useState(false);
  const [phraseThree, setPhraseThree] = useState(false);
  const [randomIndicies, setRandomIndicies] = useState([]);
  var phrase = [];


  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  const getPassphraseFromSession = async () => {
    let pass = [];
    const sessionPassphrases = sessionStorage.getItem("passphrase");
    const passphrases = await cryptography.decryptPassphraseWithPassword(
      JSON.parse(sessionPassphrases),
      "tSalt",
      10
    );
    let passArray = JSON.parse(passphrases);
    pass = passArray.split(" ");
    return pass;
  }

  const indexs = async () => {
    phrase = await getPassphraseFromSession();
    let indices = [];
    let store = [];
    let suggest = [];
    let shuffle = [];
    while (indices.length < 3) {
      indices.push(Math.floor(Math.random() * 9));
      indices = indices.filter(onlyUnique);
    }
    indices.sort();
    setRandomIndicies(indices);
    store.push(phrase);

    for (let i = 0; i < 12; i++) {
      if (indices.includes(i)) {
        suggest.push(store[0][i]);
        store[0][i] = "";
      }
    }
    setSuggestion(suggest);
    let arr = suggest
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
    shuffle.push(arr);
    setShuffledArray(shuffle[0]);
    setVerifyPhrase(store[0]);
  };

  useEffect(() => {
    async function pass() {
      const pp = await getPassphraseFromSession();
      setLocalPhrase(pp);
    }
    pass();
    try {
      let logincheck = sessionStorage.getItem("loggedIn");
      if (logincheck == "true") {
        window.location = "#/dashboard";
      }
    } catch { }
    indexs();
  }, []);

  // Fetch the passphrase array from the localStorage, fetching randomIndexData array, then onChange verifySeed is called

  const verifySeed = (event) => {
    //Target Value
    const eve = event.target.value;
    let curId = event.target.id; //Target ID
    let curPos = parseInt(curId.charAt(curId.length - 1));
    if (eve === localPhrase[curPos]) {
      for (let i = 0; i < 3; i++) {
        if (curPos === randomIndicies[i]) {
          if (i === 0) {
            setPhraseOne(true);
            setIncorrect(false);
          }
          if (i === 1) {
            setPhraseTwo(true);
            setIncorrect(false);
          }
          if (i === 2) {
            setPhraseThree(true);
            setIncorrect(false);
          }
        }
      }
    } else {
      for (let i = 0; i < 3; i++) {
        if (curPos === randomIndicies[i]) {
          if (i === 0) {
            setPhraseOne(false);
            setIncorrect(true);
          }
          if (i === 1) {
            setPhraseTwo(false);
            setIncorrect(true);
          }
          if (i === 2) {
            setPhraseThree(false);
            setIncorrect(true);
          }
        }
      }
    }
  };

  return (
    <>
      <div className="pt-5 mt-5">
        <div className="row m-0 justify-content-center">
          <div className={`${styles.logincards} col-11 col-sm-10 col-md-8 col-lg-5`}>
            <div>
              <h2 className={`${styles.newtitle} mb-3`}>Verify your seed phrase</h2>
              <p className={`${styles.newsubtitle}`}>
                Find out the missing seed phrases to complete the 12 words set.
                Please check from where you have saved or wrote the phrases.
              </p>
            </div>
            <div className={`${styles.cardborder} row m-0 px-3`}>
              {verifyPhrase.map((element, eid) => (
                <div key={eid} className={`${styles.padding10} col-2`}>
                  {element === "" ? (
                    <input
                      onChange={verifySeed}
                      id={`verify${eid}`}
                      className={`${styles.inputVerify} w-100 ${styles.phrases}`}
                    />
                  ) : (
                      <span id={`verify${eid}`} className={`${styles.phrases}`}>
                      {element}
                    </span>
                  )}
                </div>
              ))}
              <div className="d-flex row m-0 w-100">
                <div className={incorrect ? "pl-3 ml-1 mt-2" : "d-none"}>
                  <p className="text-danger">
                    <i className="fas fa-exclamation-circle fa-lg" />
                    Incorrect Passphrase
                  </p>
                </div>
                <p className={`${styles.suggestion} pl-2 col-12 mt-2`}>Suggestions</p>
                <div className="d-flex">
                  {shuffledArray.map((ele, id) => (
                    <div key={id} className="px-2 mr-2">
                      <p className="text-danger h5 d-block">{ele}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row m-0 justify-content-center">
          <div className={`${styles.backcard} d-flex col-11 col-sm-10 col-md-8 col-lg-5 justify-content-between`}>
            <div>
              <p
                className={`${styles.backButton}`}
                onClick={() => (window.location = "#/newaccount")}
              >
                Back
              </p>
            </div>
            <div style={{ marginRight: "8px" }}>
              <Link to="/makeapassword">
                <ColouredButton
                  disabled={
                    phraseOne && phraseTwo && phraseThree ? "" : "disabled"
                  }
                  color="#ffffff"
                  opacity={
                    phraseOne && phraseTwo && phraseThree && !incorrect
                      ? "1"
                      : ".5"
                  }
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
export default VerifySeed;
