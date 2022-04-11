import React, { useEffect, useState } from "react";
import http from "@utils/http";
import AccountInfo from "@components/wallet/overview/accountInfo";
import TransactionsTable from "@subcomponents/transactionsTable";
import { exactPath } from "@utils/getNetwork";
import { apiV2 } from "@constants/networks";
import _ from "lodash";
import { getPrefix } from "@utils/phae";
import LoadingScreen from "@subcomponents/loadingScreen/loadingScreen";
import NavSimple from "@subcomponents/navigationBars/navBar/NavSimple";

const AccountDetails = (props) => {
  const [accountDetails, setAccountDetails] = useState([]);
  const [transactionData, setTransactionData] = useState([]);
  const [paginatedTransaction, setPaginatedTransaction] = useState([]);
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [pageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [loadMore, setLoadMore] = useState(false);
  const [loadLess, setLoadLess] = useState(false);
  const prefix = getPrefix();
  const activeToken = prefix;
  const account = accountDetails;

  const search = props.location.search;
  const params = new URLSearchParams(search);
  const address = params.get('address');

  const payload = {
    address: address,
  };

  const basePath = exactPath();

  const fetchAccounts = async () => {
    const accounts = await http({
      path: "accounts",
      baseUrl: `${basePath}${apiV2}`,
      params: payload,
    });
    setAccountDetails(accounts?.data[0]);
  };

  const fetchTransaction = async (page, pay) => {
    const payload = {
      address: address,
      limit: 100,
    };
    setIsLoading(true);
    const response = await http({
      path: "transactions",
      baseUrl: `${basePath}${apiV2}`,
      params: pay ? pay : payload,
    });
    setPages(
      _.range(
        page ? page : 1,
        page
          ? (response?.data ? Math.ceil(response?.data.length) / pageSize : 0) +
          page
          : (response?.data ? Math.ceil(response?.data.length) / pageSize : 0) +
          1
      )
    );
    if (response?.meta?.total > 10) {
      setTransactionData(response);
      setPaginatedTransaction(_(response.data).slice(0).take(pageSize).value());
      setIsLoading(false);
      setLoadMore(false);
      setLoadLess(false);
    } else {
      setTransactionData(response);
      setPaginatedTransaction(response?.data);
      setLoadMore(false);
      setLoadLess(false);
      setIsLoading(false);
    }
  };

  const loadMoreData = () => {
    setLoadMore(true);
    const endData =
      transactionData.meta.count + transactionData.meta.offset ==
      transactionData.meta.total;
    const newPage = pages[pages.length - 1] + 1;
    setOffset(offset + 100);
    setCurrentPage(newPage);
    const pay = {
      address: address,
      limit: 100,
      offset: endData ? 0 : offset + 100,
    };
    fetchTransaction(newPage, pay);
  };

  const handeGoBack = () => {
    setLoadLess(true);
    let oldpage = pages[0] - 10;
    setCurrentPage(oldpage);
    setOffset(offset - 100);
    const pay = {
      address: address,
      limit: 100,
      offset: offset >= 100 ? offset - 100 : offset < 0 ? 0 : 0,
    };
    fetchTransaction(oldpage, pay);
  };

  const pagination = (pageNo) => {
    setCurrentPage(pageNo);
    const startIndex = pageNo * pageSize;
    const page = (startIndex % 100) / 10;
    const newIndex = (page - 1) * pageSize;
    const transPage = _(transactionData.data)
      .slice(newIndex)
      .take(pageSize)
      .value();
    setPaginatedTransaction(transPage);
  };

  const goBack = () => {
    setTimeout(function () {
      window.location.reload();
    }, 500);
    window.history.go(-1);
  };

  useEffect(() => {
    fetchAccounts();
    fetchTransaction();
  }, []);

  return (
    <>
      {isLoading ?
        <LoadingScreen />
        : ""}
      <NavSimple />
      <div className="m-auto p-4">
        <AccountInfo
          activeToken={activeToken}
          address={accountDetails?.summary?.address}
          username={accountDetails?.summary?.username}
          publicKey={accountDetails?.summary?.publicKey}
          // host={host}
          account={account}
          isMultisignature={false}
        />
      </div>
      <h5 className="text-white pl-lg-4">
        <i
          title="Back"
          className="far fa-arrow-alt-circle-left fa-lg p-2 ml-2"
          style={{ cursor: "pointer" }}
          onClick={goBack}
        />
        All Transactions
      </h5>
      <div
        className={
          paginatedTransaction && paginatedTransaction[0] ? "" : "pb-3"
        }
      >
        <TransactionsTable
          isLoading={isLoading}
          transactions={paginatedTransaction}
          address={accountDetails}
          emptyState={{
            message: "There are no transactions for this address.",
          }}
        />
      </div>
      {paginatedTransaction && paginatedTransaction[0] ? (
        <nav className="d-flex py-2 justify-content-center">
          <ul className="pagination m-0">
            <li className="page-item mr-2">
              <p
                // disabled={currentPage == pages[0]}
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

            {transactionData?.meta?.offset != 0 && currentPage > 10 ? (
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

            {transactionData.meta &&
              transactionData.meta.count + transactionData.meta.offset ==
              transactionData.meta.total ? (
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
      ) : (
        ""
      )}
    </>
  );
};

export default AccountDetails;
