import React from "react";
import { truncateAddress } from "@utils/account";
import Tooltip from "@tools/tooltip/tooltip";
import Icon from "@tools/icon";
import CopyToClipboard from "@tools/copyToClipboard";
import AccountVisual from "@tools/accountVisual";
import {
  getDelegateDetailsClass,
  getStatusClass,
  getDelegateWeightClass,
  getRoundStateClass,
  getForgingTimeClass,
  getDelegateRankClass,
} from "./tableHeader";
import styles from "../delegates.css";

const roundStates = {
  forging: "Forging",
  awaitingSlot: "Awaiting slot",
  missedBlock: "Missed slot",
};

const icons = {
  forging: "delegateForged",
  awaitingSlot: "delegateAwaiting",
  missedBlock: "delegateMissed",
};

const delegateStatus = {
  active: "Active",
  standby: "Standby",
  banned: "Banned",
  punished: "Punished",
  nonEligible: "Ineligible",
};

export const DelegateRank = ({ data, activeTab }) => (
  <span className={getDelegateRankClass(activeTab)}>
    <span>{data.dpos.delegate.rank}</span>
  </span>
);

export const DelegateWeight = ({ value, activeTab }) => {

  return (
    <span className={getDelegateWeightClass(activeTab)}>
      <span>{formatted}</span>
    </span>
  );
};

export const DelegateDetails = ({
  data,
  activeTab,
}) => {

  return (
    <span className={getDelegateDetailsClass(activeTab)}>
      <div className={styles.delegateColumn}>
        <div className={`${styles.delegateDetails}`}>
          <AccountVisual address={data.address} />
          <div>
            <p className={`${styles.delegateName} text-white`}>
              {data.summary.username}
            </p>
            <p className={styles.delegateAddress}>
              < CopyToClipboard
                text={truncateAddress(data.summary.address)}
                value={data.summary.address}
                className="tx-id"
              />
            </p>
          </div>
        </div>
      </div>
    </span>
  );
};

export const RoundState = ({ activeTab, state, isBanned, t, time }) => {
  // if (activeTab === 'active') console.log('lastBlock', lastBlock);
  if (state === undefined) {
    return (
      <span
        className={`${getRoundStateClass(activeTab)} ${styles.noEllipsis} ${styles.statusIconsContainer
          }`}
      >
        -
      </span>
    );
  }

  return (
    <span
      className={`${getRoundStateClass(activeTab)} ${styles.noEllipsis} ${styles.statusIconsContainer
        }`}
    >
      <Tooltip
        title={t("Round state:")}
        position="left"
        size="maxContent"
        content={<Icon className={styles.statusIcon} name={icons[state]} />}
      >
        <p className={styles.statusToolip}>{roundStates[state]}</p>
      </Tooltip>
      {isBanned && (
        <Tooltip
          position="left"
          size="maxContent"
          content={
            <Icon className={styles.statusIcon} name="delegateWarning" />
          }
          footer={<p>{time}</p>}
        >
          <p>{t("This delegate will be punished in upcoming rounds")}</p>
        </Tooltip>
      )}
    </span>
  );
};

export const DelegateStatus = ({ activeTab, status, totalVotesReceived }) => {
  const statusKey = totalVotesReceived < 1e11 ? "nonEligible" : status;
  return (
    <span className={getStatusClass(activeTab)}>
      <span className={`${styles.delegateStatus} ${styles[statusKey]}`}>
        {delegateStatus[statusKey]}
      </span>
    </span>
  );
};

export const ForgingTime = ({ activeTab, time, state }) => (
  <span className={getForgingTimeClass(activeTab)}>
    {state === "missedBlock" ? "-" : time}
  </span>
);
