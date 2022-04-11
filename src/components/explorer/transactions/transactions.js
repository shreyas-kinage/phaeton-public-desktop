import React, { useState, useEffect } from "react";
import TransactionsTable from "@subcomponents/transactionsTable";
import SearchBar from "@subcomponents/search";
import Nav from "@subcomponents/navigationBars/navBar/Nav";
import http from "@utils/http";
import { exactPath } from "@utils/getNetwork";
import { apiV2 } from "@constants/networks";
import _ from "lodash";
import LoadingScreen from "@subcomponents/loadingScreen/loadingScreen";

const Transactions = () => {
  const filters = {
    dateFrom: "",
    dateTo: "",
    amountFrom: "",
    amountTo: "",
    moduleAssetId: "",
    height: "",
    recipient: "",
    address: "",
  };

  const [tableData, setTableData] = useState([]);
  const [loadMore, setLoadMore] = useState(false);
  const [loadLess, setLoadLess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pageSize] = useState(10);
  const [offset, setOffset] = useState(0);
  const [open, setOpen] = useState(false);
  const [paginatedTransaction, setPaginatedTransaction] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState(1);

  const basePath = exactPath();

  const loadMoreData = () => {
    setLoadMore(true);
    const endData =
      tableData.meta.count + tableData.meta.offset == tableData.meta.total;
    const newPage = pages[pages.length - 1] + 1;
    setOffset(offset + 100);
    setCurrentPage(newPage);
    const pay = {
      limit: 100,
      offset: endData ? 0 : offset + 100,
    };
    fetchData(newPage, pay);
  };

  const handeGoBack = () => {
    setLoadLess(true);
    let oldpage = pages[0] - 10;
    setCurrentPage(oldpage);
    setOffset(offset - 100);
    const pay = {
      limit: 100,
      offset: offset >= 100 ? offset - 100 : offset < 0 ? 0 : 0,
    };
    fetchData(oldpage, pay);
  };

  const fetchData = async (page, pay) => {
    setIsLoading(true);
    const payload = {
      limit: 100,
    };
    const response = await http({
      path: "transactions",
      baseUrl: `${basePath}${apiV2}`,
      params: pay ? pay : payload,
    });
    setPages(
      _.range(
        page ? page : 1,
        page
          ? (response.data ? Math.ceil(response.data.length) / pageSize : 0) +
          page
          : (response.data ? Math.ceil(response.data.length) / pageSize : 0) + 1
      )
    );
    setTableData(response);
    setPaginatedTransaction(_(response.data).slice(0).take(pageSize).value());
    setLoadMore(false);
    setLoadLess(false);
    setIsLoading(false);
  };

  const pagination = (pageNo) => {
    setCurrentPage(pageNo);
    const startIndex = pageNo * pageSize;
    const page = (startIndex % 100) / 10;
    const newIndex = (page - 1) * pageSize;
    const transPage = _(tableData.data).slice(newIndex).take(pageSize).value();
    setPaginatedTransaction(transPage);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {isLoading ?
        <LoadingScreen />
        : ""}
      <Nav />
      <div
        className="d-flex direction-row m-auto py-3 row m-0"
        style={{ width: "95%" }}
      >
        <h1
          className="text-white pt-2 col-3 p-0"
          style={{
            fontFamily: "var(--heading-font)",
            fontSize: "18px",
            fontWeight: "var(--font-weight-bold)",
            letterSpacing: "0",
            lineHeight: "25px",
            margin: "0",
            padding: "0",
          }}
        >
          All Transactions
        </h1>
        <SearchBar />
      </div>
      <TransactionsTable
        isLoadMoreEnabled
        filters={filters}
        isLoading={isLoading}
        transactions={paginatedTransaction}
      />
      {!isLoading &&
        <nav className="d-flex py-2 justify-content-center">
          <ul className="pagination m-0">
            <li className="page-item mr-2">
              <p
                disabled={currentPage == pages[0]}
                className={
                  currentPage == pages[0]
                    ? "page-link m-0 text-secondary bg-dark border border-dark"
                    : "page-link m-0 text-white bg-dark border border-dark"
                }
                onClick={() => pagination(pages[0])}
                style={{
                  cursor: "pointer",
                }}
              >
                First
              </p>
            </li>

            <li className="page-item mr-2">
              <i
                disabled={currentPage == pages[0]}
                className={
                  currentPage == pages[0]
                    ? "page-link fas fa-chevron-left m-0 text-secondary bg-dark border border-dark"
                    : "page-link fas fa-chevron-left m-0 text-white bg-dark border border-dark"
                }
                style={{
                  padding: "9.5px",
                  cursor: "pointer",
                }}
                onClick={() =>
                  currentPage == pages[0]
                    ? handeGoBack
                    : pagination(currentPage - 1)
                }
              />
            </li>

            {tableData?.meta?.offset != 0 && currentPage > 10 ? (
              <li className={loadLess ? "d-none" : "page-item"} id="prev-data">
                <p
                  className={
                    currentPage == pages.length
                      ? "page-link m-0 text-secondary bg-dark border border-dark"
                      : "page-link m-0 text-white bg-dark border border-dark"
                  }
                  style={{
                    cursor: "pointer",
                  }}
                  disabled={open}
                  onClick={handeGoBack}
                >
                  ..
                </p>
              </li>
            ) : (
              ""
            )}

            {pages && pages.length > 0
              ? pages.map((page) => (
                <li
                  key={page}
                  className={
                    page === currentPage ? "page-item active" : "page-item"
                  }
                >
                  <p
                    className={
                      page === currentPage
                        ? "page-link m-0 text-white bg-secondary border border-secondary"
                        : "page-link m-0 text-white bg-dark border border-dark"
                    }
                    style={{ cursor: "pointer" }}
                    onClick={() => pagination(page)}
                  >
                    {page}
                  </p>
                </li>
              ))
              : ""}

            {tableData.meta &&
              tableData.meta.count + tableData.meta.offset ==
              tableData.meta.total ? (
              ""
            ) : (
              <li className={loadMore ? "d-none" : "page-item"} id="next-data">
                <p
                  className={
                    "page-link m-0 text-white bg-dark border border-dark"
                  }
                  style={{
                    cursor: "pointer",
                  }}
                  disabled={open}
                  onClick={loadMoreData}
                >
                  ..
                </p>
              </li>
            )}

            <li className="page-item ml-2">
              <i
                className={
                  currentPage == pages[pages.length - 1]
                    ? "page-link fas fa-chevron-right m-0 text-secondary bg-dark border border-dark"
                    : "page-link fas fa-chevron-right m-0 text-white bg-dark border border-dark"
                }
                style={{
                  padding: "9.5px",
                  cursor: "pointer",
                }}
                disabled={currentPage == pages[pages.length - 1]}
                onClick={() =>
                  currentPage == pages[pages.length - 1]
                    ? undefined
                    : pagination(currentPage + 1)
                }
              />
            </li>

            <li className="page-item ml-2">
              <p
                disabled={currentPage == pages[pages.length - 1]}
                className={
                  currentPage == pages[pages.length - 1]
                    ? "page-link m-0 text-secondary bg-dark border border-dark"
                    : "page-link m-0 text-white bg-dark border border-dark"
                }
                onClick={() => pagination(pages[pages.length - 1])}
                style={{
                  cursor: "pointer",
                }}
              >
                Last
              </p>
            </li>
          </ul>
        </nav>
      }
    </div>
  );
};

export default Transactions;
