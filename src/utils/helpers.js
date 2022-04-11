import http from "@utils/http";

const httpPrefix = "/api/v2";
const path = `${httpPrefix}/transactions/schemas`;


/**
 * Removes undefined keys from an object.
 * @param {Object} obj - Source object
 * @returns {Object} - Simplified object
 */
export const removeUndefinedKeys = obj => Object.keys(obj).reduce((acc, key) => {
  const item = obj[key];

  if (typeof item !== 'undefined') {
    acc[key] = item;
  }

  return acc;
}, {});

/**
 * Checks if the given collection is empty.
 * @param {Object|Array} collection
 * @returns {Boolean}
 */
export const isEmpty = (collection) => {
  if (Array.isArray(collection)) {
    return collection.length === 0;
  }

  return Object.keys(collection).length === 0;
};

/**
 * Filters object keys by given value
 * @param {Object} object - object to filter on
 * @param {Any} value - value to be matched against object keys
 * @returns {Array} array of matching keys
 */
export const filterObjectPropsWithValue = (object = {}, value) => (
  Object.keys(object).filter(key => object[key] === value)
);

/**
 * Creates mailto link from an error
 * @param {string} error - error message to put into the email body
 * @returns {sting} mailto link with recipient, subject, and body
 */
export const getErrorReportMailto = (error = 'Unknown error occured') => {
  const recipient = 'techsupport@phaeton.io';
  const subject = `User Reported Error - Phaeton-Desktop-v.1.0`;
  const body = encodeURIComponent(`\nImportant metadata for the team, please do not edit: \n\n${error}\n`);
  return `mailto:${recipient}?&subject=${subject}&body=${body}`;
};

/**
 * Checks if a given parameter is a React component
 *
 * @param {any} component - the target to test
 * @returns {string|boolean} - Component type or false
 */
export const isReactComponent = (component) => {
  if (typeof component === 'function' && component.prototype.isReactComponent) {
    return 'class';
  }
  if (typeof component === 'function' && typeof component().$$typeof === 'symbol') {
    return 'function';
  }
  return false;
};

/**
 * Uses M and K to define million and thousand.
 *
 * @param {Number} num - Given number like 2500
 * @param {Number} precision - The number of floating digits
 * @returns {String} Stringified number like 2.5K
 */
export const kFormatter = (num, precision = 0) => {
  if (Number(num) > 999999) {
    return `${(Number(num) / 1000000).toFixed(precision)}M`;
  }
  if ((Number(num)) > 999) {
    return `${(Number(num) / 1000).toFixed(precision)}K`;
  }
  return num;
};

export const getSchemas = ({ baseUrl }) =>
  http({
    path: path,
    baseUrl,
  });
