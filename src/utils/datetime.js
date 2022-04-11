import moment from "moment";

export const getDateFromUnixTimestamp = (value) => {
  var time = moment(value).format("DD MMM YYYY");
  return time;
};

export const getDateAndTimeFromValue = (value) => {
  var time = new Date(value * 1000);
  time = time.toLocaleString("en-us", {
    hourCycle: 'h23',
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric"
  });
  return time;
}

/**
 * Converts a date in DD-MM-YYYY format to timestamp
 * @param {String} date - Date in DD-MM-YYYY format
 * @returns {Number} - Unix timestamp
 */
export const transformStringDateToUnixTimestamp = (date) =>
  new Date(moment(date, "DD-MM-YYYY").format("MM/DD/YYYY")).valueOf() / 1000;

export default {
  getDateFromUnixTimestamp,
  transformStringDateToUnixTimestamp,
};
