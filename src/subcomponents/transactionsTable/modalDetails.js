import React from 'react';
import CopyToClipboard from "@tools/copyToClipboard";
import { getModuleAssetTitle } from "@utils/moduleAssets";
import { routes } from "@constants";
import { truncateAddress } from "@utils/account";
import { Link } from 'react-router-dom';
import { getFromStorage } from "@utils/localJSONStorage";
import { getPrefix } from "@utils/phae";

const prefix = getPrefix();

const CommonDetails = ({ common }) => {
    return (
        <>
            <div className="row m-0 border-bottom">
                <div className="col-6 p-0">
                    <div className="d-flex py-2 row m-0">
                        <span
                            className="pt-1 px-0 mx-2 font-weight-bold col-12 text-white"
                            style={{ fontSize: "15px" }}
                        >
                            Transaction ID
                        </span>
                        <div className="pt-3 mx-2 text-white">
                            <CopyToClipboard
                                text={truncateAddress(common.tranxID)}
                                value={common.tranxID}
                                className="tx-id"
                            />
                        </div>
                    </div>
                </div>
                <div className="col-6 p-0">
                    <div className="d-flex py-2 row m-0">
                        <span
                            className="pt-1 px-0 mx-2 font-weight-bold col-12 text-white"
                            style={{ fontSize: "15px" }}
                        >
                            Timestamp
                        </span>
                        <span className="pt-3 mx-2 text-white">{common.date}</span>
                    </div>
                </div>
            </div>

            <div className="row m-0 border-bottom">
                <div className="col-6 p-0">
                    <div className="d-flex py-2 row m-0">
                        <span
                            className="pt-1 px-0 mx-2 font-weight-bold col-12 text-white"
                            style={{ fontSize: "15px" }}
                        >
                            Block ID
                        </span>
                        <div className="pt-3 mx-2 text-white">
                            <CopyToClipboard
                                text={truncateAddress(common.blockID)}
                                value={common.blockID}
                                className="tx-id"
                            />
                        </div>
                    </div>
                </div>
                <div className="col-6 p-0">
                    <div className="d-flex py-2 row m-0">
                        <span
                            className="pt-1 px-0 mx-2 font-weight-bold col-12 text-white"
                            style={{ fontSize: "15px" }}
                        >
                            Block Height
                        </span>
                        <span className="pt-3 mx-2 text-white">{common.blockHeight}</span>
                    </div>
                </div>
            </div>

            <div className="row m-0 border-bottom">
                <div className="col-6 p-0">
                    <div className="d-flex py-2 row m-0">
                        <span
                            className="pt-1 px-0 mx-2 font-weight-bold col-12 text-white"
                            style={{ fontSize: "15px" }}
                        >
                            Transaction fee
                        </span>
                        <span className="pt-3 mx-2 text-white">{common.fees} {prefix}</span>
                    </div>
                </div>
                <div className="col-6 p-0">
                    <div className="d-flex py-2 row m-0">
                        <span
                            className="pt-1 px-0 mx-2 font-weight-bold col-12 text-white"
                            style={{ fontSize: "15px" }}
                        >
                            Confirmations
                        </span>
                        <span className="pt-3 mx-2 text-white">{common.confirmations}</span>
                    </div>
                </div>
            </div>
        </>
    )
}

