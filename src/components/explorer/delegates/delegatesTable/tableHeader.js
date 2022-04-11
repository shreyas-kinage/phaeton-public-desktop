/* eslint-disable no-nested-ternary */
import grid from "flexboxgrid/dist/flexboxgrid.css";
import styles from "../delegates.css";

export const getStatusClass = (activeTab) => {
  switch (activeTab) {
    case "active":
      return "hidden";
    case "sanctioned":
      return grid["col-xs"];
    case "watched":
    case "standby":
      return grid["col-xs"];
    default:
      return grid["col-xs"];
  }
};

export const getDelegateWeightClass = (activeTab) => {
  switch (activeTab) {
    case "sanctioned":
      return "hidden";
    case "watched":
      return `${grid["col-xs-3"]} ${styles.voteWeight}`;
    default:
      return `${grid["col-xs-3"]} ${styles.voteWeight}`;
  }
};

export const getDelegateRankClass = (activeTab) => {
  switch (activeTab) {
    case "watched":
      return `${grid["col-xs-2"]} ${styles.rank}`;
    case "standby":
      return `${grid["col-xs-2"]} ${styles.rank}`;
    default:
      return `${grid["col-xs-2"]} ${styles.rank}`;
  }
};

export const getRoundStateClass = (activeTab) => {
  switch (activeTab) {
    case "active":
      return `${grid["col-xs-2"]} ${styles.statusTitle} text-left px-2 ${styles.roundStateHeader}`;
    case "watched":
      return `${grid["col-xs-3"]} ${styles.statusTitle} ${styles.roundStateHeader}`;
    default:
      return `${grid["col-xs-2"]} ${styles.rank}`;
  }
};

export const getForgingTimeClass = (activeTab) => {
  switch (activeTab) {
    case "active":
      return grid["col-xs-3"];
    case "watched":
      return grid["col-xs-2"];
    default:
      return "hidden";
  }
};

export const getDelegateDetailsClass = (activeTab) => {
  switch (activeTab) {
    case "watched":
      return `${grid["col-xs-3"]} ${styles.delegateHeader}`;
    default:
      return `${grid["col-xs-3"]} ${styles.delegateHeader}`;
  }
};

// eslint-disable-next-line complexity
export default (activeTab, changeSort, t) => [
  {
    title: "Rank",
    classList: getDelegateRankClass(activeTab),
  },
  {
    title: "Delegate",
    classList: getDelegateDetailsClass(activeTab),
  },
  {
    title: "Delegate weight",
    classList: getDelegateWeightClass(activeTab),
    tooltip: {
      title: "Delegate weight",
      message: "The total amount of votes received for a delegate.",
      position: "top",
    },
  },

  // {
  //   title: "Forging time",
  //   classList: getForgingTimeClass(activeTab),
  //   sort: {
  //     fn: changeSort,
  //     key: "forgingTime",
  //   },
  // },
  {
    title: "State",
    classList: getRoundStateClass(activeTab),
  },
  {
    title: "Nonce",
    classList: `${grid["col-xs-2"]} px-2`,
  },
];
