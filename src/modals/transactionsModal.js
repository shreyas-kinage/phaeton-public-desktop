import React, { useEffect, useState } from "react";
import { getDateAndTimeFromValue } from "@utils/datetime";
import { Modal } from "react-bootstrap";
import Box from "@tools/box";
import BoxContent from "@tools/box/content";
import http from "@utils/http";
import { exactPath } from "@utils/getNetwork";
import { getFromStorage } from "@utils/localJSONStorage";
import toastDisplay from "../app/toast";
import { apiV2 } from "@constants/networks";
import {
  CommonDetails, TransactionType, AmountAndMessage, AccountDetails,
  Sender, Recipient, Voter, Unvoter, AllVote, UnlockDetails, Nonce,
} from "@subcomponents/transactionsTable/modalDetails";
import LoadingScreen from "@subcomponents/loadingScreen/loadingScreen";
import styles from "./../assets/css/modal.css";

const TransactionsModal = (props) => {
  const [blockHeight, setBlockHeight] = useState([]);
  const [typeDetails, setTypeDetails] = useState([]);
  const [currentNet, setCurrentNet] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data, details, isExplorer } = props;
  const amount = data?.asset?.unlockObjects
    ? data?.asset?.unlockObjects[0].amount
    : data?.asset?.amount;
  const basePath = exactPath();

  useEffect(() => {
    let net = JSON.parse(getFromStorage("currentNetwork", []));
    setCurrentNet(net.Name);
    if (data?.moduleAssetId == "2:0") {
      const sendAndReceive = {
        moduleAssetId: "2:0",
        sender: data?.sender?.address,
        recipient: data?.asset?.recipient?.address,
        amount: amount && amount / 10 ** 8,
        message: data?.asset?.data,
        tranxID: data?.id,
        date: getDateAndTimeFromValue(data?.block?.timestamp),
        blockID: data?.block?.id,
        blockHeight: data?.height,
        fees: data?.fee && data?.fee / 10 ** 8,
        confirmations: blockHeight?.height - data?.height,
        nonce: data?.nonce,
      }
      setTypeDetails(sendAndReceive);
    }

    if (data?.moduleAssetId == "5:0") {
      const register = {
        moduleAssetId: "5:0",
        sender: data?.sender?.address,
        tranxID: data?.id,
        date: getDateAndTimeFromValue(data?.block?.timestamp),
        blockID: data?.block?.id,
        blockHeight: data?.height,
        fees: data?.fee && data?.fee / 10 ** 8,
        confirmations: blockHeight?.height - data?.height,
        nonce: data?.nonce,
      }
      setTypeDetails(register);
    }

    if (data?.moduleAssetId == "5:1" && data?.asset?.votes[0]?.amount < 0) {
      const unvote = {
        moduleAssetId: "5:1",
        unvoter: data?.sender?.address,
        tranxID: data?.id,
        date: getDateAndTimeFromValue(data?.block?.timestamp),
        blockID: data?.block?.id,
        blockHeight: data?.height,
        fees: data?.fee && data?.fee / 10 ** 8,
        confirmations: blockHeight?.height - data?.height,
        votes: data?.asset?.votes,
        nonce: data?.nonce,
      }
      setTypeDetails(unvote);
    }

    if (data?.moduleAssetId == "5:1" && data?.asset?.votes[0]?.amount > 0) {
      const vote = {
        moduleAssetId: "5:1",
        voter: data?.sender?.address,
        tranxID: data?.id,
        date: getDateAndTimeFromValue(data?.block?.timestamp),
        blockID: data?.block?.id,
        blockHeight: data?.height,
        fees: data?.fee && data?.fee / 10 ** 8,
        confirmations: blockHeight?.height - data?.height,
        votes: data?.asset?.votes,
        nonce: data?.nonce,
      }
      setTypeDetails(vote);
    }

    if (data?.moduleAssetId == "5:2") {
      const unlock = {
        moduleAssetId: "5:2",
        sender: data?.sender?.address,
        delegateAddress: data?.asset?.unlockObjects && data?.asset?.unlockObjects[0]?.delegateAddress,
        unvoteHeight: data?.asset?.unlockObjects && data?.asset?.unlockObjects[0]?.unvoteHeight,
        amount: amount && amount / 10 ** 8,
        message: data?.asset?.data,
        tranxID: data?.id,
        date: getDateAndTimeFromValue(data?.block?.timestamp),
        blockID: data?.block?.id,
        blockHeight: data?.height,
        fees: data?.fee && data?.fee / 10 ** 8,
        confirmations: blockHeight?.height - data?.height,
        nonce: data?.nonce,
      }
      setTypeDetails(unlock);
    }

  }, [blockHeight])

  const fetchData = async () => {
    const response = await http({
      path: "blocks",
      baseUrl: `${basePath}${apiV2}`,
    });
    if (response == null) {
      toastDisplay(
        "Error fetching user details !",
        "error"
      );
      return;
    }
    setBlockHeight(response.data[0]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const RegisterDelegate = ({ data, typeDetails, moduleAssetId }) => {
    var show = false;
    if (moduleAssetId == typeDetails.moduleAssetId) {
      show = true;
    }
    return (
      <div className={show ? "d-block" : "d-none"}>
        <TransactionType data={data} misc={details} isExplorer={isExplorer} />
        <Nonce data={data} />
        <AccountDetails account={data} />
        <CommonDetails common={typeDetails} />
      </div>
    )
  };

  const VoteOrUnvoteDelegate = ({ data, typeDetails, moduleAssetId }) => {
    var show = false;
    if (moduleAssetId == typeDetails.moduleAssetId) {
      show = true;
    }
    return (
      <div className={show ? "d-block" : "d-none"}>
        <TransactionType data={data} misc={details} isExplorer={isExplorer} />
        {typeDetails.voter != null
          && <Voter vote={typeDetails} />}
        {typeDetails.unvoter != null
          && <Unvoter unvote={typeDetails} />
        }
        <Nonce data={data} />
        <CommonDetails common={typeDetails} />
        <AllVote data={typeDetails} fullData={data} />
      </div>
    )
  }

  const TokenTransfer = ({ data, typeDetails, moduleAssetId }) => {
    var show = false;
    if (moduleAssetId == typeDetails.moduleAssetId) {
      show = true;
    }
    return (
      <div className={show ? "d-block" : "d-none"}>
        <TransactionType data={data} misc={details} isExplorer={isExplorer} />
        <Sender sendData={typeDetails} />
        <Recipient receiveData={typeDetails} />
        <Nonce data={data} />
        <AmountAndMessage details={typeDetails} />
        <CommonDetails common={typeDetails} />
      </div>
    )
  };

  const UnlockToken = ({ data, typeDetails, moduleAssetId }) => {
    var show = false;
    if (moduleAssetId == typeDetails.moduleAssetId) {
      show = true;
    }
    return (
      <div className={show ? "d-block" : "d-none"}>
        <TransactionType data={data} misc={details} isExplorer={isExplorer} />
        <Sender sendData={typeDetails} />
        <div className="d-flex">
          <div className="col-6 p-0">
            <AmountAndMessage details={typeDetails} unlock />
          </div>
          <div className="col-6 p-0">
            <Nonce data={data} />
          </div>
        </div>
        <UnlockDetails details={typeDetails} />
        <CommonDetails common={typeDetails} />
      </div>
    )
  }

  return (
    <>
      {isLoading ? <LoadingScreen /> : ''}
      <Modal
        className="modalblack"
        show={props.open}
        onHide={props.openClose}
        size="lg"
        centered
      >
        <Modal.Header className="modalheader" >
          <Modal.Title>Transaction Details
            <i className="far fa-times-circle fa-lg p-2 mr-2 icon" aria-hidden="true"
              title="Close"
              style={{ cursor: "pointer" }}
              onClick={props.openClose}></i>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={`modalBody ${styles.transactionBg}`}>
          <div className="modaltransaction row mx-auto my-auto justify-content-center">
            <Box className="text-white" isLoading={isLoading}>
              <BoxContent style={{ padding: 0, backgroundColor: "transparent" }}>
                <RegisterDelegate
                  data={data}
                  typeDetails={typeDetails}
                  moduleAssetId={"5:0"}
                />
                <TokenTransfer
                  data={data}
                  typeDetails={typeDetails}
                  moduleAssetId={"2:0"}
                />
                <VoteOrUnvoteDelegate
                  data={data}
                  typeDetails={typeDetails}
                  moduleAssetId={"5:1"}
                />
                <UnlockToken
                  data={data}
                  typeDetails={typeDetails}
                  moduleAssetId={"5:2"}
                />
              </BoxContent>
            </Box>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default TransactionsModal;