const TransactionType = ({ data, misc, isExplorer }) => {

    let currentNet = JSON.parse(getFromStorage("currentNetwork", []));
    let show = currentNet.Name === "Mainnet" || currentNet.Name === "Testnet";
    const isReceive = misc && misc?.summary?.address != data?.sender?.address;
    const icon = data?.asset?.votes && data?.asset?.votes[0]?.amount < 0
        ? 'fas fa-user-times'
        : getModuleAssetTitle(data?.moduleAssetId)[1];

    const type = data?.asset?.votes && data?.asset?.votes[0]?.amount < 0
        ? 'Unvote'
        : getModuleAssetTitle(data?.moduleAssetId)[0];

    const redirectToExplorer = () => {
        if (show) {
            window.open(currentNet.explorerURL + `/transaction?id=${data.id}&currentNet=${currentNet.Name}`, "_blank");
        }
    }

    return (
        <>{isExplorer && getModuleAssetTitle(data?.moduleAssetId)[0] == "Send" ?
            <div className="d-flex justify-content-between border-bottom pb-4">
                <div className='d-flex'>
                    <div className="text-white">
                        <i className={`${getModuleAssetTitle(data?.moduleAssetId)[1]} pl-1 fa-lg pr-2`} />
                    </div>
                    <span className='text-white text-white d-flex align-items-center'>
                        Token Transfer
                        <sup>
                            <i className="fas fa-info-circle fa-sm ml-1" title="Transaction type" />
                        </sup>
                    </span>
                </div>
                <div className='text-right float-right d-flex align-items-center'>
                    <i title='View in Explorer' className={show ? 'fas fa-external-link-alt' : ''} style={{ cursor: "pointer" }} onClick={redirectToExplorer} />
                </div>
            </div>
            : isReceive && getModuleAssetTitle(data?.moduleAssetId)[0] == 'Send' ?
                <div className="d-flex justify-content-between border-bottom pb-2">
                    <div className='d-flex'>
                        <svg className='text-white' width="40" height="40" viewBox="0 0 1163 1163" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M783.252 421.214C794.968 409.498 794.968 390.503 783.252 378.787C771.536 367.071 752.542 367.071 740.826 378.787L783.252 421.214ZM370 762.039C370 778.608 383.432 792.039 400 792.039H670C686.569 792.039 700 778.608 700 762.039C700 745.471 686.569 732.039 670 732.039H430L430 492.039C430 475.471 416.569 462.039 400 462.039C383.432 462.039 370 475.471 370 492.039L370 762.039ZM740.826 378.787L378.787 740.826L421.214 783.252L783.252 421.214L740.826 378.787Z" fill="white" />
                        </svg>
                        <span className='text-white text-white d-flex align-items-center'>
                            Receive
                            <sup>
                                <i className="fas fa-info-circle fa-sm ml-1" title="Transaction type" />
                            </sup>
                        </span>
                    </div>
                    <div className='text-right float-right d-flex align-items-center'>
                        <i title='View in Explorer' className={show ? 'fas fa-external-link-alt' : ''} style={{ cursor: "pointer" }} onClick={redirectToExplorer} />
                    </div>
                </div>
                :
                <div className={getModuleAssetTitle(data?.moduleAssetId)[0] == 'Send'
                    ? "d-flex justify-content-between border-bottom pb-2" : "d-flex justify-content-between border-bottom pb-4"}>
                    <div className='d-flex'>
                        {getModuleAssetTitle(data?.moduleAssetId)[0] == 'Send' ?
                            <svg className='text-white' width="40" height="40" viewBox="0 0 1163 1163" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M378.787 740.825C367.071 752.541 367.071 771.536 378.787 783.252C390.503 794.968 409.497 794.968 421.213 783.252L378.787 740.825ZM792.039 400C792.039 383.431 778.607 370 762.039 370H492.039C475.47 370 462.039 383.431 462.039 400C462.039 416.568 475.47 430 492.039 430H732.039V670C732.039 686.568 745.47 700 762.039 700C778.607 700 792.039 686.568 792.039 670V400ZM421.213 783.252L783.252 421.213L740.825 378.787L378.787 740.825L421.213 783.252Z" fill="white" />
                            </svg>
                            : getModuleAssetTitle(data?.moduleAssetId)[0] == "Unlock"
                                ? <>
                                    <div className="sendbox px-2 text-white">
                                        <svg className="" width="26" height="28" viewBox="0 0 762 515" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                                <i className={`${icon} fa-lg pt-1 mx-2 text-white`} />}

                        <span className='text-white text-white d-flex align-items-center'>
                            {type}
                            <sup>
                                <i className="fas fa-info-circle fa-sm ml-1 text-white" title="Transaction type" />
                            </sup>
                        </span>
                    </div>
                    <div className='text-right float-right d-flex align-items-center'>
                        <i title='View in Explorer' className={show ? 'fas fa-external-link-alt' : ''} style={{ cursor: "pointer" }} onClick={redirectToExplorer} />
                    </div>
                </div>
        }
        </>
    )
}

const AmountAndMessage = ({ details, unlock }) => {
    return (
        <div className="row m-0 border-bottom">
            <div className="col-6 p-0">
                <div className="d-flex py-2 row m-0">
                    <span
                        className="pt-1 px-0 mx-2 font-weight-bold col-12 text-white"
                        style={{ fontSize: "15px" }}
                    >
                        Amount of transaction
                    </span>
                    <div className="pt-3 mx-2 text-white">{details.amount} {prefix}</div>
                </div>
            </div>
            <div className={unlock ? "d-none" : "col-6 p-0"}>
                <div className="d-flex py-2 row m-0">
                    <span
                        className="pt-1 px-0 mx-2 font-weight-bold col-12 text-white"
                        style={{ fontSize: "15px" }}
                    >
                        Message
                    </span>
                    <span className="pt-3 mx-2 text-white">{details.message ? details.message : "-"}</span>
                </div>
            </div>
        </div>
    )
}

