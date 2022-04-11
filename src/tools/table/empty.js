import React from "react";
import { isReactComponent } from "@utils/helpers";
import styles from "../box/emptyState.css";

const Empty = ({ isListEmpty, isLoading, data, error, className }) => {
  // if (isLoading || !isListEmpty || (error && error.message !== "Not found."))
  //   return null;
  // if (isReactComponent(data)) {
  //   const Element = data;
  //   return <Element />;
  // }
  // if (isLoading) {
  //   return null;
  // }
  // if (!isListEmpty) {
  //   return null;
  // }

  if (isListEmpty) {
    if(!isLoading)
    return (
      <div className={`${styles.wrapper} ${className} empty-state`}>
      {/* <h3 className="text-white">{data?.message ?? "Nothing found."}</h3> */}
        <h3 className="text-white">{error?.message ?? "Nothing found."}</h3>
       </div>
    );
  }
 return null;
};

export default Empty;
