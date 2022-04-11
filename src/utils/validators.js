import * as bitcoin from "bitcoinjs-lib";
import { cryptography } from "@phaeton/phaeton-cryptography-web";
// import numeral from 'numeral';

import { tokenMap } from "@constants";

/**
 * Validates the given address with respect to the tokenType
 * @param {String} tokenType
 * @param {String} address
 * @param {Object} network The network config from Redux store
 * @returns {Number} -> 0: valid, 1: invalid, -1: empty
 */
export const validateAddress = (tokenType, address, network) => {
  if (address === "") {
    return -1;
  }

  switch (tokenType) {
    // Reference: https://github.com/bitcoinjs/bitcoinjs-lib/issues/890
    case tokenMap.PHAE.key:
      try {
        bitcoin.address.fromBase58Check(address); // eliminates segwit addresses
        bitcoin.address.toOutputScript(address, network.networks.BTC.network);
        return 0;
      } catch (e) {
        return 1;
      }

    case tokenMap.PHAE.key:
      try {
        return cryptography.validateBase32Address(address) ? 0 : 1;
      } catch (e) {
        return 1;
      }
    default:
      return 1;
  }
};

