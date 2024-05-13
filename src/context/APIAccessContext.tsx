import React, { createContext, useContext, ReactNode } from "react";
import { getPreferenceValues } from "@raycast/api";
import { Preferences } from "../types";

const APIAccessContext = createContext<Preferences | undefined>(undefined);

export const APIAccessProvider = ({ children }: { children: ReactNode }) => {
  const { apiToken, appURL: url } = getPreferenceValues<Preferences>();
  const appURL = url.endsWith("/") ? url.slice(0, -1) : url;
  return <APIAccessContext.Provider value={{ apiToken, appURL }}>{children}</APIAccessContext.Provider>;
};

export const useAPIAccess = () => {
  const context = useContext(APIAccessContext);
  if (!context) {
    throw new Error("useAPIAccess must be used within a APIAccessProvider");
  }
  return context;
};
