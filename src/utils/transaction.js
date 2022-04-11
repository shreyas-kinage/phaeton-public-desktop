/* eslint-disable max-lines */
import { MODULE_ASSETS_NAME_ID_MAP } from "@constants";
import { getAddressFromPhaeton32Address } from "@phaeton/phaeton-cryptography-web";
import { splitModuleAndAssetIds } from "@utils/moduleAssets";

const {
  transfer,
  voteDelegate,
  registerDelegate,
  unlockToken,
  reclaimPHAE,
  registerMultisignatureGroup,
} = MODULE_ASSETS_NAME_ID_MAP;

const EMPTY_BUFFER = Buffer.from("");
export const convertStringToBinary = (value) => Buffer.from(value, "hex");

/**
 * creates a transaction object to be used with the api client from
 * phaeton elements
 * @param {object} tx - the transaction data
 * @param {string} moduleAssetId - moduleAssetId
 * @returns the transaction object
 */
// eslint-disable-next-line max-statements
const createTransactionObject = (tx, moduleAssetId) => {
  const [moduleID, assetID] = splitModuleAndAssetIds(moduleAssetId);
  const {
    senderPublicKey,
    nonce,
    amount,
    recipientAddress,
    data,
    signatures = [],
    fee = 0,
  } = tx;

  const transaction = {
    moduleID,
    assetID,
    senderPublicKey: convertStringToBinary(senderPublicKey),
    nonce: BigInt(nonce),
    fee: BigInt(fee),
    signatures,
  };

  switch (moduleAssetId) {
    case transfer: {
      const binaryAddress = recipientAddress
        ? getAddressFromPhaeton32Address(recipientAddress)
        : EMPTY_BUFFER;

      transaction.asset = {
        recipientAddress: binaryAddress,
        amount: BigInt(amount),
        data,
      };

      break;
    }

    case registerDelegate: {
      transaction.asset = {
        username: tx.username,
      };
      break;
    }

    case voteDelegate: {
      const votes = tx.votes.map((vote) => ({
        amount: BigInt(vote.amount),
        delegateAddress: getAddressFromPhaeton32Address(vote.delegateAddress),
      }));
      transaction.asset = { votes };
      break;
    }

    case unlockToken: {
      transaction.asset = {
        unlockObjects: tx.unlockObjects.map((unlockObject) => ({
          amount: BigInt(unlockObject.amount),
          delegateAddress: getAddressFromPhaeton32Address(
            unlockObject.delegateAddress
          ),
          unvoteHeight: unlockObject.unvoteHeight,
        })),
      };
      break;
    }

    case reclaimPHAE: {
      transaction.asset = {
        amount: BigInt(amount),
      };
      break;
    }

    case registerMultisignatureGroup: {
      transaction.asset = {
        numberOfSignatures: Number(tx.numberOfSignatures),
        mandatoryKeys: tx.mandatoryKeys.map(convertStringToBinary),
        optionalKeys: tx.optionalKeys.map(convertStringToBinary),
      };
      break;
    }

    default:
      throw Error("Unknown transaction");
  }

  return transaction;
};


/**
 * Gets the amount of a given transaction
 *
 * @param {Object} transaction The transaction object
 * @returns {String} Amount in Beddows/Satoshi
 */
const getTxAmount = ({ moduleAssetId, asset }) => {
  if (moduleAssetId === transfer) {
    return asset.amount;
  }

  if (moduleAssetId === unlockToken) {
    return asset.unlockObjects.reduce(
      (sum, unlockObject) => sum + parseInt(unlockObject.amount, 10),
      0
    );
  }
  if (moduleAssetId === voteDelegate) {
    return asset.votes.reduce((sum, vote) => sum + Number(vote.amount), 0);
  }

  return undefined;
};



export {
  getTxAmount,
  createTransactionObject,
};
