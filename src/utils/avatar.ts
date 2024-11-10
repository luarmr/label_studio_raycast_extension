import fetch from "node-fetch";
import { UserDetails } from "../types";

const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName?.charAt(0) ?? ""}${lastName?.charAt(0) ?? ""}`.toUpperCase();
};

const createInitialsIcon = ({ id, first_name, last_name, email }: UserDetails): string => {
  const initials = first_name || last_name ? getInitials(first_name, last_name) : email?.charAt(0).toUpperCase() || "";
  const { backgroundColor, textColor } = getColorPairFromId(id);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="20" fill="${backgroundColor}"/>
      <text x="20" y="30" dy=".35em" font-size="16" text-anchor="middle" fill="${textColor}" font-family="Arial, sans-serif">${initials}</text>
    </svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
};

function getColorPairFromId(id: number) {
  // Todo: consider the user theme.
  const colorPairs = [
    { background: "FFB3BA", text: "000000" },
    { background: "FFDFBA", text: "000000" },
    { background: "FFFFBA", text: "000000" },
    { background: "BAFFC9", text: "000000" },
    { background: "BAE1FF", text: "000000" },
    { background: "FFC3A0", text: "000000" },
    { background: "FFABAB", text: "000000" },
    { background: "FFDAAB", text: "000000" },
    { background: "DDFFAB", text: "000000" },
    { background: "ABE4FF", text: "000000" },
    { background: "FFACAC", text: "000000" },
    { background: "FFD6AC", text: "000000" },
    { background: "D4FFAC", text: "000000" },
    { background: "ACFFEC", text: "000000" },
    { background: "ACD1FF", text: "000000" },
    { background: "FFE0AC", text: "000000" },
    { background: "FF9A9E", text: "000000" },
    { background: "FFB7B2", text: "000000" },
    { background: "FFDAC1", text: "000000" },
    { background: "E2F0CB", text: "000000" },
  ];

  function hashCode(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return hash;
  }

  const hash = hashCode(id.toString());
  const colorPair = colorPairs[Math.abs(hash) % colorPairs.length];

  return {
    backgroundColor: `#${colorPair.background}`,
    textColor: `#${colorPair.text}`,
  };
}

const createColorIcon = (color: string): string => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
      <rect width="16" height="16" fill="${color}" />
    </svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

const fetchAvatarUrl = async (url: string, apiToken: string): Promise<string> => {
  const response = await fetch(url, {
    headers: { Authorization: `Token ${apiToken}` },
  });
  const buffer = await response.arrayBuffer();
  const base64Flag = "data:image/jpeg;base64,";
  const imageStr = arrayBufferToBase64(buffer);
  return base64Flag + imageStr;
};

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return Buffer.from(binary, "binary").toString("base64");
};

const ensureDomainInUrl = (url: string, defaultDomain: string = "http://domain.com"): string => {
  // If the URL doesn't start with 'http://' or 'https://', prepend the default domain
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    // Ensure proper slash handling between defaultDomain and url
    if (url.startsWith("/")) {
      return defaultDomain + url;
    } else {
      return `${defaultDomain}/${url}`;
    }
  }

  // If the URL already has a protocol, return it as is
  return url;
};

export { createInitialsIcon, createColorIcon, ensureDomainInUrl, formatDate, fetchAvatarUrl };
