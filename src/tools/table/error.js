import React from "react";
import styles from "../box/emptyState.css";

const Error = ({ data, isLoading }) => {
  if (isLoading || !data || data.message === "Not found.") return null;
  return (
    <div className={`${styles.wrapper} error-state`}>
      <h3>{typeof data === "string" ? data : data.message}</h3>
    </div>
  );
};

export default Error;
