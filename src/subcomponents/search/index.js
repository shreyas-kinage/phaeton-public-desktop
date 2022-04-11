import React, { useState } from "react";
import http from "@utils/http";
import { exactPath } from "@utils/getNetwork";
import { apiV2 } from "@constants/networks";
import TransactionsModal from "@modals/transactionsModal";
import * as cryptography from "@phaeton/phaeton-cryptography-web";
import { routes } from "@constants";
import toastDisplay from "../../app/toast";

const SearchBar = () => {
  const [searchParam, setSearchParam] = useState("transactionId");
  const [searchId, setSearchId] = useState("");
  const [searchData, setSearchData] = useState();
  const [transXOpen, setTransXOpen] = useState(false);

  const basePath = exactPath();

  const handleSearchValue = async (e) => {
    e.preventDefault();
    if (!window.navigator.onLine) {
      toastDisplay("Check your internet connectivity", "info");
      return;
    }

    if (!searchId) {
      toastDisplay("Kindly provide Search Parameters!", "info");
      return;
    }

    if (searchParam == "transactionId") {
      try {
        const response = await http({
          path: `transactions`,
          baseUrl: `${basePath}${apiV2}`,
          params: { transactionId: searchId },
        });
        if (response != null) {
          setSearchData(response);
          setTransXOpen(true);
        } else {
          toastDisplay("Invalid Transaction ID!", "error");
          return;
        }
      } catch {
        toastDisplay("Error fetching details", "error");
        setTransXOpen(false);
        return;
      }
    } else if (searchParam == "blockId") {
      try {
        const response = await http({
          path: `blocks`,
          baseUrl: `${basePath}${apiV2}`,
          params: { blockId: searchId },
        });
        if (response != null) {
          window.location.href = `#${routes.blockByID.path}?id=${searchId}`;
        } else {
          toastDisplay("Invalid Block ID!", "error");
          return;
        }
      } catch {
        toastDisplay("Error fetching details", "error");
        return;
      }
    } else if (searchParam == "address") {
      try {
        let add = cryptography.validatePhaeton32Address(searchId.toString());
      } catch {
        toastDisplay("Invalid Address!", "error");
        return;
      }
      try {
        const response = await http({
          path: `accounts`,
          baseUrl: `${basePath}${apiV2}`,
          params: { address: searchId },
        });
        if (response != null) {
          window.location.href = `#${routes.account.path}?address=${searchId}`;
        } else {
          toastDisplay("Invalid Address!", "error");
          return;
        }
      } catch {
        toastDisplay("Error fetching details", "error");
        return;
      }
    } else if (searchParam == "blockHeight") {
      try {
        const regex = /^[0-9]+$/;
        const isHeight = regex.test(searchId);
        if (isHeight) {
          let response = await http({
            path: `blocks`,
            baseUrl: `${basePath}${apiV2}`,
            params: { height: searchId },
          });
          if (response != null) {
            window.location.href = `#${routes.blockByID.path}?height=${searchId}`;
          }
          else {
            toastDisplay("Invalid Block Height!", "error");
            return;
          }
        } else {
          toastDisplay("Invalid Block Height!", "error");
          return;
        }
      } catch {
        toastDisplay("Error fetching details", "error");
        return;
      }
    }
  };

  const openClose = () => {
    setTransXOpen(!transXOpen);
  };

  return (
    <>
      <div className="d-inline align-self-center float-right text-right w-75 col-9 p-0">
        <form action="" className="d-inline">
          <select
            style={{
              padding: "0.48em 0.5em 0.55em 0.5em",
              backgroundColor: "#3c404b",
              borderTopLeftRadius: "10px",
              borderBottomLeftRadius: "10px",
              border: "1px solid rgb(60, 64, 75) !important",
            }}
            className="text-white border border-secondary"
            onChange={(e) => setSearchParam(e.target.value)}
          >
            <option value="transactionId">Transaction ID</option>
            <option value="blockId">Block ID</option>
            <option value="blockHeight">Block Height</option>
            <option value="address">Address</option>
          </select>
          <input
            type="text"
            className="text-white border border-secondary"
            id="fname"
            name="fname"
            autoComplete="off"
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Search using Transaction ID, Block ID, Block Height or Address"
            style={{
              padding: "0.35em",
              backgroundColor: "rgb(60, 64, 75, 0.5)",
              width: "50%",
            }}
          ></input>
          <button
            onClick={handleSearchValue}
            // type="submit"
            className="text-white border border-secondary"
            style={{
              backgroundColor: "#3c404b",
              borderTopRightRadius: "10px",
              borderBottomRightRadius: "10px",
              padding: "0.35em 0.5em",
              border: "1px solid rgb(60, 64, 75) !important",
            }}
          >
            <i className="fas fa-search" />
          </button>
        </form>
      </div>
      {transXOpen && (
        <TransactionsModal
          data={searchData?.data && searchData?.data[0]}
          open={transXOpen}
          openClose={openClose}
          isExplorer
        />
      )}
    </>
  );
};

export default SearchBar;
