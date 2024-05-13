import { getPreferenceValues, open, showHUD } from "@raycast/api";
import { Preferences } from "./types";

export default async function Command() {
  try {
    const preferences = getPreferenceValues<Preferences>();
    const { appURL } = preferences;

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