const AccountDetails = ({ account }) => {
    return (<div className="row m-0 border-bottom">
        <div className="col-6 p-0">
            <div className="d-flex py-2 row m-0">
                <span
                    className="pt-1 px-0 mx-2 font-weight-bold col-12 text-white"
                    style={{ fontSize: "15px" }}
                >
                    Account Username
                </span>
                <div className="pt-3 mx-2 text-white">{account?.asset?.username}</div>
            </div>
        </div>
        <div className="col-6 p-0">
            <div className="d-flex py-2 row m-0">
                <span
                    className="pt-1 px-0 mx-2 font-weight-bold col-12 text-white"
                    style={{ fontSize: "15px" }}
                >
                    Account Address
                </span>
                <div className="pt-3 mx-2 text-white">
                    <CopyToClipboard
                        text={truncateAddress(account?.sender?.address)}
                        value={account?.sender?.address}
                        className="tx-id"
                    />
                </div>
            </div>
        </div>
    </div>)
}

const Sender = ({ sendData }) => {
    return (
        <>
            <div className="d-flex border-bottom py-2 row m-0">
                <span
                    className="pt-1 px-0 mx-2 font-weight-bold col-12 text-white"
                    style={{ fontSize: "15px" }}
                >
                    Sender
                </span>
                <div className="pt-3 mx-2 text-white">{sendData.sender}</div>
            </div>
        </>
    )
}

const Recipient = ({ receiveData }) => {
    return (
        <>
            <div className="d-flex border-bottom py-2 row m-0">
                <span
                    className="pt-1 px-0 mx-2 font-weight-bold col-12 text-white"
                    style={{ fontSize: "15px" }}
                >
                    Recipient
                </span>
                <div className="pt-3 mx-2 text-white">{receiveData.recipient}</div>
            </div>
        </>
    )
}

const Nonce = ({ data }) => {
    return (
        <>
            <div className="d-flex border-bottom py-2 row m-0">
                <span
                    className="pt-1 px-0 mx-2 font-weight-bold col-12 text-white"
                    style={{ fontSize: "15px" }}
                >
                    Nonce
                </span>
                <div className="pt-3 mx-2 text-white">{data.nonce}</div>
            </div>
        </>
    )
}

const Voter = ({ vote }) => {
    return (
        <>
            <div className="d-flex border-bottom py-2 row m-0">
                <span
                    className="pt-1 px-0 mx-2 font-weight-bold col-12 text-white"
                    style={{ fontSize: "15px" }}
                >
                    Voter
                </span>
                <div className="pt-3 mx-2 text-white">{vote.voter}</div>
            </div>
        </>
    )
}

const Unvoter = ({ unvote }) => {
    return (
        <>
            <div className="d-flex border-bottom py-2 row m-0">
                <span
                    className="pt-1 px-0 mx-2 font-weight-bold col-12 text-white"
                    style={{ fontSize: "15px" }}
                >
                    Unvoter
                </span>
                <div className="pt-3 mx-2 text-white">{unvote.unvoter}</div>
            </div>
        </>
    )
}

const AllVote = ({ data }) => {

    return (
        <>
            <div className="py-2 row m-0">
                <span
                    className="pt-1 px-0 mx-2 font-weight-bold col-12 text-white"
                    style={{ fontSize: "15px" }}
                >
                    {data?.voter != null ? `Votes (${data?.votes?.length})` : `Unvotes (${data?.votes?.length})`}

                </span>
                <div className="d-block py-2 col-12 px-0 text-white">
                    {data?.votes?.map((vote, id) => (
                        <Link
                            key={id}
                            className="text-secondary"
                            to={`${routes.votingDetails.path}?address=${vote?.delegateAddress}&transactionId=${data?.tranxID}`}
                        >
                            <span
                                className="m-2 p-2 bg-light text-dark rounded font-weight-light text-white"
                                style={{ fontSize: "14px" }}
                            >
                                {truncateAddress(vote?.delegateAddress)}
                                <span> &nbsp; {vote?.amount / 10 ** 8} {prefix}</span>
                            </span>
                        </Link>
                    ))}
                </div>
            </div>

        </>
    )
}

const UnlockDetails = ({ details }) => {
    return (
        <>
            <div className="row m-0 border-bottom">
                <div className="col-6 p-0">
                    <div className="d-flex py-2 row m-0">
                        <span
                            className="pt-1 px-0 mx-2 font-weight-bold col-12 text-white"
                            style={{ fontSize: "15px" }}
                        >
                            Delegate Binary Address
                        </span>
                        <div className="pt-3 mx-2 text-white">
                            <CopyToClipboard
                                text={truncateAddress(details.delegateAddress)}
                                value={details.delegateAddress}
                                className="tx-id"
                            /></div>
                    </div>
                </div>
                <div className="col-6 p-0">
                    <div className="d-flex py-2 row m-0">
                        <span
                            className="pt-1 px-0 mx-2 font-weight-bold col-12 text-white"
                            style={{ fontSize: "15px" }}
                        >
                            Unvote Height
                        </span>
                        <span className="pt-3 mx-2 text-white">{details.unvoteHeight}</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export { CommonDetails, TransactionType, AmountAndMessage, AccountDetails, Sender, Recipient, Voter, Unvoter, AllVote, UnlockDetails, Nonce };