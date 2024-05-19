import { open, showHUD } from "@raycast/api";
import getAPIAccess from "./utils/apiAccess";

export default async function Command() {
  try {
    const { appURL } = getAPIAccess();

    if (appURL) {
      await open(appURL);
      await showHUD(`Opening: ${appURL}`);
    } else {
      await showHUD("No URL configured.");
    }
  } catch (error) {
    console.error("Failed to open URL:", error);
    await showHUD("Failed to open URL.");
  }
}
