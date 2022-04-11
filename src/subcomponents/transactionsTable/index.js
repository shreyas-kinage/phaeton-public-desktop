import React from "react";
import Box from "@tools/box";
import BoxContent from "@tools/box/content";
import Table from "@tools/table";
import styles from "./transactionsTable.css";
import TransactionRow from "./transactionRow";
import header from "./tableHeader";

const TransactionsTable = ({
  transactions,
  isLoading,
  canLoadMore,
  emptyState,
  loadMore,
  address,
}) => {

  return (
    <div style={{ width: "95%", margin: "auto" }}>
      <Box main isLoading={isLoading} className="transactions-box">
        <BoxContent className={styles.content}>
          <Table
            address={address}
            data={transactions}
            isLoading={isLoading}
            row={TransactionRow}
            loadData={loadMore}
            header={header}
            canLoadMore={canLoadMore}
            error={transactions && transactions.error ? transactions.error : ""}
            emptyState={emptyState}
          />
        </BoxContent>
      </Box>
    </div>
  );
};

export default TransactionsTable;
