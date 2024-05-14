import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { showToast, Toast } from "@raycast/api";
import fetch from "node-fetch";
import { User, VersionApiResponse, UserContextType } from "../types";
import { useAPIAccess } from "./APIAccessContext";

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isRestrictedUser, setIsRestrictedUser] = useState(false);
  const [isEnterprise, setIsEnterprise] = useState(false);
  const { apiToken, appURL } = useAPIAccess();

  useEffect(() => {
    if (user) {
      setIsRestrictedUser(
        !user.org_membership
          .filter((m) => m.organization_id === user.active_organization)
          .filter((m) => m.active)
          .some((m) => m.role !== "AN" && m.role !== "RE"),
      );
    }
  }, [user, isEnterprise]);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch(`${appURL}/api/current-user/whoami`, {
        headers: { Authorization: `Token ${apiToken}` },
      });
      const userData = (await response.json()) as User;
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      showToast(Toast.Style.Failure, "Failed to fetch user information.");
    }
  };

  const checkIsEnterprise = async () => {
    try {
      const response = await fetch(`${appURL}/api/version`, {
        headers: { Authorization: `Token ${apiToken}` },
      });
      const data = (await response.json()) as VersionApiResponse;
      setIsEnterprise(!!data["label-studio-enterprise-backend"]);
    } catch (error) {
      console.error("Failed to fetch backend version:", error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
    checkIsEnterprise();
  }, [appURL, apiToken]);

  return <UserContext.Provider value={{ user, isEnterprise, isRestrictedUser }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
