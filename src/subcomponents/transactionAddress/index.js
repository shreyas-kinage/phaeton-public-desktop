import React from 'react';

import { MODULE_ASSETS_NAME_ID_MAP } from '@constants';
import { getModuleAssetTitle } from '@utils/moduleAssets';
import { truncateAddress } from '@utils/account';
import styles from './transactionAddress.css';

const Address = ({
  bookmark, address, className,
}) => {
  const addressTrunk = address && truncateAddress(address);

  if (bookmark) return (<span>{bookmark.title}</span>);
  return (
    <>
      <span className={`${className} showOnLargeViewPort`}>
        {address.length < 24 ? address : addressTrunk}
      </span>
      <span className={`${className} hideOnLargeViewPort`}>
        {addressTrunk}
      </span>
    </>
  );
};

const TransactionAddress = ({
  address, bookmarks, moduleAssetId, token,
}) => {
  const bookmark = bookmarks[token].find(acc => acc.address === address);

  return (
    <div className={`${styles.wrapper} transaction-address`}>
      {
        moduleAssetId !== MODULE_ASSETS_NAME_ID_MAP.transfer
          ? <span>{getModuleAssetTitle(moduleAssetId)[0]}</span>
          : <Address address={address} bookmark={bookmark} />
      }
      {bookmark && <Address address={address} className={styles.subTitle} />}
    </div>
  );
};

export default TransactionAddress;
