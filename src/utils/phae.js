import BigNumber from "bignumber.js";
import { getFromStorage } from "@utils/localJSONStorage";

BigNumber.config({ ERRORS: false });

/**
 * Convert Helis to PHAE
 *
 * @param {Strong|Number} value - Value in Helis
 * @returns {BigNumber} Value converted to PHAE
 */
export const fromRawPHAE = (value) =>
  new BigNumber(value || 0).dividedBy(new BigNumber(10).pow(8)).toFixed();

/**
 * Convert PHAE to Helis
 *
 * @param {Strong|Number} value - Value in PHAE
 * @returns {BigNumber} Value converted to Helis
 */
export const toRawPHAE = (value) => {
  const amount = numeral(value).value();
  return new BigNumber(amount * new BigNumber(10).pow(8))
    .decimalPlaces(0)
    .toNumber();
};

export const getPrefix = () => {
  let currentNet = getFromStorage("currentNetwork", []);
  let parse = JSON.parse(currentNet);
  return currentNet ? parse.prefix.toUpperCase() : "";
};

export const getAmount = (data) => {
  let amount = "-";
  if (data.asset.amount) {
    amount = data.asset?.amount / 10 ** 8 + ` ` + getPrefix();
  }
  if (data.asset?.unlockObjects) {
    amount = data.asset?.unlockObjects[0]?.amount / 10 ** 8 + ` ` + getPrefix();
  }
  if (data.asset?.votes) {
    amount = data.asset.votes[0]?.amount / 10 ** 8 + ` ` + getPrefix();
  }

  return amount;
}