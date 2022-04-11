import React, { useEffect, useState } from "react";
import http from "@utils/http";
import { DarkButton } from "@tools/Button/index";
import AccountInfo from "@components/wallet/overview/accountInfo";
import Box from "@tools/box";
import { getDateAndTimeFromValue } from "@utils/datetime";
import BoxContent from "@tools/box/content";
import { exactPath } from "@utils/getNetwork";
import { apiV2 } from "@constants/networks";
import _ from "lodash";
import { CommonDetails, TransactionType, Voter, Unvoter, Nonce } from "@subcomponents/transactionsTable/modalDetails";
import { getPrefix } from "@utils/phae";
import NavSimple from "@subcomponents/navigationBars/navBar/NavSimple";

const VoteUnvoteDetails = (props) => {
    const [accountDetails, setAccountDetails] = useState([]);
    const [blockHeight, setBlockHeight] = useState([]);
    const [typeDetails, setTypeDetails] = useState([]);
    const [transactionData, setTransactionData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadMore, setLoadMore] = useState(false);
    const prefix = getPrefix();
    const activeToken = prefix;
    const account = accountDetails;

    const search = props.location.search;
    const params = new URLSearchParams(search);
    const address = params.get('address');
    const txID = params.get('transactionId');

    const payload = {
        address: address,
    };

    const tranXId = txID;
    const basePath = exactPath();



    const handleLoadMore = () => {
        setLoadMore(!loadMore)
    }

    const fetchAccounts = async () => {
        const accounts = await http({
            path: "accounts",
            baseUrl: `${basePath}${apiV2}`,
            params: payload,
        });
        setIsLoading(false);
        setAccountDetails(accounts?.data[0]);
    };

    const fetchTransaction = async () => {
        const payload = {
            transactionId: tranXId,
            limit: 100,
        };
        const response = await http({
            path: "transactions",
            baseUrl: `${basePath}${apiV2}`,
            params: payload,
        });
        setTransactionData(response?.data[0]);
        setIsLoading(false);
    };

    const fetchData = async () => {
        const response = await http({
            path: "/blocks",
            baseUrl: `${basePath}${apiV2}`,
        });
        setBlockHeight(response.data[0]);
        setIsLoading(false);
    };

    const goBack = () => {
        setTimeout(function () {
            window.location.reload();
        }, 500);
        window.history.go(-1);
    };

    const VotesRow = ({ typeDetails }) => {
        return (
            <>
                <div className="py-2 row m-0">
                    <span
                        className="pt-1 px-0 mx-2 font-weight-bold col-12 text-white"
                        style={{ fontSize: "15px" }}
                    >
                        {typeDetails.voter != null ? `Votes (${typeDetails?.votes?.length})` : `Unvotes (${typeDetails?.votes?.length})`}

                    </span>
                    <div className="d-block my-3 col-12 px-0 text-white table-responsive rounded-top" style={{ backgroundColor: "#373c47" }}>
                        <table className="table table-hover table-borderless m-0">
                            <thead className="tableheader border-bottom">
                                <tr className="text-white">
                                    <th scope="row" className="w-50">
                                        Address
                                    </th>
                                    <th scope="row" className="w-50">
                                        Amount
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {typeDetails?.votes?.map((vote, id) => (
                                    <tr className="tablerow border-bottom border-top" key={id}>
                                        <td scope="col">
                                            <span
                                                className="font-weight-light text-white"
                                                style={{ fontSize: "14px" }}
                                            >
                                                {vote?.delegateAddress}
                                            </span>
                                        </td>
                                        <td scope="col">
                                            <span
                                                className="font-weight-light text-white"
                                                style={{ fontSize: "14px" }}
                                            >
                                                {vote?.amount / 10 ** 8} {prefix}
                                            </span>
                                        </td>
                                    </tr>

                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        );
    }

    useEffect(() => {
        if (transactionData?.moduleAssetId == "2:0") {
            const sendAndReceive = {
                moduleAssetId: "2:0",
                sender: transactionData?.sender?.address,
                recipient: transactionData?.asset?.recipient?.address,
                amount: amount && amount / 10 ** 8,
                message: transactionData?.asset?.transactionData,
                tranxID: transactionData?.id,
                date: getDateAndTimeFromValue(transactionData?.block?.timestamp),
                blockID: transactionData?.block?.id,
                blockHeight: transactionData?.height,
                fees: transactionData?.fee && transactionData?.fee / 10 ** 8,
                confirmations: blockHeight?.height - transactionData?.height,
                nonce: transactionData.nonce,
            }
            setTypeDetails(sendAndReceive);
        }

        if (transactionData?.moduleAssetId == "5:0") {
            const register = {
                moduleAssetId: "5:0",
                sender: transactionData?.sender?.address,
                tranxID: transactionData?.id,
                date: getDateAndTimeFromValue(transactionData?.block?.timestamp),
                blockID: transactionData?.block?.id,
                blockHeight: transactionData?.height,
                fees: transactionData?.fee && transactionData?.fee / 10 ** 8,
                confirmations: blockHeight?.height - transactionData?.height,
                nonce: transactionData.nonce,
            }
            setTypeDetails(register);
        }

        if (transactionData?.moduleAssetId == "5:1" && transactionData?.asset?.votes[0]?.amount < 0) {
            const unvote = {
                moduleAssetId: "5:1",
                unvoter: transactionData?.sender?.address,
                tranxID: transactionData?.id,
                date: getDateAndTimeFromValue(transactionData?.block?.timestamp),
                blockID: transactionData?.block?.id,
                blockHeight: transactionData?.height,
                fees: transactionData?.fee && transactionData?.fee / 10 ** 8,
                confirmations: blockHeight?.height - transactionData?.height,
                votes: transactionData?.asset?.votes,
                nonce: transactionData.nonce,
            }
            setTypeDetails(unvote);
        }

        if (transactionData?.moduleAssetId == "5:1" && transactionData?.asset?.votes[0]?.amount > 0) {
            const vote = {
                moduleAssetId: "5:1",
                voter: transactionData?.sender?.address,
                tranxID: transactionData?.id,
                date: getDateAndTimeFromValue(transactionData?.block?.timestamp),
                blockID: transactionData?.block?.id,
                blockHeight: transactionData?.height,
                fees: transactionData?.fee && transactionData?.fee / 10 ** 8,
                confirmations: blockHeight?.height - transactionData?.height,
                votes: transactionData?.asset?.votes,
                nonce: transactionData.nonce,
            }
            setTypeDetails(vote);
        }

        if (transactionData?.moduleAssetId == "5:2") {
            const unlock = {
                moduleAssetId: "5:2",
                sender: transactionData?.sender?.address,
                delegateAddress: transactionData?.asset?.unlockObjects && transactionData?.asset?.unlockObjects[0]?.delegateAddress,
                unvoteHeight: transactionData?.asset?.unlockObjects && transactionData?.asset?.unlockObjects[0]?.unvoteHeight,
                amount: amount && amount / 10 ** 8,
                message: transactionData?.asset?.transactionData,
                tranxID: transactionData?.id,
                date: getDateAndTimeFromValue(transactionData?.block?.timestamp),
                blockID: transactionData?.block?.id,
                blockHeight: transactionData?.height,
                fees: transactionData?.fee && transactionData?.fee / 10 ** 8,
                confirmations: blockHeight?.height - transactionData?.height,
                nonce: transactionData.nonce,
            }
            setTypeDetails(unlock);
        }

    }, [blockHeight])

    useEffect(() => {
        fetchAccounts();
        fetchTransaction();
        fetchData();
    }, []);

    return (
        <>
            <NavSimple />
            <div className="m-auto p-4">
                <AccountInfo
                    activeToken={activeToken}
                    address={accountDetails?.summary?.address}
                    username={accountDetails?.summary?.username}
                    publicKey={accountDetails?.summary?.publicKey}
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
                {typeDetails.voter != null ? "Vote Transaction" : "Unvote Transaction"}
            </h5>
            <div className="m-auto pb-3" style={{ width: "95%" }}>
                <Box isLoading={isLoading}>
                    <BoxContent>
                        <TransactionType data={transactionData} />
                        {typeDetails.voter != null && loadMore && <Voter vote={typeDetails} />}
                        {typeDetails.voter != null
                            && !loadMore &&
                            <div className="d-flex">
                                <div className="w-50">
                                    <Voter vote={typeDetails} />
                                </div>
                                <div className="py-2 row m-0 border-bottom w-50">
                                    <span
                                        className="pt-1 px-0 mx-2 font-weight-bold col-12 text-white"
                                        style={{ fontSize: "15px" }}
                                    >
                                        Total Votes
                                    </span>
                                    <div className="d-block py-2 col-12 px-0">
                                        <span
                                            className="p-2 font-weight-light text-white"
                                            style={{ fontSize: "14px" }}
                                        >
                                            {typeDetails?.votes?.length}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        }
                        {typeDetails.unvoter != null && loadMore && <Unvoter unvote={typeDetails} />}
                        {typeDetails.unvoter != null
                            && !loadMore &&
                            <div className="d-flex">
                                <div className="w-50">
                                    <Unvoter unvote={typeDetails} />
                                </div>
                                <div className="py-2 row m-0 border-bottom w-50">
                                    <span
                                        className="pt-1 px-0 mx-2 font-weight-bold col-12 text-white"
                                        style={{ fontSize: "15px" }}
                                    >
                                        Total Unvotes
                                    </span>
                                    <div className="d-block py-2 col-12 px-0">
                                        <span
                                            className="p-2 font-weight-light text-white"
                                            style={{ fontSize: "14px" }}
                                        >
                                            {typeDetails?.votes?.length}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        }
                        {loadMore && <Nonce data={typeDetails} />}
                        {loadMore && <CommonDetails common={typeDetails} />}
                        {loadMore && <VotesRow typeDetails={typeDetails} />}
                        <DarkButton
                            style={{
                                padding: "4px 12px",
                                color: "#ff8f8f",
                                fontSize: "12px",
                                boxShadow: "none",
                            }}
                            startIcon={loadMore ? "fas fa-chevron-up fa-sm mr-0" : "fas fa-chevron-down fa-sm mr-0"}
                            classes="p-2 border border-dark mt-2"
                            content={loadMore ? "Collapse" : "Expand"}
                            onClick={handleLoadMore}
                        />
                    </BoxContent>
                </Box>
            </div>

        </>
    );
};

export default VoteUnvoteDetails;
