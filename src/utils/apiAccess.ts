import { getPreferenceValues } from "@raycast/api";
import { Preferences } from "../types";

const getAPIAccess = () => {
  const { apiToken, appURL: url } = getPreferenceValues<Preferences>();
  const appURL = url.endsWith("/") ? url.slice(0, -1) : url;
  return { apiToken, appURL };
};

export default getAPIAccess;
