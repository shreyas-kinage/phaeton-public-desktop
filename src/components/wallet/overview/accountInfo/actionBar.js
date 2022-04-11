import React, { useState } from "react";
import QRCode from "qrcode.react";
import { tokenMap } from "@constants";
import Icon from "@tools/icon";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Tooltip from "@tools/tooltip/tooltip";
import { DarkButton } from "@tools/Button";
import DialogLink from "@tools/dialog/link";
import styles from "./accountInfo.css";
import toastDisplay from "../../../../app/toast";
import VoteModal from "@modals/voteModal";
import UnvoteModal from "@modals/unvoteModal";
import UnlockModal from "@modals/unlockModal";
import style from "@tools/Button/button.css";

const BookmarkIcon = ({ bookmark }) => (
  <Icon
    name={bookmark === undefined ? "bookmark" : "bookmarkActive"}
    className={styles.bookmark}
  />
);

const getMultiSignatureComponent = (
  isLoggedInAccount,
  isMultisignature,
  activeToken
) => {
  if (activeToken !== tokenMap.PHAE.key) {
    return null;
  }
  if (!isLoggedInAccount && !isMultisignature) {
    return null;
  }
  if (isMultisignature) {
    return "multisigAccountDetails";
  }
  return "multiSignature";
};

const ActionBar = ({
  address,
  activeToken,
  username,
  account,
  isMultisignature,
}) => {
  const [publicSelected, setPublicSelected] = useState(false);
  const [addressSelected, setAddressSelected] = useState(false);
  const [openVoteModal, setOpenVoteModal] = useState(false);
  const [openUnvoteModal, setOpenUnvoteModal] = useState(false);
  const [openUnlockModal, setOpenUnlockModal] = useState(false);
  const component = getMultiSignatureComponent(isMultisignature, activeToken);

  const handlePublic = () => {
    setPublicSelected(true);
    setTimeout(() => setPublicSelected(false), 5000);
    toastDisplay("Public Key Copied", "info");
  };

  const handleAddress = () => {
    setAddressSelected(true);
    setTimeout(() => setAddressSelected(false), 5000);
    toastDisplay("Address Copied", "info");
  };

  const handleVoteModal = () => {
    const isLoggedIn = JSON.parse(window.sessionStorage.getItem("loggedIn"));
    if (!isLoggedIn) {
      toastDisplay("Please Login to Vote!", "info");
      setTimeout(function () {
        window.location.href = "#/login";
      }, 2000);
      return;
    }
    setOpenVoteModal(true);
  };

  const handleUnvoteModal = () => {
    const isLoggedIn = JSON.parse(window.sessionStorage.getItem("loggedIn"));
    if (!isLoggedIn) {
      toastDisplay("Please Login to Unvote!", "info");
      setTimeout(function () {
        window.location.href = "#/login";
      }, 2000);
      return;
    }
    setOpenUnvoteModal(true);
  };

  const handleUnlockModal = () => {
    const isLoggedIn = JSON.parse(window.sessionStorage.getItem("loggedIn"));
    if (!isLoggedIn) {
      toastDisplay("Please Login to Unlock!", "info");
      setTimeout(function () {
        window.location.href = "#/login";
      }, 2000);
      return;
    }
    setOpenUnlockModal(true);
  };

  const sendOpenClose = () => {
    setOpenVoteModal(!openVoteModal);
  };

  const unvoteOpenClose = () => {
    setOpenUnvoteModal(!openUnvoteModal);
  };

  const unlockOpenClose = () => {
    setOpenUnlockModal(!openUnlockModal);
  };

  return (
    <footer>
      <div className="col-9 justify-content-center p-0">
        <div
          className="btn-group btn-group-toggle row m-0 justify-content-start p-0 d-block mb-2 ml-2"
          data-toggle="buttons"
        >
          {account?.summary?.publicKey ? (
            <CopyToClipboard
              text={account?.summary?.publicKey}
              title="Copy Public key"
              onCopy={handlePublic}
            >
              <label
                className={`btn btn-secondary ${style.togglebutton} col-10 text-left p-2`}
                style={{
                  backgroundColor: "#3C404B",
                  border: "1px solid #3C404B",
                  color: "#ff8f8f",
                  fontSize: "12px",
                  marginTop: 0,
                  width: "50%",
                }}
              >
                <input
                  className="d-none"
                  type="radio"
                  autoComplete="off"
                />
                <div className="d-flex justify-content-between">
                  <span className="text-truncate m-0 d-block">Public key</span>
                  <i
                    style={{ color: "#fff" }}
                    className={
                      publicSelected
                        ? "far fa-check float-right"
                        : "far fa-clone float-right"
                    }
                  />
                </div>
              </label>
            </CopyToClipboard>
          ) : (
            ""
          )}

          <CopyToClipboard text={address} title="Copy Address" onCopy={handleAddress}>
            <label
              className={`btn btn-secondary ${style.togglebutton} col-10 text-left p-2`}
              style={{
                backgroundColor: "#3C404B",
                border: "1px solid #3C404B",
                color: "#ff8f8f",
                fontSize: "12px",
                marginTop: 0,
                width: "50%",
              }}
            >
              <input
                className="d-none"
                type="radio"
                autoComplete="off"
              />
              <div className="d-flex justify-content-between">
                <span className="text-truncate m-0 d-block">Address</span>
                <i
                  style={{ color: "#fff" }}
                  className={
                    addressSelected
                      ? "far fa-check float-right"
                      : "far fa-clone float-right"
                  }
                />
              </div>
            </label>
          </CopyToClipboard>
        </div>
        <div
          className="btn-group btn-group-toggle row m-0 justify-content-start p-0 d-flex ml-2"
        // style={{ border: "1px solid rgb(60, 64, 75)" }}
        >
          <DarkButton
            style={{
              padding: "4px 12px",
              color: "#ff8f8f",
              fontSize: "12px",
              boxShadow: "none",
            }}
            startIcon="fas fa-user-check fa-sm"
            classes="p-2 border border-dark"
            content="Vote"
            onClick={handleVoteModal}
          />

          <DarkButton
            style={{
              padding: "4px 12px",
              color: "#ff8f8f",
              fontSize: "12px",
              boxShadow: "none",
            }}
            startIcon="fas fa-user-times fa-sm"
            classes="p-2 border border-dark"
            content="Unvote"
            onClick={handleUnvoteModal}
          />
          <button
            style={{
              padding: "4px 12px",
              color: "#ff8f8f",
              fontSize: "12px",
              boxShadow: "none",
            }}
            onClick={handleUnlockModal}
            className={`${style.darkbutton} p-2 border border-dark btn`}
          >
            <svg className="mr-2 mb-1" width="15" height="11" viewBox="0 0 762 515" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_65_68)">
                <path className="svgHover" fillRule="evenodd" clipRule="evenodd" d="M295.113 234.428C274.063 248.493 249.316 256 224 256C190.052 256 157.495 242.514 133.49 218.51C109.486 194.505 96 161.948 96 128C96 102.684 103.507 77.9366 117.572 56.8871C131.637 35.8376 151.628 19.4315 175.017 9.74348C198.405 0.0554619 224.142 -2.47937 248.972 2.45954C273.801 7.39845 296.609 19.5893 314.51 37.4904C332.411 55.3915 344.602 78.1989 349.541 103.029C354.479 127.858 351.945 153.595 342.257 176.984C332.569 200.372 316.162 220.363 295.113 234.428ZM328.1 289.5C322.859 298.816 320.072 309.311 320 320V480C320.077 491.267 323.149 502.311 328.9 512H48C35.2696 512 23.0606 506.943 14.0589 497.941C5.05713 488.939 0 476.73 0 464V422.4C0.00795329 386.757 14.1705 352.577 39.3736 327.374C64.5768 302.171 98.7573 288.008 134.4 288H151.1C173.958 298.541 198.829 304 224 304C249.171 304 274.042 298.541 296.9 288H313.6C316.948 288 320.162 288.448 323.361 288.895C324.94 289.115 326.514 289.335 328.1 289.5ZM608.2 284V208.4C608.2 180.24 631.24 157.2 659.4 157.2C687.56 157.2 710.6 180.24 710.6 208.4H761.8C761.8 151.824 715.976 106 659.4 106C602.824 106 557 151.824 557 208.4V284H378C363.641 284 352 295.641 352 310V489C352 503.359 363.641 515 378 515H633C647.359 515 659 503.359 659 489V310C659 295.641 647.359 284 633 284H608.2ZM506 432C523.673 432 538 417.673 538 400C538 382.327 523.673 368 506 368C488.327 368 474 382.327 474 400C474 417.673 488.327 432 506 432Z" />
              </g>
              <defs>
                <clipPath id="clip0_65_68">
                  <rect className="svgHover" width="762" height="515" />
                </clipPath>
              </defs>
            </svg>
            Unlock
          </button>
        </div>
      </div>
      <div className={`${styles.helperIcon} ${styles.qrCodeWrapper}`}>
        {address ? (
          <Tooltip
            className={styles.tooltipWrapper}
            position="bottom"
            size="s"
            title="Scan address"
            content={<Icon name="qrCode" className={styles.qrCodeIcon} />}
          >
            <QRCode value={address} size={154} />
          </Tooltip>
        ) : (
          <Tooltip
            className={styles.tooltipWrapper}
            position="bottom"
            size="maxContent"
            content={
              <DialogLink component="request">
                <Icon name="qrCode" className={styles.qrCodeIcon} />
              </DialogLink>
            }
          >
            <p>{`Request PHAE`}</p>
          </Tooltip>
        )}
      </div>
      {
        openVoteModal ? (
          <VoteModal show={openVoteModal} modalClosed={sendOpenClose} />
        ) : (
          ""
        )
      }
      {
        openUnvoteModal ? (
          <UnvoteModal show={openUnvoteModal} modalClosed={unvoteOpenClose} />
        ) : (
          ""
        )
      }
      {
        openUnlockModal ? (
          <UnlockModal show={openUnlockModal} modalClosed={unlockOpenClose} />
        ) : (
          ""
        )
      }
      {/* {!address ? (
        <div className={styles.helperIcon}>
          <Tooltip
            className={`${styles.tooltipWrapper} add-bookmark-icon`}
            position="bottom"
            size="maxContent"
            content={
              <DialogLink
                component="addBookmark"
                data={
                  username
                    ? {
                        formAddress: address,
                        label: account.dpos?.delegate?.username,
                        isDelegate: account.summary.isDelegate,
                      }
                    : {
                        formAddress: address,
                        label: bookmark ? bookmark.title : "",
                        isDelegate: account.summary.isDelegate,
                      }
                }
              >
                <BookmarkIcon bookmark={bookmark} />
              </DialogLink>
            }
          >
            <p>
              {bookmark === undefined ? "Add to bookmarks" : "Edit bookmark"}
            </p>
          </Tooltip>
        </div>
      ) : null} */}
      {/* {hwInfo && !isEmpty(hwInfo) && address && (
        <div
          className={`${styles.helperIcon} verify-address ${styles.tooltipWrapper}`}
          onClick={() =>
            getAddress({
              deviceId: hwInfo.deviceId,
              index: hwInfo.derivationIndex,
              showOnDevice: true,
            })
          }
        >
          <Tooltip
            className={styles.tooltipWrapper}
            position="bottom"
            title="Verify address"
            content={
              <Icon
                name="verifyWalletAddress"
                className={styles.hwWalletIcon}
              />
            }
          >
            <span>
              {t("Verify the address in your hardware wallet device.")}
            </span>
          </Tooltip>
        </div>
      )}
      {component && (
        <MultiSignatureButton
          // t={t}
          component={component}
          isMultisignature={isMultisignature}
        />
      )} */}
    </footer >
  );
};

export default ActionBar;
