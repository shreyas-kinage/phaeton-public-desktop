import React from "react";
import grid from "flexboxgrid/dist/flexboxgrid.css";
import AccountVisualWithAddress from "@subcomponents/accountVisualWithAddress";
import { kFormatter } from "@utils/helpers";
import { getPrefix } from "@utils/phae";

const VotingRow = ({ data, className }) => {
  const prefix = getPrefix();

  return (
    <>
      <div className={`${grid.row} ${className}`} style={{ cursor: "pointer" }}>
        <span className={grid["col-xs-4"]}>
          <div className="d-flex text-white">
            <AccountVisualWithAddress
              address={data.address}
              transactionSubject="sender"
              moduleAssetId={data.moduleAssetId}
            />
          </div>
        </span>
        <span className={grid["col-xs-4"]}>{data.username}</span>
        <span className={grid["col-xs-4"]}>
          {kFormatter(data.amount && data.amount / 10 ** 8)} {prefix}
        </span>
      </div>
    </>
  );
};

export default React.memo(VotingRow);
