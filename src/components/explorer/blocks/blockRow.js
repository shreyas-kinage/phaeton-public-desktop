import React from "react";
import grid from "flexboxgrid/dist/flexboxgrid.css";
import { routes } from "@constants";
import CopyToClipboard from "@tools/copyToClipboard";
import { DateFromTimestamp } from "@tools/timestamp";
import { truncateAddress } from "@utils/account";
import PhaeAmount from "@subcomponents/phaeAmount";
import styles from "./blocks.css";
import { getPrefix } from "@utils/phae";

const BlockRow = ({ data, className }) => {
  const prefix = getPrefix();
  const onClickHandle = () => {
    window.location.href = `#${routes.blockByID.path}?id=${data.id}`
  }
  return (
    <div
      className={`${grid.row} ${className} ${styles.tableRow}`}
      style={{ cursor: "pointer" }}
      onClick={onClickHandle}
    >
      <span className={grid["col-xs"]}>
        <CopyToClipboard
          text={truncateAddress(data?.id)}
          value={data?.id}
          className="tx-id"
        />
      </span>
      <span className={grid["col-xs"]}>{data.height}</span>
      <span className={grid["col-xs"]}>
        <DateFromTimestamp time={data.timestamp} token={prefix} />
      </span>
      <span className={grid["col-xs"]}>{data.numberOfTransactions}</span>
      <span className={grid["col-xs-3"]}>{data.generatorUsername}</span>
      <span className={grid["col-xs-2"]}>
        <PhaeAmount val={data.totalForged} token={prefix} />
      </span>
    </div>
  );
};

const areEqual = (prevProps, nextProps) =>
  prevProps.data.id === nextProps.data.id;

export default React.memo(BlockRow, areEqual);
