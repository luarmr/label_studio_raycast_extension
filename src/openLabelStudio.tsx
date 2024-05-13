import { getPreferenceValues, open, showHUD } from "@raycast/api";

interface Preferences {
  url: string;
}

export default async function Command() {
  try {
    const preferences = getPreferenceValues<Preferences>();
    const { url } = preferences;

    if (url) {
      await open(url);
      await showHUD(`Opening: ${url}`);
    } else {
      await showHUD("No URL configured.");
    }
  } catch (error) {
    console.error("Failed to open URL:", error);
    await showHUD("Failed to open URL.");
  }
}
