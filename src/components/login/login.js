import React, { useEffect, useState } from "react";
import { ColouredButton, DarkButton } from "@tools/Button";
import { Input } from "@tools/Input/index";
import { Modal } from "react-bootstrap";
import * as cryptography from "@phaeton/phaeton-cryptography-web";
import { getFromStorage } from "@utils/localJSONStorage";
import Nav from "@subcomponents/navigationBars/navBar/Nav";
import toastDisplay from "../../app/toast";
import styles from './login.css';

function Logins() {
  const [accountCred, setAccountCred] = useState({
    username: "",
    password: "",
  });
  const [PublicData, setPublicData] = useState([]);
  const [encryptedData, setEncryptedData] = useState([]);
  const [load, setLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [contact, setContact] = useState(false);
  const [forceDelete, setForceDelete] = useState(false);
  const [reqUser, setReqUser] = useState(false);
  const [reqPass, setReqPass] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [reconfirmPassword, setReconfirmPassword] = useState(false);
  const [typePhae, setTypePhae] = useState("");

  const closeContact = () => setContact(!contact);
  const closeDelete = () => setForceDelete(!forceDelete);
  const closeReconfirmPassword = () => setReconfirmPassword(!reconfirmPassword);

  const handleEnter = (event) => {
    var key = event.which || event.keyCode;
    if (key == 13) {
      handleSubmit();
    }
  };

  useEffect(() => {
    try {
      let logincheck = sessionStorage.getItem("loggedIn");
      let encryptedObj = getFromStorage("ENC_OBJ", []);
      if (!encryptedObj?.cipherText) {
        window.location = "#/getstarted";
        return;
      }
      let publicObj = getFromStorage("PUB_OBJ", []);
      setPublicData(JSON.parse(publicObj));
      setEncryptedData(encryptedObj);
      if (logincheck == "true") {
        window.location = "#/dashboard";
        return;
      }
    } catch { }
  }, []);

  const handleSubmit = async () => {
    setLoad(true);
    if (accountCred.username == "" && accountCred.password == "") {
      setReqUser(true);
      setReqPass(true);
    } else if (accountCred.username == "") {
      setReqUser(true);
      setReqPass(false);
    } else if (accountCred.password == "") {
      setReqPass(true);
      setReqUser(false);
    } else {
      setReqUser(false);
      setReqPass(false);
      try {
        let decryptedObj = await cryptography.decryptPassphraseWithPassword(
          encryptedData,
          accountCred.password
        );
      } catch {
        setLoad(false);
        toastDisplay("Invalid Credentials!", "error");
        // setAccountCred({
        //   username: "",
        //   password: "",
        // });
        return;
      }
      if (PublicData.username == accountCred.username) {
        toastDisplay("Logged in successfully", "success");
        sessionStorage.setItem("loggedIn", "true");
        setAccountCred({
          username: "",
          password: "",
        });
        window.location = "#/dashboard";
        return;
      } else {
        setLoad(false);
        toastDisplay("Invalid Credentials!", "error");
        return;
        // setAccountCred({
        //   username: "",
        //   password: "",
        // });
      }
    }
  };

  const handleDelete = () => {
    setIsLoading(true);
    try {
      if (typePhae == "") {
        toastDisplay("Kindly enter PHAETON!", "info");
        setIsLoading(false);
        return;
      }
      try {
        if (typePhae == "PHAETON") {
          sessionStorage.removeItem("loggedIn");
          localStorage.removeItem("PUB_OBJ");
          localStorage.removeItem("currentNetwork");
          localStorage.removeItem("networkDetails");
          localStorage.removeItem("ENC_OBJ");
          sessionStorage.removeItem("loggedIn")
          toastDisplay("Successfully Removed Account", "success");
          setTypePhae("");
          setIsLoading(true);
          window.location = "#/getstarted";
          window.location.reload();
          return;
        } else {
          setIsLoading(false);
          toastDisplay("Invalid confirmation phrase, Try again!", "error");
          return;
        }
      } catch {
        setIsLoading(false);
        toastDisplay("Error Resetting Phaeton Desktop", "error");
        return;
      }
    } catch { setIsLoading(false); }
  }

  return (
    <>
      <Nav />
      <div className="pt-5">
        <div
          className={`${styles.cardcontainer} row m-0 justify-content-center`}
          style={{ borderRadius: "12px!important" }}
        >
          <div className="col-xs-10 col-sm-9 col-md-8 col-lg-4">
            <div className="col-12">
              <span className="h1">Welcome!</span>
              <p className={`${styles.welcomeText}`}>The decentralized web awaits</p>
            </div>
            <div className={styles.darkcard}>
              <div className="justify-content-start">
                <label className={styles.heading}>Username</label>
              </div>
              <div>
                <Input
                  margin="0px 0px 10px 0px"
                  padding="10px"
                  width="100%"
                  // value={accountCred.username}
                  onKeyPress={(e) => handleEnter(e)}
                  onChange={(e) =>
                    setAccountCred({
                      ...accountCred,
                      username: e.target.value,
                    })
                  }
                  placeholder="Enter Username"
                />
              </div>
              <div className={reqUser ? "ml-1" : "d-none"}>
                <p className="text-danger mb-2">
                  Required<sup>*</sup>
                </p>
              </div>
              <div className="justify-content-start">
                <label className={styles.heading}>Password</label>
                <i
                  className={
                    showPassword
                      ? "far float-right text-white fa-eye p-0"
                      : "far float-right text-white fa-eye-slash p-0"
                  }
                  style={{ cursor: "pointer", fontSize: "18px" }}
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>
              <div>
                <Input
                  type={showPassword ? "text" : "password"}
                  margin="0px 0px 10px 0px"
                  padding="10px"
                  width="100%"
                  // value={accountCred.password}
                  onChange={(e) =>
                    setAccountCred({
                      ...accountCred,
                      password: e.target.value,
                    })
                  }
                  onKeyPress={(e) => handleEnter(e)}
                  placeholder="Enter Password"
                />
              </div>
              <div className={reqPass ? "ml-1" : "d-none"}>
                <p className="text-danger mb-2">
                  Required<sup>*</sup>
                </p>
              </div>
              <p className="text-white" style={{ cursor: "pointer" }} onClick={() => setForceDelete(true)}>Forgot Password?</p>
              <ColouredButton
                height="50"
                width="100%"
                content="Unlock"
                onClick={handleSubmit}
                style={{ backgroundColor: "#ef474d", color: "#fff" }}
              />
            </div>
          </div>
        </div>
        <div className={`${styles.footer} mt-2`}>
          <p className={styles.seedlink}>
            Need Help?&nbsp;
            <span
              onClick={() => setContact(!contact)}
              style={{ textDecoration: "none", color: "#ef474d", cursor: "pointer" }}
            >
              Contact Phaeton support
            </span>
          </p>
        </div>
      </div>
      <Modal
        className="modalblack navName"
        show={contact}
        onHide={closeContact}
        centered
      >
        <Modal.Header className="modalheader">
          <Modal.Title>Contact Phaeton Support
            <i className="far fa-times-circle fa-lg p-2 mr-2 icon" aria-hidden="true"
              title="Close"
              style={{ cursor: "pointer" }}
              onClick={closeContact}></i>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modalBody">
          <div className="headmodal justify-content-center p-2">
            <form action="https://formspree.io/f/xvolkpoq" method="post">
              <div className="form-group">
                <label className="heading" htmlFor="exampleInputEmail1">Email Address</label>
                <Input
                  type="email"
                  margin="0px 0px 10px 0px"
                  placeholder="Enter Email Address"
                  padding="10px"
                  name="name"
                  width="100%"
                  required
                />
              </div>
              <div className="form-group">
                <label className="heading" htmlFor="exampleTextArea">Message</label>
                <Input
                  type="text"
                  margin="0px 0px 10px 0px"
                  placeholder="Enter Message"
                  padding="10px"
                  name="message"
                  width="100%"
                  required
                />
              </div>
              <ColouredButton
                height="50"
                width="100%"
                content="Submit"
                type="submit"
                style={{ backgroundColor: "#ef474d", color: "#fff" }}
              />
            </form>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        className="modalblack navName"
        show={forceDelete}
        onHide={closeDelete}
        centered
      >
        <Modal.Header className="modalheader">
          <Modal.Title>Forgot Password
            <i className="far fa-times-circle fa-lg p-2 mr-2 icon" aria-hidden="true"
              title="Close"
              style={{ cursor: "pointer" }}
              onClick={closeDelete}></i>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modalBody">
          <div className="headmodal">
            <ul className="text-justify pl-4 p-3">
              <li>If you have <span className="font-weight-bold">forgotten your password</span>, then you have to <span className="font-weight-bold">force delete the current wallet settings</span> and <span className="font-weight-bold">import</span> your account again.</li>
              <li>Importing your Account to the wallet is <span className="font-weight-bold">simple</span> and can be done by using your <span className="font-weight-bold">Passphrase</span>, You may then only be able to set up your account with any <span className="font-weight-bold">desired username</span> and a <span className="font-weight-bold">new password</span>.</li>
              <li>If you are not having the passphrase with you then you are advised to try guessing the password as there is <span className="font-weight-bold">no limit</span> on the number of tries for a user to log in to the Phaeton Desktop Wallet.</li>
              <li>Kindly note that there is <span className="font-weight-bold">no option</span> for a user to <span className="font-weight-bold">recover</span> the account other than using your passphrase to import your account again.</li>
              <li>Kindly Note that this action <span className="font-weight-bold">cannot be reverted</span> and Phaeton(Phaeton Pty Ltd.) or any of its subsidiaries will not be held responsible for this action of yours or any kind of loss associated with your account.</li>
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <DarkButton content="Cancel" onClick={closeDelete} />
          <ColouredButton content="Confirm" onClick={() => setReconfirmPassword(!reconfirmPassword)} />
        </Modal.Footer>
      </Modal>
      <Modal
        className="modalblack navName"
        show={reconfirmPassword}
        onHide={closeReconfirmPassword}
        centered
      >
        <Modal.Header className="modalheader">
          <Modal.Title>Re-Confirm Remove Account
            <i className="far fa-times-circle fa-lg p-2 mr-2 icon" aria-hidden="true"
              title="Close"
              style={{ cursor: "pointer" }}
              onClick={closeReconfirmPassword}></i>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modalBody pt-0">
          <div className="headmodal justify-content-center p-2">
            <span className="my-2">Kindly enter <span className="text-danger">PHAETON</span> to delete the account</span>
            <Input
              onChange={(e) => setTypePhae(e.target.value)}
              type="text"
              margin="15px 0px 0px 0px"
              placeholder="Type PHAETON here"
              padding="10px"
              width="100%"
              required
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          {isLoading ?
            <button className="btn btn-danger" style={{ backgroundColor: "#ef474d" }}>Resetting...
              <div className="spinner-border text-danger spinner-border-sm ml-2" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </button>
            :
            <button className="btn btn-danger" style={{ backgroundColor: "#ef474d" }} onClick={handleDelete}>Confirm</button>
          }
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Logins;
