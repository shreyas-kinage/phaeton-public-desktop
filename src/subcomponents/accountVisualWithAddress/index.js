import React from "react";
import PropTypes from "prop-types";
import CopyToClipboard from "@tools/copyToClipboard";
import { MODULE_ASSETS_NAME_ID_MAP, MODULE_ASSETS_MAP } from "@constants";
import { truncateAddress } from "@utils/account";
import { getModuleAssetTitle } from "@utils/moduleAssets";
import Icon from "@tools/icon";
import AccountVisual from "@tools/accountVisual";
import styles from "./accountVisualWithAddress.css";

class AccountVisualWithAddress extends React.Component {
  getTransformedAddress(address) {
    const { bookmarks, showBookmarkedAddress } = this.props;

    return address;
  }
  render() {
    const { address, transactionSubject, moduleAssetId, size, truncate } =
      this.props;
    const title = getModuleAssetTitle(moduleAssetId)[0];
    const transformedAddress = this.getTransformedAddress(address);
    const truncatedAddress =
      truncate === "small" || truncate === "medium"
        ? truncateAddress(transformedAddress, truncate)
        : truncateAddress(transformedAddress);

    return (
      <div className={`${styles.address}`}>
        {moduleAssetId !== MODULE_ASSETS_NAME_ID_MAP.transfer &&
          transactionSubject === "recipient" ? (
          <>
            <Icon
              icon={true}
              className={styles.txIcon}
              name={MODULE_ASSETS_MAP[moduleAssetId].icon || "txDefault"}
            />
            <span className={styles.addressValue}>

              {address ? address : "-"}
            </span>
          </>
        ) : (
          <>
            <AccountVisual address={address} size={size} />
            <span className={`${styles.addressValue}`}>

              {truncate ? <CopyToClipboard
                text={truncatedAddress}
                value={address}
                className="tx-id"
              /> :
                < CopyToClipboard
                  text={truncatedAddress}
                  value={transformedAddress}
                  className="tx-id"
                />}
            </span>
          </>
        )}
      </div>
    );
  }
}

AccountVisualWithAddress.propTypes = {
  address: PropTypes.string.isRequired,
  size: PropTypes.number,
  transactionSubject: PropTypes.string,
  moduleAssetId: PropTypes.string,
};

AccountVisualWithAddress.defaultProps = {
  address: "",
  showBookmarkedAddress: false,
  size: 32,
  transactionSubject: "",
  truncate: true,
};

const mapStateToProps = (state) => ({
  bookmarks: state.bookmarks,
});

export default AccountVisualWithAddress;
