import React, { useEffect, useState } from "react";
import Box from "@tools/box";
import BoxHeader from "@tools/box/header";
import BoxContent from "@tools/box/content";
import Table from "@tools/table";
import styles from "./blocks.css";
import SearchBar from "@subcomponents/search";
import BlockRow from "./blockRow";
import header from "./tableHeader";
import http from "@utils/http";
import Nav from "@subcomponents/navigationBars/navBar/Nav";
import { exactPath } from "@utils/getNetwork";
import LoadingScreen from "@subcomponents/loadingScreen/loadingScreen";
import { apiV2 } from "@constants/networks";

const Blocks = ({ filters, clearFilter, clearAllFilters }) => {
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadMore, setLoadMore] = useState(false);
  const [loadLess, setLoadLess] = useState(false);
  const [pageSize] = useState(10);
  const [offset, setOffset] = useState(0);
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
      path: "blocks",
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
    setPaginatedTransaction(_(response.data).slice(0).take(pageSize).value());
    setTableData(response);
    setIsLoading(false);
    setLoadMore(false);
    setLoadLess(false);
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
    <>
      {isLoading ?
        <LoadingScreen />
        : ""}
      <Nav />
      <div style={{ width: "95%", margin: "auto" }}>
        <Box isLoading={isLoading} width="full" main>
          <BoxHeader>
            <h2 className="blocks-header-title text-white">{"All blocks"}</h2>
            <SearchBar />
          </BoxHeader>
          <BoxContent className={styles.content}>
            <Table
              data={paginatedTransaction}
              isLoading={isLoading}
              row={BlockRow}
              // loadData={updateLimit}
              header={header}
              // currentSort={sort}
              // canLoadMore={canLoadMore}
              error={tableData && tableData.error ? tableData.error : ""}
            />
          </BoxContent>
        </Box>
        {!isLoading &&
          <nav className="d-flex justify-content-center">
            <ul className="pagination">
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
                      ? undefined
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
                          ? "page-link text-white bg-secondary border border-secondary"
                          : "page-link text-white bg-dark border border-dark"
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
    </>
  );
};


export default Blocks;
