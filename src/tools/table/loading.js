import React from "react";
import { isReactComponent } from "@utils/helpers";
import styles from "./table.css";

const Loading = ({ Element, headerInfo, isLoading }) => {
  if (!isLoading) return null;
  return isReactComponent(Element) ? (
    <Element />
  ) : (
    <div className={styles.loadingRow}>
      {headerInfo && headerInfo.length > 0
        ? headerInfo.map((column, index) => (
            <div
              key={`table-loading-row-${index}`}
              className={`${column.classList} ${styles.loadingColumn}`}
            />
          ))
        : ""}
    </div>
  );
};

export default Loading;
