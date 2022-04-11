import React from "react";
import styles from "./table.css";
import Header from "./header";

const getUniqueKey = (data, index, key) => {
  if (typeof key === "string" && !/\./.test(key)) {
    return `table-row-${data[key]}-${index}`;
  }
  if (typeof key === "function") {
    return `table-row-${key(data)}`;
  }
  return `table-row-${index}`;
};

const List = ({
  data,
  header,
  currentSort,
  iterationKey,
  Row,
  error,
  additionalRowProps,
  address,
}) => {
  if (data.length === 0 || error) return null;
  return (
    <>
      <Header data={header} currentSort={currentSort} />
      {data.length > 0
        ? data?.map((item, index) => (
          <Row
            key={getUniqueKey(item, index, iterationKey)}
            data={item}
            address={address}
            className={styles.row}
            {...additionalRowProps}
          />
        ))
        : ""}
    </>
  );
};

export default List;
