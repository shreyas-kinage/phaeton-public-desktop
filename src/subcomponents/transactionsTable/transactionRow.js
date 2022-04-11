import React, { useState } from "react";
import grid from "flexboxgrid/dist/flexboxgrid.css";
import { getTxAmount } from "@utils/transaction";
import { DateFromTimestamp } from "@tools/timestamp";
import PhaeAmount from "../phaeAmount";
import AccountVisualWithAddress from "../accountVisualWithAddress";
import TransactionsModal from "@modals/transactionsModal";
import { getModuleAssetTitle } from "@utils/moduleAssets";
import styles from "./transactionsTable.css";
import { getPrefix } from "@utils/phae";

const TransactionRow = ({ data, className, address }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const prefix = getPrefix();
  const handleClick = () => {
    setOpen(true);
    setIsLoading(false);
  };

  const openClose = () => {
    setOpen(!open);
  };

  return (
    <>
      <div
        className={`${grid.row} ${className}`}
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      >
        <span className={grid["col-xs-2"]}>
          {data?.asset?.votes && data?.asset?.votes[0]?.amount < 0
            ? <>
              <div className="text-white">
                <i className={`fas fa-user-times pl-1 fa-lg pr-2`} />
              </div>
              <div className="textbox d-flex align-items-center">
                Unvote
              </div>
            </>
            : getModuleAssetTitle(data.moduleAssetId)[0] == "Unlock"
              ? <>
                <div className="text-white">
                  <svg className="" width="26" height="26" viewBox="0 0 762 515" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_65_68)">
                      <path fillRule="evenodd" clipRule="evenodd" d="M295.113 234.428C274.063 248.493 249.316 256 224 256C190.052 256 157.495 242.514 133.49 218.51C109.486 194.505 96 161.948 96 128C96 102.684 103.507 77.9366 117.572 56.8871C131.637 35.8376 151.628 19.4315 175.017 9.74348C198.405 0.0554619 224.142 -2.47937 248.972 2.45954C273.801 7.39845 296.609 19.5893 314.51 37.4904C332.411 55.3915 344.602 78.1989 349.541 103.029C354.479 127.858 351.945 153.595 342.257 176.984C332.569 200.372 316.162 220.363 295.113 234.428ZM328.1 289.5C322.859 298.816 320.072 309.311 320 320V480C320.077 491.267 323.149 502.311 328.9 512H48C35.2696 512 23.0606 506.943 14.0589 497.941C5.05713 488.939 0 476.73 0 464V422.4C0.00795329 386.757 14.1705 352.577 39.3736 327.374C64.5768 302.171 98.7573 288.008 134.4 288H151.1C173.958 298.541 198.829 304 224 304C249.171 304 274.042 298.541 296.9 288H313.6C316.948 288 320.162 288.448 323.361 288.895C324.94 289.115 326.514 289.335 328.1 289.5ZM608.2 284V208.4C608.2 180.24 631.24 157.2 659.4 157.2C687.56 157.2 710.6 180.24 710.6 208.4H761.8C761.8 151.824 715.976 106 659.4 106C602.824 106 557 151.824 557 208.4V284H378C363.641 284 352 295.641 352 310V489C352 503.359 363.641 515 378 515H633C647.359 515 659 503.359 659 489V310C659 295.641 647.359 284 633 284H608.2ZM506 432C523.673 432 538 417.673 538 400C538 382.327 523.673 368 506 368C488.327 368 474 382.327 474 400C474 417.673 488.327 432 506 432Z" fill="white" />
                    </g>
                    <defs>
                      <clipPath id="clip0_65_68">
                        <rect width="762" height="515" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <div className="textbox d-flex align-items-center pl-2">
                  {getModuleAssetTitle(data.moduleAssetId)[0]}
                </div>
              </>
              :
              <>
                <div className="text-white">
                  <i className={`${getModuleAssetTitle(data.moduleAssetId)[1]} fa-lg pr-2`} />
                </div>
                <div className="textbox d-flex align-items-center">
                  {getModuleAssetTitle(data.moduleAssetId)[0] == "Send"
                    ? "Token Transfer"
                    : getModuleAssetTitle(data.moduleAssetId)[0]}
                </div>
              </>}

        </span>
        <span className={grid["col-xs-2"]}>
          <AccountVisualWithAddress
            address={data.id}
            transactionSubject="sender"
            moduleAssetId={data.moduleAssetId}
          />
        </span>
        <span className={grid["col-xs-2"]}>
          <AccountVisualWithAddress
            address={data.sender.address}
            transactionSubject="sender"
            moduleAssetId={data.moduleAssetId}
            showBookmarkedAddress
          />
        </span>
        <span className={grid["col-xs-2"]}>
          <AccountVisualWithAddress
            address={data.asset.recipient?.address}
            transactionSubject="recipient"
            moduleAssetId={data.moduleAssetId}
            showBookmarkedAddress
          />
        </span>
        <span className={grid["col-xs-1"]}>
          <DateFromTimestamp time={data.block.timestamp} token={prefix} />
        </span>
        <span className={`${grid["col-xs-1"]} ${styles.amount}`}>
          {getTxAmount(data) != undefined ? (
            <PhaeAmount val={getTxAmount(data)} token={prefix} />
          ) : (
            "-"
          )}
        </span>
        <span className={`${grid["col-xs-1"]}`}>
          <PhaeAmount val={data?.fee} token={prefix} />
        </span>
        <span className={grid["col-xs-1"]}>
          <i className={data.isPending ? "far fa-clock" : "far fa-check"} />
        </span>
      </div>
      {open ? (
        <TransactionsModal
          isExplorer
          data={data}
          open={open}
          details={address}
          openClose={openClose}
          isLoading={isLoading}
        />
      ) : (
        ""
      )}
    </>
  );
};

/* istanbul ignore next */
const areEqual = (prevProps, nextProps) =>
  prevProps.data.id === nextProps.data.id &&
  prevProps.currentBlockHeight === nextProps.currentBlockHeight;

export default React.memo(TransactionRow, areEqual);
