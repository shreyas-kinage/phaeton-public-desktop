import React, { useState } from "react";
import AccountVisual from "@tools/accountVisual";
import Box from "@tools/box";
import BoxContent from "@tools/box/content";
import Icon from "@tools/icon";
import styles from "./accountInfo.css";
import Identity from "./identity";
import ActionBar from "./actionBar";

const AccountInfo = ({
  address,
  activeToken,
  account,
  username,
  isMultisignature,
}) => {
  const [showFullAddress, setShowFullAddress] = useState(false);
  const onClick = () => setShowFullAddress(!showFullAddress);

  return (
    <Box className={styles.wrapper}>
      <BoxContent className={`${styles.content} ${styles[activeToken]}`}>
        <h2 className={styles.title}>Wallet address</h2>
        <div
          className={`${styles.info} ${showFullAddress ? styles.showFullAddress : ""
            }`}
        >
          <AccountVisual address={address} size={40} />
          {address ? (
            <Identity
              newAddress={address}
              username={username ? username : "-"}
              showLegacy={showFullAddress}
              setShowLegacy={onClick}
            />
          ) : null}
        </div>
        <Icon
          name={activeToken === "PHAE" ? "phaetLogo" : "phaetLogo"}
          className={styles.watermarkLogo}
        />
        <ActionBar
          address={address}
          activeToken={activeToken}
          username={username ? username : "-"}
          account={account}
          isMultisignature={isMultisignature}
        />
      </BoxContent>
    </Box>
  );
};

export default AccountInfo;
