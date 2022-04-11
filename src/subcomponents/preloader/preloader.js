import React, { useEffect } from "react";
import { getFromStorage, setInStorage } from "@utils/localJSONStorage";
import Nav from "@subcomponents/navigationBars/navBar/Nav";
import config from "@utils/config.json";
import toastDisplay from "../../app/toast";

function Preloader() {
  useEffect(() => {
    //Configuration check function
    try {
      const networkDetails = getFromStorage("networkDetails", []);
      let networkDetailsObject = JSON.parse(networkDetails);
      let pickFirst = networkDetailsObject.networks[0];
      if ((pickFirst.Name == null) || (pickFirst.serviceUrl == null) || (pickFirst.prefix == null) || (pickFirst.networkIdentifier == null) || (pickFirst.explorerURL == null)) {
        toastDisplay("Setting up Phaeton Desktop, Hold up for a moment", "info");
        setInStorage("networkDetails", JSON.stringify(config));
      }
    } catch {
      setInStorage("networkDetails", JSON.stringify(config));
    }
    try {
      const currentNetwork = getFromStorage("currentNetwork", []);
      let currentNetworkObject = JSON.parse(currentNetwork);
      if ((currentNetworkObject.Name == null) || (currentNetworkObject.serviceUrl == null) || (currentNetworkObject.prefix == null) || (currentNetworkObject.networkIdentifier == null)) {
        toastDisplay("Setting up Phaeton Desktop, Hold up for a moment", "info");
        setInStorage("currentNetwork", JSON.stringify(config.networks[0]));
      }
    } catch {
      setInStorage("currentNetwork", JSON.stringify(config.networks[0]));
    }
    //Redirect
    try {
      const encryptedMsg = getFromStorage("PUB_OBJ", []);
      if (encryptedMsg) {
        window.location = "#/login";
      } else {
        window.location = "#/getstarted";
      }
    } catch {
      window.location = "#/getstarted";
    }

  }, []);

  return (
    <>
      <Nav />
      <div className="row m-0 text-center">
        <div className="col-lg-12 h1 text-white">
          Welcome to Phaeton Desktop
        </div>
      </div>
      <div className="row m-0 text-center mt-4">
        <div className="col-lg-12">
          <div
            className="spinner-grow text-danger mr-1"
            style={{ width: "12rem", height: "12rem", paddingTop: "75px" }}
          >
            <span className="text-white h4">...</span>
          </div>
          <div
            className="spinner-grow text-danger"
            style={{ width: "12rem", height: "12rem", paddingTop: "75px" }}
          >
            <span className="text-white h4">Loading...</span>
          </div>
          <div
            className="spinner-grow text-danger ml-1"
            style={{ width: "12rem", height: "12rem", paddingTop: "75px" }}
          >
            <span className="text-white h4">...</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Preloader;
