import { MODULE_ASSETS_NAME_ID_MAP, moduleAssetSchemas } from "@constants";
import { getSchemas } from "@utils/helpers";

const getModuleAssetSenderLabel = (str) => ({
  [MODULE_ASSETS_NAME_ID_MAP.transfer]: "Sender",
  [MODULE_ASSETS_NAME_ID_MAP.reclaimPHAE]: "Sender",
  [MODULE_ASSETS_NAME_ID_MAP.unlockToken]: "Sender",
  [MODULE_ASSETS_NAME_ID_MAP.voteDelegate]: "Voter",
  [MODULE_ASSETS_NAME_ID_MAP.registerDelegate]: "Account nickname",
  [MODULE_ASSETS_NAME_ID_MAP.registerMultisignatureGroup]: "Registrant",
});

const getModuleAssetTitle = (str) => {
  var type = "";
  if (str == [MODULE_ASSETS_NAME_ID_MAP.transfer]) type = ["Send", "fas fa-exchange-alt pl-1"];
  if (str == [MODULE_ASSETS_NAME_ID_MAP.reclaimPHAE]) type = ["Reclaim"];
  if (str == [MODULE_ASSETS_NAME_ID_MAP.unlockToken]) type = ["Unlock", "fas fa-unlock-alt"];
  if (str == [MODULE_ASSETS_NAME_ID_MAP.voteDelegate]) type = ["Vote", "fas fa-user-check pl-1"];
  if (str == [MODULE_ASSETS_NAME_ID_MAP.registerDelegate]) type = ["Register Delegate", "fas fa-user-plus pl-1"];
  if (str == [MODULE_ASSETS_NAME_ID_MAP.registerMultisignatureGroup]) type = ["Register multisignature group"];
  return type;
};

const retrieveSchemas = async ({ serviceUrl }) => {
  const response = await getSchemas({ baseUrl: serviceUrl });
  response.data.forEach((data) => {
    moduleAssetSchemas[data.moduleAssetId] = data.schema;
  });
};

const splitModuleAndAssetIds = (moduleAssetId) => {
  const [moduleID, assetID] = moduleAssetId?.split(":");
  return [Number(moduleID), Number(assetID)];
};

const joinModuleAndAssetIds = ({ moduleID, assetID }) =>
  [moduleID, assetID].join(":");

export {
  retrieveSchemas,
  getModuleAssetTitle,
  joinModuleAndAssetIds,
  splitModuleAndAssetIds,
  getModuleAssetSenderLabel,
};
