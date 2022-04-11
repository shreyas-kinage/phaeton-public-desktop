import React, { useEffect, useState } from "react";
import { ColouredButton } from "@tools/Button";
import { Input } from "@tools/Input";
import { setInStorage } from "@utils/localJSONStorage";
import { extractAddressFromPassphrase, extractPublicKey } from "@utils/account";
import * as cryptography from "@phaeton/phaeton-cryptography-web";
import styles from './password.css';

function Password() {
  const [accountCred, setAccountCred] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [confPassword, setConfPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleEnter = (event) => {
    var key = event.which || event.keyCode;
    if (key == 13) {
      handleSubmit();
    }
  };

  useEffect(() => {
    try {
      let logincheck = sessionStorage.getItem("loggedIn");
      if (logincheck == "true") {
        window.location = "#/dashboard";
      }
    } catch { }
  }, []);

  const handleSubmit = async () => {
    let errors = {};

    const numberPattern = /^(?=.*[0-9])/;
    const loweCasePattern = /^(?=.*[a-z])/;
    const upperCasePattern = /^(?=.*[A-Z])/;
    const specialCharacterPattern = /^(?=.*[`~!@#$%^&*()])/;
    const spacePattern = /\s/g;

    let userN = accountCred.username;
    let pass = accountCred.password;
    let cPass = accountCred.confirmPassword;
    //to check username is not empty and is of type string
    if (!userN) {
      errors.userN = "Username is required";
    } else if (typeof userN !== "string") {
      errors.userN = "Username is not String";
    }
    else if (userN.length < 6 || userN.length > 20) {
      errors.userN = "Username should contain characters between 6(Minimum) to 20(Maximum)";
    }
    //to check password
    if (!pass) {
      errors.pass = "New Password is required";
    } else if (typeof pass !== "string") {
      errors.pass = "New Password is not String";
    } else if (
      !(
        numberPattern.test(pass) &&
        loweCasePattern.test(pass) &&
        upperCasePattern.test(pass) &&
        specialCharacterPattern.test(pass)
      )
    ) {
      errors.pass =
        "At least contain one number, one lower case alphabet and one upper case alphabet and one special character";
    } else if (!specialCharacterPattern.test(pass)) {
      errors.pass =
        "At least contain one of these `~!@#$%^&*() special character only";
    } else if (spacePattern.test(pass)) {
      errors.pass = "Space is not allowed";
    } else if (pass.length < 8) {
      errors.pass = "Minimum 8 characters are required";
    } else if (pass.length > 64) {
      errors.pass = "Maximum 64 characters are allowed";
    }

    //to check confirm password
    if (!cPass) {
      errors.cPass = "Confirm Password is required";
    } else if (typeof cPass !== "string") {
      errors.cPass = "Confirm Password is not String";
    } else if (pass !== cPass) {
      errors.cPass = "Confirm Password doesn't match";
    }

    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      let keysNew;
      let addressNew;
      let binary;
      const sessionPassphrases = sessionStorage.getItem("passphrase");
      const passphrases = await cryptography.decryptPassphraseWithPassword(
        JSON.parse(sessionPassphrases),
        "tSalt",
        10
      );
      let passArray = JSON.parse(passphrases);

      addressNew = await extractAddressFromPassphrase(passArray);
      keysNew = await extractPublicKey(passArray);
      binary = await cryptography.getAddressFromPassphrase(passArray);
      const currentBinary = binary.toString("hex");
      const currentPrivateKey = keysNew.privateKey.toString("hex");
      const currentPublicKey = keysNew.publicKey.toString("hex");
      const currentKeys = {
        binaryAddress: currentBinary,
        passphrase: passArray,
        privateKey: currentPrivateKey,
        publicKey: currentPublicKey,
        address: addressNew,
      };

      let privateObject = {
        passphrase: currentKeys.passphrase,
        privateKey: currentKeys.privateKey,
      };
      let publicObject = {
        binary: currentKeys.binaryAddress,
        username: accountCred.username,
        address: currentKeys.address,
        publicKey: currentKeys.publicKey,
      };

      let encryptedObj = await cryptography.encryptPassphraseWithPassword(
        JSON.stringify(privateObject),
        accountCred.password,
        10000
      );

      setInStorage("ENC_OBJ", encryptedObj);
      setInStorage("PUB_OBJ", JSON.stringify(publicObject));
      sessionStorage.removeItem("passphrase");
      window.location = "#/login";
    }
  };

  return (
    <>
      <div className="pt-5 mt-5">
        <div className="row m-0 justify-content-center">
          <div
            style={{ borderRadius: "12px 12px 0px 0px" }}
            className={`${styles.darkcard} col-11 col-sm-10 col-md-7 col-lg-5`}
          >
            <h3 className={`${styles.subtitle}`}>Secure wallet using password</h3>
            <p className={`${styles.privatetext}`}>
              Create a Username and a Password used to login into your account
              on the Phaeton Desktop Wallet Application
            </p>
            <label className={`${styles.heading}`}>Username</label>
            <Input
              onChange={(e) =>
                setAccountCred({
                  ...accountCred,
                  username: e.target.value,
                })
              }
              margin={errors.userN ? "0px 0px 5px 0px" : "0px 0px 18px 0px"}
              onKeyPress={handleEnter}
              padding="12px"
              width="100%"
            />
            <div className={errors.userN ? "ml-1" : "d-none"}>
              <p className="text-danger mb-2">{errors.userN}</p>
            </div>
            <div className="col-12 text-right p-0">
              <label className={`${styles.heading} col-6 text-left p-0`}>Password</label>
              <i
                className={
                  showPassword
                    ? "far fa-eye col-6 p-0"
                    : "far fa-eye-slash col-6 p-0"
                }
                style={{ cursor: "pointer", fontSize: "18px" }}
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
            <Input
              onChange={(e) =>
                setAccountCred({
                  ...accountCred,
                  password: e.target.value,
                })
              }
              minlength="8"
              type={showPassword ? "text" : "password"}
              margin={errors.pass ? "0px 0px 5px 0px" : "0px 0px 18px 0px"}
              onKeyPress={handleEnter}
              padding="12px"
              width="100%"
            />
            <div className={errors.pass ? "" : "d-none"}>
              <p className="text-danger">
                <i className="fas fa-exclamation-circle fa-lg" />
                {errors.pass}
              </p>
            </div>
            <div className="col-12 text-right p-0">
              <label className={`${styles.heading} col-6 text-left p-0`}>
                Confirm Password
              </label>
              <i
                className={
                  confPassword
                    ? "far fa-eye col-6 p-0"
                    : "far fa-eye-slash col-6 p-0"
                }
                style={{ cursor: "pointer", fontSize: "18px" }}
                onClick={() => setConfPassword(!confPassword)}
              />
            </div>
            <Input
              onChange={(e) =>
                setAccountCred({
                  ...accountCred,
                  confirmPassword: e.target.value,
                })
              }
              minlength="8"
              type={confPassword ? "text" : "password"}
              margin={errors.cPass ? "0px 0px 5px 0px" : "0px 0px 18px 0px"}
              onKeyPress={handleEnter}
              padding="12px"
              width="100%"
            />
            <div className={errors.cPass ? "" : "d-none"}>
              <p className="text-danger mt-2">
                <i className="fas fa-exclamation-circle fa-lg" />
                {errors.cPass}
              </p>
            </div>
          </div>
        </div>
        <div className="row m-0 justify-content-center">
          
          <div className={`${styles.backcard} d-flex col-11 col-sm-10 col-md-7 col-lg-5 justify-content-between`}>
            <div>
              <p
                className={`${styles.backButton}`}
                onClick={() => (window.location = "#/getstarted")}
              >
                Back
              </p>
            </div>
            <div style={{ marginRight: "8px" }}>
              <ColouredButton
                onClick={handleSubmit}
                color="#ffffff"
                padding="10px 26px"
                content="Submit"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Password;
