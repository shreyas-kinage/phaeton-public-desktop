export const networkKeys = {
  mainNet: "mainnet",
  testNet: "testnet",
  customNode: "customNode",
};

export const apiV1 = "/api/v1/";
export const apiV2 = "/api/v2/";
export const api = "/api/";

// eslint-disable-next-line no-unused-vars
export const initialSupply = 10000000000000000;

const networks = {
  [networkKeys.mainNet]: {
    label: "Mainnet",
    serviceUrl: "http://service.test-net.phaeton.io",
  },
  [networkKeys.testNet]: {
    label: "Testnet",
    serviceUrl: "http://service.test-net.phaeton.io",
  },
  [networkKeys.customNode]: {
    label: "Custom Service Node",

    // a default value, to keep the object signature consistent
    serviceUrl: "http://service.test-net.phaeton.io",
  },
};

export default networks;
