import * as cryptography from "@phaeton/phaeton-cryptography-web";
import * as PhaetonPassphrase from "@phaeton/phaeton-passphrase";
import { regex } from "@constants";

/**
 * Extracts Phaeton PublicKey from a given valid Mnemonic passphrase
 *
 * @param {String} passphrase - Valid Mnemonic passphrase
 * @returns {String?} - Extracted publicKey for a given valid passphrase
 */
export const extractPublicKey = async (passphrase) => {
  if (PhaetonPassphrase.Mnemonic.validateMnemonic(passphrase)) {
    const key = await cryptography.getPrivateAndPublicKeyFromPassphrase(
      passphrase
    );
    return key;
  }
  throw Error("Invalid passphrase");
};

/**
 * Extracts address from publicKey
 *
 * @param {String} data PublicKey in Hex
 * @returns {String} - address derived from the given publicKey
 */
export const extractAddressFromPublicKey = (data) => {
  if (regex.publicKey.test(data)) {
    const binaryPublicKey = Buffer.from(data, "hex");
    return cryptography
      .getBase32AddressFromPublicKey(binaryPublicKey)
      .toString("hex");
  }
  if (Buffer.isBuffer(data)) {
    return cryptography.getBase32AddressFromPublicKey(data);
  }
  throw Error(`Unable to convert publicKey ${data} to address`);
};

/**
 * Extracts address from Mnemonic passphrase
 *
 * @param {String} data Valid Mnemonic passphrase
 * @returns {String} - address derived from the given passphrase
 */
export const extractAddressFromPassphrase = async (data) => {
  if (PhaetonPassphrase.Mnemonic.validateMnemonic(data)) {
    const crypo = await cryptography.getPhaeton32AddressFromPassphrase(data);
    return crypo;
  }
  throw Error("Invalid passphrase");
};

/**
 * Returns a shorter version of a given address
 * by replacing characters by ellipsis except for
 * the first and last 3.
 * @param {String} address phae or BTC address
 * @param {String?} size An option of small and medium
 * @returns {String} Truncated address
 */
export const truncateAddress = (address, size = "small") => {
  if (!address) return address;
  const reg = size === "small" && regex.phaeAddressTrunk;
  return address.replace(reg, "$1...$3");
};
