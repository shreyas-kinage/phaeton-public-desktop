import React, { useEffect, useState } from "react";
import { getFromStorage } from "@utils/localJSONStorage";
import { ColouredButton } from "@tools/Button";
import Box from "@tools/box";
import BoxContent from "@tools/box/content";
import RegisterDelegateModal from "@modals/registerDelegateModal";
import Nav from "@subcomponents/navigationBars/navBar/Nav";
import { apiV2 } from "@constants/networks";
import http from "@utils/http";
import VoteModal from "@modals/voteModal";
import UnvoteModal from "@modals/unvoteModal";
import UnlockModal from "@modals/unlockModal";
import Table from "@tools/table";
import { exactPath } from "@utils/getNetwork";
import header from "./tableHeader";
import votingRow from "./votingRow";
import _ from "lodash";
import LoadingScreen from "@subcomponents/loadingScreen/loadingScreen"
import style from "@tools/Button/button.css";
import toastDisplay from "../../app/toast";

function Voting() {
  const [modalOpen, setModalOpen] = useState(false);
  const [voteModal, setVoteModal] = useState(false);
  const [unvoteModal, setUnvoteModal] = useState(false);
  const [unlockModal, setUnlockModal] = useState(false);
  const [delegateModal, setDelegateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadMore, setLoadMore] = useState(false);
  const [loadLess, setLoadLess] = useState(false);
  const [sendPane, setSendPane] = useState(true);
  const [receivePane, setReceivePane] = useState(false);
  const [title, setTitle] = useState("Register Delegate");
  const [sendVotes, setSendVotes] = useState([]);
  const [receivedVotes, setReceivedVotes] = useState([]);
  const [decryptedData, setDecryptedData] = useState([]);
  const [isDelegate, setIsDelegate] = useState();
  // Pagination
  const [pageSize] = useState(10);
  const [offset, setOffset] = useState(0);
  const [paginatedSend, setPaginatedSend] = useState([]);
  const [paginatedReceive, setPaginatedReceive] = useState([]);
  const [currentSend, setCurrentSend] = useState(1);
  const [currentReceived, setCurrentReceived] = useState(1);
  const [receivedPages, setReceivedPages] = useState(1);
  const [sendPages, setSendPages] = useState(1);

  const basePath = exactPath();
  const open = () => {
    setModalOpen(!modalOpen);
  };

  const voteOpenClose = () => {
    setVoteModal(!voteModal);
  };

  const unvoteOpenClose = () => {
    setUnvoteModal(!unvoteModal);
  };

  const unlockOpenClose = () => {
    setUnlockModal(!unlockModal);
  };

  const delegateOpenClose = () => {
    if (!isDelegate) {
      setDelegateModal(!delegateModal);
    }
  };

  const fetchSendVotes = async (data, pay, page) => {
    setIsLoading(true);
    let payload = {
      address: data.address,
      // , limit: 100
    };
    const response = await http({
      path: `votes_sent`,
      baseUrl: `${basePath}${apiV2}`,
      params: pay ? pay : payload,
    });
    setSendPages(
      _.range(
        page ? page : 1,
        page
          ? (response?.data
            ? Math.ceil(response?.data?.length) / pageSize
            : 0) + page
          : (response?.data
            ? Math.ceil(response?.data?.length) / pageSize
            : 0) + 1
      )
    );
    setSendVotes(response);
    setPaginatedSend(_(response?.data?.votes).slice(0).take(pageSize).value());
    setLoadMore(false);
    setLoadLess(false);
    setIsLoading(false);
  };

  const fetchReceivedVotes = async (data, pay, page) => {
    setIsLoading(true);
    let payload = { address: data.address, limit: 100 };
    const response = await http({
      path: `votes_received`,
      baseUrl: `${basePath}${apiV2}`,
      params: pay ? pay : payload,
    });
    setReceivedPages(
      _.range(
        page ? page : 1,
        page
          ? (response?.data
            ? Math.ceil(response?.data?.votes?.length) / pageSize
            : 0) + page
          : (response?.data
            ? Math.ceil(response?.data?.votes?.length) / pageSize
            : 0) + 1
      )
    );
    setReceivedVotes(response);
    setPaginatedReceive(
      _(response?.data?.votes).slice(0).take(pageSize).value()
    );
    setLoadMore(false);
    setLoadLess(false);
  };

  const handleSend = () => {
    setSendPane(true);
    setReceivePane(false);
  };

  const handleReceive = () => {
    setReceivePane(true);
    setSendPane(false);
  };

  useEffect(() => {
    let data;
    async function decrypt() {
      const publicObj = getFromStorage("PUB_OBJ", []);
      data = JSON.parse(publicObj);
      setDecryptedData(data);
      fetchSendVotes(data);
      fetchReceivedVotes(data);
      const payload = {
        address: data.address,
      };
      const response = await http({
        path: "accounts",
        baseUrl: `${basePath}${apiV2}`,
        params: payload,
      });
      if (!response) {
        setIsDelegate(false);
        toastDisplay(
          "Error fetching user details !",
          "error"
        );
        return;
      }
      setIsDelegate(response.data[0].summary.isDelegate);
    }
    decrypt();
  }, []);

  const loadMoreReceive = () => {
    setLoadMore(true);
    const endData =
      receivedVotes.meta.count + receivedVotes.meta.offset ==
      receivedVotes.meta.total;
    const newPage = receivedPages[receivedPages.length - 1] + 1;
    setOffset(offset + 100);
    setCurrentReceived(newPage);
    const pay = {
      limit: 100,
      offset: endData ? 0 : offset + 100,
    };
    fetchReceivedVotes(decryptedData, pay, newPage);
  };

  const loadMoreSend = () => {
    setLoadMore(true);
    const endData =
      sendVotes.meta.count + sendVotes.meta.offset == sendVotes.meta.total;
    const newPage = sendPages[sendPages.length - 1] + 1;
    setOffset(offset + 100);
    setCurrentSend(newPage);
    const pay = {
      limit: 100,
      offset: endData ? 0 : offset + 100,
    };
    fetchSendVotes(decryptedData, pay, newPage);
  };

  const goBackReceive = () => {
    setLoadLess(true);
    let oldpage = receivedPages[0] - 10;
    setCurrentReceived(oldpage);
    setOffset(offset - 100);
    const pay = {
      limit: 100,
      offset: offset >= 100 ? offset - 100 : offset < 0 ? 0 : 0,
    };
    fetchReceivedVotes(decryptedData, pay, oldpage);
  };

  const goBackSend = () => {
    setLoadLess(true);
    let oldpage = sendPages[0] - 10;
    setCurrentSend(oldpage);
    setOffset(offset - 100);
    const pay = {
      limit: 100,
      offset: offset >= 100 ? offset - 100 : offset < 0 ? 0 : 0,
    };
    fetchSendVotes(decryptedData, pay, oldpage);
  };

  const paginationReceived = (pageNo) => {
    setCurrentReceived(pageNo);
    const startIndex = pageNo * pageSize;
    const page = (startIndex % 100) / 10;
    const newIndex = (page - 1) * pageSize;
    const transPage = _(receivedVotes.data.votes)
      .slice(newIndex)
      .take(pageSize)
      .value();
    setPaginatedReceive(transPage);
  };

  const paginationSend = (pageNo) => {
    setCurrentSend(pageNo);
    const startIndex = pageNo * pageSize;
    const page = (startIndex % 100) / 10;
    const newIndex = (page - 1) * pageSize;
    const transPage = _(sendVotes.data.votes)
      .slice(newIndex)
      .take(pageSize)
      .value();
    setPaginatedSend(transPage);
  };

  return (
    <>
      {isLoading ?
        <LoadingScreen />
        : ""}
      <Nav />
      <div
        className="row text-center d-flex flex-row justify-content-between pt-4"
        style={{ width: "95%", margin: "auto" }}
      >
        <div className="h2 text-white">Votes</div>
        <div className="">
          <ColouredButton
            padding="10px 15px"
            margin="0px 15px 0px 0px"
            startIcon="fas fa-user-check"
            content="Vote"
            onClick={voteOpenClose}
          />
          <ColouredButton
            padding="10px 15px"
            margin="0px 15px 0px 0px"
            startIcon="fas fa-user-times"
            content="Unvote"
            onClick={unvoteOpenClose}
          />
          <button
            style={{ padding: "10px 15px", margin: "0px 15px 0px 0px" }}
            onClick={unlockOpenClose}
            className={`${style.colouredbutton} btn`}
          >
            <svg className="mr-2" width="22" height="24" viewBox="0 0 762 515" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_65_68)">
                <path fillRule="evenodd" clipRule="evenodd" d="M295.113 234.428C274.063 248.493 249.316 256 224 256C190.052 256 157.495 242.514 133.49 218.51C109.486 194.505 96 161.948 96 128C96 102.684 103.507 77.9366 117.572 56.8871C131.637 35.8376 151.628 19.4315 175.017 9.74348C198.405 0.0554619 224.142 -2.47937 248.972 2.45954C273.801 7.39845 296.609 19.5893 314.51 37.4904C332.411 55.3915 344.602 78.1989 349.541 103.029C354.479 127.858 351.945 153.595 342.257 176.984C332.569 200.372 316.162 220.363 295.113 234.428ZM328.1 289.5C322.859 298.816 320.072 309.311 320 320V480C320.077 491.267 323.149 502.311 328.9 512H48C35.2696 512 23.0606 506.943 14.0589 497.941C5.05713 488.939 0 476.73 0 464V422.4C0.00795329 386.757 14.1705 352.577 39.3736 327.374C64.5768 302.171 98.7573 288.008 134.4 288H151.1C173.958 298.541 198.829 304 224 304C249.171 304 274.042 298.541 296.9 288H313.6C316.948 288 320.162 288.448 323.361 288.895C324.94 289.115 326.514 289.335 328.1 289.5ZM608.2 284V208.4C608.2 180.24 631.24 157.2 659.4 157.2C687.56 157.2 710.6 180.24 710.6 208.4H761.8C761.8 151.824 715.976 106 659.4 106C602.824 106 557 151.824 557 208.4V284H378C363.641 284 352 295.641 352 310V489C352 503.359 363.641 515 378 515H633C647.359 515 659 503.359 659 489V310C659 295.641 647.359 284 633 284H608.2ZM506 432C523.673 432 538 417.673 538 400C538 382.327 523.673 368 506 368C488.327 368 474 382.327 474 400C474 417.673 488.327 432 506 432Z" fill="white" />
              </g>
              <defs>
                <clipPath id="clip0_65_68">
                  <rect width="762" height="515" fill="white" />
                </clipPath>
              </defs>
            </svg>
            Unlock
          </button>
          <ColouredButton
            padding="10px 15px"
            startIcon="fas fa-user-plus"
            width="200px"
            content={title}
            title={isDelegate ? "Already a Delegate" : ""}
            opacity={isDelegate ? ".4" : "1"}
            onClick={isDelegate ? undefined : delegateOpenClose}
            onMouseEnter={() => {
              if (isDelegate) {
                setTitle("Already a Delegate");
              }
            }}
            onMouseLeave={() => {
              setTitle("Register Delegate");
            }}
          />
        </div>
      </div>
      <div className="pt-3" style={{ width: "95%", margin: "auto" }}>
        <div className="pt-2">
          <ul className="nav nav-tabs">
            <li
              className="nav-item rounded-top"
              style={{ backgroundColor: "rgba(43, 47, 57) !important" }}
              onClick={handleSend}
            >
              <a
                style={{ backgroundColor: "rgba(43, 47, 57) !important" }}
                className={
                  sendPane
                    ? "nav-link text-white font-weight-light bg-dark active"
                    : "nav-link text-white font-weight-light"
                }
                href="#/voting"
              >
                Sent
              </a>
            </li>
            <li
              style={{ backgroundColor: "rgba(43, 47, 57) !important" }}
              className="nav-item rounded-top"
              onClick={handleReceive}
            >
              <a
                style={{ backgroundColor: "rgba(43, 47, 57) !important" }}
                className={
                  receivePane
                    ? "nav-link text-white font-weight-light bg-dark active"
                    : "nav-link text-white font-weight-light"
                }
                href="#/voting"
              >
                Received
              </a>
            </li>
          </ul>
        </div>
        <div className="d-flex flex-lg-row flex-sm-column flex-wrap text-white">
          <div className={sendPane ? "col-12 pt-2 p-0" : "d-none"}>
            <Box
              main
              isLoading={isLoading}
              className="transactions-box py-3"
            >
              <BoxContent className="p-0">
                <Table
                  data={paginatedSend}
                  isLoading={isLoading}
                  row={votingRow}
                  header={header}
                  emptyState={{ message: "No Votes Send" }}
                />
              </BoxContent>
            </Box>

            {paginatedSend.address ? (
              <nav className="d-flex py-2 justify-content-center">
                <ul className="pagination m-0">
                  <li className="page-item mr-2">
                    <p
                      disabled={currentSend == sendPages[0]}
                      className={
                        currentSend == sendPages[0]
                          ? "page-link m-0 text-secondary bg-dark border border-dark"
                          : "page-link m-0 text-white bg-dark border border-dark"
                      }
                      onClick={() => paginationSend(sendPages[0])}
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      First
                    </p>
                  </li>

                  <li className="page-item mr-2">
                    <i
                      disabled={currentSend == sendPages[0]}
                      className={
                        currentSend == sendPages[0]
                          ? "page-link fas fa-chevron-left m-0 text-secondary bg-dark border border-dark"
                          : "page-link fas fa-chevron-left m-0 text-white bg-dark border border-dark"
                      }
                      style={{
                        padding: "9.5px",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        currentSend == sendPages[0]
                          ? goBackSend
                          : paginationSend(currentSend - 1)
                      }
                    />
                  </li>

                  {sendVotes?.meta?.offset != 0 && currentSend > 10 ? (
                    <li className={loadLess ? "d-none" : "page-item"} id="prev-data">
                      <p
                        className={
                          currentSend == sendPages.length
                            ? "page-link m-0 text-secondary bg-dark border border-dark"
                            : "page-link m-0 text-white bg-dark border border-dark"
                        }
                        style={{
                          cursor: "pointer",
                        }}
                        disabled={open}
                        onClick={goBackSend}
                      >
                        ..
                      </p>
                    </li>
                  ) : (
                    ""
                  )}

                  {sendPages && sendPages.length > 0
                    ? sendPages.map((page) => (
                      <li
                        key={page}
                        className={
                          page === currentSend
                            ? "page-item active"
                            : "page-item"
                        }
                      >
                        <p
                          className={
                            page === currentSend
                              ? "page-link m-0 text-white bg-secondary border border-secondary"
                              : "page-link m-0 text-white bg-dark border border-dark"
                          }
                          style={{ cursor: "pointer" }}
                          onClick={() => paginationSend(page)}
                        >
                          {page}
                        </p>
                      </li>
                    ))
                    : ""}

                  {sendVotes.meta &&
                    sendVotes.meta.count + sendVotes.meta.offset ==
                    sendVotes.meta.total ? (
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
                        onClick={loadMoreSend}
                      >
                        ..
                      </p>
                    </li>
                  )}

                  <li className="page-item ml-2">
                    <i
                      className={
                        currentSend == sendPages[sendPages.length - 1]
                          ? "page-link fas fa-chevron-right m-0 text-secondary bg-dark border border-dark"
                          : "page-link fas fa-chevron-right m-0 text-white bg-dark border border-dark"
                      }
                      style={{
                        padding: "9.5px",
                        cursor: "pointer",
                      }}
                      disabled={currentSend == sendPages[sendPages.length - 1]}
                      onClick={() =>
                        currentSend == sendPages[sendPages.length - 1]
                          ? undefined
                          : paginationSend(currentSend + 1)
                      }
                    />
                  </li>

                  <li className="page-item ml-2">
                    <p
                      disabled={currentSend == sendPages[sendPages.length - 1]}
                      className={
                        currentSend == sendPages[sendPages.length - 1]
                          ? "page-link m-0 text-secondary bg-dark border border-dark"
                          : "page-link m-0 text-white bg-dark border border-dark"
                      }
                      onClick={() =>
                        paginationSend(sendPages[sendPages.length - 1])
                      }
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
          </div>
          <div className={receivePane ? "col-12 pt-2 p-0" : "d-none"}>
            <Box
              main
              isLoading={isLoading}
              className="transactions-box py-3"
            >
              <BoxContent className="p-0">
                <Table
                  data={paginatedReceive}
                  isLoading={isLoading}
                  row={votingRow}
                  header={header}
                  emptyState={{ message: "No Votes Received" }}
                />
              </BoxContent>
            </Box>

            {paginatedReceive[0] && paginatedReceive[0].address ? (
              <nav className="d-flex py-2 justify-content-center">
                <ul className="pagination m-0">
                  <li className="page-item mr-2">
                    <p
                      disabled={currentReceived == receivedPages[0]}
                      className={
                        currentReceived == receivedPages[0]
                          ? "page-link m-0 text-secondary bg-dark border border-dark"
                          : "page-link m-0 text-white bg-dark border border-dark"
                      }
                      onClick={() => paginationReceived(receivedPages[0])}
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      First
                    </p>
                  </li>

                  <li className="page-item mr-2">
                    <i
                      disabled={currentReceived == receivedPages[0]}
                      className={
                        currentReceived == receivedPages[0]
                          ? "page-link fas fa-chevron-left m-0 text-secondary bg-dark border border-dark"
                          : "page-link fas fa-chevron-left m-0 text-white bg-dark border border-dark"
                      }
                      style={{
                        padding: "9.5px",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        currentReceived == receivedPages[0]
                          ? goBackReceive
                          : paginationReceived(currentReceived - 1)
                      }
                    />
                  </li>

                  {receivedVotes?.meta?.total != 0 && currentReceived > 10 ? (
                    <li className={loadLess ? "d-none" : "page-item"} id="prev-data">
                      <p
                        className={
                          currentReceived == receivedPages.length
                            ? "page-link m-0 text-secondary bg-dark border border-dark"
                            : "page-link m-0 text-white bg-dark border border-dark"
                        }
                        style={{
                          cursor: "pointer",
                        }}
                        disabled={open}
                        onClick={goBackReceive}
                      >
                        ..
                      </p>
                    </li>
                  ) : (
                    ""
                  )}

                  {receivedPages && receivedPages.length > 0
                    ? receivedPages.map((page) => (
                      <li
                        key={page}
                        className={
                          page === currentReceived
                            ? "page-item active"
                            : "page-item"
                        }
                      >
                        <p
                          className={
                            page === currentReceived
                              ? "page-link m-0 text-white bg-secondary border border-secondary"
                              : "page-link m-0 text-white bg-dark border border-dark"
                          }
                          style={{ cursor: "pointer" }}
                          onClick={() => paginationReceived(page)}
                        >
                          {page}
                        </p>
                      </li>
                    ))
                    : ""}

                  {receivedVotes.meta &&
                    receivedVotes.meta.count + receivedVotes.meta.offset ==
                    receivedVotes.meta.total ? (
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
                        onClick={loadMoreReceive}
                      >
                        ..
                      </p>
                    </li>
                  )}

                  <li className="page-item ml-2">
                    <i
                      className={
                        currentReceived ==
                          receivedPages[receivedPages.length - 1]
                          ? "page-link fas fa-chevron-right m-0 text-secondary bg-dark border border-dark"
                          : "page-link fas fa-chevron-right m-0 text-white bg-dark border border-dark"
                      }
                      style={{
                        padding: "9.5px",
                        cursor: "pointer",
                      }}
                      disabled={
                        currentReceived ==
                        receivedPages[receivedPages.length - 1]
                      }
                      onClick={() =>
                        currentReceived ==
                          receivedPages[receivedPages.length - 1]
                          ? undefined
                          : paginationReceived(currentReceived + 1)
                      }
                    />
                  </li>

                  <li className="page-item ml-2">
                    <p
                      disabled={
                        currentReceived ==
                        receivedPages[receivedPages.length - 1]
                      }
                      className={
                        currentReceived ==
                          receivedPages[receivedPages.length - 1]
                          ? "page-link m-0 text-secondary bg-dark border border-dark"
                          : "page-link m-0 text-white bg-dark border border-dark"
                      }
                      onClick={() =>
                        paginationReceived(
                          receivedPages[receivedPages.length - 1]
                        )
                      }
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
          </div>
        </div>
      </div>
      {voteModal ? (
        <VoteModal show={voteModal} modalClosed={voteOpenClose} />
      ) : (
        ""
      )}
      {unvoteModal ? (
        <UnvoteModal show={unvoteModal} modalClosed={unvoteOpenClose} />
      ) : (
        ""
      )}
      {unlockModal ? (
        <UnlockModal show={unlockModal} modalClosed={unlockOpenClose} />
      ) : (
        ""
      )}
      {delegateModal ? (
        <RegisterDelegateModal
          show={delegateModal}
          modalClosed={delegateOpenClose}
        />
      ) : (
        ""
      )}
    </>
  );
}

export default Voting;
