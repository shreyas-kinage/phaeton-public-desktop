import config from "../utils/config.json";
import { setInStorage, getFromStorage } from "@utils/localJSONStorage";

export const exactPath = () => {
  try {
    const newNetwork = getFromStorage("currentNetwork", []);
    let currentNetworkObject = JSON.parse(newNetwork);
    return currentNetworkObject.serviceUrl;
  } catch {
    setInStorage("currentNetwork", JSON.stringify(config.networks[0]));
    setInStorage("networkDetails", JSON.stringify(config));
    return config.networks[0].serviceUrl;
  }
};
