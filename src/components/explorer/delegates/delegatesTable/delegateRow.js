import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { kFormatter } from "@utils/helpers";
// import { useDispatch } from "react-redux";
import { routes } from "@constants";
import grid from "flexboxgrid/dist/flexboxgrid.css";
import styles from "../delegates.css";
import { DelegateDetails, ForgingTime, DelegateRank } from "./dataColumns";
import { getPrefix } from "@utils/phae";



const DelegateRow = ({ data, className, activeTab, setActiveTab }) => {
  const [page, setPage] = useState("");
  const prefix = getPrefix();
  useEffect(() => {
    setPage(window.location.hash.substr(2));
  }, []);

  const onClickHandle = () => {
    window.location.href = `#${routes.account.path}?address=${data.summary.address}`
  }

  return (
    <div
      className={`${className} delegate-row ${styles.tableRow}`}
      style={{ cursor: "pointer" }}
      onClick={onClickHandle}
    >
      <DelegateRank data={data} activeTab={activeTab} />
      <DelegateDetails data={data} activeTab={activeTab} />
      <span className={`${grid["col-xs-3"]}`}>
        {kFormatter(data?.dpos?.delegate?.totalVotesReceived / 10 ** 8, 2)} {prefix}
      </span>
      {activeTab === "active" || activeTab === "watched" ? (
        <>
          {/* <ForgingTime
            state={data.state}
            time={formattedForgingTime}
            activeTab={activeTab}
          /> */}
        </>
      ) : null}
      <span className={`${grid["col-xs-2"]} text-capitalize text-left`}>
        {data.dpos.delegate.status}
      </span>
      <span className={`${grid["col-xs-2"]} text-left px-2`}>{data.sequence.nonce}</span>
    </div>
  );
};

export default React.memo(DelegateRow);
