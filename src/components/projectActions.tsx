import { Action, open, showToast, Toast } from "@raycast/api";
import { ProjectActionsProps } from "../types";
import getAPIAccess from "../utils/apiAccess";

export default function ProjectActions({ project, isRestrictedUser, isEnterprise }: ProjectActionsProps) {
  const { appURL } = getAPIAccess();
  const urlProjectBase = `${appURL}/projects/${project.id}`;

  const handleOpenDataPage = () => {
    if (!project.is_published && isRestrictedUser) {
      showToast(Toast.Style.Failure, "This project needs to be published for you to access.");
      return;
    }

    const url = isRestrictedUser ? urlProjectBase : `${urlProjectBase}/data`;
    open(url);
  };

  return (
    <>
      <Action title="Data Manager" icon={"data-manager.svg"} onAction={handleOpenDataPage} />
      {isEnterprise && !isRestrictedUser && (
        <>
          <Action.OpenInBrowser
            title="Dashboard"
            icon={"dashboard.svg"}
            url={`${appURL}/projects/${project.id}/dashboard`}
          />
          <Action.OpenInBrowser title="Members" icon={"members.svg"} url={`${appURL}/projects/${project.id}/members`} />
        </>
      )}
      {!isRestrictedUser && (
        <Action.OpenInBrowser title="Settings" icon={"settings.svg"} url={`${urlProjectBase}/settings`} />
      )}
    </>
  );
}
