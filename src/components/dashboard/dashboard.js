import React, { useState, useEffect } from "react";
import { ColouredButton } from "@tools/Button";
import toastDisplay from "../../app/toast";
import { getFromStorage } from "@utils/localJSONStorage";
import { getDateFromUnixTimestamp } from "@utils/datetime";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { TableHead, TokensTableHead, NFTsTableHead } from "./tableHead";
import TransactionModal from "@modals/transactionModal";
import { getModuleAssetTitle } from "@utils/moduleAssets";
import TransactionsModal from "@modals/transactionsModal";
import { truncateAddress } from "@utils/account";
import Nav from "@subcomponents/navigationBars/navBar/Nav";
import endPoints from "@constants/endPoints";
import { apiV2 } from "@constants/networks";
import http from "@utils/http";
import { exactPath } from "@utils/getNetwork";
import _ from "lodash";
import { getAmount, getPrefix } from "@utils/phae";
import LoadingScreen from "@subcomponents/loadingScreen/loadingScreen";
import logo from '../../assets/images/img/logo.png';
import styles from './dashboard.css';

function Dash() {
  const [dashTrans, setDashTrans] = useState([]);
  const [publicSelected, setPublicSelected] = useState(false);
  const [addressSelected, setAddressSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [idSelected, setIdSelected] = useState(false);
  const [tAddress, setTAddress] = useState(false);
  const [binaryAdress, setBinaryAddress] = useState(false);
  const [decryptedData, setDecryptedData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [details, setDetails] = useState([]);
  const [transactionModal, setTransactionModal] = useState(false);
  const [transDetails, setTransDetails] = useState([]);
  const [pageSize] = useState(10);
  const [paginatedTransaction, setPaginatedTransaction] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [tokensViewMore, setTokensViewMore] = useState(false);
  const [nftsViewMore, setNftsViewMore] = useState(false);
  const [tokensDisabled, setTokensDisabled] = useState(false);
  const [nftsDisabled, setNftsDisabled] = useState(false);
  const [tableDisabled, setTableDisabled] = useState(false);
  const pageCount = dashTrans
    ? Math.ceil(dashTrans.length) / pageSize
    : 0;
  const pages = _.range(1, pageCount + 1);
  const basePath = exactPath();

  const prefix = getPrefix();
  const fetchTrans = async (address) => {
    const payload = {
      address: address,
      limit: 100,
    };
    try {
      const response = await http({
        path: endPoints.transactions,
        baseUrl: `${basePath}${apiV2}`,
        params: payload,
      });
      if (response == null) {
        throw 404;
      }
      if (response.data.length != 0) {
        setDashTrans(response.data);
        setPaginatedTransaction(_(response.data).slice(0).take(pageSize).value());
        setIsLoading(false);
      }
    } catch {
      setIsLoading(false);
      toastDisplay(
        "Error fetching user details !",
        "error"
      );
    }

  }

  const ModalOpenClose = () => {
    setModalOpen(!modalOpen);
  };

  const handleDetailsModal = (data) => {
    setTransactionModal(!transactionModal);
    setTransDetails(data);
  };

  const fetchAddress = (data, truncate) => {
    let address = "";
    let trun = ""
    if (data.sender?.address == decryptedData.address) {
      address = data?.asset?.recipient?.address;
      trun = truncateAddress(data?.asset?.recipient?.address)
    }
    if (data.sender?.address != decryptedData.address) {
      address = data?.sender?.address;
      trun = truncateAddress(data?.sender?.address)
    }

    if (data?.asset?.votes) {
      address = data?.asset?.votes[0]?.delegateAddress;
      trun = truncateAddress(data?.asset?.votes[0]?.delegateAddress)
    }

    if (truncate) {
      return trun;
    }

    return address;
  };

  const handlePublic = () => {
    setPublicSelected(true);
    setTimeout(() => setPublicSelected(false), 5000);
    toastDisplay("Public Key Copied", "info");
  };

  const handleAddress = () => {
    setAddressSelected(true);
    setTimeout(() => setAddressSelected(false), 5000);
    toastDisplay("Address Copied", "info");
  };

  const handleId = () => {
    setIdSelected(true);
    setTimeout(() => setIdSelected(false), 1000);
    toastDisplay("Transaction ID Copied", "info");
  };

  const handleTAddress = () => {
    setTAddress(true);
    setTimeout(() => setTAddress(false), 1000);
    toastDisplay("Address Copied", "info");
  };


  const handleBinaryAddress = () => {
    setBinaryAddress(true);
    setTimeout(() => setBinaryAddress(false), 1000);
    toastDisplay("Binary Address Copied", "info");
  };

  const pagination = (pageNo) => {
    if (pageNo > 0 && pageNo <= pages.length) {
      setCurrentPage(pageNo);
      const startIndex = (pageNo - 1) * pageSize;
      const transPage = _(dashTrans)
        .slice(startIndex)
        .take(pageSize)
        .value();
      setPaginatedTransaction(transPage);
    }
  };

  const handleTable = () => {
    setTableDisabled(true);
    if (tokensViewMore == nftsViewMore) {
      setTokensViewMore(!tokensViewMore);
      setNftsViewMore(!nftsViewMore);
      setTimeout(() => setTableDisabled(false), 500);
    } else {
      !nftsViewMore && setNftsViewMore(true);
      !tokensViewMore && setTokensViewMore(true);
      setTimeout(() => setTableDisabled(false), 500);

    }

  };

  const handleTokensTable = () => {
    setTokensDisabled(true);
    setTokensViewMore(!tokensViewMore);
    setTimeout(() => setTokensDisabled(false), 500);


  };

  const handleNftsTable = () => {
    setNftsDisabled(true);
    setNftsViewMore(!nftsViewMore)
    setTimeout(() => setNftsDisabled(false), 500);

  };

  useEffect(() => {
    try {
      let encryptedObj = getFromStorage("ENC_OBJ", []);
      if (!encryptedObj?.cipherText) {
        window.location = "#/getstarted";
        return;
      }
    } catch {
      window.location = "#/getstarted";
      return;
    }
    try {
      let logincheck = sessionStorage.getItem("loggedIn");
      if (logincheck != "true") {
        window.location = "#/login";
        return;
      }
    } catch {
      window.location = "#/login";
      return;
    }
    let data;
    try {
      async function decrypt() {
        const publicObj = getFromStorage("PUB_OBJ", []);
        data = JSON.parse(publicObj);
        fetchTrans(data?.address);
        setDecryptedData(data);
        let payload = { address: data.address };
        const response = await http({
          path: `${endPoints.accounts}`,
          baseUrl: `${basePath}${apiV2}`,
          params: payload,
        });
        if (response == null) {
          throw 404;
        }
        setDetails(response.data[0]);
      }
      decrypt();
    } catch {
      toastDisplay(
        "Error fetching user details !",
        "error"
      );
      return;
    }
  }, []);

  return (
    <>
      {isLoading ?
        <LoadingScreen />
        : ''
      }
      <Nav />
      <div className={`${styles.dashtop} row m-0 justify-content-center`}>

        <div className="mx-auto pt-4">
          <div className="col-12 justify-content-center">
            <p className={`${styles.accounttitle}`}>
              Hi, {decryptedData.username}
            </p>
          </div>
          <div className="col-12 justify-content-center pt-2">
            <p className={`${styles.accounttitle} pl-3`}>
              Your Account Details
              <i
                className={`fas ${nftsViewMore == tokensViewMore ? tokensViewMore ? 'fa-chevron-circle-up' : 'fa-chevron-circle-down' : 'fa-chevron-circle-down'} fa-sm pl-3`}
                data-toggle="collapse"
                aria-expanded="false"
                disabled={tableDisabled}
                aria-controls=" nfts"
                data-target={!tableDisabled ? nftsViewMore == tokensViewMore ? '.multi-collapse' : !nftsViewMore ? '#nfts' : !tokensViewMore ? '#tokens' : '' : ''}
                title={nftsViewMore == tokensViewMore ? tokensViewMore ? 'Collapse' : 'Expand' : 'Expand'}
                onClick={() => { !tableDisabled && handleTable() }}
                style={{ cursor: "pointer" }}
              />
            </p>
          </div>
        </div>
      </div>

      <div className={`row m-0 d-flex ${styles.tokens} pt-3 pb-3`}>

        <div className="col-md-8 text-white text-center pt-4 ">

          <p className={`h4 ${styles.tabHeading}`}>
            Tokens
            <ColouredButton
              dataToggle="collapse"
              classes="ml-2 mb-2"
              padding="3px 8px"
              dataTarget="#tokens"
              ariaControls="tokens"
              startIcon={tokensViewMore ? "fas fa-angle-up" : "fas fa-angle-down"}
              onClick={handleTokensTable}
              disabled={tokensDisabled}
              content={tokensViewMore ? 'Collpase' : 'Expand'}
            />
          </p>
          <div className={`${styles.tabbar}`}>
            <div style={{ maxheight: "850px", minHeight: "100px", width: "100%", marginTop: "1em", overflow: "auto", }}  >

              <table className={`table ${styles.tableBR} mt-2`}>
                <thead className={`${styles.tableheader}`}>
                  <tr className={`sticky-top ${styles.darkBack}`} style={{ zIndex: 10 }}>
                    {TokensTableHead.map((cell, id) => (
                      <th key={id} scope="col" style={{ whiteSpace: 'nowrap' }} className={cell.Tname === 'Balance' ? 'text-white' : ''}>
                        {cell.Tname}
                        {cell.Tname === 'Address' ?
                          <sup>
                            <i
                              className="fas fa-info-circle text-white pl-1"
                              data-toggle="tooltip"
                              data-placement="top"
                              title={`You can use this address to make transactions like sending or receiving ${prefix}`}
                            />
                          </sup>
                          : ''}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>

                  <tr className={`${styles.tablerow}`}>
                    <td width={'10%'}>
                      <span className={`${styles.field}`}>
                        <span className="text-center d-flex justify-items-center justify-content-center">
                          <img
                            className={`${styles.logo}`}
                            src={logo}
                            alt="Pheaton"
                            width={25}
                          />
                          <span className="d-flex justify-items-center align-items-center pl-1 pt-1">Phaeton </span>
                        </span>
                      </span>
                    </td>
                    <td width={'30%'}>
                      <span className={`${styles.address} text-white`}>
                        <span>
                          {details?.token?.balance
                            ? details?.token?.balance / Math.pow(10, 8)
                            : "0.000"}
                          <span className={`${styles.pha} text-white p-1`}>{prefix}</span>
                        </span>
                      </span>
                    </td>
                    <td width={'20%'}>
                      <span className={`${styles.field}`}>
                        <CopyToClipboard
                          key={decryptedData.binary}
                          text={decryptedData.binary}
                          onCopy={handleBinaryAddress}
                        >
                          <span title="Copy Binary Address">
                            {truncateAddress(decryptedData.binary)}
                            <i
                              key={decryptedData.binary}
                              style={{
                                color: "#fff",
                                cursor: "pointer",
                              }}
                              className="far fa-clone ml-2 mt-1"
                            />
                          </span>
                        </CopyToClipboard>
                      </span>
                    </td>
                    <td width={'20%'}>
                      <span className={`${styles.field}`}>
                        <CopyToClipboard
                          key={decryptedData.publicKey}
                          text={decryptedData.publicKey}
                          onCopy={handlePublic}
                        >
                          <span title="Copy Public Key">
                            {truncateAddress(decryptedData.publicKey)}
                            <i
                              key={decryptedData.publicKey}
                              style={{
                                color: "#fff",
                                cursor: "pointer",
                              }}
                              className="far fa-clone ml-2 mt-1"
                            />
                          </span>
                        </CopyToClipboard>
                      </span>
                    </td>
                    <td width={'20%'}>
                      <span className={`${styles.field}`}>
                        <CopyToClipboard
                          key={decryptedData.address}
                          text={decryptedData.address}
                          onCopy={handleTAddress}
                        >
                          <span title="Copy Address">
                            {truncateAddress(decryptedData.address)}
                            <i
                              key={decryptedData.address}
                              style={{
                                color: "#fff",
                                cursor: "pointer",
                              }}
                              className="far fa-clone ml-2 mt-1"
                            />
                          </span>
                        </CopyToClipboard>
                      </span>
                    </td>

                  </tr>

                </tbody>

              </table>
            </div>

          </div>




        </div>
        <div className=" col text-white text-center pt-4 ">

          <p className={`h4 ${styles.tabHeading}`}>
            NFTs
            <ColouredButton
              dataToggle="collapse"
              classes="ml-2 mb-2"
              padding="3px 8px"
              dataTarget="#nfts"
              ariaControls="nfts"
              startIcon={nftsViewMore ? "fas fa-angle-up" : "fas fa-angle-down"}
              onClick={handleNftsTable}
              disabled={tokensDisabled}
              content={nftsViewMore ? 'Collpase' : 'Expand'}
            />
          </p>
          <div className={`${styles.tabbar}`}>
            <div className="d-flex justify-content-center" style={{ maxheight: "850px", minHeight: "100px", width: "100%", marginTop: "1em", overflow: "auto", }}>
              {true ?
                <p className="h6 m-0 d-flex align-items-center justify-content-center">
                  No Data
                </p> :
                <table className={`table mt-2 ${styles.tableBL}`}>
                  <thead className={`${styles.tableheader}`}>
                    <tr className={`sticky-top ${styles.darkBack}`} style={{ zIndex: 10 }}>
                      {NFTsTableHead.map((cell, id) => (
                        <th key={id} scope="col">
                          {cell.Tname}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className={`${styles.tablerow}`}>
                      <td width={'50%'}>
                        <span className={`${styles.field}`}>
                          <span>hello</span>
                        </span>
                      </td>
                      <td width={'50%'}>
                        <span className={`${styles.field}`}>
                          <span>hello</span>
                        </span>
                      </td>
                    </tr>
                  </tbody>

                </table>
              }
            </div>

          </div>
        </div>
      </div>
      {/* <div className="dashtop row justify-content-center">
          
        <div className="mx-auto pt-4">
          <div className="col-12 justify-content-center">
            <p className={`${styles.accounttitle}`}>
              Hi {decryptedData.username}, Your Account balance is
            </p>
            <h1 className={`${styles.accountbalance} text-white`}>
              {details?.token?.balance
                ? details?.token?.balance / Math.pow(10, 8)
                : "0.000"}
              <span className={`${styles.pha} text-white`}>{prefix}</span>
            </h1>
          </div>
          <div className="col-8 mx-auto justify-content-center p-0">
            <div
              className="btn-group btn-group-toggle row m-0 justify-content-around p-0"
              data-toggle="buttons"
            >
              <div className="m-0 p-0 col-6" title="Copy Public key">
                <p className="m-0 text-muted">Copy Public key</p>
                <CopyToClipboard text={decryptedData.publicKey}>
                  <label
                    className={`btn btn-secondary ${styles.togglebutton} col-10 text-left`}
                    style={{
                      backgroundColor: "#3C404B",
                      border: "1px solid #3C404B",
                      color: "#ff8f8f",
                    }}
                  >
                    <input
                      className="d-none"
                      type="radio"
                      autoComplete="off"
                      onClick={handlePublic}
                    />
                    <div className="d-flex justify-content-between">
                      <span className="text-truncate m-0 d-block">
                        {decryptedData.publicKey}
                      </span>
                      <i
                        style={{ color: "#fff" }}
                        className={
                          publicSelected
                            ? "far fa-check float-right mt-1"
                            : "far fa-clone float-right mt-1"
                        }
                      />
                    </div>
                  </label>
                </CopyToClipboard>
              </div>

              <div className="m-0 p-0 col-6" title="Copy Address">
                <p className="m-0 text-muted">Copy Address</p>
                <CopyToClipboard text={decryptedData.address}>
                  <label
                    className={`btn btn-secondary ${styles.togglebutton} col-10 text-left`}
                    style={{
                      backgroundColor: "#3C404B",
                      border: "1px solid #3C404B",
                      color: "#ff8f8f",
                    }}
                  >
                    <input
                      className="d-none"
                      type="radio"
                      autoComplete="off"
                      onClick={handleAddress}
                    />
                    <div className="d-flex justify-content-between">
                      <span className="text-truncate m-0 d-block">
                        {decryptedData.address}
                      </span>
                      <i
                        style={{ color: "#fff" }}
                        className={
                          addressSelected
                            ? "far fa-check float-right mt-1"
                            : "far fa-clone float-right mt-1"
                        }
                      />
                    </div>
                  </label>
                </CopyToClipboard>
              </div>
            </div>
          </div>
          <div className="d-flex col-9 mx-auto mt-2 justify-content-center">
            <i className="mr-2 fas fa-info-circle" />
            <p className={`${styles.information}`}>
              You can use this above address to make transactions like sending
              or receiving {prefix}
            </p>
          </div>
        </div>
      </div> */}

      <div className={`${styles.transactions} row m-0 justify-content-center`}>
        <div className="col-12 col-lg-10 col-sm-12 m-lg-auto d-flex justify-content-between">
          <p className="h4 m-0 d-flex align-items-center">
            {isLoading ? "No recent Transactions" : "Recent transactions"}
          </p>
          <ColouredButton
            padding="10px 15px"
            startIcon="fal fa-plus"
            content="New Transaction"
            onClick={ModalOpenClose}
          />
        </div>
        <div
          className={
            isLoading
              ? `col-lg-10 col-sm-12 m-lg-auto text-center ${styles.nodata} d-flex align-items-center justify-content-center`
              : "col-12 col-lg-10 col-md-12 col-sm-12 m-lg-auto"
          }
        >
          {!isLoading && (dashTrans?.length == 0 ? (
            ""
          ) : (
            <>
              <div style={{ maxheight: "850px", minHeight: "600px", width: "100%", marginTop: "1em", overflow: "auto" }}>
                <table className="table mt-3 mb-0">
                  <thead className={`${styles.tableheader}`}>
                    <tr className="sticky-top" style={{ zIndex: 10, backgroundColor: "var(--primary-background-color)" }}>
                      {TableHead.map((cell, id) => (
                        <th key={id} scope="col">
                          {cell.Tname}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTransaction &&
                      paginatedTransaction?.map((item, id) => (
                        <tr className={`${styles.tablerow}`} key={id}>
                          <td className="d-flex">
                            {item.sender.address !== decryptedData.address ? (
                              <>
                                <div className={`${styles.addbox}`}>
                                  <svg width="30" height="30" viewBox="0 0 1163 1163" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M783.252 421.214C794.968 409.498 794.968 390.503 783.252 378.787C771.536 367.071 752.542 367.071 740.826 378.787L783.252 421.214ZM370 762.039C370 778.608 383.432 792.039 400 792.039H670C686.569 792.039 700 778.608 700 762.039C700 745.471 686.569 732.039 670 732.039H430L430 492.039C430 475.471 416.569 462.039 400 462.039C383.432 462.039 370 475.471 370 492.039L370 762.039ZM740.826 378.787L378.787 740.826L421.214 783.252L783.252 421.214L740.826 378.787Z" fill="white" />
                                  </svg>
                                </div>
                                <div className={`${styles.textbox} text-center d-flex align-items-center`}>
                                  Receive
                                </div>
                              </>
                            ) : item.asset.votes && item.asset.votes[0].amount < 0 ?
                              <>
                                <div className={`${styles.addbox} bg-dark text-white`}>
                                  <i className="fas fa-user-times pl-1" />
                                </div>
                                <div className={`${styles.textbox} text-center d-flex align-items-center`}>
                                  Unvote
                                </div>
                              </>
                              :
                              <>
                                {getModuleAssetTitle(item.moduleAssetId)[0] == "Send"
                                  ?
                                  <div className={`${styles.sendbox}`} >
                                    <svg width="30" height="30" viewBox="0 0 1163 1163" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M378.787 740.825C367.071 752.541 367.071 771.536 378.787 783.252C390.503 794.968 409.497 794.968 421.213 783.252L378.787 740.825ZM792.039 400C792.039 383.431 778.607 370 762.039 370H492.039C475.47 370 462.039 383.431 462.039 400C462.039 416.568 475.47 430 492.039 430H732.039V670C732.039 686.568 745.47 700 762.039 700C778.607 700 792.039 686.568 792.039 670V400ZM421.213 783.252L783.252 421.213L740.825 378.787L378.787 740.825L421.213 783.252Z" fill="white" />
                                    </svg>

                                  </div>
                                  : getModuleAssetTitle(item.moduleAssetId)[0] == "Unlock"
                                    ? <>
                                      <div className={`${styles.sendbox} bg-dark text-white`}>
                                        <svg className="pl-1" width="26" height="28" viewBox="0 0 762 515" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <g clipPath="url(#clip0_65_68)">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M295.113 234.428C274.063 248.493 249.316 256 224 256C190.052 256 157.495 242.514 133.49 218.51C109.486 194.505 96 161.948 96 128C96 102.684 103.507 77.9366 117.572 56.8871C131.637 35.8376 151.628 19.4315 175.017 9.74348C198.405 0.0554619 224.142 -2.47937 248.972 2.45954C273.801 7.39845 296.609 19.5893 314.51 37.4904C332.411 55.3915 344.602 78.1989 349.541 103.029C354.479 127.858 351.945 153.595 342.257 176.984C332.569 200.372 316.162 220.363 295.113 234.428ZM328.1 289.5C322.859 298.816 320.072 309.311 320 320V480C320.077 491.267 323.149 502.311 328.9 512H48C35.2696 512 23.0606 506.943 14.0589 497.941C5.05713 488.939 0 476.73 0 464V422.4C0.00795329 386.757 14.1705 352.577 39.3736 327.374C64.5768 302.171 98.7573 288.008 134.4 288H151.1C173.958 298.541 198.829 304 224 304C249.171 304 274.042 298.541 296.9 288H313.6C316.948 288 320.162 288.448 323.361 288.895C324.94 289.115 326.514 289.335 328.1 289.5ZM608.2 284V208.4C608.2 180.24 631.24 157.2 659.4 157.2C687.56 157.2 710.6 180.24 710.6 208.4H761.8C761.8 151.824 715.976 106 659.4 106C602.824 106 557 151.824 557 208.4V284H378C363.641 284 352 295.641 352 310V489C352 503.359 363.641 515 378 515H633C647.359 515 659 503.359 659 489V310C659 295.641 647.359 284 633 284H608.2ZM506 432C523.673 432 538 417.673 538 400C538 382.327 523.673 368 506 368C488.327 368 474 382.327 474 400C474 417.673 488.327 432 506 432Z" fill="white" />
                                          </g>
                                          <defs>
                                            <clipPath id="clip0_65_68">
                                              <rect width="762" height="515" fill="white" />
                                            </clipPath>
                                          </defs>
                                        </svg>
                                      </div>
                                    </>
                                    :
                                    <div className={`${styles.sendbox} bg-dark text-white`} >
                                      <i className={getModuleAssetTitle(item.moduleAssetId)[1]} />
                                    </div>
                                }
                                <div className={`${styles.textbox} d-flex align-items-center`}>
                                  {getModuleAssetTitle(item.moduleAssetId)[0]}
                                </div>
                              </>
                            }
                          </td>
                          <td>
                            <span className={`${styles.address}`}>
                              <CopyToClipboard
                                key={id}
                                text={item?.id}
                                onCopy={handleId}
                              >
                                <span title="Copy Transaction ID">
                                  {truncateAddress(item?.id)}{" "}
                                  <i
                                    key={id}
                                    style={{
                                      color: "#fff",
                                      cursor: "pointer",
                                    }}
                                    className="far fa-clone ml-2 mt-1"
                                  />
                                </span>
                              </CopyToClipboard>
                            </span>
                          </td>
                          {fetchAddress(item) != null ? (
                            <td>
                              <span className={`${styles.address}`}>
                                <CopyToClipboard
                                  key={id}
                                  text={fetchAddress(item)}
                                  onCopy={handleTAddress}
                                >
                                  <span title="Copy Address">
                                    {fetchAddress(item, true)}
                                    <i
                                      key={id}
                                      style={{
                                        color: "#fff",
                                        cursor: "pointer",
                                      }}
                                      className="far fa-clone ml-2 mt-1"
                                    />
                                  </span>
                                </CopyToClipboard>
                              </span>
                            </td>
                          ) : (
                            <td className={`${styles.address}`}>-</td>
                          )}
                          <td>
                            <span className={`${styles.address}`}>
                              <span>{getAmount(item)}</span>
                            </span>
                          </td>
                          <td className={`${styles.address}`}>
                            {getDateFromUnixTimestamp(
                              item.block.timestamp * 1000
                            )}
                          </td>
                          <td>
                            {item.isPending ? (
                              <span className="text-secondary">Pending</span>
                            ) : (
                              <span className="text-secondary">Committed</span>
                            )}
                          </td>
                          <td>
                            <i
                              title="View Details"
                              className="fas fa-info-circle text-secondary fa-lg"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                handleDetailsModal(item);
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <nav className="d-flex justify-content-center">
                <ul className="pagination">
                  <li className="page-item mr-2">
                    <p
                      disabled={currentPage == 1}
                      className={
                        currentPage == 1
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
                      disabled={currentPage == 1}
                      className={
                        currentPage == 1
                          ? "page-link fas fa-chevron-left m-0 text-secondary bg-dark border border-dark"
                          : "page-link fas fa-chevron-left m-0 text-white bg-dark border border-dark"
                      }
                      style={{
                        padding: "9.5px",
                        cursor: "pointer",
                      }}
                      onClick={() => pagination(currentPage - 1)}
                    />
                  </li>
                  {pages.map((page) => (
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
                  ))}
                  <li className="page-item ml-2">
                    <i
                      className={
                        currentPage == pages.length
                          ? "page-link fas fa-chevron-right m-0 text-secondary bg-dark border border-dark"
                          : "page-link fas fa-chevron-right m-0 text-white bg-dark border border-dark"
                      }
                      style={{
                        padding: "9.5px",
                        cursor: "pointer",
                      }}
                      disabled={currentPage == pages.length}
                      onClick={() => pagination(currentPage + 1)}
                    />
                  </li>
                  <li className="page-item ml-2">
                    <p
                      disabled={currentPage == pages.length}
                      className={
                        currentPage == pages.length
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
            </>
          ))}
        </div>
      </div>

      {modalOpen ? (
        <TransactionModal
          show={modalOpen}
          details={details}
          data={decryptedData}
          modalClosed={ModalOpenClose}
        />
      ) : (
        ""
      )}
      {transactionModal ? (
        <TransactionsModal
          isExplorer={false}
          details={details}
          data={transDetails}
          open={transactionModal}
          openClose={handleDetailsModal}
          isLoading={isLoading}
        />
      ) : (
        ""
      )}
    </>
  );
}

export default Dash;
