import React from "react";
import Table from "@tools/table";
import DelegateRow from "./delegateRow";
import header from "./tableHeader";

const TableWrapper = ({
  delegates,
  activeTab,
  canLoadMore,
  loadMore,
  setActiveTab,
  isLoading,
}) => (
  <Table
    data={delegates}
    isLoading={isLoading}
    row={DelegateRow}
    loadData={loadMore}
    additionalRowProps={{
      activeTab,
      setActiveTab,
    }}
    header={header(activeTab)}
    canLoadMore={canLoadMore}
  />
);

const filterDelegates = (delegates, filters) => ({
  ...delegates,
});

const selectDelegates = ({
  activeTab,
  delegates,
  standByDelegates,
  sanctionedDelegates,
  watchedDelegates,
}) => {
  switch (activeTab) {
    case "active":
      return filterDelegates(delegates);

    case "standby":
      return filterDelegates(standByDelegates);

    case "sanctioned":
      return filterDelegates(sanctionedDelegates);

    case "watched":
      return filterDelegates(watchedDelegates, {
        search: "",
      });

    default:
      return undefined;
  }
};

const DelegatesTable = ({
  setActiveTab,
  delegates,
  watchedDelegates,
  standByDelegates,
  sanctionedDelegates,
  activeTab,
  loadMore,
  isLoading,
}) => {
  const delegatesToShow = selectDelegates({
    activeTab,
    delegates,
    standByDelegates,
    sanctionedDelegates,
    watchedDelegates,
  });

  const canLoadMore =
    delegates?.meta?.count == delegates?.meta?.total ? false : true;

  const handleLoadMore = () => {
    delegatesToShow.loadData(
      Object.keys(filters).reduce(
        (acc, key) => ({
          ...acc,
          ...(filters[key] && { [key]: filters[key] }),
        }),
        {
          offset: delegatesToShow.meta.count + delegatesToShow.meta.offset,
        }
      )
    );
  };

  return (
    <TableWrapper
      isLoading={isLoading}
      delegates={delegates}
      setActiveTab={setActiveTab}
      handleLoadMore={handleLoadMore}
      activeTab={activeTab}
      loadMore={loadMore}
      canLoadMore={canLoadMore}
    />
  );
};

export default DelegatesTable;
